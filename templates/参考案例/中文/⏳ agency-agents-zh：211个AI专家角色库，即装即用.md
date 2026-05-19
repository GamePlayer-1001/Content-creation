---
title: "⏳ agency-agents-zh：211个AI专家角色库，即装即用"
source: "https://www.toutiao.com/article/7632942332576383523/?app=news_article&category_new=__all__&module_name=Android_tt_others&share_did=MS4wLjACAAAAcbYui8GOvjnUIZhAnk6N9gGiyRYJg-Fw3FxRuULj09Q&share_uid=MS4wLjABAAAALXlKY4ZwoGGw80-JC2Ig4GAhWz0ZNI8e37Ppk1YhpMI&timestamp=1777335961&tt_from=wechat&upstream_biz=Android_wechat&utm_campaign=client_share&utm_medium=toutiao_android&utm_source=wechat&share_token=e946767f-3f9e-4842-83e5-a3136f70faa4&source=m_redirect"
author:
  - "[[栈外笔记]]"
published: 2026-04-26
created: 2026-05-18
description: "211个AI专家一键召唤！这个开源项目让Claude/Cursor/OpenClaw瞬间变\"全能团队\"不是普通提示词，是带人设、带流程、带交付标准的AI专家角色库。从前端开发到小红书运营，从抖音策略到区块链安全——18个"
tags:
  - "clippings"
---
作品声明：内容由AI生成

## 211个AI专家一键召唤！这个开源项目让Claude/Cursor/OpenClaw瞬间变"全能团队"

> 不是普通提示词，是带人设、带流程、带交付标准的 **AI专家角色库** 。

> 从前端开发到小红书运营，从抖音策略到区块链安全——18个部门，211位专家，即装即用。

---

## 一、这是什么？一句话说清楚

**agency-agents-zh** 是一个开源的 AI 专家角色库。

它把 "AI 助手" 从 "万能但泛泛" 变成了 **"专业且精准"** —— 每个角色都有独立的人设、专业流程和明确的可交付成果。

举个例子：

- 普通提示词："你是一个前端开发者，帮我写个组件"
- agency-agents-zh 的角色： **会主动问你技术栈、考虑性能优化、检查无障碍合规、输出可复用的代码结构**

不是模板，是 **专家工作法** 。

---

## 二、项目规模：211个角色，18个部门

| 指标 | 数据 |
| --- | --- |
| AI 智能体总数 | **211个** |
| 翻译自英文版 | 165个 |
| 中国市场原创 | **46个** ⭐ |
| 支持工具 | **16种** |
| 覆盖部门 | **18个** |

## 18个部门一览

️ **工程部** — 前端、后端、DevOps、安全、AI工程师、SRE、微信小程序开发、飞书/钉钉集成...

**设计部** — UI设计师、UX研究员、品牌守护者、AI提示词工程师...

**营销部** — 小红书运营、抖音策略师、微信公众号运营、B站内容策略、私域流量、直播电商...

**付费媒体部** — 广告审计、创意策略、PPC竞价、程序化购买...

**产品/销售/项目管理** — 产品经理、增长黑客、大客户拓展、项目经理...

**游戏开发部** — Unity/Unreal/Godot/Roblox 全引擎覆盖...

️ **学术部** — 人类学家、心理学家、叙事学家...

⚖️ **法务/人力/供应链** — 合同审查、招聘专家、库存预测...

**专项部** — 提示词工程师、区块链审计、MCP构建器、高考志愿顾问...

> ⭐ **46个中国原创角色** 是亮点：小红书、抖音、微信生态、飞书钉钉、跨境电商、政务ToG、医疗合规—— **全是国内真实业务场景** 。

---

## 三、支持16种AI工具，一键安装

| 工具 | 安装方式 |
| --- | --- |
| **OpenClaw** ⭐ | ~/.openclaw/agency-agents/ |
| Claude Code | ~/.claude/agents/ |
| GitHub Copilot | ~/.github/agents/ |
| Cursor | .cursor/rules/ |
| Trae | .trae/rules/ |
| Windsurf | .windsurfrules |
| Aider | CONVENTIONS.md |
| Codex CLI | .codex/agents/ |
| Gemini CLI | ~/.gemini/extensions/ |
| Qwen Code | .qwen/agents/ |
| Kiro | ~/.kiro/agents/ |
| WorkBuddy(腾讯) | ~/.workbuddy/skills/ |
| DeerFlow 2.0(字节) | skills/custom/ |
| Hermes Agent | ~/.hermes/skills/ |
| Antigravity | ~/.gemini/antigravity/skills/ |
| OpenCode | .opencode/agents/ |

---

## 四、安装到 OpenClaw（详细教程）

OpenClaw 是目前社区用户最多的集成方式， **强烈推荐** 。

## 特点

- 每个角色拆分为 SOUL.md（人设）+ AGENTS.md（业务能力）+ IDENTITY.md（简介）
- 天然支持多智能体协作编排
- 安装后即可通过子代理独立调用

## 安装步骤

**方式一：npm 安装（推荐）**

```sql
# 1. 安装 npm 包
npm install -g agency-agents-zh

# 2. 从 GitHub 获取安装脚本
git clone --depth 1 https://github.com/jnMetaCode/agency-agents-zh.git
cd agency-agents-zh

# 3. 转换为 OpenClaw 格式
./scripts/convert.sh --tool openclaw

# 4. 安装到 ~/.openclaw/
./scripts/install.sh --tool openclaw

# 5. 重启 OpenClaw 网关
openclaw gateway restart
```

**方式二：手动复制**

```coffeescript
# 直接复制转换后的文件
cp -r integrations/openclaw/* ~/.openclaw/agency-agents/
```

安装完成后，角色文件位于  
~/.openclaw/agency-agents/，共 212 个目录，每个目录包含三个文件。

---

## 五、3种使用方式

## 方式一：启动专属子代理（推荐）

让某个专家独立处理任务，不污染当前会话：

```ruby
# 启动前端开发者处理 React 问题
sessions_spawn --task "帮我优化组件性能" --cwd ~/.openclaw/agency-agents/engineering-frontend-developer

# 启动小红书运营写种草文案
sessions_spawn --task "写一款防晒霜的小红书笔记" --cwd ~/.openclaw/agency-agents/marketing-xiaohongshu-operator

# 启动安全工程师审计代码
sessions_spawn --task "审查这段代码的 SQL 注入风险" --cwd ~/.openclaw/agency-agents/engineering-security-engineer
```

## 方式二：当前对话中临时借用

直接告诉 AI 你想用哪个角色：

> "请以  
> engineering-security-engineer 的视角帮我审查这段代码""用  
> marketing-douyin-strategist 的思维帮我策划产品推广"

AI 会自动加载对应角色的 SOUL.md + AGENTS.md 来回答。

## 方式三：手动进入角色工作空间

```bash
cd ~/.openclaw/agency-agents/engineering-devops-automator
# 然后正常提问，该角色的规范自动生效
```

---

## 六、实战场景：1个人 = 1个专家团队

## 场景A：搭建一个出海电商网站

**调用角色团队** ：

1. engineering-frontend-developer — React 前端架构
2. engineering-backend-architect — API 设计和数据库
3. marketing-cross-border-ecommerce — 跨境电商运营策略
4. design-ui-designer — 视觉设计规范
5. engineering-devops-automator — CI/CD 部署流水线

## 场景B：小红书品牌种草 campaign

**调用角色团队** ：

1. marketing-xiaohongshu-operator — 整体策略和达人合作
2. marketing-content-creator — 产出种草笔记内容
3. design-image-prompt-engineer — AI 生成配图
4. marketing-growth-hacker — 裂变和转化路径设计

## 场景C：创业公司 MVP 开发

**调用角色团队** ：

1. engineering-rapid-prototyper — 快速原型
2. product-product-manager — PRD 和产品路线
3. finance-financial-forecaster — 财务预测模型
4. legal-contract-reviewer — 合同和合规审查

---

## 七、和普通提示词的5个核心区别

| 维度 | 普通提示词 | agency-agents-zh |
| --- | --- | --- |
| **人设深度** | "你是一个XX专家" | 身份、记忆、性格、沟通风格 |
| **工作流程** | 无 | 明确的专业流程和步骤 |
| **交付标准** | 随意 | 可交付成果清单 |
| **关键规则** | 无 | 必须遵循的红线规则 |
| **场景覆盖** | 通用 | 211个垂直领域专家 |

---

## 八、快速开始（30秒上手）

```sql
# 1. 安装
npm install -g agency-agents-zh

# 2. 克隆仓库获取脚本
git clone --depth 1 https://github.com/jnMetaCode/agency-agents-zh.git
cd agency-agents-zh

# 3. 安装到 OpenClaw
./scripts/convert.sh --tool openclaw
./scripts/install.sh --tool openclaw

# 4. 使用
# 在 OpenClaw 中直接说：
# "启动 marketing-xiaohongshu-operator 帮我写种草文案"
```

---

## 九、写在最后

agency-agents-zh 解决了一个核心问题： **AI 工具越来越强大，但大多数人不会"用对人"** 。

这个项目把 211 位虚拟专家装进你的电脑，需要前端时召唤前端，需要运营时召唤运营—— **像调用 API 一样调用专家能力** 。

而且它是 **MIT 开源协议** ，个人和商业都免费使用。

**项目地址** ：  
https://github.com/jnMetaCode/agency-agents-zh

如果你用 OpenClaw、Claude Code、Cursor 或其他 AI 编程工具，强烈建议试试。装一次，整个专家团队随时待命。

---

本文基于 agency-agents-zh v1.1.0 实测安装体验整理。