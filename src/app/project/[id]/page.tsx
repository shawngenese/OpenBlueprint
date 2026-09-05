import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "cn";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ProjectActions } from "@/components/project/project-actions";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect(`/login?callbackUrl=/project/${id}`);

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true } });
  if (!user) notFound();

  const project = await prisma.project.findFirst({
    where: { id, userId: user.id },
    include: { blueprint: { select: { id: true } } },
  });
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black">
      <main className="mx-auto max-w-3xl p-6 sm:p-8 lg:p-10 space-y-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to dashboard
        </Link>

        <Card>
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="rounded-full capitalize">
                {project.status}
              </Badge>
              <span className="text-xs text-muted-foreground">{new Date(project.updatedAt).toLocaleString()}</span>
            </div>
            <CardTitle className="text-2xl tracking-tight">{project.title}</CardTitle>
            <CardDescription className="whitespace-pre-wrap leading-6 text-foreground/80 bg-zinc-50 border rounded-lg p-4">
              {project.rawIdea}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-lg border bg-white p-4 flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 text-sm font-medium">
                <Sparkles className="size-4" /> Next steps
              </div>
              <p className="text-sm text-muted-foreground leading-5">
                {project.blueprint
                  ? "Blueprint already generated. Open it to view Executive / Technical / Complete modes."
                  : "Generate your 20-section blueprint with Gemini gemini-2.0-flash (free). Optionally clarify first for a sharper spec."}
              </p>
              <ProjectActions projectId={project.id} hasBlueprint={!!project.blueprint} />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
