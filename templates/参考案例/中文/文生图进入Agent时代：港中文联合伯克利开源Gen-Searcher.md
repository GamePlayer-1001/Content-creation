---
title: "文生图进入Agent时代：港中文联合伯克利开源Gen-Searcher"
source: "https://www.toutiao.com/article/7626657349649826346/?app=news_article&category_new=__all__&module_name=Android_tt_others&share_did=MS4wLjACAAAAcbYui8GOvjnUIZhAnk6N9gGiyRYJg-Fw3FxRuULj09Q&share_uid=MS4wLjABAAAALXlKY4ZwoGGw80-JC2Ig4GAhWz0ZNI8e37Ppk1YhpMI&timestamp=1775732639&tt_from=wechat&upstream_biz=Android_wechat&utm_campaign=client_share&utm_medium=toutiao_android&utm_source=wechat&share_token=a1902781-3da3-451c-b8e9-7a7ba601c323&source=m_redirect"
author:
  - "[[机器之心Pro]]"
published: 2026-04-09
created: 2026-05-18
description: "在 KnowGen 上，原始 Qwen-Image 的 K-Score 为 14.98，接入 Gen-Searcher-8B 后提升到 31.52，提高 16.54 分。"
tags:
  - "clippings"
---
![](https://p3-sign.toutiaoimg.com/tos-cn-i-axegupay5k/ef7b5bef673746fda2e778c3e4e659f2~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1779685613&x-signature=%2BtFQNNdC5qcLAOkMaVS2CnjRMi0%3D)

过去两年，图像生成模型在质感和审美上一路狂飙，但大多仍是 “直接出图” 的范式。

一旦 prompt 涉及真实世界知识、最新信息、冷门事实，或者需要跨多个来源核对细节，传统文生图模型就很容易翻车。

因为生成模型缺乏面向真实世界的 Agent 能力，仍然依赖固化的参数知识，缺少主动搜索、验证和整合外部信息的能力。

最近，来自香港中文大学 MMLab、UC Berkeley 和 UCLA 的研究团队提出了 Gen-Searcher， **首次尝试为图像生成任务训练一个 “深度搜索” 智能体** 。它让图像生成模型能够像 Agent 一样进行搜索、推理、找图和浏览网页，从而输出真正可靠的生成结果。所有数据，模型，和代码，均已开源。

![](https://p26-sign.toutiaoimg.com/tos-cn-i-6w9my0ksvp/1df1120e98864753be157e4adf53f79f~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1779685613&x-signature=0GxqBZHRYseUO%2B4%2FVqJNJvB3HRs%3D)
- 论文标题：Gen-Searcher: Reinforcing Agentic Search for Image Generation
- 论文地址：https://arxiv.org/pdf/2603.28767
- 项目主页：https://gen-searcher.vercel.app/

**现实需求：从 “直接生成” 到 Agentic 生成**

现实世界中的图像生成任务，往往不只是 “按 prompt 作画”。很多场景会涉及真实世界知识、最新信息、冷门事实，甚至需要跨多个来源核对细节。模型不仅要会生成，还要先判断哪些信息需要确认、哪些视觉细节需要参考、哪些内容必须依赖外部知识支撑。

在这种背景下，传统文生图模型有两个核心问题：一是主要依赖预训练学到的参数知识，缺乏主动搜索、验证和整合外部信息的能力；二是整体流程仍是 “输入 prompt，直接出图”，缺少像 Agent 那样先搜索、推理、整理证据的过程，因此在真实场景里很容易 “ **画得像，却画不对** ”

为了解决这个问题，研究团队提出了 Gen-Searcher，希望把文生图从 “直接生成” 推进到 Agentic 生成

**数据构建与 KnowGen 基准**

为了训练这种能力，作者先构造了一批真实世界需要搜索才能完成的生成数据，覆盖名人、动漫、物理、化学、艺术、建筑、新闻等约 20 个类别。

随后，作者让强模型配合搜索工具生成多轮轨迹，收集文本知识和视觉证据，再用 Nano Banana Pro 合成目标图像，得到约 30k 条原始样本。经过 Seed1.8 筛选后，最终保留约 17k 条高质量数据，并整理成 Gen-Searcher-SFT-10k 和 Gen-Searcher-RL-6k。

在此基础上，作者还提出了新的 benchmark —— KnowGen。它包含 630 条人工验证样本，用于图像生成 Agent 评测。

**模型训练**

Gen-Searcher 的核心，是把生成前的信息获取过程做成一个可训练的 Agent。模型不再拿到 prompt 就直接生成，而是先在多轮交互中决定何时搜索、搜什么、是否浏览网页、是否补充视觉参考，最后输出准确的 prompt 和参考图。

它配备了三类工具：文本搜索、图像搜索和网页浏览。训练上则分两阶段进行：先通过 SFT 训练学会工具使用，再通过 agentic RL 优化搜索策略和长程决策。

论文还提出了双奖励反馈。因为只看最终图像效果并不稳定，作者额外加入了一个文本奖励，用来评估输出的 prompt 是否已经包含足够、正确、与生成相关的信息，再与图像奖励结合起来共同训练。这样，模型不仅要 “画得好”，也要 “搜得对”

**实验结果**

在 KnowGen 上，原始 Qwen-Image 的 K-Score 为 14.98，接入 Gen-Searcher-8B 后提升到 31.52，提高 16.54 分。而且这种能力还能迁移到其他图像生成器上：Seedream 4.5 从 31.01 提升到 47.29，Nano Banana Pro 也从 50.38 提升到 53.30。

在 WISE 测试基准上，模型同样带来了巨大的提升。

可视化分析表明，Gen-Searcher 能够真正提高模型生图的准确性和质量。

**写在最后**

Gen-Searcher 的推出，不仅展示了 Agentic 生成在知识密集型图像生成任务上的潜力，也为构建真正能够连接搜索、推理与生成的一体化系统提供了清晰路径。

它不仅能 “画”，还能 “查”；不仅能完成传统的文本到图像生成，更能在生成之前主动搜索信息、核对事实、整合证据，展现出面向真实世界复杂任务的生成能力。

在大模型不断走向多模态、强推理与 Agent 化的趋势下，Gen-Searcher 的工作或许只是一个起点，但它所验证的方向，正在成为生成系统迈向 Agentic 时代的重要一步。