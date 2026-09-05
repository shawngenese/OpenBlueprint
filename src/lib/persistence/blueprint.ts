import { prisma } from "@/lib/db";
import { BLUEPRINT_ORDER, BLUEPRINT_META, type BlueprintOutput } from "@/lib/ai/schemas/blueprint";

/**
 * Persist a full 20-section blueprint as individual Section records mapped to Blueprint.
 * Uses upsert on (blueprintId, key) to remain idempotent and supports re-generation.
 * Do NOT store as blob — respects AGENTS.md Data Structure rule.
 */
export async function saveBlueprint(projectId: string, data: BlueprintOutput) {
  // Validate 20 keys present (paranoid, schema already does)
  const missing = BLUEPRINT_ORDER.filter((k) => !(k in data));
  if (missing.length) throw new Error(`Missing blueprint keys: ${missing.join(", ")}`);

  return prisma.$transaction(async (tx) => {
    const blueprint = await tx.blueprint.upsert({
      where: { projectId },
      create: { projectId },
      update: {},
    });

    for (let i = 0; i < BLUEPRINT_ORDER.length; i++) {
      const key = BLUEPRINT_ORDER[i];
      const content = data[key];
      const meta = BLUEPRINT_META[key];

      await tx.section.upsert({
        where: { blueprintId_key: { blueprintId: blueprint.id, key } },
        create: {
          blueprintId: blueprint.id,
          key,
          title: meta.title,
          content,
          order: i,
        },
        update: {
          title: meta.title,
          content,
          order: i,
        },
      });
    }

    await tx.project.update({
      where: { id: projectId },
      data: { status: "generated" },
    });

    return tx.blueprint.findUnique({
      where: { id: blueprint.id },
      include: { sections: { orderBy: { order: "asc" } } },
    });
  });
}

export async function getBlueprintWithSections(projectId: string) {
  const blueprint = await prisma.blueprint.findUnique({
    where: { projectId },
    include: { sections: { orderBy: { order: "asc" } } },
  });
  return blueprint;
}

export async function getSectionsByMode(projectId: string, mode: "executive" | "technical" | "complete") {
  const { OUTPUT_MODES } = await import("@/lib/ai/config");
  const allowed = OUTPUT_MODES[mode] as readonly string[];

  const blueprint = await getBlueprintWithSections(projectId);
  if (!blueprint) return [];

  if (mode === "complete") return blueprint.sections;
  // Filter existing sections — NEVER trigger LLM re-call (AGENTS.md Rule 4)
  return blueprint.sections.filter((s) => (allowed as string[]).includes(s.key));
}
