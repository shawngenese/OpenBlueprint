import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getSectionsByMode } from "@/lib/persistence/blueprint";
import { OUTPUT_MODES } from "@/lib/ai/config";

const querySchema = z.object({
  mode: z.enum(["executive", "technical", "complete"]).default("complete"),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const project = await prisma.project.findFirst({ where: { id, userId: user.id }, select: { id: true, title: true } });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({ mode: searchParams.get("mode") || "complete" });
  // Default to complete if invalid is passed
  const mode = parsed.success ? parsed.data.mode : "complete";

  const blueprint = await prisma.blueprint.findUnique({
    where: { projectId: project.id },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!blueprint) return NextResponse.json({ error: "Blueprint not found" }, { status: 404 });

  // Filter existing sections locally — NEVER trigger LLM re-call (AGENTS.md Rule 4)
  // Reuse helper to guarantee same logic as client tabs
  const sections = await getSectionsByMode(project.id, mode);

  return NextResponse.json({
    project,
    blueprint: { id: blueprint.id, projectId: blueprint.projectId },
    mode,
    count: sections.length,
    sections,
    // Debug: show allowed keys per mode
    allowedKeys: OUTPUT_MODES[mode],
  });
}
