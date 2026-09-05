import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProjectGrid } from "@/components/dashboard/project-grid";
import { EmptyState } from "@/components/dashboard/empty-state";

export const metadata = {
  title: "Dashboard — AI Project Consultant",
};

export default async function DashboardPage() {
  const session = await auth();

  // Middleware already guards, but server double-check for safety
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl p-6 sm:p-8 space-y-6">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          User record not found. Please sign out and sign in again.
        </div>
      </div>
    );
  }

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: { blueprint: { select: { id: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black">
      <main className="mx-auto max-w-6xl p-6 sm:p-8 lg:p-10 space-y-8">
        <DashboardHeader projectsCount={projects.length} />

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium tracking-widest uppercase text-muted-foreground">Recent projects</h2>
              <span className="text-xs text-muted-foreground">{projects.length} total</span>
            </div>
            <ProjectGrid projects={projects} />
          </section>
        )}
      </main>
    </div>
  );
}
