---
title: "用纯C语言实现的Qwen3-TTS推理引擎：无需Python依赖，即刻运行！"
source: "https://www.toutiao.com/article/7616407285007221300/?app=news_article&category_new=__all__&module_name=Android_tt_others&share_did=MS4wLjACAAAAcbYui8GOvjnUIZhAnk6N9gGiyRYJg-Fw3FxRuULj09Q&share_uid=MS4wLjABAAAALXlKY4ZwoGGw80-JC2Ig4GAhWz0ZNI8e37Ppk1YhpMI&timestamp=1775268599&tt_from=wechat&upstream_biz=Android_wechat&utm_campaign=client_share&utm_medium=toutiao_android&utm_source=wechat&share_token=190e494f-a68b-4ac6-bd57-3e642885d735&source=m_redirect"
author:
  - "[[AI观测室]]"
published: 2026-03-13
created: 2026-04-07
description: "今天为大家推荐一个小项目：用纯C语言实现的一个Qwen3-TTS的推理引擎。 这个项目灵感来自antirez的qwen-asr，目标其实挺简单：让高质量的多语言语音合成能在CPU上跑起来，而且零Python依赖。"
tags:
  - "clippings"
---
今天为大家推荐一个小项目：用纯C语言实现的一个Qwen3-TTS的推理引擎。

这个项目灵感来自antirez的qwen-asr，目标其实挺简单：让高质量的多语言语音合成能在CPU上跑起来，而且零Python依赖。代码已经开源在GitHub了：  
gabriele-mastrapasqua/qwen3-tts。

一开始只是想"先把基本流水线跑通"，结果做着做着就变成了一个功能齐全的TTS引擎：支持流式输出、内置HTTP服务器、声音克隆、自定义声音设计——全部打包在一个C语言二进制文件里。

## 为什么要用纯C？

我们都知道现在大模型推理都是PyTorch + transformers + CUDA那一套组成的，而官方Qwen3-TTS也确实是这样。这在GPU服务器上没问题，但作者想要的是"随便哪里都能跑"——一个二进制文件，没有运行时依赖，直接mmap模型权重就能用。

结果就是： `  make blas  ` ，指定模型目录，你就能得到一个约200KB的二进制文件，功能一应俱全。

## 架构设计

Qwen3-TTS是一个三阶段的流水线：

1. **「Talker」** — 一个28层的因果式Qwen3 LLM（0.6B或1.7B参数），采用GQA、RoPE和SwiGLU架构，负责从文本生成离散音频帧token
2. **「Code Predictor」** — 一个5层transformer，每帧执行15次顺序前向传播，填充剩余的codebook条目
3. **「Speech Decoder」** — 一个因果式ConvNet，使用Snake激活函数、ResBlock和480倍上采样，将离散codes转换为24kHz音频

这三个阶段都用C从零重写了一遍。模型支持9种预设声音、10种语言，以及0.6B和1.7B两种模型尺寸（根据权重自动检测）。

## BF16权重，float32计算

模型权重以bfloat16格式存储，直接从标准的HuggingFace safetensors文件mmap加载。在Apple Silicon上，bf16转f32几乎是零成本（就是个左移操作），而且这种方式在贪婪解码下能和Python参考实现得到 **「比特级一致」** 的结果。

INT4量化对0.6B模型来说矩阵太小，不算带宽瓶颈——Q4解包的开销反而让推理 **「慢了20%」** 。最后发现BF16才是最好的平衡点。

## 流式输出

Speech Decoder是完全因果式的（不需要前瞻），这让流式输出在架构上成为可能。引擎生成N帧后，就把对应chunk送进Speech Decoder解码，然后立即输出音频——不用等整个序列生成完。

```
ounter(lineounter(lineounter(line# 把原始PCM管道到音频播放器实现实时播放./qwen_tts -d qwen3-tts-0.6b --text "Hello world" --stdout | \ play -t raw -r 24000 -e signed -b 16 -c 1 -
```

首帧音频大约1秒内就能出来。Speech Decoder用了增量解码+KV缓存，所以每个流式chunk的计算复杂度是O(chunk\_size)，不用重新处理整个序列。

## 内置HTTP服务器

引擎自带一个嵌入式HTTP服务器——不用nginx，不用FastAPI，启动就能收请求：

```
ounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(line# 启动服务器（模型只加载一次，多请求共享）./qwen_tts -d qwen3-tts-0.6b --serve 8080
# 生成语音curl -X POST http://localhost:8080/v1/tts \ -H "Content-Type: application/json" \ -d '{"text":"Hello world","speaker":"ryan","language":"English"}' \ -o output.wav
```

它还支持 **「OpenAI兼容接口」** （ `  /v1/audio/speech  ` ），可以直接替换现有应用里的OpenAI TTS API，另外还有个流式端点，能边生成边发chunked PCM数据。

## 声音克隆

用Base模型变体，你可以用几秒参考音频克隆任意声音：

```
ounter(lineounter(line./qwen_tts -d qwen3-tts-0.6b-base --text "Hello, this is my cloned voice." \ --ref-audio reference.wav -o cloned.wav
```

底层实现是跑了一个完整的ECAPA-TDNN说话人编码器，从参考音频的mel频谱图里提取1024维说话人embedding。你可以保存并复用embedding，避免重复提取：

```
ounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(line# 提取并保存./qwen_tts -d qwen3-tts-0.6b-base --text "Hello" \ --ref-audio ref.wav --save-voice my_voice.bin -o out.wav
# 后续复用（瞬间完成）./qwen_tts -d qwen3-tts-0.6b-base --text "Another sentence" \ --load-voice my_voice.bin -o out2.wav
```

Speech tokenizer编码器（基于Mimi架构，4级strided卷积、8层transformer、split RVQ量化）也实现了，支持完整的ICL模式。

## VoiceDesign

1.7B的VoiceDesign模型可以用自然语言描述创建全新声音：

```
ounter(lineounter(lineounter(line./qwen_tts -d qwen3-tts-voice-design -l English \--instruct "A deep male voice with a British accent, speaking slowly and calmly" \--text "Hello, this is a test." -o british.wav
```

不需要参考音频——描述你想要什么声音就行。

## 风格和情绪控制

1.7B的CustomVoice模型支持 `  --instruct  ` 参数来控制说话风格：

```
ounter(lineounter(lineounter(lineounter(lineounter(line./qwen_tts -d qwen3-tts-1.7b --text "I cannot believe you did that." \--instruct "Speak in a very angry and aggressive tone" -o angry.wav
./qwen_tts -d qwen3-tts-1.7b --text "I cannot believe you did that." \--instruct "Speak very slowly and softly, in a sad whisper" -o whisper.wav
```

同一段文本，完全不同的演绎方式。

## 性能表现

在Apple Silicon（M系列，4线程）上：

| **模型** | **速度** | **每帧耗时** |
| --- | --- | --- |
| 0.6B | ~0.7-0.86x realtime | Talker 24ms + CP 70ms |
| 1.7B | ~0.48x realtime | **Talker 92ms + CP 75ms** |

瓶颈在Code Predictor——每帧要做15次顺序自回归前向传播，这个没法绕。

关键优化点：

- **「NEON优化的bf16矩阵向量乘法」** ，支持多行融合（2行融合dispatch）
- **「融合gate+up投影」** ，优化Talker和Code Predictor里的SwiGLU
- **「统一QKV dispatch」** ，减少线程调度开销
- **「NEON内核」** 实现RMSNorm、attention（dot+V累加）、RoPE、Snake激活函数
- **「融合argmax+matvec」** ，加速Code Predictor的热循环
- **「im2col + BLAS sgemm」** 实现ConvNet解码器，大序列时支持tiling
- **「增量式Speech Decoder」** + KV缓存支持流式
- **「4线程dispatch\_apply」** （甜蜜点——8线程会撞到内存带宽天花板）

从优化前~0.4x realtime，到0.6B模型达到~0.86x realtime，这些优化起了关键作用。

## 实际怎么用

```
ounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(lineounter(line# 编译make blas
# 基础用法./qwen_tts -d qwen3-tts-0.6b --text "Hello, how are you?" -o hello.wav
# 流式输出到扬声器./qwen_tts -d qwen3-tts-0.6b --text "Hello world" --stdout | \ play -t raw -r 24000 -e signed -b 16 -c 1 -
# 启动HTTP服务器./qwen_tts -d qwen3-tts-0.6b --serve 8080
```

项目支持macOS（ARM/x86）、Linux（ARM/x86），Windows可以通过WSL2运行。NEON和AVX SIMD路径都包含了。0.6B模型需要约3GB内存，1.7B需要约8GB。

代码开源在GitHub：  
gabriele-mastrapasqua/qwen3-tts