import { marketplaceTempTextRules } from "./marketplace-temp";

type LanguagePreference = "en" | "zh-CN";

type RegexRule = {
  pattern: RegExp;
  replace: string;
};

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

const textRules: Record<string, string> = {
  // Common navigation and layout.
  "New Agent": "新建 Agent",
  Agents: "Agents",
  Agent: "Agent",
  Automations: "自动化",
  Dashboard: "仪表盘",
  Bugbot: "Bugbot",
  Settings: "设置",
  "Cloud Agents": "云端 Agents",
  "Security Agents": "安全 Agents",
  "Approval Agents": "审批 Agents",
  Plugins: "插件",
  Integrations: "集成",
  API: "API",
  "Shared Canvases": "共享画布",
  Members: "成员",
  Usage: "用量",
  Spending: "支出",
  Billing: "账单",
  Home: "首页",
  Product: "产品",
  Resources: "资源",
  Changelog: "更新日志",
  Blog: "博客",
  Docs: "文档",
  Community: "社区",
  Learn: "学习",
  Workshops: "工作坊",
  Forum: "论坛",
  Future: "未来计划",
  Careers: "招聘",
  Download: "下载",
  Company: "公司",
  Students: "学生",
  Brand: "品牌",
  Legal: "法律",
  "Terms of Service": "服务条款",
  "Privacy Policy": "隐私政策",
  "Data Use": "数据使用",
  Overview: "概览",
  General: "通用",
  Organization: "组织",
  Organizations: "组织",
  Workspace: "工作区",
  Team: "团队",
  Account: "账户",
  Profile: "个人资料",
  Preferences: "偏好设置",
  Privacy: "隐私",
  Notifications: "通知",
  Theme: "主题",
  Language: "语言",
  Search: "搜索",
  Filter: "筛选",
  Filters: "筛选器",
  Sort: "排序",
  New: "新建",
  Add: "添加",
  Create: "创建",
  Edit: "编辑",
  "Upload image": "上传图片",
  "Add link": "添加链接",
  Delete: "删除",
  Remove: "移除",
  Cancel: "取消",
  Close: "关闭",
  Confirm: "确认",
  Continue: "继续",
  Back: "返回",
  Next: "下一步",
  Previous: "上一步",
  Save: "保存",
  "Save changes": "保存更改",
  "Saving...": "正在保存...",
  Saved: "已保存",
  Copy: "复制",
  Copied: "已复制",
  Connect: "连接",
  Disconnect: "断开连接",
  Connected: "已连接",
  Enable: "启用",
  Disable: "停用",
  Enabled: "已启用",
  Disabled: "已停用",
  Configure: "配置",
  Configuration: "配置",
  Manage: "管理",
  "Learn more": "了解更多",
  "Learn More": "了解更多",
  Status: "状态",
  Name: "名称",
  Description: "描述",
  Created: "已创建",
  "Created at": "创建时间",
  Updated: "已更新",
  "Last used": "上次使用",
  Expires: "过期时间",
  "No results": "没有结果",
  "Loading...": "正在加载...",
  "Load more": "加载更多",
  Error: "错误",
  Success: "成功",
  Warning: "警告",
  Info: "信息",
  Required: "必填",
  Optional: "可选",
  Default: "默认",
  Appearance: "外观",
  System: "跟随系统",
  "Active Sessions": "活跃会话",
  "Desktop App": "Desktop App",
  Revoke: "撤销",
  Prev: "上一页",
  "Log Out": "退出登录",
  Public: "公开",
  Private: "私有",
  "Privacy Mode": "隐私模式",
  "Privacy mode": "隐私模式",
  "Enable Privacy Mode": "启用隐私模式",
  "Disable Privacy Mode": "停用隐私模式",
  "Enable privacy mode": "启用隐私模式",
  "Disable privacy mode": "停用隐私模式",
  "Privacy mode is active": "隐私模式已激活",
  "Privacy mode is enabled": "隐私模式已启用",
  "Share Data": "共享数据",
  "Your codebase, prompts, edits and other usage data will be stored and trained on by Cursor to improve the product.":
    "你的代码库、提示词、编辑和其他使用数据会由 Cursor 存储并用于训练，以改进产品。",
  "Profile Image": "个人资料图片",
  "First Name": "名",
  "Last Name": "姓",
  "Public profile": "公开个人资料",
  "When enabled, your cursor.com profile page is visible to anyone with the link.":
    "启用后，任何拥有链接的人都可以查看你的 cursor.com 个人资料页。",
  "Review Provider": "审查提供商",
  "Choose GitHub or Graphite for pull request links on web and desktop":
    "为网页端和桌面端的拉取请求链接选择 GitHub 或 Graphite。",
  "Session revocation may take up to 10 minutes to complete.":
    "撤销会话最多可能需要 10 分钟完成。",
  "Delete Account": "删除账户",
  "Are you sure you want to delete your account? This action is irreversible.":
    "确定要删除你的账户吗？此操作不可逆。",
  Active: "活跃",
  Inactive: "不活跃",
  Pending: "待处理",
  Owner: "所有者",
  Admin: "管理员",
  Member: "成员",
  Viewer: "查看者",
  "PNG, JPEG, or WebP up to 2 MB": "PNG、JPEG 或 WebP，最大 2 MB",
  Device: "设备",
  "Link 1": "链接 1",
  "Link 2": "链接 2",
  "Link 3": "链接 3",
  "Automatically review and scan code for security-related bugs, issues, and vulnerabilities. Billed at plan rates.":
    "自动审查和扫描代码中的安全相关缺陷、问题和漏洞。按套餐费率计费。",
  "Automated PR Reviews": "自动 PR 审查",
  "Reviews every pull request automatically": "自动审查每个拉取请求",
  "Context-Aware Analysis": "上下文感知分析",
  "Understands your codebase and existing review discussion":
    "理解你的代码库和现有的审查讨论",
  "Inline Findings": "内联发现",
  "Comments directly on risky lines with explanations":
    "直接在风险行上评论并附带说明",
  "Zero Workflow Changes": "零工作流变更",
  "Works directly inside your existing code review process":
    "直接内嵌到你现有的代码审查流程中",
  "Create your first agent": "创建你的第一个 Agent",
  "Security Reviewer": "安全审查者",
  "Reviews pull requests before merge and leaves inline findings":
    "在合并前审查拉取请求并留下内联发现",
  "Checks every PR before merge": "在合并前检查每个 PR",
  "Auth, privacy, injection, and trust-boundary regressions":
    "认证、隐私、注入和信任边界回归",
  "Leaves actionable review comments": "留下可操作的审查评论",
  "Findings appear inline with context for the author":
    "发现结果内联显示，为作者提供上下文",
  "New Reviewer": "新建审查者",
  "Vulnerability Scanner": "漏洞扫描器",
  "Scans at rest code repositories on a schedule": "按计划扫描静态代码仓库",
  "Scans code outside the PR flow": "扫描 PR 流程之外的代码",
  "Great for existing repos, risky areas, and recurring checks":
    "适用于现有仓库、高风险区域和定期检查",
  "Creates trackable agent runs": "创建可追踪的 Agent 运行",
  "Review findings and follow vulnerability history over time":
    "审查发现并持续追踪漏洞历史",
  "New Scanner": "新建扫描器",
  "Automatically approve pull requests and request reviewers when human review is needed. Billed at plan rates.":
    "在需要人工审查时自动批准拉取请求并请求审查者。按套餐费率计费。",
  "Automated PR Approval": "自动 PR 批准",
  "Approves pull requests that meet your review criteria":
    "批准符合你审查标准的拉取请求",
  "Reviewer Routing": "审查者路由",
  "Requests human reviewers when changes need extra attention":
    "当变更需要额外关注时请求人工审查者",
  "Policy-Aware Decisions": "策略感知决策",
  "Applies custom policy files to drive agent decisions":
    "应用自定义策略文件来驱动 Agent 决策",
  "AI Reviewer Aware": "感知 AI 审查者",
  "Uses Bugbot and Security Agent findings in approval decisions":
    "在批准决策中使用 Bugbot 和 Security Agent 的发现",
  "Start with a PR approval workflow, then tune triggers, criteria, and reviewer routing.":
    "从 PR 批准工作流开始，然后调整触发器、标准和审查者路由。",
  "Pull Request Router and Approver": "拉取请求路由与批准器",
  "Auto-approve pull requests when your criteria are met or assign human reviewers when needed":
    "在满足你的标准时自动批准拉取请求，或在需要时分配人工审查者",
  "Approves based on criteria": "基于标准批准",
  "Uses criteria, policies, and AI reviewer context":
    "使用标准、策略和 AI 审查者上下文",
  "Auto-assigns reviewers": "自动分配审查者",
  "Assigns reviewers when human review is needed": "需要人工审查时分配审查者",
  "Extend Cursor with skills, rules, subagents, MCP tools, and hooks":
    "通过技能、规则、子 Agent、MCP 工具和 hooks 扩展 Cursor",
  "No Plugins": "没有插件",
  "Browse the marketplace or import custom plugins to extend":
    "浏览市场或导入自定义插件以扩展",
  "Cursor with Skills, Rules, Agents, Hooks, and MCPs.":
    "包含技能、规则、Agents、Hooks 和 MCP 的 Cursor。",
  "Add Plugin": "添加插件",
  Suggested: "推荐",
  "Browse Marketplace": "浏览市场",
  "Connect external tools to extend your team's workflow.":
    "连接外部工具以扩展团队的工作流。",
  "Disconnect Cursor app": "断开 Cursor 应用",
  "Are you sure you want to disconnect the Cursor app":
    "确定要断开 Cursor 应用吗",
  "? This unlinks the Bitbucket workspace from your team, so Bugbot can no longer comment as Cursor. The app itself stays installed in Bitbucket — a workspace admin can uninstall it there.":
    "这将解除 Bitbucket 工作区与团队之间的关联，Bugbot 将无法再以 Cursor 身份评论。应用本身仍保留在 Bitbucket 中——工作区管理员可以在那里卸载。",

  Datadog: "Datadog",
  "Use Datadog directly in Cursor through a preconfigured Datadog MCP server. Query logs, metrics, traces, dashboards, and more through natural conversation. This plugin is in preview.":
    "通过预配置的 Datadog MCP 服务器直接在 Cursor 中使用 Datadog。可通过自然对话查询日志、指标、链路追踪、仪表盘等。此插件处于预览阶段。",
  View: "查看",
  "Slack MCP server. Search channels, send messages, and perform other Slack actions through MCP-compatible clients.":
    "Slack MCP 服务器。通过兼容 MCP 的客户端搜索频道、发送消息并执行其他 Slack 操作。",
  Figma: "Figma",
  "Plugin that includes the Figma MCP server and Skills for common workflows":
    "包含 Figma MCP 服务器和常用工作流技能的插件",
  "Cursor Plugin for Linear - enables AI assistants to manage issues, projects, documents, and more across your Linear workspace":
    "Cursor 的 Linear 插件，可让 AI 助手管理 Linear 工作区中的问题、项目、文档等",

  // Agents page evidence.
  "No Agents Yet": "还没有 Agent",
  "Connect GitHub": "连接 GitHub",
  "Composer 2.5": "Composer 2.5",
  "Long-running Preview": "长时间运行预览",
  Preview: "预览",
  "Upgrade for access": "升级以获取访问权限",
  "Explore Marketplace": "浏览市场",
  "Create an Automation": "创建自动化",
  "Wait for approval after planning": "规划后等待审批",
  "Running on Auto": "正在使用 Auto 运行",
  "Usage limits reached. This Agent is running on Auto for free.":
    "已达到用量限制。此 Agent 正在免费使用 Auto 运行。",
  "Edit limits": "编辑限制",
  "Continue with Auto": "继续使用 Auto",
  "Cloud agents previously used 1M context window size by default. Now, you can use the Edit button next to your selected model to choose your balance of capability and cost.":
    "云端 Agent 此前默认使用 100 万 token 上下文窗口。现在，你可以点击所选模型旁的「编辑」按钮，在能力与成本之间做权衡。",
  "Select repository": "选择仓库",
  "Add repository": "添加仓库",
  "Add Repositories": "添加仓库",
  "Add Environment": "添加环境",
  Refresh: "刷新",
  "All repositories": "所有仓库",
  "All Repositories": "所有仓库",
  "Select repositories...": "选择仓库...",
  "repositories...": "仓库...",
  "Select multiple": "多选",
  "Select Multiple": "多选",
  "Set Up Cloud Agents": "设置云端 Agents",
  "Give Agents a Computer": "给 Agents 一台计算机",
  "Cloud agents ship better code and run faster when you set up their development environment.":
    "设置开发环境后，云端 Agents 能交付更好的代码，运行也更快。",
  "Get started": "开始使用",
  "Use Multiple Models": "使用多个模型",
  "Multiple models cannot be combined with Long-running.":
    "多模型无法与长时间运行同时使用。",
  "Run security audit": "运行安全审计",

  // Automations page evidence.
  Popular: "热门",
  "Code Review": "代码审查",
  Security: "安全",
  "Incidents & Triage": "事故与分诊",
  "Data & Research": "数据与研究",
  "Find bugs": "Find bugs",
  "Analyze recent commits for high-severity correctness bugs and submit safe fixes":
    "分析近期提交中的高严重性正确性缺陷，并提交安全修复",
  "Scan codebase for vulnerabilities": "Scan codebase for vulnerabilities",
  "Review the full repository on a schedule and alert on validated high-impact security issues":
    "按计划审查整个仓库，并对已验证的高影响安全问题发出警报",
  "Generate docs": "生成文档",
  "Create and update developer documentation for recently changed or under-documented code":
    "为近期变更或文档不足的代码创建并更新开发者文档",
  "Add test coverage": "Add test coverage",
  "Review recent changes and add tests for high-risk logic that lacks adequate coverage":
    "审查近期变更，并为缺乏充分覆盖的高风险逻辑添加测试",
  "Scheduled, Slack": "定时，Slack",
  Scheduled: "定时",
  Slack: "Slack",
  "New Automation": "新建自动化",
  "Create automation": "创建自动化",
  Automation: "自动化",
  Automated: "已自动化",
  Schedule: "计划",
  Trigger: "触发器",
  Template: "模板",
  Templates: "模板",
  "Save time by automating repetitive tasks with always-on agents that respond to triggers.":
    "通过始终在线、响应触发器的 Agent 自动化重复任务，节省时间。",
  "Analyze recent cloud agent runs to root-cause environment setup failures from setup logs, transcripts, and environment info, then report them in Slack":
    "分析近期云端 Agent 运行记录，结合安装日志、对话记录和环境信息定位环境配置失败根因，并在 Slack 中报告。",

  // Dashboard and settings.
  "Cursor Dashboard": "Cursor 仪表盘",
  Plan: "套餐",
  "Current plan": "当前套餐",
  Upgrade: "升级",
  "Upgrade plan": "升级套餐",
  "Manage plan": "管理套餐",
  Pro: "Pro",
  Ultra: "Ultra",
  Business: "Business",
  Enterprise: "Enterprise",
  Personal: "个人",
  "Team settings": "团队设置",
  "Organization settings": "组织设置",
  "Usage limits": "用量限制",
  "Rate limits": "速率限制",
  Model: "模型",
  Models: "模型",
  Repository: "仓库",
  Repositories: "仓库",
  Branch: "分支",
  Branches: "分支",
  "Pull request": "拉取请求",
  "Pull requests": "拉取请求",
  "Pull Requests": "拉取请求",
  Issues: "问题",

  // Cloud / background agents.
  "Background Agents": "后台 Agents",
  "Cloud Agent": "云端 Agent",
  "Run Agent": "运行 Agent",
  "Start Agent": "启动 Agent",
  "Stop Agent": "停止 Agent",
  "Create Agent": "创建 Agent",
  "Agent settings": "Agent 设置",
  Environment: "环境",
  Environments: "环境",
  "MCP servers": "MCP 服务器",
  Skills: "技能",
  Files: "文件",
  "Add files": "添加文件",
  "Add skills": "添加技能",
  "Add MCP server": "添加 MCP 服务器",
  "Create Agents to edit and run code, asynchronously":
    "创建 Agent 以异步编辑和运行代码",
  "Cloud Agents push code to your remote so you can review and merge their changes.":
    "Cloud Agents 会将代码推送到你的远端，方便你审查并合并更改。",
  "Connect Source Control": "连接源码控制",
  "Self-Hosted": "自托管",
  "Monitor and manage your self-hosted cloud machines":
    "监控并管理你的自托管云机器",
  "Enable self-hosted pool": "启用自托管池",
  "Enable self-hosted pool to create a personal pool of workers.":
    "启用自托管池以创建个人工作节点池。",
  "Remote Control": "远程控制",
  "Enable remote-control": "启用远程控制",
  "Control your local agents remotely from mobile and web.":
    "通过移动端和网页远程控制你的本地 Agents。",
  "My Machines": "我的机器",
  "View personal self-hosted workers and CLI commands to connect machines.":
    "查看个人自托管工作节点以及连接机器的 CLI 命令。",
  Defaults: "默认值",
  "Default Model": "默认模型",
  "Used when no model is specified": "未指定模型时使用",
  "Used when no repository is specified": "未指定仓库时使用",
  "Select model": "选择模型",
  "Default Repository": "默认仓库",
  "Connect Git": "连接 Git",
  "Base Branch": "基础分支",
  "When empty, Cloud Agent will use a repository's default branch (recommended)":
    "留空时，Cloud Agent 将使用仓库的默认分支（推荐）",
  "Branch Prefix": "分支前缀",
  "Branch name...": "分支名...",
  "cursor/": "cursor/",
  "Prefix for branch names created by Cloud Agent":
    "Cloud Agent 创建的分支名称前缀",
  "Create PRs": "创建 PR",
  "Automatically create a pull request when Cloud Agent completes.":
    "Cloud Agent 完成后自动创建拉取请求。",
  "For Single Model Runs": "单模型运行时",
  "Slack Notifications": "Slack 通知",
  "Get notified in Slack when a Cloud Agent completes a task":
    "Cloud Agent 完成任务时在 Slack 中接收通知",
  "Slack routing": "Slack 路由",
  "Routing rules to help Cloud Agents pick the right repository or environment.":
    "用于帮助 Cloud Agents 选择正确仓库或环境的路由规则。",
  "Add Rule": "添加规则",
  "No routing rules yet": "还没有路由规则",
  "Network Access Settings": "网络访问设置",
  "Control which network destinations your cloud agents can access":
    "控制云端 Agents 可以访问哪些网络目标",
  "Allow all network access": "允许所有网络访问",
  "My Secrets": "我的密钥",
  "Securely set environment variables for your Cloud Agents.":
    "为你的 Cloud Agents 安全设置环境变量。",
  "Add Secrets": "添加密钥",
  "No secrets yet": "还没有密钥",
  "No environments configured": "尚未配置环境",
  "Start Setup": "开始设置",
  "Create a New Environment": "创建新环境",
  "Development environment setup": "开发环境配置",
  "No pushed changes": "没有已推送的更改",
  "Environment is ready to be saved.": "环境已可保存。",
  "Environment setup takes ~5–20 minutes.": "环境配置大约需要 5–20 分钟。",
  "Notify me": "通知我",
  "Add follow up for setup agent": "为配置 Agent 添加后续消息",
  "Select one or more repositories.": "选择一个或多个仓库。",
  "Allow posting artifacts to GitHub": "允许将产物发布到 GitHub",
  "Allow cloud agents to embed images directly in PR descriptions using hard-to-guess public URLs.":
    "允许云端 Agent 使用难以猜测的公开 URL，将图片直接嵌入 PR 描述。",
  "Post Artifact": "发布产物",
  "Link Only": "仅链接",
  Always: "始终",
  Never: "从不",
  "Routing rules": "路由规则",
  "Description...": "描述...",
  Select: "选择",
  "Defaults + my allowlist": "默认值 + 我的允许列表",
  "My allowlist only": "仅我的允许列表",
  Value: "值",
  "Paste your .env or type a secret name (optional)":
    "粘贴 .env 文件或输入密钥名称（可选）",
  "Apply to:": "应用于：",

  // Bugbot / security / approval agents.
  "Configure Bugbot": "配置 Bugbot",
  "Install Bugbot": "安装 Bugbot",
  "Bug reports": "缺陷报告",
  "Review bugs": "审查缺陷",
  "Security reports": "安全报告",
  Vulnerabilities: "漏洞",
  Scan: "扫描",
  "Scan now": "立即扫描",
  Approvals: "审批",
  Approval: "审批",
  "Approval rules": "审批规则",
  "Approval requests": "审批请求",
  "Require approval": "需要审批",
  Approve: "批准",
  Reject: "拒绝",
  "Automatically review pull requests (PRs) for bugs and issues. Bugbot runs are billed based on underlying agent usage.":
    "自动审查拉取请求（PR）中的缺陷和问题。Bugbot 运行会基于底层 Agent 用量计费。",
  "Automatically review pull requests (PRs) for bugs and issues.":
    "自动审查拉取请求（PR）中的缺陷和问题。",
  "Bugbot runs are billed based on underlying agent usage.":
    "Bugbot 运行会基于底层 Agent 用量计费。",
  "Auto-Enable for New Repositories": "为新仓库自动启用",
  "Review Draft PRs": "审查 Draft PR",
  "Run Once Per PR": "每个 PR 仅运行一次",
  "Review when opened, ignore new commits": "打开时审查，忽略新提交",
  "Post PR Summary": "发布 PR 摘要",
  "In Description": "写入描述",
  "As Comment": "作为评论",
  Off: "关",
  "Repository Rules": "仓库规则",
  "Automatically Learn Rules": "自动学习规则",
  "Allow Bugbot to learn new rules based on PR activity":
    "允许 Bugbot 根据 PR 活动学习新规则",
  Autofix: "自动修复",
  "Automatically create fixes for issues found by Bugbot":
    "自动为 Bugbot 发现的问题创建修复",
  "Autofix Behavior": "自动修复行为",
  "Where fixes are applied": "修复应用位置",
  "Severity Threshold": "严重级别阈值",
  "Severity levels to fix automatically": "自动修复的严重级别",
  "New Branch (Recommended)": "新分支（推荐）",
  "Push fixes to a new branch": "将修复推送到新分支",
  "Existing Branch": "现有分支",
  "Push fixes to your branch": "将修复推送到你的分支",
  "All repos": "所有仓库",
  "Enable All": "全部启用",
  "Disable All": "全部禁用",
  "Bugbot enabled": "Bugbot 已启用",
  "BugBot enabled": "Bugbot 已启用",
  "Learned and manually-created rules. Version control Rules with":
    "已学习规则与手动创建的规则。通过版本控制管理规则，配合",
  "Learned Rules": "已学习规则",
  "No organizations with Bugbot enabled": "没有已启用 Bugbot 的组织",
  "Enable Bugbot for at least one organization to start using repository rules.":
    "在至少一个组织上启用 Bugbot 后，即可开始使用仓库规则。",
  "Enable repositories": "启用仓库",
  "Bugbot automatically updates learned rules from pull requests and feedback. You can also teach rules by commenting \"@cursor remember [fact]\" in a pull request.":
    "Bugbot 会根据拉取请求和反馈自动更新已学习规则。你也可以在 PR 中评论「@cursor remember [事实]」来教它新规则。",
  "Manual rules let you add repository-specific guidance for Bugbot reviews.":
    "手动规则可让你为 Bugbot 审查添加仓库专属指导。",
  "Add Manual Rule": "添加手动规则",
  Content: "内容",
  "Maximum 20000 characters (leading and trailing spaces are removed when you save).":
    "最多 20000 个字符（保存时会移除首尾空格）。",
  "Scoped Paths": "作用路径",
  "(optional)": "（可选）",
  "Limit this rule to specific files or directories. Leave empty to apply repo-wide.":
    "将此规则限制到特定文件或目录。留空则应用于整个仓库。",
  "GitHub Connections": "GitHub 连接",
  "Manage connected accounts and repositories": "管理已连接的账户和仓库",
  "GitLab Connections": "GitLab 连接",
  "Bugbot reviews are billed through your Cursor plan usage":
    "Bugbot 审查会计入你的 Cursor 套餐用量",
  "Enable Bugbot": "启用 Bugbot",
  "Enable Bugbot on a repository to get started":
    "先在某个仓库上启用 Bugbot 以开始使用",
  "To start using Bugbot, you need to enable it on at least one repository. Select an organization below to get started.":
    "要开始使用 Bugbot，你需要在至少一个仓库上启用它。请在下方选择一个组织以开始。",
  "Repositories Enabled": "已启用仓库",
  "Reviews pull requests for security vulnerabilities, auth regressions, and injection attacks.":
    "审查拉取请求中的安全漏洞、认证回归和注入攻击。",
  Triggers: "触发器",
  "PR Opened": "PR 打开时",
  "PR Pushed": "PR 推送时",
  organizations: "组织",
  repositories: "仓库",
  "Refresh organizations": "刷新组织",
  "Add organizations": "添加组织",
  "Enable all": "全部启用",
  Clear: "清除",
  Anyone: "任何人",
  "Specific People": "指定人员",
  "Security Checks": "安全检查",
  "Built-in Checks": "内置检查",
  "Every PR is automatically checked against these categories. Toggle off any you don't need.":
    "每个 PR 都会自动对照这些类别进行检查。可关闭不需要的类别。",
  "General Security": "通用安全",
  "Auth and authorization regressions, injection vulnerabilities, privilege escalation, secret and credential exposure.":
    "认证与授权回归、注入漏洞、权限提升、密钥与凭据泄露。",
  "AI & Agent Trust Boundaries": "AI 与 Agent 信任边界",
  "Prompt injection, unsafe tool auto-approval, model-controlled input reaching privileged execution paths, fail-open behavior in agent infrastructure.":
    "提示词注入、不安全的工具自动批准、模型控制的输入进入特权执行路径、Agent 基础设施中的 fail-open 行为。",
  "Filesystem & Resource Access": "文件系统与资源访问",
  "Path traversal, sandbox escape, symlink attacks, unvalidated file paths from user or model-controlled input.":
    "路径遍历、沙箱逃逸、符号链接攻击、来自用户或模型控制输入的未验证文件路径。",
  "Privacy & Data Handling": "隐私与数据处理",
  "Unauthorized data egress, missing consent or privacy mode checks, sensitive data written to logs, analytics, or storage without classification guards.":
    "未经授权的数据外泄、缺少同意或隐私模式检查、敏感数据未经分类保护写入日志/分析/存储。",
  "Product & Platform Patterns": "产品与平台模式",
  "Unauthenticated endpoints, session/auth context mutation, TLS configuration, CSP and trusted types exceptions. Configurable per team.":
    "未认证端点、会话/认证上下文变更、TLS 配置、CSP 与 trusted types 例外。可按团队配置。",
  "API & RPC Privilege": "API 与 RPC 权限",
  "Newly added endpoints or procedures that expose privileged operations without proper access controls. Delta-focused — only fires on net-new surface area.":
    "新增的端点或过程在未实施适当访问控制的情况下暴露特权操作。聚焦增量——仅在新增暴露面时触发。",
  "Config & Template Injection": "配置与模板注入",
  "Unsafe data wired into configuration files, templates, or rendering pipelines where the vulnerability is in how data flows into declarative layers.":
    "不安全的数据流入配置文件、模板或渲染管道，漏洞在于数据如何进入声明式层。",
  "checks enabled during review": "审查期间启用的检查",
  "Custom Instruction": "自定义指令",
  "e.g. Always check for SQL injection vulnerabilities in any database query. Flag any use of string concatenation in SQL statements...":
    "例如：始终检查任何数据库查询中的 SQL 注入漏洞。标记 SQL 语句中使用字符串拼接的情况……",
  "Provide a single custom instruction for the Security Agent to follow when reviewing pull requests.":
    "提供一条自定义指令，供 Security Agent 在审查拉取请求时遵循。",
  "Tools and MCPs": "工具与 MCP",
  "Comment on Pull Request": "在 Pull Request 上评论",
  "Add an MCP server to give this agent access to its tools. You can instruct the agent on how it should use MCP tools in the custom instruction":
    "添加 MCP 服务器，让此 Agent 访问其工具。你可以在自定义指令中说明 Agent 应如何使用 MCP 工具。",
  "Add an MCP server to give this agent access to its tools.":
    "添加 MCP 服务器，让此 Agent 访问其工具。",
  "You can instruct the agent on how it should use MCP tools in the custom prompt.":
    "你可以在自定义提示词中说明 Agent 应如何使用 MCP 工具。",
  "You can instruct the agent on how it should use MCP tools in the custom instruction.":
    "你可以在自定义指令中说明 Agent 应如何使用 MCP 工具。",
  "New connection": "新建连接",
  Users: "用户",
  "Approves pull requests when configured review signals and approval criteria are satisfied.":
    "当配置的审查信号和批准标准满足时，批准拉取请求。",
  "Add trigger": "添加触发器",
  "Add Trigger": "添加触发器",
  "Discard & go back": "放弃并返回",
  Discard: "放弃",
  "Select Orgs": "选择组织",
  "Send to Slack": "发送到 Slack",
  in: "在",
  by: "由",
  "Configure additional review signals when deciding whether this agent can approve a pull request.":
    "在决定此 Agent 是否可以批准拉取请求时，配置额外的审查信号。",
  "Use Bugbot Review Context": "使用 Bugbot 审查上下文",
  "Include Bugbot review context in the approval decision.":
    "在批准决策中包含 Bugbot 审查上下文。",
  "Use Security Review Context": "使用 Security 审查上下文",
  "Include Security Agent review context in the approval decision.":
    "在批准决策中包含 Security Agent 审查上下文。",
  "Use Risk Score": "使用风险评分",
  "Classify PR risk before approving. Tune classification in the custom prompt.":
    "批准前对 PR 风险进行分类。在自定义提示词中调整分类规则。",
  "Maximum Risk for Approval": "批准的最高风险",
  "The highest risk score the agent can approve.":
    "Agent 可以批准的最高风险分数。",
  "Approval Policies": "批准策略",
  "Optionally configure in-repo policies to apply product and boundary-specific approval instructions.":
    "可选：在仓库内配置策略，以应用产品和边界相关的批准指令。",
  "Approval and Routing Policies": "批准与路由策略",
  "Configured in your repository with policy files; no dashboard setup is required.":
    "通过仓库中的策略文件配置；无需在仪表盘额外设置。",
  "Custom Prompt": "自定义提示词",
  "e.g. Only approve when there are no Bugbot and Security Review findings...":
    "例如：仅当没有 Bugbot 和 Security 审查发现时才批准……",
  "Provide additional approval criteria for this Approval Agent.":
    "为此 Approval Agent 提供额外的批准标准。",
  "Source Control Providers": "源码控制提供商",

  // Plugins and integrations.
  Installed: "已安装",
  "Installed plugins": "已安装插件",
  Marketplace: "市场",
  "Cursor Marketplace": "Cursor 市场",
  "Cursor Marketplace Plugins": "Cursor 市场插件",
  "Cursor Plugins": "Cursor 插件",
  "Publish Plugin": "发布插件",
  "Publish a Plugin": "发布插件",
  "Publish a plugin": "发布插件",
  "Publish a Cursor Marketplace Plugin": "发布 Cursor 市场插件",
  "Submit your plugin publisher application to list your plugin in the Cursor Marketplace.":
    "提交插件发布者申请，以便将插件列入 Cursor 市场。",
  Publisher: "发布者",
  "Publisher name": "发布者名称",
  "Publisher Name": "发布者名称",
  "Publisher Application": "发布者申请",
  "Create publisher profile": "创建发布者资料",
  "Submit plugin": "提交插件",
  "Submit Plugin": "提交插件",
  "Submit application": "提交申请",
  "Submit Application": "提交申请",
  "Submit for review": "提交审核",
  "Submit for Review": "提交审核",
  "Plugin name": "插件名称",
  "Plugin Name": "插件名称",
  "Plugin description": "插件说明",
  "Plugin Description": "插件说明",
  "Short description": "简短说明",
  "Long description": "详细说明",
  "Display name": "显示名称",
  "Display Name": "显示名称",
  "Plugin ID": "插件 ID",
  "Plugin slug": "插件标识符",
  Slug: "标识符",
  Icon: "图标",
  "Repository URL": "仓库 URL",
  "Website URL": "网站 URL",
  "Source URL": "源码 URL",
  "Package URL": "包 URL",
  "Install URL": "安装 URL",
  "GitHub repository": "GitHub 仓库",
  "GitHub Repository": "GitHub 仓库",
  Manifest: "Manifest",
  "Manifest URL": "Manifest URL",
  "Manifest file": "Manifest 文件",
  "Plugin manifest": "插件 Manifest",
  Author: "作者",
  Version: "版本",
  Website: "网站",
  Category: "分类",
  Categories: "分类",
  Publish: "发布",
  "Submitting...": "正在提交...",
  Submitted: "已提交",
  Review: "审核",
  "In review": "审核中",
  "Add plugin": "添加插件",
  Install: "安装",
  Uninstall: "卸载",
  GitHub: "GitHub",
  GitLab: "GitLab",
  Linear: "Linear",
  Jira: "Jira",
  Notion: "Notion",
  Sentry: "Sentry",

  // API keys.
  "API Keys": "API 密钥",
  "API keys": "API 密钥",
  "User API Keys": "用户 API 密钥",
  "User API keys": "用户 API 密钥",
  "New API Key": "新建 API 密钥",
  "Create API Key": "创建 API 密钥",
  "Create API key": "创建 API 密钥",
  "API key": "API 密钥",
  "API key name": "API 密钥名称",
  "Key name": "密钥名称",
  Expiration: "过期时间",
  "No expiration": "永不过期",
  "Copy API key": "复制 API 密钥",
  "Your API key": "你的 API 密钥",
  "This key will only be shown once.": "此密钥只会显示一次。",
  "Make sure to copy it now.": "请务必现在复制保存。",
  "Create key": "创建密钥",
  "User keys": "用户密钥",
  "Organization keys": "组织密钥",
  Secret: "密钥",
  Token: "令牌",

  // Shared canvases.
  Canvas: "画布",
  Canvases: "画布",
  "Shared Canvas": "共享画布",
  "No shared canvases": "没有共享画布",
  Share: "共享",
  Unshare: "取消共享",

  // Members.
  "Back to Agents": "返回 Agents",
  "Billing & Invoices": "账单与发票",
  "Getting started": "快速开始",
  "0/4 Completed": "已完成 0/4",
  "Connect GitHub or GitLab": "连接 GitHub 或 GitLab",
  "Connect Slack": "连接 Slack",
  "Link your source control provider to start shipping software with agents.":
    "连接你的源码控制提供商，开始使用 Agent 交付软件。",
  "Extend Cursor with plugins": "通过插件扩展 Cursor",
  "Set up cloud for faster, parallelized agents that verify their work":
    "设置云环境以获得更快、并行化的 Agent，它们会自动验证自己的工作",
  "Upgrade to Pro+": "升级到 Pro+",
  "Upgrade to Ultra": "升级到 Ultra",
  Current: "当前",
  "Adjust Plan": "调整套餐",
  "Enable On-Demand Usage": "启用按需用量",
  "AI Line Edits": "AI 行编辑",
  All: "所有",
  Tab: "Tab",
  Fewer: "更少",
  More: "更多",
  "Source Control": "源码控制",
  "Azure DevOps": "Azure DevOps",
  "Bitbucket Cloud": "Bitbucket Cloud",
  "Connect GitHub for Cloud Agents, Bugbot and enhanced codebase context":
    "连接 GitHub 以使用 Cloud Agents、Bugbot 和增强的代码库上下文",
  "Connect GitLab for Cloud Agents, Bugbot and enhanced codebase context":
    "连接 GitLab 以使用 Cloud Agents、Bugbot 和增强的代码库上下文",
  "Connect Azure DevOps for Cloud Agents and enhanced codebase context":
    "连接 Azure DevOps 以使用 Cloud Agents 和增强的代码库上下文",
  "Connect Bitbucket Cloud for Cloud Agents and enhanced codebase context":
    "连接 Bitbucket Cloud 以使用 Cloud Agents 和增强的代码库上下文",
  "Source Control Integrations": "源码控制集成",
  "No Usage Data": "没有用量数据",
  "View Details": "查看详情",
  "View all": "查看全部",
  "See all": "查看全部",
  "Show more": "显示更多",
  "Show less": "显示更少",
  "Invite member": "邀请成员",
  "Invite members": "邀请成员",
  "Invite people": "邀请成员",
  Email: "邮箱",
  Emails: "邮箱",
  Role: "角色",
  "Send invite": "发送邀请",
  "Resend invite": "重新发送邀请",
  "Remove member": "移除成员",
  "Transfer ownership": "转移所有权",
  Seat: "席位",
  Seats: "席位",

  "Popular Code Review Security Incidents & Triage Data & Research":
    "热门 代码审查 安全 事故与分诊 数据与研究",
  "Connect Bitbucket Cloud for Cloud Agents, Bugbot and enhanced codebase context":
    "连接 Bitbucket Cloud 以使用 Cloud Agents、Bugbot 和增强的代码库上下文",
  "Connect a Jira site to delegate issues to Cloud Agents":
    "连接 Jira 站点，把问题委派给 Cloud Agents",
  "Connect a Linear workspace to delegate issues to Cloud Agents":
    "连接 Linear 工作区，把问题委派给 Cloud Agents",
  "Microsoft Teams": "Microsoft Teams",
  "Use Sentry issue events in Automations": "在自动化中使用 Sentry 问题事件",
  "Work with Cloud Agents from Microsoft Teams":
    "在 Microsoft Teams 中使用 Cloud Agents",
  "Work with Cloud Agents from Slack": "在 Slack 中使用 Cloud Agents",
  "Customize Cursor with MCPs, skills, rules, subagents, and more.":
    "通过 MCP、技能、规则、子 Agent 等自定义 Cursor。",
  "Integrate Cursor with Slack. Then tag @Cursor to kick off agents with full context of your thread.":
    "将 Cursor 与 Slack 集成。然后在 Slack 中 @Cursor，即可基于完整线程上下文启动 Agent。",
  "Cloud agents test and send demos of their code and let you ship from your phone, Slack, GitHub, and more.":
    "云端 Agent 会测试并发送代码演示，让你通过手机、Slack、GitHub 等方式交付。",
  "Get 3x more usage than Pro, unlock higher limits on Agent, and more.":
    "相比 Pro 获得 3 倍用量，解锁更高的 Agent 上限等更多权益。",
  "On-Demand Usage is Off": "按需用量已关闭",
  "Go beyond your plan's included quota with on-demand usage":
    "通过按需用量超出套餐包含的配额",
  "Tab Completions": "Tab 补全",
  "Agent Lines of Code": "Agent 代码行数",
  "Manage in GitHub": "在 GitHub 中管理",
  Reconnect: "重新连接",
  "Most Active Month": "最活跃月份",
  "Most Active Day": "最活跃日期",
  "Longest Streak": "最长连续天数",
  "Current Streak": "当前连续天数",
  "Connected as": "已连接为",
  "to repositories accessible in organizations:":
    "可访问以下组织中的仓库：",
  // Usage / spending / billing.
  Credits: "额度",
  Included: "Included",
  free: "free",
  "Included usage": "包含用量",
  "Included Usage": "包含用量",
  Overage: "超额用量",
  "Spend limit": "支出上限",
  "Monthly spend": "月度支出",
  Total: "总计",
  Subtotal: "小计",
  Amount: "金额",
  Date: "日期",
  Invoice: "发票",
  Invoices: "发票",
  Payment: "付款",
  "Payment method": "付款方式",
  "Billing email": "账单邮箱",
  "Billing details": "账单详情",
  "Manage billing": "管理账单",
  Subscription: "订阅",
  Renewal: "续订",
  "Usage-based pricing": "按用量计费",
  "Current billing period": "当前账单周期",
  Remaining: "剩余",
  Used: "已用",
  Scope: "作用域",
  Actions: "操作",
  "Will be generated": "将自动生成",
  "N/A": "无",
  "No API Keys Yet": "暂无 API 密钥",
  "No API Keys have been created yet": "尚未创建任何 API 密钥",
  "User API Key": "User API Key",
  "New User API Key": "新建用户 API 密钥",
  "User API Key Created": "用户 API 密钥已创建",
  "Delete User API Key": "删除用户 API 密钥",
  "Are you sure you want to delete the": "确定要删除",
  "? Any existing integrations using this key will no longer work.":
    "？任何使用此密钥的集成将无法继续工作。",
  "This action cannot be undone.": "此操作不可撤销。",
  "Your new": "您的新",
  "has been created. Copy this key now as it won't be shown again.":
    "已创建。请立即复制此密钥，之后将不再显示。",
  "For security reasons, this key is only displayed once and cannot be retrieved later. If you lose it, you'll need to create a new one.":
    "出于安全考虑，此密钥仅显示一次，之后无法找回。如果丢失，您需要创建一个新的。",
  Done: "完成",
  "Token will be generated after you create this key. You'll only see the full secret once — copy it before closing the next dialog.":
    "密钥将在创建后生成。您只会看到完整密钥一次——请在关闭下一个对话框前复制。",
  "SDK docs": "SDK 文档",
  "API docs": "API 文档",
  "TypeScript and Python SDKs for building with Cursor agents.":
    "用于构建 Cursor 智能体的 TypeScript 和 Python SDK。",
  "Cloud Agent API reference for programmatic access.":
    "用于编程访问的 Cloud Agent API 参考。",
  "Manage API keys and service accounts for programmatic access to Cursor.":
    "管理用于编程访问 Cursor 的 API 密钥和服务账户。",
  "User API Keys provide secure, programmatic access to your Cursor account, including the headless version of the Cursor Agent CLI":
    "用户 API 密钥为你的 Cursor 账户提供安全的编程访问，包括 Cursor Agent CLI 的无头版本",
  and: "和",
  " . Treat them like passwords: keep them secure and never share them publicly.":
    "。像对待密码一样对待它们：保持安全，绝不公开分享。",
  "Note: The": "注意：",
  "is in beta.": "处于测试阶段。",
  "Cloud Agent API": "Cloud Agent API",
  "Download Cursor Windows": "下载 Cursor Windows 版",
  Help: "帮助",
  ". Treat them like passwords: keep them secure and never share them publicly.":
    "。像对待密码一样对待它们：保持安全，绝不公开分享。",
  yyz: "yyz",
  doge: "doge",
  isdoge: "isdoge",
  "doge is": "doge is",
  "Switch to annual billing and save 20%": "切换到年付可节省 20%",
  "Upgrade Now": "立即升级",
  "Entry-level plan with access to premium models, unlimited Tab completions, and more.":
    "入门级方案，可使用高级模型、无限 Tab 补全等功能。",
  "Your subscription will auto renew on": "您的订阅将自动续订于",
  "Adjust plan": "调整方案",
  "Choose your plan": "选择你的方案",
  Monthly: "月付",
  Yearly: "年付",
  "Billed monthly": "按月计费",
  "Billed annually": "按年计费",
  "per month": "每月",
  "Update plan": "更新方案",
  "Change plan": "更改方案",
  "Confirm plan change": "确认方案变更",
  "Keep current plan": "保留当前方案",
  Downgrade: "降级",
  "Upgrade to Pro+": "升级到 Pro+",
  "Pro plan": "Pro 方案",
  "Pro+ plan": "Pro+ 方案",
  "Ultra plan": "Ultra 方案",
  "Update your payment details": "更新付款信息",
  "Manage in Stripe": "在 Stripe 中管理",
  Included: "Included",
  "Included usage": "包含用量",
  Item: "项目",
  Tokens: "Tokens",
  tokens: "tokens",
  "Auto + Composer": "Auto + Composer",
  "On-Demand Usage": "按需用量",
  Type: "类型",
  Cost: "费用",
  Qty: "数量",
  "Subtotal:": "小计：",
  paid: "已付款",
  "We'll be sad to see you go.": "我们会舍不得你离开。",
  "Upgrade to Teams": "升级到 Teams",
  "Work with your team and unlock collaborative features":
    "与团队协作并解锁协作功能",
  "Team Management": "团队管理",
  "Invite members, manage roles, and control access":
    "邀请成员、管理角色并控制访问权限",
  "Usage Analytics": "用量分析",
  "Track team usage and optimize your subscription": "跟踪团队用量并优化订阅",
  "Admin Controls": "管理员控制",
  "Centralized billing and privacy mode controls": "集中账单和隐私模式控制",
  "Rules & Commands": "规则与命令",
  "Share rules and commands across your team": "在团队中共享规则和命令",
  "Create team": "创建团队",
  "Need enterprise features?": "需要企业功能？",
  "Get pooled usage, SCIM seat management, and granular admin controls":
    "获取共享用量池、SCIM 席位管理和细粒度管理员控制",
  "Contact sales": "联系销售",
  "All the Canvases you've shared from Cursor, in one place.":
    "您从 Cursor 共享的所有画布都会集中显示在这里。",
  "No Shared Canvases": "暂无共享画布",
  "Canvases you share from Cursor will appear here.":
    "您从 Cursor 共享的画布会显示在这里。",
  "Current Plan": "当前方案",
  "Resets on": "重置时间",
  "Upgrade Available": "可升级",
  "Pro+": "Pro+",
  "Unlock 3x more usage on Agent & more": "解锁 Agent 等功能 3 倍更多用量",
  "Included in Pro": "Pro 已包含",
  "Additional usage beyond limits consumes API quota or on-demand spend.":
    "超出上限后的额外用量会消耗 API 配额或按需支出。",
  "Additional usage beyond limits consumes on-demand spend.":
    "超出上限后的额外用量会消耗按需支出。",
  "Additional usage beyond limits consumes on-demand spend. Your plan includes at least $20 of API usage.":
    "超出上限后的额外用量会消耗按需支出。你的方案至少包含 20 美元 API 用量。",
  "Your plan includes at least $": "你的方案至少包含 $",
  "of API usage.": " 的 API 用量。",
  "% Auto and": "% Auto 和",
  "% API used": "% API 已使用",
  "On-Demand Spending": "按需支出",
  "On-demand spending is currently disabled": "当前已禁用按需支出",
  "Monthly Limit": "月度上限",
  "Set a fixed amount or make it unlimited.": "设置固定金额，或设为无限制。",
  Fixed: "固定",
  Unlimited: "无限制",
  "Time range is start of day UTC on start date to end of day UTC on end date.":
    "时间范围为开始日期 UTC 当天开始到结束日期 UTC 当天结束。",
  "1d": "1 天",
  "7d": "7 天",
  "30d": "30 天",
  MTD: "本月至今",
  "Last month": "上个月",
  "Export CSV": "导出 CSV",
  "Usage breakdown": "用量明细",
  "Usage Breakdown": "用量明细",
  "Auto usage": "Auto 用量",
  "API usage": "API 用量",
  "Agent usage": "Agent 用量",
  "Included usage used": "已使用的包含用量",
  "On-demand usage": "按需用量",
  "Usage resets on": "用量重置时间",
  "Extended limits on Agent": "Agent 扩展用量上限",
  "Unlimited Tab completions": "无限 Tab 补全",
  "Maximum context windows": "最大上下文窗口",
  "Get 3x more usage than Pro and unlock higher limits on Agent and premium models.":
    "相比 Pro 获得 3 倍更多用量，并解锁 Agent 和高级模型的更高上限。",
  "Everything in Pro": "包含 Pro 的所有内容",
  "3x usage on OpenAI, Claude, and Gemini models":
    "OpenAI、Claude 和 Gemini 模型 3 倍用量",
  "Higher Agent limits": "更高的 Agent 上限",
  "Priority access to premium capacity": "优先使用高级容量",
  "Get maximum value with 20x usage limits and early access to advanced features.":
    "享受最大价值：20 倍用量上限，并提前体验高级功能。",
  "Everything in Pro+": "包含 Pro+ 的所有内容",
  "20x usage on OpenAI, Claude, and Gemini models":
    "OpenAI、Claude 和 Gemini 模型 20 倍用量",
  "Priority access to new features": "优先体验新功能",
  "Highest throughput and limits": "最高吞吐量和上限",
  "Everything on Individual, plus:": "包含 Individual 的全部内容，另外还有：",
  "Cloud agents with shared team context": "具有共享团队上下文的云端 Agents",
  "Team-wide rules, skills, and automations": "团队范围的规则、技能和自动化",
  "Security review agent": "安全审查 Agent",
  "SAML/OIDC SSO + enforced team-level privacy mode":
    "SAML/OIDC SSO + 强制团队级隐私模式",
  "Team plugin marketplace": "团队插件市场",
  "Usage analytics": "用量分析",
  "Centralized team billing": "集中式团队账单",
  "Need more capabilities for your business? Learn more about our Enterprise plans.":
    "你的业务需要更多能力？了解我们的企业方案。",
  "Need more capabilities for your business? Learn more about our":
    "你的业务需要更多能力？了解我们的",
  "Enterprise plans.": "企业方案。",
  ...marketplaceTempTextRules,
};

const attrRules: Record<string, string> = {
  "Cursor home": "Cursor 首页",
  "Toggle left sidebar": "切换左侧边栏",
  "Search agents (Ctrl+K)": "搜索 Agents（Ctrl+K）",
  "User menu": "用户菜单",
  "Customize thread list": "自定义线程列表",
  "Add files, skills, and MCP servers": "添加文件、技能和 MCP 服务器",
  "Start voice input": "开始语音输入",
  "Long-running behavior": "长时间运行行为",
  "Automation template filters": "自动化模板筛选器",
  "Use Find bugs template": "Use Find bugs template",
  "Use Scan codebase for vulnerabilities template":
    "Use Scan codebase for vulnerabilities template",
  "Use Generate docs template": "使用“生成文档”模板",
  "Use Add test coverage template": "Use Add test coverage template",
  Search: "搜索",
  "Search agents": "搜索 Agents",
  "Search members": "搜索成员",
  "Search plugins": "搜索插件",
  "Search integrations": "搜索集成",
  "Search API keys": "搜索 API 密钥",
  "Search secrets": "搜索密钥",
  "repositories...": "仓库...",
  "Expand Menu": "展开菜单",
  "New API Key": "新建 API 密钥",
  "More options": "更多操作",
  Filter: "筛选",
  Filters: "筛选器",
  Close: "关闭",
  "First name": "名",
  "Last name": "姓",
  "Upload profile image": "上传头像",
  "Profile page links": "个人资料页链接",
  "Active sessions": "活跃会话",
  "Previous page": "上一页",
  "Next page": "下一页",
  "Notifications alt+T": "通知 alt+T",
  "Branch name...": "分支名称...",
  "cursor/": "cursor/",

  "Setup progress": "设置进度",
  "Show combined lines of code from Agent (Cmd+K/chat) and Tab suggestions":
    "显示 Agent（Cmd+K/聊天）和 Tab 建议的合并代码行数",
  "Show lines of code from Cursor Tab suggestions":
    "显示 Cursor Tab 建议产生的代码行数",
  "Show lines edited using Agent (Cmd+K and chat)":
    "显示使用 Agent（Cmd+K 和聊天）编辑的代码行数",
  "Copy link to Privacy and scroll to section":
    "复制隐私区块链接并滚动到该区块",
  "Copy link to Environments and scroll to section":
    "复制环境区块链接并滚动到该区块",
  "Copy link to Self-Hosted and scroll to section":
    "复制自托管区块链接并滚动到该区块",
  "Copy link to Defaults and scroll to section":
    "复制默认设置区块链接并滚动到该区块",
  "Copy link to Notifications and scroll to section":
    "复制通知区块链接并滚动到该区块",
  "Copy link to Slack routing and scroll to section":
    "复制 Slack 路由区块链接并滚动到该区块",
  "Copy link to Security and scroll to section":
    "复制安全区块链接并滚动到该区块",
  "Copy link to My Secrets and scroll to section":
    "复制我的密钥区块链接并滚动到该区块",
  "Copy link to Profile and scroll to section":
    "复制个人资料区块链接并滚动到该区块",
  "Copy link to Appearance and scroll to section":
    "复制外观区块链接并滚动到该区块",
  "Copy link to Pull Requests and scroll to section":
    "复制拉取请求区块链接并滚动到该区块",
  "Copy link to Active Sessions and scroll to section":
    "复制活跃会话区块链接并滚动到该区块",
  "Copy link to More and scroll to section": "复制更多区块链接并滚动到该区块",
  "Copy link to Source Control and scroll to section":
    "复制源码控制区块链接并滚动到该区块",
  "Copy link to Integrations and scroll to section":
    "复制集成区块链接并滚动到该区块",
  "Copy link to Repositories and scroll to section":
    "复制仓库区块链接并滚动到该区块",
  "Plugin filters": "插件筛选器",
  "Copy link to Suggested and scroll to section":
    "复制推荐区块链接并滚动到该区块",

  "Copy section link": "复制区块链接",
  "Copy link to User API Keys and scroll to section":
    "复制 User API Keys 链接并跳转到该部分",
  "Copy link to Included in Pro and scroll to section":
    "复制 Pro 已包含区块链接并滚动到该区块",
  "Copy link to On-Demand Usage and scroll to section":
    "复制按需用量区块链接并滚动到该区块",
  "Last 1 day": "最近 1 天",
  "Last 7 days": "最近 7 天",
  "Last 30 days": "最近 30 天",
  "Month-to-date": "本月至今",
  "Usage events for all users": "所有用户的用量事件",
  "Included in Pro": "Pro 已包含",
};

const regexTextRules: RegexRule[] = [
  {
    pattern: /^([0-9,.]+)% Auto and ([0-9,.]+)% API used$/,
    replace: "$1% Auto 和 $2% API 已使用",
  },
  { pattern: /^剩余 ([0-9,]+) days?$/, replace: "剩余 $1 天" },
  { pattern: /^([0-9,]+) days? remaining$/, replace: "剩余 $1 天" },
  { pattern: /^View ([0-9,]+) more$/, replace: "再查看 $1 个" },
  { pattern: /^About ([0-9]+) months ago$/, replace: "约 $1 个月前" },
  { pattern: /^About ([0-9]+) month ago$/, replace: "约 $1 个月前" },
  { pattern: /^([0-9]+) months ago$/, replace: "$1 个月前" },
  { pattern: /^([0-9]+) month ago$/, replace: "$1 个月前" },
  { pattern: /^(.*?) is Pro$/, replace: "$1 是 Pro 用户" },
  {
    pattern:
      /^Connected as (.+?) to repositories accessible in organizations: (.+)$/,
    replace: "已连接为 $1，可访问以下组织中的仓库：$2",
  },
  { pattern: /^([0-9,]+) of ([0-9,]+) used$/, replace: "已使用 $1 / $2" },
  { pattern: /^([0-9,]+) members?$/, replace: "$1 名成员" },
  { pattern: /^([0-9,]+) seats?$/, replace: "$1 个席位" },
  { pattern: /^([0-9,]+) Repositories Available$/, replace: "$1 个可用仓库" },
  {
    pattern: /^(\d+) of (\d+) checks enabled during review$/,
    replace: "审查期间已启用 $1 / $2 项检查",
  },
  { pattern: /^Used ([0-9,.]+)%$/, replace: "已使用 $1%" },
  { pattern: /^(.+) remaining$/, replace: "剩余 $1" },
  { pattern: /^Created (.+) ago$/, replace: "$1 前创建" },
  { pattern: /^Last used (.+) ago$/, replace: "$1 前使用" },
  { pattern: /^About (.+) ago$/, replace: "约 $1 前" },
  { pattern: /^([0-9,]+) days? ago$/, replace: "$1 天前" },
  {
    pattern: /^Showing ([0-9,]+)-([0-9,]+) of ([0-9,]+)$/,
    replace: "显示 $1-$2，共 $3",
  },
  { pattern: /^([0-9,]+) \/ ([0-9,]+)$/, replace: "第 $1 页 / 共 $2 页" },
  { pattern: /^Link ([0-9,]+) Add link$/, replace: "链接 $1 添加链接" },
  {
    pattern: /^Device Created Desktop App (.+) Revoke$/,
    replace: "设备 已创建 Desktop App $1 撤销",
  },
  {
    pattern: /^Device 已创建 Desktop App (.+) Revoke$/,
    replace: "设备 已创建 Desktop App $1 撤销",
  },
  { pattern: /^Device 已创建 (.+)$/, replace: "Device 已创建 $1" },
  { pattern: /^Renews on (.+)$/, replace: "续订日期：$1" },
  { pattern: /^Billed (.+)$/, replace: "计费周期：$1" },
  { pattern: /^Use (.+) template$/, replace: "使用“$1”模板" },
  { pattern: /^"$/, replace: '"' },
  {
    pattern:
      /^Showing token usage and costs from (.+) to (.+)\. Use filters to narrow results by date range\.$/,
    replace:
      "显示从 $1 到 $2 的 token 用量和费用。使用筛选器按日期范围缩小结果。",
  },
  {
    pattern:
      /^Showing token usage and costs from (.+) to (.+)\. Use filters to narrow results by date range\.$/,
    replace:
      "显示从 $1 到 $2 的 token 用量和费用。使用筛选器按日期范围缩小结果。",
  },
  {
    pattern:
      /^"\? Any existing integrations using this key will no longer work\.$/,
    replace: "？任何使用此密钥的集成将无法继续工作。",
  },
  { pattern: /^[().%$-]$/, replace: "$&" },
  { pattern: /^[0-9]+(?:\.[0-9]+)?$/, replace: "$&" },
  { pattern: /^US\$[0-9,.]+$/, replace: "$&" },
  { pattern: /^[0-9,.]+ USD$/, replace: "$&" },
  { pattern: /^\$([0-9]+)\/mo$/, replace: "$$$1/月" },
  { pattern: /^[A-Z][a-z]{2} [0-9]{1,2}, [0-9]{4}$/, replace: "$&" },
  {
    pattern: /^[A-Z][a-z]{2} [0-9]{1,2} - [A-Z][a-z]{2} [0-9]{2}$/,
    replace: "$&",
  },
  {
    pattern: /^[A-Z][a-z]{2} [0-9]{1,2}, [0-9]{2}:[0-9]{2} [AP]M$/,
    replace: "$&",
  },
  {
    pattern:
      /^Showing token usage and costs from (.+) to (.+)\. Use filters to narrow results by date range\.$/,
    replace:
      "显示从 $1 到 $2 的 token 用量和费用。使用筛选器按日期范围缩小结果。",
  },
  { pattern: /^Rows: ([0-9,]+)$/, replace: "行数：$1" },
  { pattern: /^[a-z][a-z0-9]*(?:-[a-z0-9+.]+)+$/, replace: "$&" },
];

const regexAttrRules: RegexRule[] = [
  { pattern: /^Use (.+) template$/, replace: "使用“$1”模板" },
  { pattern: /^Search (.+)$/, replace: "搜索 $1" },
  { pattern: /^Open (.+) menu$/, replace: "打开“$1”菜单" },
  { pattern: /^[a-z][a-z0-9]*(?:-[a-z0-9+.]+)+$/, replace: "$&" },
];

const titleRules: Record<string, string> = {
  "Cursor Agent - Turn your ideas into code":
    "Cursor Agent - 将你的想法变成代码",
  "Cursor - The best way to code with AI": "Cursor - 使用 AI 编程的最佳方式",
  "Automations | Cursor": "自动化 | Cursor",
  "Dashboard | Cursor": "仪表盘 | Cursor",
  "Settings | Cursor": "设置 | Cursor",
  "Cursor Marketplace | Cursor Plugins": "Cursor 市场 | Cursor 插件",
  "Publish a Cursor Marketplace Plugin | Cursor Plugins":
    "发布 Cursor 市场插件 | Cursor 插件",
  Cursor: "Cursor",
};

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
      ? (attrRules[normalized] ?? textRules[normalized])
      : textRules[normalized];
  if (exact) return exact;

  const rules = mode === "attr" ? regexAttrRules : regexTextRules;
  for (const rule of rules) {
    if (rule.pattern.test(normalized)) {
      return normalized.replace(rule.pattern, rule.replace);
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
  const iconLabels: Record<string, string> = {
    ellipsis: "更多操作",
    "list-filter": "筛选列表",
    add: "添加",
    mic: "语音输入",
    "chevron-down": "展开",
    close: "关闭",
    search: "搜索",
  };

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
  const original = titleRules[document.title] ? document.title : undefined;
  if (state.language === "en") return;
  const exact = titleRules[document.title];
  if (exact) {
    document.title = exact;
    return;
  }
  for (const [from, to] of Object.entries(titleRules)) {
    if (document.title.includes(from)) {
      document.title = document.title.replace(from, to);
      return;
    }
  }
  if (original) document.title = titleRules[original];
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
