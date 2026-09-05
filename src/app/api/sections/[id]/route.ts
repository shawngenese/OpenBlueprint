import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const patchSchema = z.object({
  content: z.string().min(1).max(20000),
  title: z.string().min(1).max(200).optional(),
});

export async function PATCH(
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
    include: { blueprint: { include: { project: true } } },
  });
  if (!section || section.blueprint.project.userId !== user.id) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.section.update({
    where: { id },
    data: {
      content: parsed.data.content,
      ...(parsed.data.title ? { title: parsed.data.title } : {}),
    },
  });

  return NextResponse.json(updated);
}

// For completeness, allow GET single section (filtered locally, but single fetch)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const section = await prisma.section.findUnique({
    where: { id },
    include: { blueprint: { include: { project: true } } },
  });
  if (!section || section.blueprint.project.userId !== user.id) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  return NextResponse.json(section);
}
