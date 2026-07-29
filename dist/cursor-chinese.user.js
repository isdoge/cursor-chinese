// ==UserScript==
// @name         Cursor 中文化插件
// @namespace    https://github.com/isdoge/cursor-chinese
// @version      1.0.2
// @description  中文化 cursor 管理控制台界面的部分菜单及内容
// @author       狗带带子
// @match        https://cursor.com/*
// @match        https://www.cursor.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://ts3.tc.mm.bing.net/th/id/ODF.Vi7Qr3OxcQoUxuIrXygTkw?w=32&h=32&qlt=90&pcl=fffffc&o=6&pid=1.2
// @homepageURL  https://github.com/isdoge/cursor-chinese
// @supportURL   https://github.com/isdoge/cursor-chinese/issues
// @updateURL    https://raw.githubusercontent.com/isdoge/cursor-chinese/main/dist/cursor-chinese.user.js
// @downloadURL  https://raw.githubusercontent.com/isdoge/cursor-chinese/main/dist/cursor-chinese.user.js
// @run-at       document-idle
// ==/UserScript==
(() => {
  const modules = {
    "src/marketplace-temp.ts": (module, exports, require) => {
        const marketplaceTempTextRules = {
            Featured: "精选",
            "Recently Added": "最近添加",
            "Featured Plugins": "精选插件",
            "Featured Automations": "精选自动化",
            "See All Plugins": "查看全部插件",
            "See All Automations": "查看全部自动化",
            "Featured Recently Added Plugins Automations": "精选 最近添加 插件 自动化",
            "Manage Automations": "管理自动化",
            Documentation: "文档",
            Infrastructure: "基础设施",
            "Data & Analytics": "数据与分析",
            Productivity: "生产力",
            Payments: "支付",
            "Agent Orchestration": "Agent 编排",
            Canvas: "画布",
            Canvases: "画布",
            "All Automations": "所有自动化",
            "Build, deploy, and operate applications on AWS. Skills to author infrastructure-as-code (CDK, CloudFormation), use core services (Lambda, API Gateway, Step Functions, ECS/Fargate, ECR, IAM, Amazon Bedrock with Knowledge Bases and Guardrails, Amplify), and complete common tasks across observability (CloudWatch, X-Ray, CloudTrail, ADOT), messaging and streaming (SQS, SNS, EventBridge, Kinesis, MSK), AWS SDKs (boto3, JS v3, Swift), and cost optimization.": "在 AWS 上构建、部署和运营应用。包含编写基础设施即代码（CDK、CloudFormation）、使用核心服务（Lambda、API Gateway、Step Functions、ECS/Fargate、ECR、IAM、带 Knowledge Bases 与 Guardrails 的 Amazon Bedrock、Amplify），以及完成可观测性（CloudWatch、X-Ray、CloudTrail、ADOT）、消息与流处理（SQS、SNS、EventBridge、Kinesis、MSK）、AWS SDK（boto3、JS v3、Swift）和成本优化等常见任务的技能。",
            "Netlify platform skills — functions, edge functions, blobs, database, identity, image CDN, forms, config, CLI, frameworks, caching, AI gateway, and deployment": "Netlify 平台技能——函数、边缘函数、blobs、数据库、身份、图片 CDN、表单、配置、CLI、框架、缓存、AI 网关和部署。",
            "Connects Cursor to the Coralogix Observability MCP Server, letting your AI agent query logs, metrics, traces, and RUM, manage alerts and dashboards — all without leaving the editor.": "将 Cursor 连接到 Coralogix Observability MCP Server，让你的 AI Agent 无需离开编辑器即可查询日志、指标、链路追踪和 RUM，并管理告警与仪表盘。",
            "Official ScyllaDB agent skills. Bundles guided skills for ScyllaDB Cloud setup, CQL data modeling, and Vector Search; each is invoked independently by the agent when relevant.": "官方 ScyllaDB Agent 技能。捆绑用于 ScyllaDB Cloud 设置、CQL 数据建模和向量搜索的引导式技能；相关时由 Agent 独立调用。",
            "ParadeDB offers Elastic-quality search in Postgres including BM25 scoring, Top K, highlighting, tokenizers, aggregates, and joins. This plugin teaches agents how to use ParadeDB effectively by giving them access to the documentation MCP server.": "ParadeDB 在 Postgres 中提供 Elastic 级搜索能力，包括 BM25 评分、Top K、高亮、分词器、聚合和 join。此插件通过文档 MCP 服务器让 Agent 学会高效使用 ParadeDB。",
            "Deploy and operate full applications with Monk — cloud infra, SaaS integrations, and containerized workloads — from one chat.": "通过一次聊天使用 Monk 部署和运营完整应用——涵盖云基础设施、SaaS 集成和容器化工作负载。",
            "Twilio Skills and MCP provide procedural knowledge for AI coding agents — which APIs to use, in what order, and what to avoid. Covers Messaging, Voice, Verify, SendGrid, and 30+ products.": "Twilio Skills 和 MCP 为 AI 编码 Agent 提供流程化知识：该用哪些 API、按什么顺序使用以及应避免什么。覆盖 Messaging、Voice、Verify、SendGrid 和 30 多个产品。",
            "Query cloud costs, manage cost reports, budgets, alerts, and recommendations across your Vantage workspace": "在你的 Vantage 工作区中查询云成本，管理成本报告、预算、告警和建议。",
            "Microsoft Azure MCP and Skills integration for cloud resource management, deployments, and Azure services. Manage your Azure infrastructure, monitor applications, and deploy resources directly from Cursor.": "Microsoft Azure MCP 和 Skills 集成，用于云资源管理、部署和 Azure 服务。可直接从 Cursor 管理 Azure 基础设施、监控应用并部署资源。",
            "Comprehensive skill for the entire Temporal lifecycle — developing applications, using the Temporal CLI, running and managing Temporal Server, and working with Temporal Cloud.": "覆盖完整 Temporal 生命周期的综合技能——开发应用、使用 Temporal CLI、运行和管理 Temporal Server，以及使用 Temporal Cloud。",
            "Expert database guidance for the AWS database portfolio. Design schemas, execute queries, handle migrations, and choose the right database for your workload.": "面向 AWS 数据库产品组合的专家级数据库指导。设计 schema、执行查询、处理迁移，并为你的工作负载选择合适的数据库。",
            "WorkOS integration skills for AuthKit, SSO, Directory Sync, RBAC, Vault, Audit Logs, migrations, and API references.": "WorkOS 集成技能，覆盖 AuthKit、SSO、Directory Sync、RBAC、Vault、Audit Logs、迁移和 API 参考。",
            "Manage the Zscaler cloud security platform including ZPA (private access), ZIA (internet access), ZDX (digital experience), ZCC (client connector), EASM (attack surface management), and Z-Insights (security analytics). Includes guided skills for application onboarding, policy audits, incident investigation, and cross-product troubleshooting.": "管理 Zscaler 云安全平台，包括 ZPA（私有访问）、ZIA（互联网访问）、ZDX（数字体验）、ZCC（客户端连接器）、EASM（攻击面管理）和 Z-Insights（安全分析）。包含应用接入、策略审计、事件调查和跨产品排障的引导式技能。",
            "Turbopuffer vector and full-text search database integration for Cursor": "面向 Cursor 的 Turbopuffer 向量和全文搜索数据库集成。",
            "The Appwrite plugin for Cursor includes skills and MCP servers, allowing AI agents to access your projects and correctly integrate with your projects.": "Cursor 的 Appwrite 插件包含技能和 MCP 服务器，让 AI Agent 能访问你的项目并正确集成到项目中。",
            "CockroachDB plugin for Cursor — explore schemas, write optimized SQL, debug queries, and manage distributed database clusters directly from your AI coding agent.": "Cursor 的 CockroachDB 插件——可直接从 AI 编码 Agent 探索 schema、编写优化 SQL、调试查询并管理分布式数据库集群。",
            "Pinecone vector database integration for Cursor. Create and manage indexes, upsert data, and run semantic searches via the Pinecone MCP server. Build document Q&A assistants with citations, or get started fast with /pinecone-quickstart. Great for semantic search, RAG, and agentic AI apps.": "面向 Cursor 的 Pinecone 向量数据库集成。通过 Pinecone MCP 服务器创建和管理索引、写入数据并运行语义搜索。可构建带引用的文档问答助手，或使用 /pinecone-quickstart 快速上手。适用于语义搜索、RAG 和 Agentic AI 应用。",
            "Build backends in TypeScript and Go with automatic infrastructure. Includes MCP integration for inspecting services, querying databases, analyzing traces, and calling endpoints. Plus rules, skills, and commands for the full Encore workflow.": "用 TypeScript 和 Go 构建带自动基础设施的后端。包含 MCP 集成，用于检查服务、查询数据库、分析链路追踪和调用端点；还提供完整 Encore 工作流的规则、技能和命令。",
            "The official Firebase Cursor plugin. Prototype, build, and run modern apps with Firebase's backend and AI infrastructure.": "官方 Firebase Cursor 插件。使用 Firebase 的后端和 AI 基础设施原型设计、构建并运行现代应用。",
            "Build full-stack apps with AWS Amplify Gen 2 using guided workflows for authentication, data models, storage, GraphQL APIs, and Lambda functions.": "使用 AWS Amplify Gen 2 构建全栈应用，提供认证、数据模型、存储、GraphQL API 和 Lambda 函数的引导式工作流。",
            "Design, build, deploy, test, and debug serverless applications with AWS Serverless services.": "使用 AWS Serverless 服务设计、构建、部署、测试并调试无服务器应用。",
            "Guide developers through adding maps, places search, geocoding, routing, and other geospatial features with Amazon Location Service, including authentication setup, SDK integration, and best practices.": "指导开发者使用 Amazon Location Service 添加地图、地点搜索、地理编码、路线规划和其他地理空间功能，包括认证设置、SDK 集成和最佳实践。",
            "Official Cursor plugin for MongoDB (MCP Server + Skills). Connect to databases, explore data, manage collections, optimize queries, generate reliable code, implement best practices, develop advanced features, and more.": "MongoDB 的官方 Cursor 插件（MCP Server + Skills）。连接数据库、探索数据、管理集合、优化查询、生成可靠代码、落实最佳实践、开发高级功能等。",
            "Deploy, debug, and monitor applications on Render. Includes skills, rules, commands, an agent, MCP config, and hooks for the full Render workflow.": "在 Render 上部署、调试并监控应用。包含完整 Render 工作流所需的技能、规则、命令、Agent、MCP 配置和 hooks。",
            "JFrog Platform integration with MCP, security skills, supply-chain best practices, and JFrog Agent Guard governance for adding, removing, and listing MCP servers.": "JFrog Platform 集成，包含 MCP、安全技能、供应链最佳实践，以及用于添加、移除和列出 MCP 服务器的 JFrog Agent Guard 治理能力。",
            "PagerDuty MCP server for Cursor - manage incidents, services, schedules, on-call, and more directly from your IDE.": "Cursor 的 PagerDuty MCP 服务器——可直接从 IDE 管理事件、服务、排班、值班等。",
            "An authenticated hosted MCP server that accesses your PlanetScale organizations, databases, branches, schema, and Insights data.": "一个需要认证的托管 MCP 服务器，可访问你的 PlanetScale 组织、数据库、分支、schema 和 Insights 数据。",
            "Redis development best practices — data structures, query engine, vector search, caching, and performance optimization": "Redis 开发最佳实践——数据结构、查询引擎、向量搜索、缓存和性能优化。",
            "Clerk authentication toolkit for Cursor - setup guides, MCP server, and specialized skills for frameworks, mobile apps, organizations, billing, webhooks, testing, and more.": "Cursor 的 Clerk 认证工具包——设置指南、MCP 服务器，以及面向框架、移动应用、组织、账单、webhook、测试等场景的专用技能。",
            "Deploy serverless browser automation to Browserbase cloud. Create, test, and publish cloud functions for scheduled or webhook-triggered browser tasks.": "将无服务器浏览器自动化部署到 Browserbase 云。可创建、测试并发布用于定时任务或 webhook 触发浏览器任务的云函数。",
            "Manage your Neon projects and databases with the neon-postgres agent skill and the Neon MCP Server": "使用 neon-postgres Agent 技能和 Neon MCP Server 管理你的 Neon 项目和数据库。",
            "Access your Supabase projects and perform tasks like managing tables, fetching config, and querying data.": "访问你的 Supabase 项目并执行管理表、获取配置和查询数据等任务。",
            "Deploy applications to AWS with architecture recommendations, cost estimates, and IaC deployment. Generate validated AWS architecture diagrams as draw.io XML.": "结合架构建议、成本估算和 IaC 部署，将应用部署到 AWS。生成经过验证的 draw.io XML 格式 AWS 架构图。",
            "Build and deploy web apps and agents": "构建并部署 Web 应用和 Agent。",
            "Sentry Plugin for Cursor to help with debugging including MCP, commands, and skill capabilities.": "Cursor 的 Sentry 插件，通过 MCP、命令和技能能力帮助调试。",
            "BrowserStack integration for Cursor. Test websites and mobile apps on real devices, run automated tests, debug failures, and manage test cases—all using natural language.": "Cursor 的 BrowserStack 集成。使用自然语言在真实设备上测试网站和移动应用、运行自动化测试、调试失败并管理测试用例。",
            "Skills for the Cloudflare developer platform: Workers, Durable Objects, Agents SDK, MCP servers, Wrangler CLI, and web performance": "Cloudflare 开发者平台技能：Workers、Durable Objects、Agents SDK、MCP 服务器、Wrangler CLI 和 Web 性能。",
            "Official Convex plugin for Cursor - reactive backend development with TypeScript, including rules, skills, MCP integration, and automation hooks": "Cursor 的官方 Convex 插件——使用 TypeScript 进行响应式后端开发，包含规则、技能、MCP 集成和自动化 hooks。",
            "Railway agent skills and MCP server for deploying, configuring, monitoring, and troubleshooting apps and infrastructure on Railway from Cursor. Manage services, environments, deployments, databases, object storage, networking, and observability.": "Railway Agent 技能和 MCP 服务器，用于从 Cursor 部署、配置、监控并排障 Railway 上的应用和基础设施。可管理服务、环境、部署、数据库、对象存储、网络和可观测性。",
            "Access Confidence feature flags, experiments, and migration tools directly from Cursor.": "直接从 Cursor 访问 Confidence 功能开关、实验和迁移工具。",
            "Data lake, analytics, and ETL workflows with S3 Tables, AWS Glue, and Athena. Covers managed Iceberg tables on S3 Tables, ingestion from JDBC databases (Oracle, SQL Server, PostgreSQL, MySQL, RDS), Amazon Redshift, Snowflake, BigQuery, and DynamoDB, AWS Glue Data Catalog inventory and asset discovery, federated Athena queries, and vector storage and semantic search on Amazon S3 Vectors.": "使用 S3 Tables、AWS Glue 和 Athena 处理数据湖、分析和 ETL 工作流。覆盖 S3 Tables 上的托管 Iceberg 表、来自 JDBC 数据库（Oracle、SQL Server、PostgreSQL、MySQL、RDS）的摄取、Amazon Redshift、Snowflake、BigQuery、DynamoDB、AWS Glue Data Catalog 资产清点和发现、联邦 Athena 查询，以及 Amazon S3 Vectors 上的向量存储和语义搜索。",
            "Hosted MCP server for AI-assisted Grafana Cloud observability — no local installation required.": "用于 AI 辅助 Grafana Cloud 可观测性的托管 MCP 服务器——无需本地安装。",
            "Mixpanel skills for Cursor — tracking implementation, metric investigation, and more.": "面向 Cursor 的 Mixpanel 技能——跟踪埋点实现、指标调查等。",
            "OpenSearch skills to help set up and deploy OpenSearch for a variety of use cases: build search applications with semantic, hybrid, neural sparse, and agentic search strategies; analyze observability data with log analytics (PPL and Query DSL) and distributed traces (OpenTelemetry); deploy to Amazon OpenSearch Service or OpenSearch Serverless with Bedrock integration for embeddings and RAG. Just ask your AI assistant to set up a search app, query logs, investigate traces, or deploy to AWS.": "OpenSearch 技能，可帮助针对多种用例设置和部署 OpenSearch：用语义、混合、神经稀疏和 Agentic 搜索策略构建搜索应用；用日志分析（PPL 和 Query DSL）与分布式链路追踪（OpenTelemetry）分析可观测性数据；部署到 Amazon OpenSearch Service 或 OpenSearch Serverless，并通过 Bedrock 集成 embeddings 和 RAG。只需让 AI 助手设置搜索应用、查询日志、调查链路追踪或部署到 AWS。",
            "Expert guidance for working with Dagster and the dg CLI.": "使用 Dagster 和 dg CLI 的专家指导。",
            "ThoughtSpot developer documentation — search Visual Embed SDK, REST API v2, and developer guides through MCP-compatible clients.": "ThoughtSpot 开发者文档——通过兼容 MCP 的客户端搜索 Visual Embed SDK、REST API v2 和开发者指南。",
            "Web search and content extraction powered by Exa AI": "由 Exa AI 提供支持的 Web 搜索和内容提取。",
            "Web search, content extraction, structured data, and browser automation powered by Bright Data's web intelligence platform.": "由 Bright Data 的 Web 智能平台提供支持的 Web 搜索、内容提取、结构化数据和浏览器自动化。",
            "Data engineering plugin - warehouse exploration, pipeline authoring, Airflow integration": "数据工程插件——仓库探索、流水线编写和 Airflow 集成。",
            "Elastic skills and documentation — Elasticsearch, Kibana, Observability, Security, Cloud, ES|QL, OpenTelemetry, and MCP docs access": "Elastic 技能和文档——Elasticsearch、Kibana、Observability、Security、Cloud、ES|QL、OpenTelemetry 以及 MCP 文档访问。",
            "Agent skills for dbt: data modeling, analytics engineering, semantic layer metrics, unit testing, job troubleshooting, and dbt MCP server setup. Covers dbt Core and dbt Cloud workflows.": "dbt 的 Agent 技能：数据建模、分析工程、语义层指标、单元测试、作业排障和 dbt MCP 服务器设置。覆盖 dbt Core 和 dbt Cloud 工作流。",
            "Bring Pendo analytics into Cursor with skills for account health, feature adoption, session replays, and feedback analysis": "将 Pendo 分析带入 Cursor，提供账户健康度、功能采用、会话回放和反馈分析技能。",
            "Bring Antimetal's software investigation intelligence into your editor. Triage problems, investigate root causes, and apply remediations without leaving Cursor.": "将 Antimetal 的软件调查智能引入你的编辑器。无需离开 Cursor 即可分诊问题、调查根因并应用修复。",
            "Explore, query, model, embed, and manage Omni Analytics through the REST API and embed SDK. Includes 8 skills for model exploration, querying, model building, content browsing, dashboard creation, embedding, AI optimization, and administration — plus 3 specialized subagents and always-on rules for API conventions.": "通过 REST API 和 embed SDK 探索、查询、建模、嵌入和管理 Omni Analytics。包含用于模型探索、查询、模型构建、内容浏览、仪表盘创建、嵌入、AI 优化和管理的 8 个技能，另有 3 个专用子 Agent 和面向 API 约定的常驻规则。",
            "Full API lifecycle management for Cursor. Sync collections, generate client code, discover APIs, run tests, create mocks, improve docs, and audit security. Powered by the Postman MCP Server.": "Cursor 的完整 API 生命周期管理。同步 collections、生成客户端代码、发现 API、运行测试、创建 mock、改进文档并审计安全。由 Postman MCP Server 提供支持。",
            "Connect Cursor to Braintrust for AI-powered access to your projects, experiments, and evaluation logs": "将 Cursor 连接到 Braintrust，以 AI 方式访问你的项目、实验和评估日志。",
            "Access your Azure Cosmos DB accounts and perform tasks like managing databases, querying data, vector search, and schema discovery.": "访问你的 Azure Cosmos DB 账户并执行管理数据库、查询数据、向量搜索和 schema 发现等任务。",
            "Web scraping, crawling, and search for AI agents. Gives Cursor full access to web content through the Firecrawl CLI.": "面向 AI Agent 的 Web 抓取、爬取和搜索。通过 Firecrawl CLI 让 Cursor 完整访问网页内容。",
            "Use Amplitude like an expert - instrument analytics, discover product opportunities, analyze charts, create dashboards, manage experiments, and understand users and accounts": "像专家一样使用 Amplitude——埋点分析、发现产品机会、分析图表、创建仪表盘、管理实验，并理解用户和账户。",
            "Skills and rules for developing and using the Grafana Assistant app and CLI.": "用于开发和使用 Grafana Assistant 应用及 CLI 的技能和规则。",
            "Agent Skills for AI/ML tasks including dataset creation, model training, evaluation, and research paper publishing on Hugging Face Hub": "面向 AI/ML 任务的 Agent 技能，包括数据集创建、模型训练、评估，以及在 Hugging Face Hub 发布研究论文。",
            "Access PostHog analytics, feature flags, experiments, error tracking, and insights directly from Cursor": "直接从 Cursor 访问 PostHog 分析、功能开关、实验、错误跟踪和洞察。",
            "ClickHouse Cursor plugin: skills (ClickHouse best practices), rules and MCP.": "ClickHouse Cursor 插件：技能（ClickHouse 最佳实践）、规则和 MCP。",
            "Snowflake  ·  1 skill, 1 MCP server": "Snowflake · 1 个技能，1 个 MCP 服务器。",
            "AI analytics and data collaboration - connect Cursor to your Hex workspace with MCP": "AI 分析和数据协作——通过 MCP 将 Cursor 连接到你的 Hex 工作区。",
            "The official Prisma plugin for Cursor: MCP server integration, rules, skills, and automation for database development": "Cursor 的官方 Prisma 插件：用于数据库开发的 MCP 服务器集成、规则、技能和自动化。",
            "Official Apify agent skills for web scraping, data extraction, and automation": "官方 Apify Agent 技能，用于 Web 抓取、数据提取和自动化。",
            "Connect AI agents to ZoomInfo's verified GTM context graph: 100M companies, 300M professional contacts, buyer intent signals, and real-time scoops. Build prospect lists, enrich records, deep research key organizations, find decision-makers, and prioritize accounts by intent. The B2B sales intelligence layer for Cursor and any MCP-compatible agent.": "将 AI Agent 连接到 ZoomInfo 已验证的 GTM 上下文图谱：1 亿家公司、3 亿职业联系人、购买意向信号和实时情报。可构建潜客列表、丰富记录、深度研究关键组织、查找决策者，并按意向优先排序账户。它是 Cursor 和任何兼容 MCP Agent 的 B2B 销售情报层。",
            "Connect Cursor to Asana. Create tasks, update projects, search your workspace, and manage work — directly from the editor.": "将 Cursor 连接到 Asana。可直接从编辑器创建任务、更新项目、搜索工作区并管理工作。",
            "Comprehensive reference for building Mintlify documentation sites.": "构建 Mintlify 文档站点的完整参考。",
            "Give Cursor a multiplayer canvas for your code with MagicPath. Bring existing UI into the canvas, create component libraries, apply design-system themes, and ship components back into production code.": "用 MagicPath 为 Cursor 提供可多人协作的代码画布。可把现有 UI 带入画布、创建组件库、应用设计系统主题，并将组件回写到生产代码。",
            "Seven skills for monday CRM users — first-run setup, morning briefings, forecast dashboards, board diagnosis, bulk data hygiene, workspace setup, and meeting-to-opportunity sync. Each skill publishes a monday artifact (update, doc, or dashboard) so work stays inside monday. Composes the official monday MCP connector; no custom server, no new auth.": "面向 monday CRM 用户的七个技能——首次设置、晨间简报、预测仪表盘、看板诊断、批量数据清理、工作区设置，以及会议到商机同步。每个技能都会发布 monday artifact（更新、文档或仪表盘），让工作留在 monday 内。组合官方 monday MCP 连接器；无需自定义服务器，也无需新的认证。",
            "Development, customization, testing, and deployment skills for Adobe App Builder projects. Covers project initialization, action scaffolding, React Spectrum UI scaffolding, Jest unit and integration testing, Playwright E2E testing, and GitHub Actions / Azure DevOps / GitLab CI deployment pipelines.": "Adobe App Builder 项目的开发、定制、测试和部署技能。覆盖项目初始化、action 脚手架、React Spectrum UI 脚手架、Jest 单元和集成测试、Playwright 端到端测试，以及 GitHub Actions / Azure DevOps / GitLab CI 部署流水线。",
            "Product requirements in your editor. Write PRDs from code context, implement from specs, and verify your changes match requirements — powered by ChatPRD's MCP.": "在编辑器中处理产品需求。基于代码上下文编写 PRD、按规格实现，并验证变更符合需求——由 ChatPRD 的 MCP 提供支持。",
            "Cursor Plugin for IcePanel - enables AI assistants to manage models, connections, and more across your IcePanel landscape": "Cursor 的 IcePanel 插件——让 AI 助手可在 IcePanel 景观中管理模型、连接等内容。",
            "Agentic production engineering for SWE, SRE and DevOps. Resolve and investigate issues against existing observability, CI/CD, and self-improving knowledge bases.": "面向 SWE、SRE 和 DevOps 的 Agentic 生产工程。基于现有可观测性、CI/CD 和自改进知识库解决和调查问题。",
            "Harness Skills + Harness MCP server packaged as a Cursor plugin. Build, debug, deploy, and govern via Harness from Cursor.": "打包为 Cursor 插件的 Harness Skills + Harness MCP server。可从 Cursor 通过 Harness 构建、调试、部署和治理。",
            "Official GSAP skills for Cursor, Claude and other AI agents — core animations, timelines, ScrollTrigger, plugins, utilities, React integration, and performance best practices": "面向 Cursor、Claude 和其他 AI Agent 的官方 GSAP 技能——核心动画、时间线、ScrollTrigger、插件、工具、React 集成和性能最佳实践。",
            "Forge app builder skill bundle with Forge MCP integration for building, deploying, and troubleshooting Atlassian Forge apps.": "Forge 应用构建技能包，集成 Forge MCP，用于构建、部署和排障 Atlassian Forge 应用。",
            "Design on a canvas that Cursor can read and write to — built on web standards.": "在 Cursor 可读写的画布上进行设计——基于 Web 标准构建。",
            "Your meetings in your workflow. Granola gives Cursor access to what your team discussed, decided, and committed to.": "把你的会议带入工作流。Granola 让 Cursor 访问你的团队讨论、决定和承诺的内容。",
            "Skills and MCP server for the Resend email platform — sending, receiving, templates, CLI, React Email, and deliverability best practices.": "Resend 邮件平台的技能和 MCP 服务器——发送、接收、模板、CLI、React Email 和可达性最佳实践。",
            "Connect Cursor to your ClickUp workspace — manage tasks, track time, and collaborate without switching context.": "将 Cursor 连接到你的 ClickUp 工作区——无需切换上下文即可管理任务、跟踪时间并协作。",
            "Secure access to Miro boards. Enables AI to read board context, create diagrams, and generate code with enterprise-grade security.": "安全访问 Miro 白板。让 AI 能读取白板上下文、创建图表，并以企业级安全生成代码。",
            "A plugin for all things related to Svelte development, MCP, skills, and more.": "面向 Svelte 开发、MCP、技能等所有相关内容的插件。",
            "Agent skills for Meta Quest and Horizon OS development — debugging, performance tracing, code review, porting guides, and best practices across Unity, Spatial SDK, Android, and WebXR. Uses hzdb (Horizon Debug Bridge) CLI for device interaction.": "面向 Meta Quest 和 Horizon OS 开发的 Agent 技能——调试、性能追踪、代码审查、移植指南，以及 Unity、Spatial SDK、Android 和 WebXR 的最佳实践。使用 hzdb（Horizon Debug Bridge）CLI 与设备交互。",
            "Connect Cursor to GitLab with the GitLab MCP server. Plan, track, and manage issues, merge requests, and pipelines from your editor.": "通过 GitLab MCP server 将 Cursor 连接到 GitLab。可从编辑器规划、跟踪和管理 issue、merge request 与 pipeline。",
            "Sanity plugin for Cursor with MCP server, agent skills, agent rules, and commands.": "Cursor 的 Sanity 插件，包含 MCP 服务器、Agent 技能、Agent 规则和命令。",
            "Cursor plugin for Box — search, read, and manage content in Box, and leverage Box AI for Q&A, summarization, and extraction via the Box MCP server.": "Cursor 的 Box 插件——搜索、读取和管理 Box 中的内容，并通过 Box MCP server 利用 Box AI 做问答、摘要和提取。",
            "Production-ready agent skills for Webflow - CMS management, site auditing, asset optimization, and safe publishing": "面向 Webflow 的生产就绪 Agent 技能——CMS 管理、站点审计、资产优化和安全发布。",
            "LaunchDarkly agent skills and mcp server for feature flag management, AI configuration, and skill authoring": "LaunchDarkly Agent 技能和 MCP 服务器，用于功能开关管理、AI 配置和技能编写。",
            "Draw and visually collaborate with your agents inside Cursor": "在 Cursor 内与你的 Agent 一起绘图和可视化协作。",
            "Connect 9,000+ apps to your AI workflow. Discover, enable, and execute Zapier actions directly from your client.": "将 9000+ 个应用连接到你的 AI 工作流。直接从客户端发现、启用并执行 Zapier 操作。",
            "Build, manage, and deploy Wix sites and apps directly from Cursor. Includes CLI development skills for creating dashboard extensions, backend APIs, site widgets, and service plugins. Connects to the Wix MCP server for site management.": "直接从 Cursor 构建、管理和部署 Wix 站点与应用。包含用于创建仪表盘扩展、后端 API、站点小组件和服务插件的 CLI 开发技能，并连接到 Wix MCP server 进行站点管理。",
            "Official Glean plugin for Cursor — search documents, Slack, and email; explore code across repos; and find experts and stakeholders.": "Cursor 的官方 Glean 插件——搜索文档、Slack 和邮件；跨仓库探索代码；寻找专家和利益相关方。",
            "Atlassian plugin for Cursor with MCP and skills for Jira, Confluence, triage, backlogs, status reports, and more.": "Cursor 的 Atlassian 插件，带有 Jira、Confluence、分诊、backlog、状态报告等场景的 MCP 和技能。",
            "Notion Skills + Notion MCP server packaged as a Cursor plugin.": "打包为 Cursor 插件的 Notion Skills + Notion MCP server。",
            "Create, edit, review, resize, and brand-check Canva designs with the Canva MCP server. 支付": "使用 Canva MCP server 创建、编辑、审查、调整尺寸并检查 Canva 设计的品牌一致性。支付。",
            "Agent-first CLI for trading crypto, stocks, forex, and derivatives on Kraken. Paper trading by default; live trading opt-in via API keys.": "面向 Kraken 上加密货币、股票、外汇和衍生品交易的 Agent-first CLI。默认模拟交易；实盘交易需通过 API key 主动启用。",
            "Deep Google Play subscription lifecycle skills for the RevenueCat Android SDK — purchases, plan and price changes, payment recovery, webhooks, security.": "RevenueCat Android SDK 的深度 Google Play 订阅生命周期技能——购买、方案与价格变更、支付恢复、webhook 和安全。",
            "Configure your RevenueCat integration and access data from your RevenueCat projects.": "配置你的 RevenueCat 集成，并访问 RevenueCat 项目中的数据。",
            "Use the Revolut X CLI (revx) for crypto trading, market data, monitoring, and grid bot strategies": "使用 Revolut X CLI（revx）进行加密货币交易、行情数据、监控和网格机器人策略。",
            "Airwallex CLI plugin for Cursor": "Cursor 的 Airwallex CLI 插件。",
            "Use Chargebee's API integration patterns, webhook handling, SDK usage, and schema references for billing operations in Cursor.": "在 Cursor 中使用 Chargebee 的 API 集成模式、webhook 处理、SDK 用法和 schema 参考来处理账单操作。",
            "Shopify developer tools for Cursor — search Shopify docs, generate and validate GraphQL, Liquid, and UI extension code. Skill scripts send usage telemetry (queries, code, model/client identifiers) to shopify.dev by default; set OPT_OUT_INSTRUMENTATION=true to disable.": "Cursor 的 Shopify 开发者工具——搜索 Shopify 文档，生成并验证 GraphQL、Liquid 和 UI extension 代码。技能脚本默认会向 shopify.dev 发送使用遥测（查询、代码、模型/客户端标识符）；设置 OPT_OUT_INSTRUMENTATION=true 可禁用。",
            "Ship stablecoin apps faster. Best-practice skills for USDC payments, cross-chain transfers, wallets, and smart contracts — plus Circle's MCP server for real-time SDK and documentation guidance.": "更快交付稳定币应用。提供 USDC 支付、跨链转账、钱包和智能合约的最佳实践技能，并带有 Circle 的 MCP server，可实时获取 SDK 和文档指导。",
            "Give your agent a wallet. Swap, sign, and manage addresses across Phantom's supported chains — and tap into Phantom's docs for context.": "给你的 Agent 一个钱包。可在 Phantom 支持的链上兑换、签名和管理地址，并利用 Phantom 文档获取上下文。",
            "Stripe plugin for Cursor to help with Stripe integrations including best practices, API/SDK upgrade guidance, and the Stripe MCP server.": "Cursor 的 Stripe 插件，用于帮助 Stripe 集成，包括最佳实践、API/SDK 升级指导和 Stripe MCP server。",
            "Quote and execute intent-based (Fusion) and cross-chain token swaps, build and manage limit orders via the Orderbook API, and call any 1inch product endpoint — portfolio balances, spot prices, token metadata, gas estimates, and more. Also includes documentation search and SDK code examples. Public tools work without auth; execution tools require authentication from the 1inch Business Portal.": "报价并执行基于意图的（Fusion）和跨链代币兑换，通过 Orderbook API 构建和管理限价单，并调用任意 1inch 产品端点——投资组合余额、现货价格、代币元数据、gas 估算等。还包含文档搜索和 SDK 代码示例。公开工具无需认证；执行工具需要从 1inch Business Portal 认证。",
            "Connect Cursor to Ramp via MCP and drive spend analysis, approvals, transaction cleanup, and vendor workflows.": "通过 MCP 将 Cursor 连接到 Ramp，并推动支出分析、审批、交易清理和供应商工作流。",
            "Build, deploy, and operate AI agents on AWS. Skills for scaffolding agents with Amazon Bedrock AgentCore (Strands, LangGraph), connecting tools via Gateway and MCP, multi-agent and A2A orchestration, memory, Cedar policies, evaluation, observability, debugging traces and logs, and production hardening (inbound auth, IAM, rate limiting, cold-start tuning).": "在 AWS 上构建、部署和运营 AI Agent。包含使用 Amazon Bedrock AgentCore（Strands、LangGraph）搭建 Agent、通过 Gateway 和 MCP 连接工具、多 Agent 和 A2A 编排、记忆、Cedar 策略、评估、可观测性、调试链路追踪与日志，以及生产加固（入站认证、IAM、限流、冷启动调优）的技能。",
            "Add Arize AX observability to LLM applications — auto-instrumentation, trace export, dataset management, experiment workflows, prompt optimization, and deep linking via the ax CLI.": "为 LLM 应用添加 Arize AX 可观测性——自动埋点、trace 导出、数据集管理、实验工作流、提示词优化，以及通过 ax CLI 深链跳转。",
            "Connect Cursor to hundreds of enterprise tools (Jira, Salesforce, Slack, Gong, Workday, etc.) via the Merge CLI": "通过 Merge CLI 将 Cursor 连接到数百个企业工具（Jira、Salesforce、Slack、Gong、Workday 等）。",
            "Sourcegraph  ·  1 skill, 1 MCP server, 2 commands": "Sourcegraph · 1 个技能，1 个 MCP 服务器，2 个命令。",
            "Tools that let coding agents verify and show their work against your running application": "让编码 Agent 能针对正在运行的应用验证并展示其工作的工具。",
            "Atlan is the context layer for enterprise AI. Connect Cursor to your organization's context repos — the knowledge, data, and semantics your AI agents need to build effectively. Use Atlan's agent skills to search & discover enterprise context, traverse end-to-end lineage, access governed data definitions and glossaries, execute SQL, curate your metadata graph, and ensure data quality — so every coding task in Cursor is grounded in trusted organizational context.": "Atlan 是企业 AI 的上下文层。将 Cursor 连接到组织的上下文仓库——你的 AI Agent 有效构建所需的知识、数据和语义。使用 Atlan Agent 技能搜索和发现企业上下文、遍历端到端血缘、访问受治理的数据定义和术语表、执行 SQL、整理元数据图谱并确保数据质量，让 Cursor 中每项编码任务都基于可信的组织上下文。",
            "A collection of DataRobot agent skills for model training, deployment, predictions, monitoring, and more.": "一组 DataRobot Agent 技能，用于模型训练、部署、预测、监控等。",
            "Search, explore, and investigate your team's remote repositories using Tabnine's Context Engine. Enables semantic code search, symbol lookup, file navigation, and OpenAPI spec querying across all indexed repositories. Includes AI coaching to help your team write better code.": "使用 Tabnine 的 Context Engine 搜索、探索和调查团队的远程仓库。支持跨所有已索引仓库的语义代码搜索、符号查找、文件导航和 OpenAPI 规范查询。包含 AI coaching，帮助团队写出更好的代码。",
            "Context Engine CLI (ctx-cli) as focused skills — guided tenant onboarding, code & knowledge-graph search, service investigation, CVE & SAST triage with ready-to-apply fixes, and coding-guideline checks.": "以聚焦技能形式提供 Context Engine CLI（ctx-cli）——引导式租户接入、代码和知识图谱搜索、服务调查、带可应用修复的 CVE 与 SAST 分诊，以及编码规范检查。",
            "UI component and design system framework. Search registries, install components as source code, and audit your project.": "UI 组件和设计系统框架。搜索 registry、以源码形式安装组件，并审计你的项目。",
            "Opsera DevSecOps Agent — AI-powered architecture analysis, security scanning, compliance auditing, and SQL security for your codebase. Free trial included.": "Opsera DevSecOps Agent——为代码库提供 AI 驱动的架构分析、安全扫描、合规审计和 SQL 安全。包含免费试用。",
            "Build, train, and deploy AI models with deep AWS AI/ML expertise brought directly into your coding assistants, covering the surface area of Amazon SageMaker AI.": "将深度 AWS AI/ML 专业知识直接带入你的编码助手，用于构建、训练和部署 AI 模型，覆盖 Amazon SageMaker AI 的能力范围。",
            "Cursor plugin for Firetiger agentic operations plugin with skills and MCP access.": "Cursor 的 Firetiger Agentic Operations 插件，提供技能和 MCP 访问能力。",
            "Simpler, safer way to run MCPs, Skills, and Agents. Discover what's running, enforce security policies in real time, protect secrets, and get full audit trails — all built for how developers actually work in Cursor.": "更简单、更安全地运行 MCP、Skills 和 Agents。发现正在运行的内容、实时执行安全策略、保护密钥，并获得完整审计轨迹——为开发者在 Cursor 中的实际工作方式而构建。",
            "Skills for working with Langfuse — the open-source LLM engineering platform for tracing, prompt management, and evaluation.": "使用 Langfuse 的技能——开源 LLM 工程平台，用于链路追踪、提示词管理和评估。",
            "Web search, content extraction, deep research, and data enrichment powered by parallel-cli.": "由 parallel-cli 提供支持的 Web 搜索、内容提取、深度研究和数据丰富。",
            "Core skills library: TDD, debugging, collaboration patterns, and proven techniques": "核心技能库：TDD、调试、协作模式和经过验证的技巧。",
            "Brainstorm, plan, debug, review, and compound learnings with AI agents": "与 AI Agent 一起头脑风暴、规划、调试、评审并沉淀复合学习。",
            "Browser automation for Cursor. Navigate, click, fill forms, extract data, capture network, manage tabs, and take screenshots -- powered by browse-cli and controlled via MCP.": "Cursor 的浏览器自动化。可导航、点击、填写表单、提取数据、捕获网络、管理标签页并截图——由 browse-cli 提供支持，并通过 MCP 控制。",
            "Scaffold and validate new Cursor plugins. Handles directory setup, manifest generation, and pre-submission quality checks for the marketplace.": "脚手架并验证新的 Cursor 插件。处理目录创建、manifest 生成和提交市场前的质量检查。",
            "Upstash Context7 MCP server for up-to-date documentation lookup. Pull version-specific documentation and code examples directly from source repositories into your LLM context.": "Upstash Context7 MCP server，用于查询最新文档。可直接从源仓库把特定版本文档和代码示例拉入 LLM 上下文。",
            "Connect and operate 1000+ external apps from Cursor via the Composio MCP server. Managed OAuth, intelligent tool routing, and a remote sandbox for bulk data processing.": "通过 Composio MCP server 从 Cursor 连接并操作 1000+ 个外部应用。提供托管 OAuth、智能工具路由，以及用于批量数据处理的远程沙盒。",
            "Render PR diffs as interactive Cursor Canvases organized for reviewer comprehension — groups changes by importance, separates boilerplate from core logic, and highlights tricky or unexpected code.": "将 PR diff 渲染为交互式 Cursor Canvases，按审查者理解方式组织——按重要性分组变更、区分样板代码和核心逻辑，并突出棘手或意外的代码。",
            "Render documentation — architecture notes, API references, runbooks, and codebase walkthroughs — as a navigable Cursor Canvas with sections, table of contents, diagrams, and cross-references.": "将文档——架构说明、API 参考、runbook 和代码库 walkthrough——渲染为可导航的 Cursor Canvas，包含章节、目录、图表和交叉引用。",
            "Databricks skills for the CLI, Apps, Lakebase, Model Serving, Lakeflow Jobs, Spark Declarative Pipelines, Declarative Automation Bundles (DABs), and classic-to-serverless migration.": "Databricks 技能，覆盖 CLI、Apps、Lakebase、Model Serving、Lakeflow Jobs、Spark Declarative Pipelines、Declarative Automation Bundles（DABs）以及 classic-to-serverless 迁移。",
            "Port MCP Server Gives Cursor's AI agent full engineering context. Port is your system of record for every service, team, dependency, and standard - connect it to Cursor so the agent understands not just your code, but who owns it, what depends on it, and what actions are available to take.": "Port MCP Server 为 Cursor 的 AI Agent 提供完整工程上下文。Port 是每个服务、团队、依赖和标准的记录系统——将其连接到 Cursor 后，Agent 不仅理解你的代码，还能理解归属、依赖关系以及可执行操作。",
            "Microsoft Dataverse plugin for coding agents — powering CRUD, bulk data operations, advanced queries, schema lifecycle, and environment management through intelligent skills that unify MCP, CLI, and SDK workflows.": "面向编码 Agent 的 Microsoft Dataverse 插件——通过整合 MCP、CLI 和 SDK 工作流的智能技能，支持 CRUD、批量数据操作、高级查询、schema 生命周期和环境管理。",
            "Roboflow computer vision skills and MCP tools for datasets, annotation, training, workflows, inference, and deployment.": "Roboflow 计算机视觉技能和 MCP 工具，覆盖数据集、标注、训练、工作流、推理和部署。",
            "Drive Lovable from Cursor: create projects, send work to the Lovable agent, manage Lovable Cloud databases, and deploy, all through the Lovable MCP server.": "从 Cursor 驱动 Lovable：通过 Lovable MCP server 创建项目、向 Lovable Agent 发送工作、管理 Lovable Cloud 数据库并部署。",
            "Dun & Bradstreet empowers teams to execute risk workflows such as KYC/KYB, entity resolution, screening, alert triage, and more using relationship-aware business context from the D&B Commercial Graph™. Verified risk data, anchored in the global standard D-U-N-S® Number business identifier, and policy-driven logic provide the foundation for consistent decisioning across systems of record and scalable risk operations in regulated environments.": "Dun & Bradstreet 让团队能利用 D&B Commercial Graph™ 中具备关系感知的商业上下文执行 KYC/KYB、实体解析、筛查、告警分诊等风险工作流。基于全球标准 D-U-N-S® Number 企业标识的已验证风险数据和策略驱动逻辑，为受监管环境中跨记录系统的一致决策和可扩展风险运营提供基础。",
            "Snyk API & Web MCP Server — onboard scan targets, configure authentication, run DAST scans, and triage findings through natural language. Built on FastMCP 2.0.": "Snyk API & Web MCP Server——接入扫描目标、配置认证、运行 DAST 扫描，并通过自然语言分诊发现。基于 FastMCP 2.0 构建。",
            "Create and share short video updates from agent work.": "从 Agent 工作创建并分享短视频更新。",
            "Create, refine, and vectorize SVG assets with the hosted QuiverAI MCP server.": "使用托管的 QuiverAI MCP server 创建、优化并向量化 SVG 资源。",
            "Automatically enforce SonarQube code quality and security in the agent coding loop — 7,000+ rules, secrets scanning, agentic analysis, and quality gates across 40+ languages.": "在 Agent 编码循环中自动执行 SonarQube 代码质量和安全——7000+ 规则、密钥扫描、Agentic 分析，以及覆盖 40+ 种语言的质量门禁。",
            "Connect Cursor to Raisely. Ships the Raisely MCP server so you can query and manage campaigns, donations, supporters, and more from chat.": "将 Cursor 连接到 Raisely。附带 Raisely MCP server，因此你可以从聊天中查询和管理活动、捐赠、支持者等。",
            "Create HeyGen avatar videos, personalized video messages, and translated / dubbed videos. Build a persistent digital identity from a photo, generate presenter-led videos with your digital twin, and localize existing videos into 175+ languages with voice cloning and lip-sync.": "创建 HeyGen 头像视频、个性化视频消息，以及翻译/配音视频。可从照片构建持久数字身份，使用数字分身生成主持人视频，并通过语音克隆和唇同步将现有视频本地化为 175+ 种语言。",
            "Thermo-nuclear branch review: deep correctness and security audits plus harsh code-quality rubrics, parallel subagents, thermos orchestration, and optional take-the-wheel and FSD merge-ready flows.": "热核级分支审查：深度正确性与安全审计、严苛代码质量评分、并行子 Agent、thermos 编排，以及可选的接管驾驶和 FSD 合并就绪流程。",
            "if you want to go fast, go deep first. pstack helps you write less, but higher quality code. rigorous agent workflows you can parallelize with confidence.": "如果想走得快，先深入。pstack 帮你少写代码但提高质量，提供可放心并行化的严谨 Agent 工作流。",
            "Modern Web Guidance is an agent skill and CLI tool designed to help AI coding agents build web applications using modern, secure, and high-performance APIs rather than outdated workarounds. Supported by the Google Chrome team, it injects expert-curated web platform best practices directly into an agent's context window to prevent the generation of bloated, legacy code.": "Modern Web Guidance 是 Agent 技能和 CLI 工具，旨在帮助 AI 编码 Agent 使用现代、安全、高性能的 API 构建 Web 应用，而不是过时的 workaround。它由 Google Chrome 团队支持，会把专家策划的 Web 平台最佳实践直接注入 Agent 上下文窗口，防止生成臃肿的遗留代码。",
            "Generate images, videos, and more using Higgsfield MCP from Cursor.": "在 Cursor 中使用 Higgsfield MCP 生成图片、视频等内容。",
            "Buildkite MCP server and skills for common CI/CD workflows (designing pipelines, troubleshooting builds plus agent runtime, CLI, API)": "用于常见 CI/CD 工作流的 Buildkite MCP server 和技能（设计流水线、排障构建以及 Agent 运行时、CLI、API）。",
            "AI-powered dependency intelligence. Check vulnerabilities, find safer versions, and make better dependency decisions using Sonatype's component data.": "AI 驱动的依赖智能。使用 Sonatype 组件数据检查漏洞、寻找更安全版本，并做出更好的依赖决策。",
            "Corridor secures your AI-generated code. To get started, please create an API key at https://app.corridor.dev/settings and update your ~/.bashrc or ~/.zshrc to include the following: `export CORRIDOR_API_KEY=your-api-key`": "Corridor 保护你的 AI 生成代码。开始使用前，请在 https://app.corridor.dev/settings 创建 API key，并更新你的 ~/.bashrc 或 ~/.zshrc，加入：`export CORRIDOR_API_KEY=your-api-key`。",
            "Aikido  ·  3 skills, 1 rule, 1 MCP server": "Aikido · 3 个技能，1 条规则，1 个 MCP 服务器。",
            "Fan a large task out across parallel Cursor cloud agents via the Cursor SDK: planners publish tasks, workers hand off back up, and a script reconciles the tree from disk and git.": "通过 Cursor SDK 将大型任务分发给并行 Cursor cloud agents：规划者发布任务，工作者回传交接，并由脚本从磁盘和 git 协调工作树。",
            "Secure container images and hardened library dependencies powered by Chainguard. Query images, check advisories, manage policies, and configure Chainguard Libraries for Java, JavaScript, and Python.": "由 Chainguard 提供支持的安全容器镜像和加固库依赖。可查询镜像、检查公告、管理策略，并为 Java、JavaScript 和 Python 配置 Chainguard Libraries。",
            "Ship faster with Sinch in Cursor - SMS, WhatsApp, RCS, voice, email, verification, numbers, and more, all with the help of Skills and Sinch MCP.": "在 Cursor 中借助 Sinch 更快交付——SMS、WhatsApp、RCS、语音、邮件、验证、号码等，均由 Skills 和 Sinch MCP 帮助完成。",
            "Build apps, scripts, CI pipelines, and automations on top of the Cursor TypeScript SDK (@cursor/sdk) — runtime selection, auth, streaming, MCP, error handling, and ready-to-extend integration patterns.": "基于 Cursor TypeScript SDK（@cursor/sdk）构建应用、脚本、CI 流水线和自动化——涵盖运行时选择、认证、流式处理、MCP、错误处理，以及可扩展的集成模式。",
            "AI agent skills for integrating the Scandit Data Capture SDK — product selection, documentation, and implementation guides for barcode scanning, ID capture, and smart label capture.": "用于集成 Scandit Data Capture SDK 的 AI Agent 技能——产品选择、文档，以及条码扫描、ID 采集和智能标签采集的实现指南。",
            "Auth0 skills for quickstarts, migration, MFA, branding, custom domains, Advanced Custom Universal Login (ACUL) screen generation, and framework-specific SDK integrations for React, Next.js, Vue, Nuxt, Angular, Express, Fastify, FastAPI, Flask, Go, Spring Boot, Java MVC, Swift, Android, Flutter, Flutter Web, ASP.NET Core, React Native, Expo, Ionic React (Capacitor), Ionic Angular (Capacitor), and Ionic Vue (Capacitor).": "Auth0 技能，覆盖快速开始、迁移、MFA、品牌、自定义域、Advanced Custom Universal Login（ACUL）页面生成，以及 React、Next.js、Vue、Nuxt、Angular、Express、Fastify、FastAPI、Flask、Go、Spring Boot、Java MVC、Swift、Android、Flutter、Flutter Web、ASP.NET Core、React Native、Expo、Ionic React（Capacitor）、Ionic Angular（Capacitor）和 Ionic Vue（Capacitor）的框架特定 SDK 集成。",
            "Patterns for designing CLIs that coding agents can run reliably: non-interactive flags, layered help with examples, pipelines, actionable errors, idempotency, and dry-run.": "设计编码 Agent 可可靠运行的 CLI 模式：非交互式参数、带示例的分层帮助、管道、可操作错误、幂等性和 dry-run。",
            "Use Cloudinary directly in Cursor. Upload, manage, optimize, and transform images and videos at scale using natural language.": "直接在 Cursor 中使用 Cloudinary。通过自然语言大规模上传、管理、优化和转换图片与视频。",
            "CLI-backed repo compatibility scans plus Cursor agents that audit startup, validation, and docs against reality.": "由 CLI 支撑的仓库兼容性扫描，以及审计启动、验证和文档是否符合现实的 Cursor Agent。",
            "Web search, content extraction, crawling, deep research, and URL discovery powered by tvly CLI.": "由 tvly CLI 提供支持的 Web 搜索、内容提取、爬取、深度研究和 URL 发现。",
            "Connect Cursor to Plain — manage support threads, customers, tenants, and help center articles directly from your editor.": "将 Cursor 连接到 Plain——直接从编辑器管理支持线程、客户、租户和帮助中心文章。",
            "Connect Cursor to ThousandEyes MCP endpoints for network intelligence workflows.": "将 Cursor 连接到 ThousandEyes MCP 端点，用于网络智能工作流。",
            "Snyk security scanning, remediation, and dependency health for Cursor": "Cursor 的 Snyk 安全扫描、修复和依赖健康能力。",
            "eToro API integration for Cursor — rules, skills, and live API documentation for building on the eToro Public API. Covers OAuth SSO, market data, trading, account-snapshot calculations, agent-portfolios (with bulk, rebalance, and conditional-rule flows), and social features.": "Cursor 的 eToro API 集成——用于基于 eToro Public API 构建的规则、技能和实时 API 文档。覆盖 OAuth SSO、市场数据、交易、账户快照计算、Agent 投资组合（含批量、再平衡和条件规则流程）以及社交功能。",
            "1Password plugin for Cursor — securely manage development secrets.": "Cursor 的 1Password 插件——安全管理开发密钥。",
            "Plugin by Semgrep. Provides security scanning via MCP, hooks, and skills for Cursor.": "Semgrep 提供的插件。通过 MCP、hooks 和技能为 Cursor 提供安全扫描。",
            "Endor Labs skills for setting up endorctl and analyzing dependency upgrade impact": "用于设置 endorctl 并分析依赖升级影响的 Endor Labs 技能。",
            "Incrementally learns durable user preferences and workspace facts from transcript changes and keeps AGENTS.md up to date with plain bullet points.": "从 transcript 变更中增量学习持久的用户偏好和工作区事实，并用普通项目符号保持 AGENTS.md 更新。",
            "Internal workflows used by Cursor developers for CI, code review, shipping, control-cli, control-ui, verify-this, test reliability, code cleanup, and work summaries. Designed to work without requiring third-party service integrations.": "Cursor 开发者内部使用的工作流，覆盖 CI、代码审查、发布、control-cli、control-ui、verify-this、测试可靠性、代码清理和工作总结。设计为无需第三方服务集成即可工作。",
            "Use Magic Patterns (magicpatterns.com) from your coding agent: prototype ideas, generate UI inspiration, upload local UI, and integrate Magic Patterns designs into your codebase.": "从你的编码 Agent 使用 Magic Patterns（magicpatterns.com）：原型化想法、生成 UI 灵感、上传本地 UI，并将 Magic Patterns 设计集成进代码库。",
            "Write HTML, render video. Compositions, Tailwind v4 styles, GSAP and runtime adapter animations, captions, voiceovers, audio-reactive visuals, and website-to-video capture for HyperFrames.": "编写 HTML，渲染视频。支持 compositions、Tailwind v4 样式、GSAP 和运行时适配器动画、字幕、配音、音频响应视觉效果，以及网站到视频捕获，可用于 HyperFrames。",
            "审查近期变更，并为缺乏充分覆盖的高风险逻辑添加测试": "审查近期变更，并为缺乏充分覆盖的高风险逻辑添加测试。",
            "Assign reviewers based on code changes and auto-approve low-risk PRs": "根据代码变更分配审查者，并自动批准低风险 PR。",
            "Take a first pass at addressing inline review comments on PR diffs": "先对 PR diff 中的内联审查评论做第一轮处理。",
            "Detect CI failures on main and automatically open PRs": "检测 main 分支上的 CI 失败，并自动打开 PR。",
            "Find stale feature flags that are fully rolled out and remove dead code paths": "查找已经完全推出的过期功能开关，并移除死代码路径。",
            "Find at-risk customers using usage analytics, call notes, Slack escalations, and Linear blockers": "使用用量分析、通话记录、Slack 升级和 Linear 阻塞项找出有风险的客户。",
            "Post a daily Slack digest summarizing notable repository changes and risks from the previous day": "每天发布一条 Slack 摘要，总结前一天值得注意的仓库变更和风险。",
            "分析近期提交中的高严重性正确性缺陷，并提交安全修复": "分析近期提交中的高严重性正确性缺陷，并提交安全修复。",
            "Review pull requests for exploitable security issues and flag only validated findings before merge": "审查拉取请求中可被利用的安全问题，并在合并前只标记已验证的发现。",
            "Monitor a Slack channel for bug reports, investigate the codebase, and fix with a PR": "监控 Slack 频道中的缺陷报告，调查代码库，并通过 PR 修复。",
            为近期变更或文档不足的代码创建并更新开发者文档: "为近期变更或文档不足的代码创建并更新开发者文档。",
            "Investigate recurring production errors from Datadog, identify root causes, and propose fixes": "调查 Datadog 中反复出现的生产错误，识别根因并提出修复。",
            "Investigate errors from Sentry, identify root causes, and propose fixes": "调查 Sentry 中的错误，识别根因并提出修复。",
            "Triage new issues by investigating bugs, planning feature requests, and opening PRs for easy fixes": "通过调查缺陷、规划功能请求并为简单修复打开 PR 来分诊新 issue。",
            "Re-check critical repository invariants on a schedule and alert only when a rule regresses": "按计划重新检查关键仓库不变量，并仅在规则退化时告警。",
            "Investigate incidents using Datadog and code context": "使用 Datadog 和代码上下文调查事件。",
            "Every Monday night, prepare the Anyone onboarding materials by opening a teammate PR and capturing rollback prep details": "每周一晚上，通过打开队友 PR 并捕获回滚准备细节，准备 Anyone 入职材料。",
            "Weekly product usage, activation, retention, and feature adoption digest from Databricks": "每周从 Databricks 汇总产品用量、激活、留存和功能采用摘要。",
            "Answer product questions in a dedicated Slack channel using Slack, Notion, Linear, and GitHub context": "使用 Slack、Notion、Linear 和 GitHub 上下文，在专用 Slack 频道回答产品问题。",
            "Analyze Stripe revenue, churn signals, and product pricing opportunities": "分析 Stripe 收入、流失信号和产品定价机会。",
            "Triage dependency-vulnerability tickets from Linear and open upgrade PRs when the fix is safe": "分诊 Linear 中的依赖漏洞工单，并在修复安全时打开升级 PR。",
            "按计划审查整个仓库，并对已验证的高影响安全问题发出警报": "按计划审查整个仓库，并对已验证的高影响安全问题发出警报。",
            "Summarize important DMs, mentions, and the user's top active Slack channels": "汇总重要私信、提及和用户最活跃的 Slack 频道。",
            "Investigate failed or cancelled workflow runs and report findings in Slack": "调查失败或取消的 workflow run，并在 Slack 中报告发现。"
        };

        module.exports = { marketplaceTempTextRules };
        },
    "src/main.ts": (module, exports, require) => {
        const { marketplaceTempTextRules } = require("src/marketplace-temp.ts");
        const STORAGE_KEY = "cursor-chinese-language";
        const state = {
            lastHref: location.href,
            language: readLanguagePreference()
        };
        const textRules = {
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
            "Your codebase, prompts, edits and other usage data will be stored and trained on by Cursor to improve the product.": "你的代码库、提示词、编辑和其他使用数据会由 Cursor 存储并用于训练，以改进产品。",
            "Profile Image": "个人资料图片",
            "First Name": "名",
            "Last Name": "姓",
            "Public profile": "公开个人资料",
            "When enabled, your cursor.com profile page is visible to anyone with the link.": "启用后，任何拥有链接的人都可以查看你的 cursor.com 个人资料页。",
            "Review Provider": "审查提供商",
            "Choose GitHub or Graphite for pull request links on web and desktop": "为网页端和桌面端的拉取请求链接选择 GitHub 或 Graphite。",
            "Session revocation may take up to 10 minutes to complete.": "撤销会话最多可能需要 10 分钟完成。",
            "Delete Account": "删除账户",
            "Are you sure you want to delete your account? This action is irreversible.": "确定要删除你的账户吗？此操作不可逆。",
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
            "Automatically review and scan code for security-related bugs, issues, and vulnerabilities. Billed at plan rates.": "自动审查和扫描代码中的安全相关缺陷、问题和漏洞。按套餐费率计费。",
            "Automated PR Reviews": "自动 PR 审查",
            "Reviews every pull request automatically": "自动审查每个拉取请求",
            "Context-Aware Analysis": "上下文感知分析",
            "Understands your codebase and existing review discussion": "理解你的代码库和现有的审查讨论",
            "Inline Findings": "内联发现",
            "Comments directly on risky lines with explanations": "直接在风险行上评论并附带说明",
            "Zero Workflow Changes": "零工作流变更",
            "Works directly inside your existing code review process": "直接内嵌到你现有的代码审查流程中",
            "Create your first agent": "创建你的第一个 Agent",
            "Security Reviewer": "安全审查者",
            "Reviews pull requests before merge and leaves inline findings": "在合并前审查拉取请求并留下内联发现",
            "Checks every PR before merge": "在合并前检查每个 PR",
            "Auth, privacy, injection, and trust-boundary regressions": "认证、隐私、注入和信任边界回归",
            "Leaves actionable review comments": "留下可操作的审查评论",
            "Findings appear inline with context for the author": "发现结果内联显示，为作者提供上下文",
            "New Reviewer": "新建审查者",
            "Vulnerability Scanner": "漏洞扫描器",
            "Scans at rest code repositories on a schedule": "按计划扫描静态代码仓库",
            "Scans code outside the PR flow": "扫描 PR 流程之外的代码",
            "Great for existing repos, risky areas, and recurring checks": "适用于现有仓库、高风险区域和定期检查",
            "Creates trackable agent runs": "创建可追踪的 Agent 运行",
            "Review findings and follow vulnerability history over time": "审查发现并持续追踪漏洞历史",
            "New Scanner": "新建扫描器",
            "Automatically approve pull requests and request reviewers when human review is needed. Billed at plan rates.": "在需要人工审查时自动批准拉取请求并请求审查者。按套餐费率计费。",
            "Automated PR Approval": "自动 PR 批准",
            "Approves pull requests that meet your review criteria": "批准符合你审查标准的拉取请求",
            "Reviewer Routing": "审查者路由",
            "Requests human reviewers when changes need extra attention": "当变更需要额外关注时请求人工审查者",
            "Policy-Aware Decisions": "策略感知决策",
            "Applies custom policy files to drive agent decisions": "应用自定义策略文件来驱动 Agent 决策",
            "AI Reviewer Aware": "感知 AI 审查者",
            "Uses Bugbot and Security Agent findings in approval decisions": "在批准决策中使用 Bugbot 和 Security Agent 的发现",
            "Start with a PR approval workflow, then tune triggers, criteria, and reviewer routing.": "从 PR 批准工作流开始，然后调整触发器、标准和审查者路由。",
            "Pull Request Router and Approver": "拉取请求路由与批准器",
            "Auto-approve pull requests when your criteria are met or assign human reviewers when needed": "在满足你的标准时自动批准拉取请求，或在需要时分配人工审查者",
            "Approves based on criteria": "基于标准批准",
            "Uses criteria, policies, and AI reviewer context": "使用标准、策略和 AI 审查者上下文",
            "Auto-assigns reviewers": "自动分配审查者",
            "Assigns reviewers when human review is needed": "需要人工审查时分配审查者",
            "Extend Cursor with skills, rules, subagents, MCP tools, and hooks": "通过技能、规则、子 Agent、MCP 工具和 hooks 扩展 Cursor",
            "No Plugins": "没有插件",
            "Browse the marketplace or import custom plugins to extend": "浏览市场或导入自定义插件以扩展",
            "Cursor with Skills, Rules, Agents, Hooks, and MCPs.": "包含技能、规则、Agents、Hooks 和 MCP 的 Cursor。",
            "Add Plugin": "添加插件",
            Suggested: "推荐",
            "Browse Marketplace": "浏览市场",
            "Connect external tools to extend your team's workflow.": "连接外部工具以扩展团队的工作流。",
            "Disconnect Cursor app": "断开 Cursor 应用",
            "Are you sure you want to disconnect the Cursor app": "确定要断开 Cursor 应用吗",
            "? This unlinks the Bitbucket workspace from your team, so Bugbot can no longer comment as Cursor. The app itself stays installed in Bitbucket — a workspace admin can uninstall it there.": "这将解除 Bitbucket 工作区与团队之间的关联，Bugbot 将无法再以 Cursor 身份评论。应用本身仍保留在 Bitbucket 中——工作区管理员可以在那里卸载。",
            Datadog: "Datadog",
            "Use Datadog directly in Cursor through a preconfigured Datadog MCP server. Query logs, metrics, traces, dashboards, and more through natural conversation. This plugin is in preview.": "通过预配置的 Datadog MCP 服务器直接在 Cursor 中使用 Datadog。可通过自然对话查询日志、指标、链路追踪、仪表盘等。此插件处于预览阶段。",
            View: "查看",
            "Slack MCP server. Search channels, send messages, and perform other Slack actions through MCP-compatible clients.": "Slack MCP 服务器。通过兼容 MCP 的客户端搜索频道、发送消息并执行其他 Slack 操作。",
            Figma: "Figma",
            "Plugin that includes the Figma MCP server and Skills for common workflows": "包含 Figma MCP 服务器和常用工作流技能的插件",
            "Cursor Plugin for Linear - enables AI assistants to manage issues, projects, documents, and more across your Linear workspace": "Cursor 的 Linear 插件，可让 AI 助手管理 Linear 工作区中的问题、项目、文档等",
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
            "Usage limits reached. This Agent is running on Auto for free.": "已达到用量限制。此 Agent 正在免费使用 Auto 运行。",
            "Edit limits": "编辑限制",
            "Continue with Auto": "继续使用 Auto",
            "Cloud agents previously used 1M context window size by default. Now, you can use the Edit button next to your selected model to choose your balance of capability and cost.": "云端 Agent 此前默认使用 100 万 token 上下文窗口。现在，你可以点击所选模型旁的「编辑」按钮，在能力与成本之间做权衡。",
            "Select repository": "选择仓库",
            "Add repository": "添加仓库",
            "Add Environment": "添加环境",
            Refresh: "刷新",
            "All repositories": "所有仓库",
            "Select repositories...": "选择仓库...",
            "Select multiple": "多选",
            "Run security audit": "运行安全审计",
            Popular: "热门",
            "Code Review": "代码审查",
            Security: "安全",
            "Incidents & Triage": "事故与分诊",
            "Data & Research": "数据与研究",
            "Find bugs": "Find bugs",
            "Analyze recent commits for high-severity correctness bugs and submit safe fixes": "分析近期提交中的高严重性正确性缺陷，并提交安全修复",
            "Scan codebase for vulnerabilities": "Scan codebase for vulnerabilities",
            "Review the full repository on a schedule and alert on validated high-impact security issues": "按计划审查整个仓库，并对已验证的高影响安全问题发出警报",
            "Generate docs": "生成文档",
            "Create and update developer documentation for recently changed or under-documented code": "为近期变更或文档不足的代码创建并更新开发者文档",
            "Add test coverage": "Add test coverage",
            "Review recent changes and add tests for high-risk logic that lacks adequate coverage": "审查近期变更，并为缺乏充分覆盖的高风险逻辑添加测试",
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
            "Save time by automating repetitive tasks with always-on agents that respond to triggers.": "通过始终在线、响应触发器的 Agent 自动化重复任务，节省时间。",
            "Analyze recent cloud agent runs to root-cause environment setup failures from setup logs, transcripts, and environment info, then report them in Slack": "分析近期云端 Agent 运行记录，结合安装日志、对话记录和环境信息定位环境配置失败根因，并在 Slack 中报告。",
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
            "Create Agents to edit and run code, asynchronously": "创建 Agent 以异步编辑和运行代码",
            "Cloud Agents push code to your remote so you can review and merge their changes.": "Cloud Agents 会将代码推送到你的远端，方便你审查并合并更改。",
            "Connect Source Control": "连接源码控制",
            "Self-Hosted": "自托管",
            "Monitor and manage your self-hosted cloud machines": "监控并管理你的自托管云机器",
            "Enable self-hosted pool": "启用自托管池",
            "Enable self-hosted pool to create a personal pool of workers.": "启用自托管池以创建个人工作节点池。",
            "Enable remote-control": "启用远程控制",
            "Control your local agents remotely from mobile and web.": "通过移动端和网页远程控制你的本地 Agents。",
            "My Machines": "我的机器",
            "View personal self-hosted workers and CLI commands to connect machines.": "查看个人自托管工作节点以及连接机器的 CLI 命令。",
            Defaults: "默认值",
            "Default Model": "默认模型",
            "Used when no model is specified": "未指定模型时使用",
            "Used when no repository is specified": "未指定仓库时使用",
            "Select model": "选择模型",
            "Default Repository": "默认仓库",
            "Connect Git": "连接 Git",
            "Base Branch": "基础分支",
            "When empty, Cloud Agent will use a repository's default branch (recommended)": "留空时，Cloud Agent 将使用仓库的默认分支（推荐）",
            "Branch Prefix": "分支前缀",
            "Branch name...": "分支名...",
            "cursor/": "cursor/",
            "Prefix for branch names created by Cloud Agent": "Cloud Agent 创建的分支名称前缀",
            "Create PRs": "创建 PR",
            "Automatically create a pull request when Cloud Agent completes.": "Cloud Agent 完成后自动创建拉取请求。",
            "For Single Model Runs": "单模型运行时",
            "Slack Notifications": "Slack 通知",
            "Get notified in Slack when a Cloud Agent completes a task": "Cloud Agent 完成任务时在 Slack 中接收通知",
            "Slack routing": "Slack 路由",
            "Routing rules to help Cloud Agents pick the right repository or environment.": "用于帮助 Cloud Agents 选择正确仓库或环境的路由规则。",
            "Add Rule": "添加规则",
            "No routing rules yet": "还没有路由规则",
            "Network Access Settings": "网络访问设置",
            "Control which network destinations your cloud agents can access": "控制云端 Agents 可以访问哪些网络目标",
            "Allow all network access": "允许所有网络访问",
            "My Secrets": "我的密钥",
            "Securely set environment variables for your Cloud Agents.": "为你的 Cloud Agents 安全设置环境变量。",
            "Add Secrets": "添加密钥",
            "No secrets yet": "还没有密钥",
            "No environments configured": "尚未配置环境",
            "Start Setup": "开始设置",
            "Create a New Environment": "创建新环境",
            "Development environment setup": "开发环境配置",
            "No pushed changes": "没有已推送的更改",
            "Environment is ready to be saved.": "环境已可保存。",
            "Select one or more repositories.": "选择一个或多个仓库。",
            "Allow posting artifacts to GitHub": "允许将产物发布到 GitHub",
            "Allow cloud agents to embed images directly in PR descriptions using hard-to-guess public URLs.": "允许云端 Agent 使用难以猜测的公开 URL，将图片直接嵌入 PR 描述。",
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
            "Paste your .env or type a secret name (optional)": "粘贴 .env 文件或输入密钥名称（可选）",
            "Apply to:": "应用于：",
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
            "Automatically review pull requests (PRs) for bugs and issues. Bugbot runs are billed based on underlying agent usage.": "自动审查拉取请求（PR）中的缺陷和问题。Bugbot 运行会基于底层 Agent 用量计费。",
            "Automatically review pull requests (PRs) for bugs and issues.": "自动审查拉取请求（PR）中的缺陷和问题。",
            "Bugbot runs are billed based on underlying agent usage.": "Bugbot 运行会基于底层 Agent 用量计费。",
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
            "Allow Bugbot to learn new rules based on PR activity": "允许 Bugbot 根据 PR 活动学习新规则",
            Autofix: "自动修复",
            "Automatically create fixes for issues found by Bugbot": "自动为 Bugbot 发现的问题创建修复",
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
            "Learned and manually-created rules. Version control Rules with": "已学习规则与手动创建的规则。通过版本控制管理规则，配合",
            "Learned Rules": "已学习规则",
            "No organizations with Bugbot enabled": "没有已启用 Bugbot 的组织",
            "Enable Bugbot for at least one organization to start using repository rules.": "在至少一个组织上启用 Bugbot 后，即可开始使用仓库规则。",
            "Enable repositories": "启用仓库",
            "Bugbot automatically updates learned rules from pull requests and feedback. You can also teach rules by commenting \"@cursor remember [fact]\" in a pull request.": "Bugbot 会根据拉取请求和反馈自动更新已学习规则。你也可以在 PR 中评论「@cursor remember [事实]」来教它新规则。",
            "Manual rules let you add repository-specific guidance for Bugbot reviews.": "手动规则可让你为 Bugbot 审查添加仓库专属指导。",
            "Add Manual Rule": "添加手动规则",
            Content: "内容",
            "Maximum 20000 characters (leading and trailing spaces are removed when you save).": "最多 20000 个字符（保存时会移除首尾空格）。",
            "Scoped Paths": "作用路径",
            "(optional)": "（可选）",
            "Limit this rule to specific files or directories. Leave empty to apply repo-wide.": "将此规则限制到特定文件或目录。留空则应用于整个仓库。",
            "GitHub Connections": "GitHub 连接",
            "Manage connected accounts and repositories": "管理已连接的账户和仓库",
            "GitLab Connections": "GitLab 连接",
            "Bugbot reviews are billed through your Cursor plan usage": "Bugbot 审查会计入你的 Cursor 套餐用量",
            "Enable Bugbot": "启用 Bugbot",
            "Enable Bugbot on a repository to get started": "先在某个仓库上启用 Bugbot 以开始使用",
            "To start using Bugbot, you need to enable it on at least one repository. Select an organization below to get started.": "要开始使用 Bugbot，你需要在至少一个仓库上启用它。请在下方选择一个组织以开始。",
            "Repositories Enabled": "已启用仓库",
            "Reviews pull requests for security vulnerabilities, auth regressions, and injection attacks.": "审查拉取请求中的安全漏洞、认证回归和注入攻击。",
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
            "Every PR is automatically checked against these categories. Toggle off any you don't need.": "每个 PR 都会自动对照这些类别进行检查。可关闭不需要的类别。",
            "General Security": "通用安全",
            "Auth and authorization regressions, injection vulnerabilities, privilege escalation, secret and credential exposure.": "认证与授权回归、注入漏洞、权限提升、密钥与凭据泄露。",
            "AI & Agent Trust Boundaries": "AI 与 Agent 信任边界",
            "Prompt injection, unsafe tool auto-approval, model-controlled input reaching privileged execution paths, fail-open behavior in agent infrastructure.": "提示词注入、不安全的工具自动批准、模型控制的输入进入特权执行路径、Agent 基础设施中的 fail-open 行为。",
            "Filesystem & Resource Access": "文件系统与资源访问",
            "Path traversal, sandbox escape, symlink attacks, unvalidated file paths from user or model-controlled input.": "路径遍历、沙箱逃逸、符号链接攻击、来自用户或模型控制输入的未验证文件路径。",
            "Privacy & Data Handling": "隐私与数据处理",
            "Unauthorized data egress, missing consent or privacy mode checks, sensitive data written to logs, analytics, or storage without classification guards.": "未经授权的数据外泄、缺少同意或隐私模式检查、敏感数据未经分类保护写入日志/分析/存储。",
            "Product & Platform Patterns": "产品与平台模式",
            "Unauthenticated endpoints, session/auth context mutation, TLS configuration, CSP and trusted types exceptions. Configurable per team.": "未认证端点、会话/认证上下文变更、TLS 配置、CSP 与 trusted types 例外。可按团队配置。",
            "API & RPC Privilege": "API 与 RPC 权限",
            "Newly added endpoints or procedures that expose privileged operations without proper access controls. Delta-focused — only fires on net-new surface area.": "新增的端点或过程在未实施适当访问控制的情况下暴露特权操作。聚焦增量——仅在新增暴露面时触发。",
            "Config & Template Injection": "配置与模板注入",
            "Unsafe data wired into configuration files, templates, or rendering pipelines where the vulnerability is in how data flows into declarative layers.": "不安全的数据流入配置文件、模板或渲染管道，漏洞在于数据如何进入声明式层。",
            "checks enabled during review": "审查期间启用的检查",
            "Custom Instruction": "自定义指令",
            "e.g. Always check for SQL injection vulnerabilities in any database query. Flag any use of string concatenation in SQL statements...": "例如：始终检查任何数据库查询中的 SQL 注入漏洞。标记 SQL 语句中使用字符串拼接的情况……",
            "Provide a single custom instruction for the Security Agent to follow when reviewing pull requests.": "提供一条自定义指令，供 Security Agent 在审查拉取请求时遵循。",
            "Tools and MCPs": "工具与 MCP",
            "Comment on Pull Request": "在 Pull Request 上评论",
            "Add an MCP server to give this agent access to its tools. You can instruct the agent on how it should use MCP tools in the custom instruction": "添加 MCP 服务器，让此 Agent 访问其工具。你可以在自定义指令中说明 Agent 应如何使用 MCP 工具。",
            "Add an MCP server to give this agent access to its tools.": "添加 MCP 服务器，让此 Agent 访问其工具。",
            "You can instruct the agent on how it should use MCP tools in the custom prompt.": "你可以在自定义提示词中说明 Agent 应如何使用 MCP 工具。",
            "You can instruct the agent on how it should use MCP tools in the custom instruction.": "你可以在自定义指令中说明 Agent 应如何使用 MCP 工具。",
            "New connection": "新建连接",
            Users: "用户",
            "Approves pull requests when configured review signals and approval criteria are satisfied.": "当配置的审查信号和批准标准满足时，批准拉取请求。",
            "Add trigger": "添加触发器",
            "Add Trigger": "添加触发器",
            "Discard & go back": "放弃并返回",
            Discard: "放弃",
            "Select Orgs": "选择组织",
            "Send to Slack": "发送到 Slack",
            in: "在",
            by: "由",
            "Configure additional review signals when deciding whether this agent can approve a pull request.": "在决定此 Agent 是否可以批准拉取请求时，配置额外的审查信号。",
            "Use Bugbot Review Context": "使用 Bugbot 审查上下文",
            "Include Bugbot review context in the approval decision.": "在批准决策中包含 Bugbot 审查上下文。",
            "Use Security Review Context": "使用 Security 审查上下文",
            "Include Security Agent review context in the approval decision.": "在批准决策中包含 Security Agent 审查上下文。",
            "Use Risk Score": "使用风险评分",
            "Classify PR risk before approving. Tune classification in the custom prompt.": "批准前对 PR 风险进行分类。在自定义提示词中调整分类规则。",
            "Maximum Risk for Approval": "批准的最高风险",
            "The highest risk score the agent can approve.": "Agent 可以批准的最高风险分数。",
            "Approval Policies": "批准策略",
            "Optionally configure in-repo policies to apply product and boundary-specific approval instructions.": "可选：在仓库内配置策略，以应用产品和边界相关的批准指令。",
            "Approval and Routing Policies": "批准与路由策略",
            "Configured in your repository with policy files; no dashboard setup is required.": "通过仓库中的策略文件配置；无需在仪表盘额外设置。",
            "Custom Prompt": "自定义提示词",
            "e.g. Only approve when there are no Bugbot and Security Review findings...": "例如：仅当没有 Bugbot 和 Security 审查发现时才批准……",
            "Provide additional approval criteria for this Approval Agent.": "为此 Approval Agent 提供额外的批准标准。",
            "Source Control Providers": "源码控制提供商",
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
            "Submit your plugin publisher application to list your plugin in the Cursor Marketplace.": "提交插件发布者申请，以便将插件列入 Cursor 市场。",
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
            Canvas: "画布",
            Canvases: "画布",
            "Shared Canvas": "共享画布",
            "No shared canvases": "没有共享画布",
            Share: "共享",
            Unshare: "取消共享",
            "Back to Agents": "返回 Agents",
            "Billing & Invoices": "账单与发票",
            "Getting started": "快速开始",
            "0/4 Completed": "已完成 0/4",
            "Connect GitHub or GitLab": "连接 GitHub 或 GitLab",
            "Connect Slack": "连接 Slack",
            "Link your source control provider to start shipping software with agents.": "连接你的源码控制提供商，开始使用 Agent 交付软件。",
            "Extend Cursor with plugins": "通过插件扩展 Cursor",
            "Set up cloud for faster, parallelized agents that verify their work": "设置云环境以获得更快、并行化的 Agent，它们会自动验证自己的工作",
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
            "Connect GitHub for Cloud Agents, Bugbot and enhanced codebase context": "连接 GitHub 以使用 Cloud Agents、Bugbot 和增强的代码库上下文",
            "Connect GitLab for Cloud Agents, Bugbot and enhanced codebase context": "连接 GitLab 以使用 Cloud Agents、Bugbot 和增强的代码库上下文",
            "Connect Azure DevOps for Cloud Agents and enhanced codebase context": "连接 Azure DevOps 以使用 Cloud Agents 和增强的代码库上下文",
            "Connect Bitbucket Cloud for Cloud Agents and enhanced codebase context": "连接 Bitbucket Cloud 以使用 Cloud Agents 和增强的代码库上下文",
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
            "Popular Code Review Security Incidents & Triage Data & Research": "热门 代码审查 安全 事故与分诊 数据与研究",
            "Connect Bitbucket Cloud for Cloud Agents, Bugbot and enhanced codebase context": "连接 Bitbucket Cloud 以使用 Cloud Agents、Bugbot 和增强的代码库上下文",
            "Connect a Jira site to delegate issues to Cloud Agents": "连接 Jira 站点，把问题委派给 Cloud Agents",
            "Connect a Linear workspace to delegate issues to Cloud Agents": "连接 Linear 工作区，把问题委派给 Cloud Agents",
            "Microsoft Teams": "Microsoft Teams",
            "Use Sentry issue events in Automations": "在自动化中使用 Sentry 问题事件",
            "Work with Cloud Agents from Microsoft Teams": "在 Microsoft Teams 中使用 Cloud Agents",
            "Work with Cloud Agents from Slack": "在 Slack 中使用 Cloud Agents",
            "Customize Cursor with MCPs, skills, rules, subagents, and more.": "通过 MCP、技能、规则、子 Agent 等自定义 Cursor。",
            "Integrate Cursor with Slack. Then tag @Cursor to kick off agents with full context of your thread.": "将 Cursor 与 Slack 集成。然后在 Slack 中 @Cursor，即可基于完整线程上下文启动 Agent。",
            "Cloud agents test and send demos of their code and let you ship from your phone, Slack, GitHub, and more.": "云端 Agent 会测试并发送代码演示，让你通过手机、Slack、GitHub 等方式交付。",
            "Get 3x more usage than Pro, unlock higher limits on Agent, and more.": "相比 Pro 获得 3 倍用量，解锁更高的 Agent 上限等更多权益。",
            "On-Demand Usage is Off": "按需用量已关闭",
            "Go beyond your plan's included quota with on-demand usage": "通过按需用量超出套餐包含的配额",
            "Tab Completions": "Tab 补全",
            "Agent Lines of Code": "Agent 代码行数",
            "Manage in GitHub": "在 GitHub 中管理",
            Reconnect: "重新连接",
            "Most Active Month": "最活跃月份",
            "Most Active Day": "最活跃日期",
            "Longest Streak": "最长连续天数",
            "Current Streak": "当前连续天数",
            "Connected as": "已连接为",
            "to repositories accessible in organizations:": "可访问以下组织中的仓库：",
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
            "? Any existing integrations using this key will no longer work.": "？任何使用此密钥的集成将无法继续工作。",
            "This action cannot be undone.": "此操作不可撤销。",
            "Your new": "您的新",
            "has been created. Copy this key now as it won't be shown again.": "已创建。请立即复制此密钥，之后将不再显示。",
            "For security reasons, this key is only displayed once and cannot be retrieved later. If you lose it, you'll need to create a new one.": "出于安全考虑，此密钥仅显示一次，之后无法找回。如果丢失，您需要创建一个新的。",
            Done: "完成",
            "Token will be generated after you create this key. You'll only see the full secret once — copy it before closing the next dialog.": "密钥将在创建后生成。您只会看到完整密钥一次——请在关闭下一个对话框前复制。",
            "SDK docs": "SDK 文档",
            "API docs": "API 文档",
            "TypeScript and Python SDKs for building with Cursor agents.": "用于构建 Cursor 智能体的 TypeScript 和 Python SDK。",
            "Cloud Agent API reference for programmatic access.": "用于编程访问的 Cloud Agent API 参考。",
            "Manage API keys and service accounts for programmatic access to Cursor.": "管理用于编程访问 Cursor 的 API 密钥和服务账户。",
            "User API Keys provide secure, programmatic access to your Cursor account, including the headless version of the Cursor Agent CLI": "用户 API 密钥为你的 Cursor 账户提供安全的编程访问，包括 Cursor Agent CLI 的无头版本",
            and: "和",
            " . Treat them like passwords: keep them secure and never share them publicly.": "。像对待密码一样对待它们：保持安全，绝不公开分享。",
            "Note: The": "注意：",
            "is in beta.": "处于测试阶段。",
            "Cloud Agent API": "Cloud Agent API",
            "Download Cursor Windows": "下载 Cursor Windows 版",
            Help: "帮助",
            ". Treat them like passwords: keep them secure and never share them publicly.": "。像对待密码一样对待它们：保持安全，绝不公开分享。",
            yyz: "yyz",
            doge: "doge",
            isdoge: "isdoge",
            "doge is": "doge is",
            "Switch to annual billing and save 20%": "切换到年付可节省 20%",
            "Upgrade Now": "立即升级",
            "Entry-level plan with access to premium models, unlimited Tab completions, and more.": "入门级方案，可使用高级模型、无限 Tab 补全等功能。",
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
            "Work with your team and unlock collaborative features": "与团队协作并解锁协作功能",
            "Team Management": "团队管理",
            "Invite members, manage roles, and control access": "邀请成员、管理角色并控制访问权限",
            "Usage Analytics": "用量分析",
            "Track team usage and optimize your subscription": "跟踪团队用量并优化订阅",
            "Admin Controls": "管理员控制",
            "Centralized billing and privacy mode controls": "集中账单和隐私模式控制",
            "Rules & Commands": "规则与命令",
            "Share rules and commands across your team": "在团队中共享规则和命令",
            "Create team": "创建团队",
            "Need enterprise features?": "需要企业功能？",
            "Get pooled usage, SCIM seat management, and granular admin controls": "获取共享用量池、SCIM 席位管理和细粒度管理员控制",
            "Contact sales": "联系销售",
            "All the Canvases you've shared from Cursor, in one place.": "您从 Cursor 共享的所有画布都会集中显示在这里。",
            "No Shared Canvases": "暂无共享画布",
            "Canvases you share from Cursor will appear here.": "您从 Cursor 共享的画布会显示在这里。",
            "Current Plan": "当前方案",
            "Resets on": "重置时间",
            "Upgrade Available": "可升级",
            "Pro+": "Pro+",
            "Unlock 3x more usage on Agent & more": "解锁 Agent 等功能 3 倍更多用量",
            "Included in Pro": "Pro 已包含",
            "Additional usage beyond limits consumes API quota or on-demand spend.": "超出上限后的额外用量会消耗 API 配额或按需支出。",
            "Additional usage beyond limits consumes on-demand spend.": "超出上限后的额外用量会消耗按需支出。",
            "Additional usage beyond limits consumes on-demand spend. Your plan includes at least $20 of API usage.": "超出上限后的额外用量会消耗按需支出。你的方案至少包含 20 美元 API 用量。",
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
            "Time range is start of day UTC on start date to end of day UTC on end date.": "时间范围为开始日期 UTC 当天开始到结束日期 UTC 当天结束。",
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
            "Get 3x more usage than Pro and unlock higher limits on Agent and premium models.": "相比 Pro 获得 3 倍更多用量，并解锁 Agent 和高级模型的更高上限。",
            "Everything in Pro": "包含 Pro 的所有内容",
            "3x usage on OpenAI, Claude, and Gemini models": "OpenAI、Claude 和 Gemini 模型 3 倍用量",
            "Higher Agent limits": "更高的 Agent 上限",
            "Priority access to premium capacity": "优先使用高级容量",
            "Get maximum value with 20x usage limits and early access to advanced features.": "享受最大价值：20 倍用量上限，并提前体验高级功能。",
            "Everything in Pro+": "包含 Pro+ 的所有内容",
            "20x usage on OpenAI, Claude, and Gemini models": "OpenAI、Claude 和 Gemini 模型 20 倍用量",
            "Priority access to new features": "优先体验新功能",
            "Highest throughput and limits": "最高吞吐量和上限",
            "Everything on Individual, plus:": "包含 Individual 的全部内容，另外还有：",
            "Cloud agents with shared team context": "具有共享团队上下文的云端 Agents",
            "Team-wide rules, skills, and automations": "团队范围的规则、技能和自动化",
            "Security review agent": "安全审查 Agent",
            "SAML/OIDC SSO + enforced team-level privacy mode": "SAML/OIDC SSO + 强制团队级隐私模式",
            "Team plugin marketplace": "团队插件市场",
            "Usage analytics": "用量分析",
            "Centralized team billing": "集中式团队账单",
            "Need more capabilities for your business? Learn more about our Enterprise plans.": "你的业务需要更多能力？了解我们的企业方案。",
            "Need more capabilities for your business? Learn more about our": "你的业务需要更多能力？了解我们的",
            "Enterprise plans.": "企业方案。",
            ...marketplaceTempTextRules
        };
        const attrRules = {
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
            "Use Scan codebase for vulnerabilities template": "Use Scan codebase for vulnerabilities template",
            "Use Generate docs template": "使用“生成文档”模板",
            "Use Add test coverage template": "Use Add test coverage template",
            Search: "搜索",
            "Search agents": "搜索 Agents",
            "Search members": "搜索成员",
            "Search plugins": "搜索插件",
            "Search integrations": "搜索集成",
            "Search API keys": "搜索 API 密钥",
            "Search secrets": "搜索密钥",
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
            "Show combined lines of code from Agent (Cmd+K/chat) and Tab suggestions": "显示 Agent（Cmd+K/聊天）和 Tab 建议的合并代码行数",
            "Show lines of code from Cursor Tab suggestions": "显示 Cursor Tab 建议产生的代码行数",
            "Show lines edited using Agent (Cmd+K and chat)": "显示使用 Agent（Cmd+K 和聊天）编辑的代码行数",
            "Copy link to Privacy and scroll to section": "复制隐私区块链接并滚动到该区块",
            "Copy link to Environments and scroll to section": "复制环境区块链接并滚动到该区块",
            "Copy link to Self-Hosted and scroll to section": "复制自托管区块链接并滚动到该区块",
            "Copy link to Defaults and scroll to section": "复制默认设置区块链接并滚动到该区块",
            "Copy link to Notifications and scroll to section": "复制通知区块链接并滚动到该区块",
            "Copy link to Slack routing and scroll to section": "复制 Slack 路由区块链接并滚动到该区块",
            "Copy link to Security and scroll to section": "复制安全区块链接并滚动到该区块",
            "Copy link to My Secrets and scroll to section": "复制我的密钥区块链接并滚动到该区块",
            "Copy link to Profile and scroll to section": "复制个人资料区块链接并滚动到该区块",
            "Copy link to Appearance and scroll to section": "复制外观区块链接并滚动到该区块",
            "Copy link to Pull Requests and scroll to section": "复制拉取请求区块链接并滚动到该区块",
            "Copy link to Active Sessions and scroll to section": "复制活跃会话区块链接并滚动到该区块",
            "Copy link to More and scroll to section": "复制更多区块链接并滚动到该区块",
            "Copy link to Source Control and scroll to section": "复制源码控制区块链接并滚动到该区块",
            "Copy link to Integrations and scroll to section": "复制集成区块链接并滚动到该区块",
            "Copy link to Repositories and scroll to section": "复制仓库区块链接并滚动到该区块",
            "Plugin filters": "插件筛选器",
            "Copy link to Suggested and scroll to section": "复制推荐区块链接并滚动到该区块",
            "Copy section link": "复制区块链接",
            "Copy link to User API Keys and scroll to section": "复制 User API Keys 链接并跳转到该部分",
            "Copy link to Included in Pro and scroll to section": "复制 Pro 已包含区块链接并滚动到该区块",
            "Copy link to On-Demand Usage and scroll to section": "复制按需用量区块链接并滚动到该区块",
            "Last 1 day": "最近 1 天",
            "Last 7 days": "最近 7 天",
            "Last 30 days": "最近 30 天",
            "Month-to-date": "本月至今",
            "Usage events for all users": "所有用户的用量事件",
            "Included in Pro": "Pro 已包含"
        };
        const regexTextRules = [
            {
                pattern: /^([0-9,.]+)% Auto and ([0-9,.]+)% API used$/,
                replace: "$1% Auto 和 $2% API 已使用"
            },
            {
                pattern: /^剩余 ([0-9,]+) days?$/,
                replace: "剩余 $1 天"
            },
            {
                pattern: /^([0-9,]+) days? remaining$/,
                replace: "剩余 $1 天"
            },
            {
                pattern: /^View ([0-9,]+) more$/,
                replace: "再查看 $1 个"
            },
            {
                pattern: /^About ([0-9]+) months ago$/,
                replace: "约 $1 个月前"
            },
            {
                pattern: /^About ([0-9]+) month ago$/,
                replace: "约 $1 个月前"
            },
            {
                pattern: /^([0-9]+) months ago$/,
                replace: "$1 个月前"
            },
            {
                pattern: /^([0-9]+) month ago$/,
                replace: "$1 个月前"
            },
            {
                pattern: /^(.*?) is Pro$/,
                replace: "$1 是 Pro 用户"
            },
            {
                pattern: /^Connected as (.+?) to repositories accessible in organizations: (.+)$/,
                replace: "已连接为 $1，可访问以下组织中的仓库：$2"
            },
            {
                pattern: /^([0-9,]+) of ([0-9,]+) used$/,
                replace: "已使用 $1 / $2"
            },
            {
                pattern: /^([0-9,]+) members?$/,
                replace: "$1 名成员"
            },
            {
                pattern: /^([0-9,]+) seats?$/,
                replace: "$1 个席位"
            },
            {
                pattern: /^([0-9,]+) Repositories Available$/,
                replace: "$1 个可用仓库"
            },
            {
                pattern: /^(\d+) of (\d+) checks enabled during review$/,
                replace: "审查期间已启用 $1 / $2 项检查"
            },
            {
                pattern: /^Used ([0-9,.]+)%$/,
                replace: "已使用 $1%"
            },
            {
                pattern: /^(.+) remaining$/,
                replace: "剩余 $1"
            },
            {
                pattern: /^Created (.+) ago$/,
                replace: "$1 前创建"
            },
            {
                pattern: /^Last used (.+) ago$/,
                replace: "$1 前使用"
            },
            {
                pattern: /^About (.+) ago$/,
                replace: "约 $1 前"
            },
            {
                pattern: /^([0-9,]+) days? ago$/,
                replace: "$1 天前"
            },
            {
                pattern: /^Showing ([0-9,]+)-([0-9,]+) of ([0-9,]+)$/,
                replace: "显示 $1-$2，共 $3"
            },
            {
                pattern: /^([0-9,]+) \/ ([0-9,]+)$/,
                replace: "第 $1 页 / 共 $2 页"
            },
            {
                pattern: /^Link ([0-9,]+) Add link$/,
                replace: "链接 $1 添加链接"
            },
            {
                pattern: /^Device Created Desktop App (.+) Revoke$/,
                replace: "设备 已创建 Desktop App $1 撤销"
            },
            {
                pattern: /^Device 已创建 Desktop App (.+) Revoke$/,
                replace: "设备 已创建 Desktop App $1 撤销"
            },
            {
                pattern: /^Device 已创建 (.+)$/,
                replace: "Device 已创建 $1"
            },
            {
                pattern: /^Renews on (.+)$/,
                replace: "续订日期：$1"
            },
            {
                pattern: /^Billed (.+)$/,
                replace: "计费周期：$1"
            },
            {
                pattern: /^Use (.+) template$/,
                replace: "使用“$1”模板"
            },
            {
                pattern: /^"$/,
                replace: '"'
            },
            {
                pattern: /^Showing token usage and costs from (.+) to (.+)\. Use filters to narrow results by date range\.$/,
                replace: "显示从 $1 到 $2 的 token 用量和费用。使用筛选器按日期范围缩小结果。"
            },
            {
                pattern: /^Showing token usage and costs from (.+) to (.+)\. Use filters to narrow results by date range\.$/,
                replace: "显示从 $1 到 $2 的 token 用量和费用。使用筛选器按日期范围缩小结果。"
            },
            {
                pattern: /^"\? Any existing integrations using this key will no longer work\.$/,
                replace: "？任何使用此密钥的集成将无法继续工作。"
            },
            {
                pattern: /^[().%$-]$/,
                replace: "$&"
            },
            {
                pattern: /^[0-9]+(?:\.[0-9]+)?$/,
                replace: "$&"
            },
            {
                pattern: /^US\$[0-9,.]+$/,
                replace: "$&"
            },
            {
                pattern: /^[0-9,.]+ USD$/,
                replace: "$&"
            },
            {
                pattern: /^\$([0-9]+)\/mo$/,
                replace: "$$$1/月"
            },
            {
                pattern: /^[A-Z][a-z]{2} [0-9]{1,2}, [0-9]{4}$/,
                replace: "$&"
            },
            {
                pattern: /^[A-Z][a-z]{2} [0-9]{1,2} - [A-Z][a-z]{2} [0-9]{2}$/,
                replace: "$&"
            },
            {
                pattern: /^[A-Z][a-z]{2} [0-9]{1,2}, [0-9]{2}:[0-9]{2} [AP]M$/,
                replace: "$&"
            },
            {
                pattern: /^Showing token usage and costs from (.+) to (.+)\. Use filters to narrow results by date range\.$/,
                replace: "显示从 $1 到 $2 的 token 用量和费用。使用筛选器按日期范围缩小结果。"
            },
            {
                pattern: /^Rows: ([0-9,]+)$/,
                replace: "行数：$1"
            },
            {
                pattern: /^[a-z][a-z0-9]*(?:-[a-z0-9+.]+)+$/,
                replace: "$&"
            }
        ];
        const regexAttrRules = [
            {
                pattern: /^Use (.+) template$/,
                replace: "使用“$1”模板"
            },
            {
                pattern: /^Search (.+)$/,
                replace: "搜索 $1"
            },
            {
                pattern: /^Open (.+) menu$/,
                replace: "打开“$1”菜单"
            },
            {
                pattern: /^[a-z][a-z0-9]*(?:-[a-z0-9+.]+)+$/,
                replace: "$&"
            }
        ];
        const titleRules = {
            "Cursor Agent - Turn your ideas into code": "Cursor Agent - 将你的想法变成代码",
            "Cursor - The best way to code with AI": "Cursor - 使用 AI 编程的最佳方式",
            "Automations | Cursor": "自动化 | Cursor",
            "Dashboard | Cursor": "仪表盘 | Cursor",
            "Settings | Cursor": "设置 | Cursor",
            "Cursor Marketplace | Cursor Plugins": "Cursor 市场 | Cursor 插件",
            "Publish a Cursor Marketplace Plugin | Cursor Plugins": "发布 Cursor 市场插件 | Cursor 插件",
            Cursor: "Cursor"
        };
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
            const exact = mode === "attr" ? attrRules[normalized] ?? textRules[normalized] : textRules[normalized];
            if (exact) return exact;
            const rules = mode === "attr" ? regexAttrRules : regexTextRules;
            for (const rule of rules){
                if (rule.pattern.test(normalized)) {
                    return normalized.replace(rule.pattern, rule.replace);
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
            const iconLabels = {
                ellipsis: "更多操作",
                "list-filter": "筛选列表",
                add: "添加",
                mic: "语音输入",
                "chevron-down": "展开",
                close: "关闭",
                search: "搜索"
            };
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
            const original = titleRules[document.title] ? document.title : undefined;
            if (state.language === "en") return;
            const exact = titleRules[document.title];
            if (exact) {
                document.title = exact;
                return;
            }
            for (const [from, to] of Object.entries(titleRules)){
                if (document.title.includes(from)) {
                    document.title = document.title.replace(from, to);
                    return;
                }
            }
            if (original) document.title = titleRules[original];
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
