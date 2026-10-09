import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import { applyRuntimeEnv } from "@/lib/runtime-env";

applyRuntimeEnv();

function hydrateVercelSqlite() {
  const url = process.env.DATABASE_URL ?? "";
  const vercelRuntime = Boolean(process.env.VERCEL) && process.env.NEXT_PHASE !== "phase-production-build";
  if (!vercelRuntime || !url.startsWith("file:")) return;

  const bundled = path.join(process.cwd(), "prisma", "dev.db");
  const dest = "/tmp/petals-and-hearts.db";
  if (!fs.existsSync(dest) && fs.existsSync(bundled)) {
    fs.copyFileSync(bundled, dest);
  }
  if (fs.existsSync(dest)) {
    process.env.DATABASE_URL = `file:${dest}`;
  }
}

hydrateVercelSqlite();

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
