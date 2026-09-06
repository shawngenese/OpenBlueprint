import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { regenerateSection } from "@/lib/ai/regenerate";
import type { BlueprintSectionKey } from "@/lib/ai/schemas/blueprint";
import { checkAndRecordGeneration, getRateLimitHeaders } from "@/lib/rateLimit";

const bodySchema = z.object({
  instruction: z.string().max(1000).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const section = await prisma.section.findUnique({
    where: { id },
    include: { blueprint: { include: { project: true, sections: true } } },
  });
  if (!section || section.blueprint.project.userId !== user.id) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && !process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GOOGLE_GENERATIVE_AI_API_KEY (Gemini) not configured" }, { status: 500 });
  }

  const rate = await checkAndRecordGeneration(user.id, {
    projectId: section.blueprint.projectId,
    type: "regenerate",
    key: section.key,
  });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Rate limit exceeded: max 2 generations per day. Try again after ${rate.resetAt.toLocaleString()}.` },
      { status: 429, headers: getRateLimitHeaders(rate.remaining, rate.resetAt) }
    );
  }

  let instruction: string | undefined;
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    instruction = parsed.data.instruction;
  } catch {
    instruction = undefined;
  }

  try {
    const newContent = await regenerateSection({
      key: section.key as BlueprintSectionKey,
      title: section.title,
      currentContent: section.content,
      projectTitle: section.blueprint.project.title,
      rawIdea: section.blueprint.project.rawIdea,
      otherSections: section.blueprint.sections
        .filter((s) => s.id !== section.id)
        .map((s) => ({ key: s.key, title: s.title, content: s.content })),
      instruction,
    });

    // Isolated update — ONLY targeted Section.key (AGENTS.md: Architectural Rule 3)
    const updated = await prisma.section.update({
      where: { id: section.id },
      data: { content: newContent },
    });

    const headers = getRateLimitHeaders(rate.remaining, rate.resetAt);
    return NextResponse.json(updated, { headers });
  } catch (e) {
    console.error("[regenerate] error", e);
    const message = e instanceof Error ? e.message : "Failed to regenerate section";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
