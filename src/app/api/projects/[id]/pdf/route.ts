import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateBlueprintPDF } from "@/lib/pdf/generate";

// Force Node runtime — @react-pdf/renderer requires Node (not Edge)
export const runtime = "nodejs";

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

  const project = await prisma.project.findFirst({ where: { id, userId: user.id } });
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const blueprint = await prisma.blueprint.findUnique({
    where: { projectId: project.id },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  if (!blueprint || blueprint.sections.length === 0) {
    return NextResponse.json({ error: "Blueprint not found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({ mode: searchParams.get("mode") || "complete" });
  const mode = parsed.success ? parsed.data.mode : "complete";

  try {
    const buffer = await generateBlueprintPDF({
      projectTitle: project.title,
      sections: blueprint.sections,
      mode,
    });

    const filename = `${project.title.replace(/[^a-z0-9]/gi, "_")}-${mode}.pdf`;

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  } catch (e) {
    console.error("[pdf] error", e);
    const message = e instanceof Error ? e.message : "Failed to generate PDF";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
