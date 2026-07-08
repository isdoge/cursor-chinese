<!-- badges -->
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-√-green.svg)](https://www.tampermonkey.net/)

# Cursor 官网管理界面汉化插件

Cursor 官网 Dashboard、Agents、Automations 及相关弹层的简体中文翻译脚本。

[GitHub](https://github.com/isdoge/cursor-chinese)
｜
[安装脚本](https://raw.githubusercontent.com/isdoge/cursor-chinese/main/dist/cursor-chinese.user.js)
｜
[问题反馈](https://github.com/isdoge/cursor-chinese/issues)

> 浏览器端 userscript，在真实 DOM 上翻译文本与属性，不修改 Cursor 服务端内容。不是 Cursor 桌面客户端汉化包，也不修改 Cursor 官方源码。

## 功能

- 汉化 `cursor.com` 上已支持的 Dashboard、Agents、Automations 页面
- 支持文本、按钮、`aria-label`、`title`、`placeholder`、`value`、`data-content` 等属性翻译
- 为常见图标按钮（如 `ellipsis`、`list-filter`）补全无障碍标签
- 兼容单页应用路由切换：自动在路由变更、异步加载、React 文本回写后重翻译
- 支持中英文切换与原文恢复（通过 `window.CursorChinese` API）

## 不是什么

- 不是 Cursor 桌面 IDE 汉化。IDE汉化请关注 [cursor-v3-chinese-translate](https://github.com/Lovest20018/cursor-v3-chinese-translate)
- 不是浏览器扩展商店插件
- 不是 Cursor 官方项目
- 不是整站 100% 完整翻译

## 截图

> 截图待补充：请在登录后的 Cursor Dashboard 页面截图，放入 `docs/` 目录。

## 安装

### 1. 安装 Tampermonkey

- Chrome / Edge: [Chrome Web Store](https://chromewebstore.google.com/search/tampermonkey)
- 官网: [tampermonkey.net](https://www.tampermonkey.net/)

### 2. 安装脚本

打开以下地址，Tampermonkey 会弹出安装确认：

```text
https://raw.githubusercontent.com/isdoge/cursor-chinese/main/dist/cursor-chinese.user.js
```

### 3. 刷新页面使用

脚本匹配范围：

- `https://cursor.com/*`
- `https://www.cursor.com/*`

### 当前覆盖页面

Agents 与自动化：

- `/agents`
- `/automations`（含 Popular、Code Review、Security、Incidents & Triage、Data & Research 等分类）

Dashboard：

- `/dashboard`
- `/dashboard/settings`
- `/dashboard/cloud-agents`
- `/dashboard/bugbot`（含 `/installation/*`、`/org-repository-rules/*`）
- `/dashboard/security-agents`（含 `/*/checks`）
- `/dashboard/approval-agents`
- `/dashboard/plugins`
- `/dashboard/integrations`
- `/dashboard/api?section=user-keys#user-api-keys`（含 New API Key 弹层常见文案）
- `/dashboard/shared-canvases`
- `/dashboard/members`
- `/dashboard/usage`
- `/dashboard/spending`
- `/dashboard/billing`
- `/marketplace`、`/marketplace/publish`

仍在持续补齐 Marketplace 插件描述、新增 modal 子页、个别动态控件上下文文案。

## 语言切换

默认启用简体中文。可在浏览器控制台调用：

```js
// 切换为英文（恢复原文）
window.CursorChinese.setLanguage("en");

// 切换回简体中文
window.CursorChinese.setLanguage("zh-CN");

// 立即重跑翻译
window.CursorChinese.translateNow();
```

## 项目特点

**DOM 级翻译** — 只替换文本节点与属性值，不整页 HTML 替换，避免破坏 React 组件状态。

**属性翻译** — 同步处理 `aria-label`、`title`、`placeholder`、`value`、`data-content`，减少导航宽度抖动与无障碍标签缺失。

**单页应用兼容** — 监听 `pushState` / `replaceState` / `popstate`、`childList` 与 `characterData`；对无子元素的叶子节点用 `textContent` 整段匹配。

**Marketplace 临时词典** — 动态插件说明放在 `src/marketplace-temp.ts`，与固定 Dashboard 词典分离。

## 目录

```
├── dist/                          # Tampermonkey 安装产物（需提交）
│   └── cursor-chinese.user.js
├── src/
│   ├── main.ts                    # 运行时与翻译词典
│   └── marketplace-temp.ts        # Marketplace 插件描述临时词典
├── scripts/
│   ├── build.mjs
│   ├── build.test.mjs
│   └── evidence.test.mjs          # 本地 evidence 校验（可选）
├── package.json
├── LICENSE
└── .gitignore
```

本地开发材料（不提交）：`_upload_exclude/evidence/` 等，见 [PUBLISHING.md](PUBLISHING.md)。

## 开发

```bash
npm test          # 构建测试 + bundle sanity
npm run build     # 单独构建
```

本地若有 `_upload_exclude/evidence/`，可额外运行：

```bash
npm run test:evidence
```

构建产物：`dist/cursor-chinese.user.js`。

## 已知边界

- 不是所有 `cursor.com` 页面都已覆盖
- 插件名、Automation 模板名、模型名、定价、部分表格列头可能保留英文
- Marketplace 长描述依赖临时词典，Cursor 页面结构变动后可能需要跟进调整
- 某些动态拼接文本、后端枚举值可能残留英文

发现漏翻最有帮助的反馈方式：提供具体 URL + 英文文案 + 截图。

## 贡献

欢迎提 Issue 或 PR。补翻译建议按以下顺序：

1. 在真实 Cursor 页面确认英文残留位置
2. 判断所属路由和属性类型（文本 / `aria-label` / `placeholder` 等）
3. 在 `src/main.ts` 或对应模块里加规则（本地 evidence 可放 `_upload_exclude/evidence/`）
4. 运行 `npm test`（有 evidence 时再加 `npm run test:evidence`）
5. 运行 `npm run build`
6. 回真实页面复验后提交 PR

## License

MIT

## 致谢

本项目由 [Codex](https://github.com/openai/codex) 与 [Cursor](https://cursor.com) Agent 辅助完成翻译词典编写、运行时逻辑和构建脚本。
