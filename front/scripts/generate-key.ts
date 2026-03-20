#!/usr/bin/env bun
/**
 * Generate an ES256 key for ATProto OAuth
 * Run with: bun run scripts/generate-key.ts
 */

import { generateES256Key } from "atproto-better-auth";
import fs from "fs";
import path from "path";

const KEY_FILE = path.join(process.cwd(), ".atproto-key.json");
const ENV_FILE = path.join(process.cwd(), ".env.local");

async function main() {
  // Check if key already exists
  if (fs.existsSync(KEY_FILE)) {
    console.log("🔑 Key already exists at", KEY_FILE);
    const existing = JSON.parse(fs.readFileSync(KEY_FILE, "utf-8"));
    console.log("   Kid:", existing.kid);
    return;
  }

  console.log("🔑 Generating new ES256 key...");
  const key = await generateES256Key();

  // Save to file
  fs.writeFileSync(KEY_FILE, JSON.stringify(key, null, 2));
  console.log("✅ Saved key to", KEY_FILE);

  // Update .env.local
  const envContent = fs.existsSync(ENV_FILE)
    ? fs.readFileSync(ENV_FILE, "utf-8")
    : "";

  if (!envContent.includes("ATPROTO_PRIVATE_KEY=")) {
    const keyJson = JSON.stringify(key);
    const newEnvContent = envContent + `\nATPROTO_PRIVATE_KEY='${keyJson}'\n`;
    fs.writeFileSync(ENV_FILE, newEnvContent);
    console.log("✅ Added ATPROTO_PRIVATE_KEY to .env.local");
  }

  console.log("\n⚠️  Make sure to add these to .gitignore:");
  console.log("   .atproto-key.json");
  console.log("   .env.local");
}

main().catch(console.error);