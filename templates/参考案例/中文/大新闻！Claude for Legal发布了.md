---
title: "大新闻！Claude for Legal发布了"
source: "https://mp.weixin.qq.com/s/gctQT-qbQP-Mc6Re3FDo0Q"
author:
  - "[[文刀二中]]"
published:
created: 2026-05-18
description: "5 月 12 日，Anthropic 正式发布 Claude for Legal。"
tags:
  - "clippings"
---
文刀二中 *2026年5月13日 02:50*

5 月 12 日，Anthropic 正式发布 Claude for Legal：20 多个 MCP 连接器、12 个执业领域插件。这是 Anthropic 在法律行业迄今规模最大的一次集中发布。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_png/qpicJQVTfQpSt27x8YWUXNBhy3kwD6cZOBzkbYT7BHvaDA1K88WPKX3PVqial5ekg6CObt5BicZoz0cVNdhTp01df6E9DZxfbjnn5VHAZtibDRY/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

值得回看的时间坐标是：今年 2 月初，Anthropic 在 Claude Cowork 中推出的首个法律插件曾让 Thomson Reuters 单日下跌 18%、RELX 创下 1988 年以来最大单日跌幅。那个插件只是一个通用工具集合中的一项，三个月后，Anthropic 用一次集中发布把它扩展成了一条完整的执业领域产品线。

本文将对这次发布做一次全面梳理。

## 一、MCP　连接器

这次发布的 20+ MCP 连接器，按功能可以归为八类。

- **合同生命周期与起草** ：Definely、Docusign、Ironclad。
- **交易室与并购文档** ：Box、Datasite。Datasite 这家在全球 M&A 数据室市场占主导地位的厂商接入，意味着 Claude 在跨境并购尽调环节的进入门槛显著降低。
- **文档管理** ：iManage、NetDocuments。这是大型律所最关心的两个系统。
- **电子取证与审查** ：Consilio、Everlaw、Relativity。三家加起来覆盖了北美主流的诉讼审查市场。
- **法律研究与判例** ：Legal Data Hunter(160+ 法域、3100 万+ 文档)、Midpage、Trellis(美国最大的州初审法院数据集)。
- **法律 AI 助手** ：Harvey、Solve Intelligence、Thomson Reuters CoCounsel。这是这次发布中最具信号意义的一类——这些公司本身就是 Claude 在某种意义上的同业竞争者，现在通过 MCP 把自己的能力接回 Claude。
- **专家网络与技能库** ：Lawve AI、The L Suite(含 Lloyd 与 TopCounsel)。前者是执业律师编写的 AI skills 库，后者是 in-house 法务社区。
- **公益服务** ：BoardWise、Courtroom5、Descrybe、Free Law Project。

## 二、插件：12 个执业领域的“角色化”封装

12 个执业领域插件覆盖商务、公司、劳动、隐私、产品、监管、AI 治理、知识产权、诉讼，以及法学生、法律诊所、法律开发者中心。每个插件首次使用前会跑一遍 10–20 分钟的 cold-start interview，把团队的 playbook、升级链、风险标准、文风偏好写入 `CLAUDE.md` ，之后所有 skill 从这个文件读取配置。

所有代码、提示词和 skills 都开源在 `anthropics/claude-for-legal` 仓库下。

| 插件 | 覆盖范围 |
| --- | --- |
| commercial-legal | 供应商协议、NDA、SaaS 订阅审查，续约登记，升级路由 |
| corporate-legal | 并购尽调、披露表、董事会决议、交割清单、实体合规、整合 |
| employment-legal | 招聘/解雇审查、员工分类、请假追踪、内部调查、政策起草 |
| privacy-legal | DPA 审查、PIA/DPIA、DSAR 响应、合规缺口分析 |
| product-legal | 上线审查、营销主张核查、“这是个问题吗”快速判断 |
| regulatory-legal | 监管 feed 监控、政策差异分析、缺口追踪、NPRM 评论 |
| ai-governance-legal | AI 用例分级、影响评估、供应商 AI 条款审查 |
| ip-legal | 商标筛查、FTO 三角分流、C&D、DMCA、开源合规、IP 条款审查 |
| litigation-legal | 案件接案、诉讼组合、证据保留、传票分流、时间线、出庭准备 |
| law-student | 苏格拉底式提问、IRAC 评分、案例摘要、Bar 考准备 |
| legal-clinic | 客户接待、截止日期追踪、案件备忘录、督导审查队列 |
| legal-builder-hub | 社区 skill 的搜索、安装、审计 |

## 三、以 Corporate Legal 为例

每个插件都包括 Agent、Command、Skill 等部分。以 Corporate Legal 为例——它是 12 个插件中场景密度最高的之一，覆盖一笔并购交易从立项到交割再到整合的全周期，以及上市公司治理、实体合规两条平行线。

### 3.1 Agents(智能体)

| Agent | 功能 | 触发 |
| --- | --- | --- |
| **Tabular Diligence Review** | 跨数据室的表格化审查，一行一文档，每个 cell 都附引用 | `/corporate-legal:tabular-review` |
| **Issue Extractor** | 按内部门槛和实质性标准从 VDR 文档中抽取问题 | `/corporate-legal:diligence-issue-extraction` |
| **Material Contracts Schedule Builder** | 按购买协议的实质性门槛，从尽调结果生成披露表 | `/corporate-legal:material-contract-schedule` |
| **Board Consent Drafter** | 按公司格式起草董事会或委员会的全体一致书面同意书，带先例检索 | `/corporate-legal:written-consent` |
| **Entity Compliance Tracker** | 跨司法辖区、跨实体类型的申报截止日期计算与健康审计 | `/corporate-legal:entity-compliance` |
| **Closing Checklist Driver** | 追踪交割前每个条件、同意、文件、申报事项 | `/corporate-legal:closing-checklist` |
| **Integration Runbook** | 收购后的分阶段整合计划，带同意函追踪和每周状态报告 | `/corporate-legal:integration-management` |
| **Data Room Watcher** | 监控 VDR 新上传文件，按计划推送交割清单状态 | 定时任务 |

### 3.2 Skills(技能模块)

除了上述 agent 调用的主 skill，corporate-legal 插件还包含三个“幕后”skill，不直接对外暴露斜杠命令，但在主流程中被调用：

- **board-minutes** ：按公司格式起草董事会或委员会会议记录
- **deal-team-summary** ：把尽调发现聚合成一份交易简报，供合伙人评估
- **ai-tool-handoff** ：检测到 Luminance/Kira 等批量审查工具的输出后，做质量复核(QA)

另有一个跨插件通用的 `matter-workspace` skill，用于在事项级别管理工作空间。

### 3.3 Commands(完整斜杠命令列表)

```
/corporate-legal:cold-start-interview         # 首次使用,可加 --new-deal 启动单笔交易
/corporate-legal:tabular-review               # 跨数据室表格化审查
/corporate-legal:diligence-issue-extraction   # 按门槛抽取问题
/corporate-legal:material-contract-schedule   # 生成实质性合同披露表
/corporate-legal:closing-checklist            # 交割清单与关键路径
/corporate-legal:written-consent              # 起草董事会/委员会决议
/corporate-legal:entity-compliance            # 实体合规追踪
/corporate-legal:integration-management       # 收购后整合
/corporate-legal:matter-workspace             # 事项工作空间管理
```

### 3.4 配套连接器

`corporate-legal` 默认配置以下 MCP 连接器：

- **Box** — 读取 VDR 与事项目录中的文件
- **iManage** — 从文档管理系统读取事项工作空间、文档版本
- **Definely** — 文档内起草与定义术语检查
- **Solve Intelligence** — 专利起草与诉讼相关支持(并购涉及 IP 时)
- **TopCounsel** — 外部律师匹配与外包面板
- **Lexis+ Protégé** — 法律研究、引用核查、Shepardizing

### 3.5 一笔典型并购的工作流映射

把上述 agent 和 skill 拼起来，一笔典型的中型并购交易可以被划分为以下阶段：

| 阶段 | 工作 | 主用 Agent |
| --- | --- | --- |
| 立项 | 启动新交易，接 VDR | `cold-start-interview --new-deal` |
| 尽调入场 | 跨 VDR 文档的表格化首轮审查 | Tabular Diligence Review |
| 问题识别 | 按门槛抽取需要披露/谈判的问题 | Issue Extractor |
| 披露表 | 生成实质性合同披露表 | Material Contracts Schedule Builder |
| 治理文件 | 各方董事会一致同意书 | Board Consent Drafter |
| 交割前 | 跟踪每一个未完结事项 | Closing Checklist Driver |
| 交割期间 | VDR 新增文件监控 | Data Room Watcher(定时) |
| 交割后 | 分阶段整合计划与同意函跟踪 | Integration Runbook |
| 持续 | 跨辖区实体合规健康 | Entity Compliance Tracker |

### 3.6 输出形态

`corporate-legal` 强调输出形态贴合实际工作：

- **Tabular Diligence Review** 输出多 sheet 的 `.xlsx` ，主表一行一文档，带独立 sources sheet
- **Closing Checklist** 输出可追踪的交割清单，带关键路径标识
- **Written Consent / Board Minutes** 直接在 Word 中输出，沿用公司既有格式与定义术语
- **Material Contracts Schedule** 输出符合并购协议附件格式的披露表

## 四、其他几个值得关注的插件

**面向法学生与法律诊所** ： `law-student` 插件提供 IRAC 评分、案例摘要、Bar 考准备等能力，让 Claude 真正接入法律教育。 `legal-clinic` 则面向公益场景，围绕 ABA Formal Opinion 512(美国律师协会关于律师使用生成式 AI 的正式意见)构建。

**Legal Builder Hub** ：用来查找、安装、审计社区贡献的法律 skills。它的存在本身说明 Anthropic 没有打算把这 12 个插件做成“封闭的官方答案”，而是作为起点，让律所和社区在其上继续构建。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

LegalQuants 在 Anthropic 官方仓库的 `legal-builder-hub` 文档中，与 Lawvable 并列被列为社区 skill 注册表的代表。Anthropic 的 Associate General Counsel — Mark Pike 在 LinkedIn 上也特别感谢了 LegalQuants 社区的贡献。

## 写在最后

这次发布的信息量很大，很多内容值得进一步消化。但核心可以归纳为一句话：Anthropic 没有试图做一个法律 AI 产品，而是把 Claude 做成了一个 **法律工作可以在其上重新组织的平台** 。

**微信扫一扫赞赏作者**

AI Obeserver · 目录

继续滑动看下一个

法律冲电宝

向上滑动看下一个