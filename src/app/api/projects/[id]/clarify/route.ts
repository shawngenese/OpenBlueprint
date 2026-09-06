import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateClarifierQuestions } from "@/lib/ai/clarifier";
import { checkAndRecordGeneration, getRateLimitHeaders } from "@/lib/rateLimit";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const project = await prisma.project.findFirst({ where: { id, userId: user.id } });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY && !process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GOOGLE_GENERATIVE_AI_API_KEY (Gemini) not configured" }, { status: 500 });
  }

  // Atomic rate limit check — counts Clarify toward the same 2/day quota
  const rate = await checkAndRecordGeneration(user.id, { projectId: project.id, type: "clarify" });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Rate limit exceeded: max 2 clarifications/generations per day. Try again after ${rate.resetAt.toLocaleString()}.` },
      { status: 429, headers: getRateLimitHeaders(rate.remaining, rate.resetAt) }
    );
  }

  try {
    const result = await generateClarifierQuestions(project.rawIdea, { projectTitle: project.title });

    await prisma.project.update({
      where: { id: project.id },
      data: { status: "questioning" },
    });

    return NextResponse.json(result);
  } catch (e) {
    console.error("[clarify] error", e);
    const message = e instanceof Error ? e.message : "Failed to generate clarifier questions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
