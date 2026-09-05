"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createProjectSchema } from "@/lib/validators";

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return { error: "User not found" };

  const raw = {
    title: formData.get("title") as string,
    rawIdea: formData.get("rawIdea") as string,
  };

  const parsed = createProjectSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const project = await prisma.project.create({
    data: {
      title: parsed.data.title,
      rawIdea: parsed.data.rawIdea,
      userId: user.id,
      status: "draft",
    },
  });

  revalidatePath("/dashboard");
  // Return instead of redirect so client component can handle navigation (avoids NEXT_REDIRECT swallow in startTransition)
  return { success: true, projectId: project.id };
}

export async function createProjectFromJson(data: { title: string; rawIdea: string }) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Unauthorized" };

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { error: "User not found" };

  const parsed = createProjectSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.flatten() };

  const project = await prisma.project.create({
    data: {
      title: parsed.data.title,
      rawIdea: parsed.data.rawIdea,
      userId: user.id,
      status: "draft",
    },
  });

  revalidatePath("/dashboard");
  return { success: true, project };
}

export async function deleteProject(projectId: string) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Unauthorized" };

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return { error: "User not found" };

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.id },
  });
  if (!project) return { error: "Project not found" };

  await prisma.project.delete({ where: { id: projectId } });
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getUserProjects() {
  const session = await auth();
  if (!session?.user?.email) return [];

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return [];

  return prisma.project.findMany({
    where: { userId: user.id },
    include: { blueprint: { include: { sections: true } } },
    orderBy: { updatedAt: "desc" },
  });
}
