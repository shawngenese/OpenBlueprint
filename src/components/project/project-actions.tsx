'use client';

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import { Sparkles, Loader2, ArrowRight, MessageCircleQuestion } from "lucide-react";

export function ProjectActions({ projectId, hasBlueprint }: { projectId: string; hasBlueprint: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"idle" | "clarify" | "generate">("idle");
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Array<{ question: string; rationale?: string }>>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleClarify = () => {
    setError(null);
    setMode("clarify");
    startTransition(async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/clarify`, { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Clarify failed");
        setQuestions(data.questions || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Clarify failed");
        setMode("idle");
      }
    });
  };

  const handleGenerate = () => {
    setError(null);
    setMode("generate");
    const clarifierQA =
      questions.length > 0
        ? questions.map((q, i) => ({ question: q.question, answer: answers[i] || "" })).filter((qa) => qa.answer.trim().length > 0)
        : undefined;

    startTransition(async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clarifierQA ? { clarifierQA } : {}),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Generate failed");
        router.push(`/project/${projectId}/blueprint`);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Generate failed");
        setMode("idle");
      }
    });
  };

  if (hasBlueprint) {
    return (
      <Link href={`/project/${projectId}/blueprint`} className={cn(buttonVariants({}), "rounded-full w-fit gap-1.5")}>
        Open blueprint <ArrowRight className="size-4" />
      </Link>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleClarify} disabled={isPending} variant="secondary" className="rounded-full gap-1.5">
          {isPending && mode === "clarify" ? <Loader2 className="size-4 animate-spin" /> : <MessageCircleQuestion className="size-4" />}
          Clarify (max 5)
        </Button>
        <Button onClick={handleGenerate} disabled={isPending} className="rounded-full gap-1.5">
          {isPending && mode === "generate" ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          Generate blueprint (20 sections)
        </Button>
      </div>

      {questions.length > 0 && (
        <div className="rounded-lg border bg-zinc-50 p-4 space-y-3">
          <p className="text-sm font-medium inline-flex items-center gap-1.5">
            <MessageCircleQuestion className="size-4" /> Answer clarifiers (optional) — improves blueprint
          </p>
          {questions.map((q, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">{i + 1}. {q.question}</label>
              {q.rationale && <span className="text-xs text-muted-foreground">{q.rationale}</span>}
              <input
                className="flex h-9 w-full rounded-md border bg-white px-3 py-1 text-sm"
                placeholder="Your answer..."
                value={answers[i] || ""}
                onChange={(e) => setAnswers((p) => ({ ...p, [i]: e.target.value }))}
              />
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Leave blank to skip — Generate will still run. Gemini free `gemini-2.0-flash` via `GOOGLE_GENERATIVE_AI_API_KEY`.</p>
        </div>
      )}

      {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}
      <p className="text-xs text-muted-foreground">
        Rate limit: 5 generations/day per user. Tabs filter locally, never re-call LLM.
      </p>
    </div>
  );
}
