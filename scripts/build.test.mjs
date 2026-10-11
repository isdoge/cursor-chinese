import { test } from "node:test";
import assert from "node:assert";
import { readFile } from "node:fs/promises";
import { execSync } from "node:child_process";
import path from "node:path";

const rootDir = path.resolve(import.meta.dirname, "..");
const outputFile = path.join(rootDir, "dist", "cursor-chinese.user.js");
const packageJson = JSON.parse(
  await readFile(path.join(rootDir, "package.json"), "utf8"),
);
const envelope = JSON.parse(
  await readFile(path.join(rootDir, "locales", "zh-CN.online.json"), "utf8"),
);
const dictionaryTerms = [
  ...Object.keys(envelope.dictionary.text),
  ...Object.keys(envelope.dictionary.attr),
  ...Object.keys(envelope.dictionary.title),
  ...Object.keys(envelope.dictionary.icons),
];

test("build produces a valid userscript", async () => {
  // Run build.
  execSync(`"${process.execPath}" scripts/build.mjs`, { cwd: rootDir, stdio: "pipe" });

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
  assert.ok(
    dist.includes(`// @version      ${packageJson.version}`),
    `Must have version ${packageJson.version}`,
  );

  // 2. Has bundled bootstrap function
  assert.ok(dist.includes("bootstrap()"), "Must contain bootstrap call");
  assert.ok(dist.includes("require("), "Must have module require mechanics");

  // 3. Contains key translation entries（词典已外置，检查 envelope）
  assert.ok(
    dictionaryTerms.includes("New Agent"),
    "Should contain New Agent translation",
  );
  assert.ok(
    dictionaryTerms.includes("Automations"),
    "Should contain Automations translation",
  );
  assert.ok(
    dictionaryTerms.includes("No Agents Yet"),
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

test("translation preserves framework-managed element structure", async () => {
  const dist = await readFile(outputFile, "utf8");

  assert.ok(
    !dist.includes("element.textContent = translated"),
    "Must translate Text nodes without replacing an element's child nodes",
  );
  assert.ok(
    !dist.includes("translateLeafTextElement"),
    "Must not restore the unsafe leaf-element translation path",
  );
  assert.ok(
    !dist.includes("translateRoot(node"),
    "MutationObserver must batch added elements instead of scanning each one synchronously",
  );
});

test("translation avoids no-op characterData writes", async () => {
  const dist = await readFile(outputFile, "utf8");

  assert.ok(
    dist.includes("if (node.nodeValue === nextValue) return"),
    "Must compare the final whitespace-preserving value before assigning nodeValue",
  );
  assert.ok(
    !dist.includes("node.nodeValue === translated"),
    "Must not compare against the normalized translation before restoring whitespace",
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
      dictionaryTerms.includes(term),
      `Should have translation entry for "${term}"`,
    );
  }

  // Per-attribute rules
  assert.ok(
    dictionaryTerms.includes("Toggle left sidebar"),
    "Should have sidebar toggle aria-label translation",
  );
  assert.ok(
    dictionaryTerms.includes("Search agents (Ctrl+K)"),
    "Should have search aria-label translation",
  );
  assert.ok(
    dictionaryTerms.includes("User menu"),
    "Should have user menu aria-label translation",
  );
});
