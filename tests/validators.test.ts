import { describe, it, expect } from "vitest";
import {
  credentialsSchema,
  signUpSchema,
  createProjectSchema,
} from "@/lib/validators";
import { clarifierSchema } from "@/lib/ai/schemas/clarifier";
import { blueprintSchema, BLUEPRINT_ORDER } from "@/lib/ai/schemas/blueprint";

describe("validators — credentialsSchema", () => {
  it("accepts valid email + password 8+", () => {
    expect(credentialsSchema.safeParse({ email: "a@b.com", password: "12345678" }).success).toBe(true);
  });
  it("rejects invalid email", () => {
    expect(credentialsSchema.safeParse({ email: "not-email", password: "12345678" }).success).toBe(false);
  });
  it("rejects short password", () => {
    expect(credentialsSchema.safeParse({ email: "a@b.com", password: "short" }).success).toBe(false);
  });
});

describe("validators — signUpSchema", () => {
  it("accepts valid", () => {
    expect(signUpSchema.safeParse({ name: "Ada", email: "ada@test.com", password: "password123" }).success).toBe(true);
  });
  it("rejects missing name", () => {
    expect(signUpSchema.safeParse({ name: "", email: "a@b.com", password: "password123" }).success).toBe(false);
  });
});

describe("validators — createProjectSchema", () => {
  it("accepts title 2-100 and rawIdea 10-5000", () => {
    expect(createProjectSchema.safeParse({ title: "My App", rawIdea: "x".repeat(10) }).success).toBe(true);
  });
  it("rejects short title", () => {
    expect(createProjectSchema.safeParse({ title: "A", rawIdea: "x".repeat(10) }).success).toBe(false);
  });
  it("rejects short rawIdea", () => {
    expect(createProjectSchema.safeParse({ title: "My App", rawIdea: "short" }).success).toBe(false);
  });
});

describe("AI — clarifierSchema max 5", () => {
  it("accepts 1-5 questions", () => {
    const ok = clarifierSchema.safeParse({
      questions: Array.from({ length: 5 }, (_, i) => ({
        question: `Question ${i} with sufficient length to pass validation?`,
        rationale: "why",
      })),
    });
    expect(ok.success).toBe(true);
  });
  it("rejects 0 questions", () => {
    expect(clarifierSchema.safeParse({ questions: [] }).success).toBe(false);
  });
  it("rejects 6 questions (max 5)", () => {
    const fail = clarifierSchema.safeParse({
      questions: Array.from({ length: 6 }, () => ({
        question: "Valid question with enough length for test coverage?",
      })),
    });
    expect(fail.success).toBe(false);
  });
  it("rejects short question <10", () => {
    expect(clarifierSchema.safeParse({ questions: [{ question: "short?" }] }).success).toBe(false);
  });
});

describe("AI — blueprintSchema 20 keys", () => {
  it("requires 20 sections", () => {
    const full: Record<string, string> = {};
    BLUEPRINT_ORDER.forEach((k) => (full[k] = "x".repeat(100)));
    const ok = blueprintSchema.safeParse(full);
    expect(ok.success).toBe(true);
    // missing one
    const partial: Record<string, string> = { ...full };
    delete partial.overview;
    expect(blueprintSchema.safeParse(partial).success).toBe(false);
  });
  it("rejects empty section content", () => {
    const full: Record<string, string> = {};
    BLUEPRINT_ORDER.forEach((k) => (full[k] = "x".repeat(100)));
    full["overview"] = "";
    expect(blueprintSchema.safeParse(full).success).toBe(false);
  });
});
