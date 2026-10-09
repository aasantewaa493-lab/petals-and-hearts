const { existsSync } = require("node:fs");
const { execSync } = require("node:child_process");
const path = require("node:path");

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}
if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = "dev-only-change-me-not-for-production";
}

const url = process.env.DATABASE_URL;
if (!url.startsWith("file:")) {
  console.log("Skipping SQLite prepare; DATABASE_URL is not a file database.");
  process.exit(0);
}

const dbFile = path.join(process.cwd(), "prisma", "dev.db");
const existed = existsSync(dbFile);

execSync("npx prisma db push --skip-generate", { stdio: "inherit", env: process.env });

if (!existed || process.env.VERCEL) {
  execSync("npx prisma db seed", { stdio: "inherit", env: process.env });
}
