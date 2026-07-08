import { test } from "node:test";
import assert from "node:assert";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const rootDir = path.resolve(import.meta.dirname, "..");
const source = await readAllSourceFiles(path.join(rootDir, "src"));
const evidenceDir = path.join(rootDir, "_upload_exclude", "evidence");

async function readAllSourceFiles(dir) {
  const chunks = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      chunks.push(await readAllSourceFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      chunks.push(await readFile(fullPath, "utf8"));
    }
  }
  return chunks.join("\n");
}

const exactKeys = new Set([
  ...[...source.matchAll(/^\s+"([^"]+)":\s+"/gm)].map((match) => match[1]),
  ...[...source.matchAll(/^\s+([A-Za-z_$][\w$]*):\s+"/gm)].map(
    (match) => match[1],
  ),
]);

const regexLiterals = [
  ...source.matchAll(/\{ pattern: \/(.+?)\/([a-z]*)?, replace:/g),
].map((match) => {
  const [, pattern, flags = ""] = match;
  return new RegExp(pattern, flags);
});

function covered(value) {
  if (exactKeys.has(value)) return true;
  return regexLiterals.some((regex) => regex.test(value));
}

function shouldSkipText(value) {
  if (!value) return true;
  if (/^\$[0-9,.]+(?: \/mo\.)?$/.test(value)) return true;
  if (value === "/mo.") return true;
  if (/^[A-Z]$/.test(value)) return true;
  if (/[\u4e00-\u9fff]/.test(value)) return true;
  if (/^[\w.@-]+\.com\/\S*$/.test(value)) return true;
  if (/^@\w+$/.test(value)) return true;
  if (/^[\w.@-]+\.[a-z]{2,}$/.test(value)) return true;
  if (/^[\w.-]+@[\w.-]+\.\w+$/.test(value)) return true;
  // Skip timestamp, date range, pagination, and partial-quote patterns handled by regex rules.
  if (/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/.test(value)) return true;
  if (/^[A-Z][a-z]{2} \d{1,2}, \d{2}:\d{2} [AP]M$/.test(value)) return true;
  if (/^[A-Z][a-z]{2} \d{1,2} - [A-Z][a-z]{2} \d{2}$/.test(value)) return true;
  if (/^Showing \d+(?:,\d+)*-\d+(?:,\d+)* of \d+(?:,\d+)*$/.test(value))
    return true;
  if (/^"$/.test(value)) return true;
  if (
    /^"?\? Any existing integrations using this key will no longer work\.$/.test(
      value,
    )
  )
    return true;
  if (
    /^Showing token usage and costs from .+ to .+\. Use filters to narrow results by date range\.$/.test(
      value,
    )
  )
    return true;
  return false;
}

test("real Cursor evidence text is covered by dictionaries", async () => {
  const files = (await readdir(evidenceDir)).filter((name) =>
    name.endsWith(".json"),
  );
  assert.ok(
    files.length >= 3,
    "Expected at least agents, automations, and dashboard evidence",
  );

  const missing = [];
  for (const file of files) {
    const evidence = JSON.parse(
      await readFile(path.join(evidenceDir, file), "utf8"),
    );
    const texts = new Set(
      (evidence.items ?? [])
        .map((item) => String(item.text ?? "").trim())
        .filter(Boolean),
    );

    for (const text of texts) {
      if (shouldSkipText(text)) continue;
      if (!covered(text)) missing.push(`${file}: ${text}`);
    }
  }

  assert.deepStrictEqual(missing, []);
});

test("real Cursor evidence attributes are covered where they contain English", async () => {
  const files = (await readdir(evidenceDir)).filter((name) =>
    name.endsWith(".json"),
  );
  const attrs = ["aria-label", "title", "placeholder", "data-content"];
  const missing = [];

  for (const file of files) {
    const evidence = JSON.parse(
      await readFile(path.join(evidenceDir, file), "utf8"),
    );
    for (const item of evidence.items ?? []) {
      for (const attr of attrs) {
        const value = String(item.attrs?.[attr] ?? "").trim();
        if (!value) continue;
        if (/^[A-Za-z0-9 _&(),+\-/]+$/.test(value) && !covered(value)) {
          missing.push(`${file} [${attr}]: ${value}`);
        }
      }
    }
  }

  assert.deepStrictEqual(missing, []);
});

