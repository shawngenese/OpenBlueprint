'use client';

import Link from "next/link";
import { useTransition } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { FileText, Trash2, Clock, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { deleteProject } from "@/lib/actions/projects";
import { cn } from "cn";

type Project = {
  id: string;
  title: string;
  rawIdea: string;
  status: string;
  updatedAt: Date;
  blueprint: { id: string } | null;
};

const statusStyles: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-700 border-zinc-200",
  questioning: "bg-amber-100 text-amber-800 border-amber-200",
  generated: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export function ProjectCard({ project }: { project: Project }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteProject(project.id);
    });
  };

  return (
    <Card className="group flex flex-col justify-between p-6 gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border-zinc-200 dark:border-zinc-800">
      <CardHeader className="p-0 gap-2">
        <div className="flex items-start justify-between gap-3">
          <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-xs font-medium border ${statusStyles[project.status] || statusStyles.draft}`}>
            {project.status}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <CardTitle className="text-[17px] leading-tight tracking-tight line-clamp-2 group-hover:text-primary transition-colors">
          {project.title}
        </CardTitle>
        <CardDescription className="line-clamp-3 text-[13px] leading-5">
          {project.rawIdea}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {project.blueprint ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-1">
              <Sparkles className="size-3" /> Blueprint ready
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-zinc-50 border rounded-full px-2 py-1">
              <FileText className="size-3" /> Draft
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-0 pt-2 pb-6 flex items-center gap-2 bg-transparent border-0">
        <Link
          href={project.blueprint ? `/project/${project.id}/blueprint` : `/project/${project.id}`}
          className={cn(buttonVariants({ size: "sm" }), "flex-1 gap-1.5 rounded-full")}
        >
          {project.blueprint ? "Open blueprint" : "Continue"}
          <ArrowRight className="size-3.5" />
        </Link>

        <Dialog>
          <DialogTrigger className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "rounded-full shrink-0")} aria-label="Delete project">
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete project?</DialogTitle>
              <DialogDescription>
                This will permanently delete <span className="font-medium text-foreground">{project.title}</span> and its blueprint. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose className={cn(buttonVariants({ variant: "outline" }))}>Cancel</DialogClose>
              <Button variant="destructive" onClick={handleDelete} disabled={isPending} className="gap-2">
                {isPending && <Loader2 className="size-4 animate-spin" />}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
