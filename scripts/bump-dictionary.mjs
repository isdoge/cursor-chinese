import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const configUrl = new URL("../release.config.json", import.meta.url);
const config = JSON.parse(await readFile(configUrl, "utf8"));
const dictionary = JSON.parse(await readFile(new URL("../locales/zh-CN.json", import.meta.url), "utf8"));
const rules = JSON.parse(await readFile(new URL("../locales/rules.json", import.meta.url), "utf8"));
const parts = Object.values(dictionary);
if (parts.some((p) => typeof p !== "object" || p === null)) throw new Error("词典结构无效");
const flatEntries = parts.flatMap((p) => Object.entries(p));
if (flatEntries.length < 20) throw new Error("词典条数不足");
for (const [key, value] of flatEntries) {
  if (typeof value !== "string" || !value.trim() || !key.trim() || key.length > 4000 || value.length > 8000
    || ["__proto__", "prototype", "constructor"].includes(key)) throw new Error("词典中存在无效条目: " + key.slice(0, 40));
}
const fingerprint = createHash("sha256")
  .update(JSON.stringify({ dictionary, rules }))
  .digest("hex");
if (fingerprint === config.dictionarySha256) {
  console.log("词典没有变化，版本保持不变。");
} else {
  if (!Number.isSafeInteger(config.dictionaryRevision + 1)) throw new Error("版本号超出安全整数范围");
  config.dictionaryRevision += 1;
  config.dictionarySha256 = fingerprint;
  await writeFile(configUrl, JSON.stringify(config, null, 2) + "\n", "utf8");
  console.log("已递增词典 revision：" + config.dictionaryRevision);
  console.log("下一步：npm run build && npm test，并提交词典、配置与全部生成产物。");
}
