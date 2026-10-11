<!-- badges -->
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-√-green.svg)](https://www.tampermonkey.net/)

# Cursor 中文化插件

在浏览器端将 Cursor 官网 Dashboard、Agents、Automations、Marketplace 及相关弹层的常见界面文案翻译为简体中文。

[安装脚本](https://raw.githubusercontent.com/isdoge/cursor-chinese/main/dist/cursor-chinese.user.js)
｜
[问题反馈](https://github.com/isdoge/cursor-chinese/issues)

> 浏览器端 userscript，在真实 DOM 上翻译文本与属性，不修改 Cursor 服务端内容。不是 Cursor 桌面客户端汉化包，也不修改 Cursor 官方源码。IDE 汉化请关注 [cursor-v3-chinese-translate](https://github.com/Lovest20018/cursor-v3-chinese-translate)。

## 安装

### 1. 安装 Tampermonkey

- Chrome / Edge：[Chrome Web Store](https://chromewebstore.google.com/search/tampermonkey)
- 官网：[tampermonkey.net](https://www.tampermonkey.net/)

### 2. 安装脚本

打开以下地址，Tampermonkey 会弹出安装确认：

```text
https://raw.githubusercontent.com/isdoge/cursor-chinese/main/dist/cursor-chinese.user.js
```

脚本不内置词典，启动时从 GitHub（jsDelivr 镜像兜底）拉取外置词典并缓存；首次安装如遇 GitHub 不可达，页面保持英文，联网后自动或手动更新即可。

### 3. 刷新页面使用

脚本匹配范围：

- `https://cursor.com/*`
- `https://www.cursor.com/*`

## 脚本菜单

- **立即更新中文词典**：手动拉取最新词典。
- **查看词典状态**：显示脚本版本、词典版本（日期式 revision）、来源与条数。

## 功能

- 汉化 `cursor.com` 上已支持的 Dashboard、Agents、Automations、Marketplace 页面
- 支持文本、按钮、`aria-label`、`title`、`placeholder`、`value`、`data-content` 等属性翻译
- 为常见图标按钮（如 `ellipsis`、`list-filter`）补全无障碍标签
- 兼容单页应用路由切换：自动在路由变更、异步加载、React 文本回写后重翻译
- 支持中英文切换与原文恢复（通过 `window.CursorChinese` API）

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

## 安全与边界

- 不是 Cursor 官方项目，也不是浏览器扩展商店插件；需要 Tampermonkey 等用户脚本管理器。
- 仅处理页面显示文案，词典更新只下载静态 JSON；**不调用 Cursor API，不读取 cookie，不收集或上传账号信息或页面内容，不修改账号真实数据**。
- JSON 只作为词典数据解析，不执行其中的代码。
- 不是整站 100% 完整翻译：插件名、Automation 模板名、模型名、定价、部分动态拼接文本可能保留英文。

发现漏翻最有帮助的反馈方式：提供具体 URL + 英文文案 + 截图。

## 目录

```text
├── src/
│   ├── main.ts                       # 运行时与翻译引擎
│   └── remote-dictionary.ts          # 在线词典加载与更新
├── locales/
│   ├── zh-CN.json                    # 唯一源词典：text / attr / title / icons 分组
│   ├── rules.json                    # 动态文本与属性正则规则
│   └── zh-CN.online.json             # 构建生成的在线 envelope
├── release.config.json               # revision / 词典指纹
├── scripts/
│   ├── build.mjs                     # 生成安装产物与在线词典
│   ├── bump-dictionary.mjs           # 词典变化后递增 revision
│   ├── build.test.mjs
│   └── evidence.test.mjs             # 本地 evidence 校验（可选）
├── dist/
│   └── cursor-chinese.user.js        # 安装产物（词典外置）
├── LICENSE
└── package.json                      # 脚本版本号
```

生成产物不要手工维护。

## 开发与贡献

```sh
npm run dictionary  # 仅词典实际变化时显式运行：递增 revision
npm run build       # 生成安装产物与在线词典
npm test            # 执行构建测试
```

词典未变化时跳过 `dictionary`；`build` 本身不改版本或 revision，词典变化却未迭代配置时应报错。

欢迎提 Issue 或 PR。补翻译建议按以下顺序：

1. 在真实 Cursor 页面确认英文残留位置与文案；反馈中不要包含账号信息或敏感数据。
2. 在 **`locales/zh-CN.json`** 或 `locales/rules.json` 中补充词条，不再把词典写进 `src/`；运行时行为修改才进入 `src/main.ts`。
3. 修改词典后显式运行 `npm run dictionary`，递增 `dictionaryRevision` 并更新指纹，再运行 `npm run build` 与 `npm test`。
4. 回真实页面复验后提交不含私密信息的 PR。

## License

MIT

## 致谢

本项目由 [Codex](https://github.com/openai/codex) 与 [Cursor](https://cursor.com) Agent 辅助完成翻译词典编写、运行时逻辑和构建脚本。
