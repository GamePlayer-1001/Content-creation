---
title: "Openclaw/Hermes获得全网信息了！AutoCLI 智能体超级引擎"
source: "https://www.toutiao.com/article/7629855539438076431/?app=news_article&category_new=__all__&module_name=Android_tt_others&share_did=MS4wLjACAAAAcbYui8GOvjnUIZhAnk6N9gGiyRYJg-Fw3FxRuULj09Q&share_uid=MS4wLjABAAAALXlKY4ZwoGGw80-JC2Ig4GAhWz0ZNI8e37Ppk1YhpMI&timestamp=1776483155&tt_from=wechat&upstream_biz=Android_wechat&utm_campaign=client_share&utm_medium=toutiao_android&utm_source=wechat&share_token=d0834c91-96bf-486f-8e8e-ef8eb06a24db&source=m_redirect"
author:
  - "[[狂奔的蜗牛2049]]"
published: 2026-04-18
created: 2026-05-18
description: "AI Agent 终于能“上网冲浪”了！AutoCLI 技能让 Claude/OpenClaw 直接刷 B 站、知乎、微博，再也不用愁中文平台访问难题过去，AI Agent 最头疼的事儿就是“看得到、摸不着”。"
tags:
  - "clippings"
---
AI Agent 终于能“上网冲浪”了！AutoCLI 技能让 Claude/OpenClaw 直接刷 B 站、知乎、微博，再也不用愁中文平台访问难题

![](https://p11-sign.toutiaoimg.com/tos-cn-i-axegupay5k/12d80fe9fd3648f9beba8fdd601c8281~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1779685706&x-signature=NJSLFYm3iBllpAKK1%2B%2FD3IRUbSM%3D)

过去，AI Agent 最头疼的事儿就是“看得到、摸不着”。Claude、OpenClaw 这些强大模型能写代码、分析数据，却拿中文互联网平台没辙：B 站热榜刷不了、知乎最新讨论搜不到、微博热搜实时查不了。小红书种草、雪球股票讨论、豆瓣小组动态……全被 API 墙挡在外面。

申请官方 API？手续繁琐，很多平台还不给个人开发者资质。直接让 AI 爬虫？又面临封号、反爬、登录态失效等一堆麻烦。结果就是：AI 只能“纸上谈兵”，无法真正触达真实世界的中文信息流。

现在，这个痛点被一个 4.7MB 的小工具 彻底干掉了——它叫 AutoCLI（配套的 Skill 叫 autocli-skill）。

什么是 AutoCLI？一句话说清

AutoCLI 是一个用 Rust 重写的极速、零依赖命令行工具，专为 AI Agent 设计。它把 55+ 个主流平台 直接变成 AI 能“读懂”的 CLI 接口，让 AI 用自然语言就能调用：

- B 站今天热门视频
- 知乎上关于“AI Agent”的最新讨论
- 微博热搜前 10
- 小红书最新笔记
- Twitter/X、YouTube、Reddit、HackerNews、Notion、Cursor……
- 甚至还能发推文、查茅台股票行情、控制 Electron 桌面应用

核心黑科技：直接复用你 Chrome 浏览器的登录状态。不用登录、不用 API Key、不用额外配置。只要你 Chrome 里已经登录了这些平台，AutoCLI 就能“借用”你的 Cookies 和 Session，瞬间拿到真实数据。零风险、零门槛、实时更新。

为什么它这么香？看这几大亮点

1. 体积小到离谱：单个 4.7MB 二进制文件，零运行时依赖（对比原版 Node.js 方案，体积缩小 10 倍，内存占用更低，速度提升最高 12 倍）。
2. 完全为 AI Agent 量身打造：专门做了 ClaudeCode / OpenClaw / Cursor 等 Agent 的 Skill，一键安装后，AI 就能自动发现所有工具，在对话里直接调用。  
	示例命令：“查下 B 站今天的热门”“搜知乎上关于 AI 的讨论”“看微博热搜前 10”“帮我发一条推文：今天 AI 终于能刷 B 站了！”
3. 支持平台超全：B 站、知乎、微博、小红书、Twitter/X、YouTube、Reddit、雪球、豆瓣……55+ 个，涵盖社交、视频、问答、财经、笔记、新闻等几乎所有你日常会用的中文 + 国际平台。
4. 安全又简单：纯本地运行，不上传任何凭证，只读你已有的浏览器会话。下载即用，无需安装 Node.js、Python 等一大堆依赖。

怎么玩？三步搞定

1. 去 GitHub 下载 AutoCLI 主仓库（Rust 核心）：https://github.com/nashsu/AutoCLI
2. 安装专为 ClaudeCode/OpenClaw 准备的 Skill：https://github.com/nashsu/autocli-skill （一键 npx 安装即可）
3. 在你的 AI Agent 配置里（AGENT.md 或.cursorrules）加上 autocli list，AI 就能自动调用了。

以后你跟 AI 聊天，直接甩自然语言就行，完全不用再写复杂的 prompt 去绕 API。

这波操作，真正解决了 AI Agent 的“最后一公里”

以前 AI 只能靠搜索引擎喂数据，或者靠有限的 API 喝汤。现在有了 AutoCLI，它终于能自己“下凡”到真实互联网，尤其是中文内容生态里，获取第一手、带登录态的实时信息。这对做内容分析、舆情监测、股票研究、竞品跟踪、个人知识管理的人来说，简直是降维打击。

开源、免费、轻量，还在持续迭代。作者把原先 TypeScript 的 OpenCLI 彻底用 Rust 重写，性能和体积都拉满，诚意满分。

感兴趣的朋友直接冲：

装完之后，试试跟你的 AI 说一句：“查下 B 站今天的热门”，你会立刻感觉到——AI 终于活过来了。

欢迎大家装完后在评论区分享你的使用体验：它帮你最先解决了哪个平台的痛点？是 B 站弹幕分析，还是知乎高赞回答，还是微博热搜追踪？

AI Agent 的新时代，真的要来了。