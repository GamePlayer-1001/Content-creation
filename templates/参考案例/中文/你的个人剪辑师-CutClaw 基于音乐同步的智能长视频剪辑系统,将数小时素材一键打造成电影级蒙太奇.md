---
title: "你的个人剪辑师-CutClaw: 基于音乐同步的智能长视频剪辑系统,将数小时素材一键打造成电影级蒙太奇"
source: "https://mp.weixin.qq.com/s/NlXG07fTFvDgz2mDPpA4Mw"
author:
  - "[[小K]]"
published:
created: 2026-05-18
description: "你的个人剪辑师-CutClaw: 基于音乐同步的智能长视频剪辑系统,将数小时素材一键打造成电影级蒙太奇"
tags:
  - "clippings"
---
小K *2026年4月4日 08:00*

CutClaw 是一个面向长视频素材与音乐的端到端自动剪辑系统。

它首先将原始视频和音频解析为结构化描述，再通过多智能体流水线完成镜头规划（ `shot_plan` ）、片段时间戳选取（ `shot_point` ）及质量验证，最终渲染输出成片。

![图片](https://mmbiz.qpic.cn/mmbiz_png/ibibCVXCYh6Ifwzia52yomITKsG9VarMia4L8icPwVm1zXvOe84w3banHkPFz9t3sia6icuwN6CTT9ibLnE1pez0jrMBfvBOcIICJZzOHibSbo3Aszyc/640?wx_fmt=png&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=0)

核心功能：

### 🎬 一键素材解析：只需一键，即可将数小时的原始视频和音频转化为结构化、可检索的素材库》。

### 🎯 自然语言指令控制：只需一句文字指令即可主导剪辑风格——既能生成快节奏人物混剪，也能输出慢节奏情感叙事。

### 📱 智能自动裁剪：内容感知裁剪自动识别画面主体，并按各平台比例进行智能调整。

### 🎵 音乐感知同步：提取音乐节拍与能量信号，构建与音乐节奏完美契合的剪切点。

### 安装说明：1. 安装●●●bashgit clone https://github.com/GVCLab/CutClaw.git cd CutClaw conda create -n CutClaw python=3.12 conda activate CutClaw pip install -r requirements.txt强烈推荐使用支持 GPU 加速的 Decord/NVDEC 版本以加快视频解码速度，请参考源码编译指南。2. 放入素材文件●●●coderesource/ ├── video/ ← 放入.mp4 /.mkv 视频文件 ├── audio/ ← 放入.mp3 /.wav 音频文件 └── subtitle/ ← 可选.srt 字幕文件（跳过 ASR，节省时间）3. 运行UI 界面（推荐）●●●bashstreamlit run app.py在浏览器中打开 http://localhost:8501。（如无法访问，请尝试 http://127.0.0.1:8501）将素材放入上述路径后，可直接在 UI 中选择对应文件。模型选择建议：●视频模型○用途：镜头/场景理解与视觉描述生成。○推荐：Gemini-3、Qwen3.5、GPT-5.3●音频模型○用途：语音识别（ASR）及音乐结构分析（节拍/强拍、音高、能量），用于节拍感知分割。○推荐：Gemini-3●智能体模型○用途：驱动编剧 + 剪辑 + 审阅智能体循环，生成 shot\_plan 和 shot\_point。○推荐：MiniMax-2.7、Kimi-2.5、Claude-4.5系统使用 LiteLLM 作为 API 统一网关，模型名称格式如 openai/MiniMax-2.7，表示通过 OpenAI 协议调用该模型。更多信息请参阅 \[LiteLLM 文档\]。命令行模式（进阶）●●●bashpython local\_run.py \\ --Video\_Path "resource/video/xxxx.mp4" \\ --Audio\_Path "resource/audio/xxxx.mp3" \\ --Instruction "xxxx"常用配置覆盖参数所有 src/config.py 中的参数均可通过 --config.PARAM\_NAME VALUE 在运行时覆盖。参数默认值说明VIDEO\_PATH"resource/video/The\_Dark\_Knight.mkv"默认视频路径（UI 记忆输入）AUDIO\_PATH"resource/audio/Way\_Down\_We\_Go.mp3"默认音频路径（UI 记忆输入）INSTRUCTION"Joker's crazy that want to change the world."默认剪辑指令ASR\_BACKEND"litellm"ASR 引擎（litellm 云端或 whisper\_cpp 本地）VIDEO\_FPS2预处理采样帧率MAIN\_CHARACTER\_NAME"Joker"主角名称（角色聚焦剪辑）AUDIO\_MIN\_SEGMENT\_DURATION3.0节拍片段最短时长（秒）AUDIO\_MAX\_SEGMENT\_DURATION5.0节拍片段最长时长（秒）AUDIO\_DETECTION\_METHODS\["downbeat", "pitch", "mel\_energy"\]音频关键点检测方法PARALLEL\_SHOT\_MAX\_WORKERS4并行镜头选择线程数示例：●●●bashpython local\_run.py \\ --Video\_Path "resource/video/xxxx.mp4" \\ --Audio\_Path "resource/audio/xxxx.mp3" \\ --Instruction "xxxx" \\ --config.MAIN\_CHARACTER\_NAME "Batman" \\ --config.VIDEO\_FPS 2 \\ --config.AUDIO\_TOTAL\_SHOTS 50手动渲染：●●●bashpython render/render\_video.py \\ --shot-plan "Output/<video\_audio>/shot\_plan\_\*.json" \\ --shot-json "Output/<video\_audio>/shot\_point\_\*.json" \\ --video "resource/video/xxxx.mp4" \\ --audio "resource/audio/xxxx.mp3" \\ --output "output/final.mp4" \\ --crop-ratio "9:16" \\ --no-labels --render-hook-dialogue常见问题运行速度很慢1.API 延迟 —— 流水线会向视觉/语言 API 发送大量并发请求，速度很大程度上取决于 API 提供商的响应时间和速率限制。2.首次素材解析耗时长 —— 第一次处理某段视频时，镜头检测、描述生成、ASR 和场景分析均从头运行，这是每段视频的一次性开销。后续使用相同素材时会直接复用缓存，速度大幅提升。3.GPU 加速 —— 支持 CUDA 的 GPU 能显著加快视频解码和编码速度。推荐参考安装章节，使用支持 NVDEC 的 Decord 版本。4.视频编码兼容性 —— 若流水线在视频处理环节卡住，可能是源视频编码格式导致的。经测试，使用 libx264 编码的视频运行最稳定。●●●bibtex@article{cutclaw, title={CutClaw: Agentic Hours-Long Video Editing via Music Synchronization}, author={Shifang Zhao, Yihan Hu, Ying Shan, Yunchao Wei, Xiaodong Cun}, journal={arXiv preprint arXiv:2603.29664}, year={2026} }

**—— 如此才是**

**把复杂的技术，讲成你真正能用上的生产力**

**[零基础养🦞](https://mp.weixin.qq.com/s?__biz=MzY5MTAxODQ1MQ==&mid=2247484054&idx=1&sn=762eece965669afeb6c583cea2badd16&scene=21#wechat_redirect) [163个AI工具塞进Godot，solo游戏开发者效率直接起飞！15刀搞定爆款游戏](https://mp.weixin.qq.com/s?__biz=MzY5MTAxODQ1MQ==&mid=2247484384&idx=1&sn=0cb741021a027dbacf774fcbfd8096aa&scene=21#wechat_redirect) [每天自动收到AI股票分析](https://mp.weixin.qq.com/s?__biz=MzY5MTAxODQ1MQ==&mid=2247484029&idx=1&sn=2581190d3828d4f6b030cb33990f1172&scene=21#wechat_redirect) [AI快速游戏开发](https://mp.weixin.qq.com/s?__biz=MzY5MTAxODQ1MQ==&mid=2247483932&idx=1&sn=4b23d753e478f38f3457cec04944d6ef&scene=21#wechat_redirect) [AionUi：开源免费的多代理AI桌面协作工具](https://mp.weixin.qq.com/s?__biz=MzY5MTAxODQ1MQ==&mid=2247483812&idx=1&sn=1d896361c692c0b8e1bb3dd69c0aa81b&scene=21#wechat_redirect) [openakita](https://mp.weixin.qq.com/s?__biz=MzY5MTAxODQ1MQ==&mid=2247484054&idx=1&sn=762eece965669afeb6c583cea2badd16&scene=21#wechat_redirect) 🔥 [ClawDeckX可视化管理OpenClaw](https://mp.weixin.qq.com/s?__biz=MzY5MTAxODQ1MQ==&mid=2247484105&idx=1&sn=4fbb7c7812d98b65600d167be9c88fec&scene=21#wechat_redirect) 🔥 [Ghost-OS真人化“点鼠标”](https://mp.weixin.qq.com/s?__biz=MzY5MTAxODQ1MQ==&mid=2247484178&idx=1&sn=6a2d20f51197bc51d21a739e3c644d8d&scene=21#wechat_redirect) [开源神器 Network-AI：让 OpenClaw 多agent彻底告别竞态、超支和混乱，5 分钟变生产级协调层！](https://mp.weixin.qq.com/s?__biz=MzY5MTAxODQ1MQ==&mid=2247484317&idx=1&sn=13000d4d0707431f2668f9dee1c8aa1d&scene=21#wechat_redirect) [GitHub爆款开源神器！388个OpenClaw技能一键装机，你的AI代理直接变身全能打工人](https://mp.weixin.qq.com/s?__biz=MzY5MTAxODQ1MQ==&mid=2247484312&idx=1&sn=4d3cf7d5c300c9e8095f217118f2662e&scene=21#wechat_redirect) [3分钟生成完整带词歌曲！ACE-Step-1.5开源免费，把AI音乐创作塞进本地电脑](https://mp.weixin.qq.com/s?__biz=MzY5MTAxODQ1MQ==&mid=2247484307&idx=1&sn=fc7ff1fc17029bccac92abc85ba04d4f&scene=21#wechat_redirect) [32.4k星的Shopify替代品到底长什么样，开源电商最强灵活框架medusa](https://mp.weixin.qq.com/s?__biz=MzY5MTAxODQ1MQ==&mid=2247484300&idx=1&sn=bb2fe42d6f5f4404832d47e73b7fdab8&scene=21#wechat_redirect) [开源神器 Network-AI：让 OpenClaw 多agent彻底告别竞态、超支和混乱，5 分钟变生产级协调层！](https://mp.weixin.qq.com/s?__biz=MzY5MTAxODQ1MQ==&mid=2247484317&idx=1&sn=13000d4d0707431f2668f9dee1c8aa1d&scene=21#wechat_redirect) [全网扫描神器：开源工具last30days-skill ，让你瞬间掌握任何话题的最新真实动态](https://mp.weixin.qq.com/s?__biz=MzY5MTAxODQ1MQ==&mid=2247484327&idx=1&sn=a7003626e36e4def9077b0de7a5e7837&scene=21#wechat_redirect) [闲置电脑也能跑千亿参数大模型！Gradient开源Parallax，让你一台笔记本+几块GPU就拥有私人AI超算,异构的Exo](https://mp.weixin.qq.com/s?__biz=MzY5MTAxODQ1MQ==&mid=2247484349&idx=1&sn=292c183eea970a9aa49bd07efd43233a&scene=21#wechat_redirect) [GitHub 5.6万星炸裂！黑客“瑞士军刀”HackingTool v2.0上线，一键解锁185+渗透神器，新手也能秒变大佬](https://mp.weixin.qq.com/s?__biz=MzY5MTAxODQ1MQ==&mid=2247484344&idx=1&sn=5f15cc53a2d1fdfae0893c7e3282e93e&scene=21#wechat_redirect) [AI 亲手写的开源神器：Claude 生成的 macOS 语音输入工具，按 Fn 键即说即打（支持自编译）](https://mp.weixin.qq.com/s?__biz=MzY5MTAxODQ1MQ==&mid=2247484383&idx=1&sn=6ac5b81315badd9fa3d2f226f7452dc9&scene=21#wechat_redirect)**

AI · 目录

作者提示: 素材来源官方媒体/网络新闻，文中事件发生于2026年4月4日

继续滑动看下一个

如此才是

向上滑动看下一个