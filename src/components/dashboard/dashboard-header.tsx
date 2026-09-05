import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Plus, LayoutDashboard } from "lucide-react";

export function DashboardHeader({ projectsCount }: { projectsCount: number }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-muted-foreground">
            <LayoutDashboard className="size-3.5" /> Workspace
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground max-w-xl">
            {projectsCount === 0
              ? "Create a project to generate a structured blueprint."
              : `${projectsCount} project${projectsCount === 1 ? "" : "s"} • Manage, refine, and export your blueprints.`}
          </p>
        </div>
        <Link href="/project/new" className={cn(buttonVariants({ size: "lg" }), "rounded-full gap-2 self-start sm:self-auto shadow-sm")}>
          <Plus className="size-4" />
          New Project
        </Link>
      </div>
      <div className="h-px bg-border" />
    </div>
  );
}
