---
title: "隆重发布 NotebookLM-CDP-CLI，把 NotebookLM 无缝嵌入到你的工作流"
source: "https://mp.weixin.qq.com/s/ZvO9O5WrcxeXFqEsY9JIZQ?scene=1&click_id=4"
author:
  - "[[奥雷里亚诺]]"
published:
created: 2026-04-13
description: "NotebookLM 自动化终极方案：基于 CDP 的 CLI 工具，把网页版无缝搬进终端"
tags:
  - "clippings"
---
原创 奥雷里亚诺 *2026年3月30日 20:26*

## NotebookLM 自动化终极方案：基于 CDP 的 CLI 工具，把网页版无缝搬进终端

这段时间，我一直在折腾一件事：

NotebookLM 实在太强大了。借助 Google 最强的生图模型 nano banana 2， 不管是做 PPT 还是视频，在文件处理、深度学习、日常办公里，都是我不可代替的伙伴。 我甚至觉得，NotebookLM 是下一个时代的产品。

尤其是现在的 Cinematic 模式： 可以把你的知识、素材转化为电影级 / 沉浸式视频，会生成流畅的动画、丰富详细的动态画面和故事化叙事。

<video src="https://mpvideo.qpic.cn/0b2eiiap2aaaeeajl7gk3fuvaqwd7vbab7ia.f10002.mp4?dis_k=54562001853ef1a8302f37d56aecb97b&amp;dis_t=1776067289&amp;play_scene=10120&amp;auth_info=IO/u/rFSRHlFpMDxuGthFEhZRncgMFg1SkkkXHdyb04eeGkZdFoZFidoFj8ZSXYuQg==&amp;auth_key=1df4caf284cd4bfe8d722333acafd2d6&amp;vid=wxv_4450666650740359174&amp;format_id=10002&amp;support_redirect=0&amp;mmversion=false" controls="">您的浏览器不支持 video 标签</video>

## 之前的方案，为什么总觉得差一口气

我之前一直用的一个项目是 `notebooklm-py` 。

它的原理是：

登录阶段：Playwright 打开浏览器 -> 用户手动登录 -> `context.storage_state()` 保存 cookies

API 调用阶段：读取 `storage_state.json` -> 提取 cookie 值 -> 拼成 `Cookie: SID=xxx; HSID=xxx` HTTP 头 -> 通过 `httpx` （纯 Python HTTP 客户端）把自己伪装成客户端来发送请求

Playwright 只在登录时使用，后续所有 API 调用都是纯 HTTP，不涉及浏览器。

这个巧妙的伪装原理有一个致命的缺陷，那就是谷歌的认证太严格了，只可以把登录态锁死在现在很落后的 Playwright。其他客户端登录同样账号，就会挤下来认证。

这就是最大的问题： 一个功能全部在网页的应用，转移到终端后，反而用不了网页的可视化功能。 这对于多模态平台简直是致命的。

怎么让 NotebookLM 更像一个真正可用的办公助手， 而不是一个只能在终端里小心供着的“脚本对象”？

用 Playwright，保存登录态，导出 `storage_state.json` ，然后围绕这份状态文件继续构建命令行、脚本、工作流，在现在 agent 一路狂飙的时代，确实有点过时了。

不是今天掉登录， 就是明天状态漂移。

不是用户浏览器这边已经登录， 就是自动化那边还守着另一套身份。

## 所以，我做了一个项目

`notebooklm-cdp-cli`

它是一个非官方的 NotebookLM 命令行工具。 但它最核心的取舍，不在命令行本身，而在认证模型上。

简而言之：

我选择继续保留 CLI / RPC 的效率， 但把认证从 Playwright 的状态文件，改成 CDP 直连真实 Chrome 登录态。

也就是说，它不是让你再维护一份“自动化专用身份”， 而是尽量复用你本来就在用的那套真实浏览器身份。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

## 为什么要复用真实浏览器

复用浏览器的优点，就是可以绕过一切检测，跳过指纹攻防。

很多自动化项目，到了后面，真正麻烦的从来不是“调用接口”本身， 而是身份不统一，状态不统一，环境不统一。

你真实浏览器里是一个世界。 自动化浏览器里又是另一个世界。

你在浏览器里刚刚点过、看过、登录过。 自动化还要重新模拟一遍。

你明明想要的是：

- 一个真正能融入工作流的 NotebookLM
- 一个随时能调、随手能用的知识助手
- 一个能挂在命令行和自动化系统上的生产力入口

大多数时候，你通过 cookie，或者 `storage_state.json` ，你得到的却是：

- 一份脆弱的状态文件
- 一套平行的身份体系
- 一种“能跑，但不够自然”的使用体验

把 `storage_state.json` 当成长期认证真相时，整个系统就会越来越偏离真实用户环境。

而我更想做的，是反过来。

不是让浏览器适配自动化， 而是让自动化贴近浏览器。

不是再造一个平行身份世界， 而是回到真实身份之上。

不是把 NotebookLM 困在终端， 而是把它接回真正工作的地方。

## 这个项目到底做了什么

`notebooklm-cdp-cli` 目前提供的是一套围绕 NotebookLM 的 CLI 能力，覆盖了几类核心场景：

### 1\. 浏览器接入与认证诊断

你可以直接做：

```
browser attach
browser status
auth check
```

也就是说，先把真实浏览器接进来，再检查认证状态，而不是默认先造一个新的自动化身份。

我加了端口检测，并且 Linux 系统完美支持长久调用和无头模式。三台服务器都是 clone 就可以直接跑。

### 2\. Notebook 级别的核心操作

包括：

- `notebook` ：创建笔记本目录、批量管理
- `source` ：借用搜索能力，SOTA 级别的 Google Research 寻找来源
- `chat` ：对话索引
- `notes` ：支持所有导入格式，我还对剪贴板功能做了优化，支持批量导入
- `research` ：研究

简而言之，让你的终端真正具备真正的 NotebookLM 工作流能力。

### 3\. Artifact 与内容生成

它也支持：

- `artifact` 管理
- `report`
- `audio` ：支持交互音频
- `video` ：自定义风格视频
- `slide` ：幻灯片
- `infographic` （电影级 / 沉浸式视频）

包括生成与下载流程。 也就是说，你不只是“能问一句”，而是能进一步把 NotebookLM 的输出接进更完整的内容生产链路里。

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

## 这个项目的定位，我想得很清楚

它不是在重新发明 NotebookLM 客户端。 它也不是想把所有能力都自己重写一遍。

这里要说清楚一点：

这个项目当前的 NotebookLM client / RPC 能力，仍然建立在 `notebooklm-py` 之上。

我借鉴了 `notebooklm-py` 的：

- NotebookLM client
- RPC types
- 后端调用能力

`notebooklm-cdp-cli` 重点解决什么：

- live Chrome identity layer
- CDP 直连真实浏览器
- CLI surface
- 本地状态管理

也就是说，我的重点不是重复造轮子， 而是在认证模型和使用路径上，做一个更贴近真实工作流的方案。

这既是对上游的尊重， 也是对项目边界的尊重。

## 首发暂时只支持 Linux

无需插件， 有登录态就开箱即用。

## 这个项目想服务的，不是“脚本炫技”，而是真实使用

我越来越强烈地感觉到一个变化：

AI 工具的发展，已经慢慢从“能不能做”转向“能不能长期用”。

能跑一次，不难。 能稳定复用，才难。

能做个 demo，不稀奇。 能嵌进真实工作流，才值钱。

NotebookLM 本身很强。 但如果它始终只能停留在网页手点，或者困在一套断裂的自动化身份里，那它的上限就会被压住，没有闭环。

我想做的，不是再多一个 CLI。 而是把这条路往前推一点：

让 NotebookLM 更自然地接入真实浏览器， 更自然地接入终端工作流， 更自然地成为“你本来就在使用的工具链”的一部分。

## 最后

这个项目还很早， 也还有很多地方要继续磨。

但我觉得：

真正的身份，就该在真实浏览器里。 真正的效率，才应该在命令行里。

命令行负责操作， 浏览器承载身份。

两者接上，工具才顺。 身份归一，工作才稳。

如果你也在折腾 NotebookLM 自动化， 如果你也受够了 `storage_state.json` 那种“能用，但别扭”的路径， 欢迎来看看这个项目。

项目地址： https://github.com/muqiao215/notebooklm-cdp-cli

---

> 我是木乔，致力于把 AI 调教成"全自动打工仔"的开发者和产品经理。
> 
> 关注我，一起探索让 AI 更懂你的方式。

继续滑动看下一个

MQ AGI实验室

向上滑动看下一个