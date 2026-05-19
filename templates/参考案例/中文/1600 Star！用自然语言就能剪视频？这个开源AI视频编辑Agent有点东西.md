---
title: "1600 Star！用自然语言就能剪视频？这个开源AI视频编辑Agent有点东西"
source: "https://mp.weixin.qq.com/s/akRFTCD6lTH9Kx-0NiGvoQ?poc_token=HOKfCmqjlMwW2t8iX3BuWQblF9nr0tp8s_zhCSYt"
author:
  - "[[何三]]"
published:
created: 2026-05-18
description: "coverassets/openstoryline_cover.png 大家好，我是何三，独立开发者。 剪过视频的人都知道，从一堆素材到成片，中间有多少琐碎的活儿——挑片段、写文案、找 BGM、调字体..."
tags:
  - "clippings"
---
何三 *2026年4月4日 18:43*

![cover](https://mmbiz.qpic.cn/mmbiz_png/R4dg0ib2nglKKB29mCfGRRLWHdgsmPNibOibJaG8pQ1DLOLRTP5yR71QYOz0VTH2fArq99n20I1QKWvVD1PviaNsQMf4x3B2yZc3EOg2u4oVMpA/640?from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

cover

大家好，我是何三，独立开发者。

剪过视频的人都知道，从一堆素材到成片，中间有多少琐碎的活儿——挑片段、写文案、找 BGM、调字体、对节奏……哪怕只是做个一分钟的小红书视频，也能耗掉你一整个下午。

最近我在 GitHub 上发现了一个项目，试图把这些活儿全部交给 AI 来干。它叫 **FireRed-OpenStoryline** ，来自 FireRed 团队，目前已经有 **1600+ Star** ，Apache 2.0 开源协议。

![workflow](https://mmbiz.qpic.cn/sz_mmbiz_png/R4dg0ib2nglL7SIIqoFVmUDg7aVelOsicUvMdB0usnxnAicmW6jqBte7ag0KCUwU6Epkmj54T1ERGW2hZcmkHfRLaichIVmsv8Gwsl8YaPu78Lc/640?from=appmsg&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=1)

workflow

## 它到底能做什么？

简单说，OpenStoryline 是一个 **AI 视频编辑 Agent** ——注意，不是某个视频剪辑软件的 AI 插件，而是一个完整的、通过自然语言驱动的视频创作系统。

你只需要用大白话告诉它你想要什么，剩下的它自己搞定。

比如你可以这样说：

> "帮我做一个咖啡店的探店视频，风格小清新，BGM 轻快一点"

然后它会自动搜索素材、生成脚本、匹配音乐和字体、完成剪辑。

这跟传统的"你操作工具"完全不同。它更像是一个 **你用语言指挥的导演** ，而不是你亲手去拖时间轴。

## 五个核心能力

![features](data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg width='1px' height='1px' viewBox='0 0 1 1' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Ctitle%3E%3C/title%3E%3Cg stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' fill-opacity='0'%3E%3Cg transform='translate(-249.000000, -126.000000)' fill='%23FFFFFF'%3E%3Crect x='249' y='126' width='1' height='1'%3E%3C/rect%3E%3C/g%3E%3C/g%3E%3C/svg%3E)

features

**1\. 智能素材搜索**

你不用自己去各个素材网站翻找。告诉它主题，它会自动搜索并下载匹配的图片和视频片段，然后基于内容进行分割和理解。这意味着它能"看懂"你给的素材在讲什么。

**2\. 智能脚本生成**

这个功能有点意思。它不只是帮你写个文案，而是结合了画面理解、情绪识别来构建完整的叙事线和旁白。更实用的是，它支持 **Few-shot 风格迁移** ——你给它一段参考文字，比如某个博主的种草风格，它就能模仿那个语气、节奏和句式来写脚本。

产品测评口吻、日常 vlog 随意风、纪录片正经腔调……都能搞定。

**3\. 音乐、配音、字体智能推荐**

根据视频内容和情绪，自动推荐合适的 BGM，还能做智能节拍同步。你只需要用自然语言描述想要的调性——"克制一点"、"煽情一点"、"纪录片风格"——它就会匹配相应的配音和字体。

还可以导入你自己的歌单，让它在你的曲库里挑。

**4\. 对话式精调**

生成初版之后，如果你想微调，不用去操作复杂的时间轴。直接说：

- "把第 3 段和第 4 段换个顺序"
- "BGM 节奏再快一点"
- "字幕字体换成圆体，加个描边"
- "第 5 秒到第 8 秒裁掉"

所有编辑都是纯自然语言，改完立刻看效果。

**5\. 编辑技能存档（Skill）**

这个可能是最值得关注的点。当你完成一次满意的编辑流程后，可以把整个流程保存为 **自定义 Skill** 。下次做类似风格的视频，只需要换素材，直接应用这个 Skill 就能复刻风格。

换句话说，你相当于在"录制"自己的剪辑套路，然后一键批量套用。

## 技术架构

从架构上看，OpenStoryline 的核心思路是： **LLM 做大脑，工具链做手** 。

- **MCP Server** ：基于 Model Context Protocol 构建服务端，负责和 LLM 交互
- **Agent** ：基于 LangChain 构建的 Agent 系统，负责任务规划和工具调用
- **Nodes** ：具体的视频处理节点（裁剪、合成、转场等）
- **Skills** ：可复用的编辑技能包
- **Storage** ：Agent 记忆系统，保存上下文和偏好

整个项目用 Python 为主（70%），Web 界面用 JavaScript/HTML/CSS。

支持两种使用方式：命令行 CLI 和 Web 界面。Web 界面通过 FastAPI + Uvicorn 启动。

## 快速上手

环境要求不高，Python 3.11+ 就行。

**第一步：克隆项目**

```
git clone https://github.com/FireRedTeam/FireRed-OpenStoryline.git
cd FireRed-OpenStoryline
```

**第二步：创建虚拟环境**

```
conda create -n storyline python=3.11
conda activate storyline
```

**第三步：下载资源和安装依赖**

Linux/macOS 用户可以一键安装：

```
sh build_env.sh
```

Windows 用户需要手动下载模型和资源包，然后：

```
pip install -r requirements.txt
```

**第四步：配置 API Key**

在 `config.toml` 里配置你的 LLM API Key（支持多种大模型）。

**第五步：启动服务**

```
# 启动 MCP Server
PYTHONPATH=src python -m open_storyline.mcp.server

# 启动 Web 界面（另一个终端）
uvicorn agent_fastapi:app --host 127.0.0.1 --port 8005
```

也支持 Docker 部署，一条命令搞定：

```
docker pull openstoryline/openstoryline:v1.0.1
docker run -v $(pwd)/config.toml:/app/config.toml \
  -v $(pwd)/outputs:/app/outputs \
  -p 7860:7860 \
  openstoryline/openstoryline:v1.0.1
```

## 还能通过 Agent 来用

这个项目有个比较有意思的设计——它自己就支持被其他 Agent 调用。

提供了两个 Skill：

- **openstoryline-install** ：负责安装和配置
- **openstoryline-use** ：负责实际的视频编辑工作流

如果你在用 **Claude Code** ，在项目根目录下直接输入 `/openstoryline-use` 就能调用。也支持 **OpenClaw** 和其他兼容的 Agent 框架。

等于说你可以在更大的 Agent 生态里把它当作一个"视频编辑工具"来编排。

## 适合谁用？

从目前的信息来看，这个项目适合这几类人：

- **内容创作者** ：做短视频、探店、测评的，想提高出片效率
- **自媒体团队** ：需要批量生产风格统一的视频内容
- **独立开发者** ：想研究 AI Agent 在视频领域的应用
- **技术爱好者** ：对 MCP 协议、Agent 架构感兴趣

官方 Demo 里展示了中草风格、幽默风格、产品种草、艺术风格、开箱、萌宠、旅行 vlog、年度总结等多种视频类型，覆盖面挺广的。

## 一些需要注意的地方

说几个实际使用中可能遇到的点：

- 默认开源素材效果比较基础，想达到商业级效果需要自己配置高级字体和音乐资源库
- AI 转场生成依赖第三方 AIGC 服务，成本较高且结果不太可控
- 语音克隆功能还在 TODO 列表里，暂时不支持
- 项目要求配置外部 LLM API Key，不是完全本地运行的

不过作为开源项目，这些都在持续迭代中。从更新日志看，团队几乎每周都有新功能更新，节奏很快。

## 我的看法

说实话，AI 视频编辑这个赛道已经有很多玩家了，但大多数要么是闭源的商业产品，要么只解决了某个环节（比如 AI 剪辑或 AI 配文）。

OpenStoryline 的差异化在于： **它把"意图"到"成片"的完整链路都串起来了** ，而且全程用自然语言驱动，还支持 Skill 复用和 Agent 生态集成。

当然，目前它生成的视频质量跟专业剪辑师的手工活还是有差距的。但如果你只是想做内容量产、降低剪辑门槛，或者想研究 AI Agent 在创意领域的应用，这个项目值得花时间看看。

项目地址：https://github.com/FireRedTeam/FireRed-OpenStoryline

---

*本文使用 MGO 编辑并发布*

> 关注"何三笔记"，回复"mgo" 免费下载使用

继续滑动看下一个

何三笔记

向上滑动看下一个