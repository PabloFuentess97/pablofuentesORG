// Prisma config — loaded by the Prisma CLI
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // Uses an explicit path so it works in containers where
    // node_modules/.bin isn't on PATH.
    seed: "node ./node_modules/tsx/dist/cli.mjs prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
