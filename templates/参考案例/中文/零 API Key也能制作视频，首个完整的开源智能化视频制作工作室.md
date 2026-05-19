---
title: "零 API Key也能制作视频，首个完整的开源智能化视频制作工作室"
source: "https://mp.weixin.qq.com/s/EP6IV0QFias8fc_5QLD7FA"
author:
  - "[[小G]]"
published:
created: 2026-05-18
description: "项目简介把你的 AI 编程助手变成一个完整的视频制作工作室。用自然语言描述你想要什么——你的智能体就会负责调研、脚本写作、素材生成、剪辑和最终合成。"
tags:
  - "clippings"
---
小G *2026年4月16日 08:35*

## 项目简介

把你的 AI 编程助手变成一个完整的 **视频制作工作室** 。

**用自然语言描述你想要什么——你的智能体就会负责调研、脚本写作、素材生成、剪辑和最终合成。**

**重要区别** ：OpenMontage 不仅能制作基于图片的视频，还能真正做出 **实拍视频** （free/open-source 流程）：智能体从免费素材库和开放档案中构建素材库，检索真实运动片段，剪辑成时间线，最终渲染成完整作品。这不是“生成几张图片再动画化”的常规把戏。

下面请看演示视频：

> **《THE LAST BANANA》** —— 一部 60 秒皮克斯风格动画短片，讲述一只孤独的香蕉和猕猴桃成为朋友的故事。使用 6 段 Kling v3 运动片段（fal.ai）、Google Chirp3-HD 旁白、免版税钢琴音乐、TikTok 式逐词字幕 + Remotion 合成。 **总成本：1.33 美元** 。

## 从你喜欢的视频开始

从参考视频起步通常比从零开始写 Prompt 更快。

OpenMontage 支持输入 **YouTube 视频、Short、Reels、TikTok 或本地视频** ，然后生成扎实的制作方案：

1. 粘贴参考视频
2. 智能体分析字幕、节奏、场景、关键帧和风格
3. 返回 2-3 个差异化概念、真实可行的工具路径、成本预估，以及样片

**示例 Prompt：**

> “Here's a YouTube Short I love. Make me something like this, but about quantum computing.。”

你会得到清晰的结构化输出，而不是模糊的 Prompt 堆砌：

- **保留什么** （节奏、钩子、结构、语气）
- **改变什么** （主题、视觉风格、叙事角度）
- **预计成本**
- **当前工具下最终效果预览**

支持 **Claude Code、Cursor、Copilot、Windsurf、Codex** 等任意能读文件和执行代码的 AI 编程助手。

## 快速开始

### 前置要求

- **Python 3.10+**
- **FFmpeg** （ `brew install ffmpeg` 或 `sudo apt install ffmpeg` ）
- **Node.js 18+**
- **一个 AI 编程助手** （Claude Code / Cursor 等）

### 安装运行

```
git clone https://github.com/calesthio/OpenMontage.git
cd OpenMontage
make setup
```

然后在你的 AI 编程助手里输入需求即可，例如：

> “做一个 60 秒关于神经网络如何学习的动画讲解视频”

或者想要真实素材路径：

> “做一个 75 秒关于雨天城市生活的纪录片蒙太奇，只用真实素材，不要旁白，哀伤优雅的语气，配音乐。”

智能体将会自动完成调研、生成素材、写脚本、配音、找音乐、加字幕并渲染最终视频。在输出前还会进行多重自我审查（ffprobe 校验、帧采样、音频电平分析等）。

**没有 `make` 命令？** 手动运行：

```
pip install -r requirements.txt && cd remotion-composer && npm install && cd .. && pip install piper-tts && cp .env.example .env
```

---

## 零 API Key 也能制作的视频

开箱即用（ `make setup` 后）即可使用的免费工具：

| 功能 | 免费工具 | 作用 |
| --- | --- | --- |
| 旁白 | Piper TTS | 离线高品质文本转语音 |
| 开放素材 | Archive.org + NASA + Wikimedia | 免费档案 footage |
| 额外素材 | Pexels / Unsplash / Pixabay | 免费图库（开发者 Key 免费申请） |
| 视频合成 | Remotion | 把图片变成带物理动画、转场、字幕的视频 |
| 后期 | FFmpeg | 编码、字幕烧录、混音、调色 |
| 字幕 | 内置 | 自动逐词时间轴字幕 |

**两条免费路线** ：

1. **图片驱动视频** ：Piper 旁白 + FLUX 等图片 + Remotion 动画
2. **真实素材蒙太奇** ：从开放档案构建素材库，剪辑真实运动镜头（提示时说 “documentary montage” + “use real footage only”）

---

## 推荐 Prompt 示例

### 从参考视频开始

- “我喜欢这个 YouTube Short，能给我做几个关于产品发布的原创变体吗？”
- “保留这个视频的节奏和钩子，但做成 45 秒黑洞讲解视频。”

### 零 Key 路线

- “做一个 45 秒为什么天空是蓝色的动画讲解视频”
- “做一个 60 秒互联网发展史视频，带旁白和字幕”

### 真实素材纪录片路线

- “做一个 90 秒关于凌晨 4 点城市感觉的纪录片蒙太奇，只用真实素材…”

## 项目地址

https://github.com/calesthio/OpenMontage

扫码加入技术交流群，备注「 **开发语言-城市-昵称** 」

**合作请注明**

![图片](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

如果你觉得这篇文章不错，别忘了 **点赞、在看、转发** 给更多需要的小伙伴哦！我们下期再见！

视频 · 目录

继续滑动看下一个

GitHubStore

向上滑动看下一个