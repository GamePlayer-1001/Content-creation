---
title: "我把微信 cli 开源了，群消息终于不用爬楼了！"
source: "https://mp.weixin.qq.com/s/J-nzvyL07VWyKEJyfDEXwQ"
author:
  - "[[苍何]]"
published:
created: 2026-05-18
description: "同时，WeSight 产品开启遥测。"
tags:
  - "clippings"
---
苍何 *2026年4月8日 12:10*

这是苍何的第 520 篇原创！

大家好，我是苍何。

我的微信现在有超级超级多的群，技术群、开源群、产品群、读者群，每天几万条消息。

说实话，根本看不过来。

一忙起来，打开微信一看，99+ 的红点密密麻麻，心态直接炸了。

![图片](https://mmbiz.qpic.cn/mmbiz_png/zw8bZHsVSaBBuicoyT9AicibAR8KLPvbHmoCab5tBy0TXhmXWFL8Y9x9Ua6nBbzQlG7Wf1pCPb5pWTXmOibrUbyYc6zhZfFnQZicDbT93jf2cInA/640?from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

更烦的是，群里偶尔有几条很有价值的讨论，被灌水淹得死死的，等我想翻的时候，爬楼爬到手酸都找不到。

退群吧，怕错过重要信息。不退吧，每天光刷群就得花一两个小时。

我就想，这破事儿能不能让 AI 来干？

我只看精华，剩下的交给它。

于是放假爆肝了几天，基于本地微信聊天记录，开发了 2 个产品。

分别是 **「wechat-cli」** 和 **「WeSight」** ，其中 wechat-cli 作为技术底座，已完全开源。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

WeSight 是基于 wechat-cli 开发的桌面端 Agent，内置 CLI 能力及 OpenClaw 引擎，能基于你本地微信数据进行群聊分析与监控预警、收藏管理、聊天记录导出及分析等功能。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

先说 wechat-cli。

简单来说，它就是一个微信的命令行工具，让你可以用命令操作本地微信数据。

全程本地运行，不走任何第三方服务器，零封号风险。

目前支持 11 个命令，覆盖了日常最高频的场景：

| 命令 | 干什么的 |
| --- | --- |
| `init` | 一键初始化，提取密钥 |
| `sessions` | 列出最近会话 |
| `history` | 查看聊天记录，支持分页和时间过滤 |
| `search` | 全局搜索消息，支持指定聊天和消息类型 |
| `contacts` | 搜索联系人、查看详情 |
| `members` | 列出群成员 |
| `stats` | 聊天统计，谁最活跃、消息类型分布、24小时活跃图 |
| `export` | 导出聊天记录为 Markdown 或纯文本 |
| `favorites` | 查看微信收藏 |
| `unread` | 查看未读会话 |
| `new-messages` | 增量获取新消息 |

这些命令全部默认输出 JSON。

为什么？因为我设计之初就是给 AI Agent 用的。

你可以在 Claude Code 里直接说：「总结 XXX 群最新的 10 条消息」，它就会调用 `wechat-cli history "你的群" --limit 10 --format text` 。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

AI + CLI，这才是我想要的微信打开方式。

你可以把 wechat-cli 集成到任何你的 Agent 或者小龙虾，比如 Claude Code、OpenClaw、WorkBuddy、QClaw 等。

比如我集成了 OpenClaw 和微信 Bot 后，我就可以直接在微信中来提问，非常方便。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

wechat-cli 中的微信聊天记录支持一键导出，配合飞书 cli，上传到飞书文档做备份或者分享都超方便。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

玩法还非常非常多，具体安装和使用可以去 GitHub 上让你的 Agent 自主学习安装即可。

```
GitHub 地址：https://github.com/freestylefly/wechat-cli
```

> 保命申明，本项目仅用作个人学习使用，不得滥用于非法用途，以及不许破坏微信生态，遵循 Apache License 2.0 开源协议。

本项目开发由智谱最新模型 GLM 5.1 赞助，已消耗 3.3 亿多 tokens。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

我去了解了下，在最接近真实软件开发的 SWE-bench Pro 基准测试中，GLM 5.1 刷新全球最佳成绩，超过GPT-5.4、Claude Opus 4.6。SWE-Bench Pro。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

从架构设计、代码实现、跨平台打包、npm 发布、README 设计，一条龙全由 GLM 5.1 搞定。

整个项目在一次对话窗口完成，GLM 5.1 在长程任务上的表现确实稳。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

最让我印象深刻的是处理 C 二进制捆绑问题，GLM 5.1 直接把二进制打包进 Python 包，用户安装时自动带上，完全无感。

这种跨语言打包的脏活累活，我自己做可能就放弃了。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

而且配合 GitHub CLI 和 npm，从开发到提交到发布，全程丝滑。中间多次 compact 上下文压缩，GLM 5.1 都能稳定输出。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

我还看到很多海外网友纷纷放弃 Claude，选择 GLM 了，也得益于新模型能力的提升。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

接下来介绍下隆重首款基于 wechat-cli 的产品 **「WeSight」** 。这个是他的官网：

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

> 地址：https://wesight.ai

WeSight 配合 wechat-cli 能力，能帮你做基于本地微信数据的很多活，比如微信群日报总览：

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

当你点击进入特定选择的群时，会自动做当前群聊总结，给到昨天当前群消息数、发言人数，最活跃成员。

为更好的社群运营，加了消息时段分布，消息类型分布。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

AI 会总结聊天记录，按照不同时段给情绪趋势，方便对社群有更好的感知。

你再也不用担心，有哪些重要话题会遗漏，AI 会对重要话题进行聚类，以及根据聊天进行关键词排行。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

在 WeSight 的洞察里，群聊 AI 精华总结必不可少，会分 4 个维度进行总结，分别是： **「核心讨论话题、关键决策 / 结论、争议 / 待跟进、精华内容」** 。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

这样即使我一天没在群里冒泡吹水，AI 也能帮我总结，不会错过群重点消息。

当然，如果你遇到感兴趣的话题，想去看看当时大家怎么讨论的，也可以完全在 WeSight 中找到聊天记录。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

我还特意加了个一键转发到群聊的功能，当 WeSight 生成好群聊洞察后，会在右上角出现「转发到群聊」按钮。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

你可以复制文字，也可以复制图片到你的群聊，做一个每日精华回顾再好不过了。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

当然了这只是 WeSight 功能的冰山一角，能做群消息广告监控与预警、能导出聊天记录、微信收藏的二次管理等等等。

我把 wechat 做成了技能，能访问本地的微信聊天记录、联系人、收藏，数据完全基于你本地，不会上传云端。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

> 你甚至可以基于自己本地模型，做到数据完全隐私。

同样支持你完成很多 Cowork 工作：

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

> 不过其他很多的功能就是网易开源的 lobster AI 自带的了，WeSight 是基于 lobster 进行的二开, 感谢网易，感谢 lobster AI 。

现在 WeSight 处于邀测阶段，你可以在官网获取邀请码后下载 WeSight 体验。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

当你安装好 WeSight 后，会自动帮你配置好 wechat-cli 及 OpenClaw 环境。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

自动装好 wechat skill，整个过程，变得非常的简单，这是我能想到的好的产品形态。

不瞒你说，WeSight 也是我在假期基于 GLM 5.1 搓出来的，借助 subagent 表现很好。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

我是同时 2 个电脑在跑，mac 跑 WeSight 项目，远程连接 Mac mini 跑 wechat-cli 项目。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

用 Google AI Studio 同步开发官网，并配置域名上线，这是 3 天一个人干了以前一个月的活儿。

所以，我说，其实理论上 AI 编程已经到了一个 AGI 的奇点，只是身处时代浪潮下的我们，没有很强的感知罢了。

文章最后，说一说，我和 WeSight 的故事吧。

其实做这个项目，最开始只是因为我自己真的受够了。

每天打开微信，几十个群的 99+，像一座座小山压在心里。

我知道里面肯定有重要信息，但我真的没时间一条条翻。

有时候错过了一些关键讨论，事后才发现，那种懊恼感特别强。

我就想，如果有个工具能帮我自动读群，把精华提炼出来，该多好。

于是我开始动手。

说实话，一开始我也没想到能做成现在这样。

我只是想解决自己的问题，顺便把技术底座开源出来，让更多人能用上。

但做着做着，我发现这件事的意义好像不止于此。

我们每天都在被信息淹没，微信群只是其中一个缩影。

我们需要的不是更多的信息，而是更少但更精准的信息。

**「AI 应该帮我们过滤噪音，而不是制造更多噪音」** 。

所以我做了 WeSight，也开源了 wechat-cli。

我希望它能帮到和我一样，每天被群消息淹没的人。

也希望更多开发者能基于 wechat-cli，做出更多有意思的东西。

这个假期，我爆肝了几天，但我觉得值。

因为我做了一件自己真正需要的东西，也可能帮到了你。

如果你也有同样的痛点，欢迎试试 WeSight。

如果你是开发者，欢迎用 wechat-cli 做点有意思的事。

**「我们一起，让信息回归它该有的样子」** 。

最后要感谢 wechat-decrypt 开源项目为 wechat cli 提供微信数据库解密和数据解析的核心能力。

感谢网易 lobster AI 优秀的开源产品。

感谢蜗牛提供的技术调研、方案预演、及思路探讨。

感谢大家的喜欢。

最后要特别感谢下智谱，感谢 GLM5.1。能力上确实很强，在编程及长程任务上表现很好。

---

**「WeSight 官网」** ：https://wesight.ai  
**「wechat-cli GitHub」** ：https://github.com/freestylefly/wechat-cli

欢迎体验，欢迎 Star，欢迎一起玩。

苍何

邀请你前往腾讯公益一起捐

我为家乡上大分

178人捐赠

AI · 目录

作者提示: 个人观点，仅供参考

阅读原文

继续滑动看下一个

苍何

向上滑动看下一个