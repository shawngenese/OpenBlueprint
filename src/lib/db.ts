import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Driver adapter (Wasm query compiler, no native .so.node binary) — required
// for serverless (Vercel): the classic binary engine is dropped from function
// bundles, causing PrismaClientInitializationError at runtime.
function connectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // Import-safe placeholder (unit tests, build-time prerender): constructing
    // the client never connects, so this only fails if a query is attempted
    // without DATABASE_URL set — same semantics as the classic engine had.
    console.warn("[db] DATABASE_URL is not set — using placeholder (queries will fail)");
    return "postgresql://localhost:5432/placeholder?schema=public";
  }
  // PgBouncer-style poolers (Supabase 6543 / Neon -pooler) need this flag
  // with driver adapters; Supabase dashboard pooler strings include it already.
  if (
    (url.includes(":6543") || url.includes("-pooler")) &&
    !url.includes("pgbouncer=true")
  ) {
    return url + (url.includes("?") ? "&pgbouncer=true" : "?pgbouncer=true");
  }
  return url;
}

function createClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: connectionString() });
  return new PrismaClient({
    adapter,
    // log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const db = prisma;
export default prisma;
