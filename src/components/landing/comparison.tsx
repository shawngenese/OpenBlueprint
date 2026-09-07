import { Check, X } from "lucide-react";

const ROWS = [
  {
    label: "Storage",
    ours: "Section records → Blueprint (Section.key, order, FK). Queryable, versionable.",
    theirs: "Unformatted chat blob — unqueryable, lossy.",
  },
  {
    label: "Editing",
    ours: "Inline markdown, 1s debounce, per-Section save. Immediate feedback.",
    theirs: "Copy/paste from chat — no structure.",
  },
  {
    label: "Regeneration",
    ours: "Isolated /api/sections/[id]/regenerate updates only Section.key.",
    theirs: "Re-generate entire doc — expensive, inconsistent.",
  },
  {
    label: "View modes",
    ours: "Executive / Technical / Complete filter locally — zero LLM cost.",
    theirs: "Prompt again for each view — cost + drift.",
  },
  {
    label: "Export",
    ours: "Typed @react-pdf/renderer — Executive / Technical / Complete PDFs.",
    theirs: "Manual export from chat.",
  },
] as const;

export function Comparison() {
  return (
    <section id="comparison" aria-labelledby="comparison-heading" className="border-t border-border">
      <div className="py-10 sm:py-12">
        <h2 id="comparison-heading" className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Section records vs. chat blobs
        </h2>
        <p className="mt-2 max-w-[60ch] text-sm leading-6 text-muted-foreground">
          <span className="font-medium text-foreground">AGENTS.md Rule 2</span> — blueprints as Section records. Comparison shows
          why isolation + local filtering matters.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="hidden sm:grid grid-cols-[160px_1fr_1fr] gap-0 border-b border-border bg-muted/40 text-xs font-medium tracking-widest uppercase text-muted-foreground">
            <div className="px-4 py-3">Capability</div>
            <div className="px-4 py-3 flex items-center gap-2 border-l border-border">
              <span className="size-2 rounded-full bg-primary" aria-hidden /> Project Consultant
            </div>
            <div className="px-4 py-3 border-l border-border">Generic chat</div>
          </div>

          <div className="divide-y divide-border">
            {ROWS.map((r) => (
              <div key={r.label} className="grid grid-cols-1 sm:grid-cols-[160px_1fr_1fr] gap-0">
                <div className="px-4 py-4 text-sm font-medium bg-muted/20 sm:bg-transparent border-b sm:border-b-0 border-border">
                  {r.label}
                </div>
                <div className="px-4 py-4 sm:border-l border-border flex gap-2 text-sm leading-6">
                  <Check className="size-4 shrink-0 mt-0.5 text-primary" aria-hidden />
                  <span className="text-foreground">{r.ours}</span>
                </div>
                <div className="px-4 py-4 sm:border-l border-border flex gap-2 text-sm leading-6 text-muted-foreground">
                  <X className="size-4 shrink-0 mt-0.5" aria-hidden />
                  <span>{r.theirs}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
          Per-section regeneration via <span className="font-mono text-foreground">Section.key</span> — type-safe with Zod.
        </p>
      </div>
    </section>
  );
}
