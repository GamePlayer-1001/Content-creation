---
title: "Karpathy 最新分享：我用 LLM 管理个人知识库，40万字全自动维护"
source: "https://www.toutiao.com/article/7625829270896280079/?app=news_article&category_new=__all__&module_name=Android_tt_others&share_did=MS4wLjACAAAAcbYui8GOvjnUIZhAnk6N9gGiyRYJg-Fw3FxRuULj09Q&share_uid=MS4wLjABAAAALXlKY4ZwoGGw80-JC2Ig4GAhWz0ZNI8e37Ppk1YhpMI&timestamp=1775563507&tt_from=wechat&upstream_biz=Android_wechat&utm_campaign=client_share&utm_medium=toutiao_android&utm_source=wechat&share_token=f15257e9-34dc-48b3-956d-886925d2326a&source=m_redirect"
author:
  - "[[人人都是产品经理]]"
published: 2026-04-07
created: 2026-04-08
description: "前 OpenAI、特斯拉 AI 总监 Andrej Karpathy 最近在 X 上分享了一套用大模型管理个人知识库的实战方法。"
tags:
  - "clippings"
---
> AI大牛Andrej Karpathy最近公布了一套用大模型自动管理知识库的高效方案。这套四步法通过LLM自动编译原始资料、构建结构化Wiki、自然语言交互和知识库体检，实现了近乎全自动的知识管理。从论文到代码库，40万字材料都能自动维护更新，还能生成幻灯片和交互式内容，堪称数字时代的研究神器。

![](https://p26-sign.toutiaoimg.com/tos-cn-i-axegupay5k/5262a0d94a174473abcf7efcba23589b~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1776221797&x-signature=%2BnbCTOnpWdpbSWyjIWOsrW3L7zI%3D)

前 OpenAI、特斯拉 AI 总监 Andrej Karpathy 最近在 X 上分享了一套用大模型管理个人知识库的实战方法。他的某个研究主题知识库已经积累了 100 多篇文章、约 40 万字，全部 Markdown 格式，基本由 LLM 自动维护。

这个方案没有什么高深技术，核心就四步。

**第一步：建 raw/ 原料库**

把所有原始资料——论文、文章、代码仓库、图片——统一丢进 raw/ 文件夹。网页文章用 Obsidian Web Clipper 插件一键转成 Markdown，图片也要下载到本地（LLM 读图能力现在很强，别浪费）。

**第二步：让 LLM “编译”知识**

Karpathy 把这一步叫做 compile。就是让 LLM 读完 raw/ 里所有内容，自动生成一套结构化的 Wiki：每份原始资料有摘要和反向链接，核心概念单独成文，目录和交叉链接自动建好。

增量更新也很简单——新加一篇文档，跟 LLM 说”把这个归档进 wiki”，它自己知道放哪、怎么改现有文章。整个过程几乎不需要手动编辑。

前端用 Obsidian 打开整个文件夹，raw/ 原始资料和编译后的 wiki 同时可见，Marp 插件还能直接把内容生成幻灯片。

**第三步：用自然语言提问**

知识库积累到 100 篇左右之后，效果就出来了：可以直接问复杂问题，LLM 会自己去 wiki 里检索、交叉验证，再综合给出答案。

不需要搭 RAG，LLM 自己维护索引文件和摘要，在上下文窗口里就能读完关键内容。输出格式也很灵活：Markdown、Marp 幻灯片、Matplotlib 图表，甚至带交互的 HTML 都行。这些输出还可以直接丢回 wiki 继续积累，形成正向循环。

**第四步：让 LLM 给知识库”体检”**

LLM 还能做健康检查：找出矛盾数据、补全缺失信息、发现新关联，甚至推荐下一步研究方向。Karpathy 还顺手用 vibe coding 搭了个简单搜索引擎，既能自己用网页版查，也能作为工具让 LLM 处理更复杂的多跳查询。

**整套流程用一句话概括：**

raw/ 原始资料 → LLM 自动编译成 Markdown Wiki → CLI 工具问答 + 增量更新 → Obsidian 可视化

几乎不用手动写字，LLM 充当知识管家。

Karpathy 本人也说，这套方案目前还是”脚本堆积”的 hack 状态，但方向非常清晰——让普通人无需编程就能拥有自己的第二大脑。Lex Fridman 等人也在用类似方案，有人甚至把知识库接成跑步时的语音播客，边跑边消化。

对于做研究、长期跟踪某个领域、或者大量生产内容的人来说，这套方案值得认真试试：装 Obsidian 和 Web Clipper，建一个 raw/ 文件夹，找一个上下文够长的模型（Claude、Cursor 都行），开始编译。

知识库会自己进化，这一点比任何笔记软件都有吸引力。

本文由 @余量思考 原创发布于人人都是产品经理。未经作者许可，禁止转载

题图来自Unsplash，基于CC0协议