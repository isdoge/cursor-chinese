type TextDictionary = Record<string, string>;

type RegexRule = {
  pattern: string;
  flags: string;
  replace: string;
};

type RemoteRules = {
  regexText: RegexRule[];
  regexAttr: RegexRule[];
};

type ParsedDictionary = {
  revision: number;
  dictionary: {
    text: TextDictionary;
    attr: TextDictionary;
    title: TextDictionary;
    icons: TextDictionary;
  };
  rules: RemoteRules;
  signature: string;
  serialized: string;
};

const SCRIPT_NAME = "Cursor Chinese";
const SCRIPT_VERSION = "__SCRIPT_VERSION__";
const DICTIONARY_SOURCES = __DICTIONARY_SOURCES__;
const DICTIONARY_CACHE_KEY = "cursor-zh-remote-dictionary-v1";
const DICTIONARY_MAX_BYTES = 800_000;
const LOCK_NAME = "cursor-zh-dictionary-commit-v1";

const EMPTY_DICTIONARY = { text: {}, attr: {}, title: {}, icons: {} };
const EMPTY_RULES = { regexText: [], regexAttr: [] };

let currentRevision = 0;
let currentSignature: string | null = null;
let dictionary: typeof EMPTY_DICTIONARY = EMPTY_DICTIONARY;
let rules: RemoteRules = EMPTY_RULES;
let dictionarySource: "none" | "cache" | "remote" = "none";
let dictionaryRequest: Promise<boolean> | null = null;

declare global {
  interface Window {
    GM_getValue?: (key: string, defaultValue?: unknown) => unknown;
    GM_setValue?: (key: string, value: unknown) => void;
    GM_xmlhttpRequest?: (options: Record<string, unknown>) => void;
    GM_registerMenuCommand?: (name: string, callback: () => void) => void;
    navigator: Navigator & { locks?: { request(name: string, options: LockOptions, callback: (lock: unknown) => Promise<void>): Promise<void> } };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validDictionaryPart(part: unknown): part is TextDictionary {
  if (!isRecord(part)) return false;
  const entries = Object.entries(part);
  if (entries.length === 0) return false;
  for (const [key, value] of entries) {
    if (!key.trim() || key.length > 4000 || typeof value !== "string" || !value.trim()
      || value.length > 8000 || ["__proto__", "prototype", "constructor"].includes(key)) return false;
  }
  return true;
}

function dictionarySignature(entries: [string, string][]): string {
  return JSON.stringify(entries.slice().sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

function parseDictionary(raw: string): ParsedDictionary | null {
  if (typeof raw !== "string" || raw.length > DICTIONARY_MAX_BYTES) return null;
  try {
    const bytes = typeof TextEncoder !== "undefined"
      ? new TextEncoder().encode(raw).length
      : encodeURIComponent(raw).replace(/%[\dA-F]{2}/g, "x").length;
    if (bytes > DICTIONARY_MAX_BYTES) return null;
    const data = JSON.parse(raw) as Record<string, unknown> | null;
    if (!isRecord(data)) return null;
    if (data.schemaVersion !== 1 || !Number.isSafeInteger(data.revision) || (data.revision as number) < 1
      || !Number.isSafeInteger(data.entries)) return null;
    const dict = data.dictionary;
    const rls = data.rules;
    if (!isRecord(dict) || !isRecord(rls)) return null;
    const text = dict.text, attr = dict.attr, title = dict.title, icons = dict.icons;
    if (!validDictionaryPart(text) || !validDictionaryPart(attr)
      || !validDictionaryPart(title) || !validDictionaryPart(icons)) return null;
    if (!Array.isArray(rls.regexText) || !Array.isArray(rls.regexAttr)) return null;
    for (const rule of rls.regexText as unknown[]) {
      if (!isRecord(rule) || typeof rule.pattern !== "string" || patternTooLong(rule.pattern)
        || typeof rule.replace !== "string" || (typeof rule.flags === "string" && /[^gimsuy]/.test(rule.flags))) return null;
    }
    for (const rule of rls.regexAttr as unknown[]) {
      if (!isRecord(rule) || typeof rule.pattern !== "string" || patternTooLong(rule.pattern)
        || typeof rule.replace !== "string" || (typeof rule.flags === "string" && /[^gimsuy]/.test(rule.flags))) return null;
    }
    const entryCount = Object.keys(text).length + Object.keys(attr).length
      + Object.keys(title).length + Object.keys(icons).length;
    if (data.entries !== entryCount) return null;
    const flat = [
      ...Object.entries(text as TextDictionary),
      ...Object.entries(attr as TextDictionary),
      ...Object.entries(title as TextDictionary),
      ...Object.entries(icons as TextDictionary),
    ];
    const serialized = JSON.stringify({
      schemaVersion: 1,
      revision: data.revision,
      entries: entryCount,
      dictionary: { text, attr, title, icons },
      rules: rls,
    });
    return {
      revision: data.revision as number,
      dictionary: { text, attr, title, icons },
      rules: rls as RemoteRules,
      signature: dictionarySignature(flat),
      serialized,
    };
  } catch {
    return null;
  }
}

function patternTooLong(pattern: string): boolean {
  return pattern.length === 0 || pattern.length > 2000;
}

function canApply(parsed: ParsedDictionary): boolean {
  if (parsed.revision < currentRevision) return false;
  if (parsed.revision !== currentRevision) return true;
  return currentSignature === null || parsed.signature === currentSignature;
}

function apply(parsed: ParsedDictionary, source: "cache" | "remote"): void {
  dictionary = parsed.dictionary;
  rules = parsed.rules;
  currentRevision = parsed.revision;
  currentSignature = parsed.signature;
  dictionarySource = source;
}

function readStored(key: string): string {
  try {
    if (typeof window.GM_getValue === "function") {
      return window.GM_getValue(key, "") as string;
    }
  } catch {
    // fall through
  }
  return "";
}

function loadCached(): void {
  const saved = parseDictionary(readStored(DICTIONARY_CACHE_KEY));
  if (!saved) return;
  if (canApply(saved)) apply(saved, "cache");
}

function requestSource(baseUrl: string, force: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof window.GM_xmlhttpRequest !== "function") {
      reject(new Error("GM_xmlhttpRequest 不可用"));
      return;
    }
    window.GM_xmlhttpRequest({
      method: "GET",
      url: baseUrl + (force ? "?refresh=" + Date.now() : ""),
      timeout: 8000,
      anonymous: true,
      headers: { Accept: "application/json" },
      onload(response: { status: number; responseText: string }) {
        if (response.status !== 200) {
          reject(new Error("HTTP " + response.status));
          return;
        }
        resolve(response.responseText);
      },
      onerror() { reject(new Error("词典请求失败")); },
      ontimeout() { reject(new Error("词典请求超时")); },
      onabort() { reject(new Error("词典请求已取消")); },
    });
  });
}

function syncShared(strict = false): void {
  const shared = parseDictionary(readStored(DICTIONARY_CACHE_KEY));
  if (!shared || shared.revision < currentRevision) return;
  if (shared.revision === currentRevision) {
    if (strict && shared.signature !== currentSignature) {
      throw new Error("同版本词典内容冲突");
    }
    return;
  }
  if (canApply(shared)) apply(shared, "cache");
}

async function persist(parsed: ParsedDictionary, source: "cache" | "remote"): Promise<void> {
  if (typeof navigator === "undefined" || !navigator.locks?.request) {
    throw new Error("浏览器不支持安全的跨标签页词典更新");
  }
  await navigator.locks.request(LOCK_NAME, { mode: "exclusive" }, async () => {
    syncShared(true);
    if (!canApply(parsed)) {
      throw new Error("词典版本冲突");
    }
    window.GM_setValue(DICTIONARY_CACHE_KEY, parsed.serialized);
    apply(parsed, source);
  });
}

async function requestDictionary(force: boolean): Promise<void> {
  for (const url of DICTIONARY_SOURCES) {
    let parsed: ParsedDictionary | null;
    try {
      parsed = parseDictionary(await requestSource(url, force));
    } catch {
      continue;
    }
    if (!parsed || !canApply(parsed)) continue;
    try {
      await persist(parsed, "remote");
      return;
    } catch (error) {
      if ((error as Error).message === "词典版本冲突") continue;
      throw error;
    }
  }
  throw new Error("全部词典来源不可用或版本无效");
}

export async function refreshDictionary(): Promise<boolean> {
  if (dictionaryRequest) return dictionaryRequest;
  try {
    syncShared();
  } catch {
    // 启动期共享缓存冲突不致命。
  }
  dictionaryRequest = (async () => {
    try {
      await requestDictionary(false);
      console.info(`[${SCRIPT_NAME}] 词典同步成功`);
      return true;
    } catch {
      console.warn(`[${SCRIPT_NAME}] 词典更新失败，继续使用当前词典`);
      return false;
    }
  })();
  try {
    return await dictionaryRequest;
  } finally {
    dictionaryRequest = null;
  }
}

export function getDictionary(): {
  text: TextDictionary;
  attr: TextDictionary;
  title: TextDictionary;
  icons: TextDictionary;
} {
  return dictionary;
}

export function getRules(): RemoteRules {
  return rules;
}

export function getDictionaryStatus(): {
  version: string;
  revision: number;
  source: string;
  entries: number;
} {
  const text = Object.keys(dictionary.text).length;
  const attr = Object.keys(dictionary.attr).length;
  const title = Object.keys(dictionary.title).length;
  const icons = Object.keys(dictionary.icons).length;
  const sources: Record<string, string> = { cache: "本地缓存", remote: "在线更新", none: "未加载" };
  return {
    version: SCRIPT_VERSION,
    revision: currentRevision,
    source: sources[dictionarySource],
    entries: text + attr + title + icons,
  };
}

export function initRemoteDictionary(onLoaded?: () => void): void {
  loadCached();
  try {
    window.GM_registerMenuCommand?.("立即更新中文词典", () => {
      void refreshDictionary().then((ok) => {
        window.alert(ok ? "中文词典已更新。" : "未能更新，已保留当前词典。请稍后重试。");
      });
    });
    window.GM_registerMenuCommand?.("查看词典状态", () => {
      const status = getDictionaryStatus();
      window.alert(
        `脚本版本：${status.version}\n词典版本：${status.revision}`
        + `\n来源：${status.source}\n有效条目：${status.entries}`,
      );
    });
  } catch {
    // 菜单不可用不影响翻译。
  }
  void refreshDictionary().then((ok) => {
    if (ok && onLoaded) onLoaded();
  });
}
