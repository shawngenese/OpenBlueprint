'use client';

import { useState, useMemo } from "react";
import { cn } from "cn";
import { Briefcase, Code2, FileText } from "lucide-react";
import { BLUEPRINT_ORDER, BLUEPRINT_META } from "@/lib/ai/schemas/blueprint";
import { OUTPUT_MODES } from "@/lib/ai/config";

type Mode = "executive" | "technical" | "complete";

const MODES: Record<Mode, { label: string; icon: typeof Briefcase; desc: string }> = {
  executive: { label: "Executive", icon: Briefcase, desc: "8 keys — strategy & risk" },
  technical: { label: "Technical", icon: Code2, desc: "9 keys — stack & architecture" },
  complete: { label: "Complete", icon: FileText, desc: "All 20 keys — canonical order" },
};

export function SectionsShowcase() {
  const [active, setActive] = useState<Mode>("complete");

  const filtered = useMemo(() => {
    const allowed = OUTPUT_MODES[active] as readonly string[];
    if (active === "complete") return BLUEPRINT_ORDER;
    return BLUEPRINT_ORDER.filter((k) => (allowed as readonly string[]).includes(k));
  }, [active]);

  return (
    <section id="sections" aria-labelledby="sections-heading" className="border-t border-border">
      <div className="py-10 sm:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden /> 20 sections
            </div>
            <h2 id="sections-heading" className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
              One blueprint, 20 structured sections
            </h2>
            <p className="mt-2 max-w-[60ch] text-sm leading-6 text-muted-foreground">
              Mirrors <span className="font-mono text-xs text-foreground">components/blueprint/mode-tabs.tsx</span> —{" "}
              <span className="font-medium text-foreground">filter locally</span>, never re-call the LLM (
              <span className="font-mono text-xs">AGENTS.md Rule 4</span>). Canonical order from{" "}
              <span className="font-mono text-xs">BLUEPRINT_ORDER</span> + hints from{" "}
              <span className="font-mono text-xs">BLUEPRINT_META</span>.
            </p>
          </div>
          <span className="inline-flex h-9 items-center rounded-full border border-border bg-card px-3 text-xs font-medium text-muted-foreground">
            {filtered.length} / 20 shown
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Section view mode"
          className="mt-6 inline-flex gap-1 rounded-full border border-border bg-muted p-1"
        >
          {(Object.keys(MODES) as Mode[]).map((m) => {
            const meta = MODES[m];
            const Icon = meta.icon;
            const selected = active === m;
            return (
              <button
                key={m}
                role="tab"
                aria-selected={selected}
                aria-controls={`sections-panel-${m}`}
                id={`sections-tab-${m}`}
                onClick={() => setActive(m)}
                onKeyDown={(e) => {
                  const order: Mode[] = ["executive", "technical", "complete"];
                  const idx = order.indexOf(active);
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    setActive(order[(idx + 1) % 3]);
                  }
                  if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    setActive(order[(idx + 2) % 3]);
                  }
                }}
                className={cn(
                  "inline-flex h-11 min-h-11 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background hover:text-foreground"
                )}
              >
                <Icon className="size-4" aria-hidden />
                {meta.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{MODES[active].desc} — local filter, no LLM call.</p>

        <div
          id={`sections-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`sections-tab-${active}`}
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {filtered.map((k, idx) => {
            const meta = BLUEPRINT_META[k];
            return (
              <div
                key={k}
                className="group flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:bg-card transition-colors duration-150"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-medium tracking-[1.2px] uppercase text-muted-foreground">
                    {k}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">{String(idx + 1).padStart(2, "0")}</span>
                </div>
                <div className="text-sm font-medium tracking-tight text-foreground">{meta.title}</div>
                <div className="text-xs leading-4 text-muted-foreground">{meta.hint}</div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
          Executive: <span className="font-mono text-foreground">overview, problem, goals, features, roadmap, complexity, risks, techStack</span> •
          Technical: <span className="font-mono text-foreground">techStack, altStacks, architecture, database, api, uiPages, security, scalability, roadmap</span>
        </p>
      </div>
    </section>
  );
}
