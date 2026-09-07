import { FilePenLine, RefreshCw, Layers, FileDown, Shield, Blocks } from "lucide-react";

const FEATURES = [
  {
    icon: FilePenLine,
    title: "Inline editing",
    desc: "Markdown with 1s debounce auto-save. Every Section is a record — editable, orderable, exportable.",
    meta: "Phase 3 • Section.key",
  },
  {
    icon: RefreshCw,
    title: "Per-section regeneration",
    desc: "Update only the targeted Section.key via /api/sections/[id]/regenerate. Isolated, type-safe, no blob rewrite.",
    meta: "Rule 3 • Isolated",
  },
  {
    icon: Layers,
    title: "Local view filtering",
    desc: "Executive / Technical / Complete filter existing Section records locally — never re-calls the LLM.",
    meta: "Rule 4 • No LLM",
  },
  {
    icon: FileDown,
    title: "PDF export",
    desc: "Server-rendered @react-pdf/renderer templates for Executive, Technical, and Complete. GET /api/projects/[id]/pdf.",
    meta: "Phase 4 • PDF",
  },
  {
    icon: Shield,
    title: "Guarded workspace",
    desc: "Auth.js middleware protects /dashboard & /project/*. Rate limit 2 generations/day via GenerationLog.",
    meta: "Phase 4–5 • Auth",
  },
  {
    icon: Blocks,
    title: "20-section Zod schema",
    desc: "Call 2 Generator validates against 20-section blueprintSchema. Canonical order persists as Section records.",
    meta: "Zod • 20 keys",
  },
] as const;

export function FeatureBreakdown() {
  return (
    <section id="features" aria-labelledby="features-heading" className="border-t border-border">
      <div className="py-10 sm:py-12">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden /> Features
          </div>
          <h2 id="features-heading" className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Editable, isolated, and exportable
          </h2>
          <p className="max-w-[60ch] text-sm leading-6 text-muted-foreground">
            Built per <span className="font-medium text-foreground">AGENTS.md</span> — Monolith First, Section records not blobs,
            max 5 clarifier questions, isolated regeneration.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-sm transition-all duration-150"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="size-4" aria-hidden />
                </span>
                <span className="rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  {f.meta}
                </span>
              </div>
              <h3 className="mt-4 font-medium tracking-tight">{f.title}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
