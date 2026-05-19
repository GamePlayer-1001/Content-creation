---
title: "Claude Code源码泄露了，但我的OpenClaw先用上了"
source: "https://mp.weixin.qq.com/s/3YxLpUzG-ebKRmBQ7QfcWQ?scene=1"
author:
  - "[[俊哥AI副业]]"
published:
created: 2026-04-03
description: "Claude Code源码泄露了，但我的OpenClaw先用上了你们知道吗。上周发生了一件大事。Claude"
tags:
  - "clippings"
---
原创 俊哥AI副业 *2026年4月2日 19:15*

估计这俩天大家都知道发生了一件大事。

Claude Code的50万行源码，因为一个低级错误，全泄露了。

全世界的开发者都在扒。

我也在扒。

但我扒的方式不一样。

先说泄露里最炸的东西

8个隐藏新功能，我只说最让我兴奋的几个：

BUDDY（电子宠物伴侣）

这是一个从“愚人节彩蛋”转变为正式功能的养成类 AI 宠物系统，主要为用户提供情绪价值和趣味性。

生成机制：基于用户 ID 的哈希值确定性生成，每个用户的宠物都是独一无二的。

多样性：包含 18 种物种（如鸭子、猫、水豚等），分为 5 个稀有度等级（普通到传说），甚至有 1% 的“闪光（shiny）”概率。宠物还拥有多种眼睛样式和帽子装饰。

个性与灵魂：首次“孵化”时，Claude 会为其生成永久的名字和性格。宠物拥有 5 项基础属性（调试能力、耐心、混乱值、智慧、毒舌程度）。

**Auto-Dream（做梦）**  
当你不用Claude Code的时候，它会在后台自动整理你的所有记忆，避免记忆紊乱。

**Kairos，主动模式**  
Claude变成24小时在线的主动助手，有自己的每日日志，还能主动给你发通知。

**UDS Inbox，跨会话通信**  
开了三个Claude Code窗口？以前互相不认识。现在它们可以互发消息了。

这些功能，Anthropic说5月上线。

我等不了5月。

![图片](https://mmbiz.qpic.cn/sz_mmbiz_jpg/w6mvmIkicgIibbUKz5qS78bj5LztdycqmkwkeLjShiaicuM0haKhoY8xh1ljrwiaNibvZEstRQicS11yrXjKo6hn24o7Ws7zgj9Kzloib2iboy0ZuwWg/640?wx_fmt=jpeg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

对了，我开出的buddy隐藏宠物

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

然后大佬出手了

就在泄露的第二天。

有大佬连夜把这50万行代码拆解成了6个Skills，开源到了GitHub。

不强依赖Claude Code环境， **OpenClaw也能用** 。

6个Skills分别是：

- **Dream Memory**
	— 自动整理压缩记忆
- **Memory Extractor**
	— 提取你和AI的协作风格
- **Context Compressor**
	— 9段式结构化上下文压缩
- **Verification Gate**
	— 任务"完成"后再拉一次验证
- **Swarm Coordinator**
	— 大任务拆成4段多Agent协作
- **Kairos Lite**
	— 轻量定时巡检后台任务

我直接让我的OpenClaw装上了

不是"研究一下"。

是真的装上了，当天就用起来了。

6个技能，全部落地到我的OpenClaw里。

现在我的龙虾，已经在用Claude Code源码里的机制了。

Claude Code的宠物功能还没上线。

我的AI助手已经在帮我整理记忆、压缩上下文、后台巡检了。

这件事让我想明白一件事

Claude Code泄露，对Anthropic是事故。

对我们是礼物。

源码里藏的那些机制，不是Claude Code专属的。

它们是通用的AI协作思路。

谁先拿来用，谁先受益。

我不是开发。

但我让我的AI助手帮我装好了。

这就是2026年学AI的正确姿势。

不是学怎么写代码。

是学怎么让AI帮你用上最新的东西。

你的龙虾也可以装

GitHub地址：github.com/LearnPrompt/cc-harness-skills

直接把链接发给你的OpenClaw，让它自己安装。

它会的。

我是俊哥，链接我领资料进交流群

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

工具在变，会用工具的人先跑。

**微信扫一扫赞赏作者**

阅读原文

继续滑动看下一个

俊哥AI出海

向上滑动看下一个