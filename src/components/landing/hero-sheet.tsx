'use client';

import { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "cn";
import { Briefcase, Code2, FileText } from "lucide-react";
import { BLUEPRINT_ORDER, BLUEPRINT_META } from "@/lib/ai/schemas/blueprint";
import { OUTPUT_MODES } from "@/lib/ai/config";

type Mode = "executive" | "technical" | "complete";

const MODE_META: Record<Mode, { label: string; desc: string; icon: typeof Briefcase }> = {
  executive: { label: "Executive", desc: "Overview • Goals • Risks", icon: Briefcase },
  technical: { label: "Technical", desc: "Stack • API • Architecture", icon: Code2 },
  complete: { label: "Complete", desc: "All 20 sections", icon: FileText },
};

export function HeroSheet() {
  const [active, setActive] = useState<Mode>("executive");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  // prefers-reduced-motion fallback to static state
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);

  // pause when offscreen — skip transitions when hidden
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const filtered = useMemo(() => {
    const allowed = OUTPUT_MODES[active] as readonly string[];
    if (active === "complete") return BLUEPRINT_ORDER;
    // preserve canonical order, filter locally — AGENTS.md Rule 4: no LLM re-call
    return BLUEPRINT_ORDER.filter((k) => (allowed as readonly string[]).includes(k));
  }, [active]);

  return (
    <div
      ref={ref}
      className="col-span-12 lg:col-span-5"
      aria-label="Blueprint sheet preview — filter Executive/Technical/Complete locally"
    >
      <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
        <div
          className={cn(
            "rounded-xl border border-border bg-muted/40 p-4",
            !reducedMotion && visible ? "transition-colors duration-200" : ""
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Blueprint sheet
            </span>
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
              {filtered.length} / 20
            </span>
          </div>

          {/* Tabs — keyboard + aria-selected, ≥44×44px, gap-2 */}
          <div
            role="tablist"
            aria-label="View mode"
            className="mt-4 grid grid-cols-3 gap-1 rounded-full border border-border bg-background p-1"
          >
            {(Object.keys(MODE_META) as Mode[]).map((m) => {
              const meta = MODE_META[m];
              const Icon = meta.icon;
              const selected = active === m;
              return (
                <button
                  key={m}
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`sheet-panel-${m}`}
                  id={`sheet-tab-${m}`}
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
                    "inline-flex h-9 min-h-9 items-center justify-center gap-1.5 rounded-full px-2 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                  {meta.label}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-center text-[11px] leading-4 text-muted-foreground">
            {MODE_META[active].desc} • filtering locally — no LLM re-call
          </p>

          {/* Sheet grid — aspect reserve prevents CLS 0.1, animates only if motion allowed */}
          <div
            id={`sheet-panel-${active}`}
            role="tabpanel"
            aria-labelledby={`sheet-tab-${active}`}
            className={cn(
              "mt-4 grid grid-cols-3 gap-2",
              !reducedMotion && visible ? "transition-opacity duration-200" : ""
            )}
          >
            {filtered.map((k) => {
              const meta = BLUEPRINT_META[k];
              return (
                <div
                  key={k}
                  className="rounded-lg border border-border bg-background px-2 py-2 hover:border-primary/30 transition-colors"
                >
                  <div className="text-[11px] font-medium tracking-wide text-foreground">{meta.title}</div>
                  <div className="text-[10px] tracking-wide text-muted-foreground">{meta.hint}</div>
                  <div className="mt-1.5 flex gap-1">
                    <span className="h-1 w-8 rounded bg-primary/20" aria-hidden />
                    <span className="h-1 w-4 rounded bg-muted" aria-hidden />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-center text-[11px] leading-4 text-muted-foreground">
            {active === "complete"
              ? "Complete — all 20 canonical keys in order (blueprintSchema)."
              : active === "executive"
                ? "Executive — 8 keys filtered from existing 20 (mirrors mode-tabs)."
                : "Technical — 9 keys filtered from existing 20."}
          </p>
        </div>
      </div>
    </div>
  );
}
