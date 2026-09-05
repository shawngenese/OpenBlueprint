'use client';

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createProject } from "@/lib/actions/projects";
import { createProjectSchema } from "@/lib/validators";
import { Loader2, Sparkles, Lightbulb, ArrowRight } from "lucide-react";
import { cn } from "cn";

export function NewIdeaForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [rawIdea, setRawIdea] = useState("");
  const [errors, setErrors] = useState<{ title?: string[]; rawIdea?: string[]; _form?: string }>({});
  const [touched, setTouched] = useState({ title: false, rawIdea: false });

  const titleLen = title.length;
  const ideaLen = rawIdea.length;
  const ideaRemaining = 5000 - ideaLen;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = createProjectSchema.safeParse({ title: title.trim(), rawIdea: rawIdea.trim() });
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors as { title?: string[]; rawIdea?: string[] };
      setErrors(fieldErrors);
      setTouched({ title: true, rawIdea: true });
      return;
    }

    setErrors({});

    const fd = new FormData();
    fd.set("title", parsed.data.title);
    fd.set("rawIdea", parsed.data.rawIdea);

    startTransition(async () => {
      const res = (await createProject(fd)) as unknown as { success?: boolean; projectId?: string; error?: unknown };
      if (res?.success && res.projectId) {
        router.push(`/project/${res.projectId}`);
        return;
      }
      if (res && "error" in res) {
        const err = (res as { error: unknown }).error as unknown;
        if (typeof err === "string") {
          setErrors({ _form: err });
        } else if (err && typeof err === "object") {
          setErrors(err as typeof errors);
        } else {
          setErrors({ _form: "Failed to create project" });
        }
      } else {
        setErrors({ _form: "Failed to create project" });
      }
    });
  };

  const showTitleError = touched.title && errors.title?.[0];
  const showIdeaError = touched.rawIdea && errors.rawIdea?.[0];

  return (
    <Card className="border-zinc-200 shadow-sm">
      <CardHeader className="p-6 pb-4 gap-2">
        <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-muted-foreground">
          <Sparkles className="size-3.5" /> New Blueprint
        </div>
        <CardTitle className="text-xl tracking-tight">Describe your idea</CardTitle>
        <CardDescription className="text-sm leading-5">
          Be rough — the AI will ask up to 5 clarifying questions, then generate a 20-section technical blueprint.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="title" className={cn(showTitleError && "text-destructive")}>
                Project title
              </Label>
              <span className="text-xs text-muted-foreground">{titleLen}/100</span>
            </div>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Freelance Invoice Tracker"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, title: true }))}
              maxLength={100}
              aria-invalid={!!showTitleError}
              className={cn(showTitleError && "border-destructive focus-visible:ring-destructive/20")}
              disabled={isPending}
            />
            {showTitleError ? (
              <p className="text-xs text-destructive">{showTitleError}</p>
            ) : (
              <p className="text-xs text-muted-foreground">A short, memorable name.</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="rawIdea" className={cn(showIdeaError && "text-destructive")}>
                Raw idea
              </Label>
              <span className={cn("text-xs", ideaRemaining < 100 ? "text-amber-600" : "text-muted-foreground")}>
                {ideaLen} / 5000
              </span>
            </div>
            <Textarea
              id="rawIdea"
              name="rawIdea"
              placeholder="Example: An app for freelance designers to track proposals, invoices, and payments. It should handle client approvals, send reminders, and show a dashboard of cash flow. I want it to work on mobile too..."
              value={rawIdea}
              onChange={(e) => setRawIdea(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, rawIdea: true }))}
              maxLength={5000}
              rows={7}
              aria-invalid={!!showIdeaError}
              className={cn("min-h-[140px] resize-y", showIdeaError && "border-destructive focus-visible:ring-destructive/20")}
              disabled={isPending}
            />
            {showIdeaError ? (
              <p className="text-xs text-destructive">{showIdeaError}</p>
            ) : (
              <div className="flex flex-col gap-2 rounded-lg border bg-zinc-50 p-3 text-xs leading-5 text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <Lightbulb className="size-3.5" /> Tip — include:
                </span>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Who it&apos;s for and what problem it solves</li>
                  <li>Core features you imagine (e.g., “client approvals, reminders”)</li>
                  <li>Any constraints (platform, integrations, budget)</li>
                </ul>
              </div>
            )}
          </div>

          {errors._form && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errors._form}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" disabled={isPending} className="rounded-full gap-2 sm:ml-auto px-6">
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  Generate blueprint <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Next step: answer up to 5 clarifying questions — no re-generation when toggling Executive/Technical views.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
