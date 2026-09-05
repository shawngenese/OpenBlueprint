import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ModeTabs } from "@/components/blueprint/mode-tabs";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { ArrowLeft, Sparkles, FileDown } from "lucide-react";

export default async function BlueprintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user?.email) redirect(`/login?callbackUrl=/project/${id}/blueprint`);

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) notFound();

  const project = await prisma.project.findFirst({
    where: { id, userId: user.id },
    select: { id: true, title: true, status: true },
  });
  if (!project) notFound();

  const blueprint = await prisma.blueprint.findUnique({
    where: { projectId: project.id },
    include: { sections: { orderBy: { order: "asc" } } },
  });

  if (!blueprint) {
    return (
      <div className="min-h-screen bg-zinc-50/50 dark:bg-black">
        <main className="mx-auto max-w-6xl p-6 sm:p-8 lg:p-10 space-y-6">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Dashboard
          </Link>
          <Card className="border-dashed">
            <CardContent className="p-8 text-center space-y-4">
              <div className="flex justify-center">
                <Sparkles className="size-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">No blueprint yet</h3>
                <p className="text-sm text-muted-foreground">Generate your 20-section blueprint from the project page.</p>
              </div>
              <Link href={`/project/${project.id}`} className={cn(buttonVariants({}), "rounded-full")}>
                Go to project
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black">
      <main className="mx-auto max-w-6xl p-6 sm:p-8 lg:p-10 space-y-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-4" /> Dashboard
            </Link>
            <Link
              href={`/api/projects/${project.id}/pdf`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-full gap-1.5")}
            >
              <FileDown className="size-4" /> Export PDF
            </Link>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground">
              <Sparkles className="size-3.5" /> Blueprint • {project.title}
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight">{project.title}</h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-6">
              Executive vs Technical vs Complete — filtering existing sections locally, never re-calling the LLM. Per-section editing and regeneration coming next.
            </p>
          </div>

          <div className="h-px bg-border" />
        </div>

        <ModeTabs sections={blueprint.sections} />
      </main>
    </div>
  );
}
