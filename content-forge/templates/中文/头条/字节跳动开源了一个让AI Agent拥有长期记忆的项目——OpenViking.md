---
title: "字节跳动开源了一个让AI Agent拥有长期记忆的项目——OpenViking"
source: "https://www.toutiao.com/article/7639275458088960563/?app=news_article&category_new=__all__&module_name=Android_tt_others&share_did=MS4wLjACAAAAcbYui8GOvjnUIZhAnk6N9gGiyRYJg-Fw3FxRuULj09Q&share_uid=MS4wLjABAAAALXlKY4ZwoGGw80-JC2Ig4GAhWz0ZNI8e37Ppk1YhpMI&timestamp=1778671573&tt_from=wechat&upstream_biz=Android_wechat&utm_campaign=client_share&utm_medium=toutiao_android&utm_source=wechat&share_token=60044987-95e3-4a3b-bca0-fbfdc2eed957&source=m_redirect"
author:
  - "[[鲸览天下]]"
published: 2026-05-13
created: 2026-05-18
description: "你有没有发现，现在的AI Agent每次对话都是\"金鱼记忆\"？聊完就忘，下次还得从头说起。字节跳动/火山引擎开源的OpenViking就是来解决这个问题的。它是一个专门为AI Agent设计的上下文数据库，目前GitHu"
tags:
  - "clippings"
---
你有没有发现，现在的AI Agent每次对话都是"金鱼记忆"？聊完就忘，下次还得从头说起。

字节跳动/火山引擎开源的

**OpenViking**

就是来解决这个问题的。它是一个专门为AI Agent设计的

**上下文数据库** ，目前GitHub ⭐23,834，增长极快。

**它做了什么不一样的事？**

传统方案：RAG + 向量数据库 + 记忆插件，东拼西凑，维护成本高。

OpenViking：把所有上下文（记忆、资源、技能）统一映射为

**viking:// 虚拟文件系统** 。Agent用ls/find/grep

这些标准命令就能读写上下文，零学习成本。

**三个核心设计：**

**文件系统范式**

— 不是数据库表，不是JSON文档，而是你熟悉的文件系统。

viking://resources/docs/、viking://user/memories/，路径即组织方式。

**三级上下文加载**

— L0摘要（100 tokens）、L1概览（2000 tokens）、L2全文。Agent按需加载，不浪费Token。这比把所有记忆塞进prompt聪明得多。

**语义+关键词混合搜索**

— 既懂向量语义，也支持精确匹配，搜索准确度远超纯向量检索。

**生态兼容性：**

- Hermes Agent：内置支持，配置即用
- Claude Code：有官方插件
- OpenClaw：原生集成
- 其他Agent：通过REST API接入

**一句话总结：**

如果说LLM是AI的大脑，OpenViking就是AI的长期记忆系统。没有它，Agent永远只能活在"当下"。

项目地址：  
github.com/volcengine/OpenViking

官网：openviking.ai

#AI #开源 #字节跳动 #大模型 #AIAgent #OpenViking #火山引擎