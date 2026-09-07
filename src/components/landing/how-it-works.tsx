import Link from "next/link";
import { Lightbulb, MessageCircleQuestion, Layers, ArrowRight } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";

// Server component — no 'use client' (AGENTS.md Code Style)
// Hairline sequence: raw idea → ≤5 clarifier (Zod max 5) → 20 validated Sections (Rule 2) + 1s debounce
const STEPS = [
  {
    n: "01",
    icon: Lightbulb,
    title: "Drop a raw idea",
    desc: "Title + rawIdea in /project/new. Zod: title 2–100ch, rawIdea 10–5000ch. Stored as Project (status: draft). Rough is fine.",
    meta: "Input • /project/new",
    href: "/project/new",
    cta: "Start a project",
  },
  {
    n: "02",
    icon: MessageCircleQuestion,
    title: "Answer ≤5 questions",
    desc: "Call 1 Clarifier asks at most 5 high-impact questions (Zod max 5). No LLM re-call when you later filter views.",
    meta: "Call 1 • Clarifier",
    href: "/project/new",
    cta: "Why 5 max?",
  },
  {
    n: "03",
    icon: Layers,
    title: "Generate 20 sections",
    desc: "Call 2 Generator validates against 20-section Zod (blueprintSchema) and persists as Section records → Blueprint (not chat blobs). Inline edit with 1s debounce, per-section regeneration via Section.key only.",
    meta: "Call 2 • 20 Sections",
    href: "#sections",
    cta: "See all 20",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="border-t border-border">
      <div className="py-10 sm:py-12">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden /> How it works
            </div>
            <h2 id="how-it-works-heading" className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
              Raw idea → 5 questions → 20 sections
            </h2>
            <p className="mt-2 max-w-[60ch] text-sm leading-6 text-muted-foreground">
              Monolith first — no queues. Data structure is{" "}
              <span className="font-medium text-foreground">Section records</span> mapped to{" "}
              <span className="font-medium text-foreground">Blueprint</span> (
              <span className="font-mono text-xs">schema.prisma:131–144</span>), not blobs. Views filter locally, never
              re-call the LLM (
              <span className="font-mono text-xs">AGENTS.md Rules 3–4</span>).
            </p>
          </div>
          <Link
            href="/project/new"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden sm:inline-flex rounded-full h-9")}
          >
            Try it <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 overflow-hidden rounded-2xl border border-border bg-card">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="relative flex flex-col gap-4 p-6 border-t md:border-t-0 md:border-l first:border-t-0 first:md:border-l-0 border-border"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-widest text-muted-foreground">{s.n}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  <s.icon className="size-3.5" aria-hidden />
                  {s.meta}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <s.icon className="size-4" aria-hidden />
                </span>
                <h3 className="font-medium tracking-tight">{s.title}</h3>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{s.desc}</p>
              <div className="mt-auto pt-2">
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full px-1 -ml-1"
                >
                  {s.cta} <ArrowRight className="size-3" aria-hidden />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
          Per-section regeneration updates only{" "}
          <span className="font-mono text-foreground">Section.key</span> — isolated, type-safe via Zod. Editing
          auto-saves after <span className="font-medium text-foreground">1s debounce</span> (Phase 3).
        </p>
      </div>
    </section>
  );
}
