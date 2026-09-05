import * as React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { BlueprintPDF } from "./templates";
import { OUTPUT_MODES } from "@/lib/ai/config";

type Section = {
  key: string;
  title: string;
  content: string;
  order: number;
};

type GenerateArgs = {
  projectTitle: string;
  sections: Section[]; // full 20 from DB
  mode: "executive" | "technical" | "complete";
};

export async function generateBlueprintPDF({ projectTitle, sections, mode }: GenerateArgs): Promise<Buffer> {
  const allowed = OUTPUT_MODES[mode];
  const filtered =
    mode === "complete" ? sections : sections.filter((s) => (allowed as readonly string[]).includes(s.key));

  // Ensure order
  filtered.sort((a, b) => a.order - b.order);

  const doc = React.createElement(BlueprintPDF, {
    projectTitle,
    mode,
    sections: filtered.map((s) => ({ key: s.key, title: s.title, content: s.content, order: s.order })),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(doc as any);
  return buffer as unknown as Buffer;
}
