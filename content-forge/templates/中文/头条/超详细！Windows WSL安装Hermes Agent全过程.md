---
title: "超详细！Windows WSL安装Hermes Agent全过程"
source: "https://www.toutiao.com/article/7627536533490385434/?app=news_article&category_new=__all__&module_name=Android_tt_others&share_did=MS4wLjACAAAAcbYui8GOvjnUIZhAnk6N9gGiyRYJg-Fw3FxRuULj09Q&share_uid=MS4wLjABAAAALXlKY4ZwoGGw80-JC2Ig4GAhWz0ZNI8e37Ppk1YhpMI&timestamp=1775961353&tt_from=wechat&upstream_biz=Android_wechat&utm_campaign=client_share&utm_medium=toutiao_android&utm_source=wechat&share_token=64445b7e-bee7-442a-b0ef-73a5b4d9c06a&source=m_redirect"
author:
  - "[[一行人]]"
published: 2026-04-12
created: 2026-05-18
description: "Hermes Agent是什么？官方定义非常直接：The agent that grows with you（一个会随着使用不断成长的 Agent），它是一个自主智能体，运行时间越长，能力就越强。"
tags:
  - "clippings"
---
作品声明：个人观点、仅供参考

## Hermes Agent是什么？

官方定义非常直接：The agent that grows with you（一个会随着使用不断成长的 Agent），它是一个自主智能体， **运行时间越长，能力就越强** 。

Hermes Agent 的核心理念是： **让 AI 成为长期在线的数字员工，而非一次性聊天机器人。**

Hermes Agent 是 **原生内置学习闭环的 AI Agent** ，可从执行经验中沉淀技能、自主优化能力、持久化知识、检索历史对话，并在跨会话中持续完善用户认知模型。

Hermes Agent 支持自由切换任意大模型，包括 Nous Portal、OpenRouter（200+ 模型）、OpenAI、GLM、Kimi、MiniMax 等，执行 hermes model 即可切换，无需改代码、无厂商锁定。

## 安装步骤

Windows 系统说明：不支持原生 Windows 环境，请先安装 WSL2，再在 WSL2 终端中执行上述命令。以下安装命令适用于 Linux、macOS 与 WSL系统：

```nginx
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

安装程序会自动处理所有依赖项：

- **uv** — 快速 Python 包管理器
- **Python 3.11** — 通过 uv 安装，无需 sudo
- **Node.js v22** — 用于浏览器自动化和 WhatsApp 桥接
- **ripgrep** — 快速文件搜索
- **ffmpeg** — TTS 音频格式转换
![](https://p26-sign.toutiaoimg.com/tos-cn-i-axegupay5k/39519973c3204f578f6488f180f7078a~tplv-tt-origin-web:gif.jpeg?_iz=58558&from=article.pc_detail&lk3s=953192f4&x-expires=1779685637&x-signature=3NF3JtNiNKK5q5yEQ5GrBWd%2F4YA%3D)

选择倒数第二个

可以选择更多国内或国际的大模型，这里我们选择 **kimi**

输入 API key

选择 **kimi-k2.5**

这里直接跳过

输入y可以直接开启hermes，或者后续自行执行hermes开启也一样

执行source ~/.bashrc重载shell配置

```bash
source  ~/.bashrc
```

修改kimi api地址，输入hermes config edit 将  
https://api.moonshot.ai/v1 修改为  
https://api.moonshot.cn/v1

```lua
hermes config
```
```lua
hermes config edit
```

## 最终效果

输入hermes即可进入Hermes Agent使用

## 结语

从 2 月底开源首月破 2.2 万星，到 4 月 8 日 v0.8.0 版本发布后单日新增 6400 + 星，Hermes Agent 在不到两个月的时间里，GitHub 总星标已突破 4.7 万，并在多日内持续霸榜全球开源榜单第一。

很多人都说Hermes Agent是OpenClaw的下一个阶段，想尝试的可以试试看，欢迎讨论体验收获！