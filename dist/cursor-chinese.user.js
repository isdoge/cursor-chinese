// ==UserScript==
// @name         Cursor 中文化插件
// @namespace    https://github.com/isdoge/cursor-chinese
// @version      1.0.7
// @description  中文化 cursor 管理控制台界面的部分菜单及内容
// @author       狗带带子
// @match        https://cursor.com/*
// @match        https://www.cursor.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      raw.githubusercontent.com
// @connect      cdn.jsdelivr.net
// @icon         https://ts3.tc.mm.bing.net/th/id/ODF.Vi7Qr3OxcQoUxuIrXygTkw?w=32&h=32&qlt=90&pcl=fffffc&o=6&pid=1.2
// @homepageURL  https://github.com/isdoge/cursor-chinese
// @supportURL   https://github.com/isdoge/cursor-chinese/issues
// @updateURL    https://raw.githubusercontent.com/isdoge/cursor-chinese/main/dist/cursor-chinese.user.js
// @downloadURL  https://raw.githubusercontent.com/isdoge/cursor-chinese/main/dist/cursor-chinese.user.js
// @run-at       document-idle
// ==/UserScript==
(() => {
  const modules = {
    "src/remote-dictionary.ts": (module, exports, require) => {
        const SCRIPT_NAME = "Cursor Chinese";
        const SCRIPT_VERSION = "1.0.7";
        const DICTIONARY_SOURCES = ["https://raw.githubusercontent.com/isdoge/cursor-chinese/main/locales/zh-CN.online.json","https://cdn.jsdelivr.net/gh/isdoge/cursor-chinese@main/locales/zh-CN.online.json","https://raw.githubusercontent.com/isdoge/cursor-chinese/v1.0.7/locales/zh-CN.online.json"];
        const DICTIONARY_CACHE_KEY = "cursor-zh-remote-dictionary-v1";
        const DICTIONARY_MAX_BYTES = 800_000;
        const LOCK_NAME = "cursor-zh-dictionary-commit-v1";
        const EMPTY_DICTIONARY = {
            text: {},
            attr: {},
            title: {},
            icons: {}
        };
        const EMPTY_RULES = {
            regexText: [],
            regexAttr: []
        };
        let currentRevision = 0;
        let currentSignature = null;
        let dictionary = EMPTY_DICTIONARY;
        let rules = EMPTY_RULES;
        let dictionarySource = "none";
        let dictionaryRequest = null;
        function isRecord(value) {
            return typeof value === "object" && value !== null && !Array.isArray(value);
        }
        function validDictionaryPart(part) {
            if (!isRecord(part)) return false;
            const entries = Object.entries(part);
            if (entries.length === 0) return false;
            for (const [key, value] of entries){
                if (!key.trim() || key.length > 4000 || typeof value !== "string" || !value.trim() || value.length > 8000 || [
                    "__proto__",
                    "prototype",
                    "constructor"
                ].includes(key)) return false;
            }
            return true;
        }
        function dictionarySignature(entries) {
            return JSON.stringify(entries.slice().sort(([a], [b])=>a < b ? -1 : a > b ? 1 : 0));
        }
        function parseDictionary(raw) {
            if (typeof raw !== "string" || raw.length > DICTIONARY_MAX_BYTES) return null;
            try {
                const bytes = typeof TextEncoder !== "undefined" ? new TextEncoder().encode(raw).length : encodeURIComponent(raw).replace(/%[\dA-F]{2}/g, "x").length;
                if (bytes > DICTIONARY_MAX_BYTES) return null;
                const data = JSON.parse(raw);
                if (!isRecord(data)) return null;
                if (data.schemaVersion !== 1 || !Number.isSafeInteger(data.revision) || data.revision < 1 || !Number.isSafeInteger(data.entries)) return null;
                const dict = data.dictionary;
                const rls = data.rules;
                if (!isRecord(dict) || !isRecord(rls)) return null;
                const text = dict.text, attr = dict.attr, title = dict.title, icons = dict.icons;
                if (!validDictionaryPart(text) || !validDictionaryPart(attr) || !validDictionaryPart(title) || !validDictionaryPart(icons)) return null;
                if (!Array.isArray(rls.regexText) || !Array.isArray(rls.regexAttr)) return null;
                for (const rule of rls.regexText){
                    if (!isRecord(rule) || typeof rule.pattern !== "string" || patternTooLong(rule.pattern) || typeof rule.replace !== "string" || typeof rule.flags === "string" && /[^gimsuy]/.test(rule.flags)) return null;
                }
                for (const rule of rls.regexAttr){
                    if (!isRecord(rule) || typeof rule.pattern !== "string" || patternTooLong(rule.pattern) || typeof rule.replace !== "string" || typeof rule.flags === "string" && /[^gimsuy]/.test(rule.flags)) return null;
                }
                const entryCount = Object.keys(text).length + Object.keys(attr).length + Object.keys(title).length + Object.keys(icons).length;
                if (data.entries !== entryCount) return null;
                const flat = [
                    ...Object.entries(text),
                    ...Object.entries(attr),
                    ...Object.entries(title),
                    ...Object.entries(icons)
                ];
                const serialized = JSON.stringify({
                    schemaVersion: 1,
                    revision: data.revision,
                    entries: entryCount,
                    dictionary: {
                        text,
                        attr,
                        title,
                        icons
                    },
                    rules: rls
                });
                return {
                    revision: data.revision,
                    dictionary: {
                        text,
                        attr,
                        title,
                        icons
                    },
                    rules: rls,
                    signature: dictionarySignature(flat),
                    serialized
                };
            } catch  {
                return null;
            }
        }
        function patternTooLong(pattern) {
            return pattern.length === 0 || pattern.length > 2000;
        }
        function canApply(parsed) {
            if (parsed.revision < currentRevision) return false;
            if (parsed.revision !== currentRevision) return true;
            return currentSignature === null || parsed.signature === currentSignature;
        }
        function apply(parsed, source) {
            dictionary = parsed.dictionary;
            rules = parsed.rules;
            currentRevision = parsed.revision;
            currentSignature = parsed.signature;
            dictionarySource = source;
        }
        function readStored(key) {
            try {
                if (typeof window.GM_getValue === "function") {
                    return window.GM_getValue(key, "");
                }
            } catch  {}
            return "";
        }
        function loadCached() {
            const saved = parseDictionary(readStored(DICTIONARY_CACHE_KEY));
            if (!saved) return;
            if (canApply(saved)) apply(saved, "cache");
        }
        function requestSource(baseUrl, force) {
            return new Promise((resolve, reject)=>{
                if (typeof window.GM_xmlhttpRequest !== "function") {
                    reject(new Error("GM_xmlhttpRequest 不可用"));
                    return;
                }
                window.GM_xmlhttpRequest({
                    method: "GET",
                    url: baseUrl + (force ? "?refresh=" + Date.now() : ""),
                    timeout: 8000,
                    anonymous: true,
                    headers: {
                        Accept: "application/json"
                    },
                    onload (response) {
                        if (response.status !== 200) {
                            reject(new Error("HTTP " + response.status));
                            return;
                        }
                        resolve(response.responseText);
                    },
                    onerror () {
                        reject(new Error("词典请求失败"));
                    },
                    ontimeout () {
                        reject(new Error("词典请求超时"));
                    },
                    onabort () {
                        reject(new Error("词典请求已取消"));
                    }
                });
            });
        }
        function syncShared(strict = false) {
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
        async function persist(parsed, source) {
            if (typeof navigator === "undefined" || !navigator.locks?.request) {
                throw new Error("浏览器不支持安全的跨标签页词典更新");
            }
            await navigator.locks.request(LOCK_NAME, {
                mode: "exclusive"
            }, async ()=>{
                syncShared(true);
                if (!canApply(parsed)) {
                    throw new Error("词典版本冲突");
                }
                window.GM_setValue(DICTIONARY_CACHE_KEY, parsed.serialized);
                apply(parsed, source);
            });
        }
        async function requestDictionary(force) {
            for (const url of DICTIONARY_SOURCES){
                let parsed;
                try {
                    parsed = parseDictionary(await requestSource(url, force));
                } catch  {
                    continue;
                }
                if (!parsed || !canApply(parsed)) continue;
                try {
                    await persist(parsed, "remote");
                    return;
                } catch (error) {
                    if (error.message === "词典版本冲突") continue;
                    throw error;
                }
            }
            throw new Error("全部词典来源不可用或版本无效");
        }
        async function refreshDictionary() {
            if (dictionaryRequest) return dictionaryRequest;
            try {
                syncShared();
            } catch  {}
            dictionaryRequest = (async ()=>{
                try {
                    await requestDictionary(false);
                    console.info(`[${SCRIPT_NAME}] 词典同步成功`);
                    return true;
                } catch  {
                    console.warn(`[${SCRIPT_NAME}] 词典更新失败，继续使用当前词典`);
                    return false;
                }
            })();
            try {
                return await dictionaryRequest;
            } finally{
                dictionaryRequest = null;
            }
        }
        function getDictionary() {
            return dictionary;
        }
        function getRules() {
            return rules;
        }
        function getDictionaryStatus() {
            const text = Object.keys(dictionary.text).length;
            const attr = Object.keys(dictionary.attr).length;
            const title = Object.keys(dictionary.title).length;
            const icons = Object.keys(dictionary.icons).length;
            const sources = {
                cache: "本地缓存",
                remote: "在线更新",
                none: "未加载"
            };
            return {
                version: SCRIPT_VERSION,
                revision: currentRevision,
                source: sources[dictionarySource],
                entries: text + attr + title + icons
            };
        }
        function initRemoteDictionary(onLoaded) {
            loadCached();
            try {
                window.GM_registerMenuCommand?.("立即更新中文词典", ()=>{
                    void refreshDictionary().then((ok)=>{
                        window.alert(ok ? "中文词典已更新。" : "未能更新，已保留当前词典。请稍后重试。");
                    });
                });
                window.GM_registerMenuCommand?.("查看词典状态", ()=>{
                    const status = getDictionaryStatus();
                    window.alert(`脚本版本：${status.version}\n词典版本：${status.revision}` + `\n来源：${status.source}\n有效条目：${status.entries}`);
                });
            } catch  {}
            void refreshDictionary().then((ok)=>{
                if (ok && onLoaded) onLoaded();
            });
        }

        module.exports = { refreshDictionary, getDictionary, getRules, getDictionaryStatus, initRemoteDictionary };
        },
    "src/main.ts": (module, exports, require) => {
        const { initRemoteDictionary, getDictionary: remoteDictionary, getRules, refreshDictionary } = require("src/remote-dictionary.ts");
        const regexCache = new Map();
        function getRegExp(rule) {
            const key = rule.pattern + "|" + (rule.flags ?? "");
            let re = regexCache.get(key);
            if (re) return re;
            try {
                re = new RegExp(rule.pattern, rule.flags);
            } catch  {
                return null;
            }
            regexCache.set(key, re);
            return re;
        }
        const STORAGE_KEY = "cursor-chinese-language";
        const state = {
            lastHref: location.href,
            language: readLanguagePreference()
        };
        const textRules = ()=>remoteDictionary().text;
        const attrRules = ()=>remoteDictionary().attr;
        const regexTextRules = ()=>getRules().regexText;
        const regexAttrRules = ()=>getRules().regexAttr;
        const titleRules = ()=>remoteDictionary().title;
        const textOriginals = new WeakMap();
        const attrOriginals = new WeakMap();
        const ATTRIBUTES = [
            "aria-label",
            "title",
            "placeholder",
            "value",
            "data-content"
        ];
        function readLanguagePreference() {
            try {
                if (typeof GM_getValue === "function") {
                    const value = GM_getValue(STORAGE_KEY, "zh-CN");
                    return value === "en" ? "en" : "zh-CN";
                }
            } catch  {}
            try {
                return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "zh-CN";
            } catch  {
                return "zh-CN";
            }
        }
        function writeLanguagePreference(language) {
            state.language = language;
            try {
                if (typeof GM_setValue === "function") {
                    GM_setValue(STORAGE_KEY, language);
                }
            } catch  {}
            try {
                localStorage.setItem(STORAGE_KEY, language);
            } catch  {}
        }
        function normalize(value) {
            return value.replace(/\s+/g, " ").trim();
        }
        function translateValue(value, mode = "text") {
            const normalized = normalize(value);
            if (!normalized) return undefined;
            if (/^[\d.%,-]+$/.test(normalized)) return normalized;
            if (/^US\$[0-9,.]+$/.test(normalized)) return normalized;
            if (/^[0-9,.]+ USD$/.test(normalized)) return normalized;
            if (/^[a-z][a-z0-9]+(?:[-.][a-z0-9]+)+$/.test(normalized)) return normalized;
            if ([
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
                "Scan codebase for vulnerabilities"
            ].includes(normalized)) return normalized;
            const exact = mode === "attr" ? attrRules()[normalized] ?? textRules()[normalized] : textRules()[normalized];
            if (exact) return exact;
            const rules = mode === "attr" ? regexAttrRules() : regexTextRules();
            for (const rule of rules){
                const re = getRegExp(rule);
                if (re && re.test(normalized)) {
                    return normalized.replace(re, rule.replace);
                }
            }
            return undefined;
        }
        function shouldSkipTextNode(node) {
            const parent = node.parentElement;
            if (!parent) return true;
            const tag = parent.tagName.toLowerCase();
            if ([
                "script",
                "style",
                "noscript",
                "textarea",
                "input",
                "code",
                "pre"
            ].includes(tag)) return true;
            if (parent.closest("[data-cursor-zh-skip], script, style, noscript, textarea, input, code, pre")) return true;
            return false;
        }
        function translateTextNode(node) {
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
            if (node.nodeValue === nextValue) return;
            node.nodeValue = nextValue;
        }
        function rememberAttr(element, attr, value) {
            let attrs = attrOriginals.get(element);
            if (!attrs) {
                attrs = new Map();
                attrOriginals.set(element, attrs);
            }
            if (!attrs.has(attr)) attrs.set(attr, value);
        }
        function translateAttributes(element) {
            for (const attr of ATTRIBUTES){
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
        function translateElementText(element) {
            const childNodes = Array.from(element.childNodes);
            if (childNodes.length !== 1 || childNodes[0].nodeType !== Node.TEXT_NODE) return;
            translateTextNode(childNodes[0]);
        }
        function applyIconButtonLabels(root) {
            if (state.language !== "zh-CN") return;
            const iconLabels = remoteDictionary().icons;
            for (const icon of Array.from(root.querySelectorAll("[data-icon-name]"))){
                const name = icon.getAttribute("data-icon-name") ?? "";
                const label = iconLabels[name];
                if (!label) continue;
                const button = icon.closest("button, [role='button']");
                if (!button) continue;
                if (!normalize(button.textContent ?? "")) {
                    if (!button.getAttribute("aria-label")) button.setAttribute("aria-label", label);
                    if (!button.getAttribute("title")) button.setAttribute("title", label);
                }
            }
        }
        function walkText(root) {
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
            let node = walker.nextNode();
            while(node){
                translateTextNode(node);
                node = walker.nextNode();
            }
        }
        function translateRoot(root = document.body) {
            if (!root) return;
            if (root instanceof Element) {
                translateAttributes(root);
                translateElementText(root);
            }
            for (const element of Array.from(root.querySelectorAll("*"))){
                translateAttributes(element);
                translateElementText(element);
            }
            walkText(root);
            applyIconButtonLabels(root);
            translateTitle();
        }
        function translateTitle() {
            const titleMap = titleRules();
            const original = titleMap[document.title] ? document.title : undefined;
            if (state.language === "en") return;
            const exact = titleMap[document.title];
            if (exact) {
                document.title = exact;
                return;
            }
            for (const [from, to] of Object.entries(titleMap)){
                if (document.title.includes(from)) {
                    document.title = document.title.replace(from, to);
                    return;
                }
            }
            if (original) document.title = titleMap[original];
        }
        function scheduleTranslate(delay = 60) {
            window.clearTimeout(state.scanTimer);
            state.scanTimer = window.setTimeout(()=>translateRoot(document.body), delay);
        }
        function installRouteWatcher() {
            const notifyRouteChanged = ()=>scheduleTranslate(120);
            const wrapHistory = (name)=>{
                const original = history[name];
                history[name] = function wrappedHistoryMethod(...args) {
                    const result = original.apply(this, args);
                    notifyRouteChanged();
                    return result;
                };
            };
            wrapHistory("pushState");
            wrapHistory("replaceState");
            window.addEventListener("popstate", notifyRouteChanged);
            state.routeTimer = window.setInterval(()=>{
                if (state.lastHref !== location.href) {
                    state.lastHref = location.href;
                    scheduleTranslate(120);
                }
            }, 500);
        }
        function installObserver() {
            state.observer?.disconnect();
            state.observer = new MutationObserver((mutations)=>{
                let shouldScheduleScan = false;
                for (const mutation of mutations){
                    if (mutation.type === "childList") {
                        for (const node of Array.from(mutation.addedNodes)){
                            if (node.nodeType === Node.TEXT_NODE) {
                                translateTextNode(node);
                            } else if (node.nodeType === Node.ELEMENT_NODE) {
                                shouldScheduleScan = true;
                            }
                        }
                    } else if (mutation.type === "attributes") {
                        translateAttributes(mutation.target);
                    } else if (mutation.type === "characterData") {
                        translateTextNode(mutation.target);
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
                characterData: true
            });
        }
        function exposeApi() {
            window.CursorChinese = {
                setLanguage (language) {
                    writeLanguagePreference(language);
                    translateRoot(document.body);
                },
                getLanguage () {
                    return state.language;
                },
                translateNow () {
                    translateRoot(document.body);
                }
            };
        }
        function bootstrap() {
            if (!location.hostname.endsWith("cursor.com")) return;
            initRemoteDictionary(()=>{
                scheduleTranslate(0);
            });
            exposeApi();
            installObserver();
            installRouteWatcher();
            scheduleTranslate(0);
            window.setTimeout(()=>scheduleTranslate(0), 400);
            window.setTimeout(()=>scheduleTranslate(0), 1200);
            window.setTimeout(()=>scheduleTranslate(0), 2500);
            window.setTimeout(()=>scheduleTranslate(0), 5000);
        }
        bootstrap();

        module.exports = {  };
        }
  };

  const cache = {};

  const require = (id) => {
    if (cache[id]) {
      return cache[id].exports;
    }

    if (!modules[id]) {
      throw new Error(`Unknown module: ${id}`);
    }

    const module = { exports: {} };
    cache[id] = module;
    modules[id](module, module.exports, require);
    return module.exports;
  };

  require("src/main.ts");
})();
