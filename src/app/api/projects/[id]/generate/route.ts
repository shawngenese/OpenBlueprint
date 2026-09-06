import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateBlueprint } from "@/lib/ai/blueprint";
import { saveBlueprint } from "@/lib/persistence/blueprint";
import { checkAndRecordGeneration, getRateLimitHeaders } from "@/lib/rateLimit";

const generateBodySchema = z.object({
  // Optional clarifier Q&A to enrich generation
  clarifierQA: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1).max(1000),
      })
    )
    .max(5)
    .optional(),
  answers: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1).max(1000),
      })
    )
    .max(5)
    .optional(),
});

export async function POST(
  req: NextRequest,
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

  const rate = await checkAndRecordGeneration(user.id, { projectId: project.id, type: "generate" });
  if (!rate.allowed) {
    return NextResponse.json(
      { error: `Rate limit exceeded: max 2 generations per day. Try again after ${rate.resetAt.toLocaleString()}.` },
      { status: 429, headers: getRateLimitHeaders(rate.remaining, rate.resetAt) }
    );
  }

  let body: z.infer<typeof generateBodySchema> = {};
  try {
    const json = await req.json().catch(() => ({}));
    const parsed = generateBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    body = parsed.data;
  } catch {
    body = {};
  }

  const clarifierQA = body.clarifierQA ?? body.answers;

  try {
    const blueprintData = await generateBlueprint({
      title: project.title,
      rawIdea: project.rawIdea,
      clarifierQA,
    });

    const blueprint = await saveBlueprint(project.id, blueprintData);

    const headers = getRateLimitHeaders(rate.remaining, rate.resetAt);
    return NextResponse.json({ blueprint, sections: blueprint?.sections }, { headers });
  } catch (e) {
    console.error("[generate] error", e);
    const message = e instanceof Error ? e.message : "Failed to generate blueprint";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
