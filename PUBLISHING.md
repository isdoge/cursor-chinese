# Publishing

这份仓库按「源码 + 单文件 userscript 产物」发布。

- 仓库地址：`https://github.com/isdoge/cursor-chinese`
- 用户安装地址：`https://raw.githubusercontent.com/isdoge/cursor-chinese/main/dist/cursor-chinese.user.js`

## 推荐发布结构

提交到 GitHub：

- `src/`
- `scripts/`
- `dist/`
- `README.md`
- `PUBLISHING.md`
- `LICENSE`
- `package.json`
- `.gitignore`

不要提交：

- `_upload_exclude/`（本地 evidence、抓取 HTML、临时生成脚本；可能含个人页面信息）
- `.codex/`、`.claude/`
- 本地截图与工作单

## 发布前检查

1. 确认 `package.json` 的 `version` 已更新。
2. 确认 `userscript.updateURL` / `downloadURL` 指向当前仓库 Raw 地址。
3. 执行：

```bash
npm test
npm run build
```

4. 确认 `dist/cursor-chinese.user.js` 头部 `@version` 与 `package.json` 一致。
5. 在 Tampermonkey 安装/更新后，于真实 Cursor 页面复验。

## 本地 evidence 测试（可选）

真实页面 evidence 放在 `_upload_exclude/evidence/`（已被 gitignore）。本地维护时可运行：

```bash
npm run test:evidence
```

公开仓库默认 `npm test` 只跑构建与 bundle  sanity，不依赖本地 evidence。
