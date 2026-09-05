'use client';

import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OUTPUT_MODES } from "@/lib/ai/config";
import { FileText, Briefcase, Code2 } from "lucide-react";
import { SectionList } from "./section-list";

type Section = {
  id: string;
  key: string;
  title: string;
  content: string;
  order: number;
};

const MODES = [
  { id: "executive" as const, label: "Executive", icon: Briefcase, desc: "Overview • Goals • Risks" },
  { id: "technical" as const, label: "Technical", icon: Code2, desc: "Stack • API • Architecture" },
  { id: "complete" as const, label: "Complete", icon: FileText, desc: "All 20 sections" },
];

export function ModeTabs({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState<"executive" | "technical" | "complete">("complete");

  const filtered = useMemo(() => {
    const allowed = OUTPUT_MODES[active];
    if (active === "complete") return sections;
    return sections.filter((s) => (allowed as readonly string[]).includes(s.key));
  }, [sections, active]);

  return (
    <Tabs value={active} onValueChange={(v) => setActive(v as typeof active)} className="w-full gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <TabsList className="w-full sm:w-auto">
          {MODES.map((m) => (
            <TabsTrigger key={m.id} value={m.id} className="gap-1.5 flex-1 sm:flex-initial">
              <m.icon className="size-4" />
              {m.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <span className="text-xs text-muted-foreground">
          {filtered.length} of {sections.length} sections • No LLM re-call — filtering locally
        </span>
      </div>

      {MODES.map((m) => (
        <TabsContent key={m.id} value={m.id} className="space-y-4">
          <p className="text-xs text-muted-foreground">{m.desc}</p>
          <SectionList sections={filtered} defaultOpenCount={m.id === "complete" ? 3 : filtered.length} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

// Helper for server filtering (mirrors client logic) — used in page for count pre-render
export function filterSectionsByMode(sections: Section[], mode: keyof typeof OUTPUT_MODES) {
  const allowed = OUTPUT_MODES[mode];
  if (mode === "complete") return sections;
  return sections.filter((s) => (allowed as readonly string[]).includes(s.key));
}
