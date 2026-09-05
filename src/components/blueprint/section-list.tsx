'use client';

import { SectionItem } from "./section-item";

type Section = {
  id: string;
  key: string;
  title: string;
  content: string;
  order: number;
};

export function SectionList({ sections, defaultOpenCount = 3 }: { sections: Section[]; defaultOpenCount?: number }) {
  return (
    <div className="grid gap-3">
      {sections.map((s, i) => (
        <SectionItem key={s.id} section={s} defaultOpen={i < defaultOpenCount} />
      ))}
    </div>
  );
}
