import { initRemoteDictionary, getDictionary as remoteDictionary, getRules, refreshDictionary } from "./remote-dictionary";

type LanguagePreference = "en" | "zh-CN";

type RegexRule = {
  pattern: string;
  flags?: string;
  replace: string;
};

const regexCache = new Map<string, RegExp>();

function getRegExp(rule: RegexRule): RegExp | null {
  const key = rule.pattern + "|" + (rule.flags ?? "");
  let re = regexCache.get(key);
  if (re) return re;
  try {
    re = new RegExp(rule.pattern, rule.flags);
  } catch {
    return null;
  }
  regexCache.set(key, re);
  return re;
}

type RuntimeState = {
  observer?: MutationObserver;
  scanTimer?: number;
  routeTimer?: number;
  lastHref: string;
  language: LanguagePreference;
};

declare global {
  interface Window {
    CursorChinese?: {
      setLanguage(language: LanguagePreference): void;
      getLanguage(): LanguagePreference;
      translateNow(): void;
    };
  }

  const GM_getValue:
    undefined | ((key: string, defaultValue?: unknown) => unknown);
  const GM_setValue: undefined | ((key: string, value: unknown) => void);
}

const STORAGE_KEY = "cursor-chinese-language";
const state: RuntimeState = {
  lastHref: location.href,
  language: readLanguagePreference(),
};

// 词典异步加载后才填充，规则一律现取引用，避免固定到空词典
const textRules = () => remoteDictionary().text;

const attrRules = () => remoteDictionary().attr;

const regexTextRules = () => getRules().regexText;
const regexAttrRules = () => getRules().regexAttr;
const titleRules = () => remoteDictionary().title;
const textOriginals = new WeakMap<Text, string>();
const attrOriginals = new WeakMap<Element, Map<string, string>>();
const ATTRIBUTES = [
  "aria-label",
  "title",
  "placeholder",
  "value",
  "data-content",
];

function readLanguagePreference(): LanguagePreference {
  try {
    if (typeof GM_getValue === "function") {
      const value = GM_getValue(STORAGE_KEY, "zh-CN");
      return value === "en" ? "en" : "zh-CN";
    }
  } catch {
    // Ignore userscript storage errors.
  }

  try {
    return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "zh-CN";
  } catch {
    return "zh-CN";
  }
}

function writeLanguagePreference(language: LanguagePreference): void {
  state.language = language;
  try {
    if (typeof GM_setValue === "function") {
      GM_setValue(STORAGE_KEY, language);
    }
  } catch {
    // Ignore userscript storage errors.
  }

  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Ignore localStorage errors.
  }
}

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function translateValue(
  value: string,
  mode: "text" | "attr" = "text",
): string | undefined {
  const normalized = normalize(value);
  if (!normalized) return undefined;

  // Identity: keep plugin names, pricing, model names, table headers as-is.
  if (/^[\d.%,-]+$/.test(normalized)) return normalized;
  if (/^US\$[0-9,.]+$/.test(normalized)) return normalized;
  if (/^[0-9,.]+ USD$/.test(normalized)) return normalized;
  if (/^[a-z][a-z0-9]+(?:[-.][a-z0-9]+)+$/.test(normalized)) return normalized;
  if (
    [
      "Datadog",
      "Slack",
      "Figma",
      "Linear",
      "GitHub",
      "GitLab",
      "Jira",
      "Notion",
      "Sentry",
      "Microsoft Teams",
      "Azure DevOps",
      "Bitbucket Cloud",
      "Pro",
      "Ultra",
      "Business",
      "Enterprise",
      "User API Key",
      "Model",
      "Included",
      "free",
      "Total",
      "Subtotal",
      "Desktop App",
      "Find bugs",
      "Add test coverage",
      "Scan codebase for vulnerabilities",
    ].includes(normalized)
  )
    return normalized;

  const exact =
    mode === "attr"
      ? (attrRules()[normalized] ?? textRules()[normalized])
      : textRules()[normalized];
  if (exact) return exact;

  const rules = mode === "attr" ? regexAttrRules() : regexTextRules();
  for (const rule of rules) {
    const re = getRegExp(rule);
    if (re && re.test(normalized)) {
      return normalized.replace(re, rule.replace);
    }
  }

  return undefined;
}

function shouldSkipTextNode(node: Text): boolean {
  const parent = node.parentElement;
  if (!parent) return true;
  const tag = parent.tagName.toLowerCase();
  if (
    [
      "script",
      "style",
      "noscript",
      "textarea",
      "input",
      "code",
      "pre",
    ].includes(tag)
  )
    return true;
  if (
    parent.closest(
      "[data-cursor-zh-skip], script, style, noscript, textarea, input, code, pre",
    )
  )
    return true;
  return false;
}

function translateTextNode(node: Text): void {
  if (shouldSkipTextNode(node)) return;

  if (!textOriginals.has(node)) {
    textOriginals.set(node, node.nodeValue ?? "");
  }

  const original = textOriginals.get(node) ?? "";
  if (state.language === "en") {
    if (node.nodeValue !== original) node.nodeValue = original;
    return;
  }

  const translated = translateValue(original, "text");
  if (!translated) return;

  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  const nextValue = `${leading}${translated}${trailing}`;
  // Assigning the same value still emits a characterData mutation in browsers.
  // Compare the final whitespace-preserving value to avoid an observer loop.
  if (node.nodeValue === nextValue) return;
  node.nodeValue = nextValue;
}

function rememberAttr(element: Element, attr: string, value: string): void {
  let attrs = attrOriginals.get(element);
  if (!attrs) {
    attrs = new Map<string, string>();
    attrOriginals.set(element, attrs);
  }
  if (!attrs.has(attr)) attrs.set(attr, value);
}

function translateAttributes(element: Element): void {
  for (const attr of ATTRIBUTES) {
    const current = element.getAttribute(attr);
    if (!current) continue;

    rememberAttr(element, attr, current);
    const original = attrOriginals.get(element)?.get(attr) ?? current;

    if (state.language === "en") {
      if (current !== original) element.setAttribute(attr, original);
      continue;
    }

    const translated = translateValue(original, "attr");
    if (translated && current !== translated) {
      element.setAttribute(attr, translated);
    }
  }
}

function translateElementText(element: Element): void {
  const childNodes = Array.from(element.childNodes);
  if (childNodes.length !== 1 || childNodes[0].nodeType !== Node.TEXT_NODE)
    return;
  translateTextNode(childNodes[0] as Text);
}

function applyIconButtonLabels(root: ParentNode): void {
  if (state.language !== "zh-CN") return;
  const iconLabels = remoteDictionary().icons;

  for (const icon of Array.from(root.querySelectorAll("[data-icon-name]"))) {
    const name = icon.getAttribute("data-icon-name") ?? "";
    const label = iconLabels[name];
    if (!label) continue;
    const button = icon.closest("button, [role='button']");
    if (!button) continue;
    if (!normalize(button.textContent ?? "")) {
      if (!button.getAttribute("aria-label"))
        button.setAttribute("aria-label", label);
      if (!button.getAttribute("title")) button.setAttribute("title", label);
    }
  }
}

function walkText(root: ParentNode): void {
  // Keep framework-managed child-node structure intact. Cursor sometimes splits
  // pricing copy across several Text nodes, so replacing element.textContent can
  // trigger a React repair loop that freezes dynamic pages such as /spending.
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    translateTextNode(node as Text);
    node = walker.nextNode();
  }
}

function translateRoot(root: ParentNode = document.body): void {
  if (!root) return;

  if (root instanceof Element) {
    translateAttributes(root);
    translateElementText(root);
  }

  for (const element of Array.from(root.querySelectorAll("*"))) {
    translateAttributes(element);
    translateElementText(element);
  }
  walkText(root);
  applyIconButtonLabels(root);
  translateTitle();
}

function translateTitle(): void {
  const titleMap = titleRules();
  const original = titleMap[document.title] ? document.title : undefined;
  if (state.language === "en") return;
  const exact = titleMap[document.title];
  if (exact) {
    document.title = exact;
    return;
  }
  for (const [from, to] of Object.entries(titleMap)) {
    if (document.title.includes(from)) {
      document.title = document.title.replace(from, to);
      return;
    }
  }
  if (original) document.title = titleMap[original];
}

function scheduleTranslate(delay = 60): void {
  window.clearTimeout(state.scanTimer);
  state.scanTimer = window.setTimeout(
    () => translateRoot(document.body),
    delay,
  );
}

function installRouteWatcher(): void {
  const notifyRouteChanged = () => scheduleTranslate(120);
  const wrapHistory = (name: "pushState" | "replaceState") => {
    const original = history[name];
    history[name] = function wrappedHistoryMethod(
      ...args: Parameters<History[typeof name]>
    ) {
      const result = original.apply(this, args);
      notifyRouteChanged();
      return result;
    } as History[typeof name];
  };

  wrapHistory("pushState");
  wrapHistory("replaceState");
  window.addEventListener("popstate", notifyRouteChanged);

  state.routeTimer = window.setInterval(() => {
    if (state.lastHref !== location.href) {
      state.lastHref = location.href;
      scheduleTranslate(120);
    }
  }, 500);
}

function installObserver(): void {
  state.observer?.disconnect();
  state.observer = new MutationObserver((mutations) => {
    let shouldScheduleScan = false;
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node.nodeType === Node.TEXT_NODE) {
            translateTextNode(node as Text);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Cursor can insert large nested subtrees in one render. Coalesce
            // them into one delayed scan instead of rescanning every added root.
            shouldScheduleScan = true;
          }
        }
      } else if (mutation.type === "attributes") {
        translateAttributes(mutation.target as Element);
      } else if (mutation.type === "characterData") {
        translateTextNode(mutation.target as Text);
      } else {
        shouldScheduleScan = true;
      }
    }
    if (shouldScheduleScan) scheduleTranslate(60);
  });

  state.observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ATTRIBUTES,
    characterData: true,
  });
}

function exposeApi(): void {
  window.CursorChinese = {
    setLanguage(language: LanguagePreference) {
      writeLanguagePreference(language);
      translateRoot(document.body);
    },
    getLanguage() {
      return state.language;
    },
    translateNow() {
      translateRoot(document.body);
    },
  };
}

function bootstrap(): void {
  if (!location.hostname.endsWith("cursor.com")) return;
  initRemoteDictionary(() => {
    scheduleTranslate(0);
  });
  exposeApi();
  installObserver();
  installRouteWatcher();
  scheduleTranslate(0);
  window.setTimeout(() => scheduleTranslate(0), 400);
  window.setTimeout(() => scheduleTranslate(0), 1200);
  window.setTimeout(() => scheduleTranslate(0), 2500);
  window.setTimeout(() => scheduleTranslate(0), 5000);
}

bootstrap();
