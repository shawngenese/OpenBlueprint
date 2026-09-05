import * as React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type Section = {
  key: string;
  title: string;
  content: string;
  order: number;
};

type BlueprintPDFProps = {
  projectTitle: string;
  mode: "executive" | "technical" | "complete";
  sections: Section[];
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 48,
    paddingHorizontal: 36,
    fontFamily: "Helvetica",
    fontSize: 9,
    lineHeight: 1.5,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 9,
    color: "#71717a",
  },
  modeBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  modeText: {
    fontSize: 7,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#52525b",
    fontWeight: 700,
  },
  section: {
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  keyBadge: {
    backgroundColor: "#18181b",
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  keyText: {
    color: "#ffffff",
    fontSize: 6,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
  },
  sectionHint: {
    fontSize: 7,
    color: "#71717a",
    marginLeft: "auto",
  },
  contentBox: {
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 4,
    padding: 10,
  },
  contentText: {
    fontSize: 8,
    lineHeight: 1.6,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: "#a1a1aa",
    borderTopWidth: 1,
    borderTopColor: "#e4e4e7",
    paddingTop: 8,
  },
});

function stripMarkdownFences(text: string): string {
  // Simple cleanup: remove ``` fences, keep content
  return text.replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, "").trim()).trim();
}

export function BlueprintPDF({ projectTitle, mode, sections }: BlueprintPDFProps) {
  const modeLabel = mode.charAt(0).toUpperCase() + mode.slice(1);
  const subtitleMap: Record<string, string> = {
    executive: "Executive — Overview • Goals • Risks • Roadmap (filtered locally, no LLM re-call)",
    technical: "Technical — Stack • Architecture • API • DB • Security (filtered locally)",
    complete: "Complete — All 20 sections in canonical order",
  };

  return (
    <Document title={`${projectTitle} — ${modeLabel} Blueprint`} author="AI Project Consultant">
      <Page size="A4" style={styles.page} wrap>
        <View fixed style={styles.header}>
          <Text style={styles.headerTitle}>{projectTitle}</Text>
          <Text style={styles.headerSubtitle}>{subtitleMap[mode]}</Text>
          <View style={styles.modeBadge}>
            <Text style={styles.modeText}>{mode} • {sections.length} sections • gpt-4o-mini</Text>
          </View>
        </View>

        {sections.map((s) => (
          <View key={s.key} style={styles.section} wrap={false}>
            <View style={styles.sectionHeader}>
              <View style={styles.keyBadge}>
                <Text style={styles.keyText}>{s.key}</Text>
              </View>
              <Text style={styles.sectionTitle}>{s.title}</Text>
              <Text style={styles.sectionHint}>#{s.order + 1}</Text>
            </View>
            <View style={styles.contentBox}>
              <Text style={styles.contentText}>{stripMarkdownFences(s.content)}</Text>
            </View>
          </View>
        ))}

        <View fixed style={styles.footer}>
          <Text>AI Project Consultant — Technical Blueprint</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
