/** Apply safe defaults so Prisma and Auth.js can boot on Vercel without dashboard env vars. */
export function applyRuntimeEnv() {
  if (!process.env.AUTH_SECRET) {
    process.env.AUTH_SECRET = "dev-only-change-me-not-for-production";
  }
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "file:./dev.db";
  }
  if (!process.env.NEXT_PUBLIC_SITE_URL && process.env.VERCEL_URL) {
    process.env.NEXT_PUBLIC_SITE_URL = `https://${process.env.VERCEL_URL}`;
  }
}

applyRuntimeEnv();
