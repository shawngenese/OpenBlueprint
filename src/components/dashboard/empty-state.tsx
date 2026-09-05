import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Plus, Sparkles } from "lucide-react";
import { cn } from "cn";

export function EmptyState() {
  return (
    <Card className="border-dashed bg-zinc-50/50 dark:bg-zinc-900/20">
      <CardContent className="flex flex-col items-center justify-center gap-6 p-10 sm:p-14 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-white border shadow-sm">
          <Lightbulb className="size-7 text-zinc-900" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="font-heading text-xl font-semibold tracking-tight">No projects yet</h3>
          <p className="text-sm leading-6 text-muted-foreground">
            Turn a rough idea into a structured 20-section blueprint. Start with a single sentence — the AI will ask up to 5 clarifying questions, then generate your full technical spec.
          </p>
        </div>
        <Link href="/project/new" className={cn(buttonVariants({ size: "lg" }), "rounded-full gap-2 px-6")}>
          <Plus className="size-4" />
          Create your first project
        </Link>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="size-3.5" /> Powered by gpt-4o-mini
        </p>
      </CardContent>
    </Card>
  );
}
