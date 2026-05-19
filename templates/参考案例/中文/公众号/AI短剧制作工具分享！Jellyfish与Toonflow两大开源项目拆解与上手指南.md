---
title: "AI短剧制作工具分享！Jellyfish与Toonflow两大开源项目拆解与上手指南"
source: "https://mp.weixin.qq.com/s/Su6yYB6Ig4m_Wl4mvqjIAQ"
author:
  - "[[jackao]]"
published:
created: 2026-05-18
description: "AI短剧领域是一个钱途漫漫、前路不明的赛道，很多创业者都在尝试，而目前市面上的AI短剧生成方案普遍“粗糙”：人"
tags:
  - "clippings"
---
jackao *2026年4月8日 07:15*

AI短剧领域是一个钱途漫漫、前路不明的赛道，很多创业者都在尝试，而目前市面上的AI短剧生成方案普遍“粗糙”：人物脸漂移、场景不统一、后期剪辑割裂，成品像“缝合怪”。为了解决这些痛点，也出现了很多开源或者半开源项目，比如最近看到的这两个项目： **Jellyfish** （AI短剧工厂）和 **Toonflow** 。今天我们就来聊聊这两个AI短剧工具，看看它们做到了什么程度。

![图片](https://mmbiz.qpic.cn/mmbiz_png/WAZic7VxrbDwnL81rgn8zFWOOH4BJricMMTj5LhmVVtUY2SVtT5fXJVBUibOq0WJCGTepeXSNnEwTv8Aqj860amfUKc0mDribZOZfnclEiazibv9M/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

### 一、为什么需要这些工具？AI短剧的真实痛点

AI短剧（竖屏微短剧）现在非常火爆，从小说IP到视频成片，本来是降本增效的好事。但实际操作中，大多数人用单模型+提示词的方式，遇到的问题很普遍：

- • **人物/场景一致性差** ：同一角色在不同镜头里“换脸”；
- • **流程碎片化** ：剧本、分镜、生成、剪辑各管各的，效率低下；
- • **后期控制弱** ：生成后很难精细调整。

Jellyfish和Toonflow正是针对这些问题设计的 **全流程工作台** 。它们不是底层大模型或者简单的提示词优化器，而是“工业级管线”：把剧本到成片的每个环节串联起来，并通过资产管理和Agent智能来提升稳定性。两者都是开源免费（Apache-2.0协议，一定规模的商用需要授权），支持自托管，核心功能不收费，当然都需要你自己准备大模型API密钥（文本、图像、视频模型）。

### 二、Jellyfish：一站式AI短剧工厂，专注精细控制与资产复用

**项目地址** ：https://github.com/Forget-C/Jellyfish  
**Stars** ：约2.5k（活跃更新中）  
**定位** ：从剧本输入→智能分镜→一致性管理→AI生成→后期剪辑→一键导出，完整流水线。特别适合追求“工业化”生产的创作者。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

#### 核心亮点（解决漂移的核心机制）：

- • **全局种子+资产管理系统** ：统一管理角色、场景、道具、服装。一次登记，全片复用，避免AI随机漂移。
- • **可视化分镜编辑器** ：三面板布局（脚本区、分镜区、属性面板），可精细调整镜头类型、角度、时长、氛围、对话、音乐等。支持ControlNet（骨骼/深度控制）和唇同步。
- • **提示词模板库+Agent工作流** ：内置多种模板，一键初始化章节；支持自定义Agent（类似Dify的节点编排）。
- • **后期剪辑台** ：拖拽式时间线，多轨编辑，直接把AI片段拼成完整短剧。
- • **多模型支持** ：文本（OpenAI/Claude/通义等）、图像/视频（Midjourney/Runway/Kling/Luma等）随意切换。
- ![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

#### 上手方法（简单版）：

1. 1\. **部署** （推荐Docker一键启动）：
- ◦ 克隆仓库，复制`.env.example` 为`.env` 。
	- ◦ 运行 `docker compose up --build` （包含前端、后端、MySQL、文件存储）。
	- ◦ 浏览器打开 `http://localhost:7788` 即可进入工作台。
3. 2\. **快速制作流程** ：
- ◦ 新建项目 → 设置全局风格和种子。
	- ◦ 导入/输入剧本 → 自动拆分章节和分镜。
	- ◦ 资产库登记角色/场景 → 关联到每个分镜。
	- ◦ 编辑分镜属性 → 选择模型生成视频片段。
	- ◦ 进入时间线剪辑 → 一键导出成品。
5. 3\. **技术小贴士** ：前端React+TypeScript，后端FastAPI。零基础用户用Docker最省事；有开发经验可分开调试前后端。

#### 分析：

- • **优点** ：控制力极强，像“拼积木”一样做视频，成品一致性高。适合团队协作或需要反复迭代的精品短剧。
- • **缺点/局限** ：部署有一定门槛（需Docker环境），目前更偏向“技术向”用户。纯小白可能需要花1-2小时熟悉界面。
- • **适用人群** ：AI影视工作室、想深度定制流程的个人创作者。

官网预览（https://forget-c.github.io/Jellyfish ）有更多界面截图，推荐先看看。

### 三、Toonflow：小说转短剧/漫剧神器，无限画布+多Agent协作

**项目地址** ：https://github.com/HBAI-Ltd/Toonflow-app  
**Stars** ：约6.2k（更新非常活跃）  
**定位** ：专为 **小说IP改编** 设计，从文字自动转剧本，再到分镜、图片、视频一气呵成。强调“零门槛”和“批量生产”。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

#### 核心亮点：

- • **无限画布工作台** ：像画板一样自由摆放剧本节点、分镜、素材、视频节点，支持并行生产和任意回溯，不卡线性流程。
- • **三层Agent协作** （决策/执行/监督）+持久化记忆：ScriptAgent自动生成故事骨架和改编策略；ProductionAgent负责分镜组织。基于事件图谱驱动，避免长文本信息丢失。
- • **角色一致性强** ：内置锚定系统，多Agent共同把关。
- • **桌面客户端** ：Electron打包，直接下载.exe/.dmg安装包，Windows/Mac都能一键启动。支持多语言（含中文）。
- • **可编程模型供应商** ：设置中心直接写TypeScript逻辑接入各种模型（OpenAI、DeepSeek、智谱、MiniMax、Nano Banana图片模型、Sora/豆包视频等）。
- • **批量+多格式输出** ：整本小说一次处理，支持竖屏/横屏切换。
- ![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

#### 上手方法（最友好版）：

1. 1\. **安装** （最推荐桌面版）：
- ◦ 去GitHub Releases下载安装包（Windows/Mac），安装后直接打开。
	- ◦ 默认账号：admin / admin123。
3. 2\. **快速制作流程** （8分钟视频教程可看B站演示，https://www.bilibili.com/video/BV1na6wB6Ea2 ）：
- ◦ 设置中心配置好文本/图像/视频模型API。
	- ◦ 新建项目 → 导入小说文本 → 自动提取章节事件图谱。
	- ◦ ScriptAgent生成剧本结构和改编策略。
	- ◦ 切换到ProductionAgent → 无限画布上组织分镜、生成素材。
	- ◦ 节点精调后回流工作台 → 一键合成视频导出。
5. 3\. **进阶** ：Docker或云部署也支持，数据全本地存储，隐私安全。
6. ![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

#### 分析：

- • **优点** ：上手门槛最低，Agent自动化程度高，尤其适合小说转短剧/漫剧。无限画布让创意更自由，效率据用户反馈可提升10倍以上。社区活跃，有微信群/Discord。
- • **缺点** ：商业授权有一定限制（≤5个法人内部使用免费，更多需联系授权；禁止用于竞品开发）。生成质量仍依赖你接入的底层模型能力。
- • **适用人群** ：小说作者、抖音/快手竖屏创作者、想快速验证IP的独立制作人、小白用户。有真实用户反馈：有人从ComfyUI迁移过来，成本和难度都大幅降低；动漫公司用它批量生产漫剧，效率惊人。

官网： https://toonflow.net

### 四、两者对比、建议与注意事项

| 维度 | Jellyfish | Toonflow |
| --- | --- | --- |
| **核心优势** | 精细分镜控制 + 资产复用 | 小说转剧本 + 无限画布 + Agent自动化 |
| **上手难度** | 中（需部署） | 低（桌面版即用） |
| **适合场景** | 脚本驱动、团队精细打磨 | 小说IP批量、快速原型 |
| **一致性机制** | 全局种子+集中资产库 | 多Agent锚定+事件图谱 |
| **后期能力** | 强大时间线编辑 | 自动合成+多格式输出 |

**使用建议** ：

1. 1\. **新手优先Toonflow** ：桌面版几分钟就能跑起来，先用小说试水，感受AI全流程的爽感。
2. 2\. **进阶选Jellyfish** ：如果你已经熟悉AI工具，想掌控每一个分镜细节，再去部署Jellyfish。
3. 3\. **组合使用** ：Toonflow生成初稿剧本和分镜 → 导出到Jellyfish精细调优和剪辑。
4. 4\. **成本与风险** ：两者都不提供算力，API调用费用（Kling/Runway等视频模型较贵）自己承担。建议从小项目起步测试。Toonflow商用需注意授权条款。

### 最后

这些AI短剧项目不是“躺着就能出片”的魔法，而是需要理性投入的工具。Jellyfish和Toonflow只是把“粗糙”变成了“可控”，真正让普通创作者也能做出接近专业水准的作品。感兴趣的朋友，直接去GitHub部署试试吧！

（本文基于GitHub最新README、官网及社区公开信息整理，仅供学习参考。工具使用请遵守平台规则和法律法规。）

**微信扫一扫赞赏作者**

AI · 目录

作者提示: 个人观点，仅供参考

继续滑动看下一个

恶人笔记

向上滑动看下一个