import { test } from "node:test";
import assert from "node:assert";
import { readFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import path from "node:path";

const rootDir = path.resolve(import.meta.dirname, "..");
const outputFile = path.join(rootDir, "dist", "cursor-chinese.user.js");

test("build produces a valid userscript", async () => {
  // Run build.
  execSync("node scripts/build.mjs", { cwd: rootDir, stdio: "pipe" });

  const dist = await readFile(outputFile, "utf8");

  // 1. Has userscript header
  assert.ok(
    dist.startsWith("// ==UserScript=="),
    "Must start with userscript header marker",
  );
  assert.match(
    dist,
    /\/\/ @match\s+https:\/\/cursor\.com\/\*/,
    "Must contain cursor.com match",
  );
  assert.match(
    dist,
    /\/\/ @match\s+https:\/\/www\.cursor\.com\/\*/,
    "Must contain www.cursor.com match",
  );
  assert.match(dist, /\/\/ @run-at\s+document-idle/, "Must have run-at");
  assert.match(dist, /\/\/ @version\s+1\.0\.0/, "Must have version 1.0.0");

  // 2. Has bundled bootstrap function
  assert.ok(dist.includes("bootstrap()"), "Must contain bootstrap call");
  assert.ok(dist.includes("require("), "Must have module require mechanics");

  // 3. Contains key translation entries
  assert.ok(
    dist.includes('"New Agent"') || dist.includes("New Agent"),
    "Should contain New Agent translation",
  );
  assert.ok(
    dist.includes('"Automations"') || dist.includes("Automations"),
    "Should contain Automations translation",
  );
  assert.ok(
    dist.includes('"No Agents Yet"') || dist.includes("No Agents Yet"),
    "Should contain No Agents Yet translation",
  );
  assert.ok(
    dist.includes("data-icon-name"),
    "Should handle data-icon-name icon rules",
  );

  // 4. No TypeScript types left after strip
  assert.ok(
    !dist.includes("type LanguagePreference ="),
    "TS types should be stripped",
  );
  assert.ok(
    !dist.includes("interface RuntimeState"),
    "TS interfaces should be stripped",
  );
  assert.ok(
    !dist.includes("declare global"),
    "TS global declaration should be stripped",
  );

  console.log(
    `Built dist size: ${(Buffer.byteLength(dist, "utf8") / 1024).toFixed(1)} KB`,
  );
});

test("translation coverage sanity", async () => {
  const dist = await readFile(outputFile, "utf8");

  // Key navigation labels should be translated
  const keyTerms = [
    "Dashboard",
    "Settings",
    "Popular",
    "Code Review",
    "Security",
    "Add test coverage",
    "Generate docs",
    "Find bugs",
  ];

  for (const term of keyTerms) {
    assert.ok(
      dist.includes(term),
      `Should have translation entry for "${term}"`,
    );
  }

  // Per-attribute rules
  assert.ok(
    dist.includes("Toggle left sidebar"),
    "Should have sidebar toggle aria-label translation",
  );
  assert.ok(
    dist.includes("Search agents (Ctrl+K)"),
    "Should have search aria-label translation",
  );
  assert.ok(
    dist.includes("User menu"),
    "Should have user menu aria-label translation",
  );
});
