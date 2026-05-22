---
title: "msmarkgu/RelayFreeLLM: A restful API designed to route user prompts to various AI model providers."
source: "https://github.com/msmarkgu/RelayFreeLLM"
author:
published:
created: 2026-04-13
description: "A restful API designed to route user prompts to various AI model providers. - msmarkgu/RelayFreeLLM"
tags:
  - "clippings"
---
## RelayFreeLLM

> **一个终端。比任何单一供应商都多的免费人工智能。更少的速率限制烦恼。**

不想付钱 每月花费不菲？RelayFreeLLM 可以帮到您。它是一个开源网关，将 Gemini、Groq、Mistral、Cerebras 和 Ollama 等免费模型提供商整合到一个与 OpenAI 兼容的 API 中，让您获得更多免费推理资源，并具备自动故障转移功能。

```
# Your existing code works. Just change the URL.
client = OpenAI(base_url="http://localhost:8000/v1", api_key="fake")
```

无需修改代码。无需重试逻辑。不会出现导致应用崩溃的 429 错误。

---

## 你为什么需要它

### 免费层级问题

免费的AI API很有用，但直接使用它们可能会很麻烦：

```
❌ Groq hits rate limit → Your app crashes
❌ Gemini quota exhausted → User sees error
❌ Switching providers → Rewrite your integration
❌ Testing 5 providers → 5 different SDKs to manage
```

### RelayFreeLLM解决方案

```
✅ Gemini fails → Automatically tries Groq
✅ One provider down → Traffic routes to others
✅ Same API for everyone → OpenAI-compatible
✅ More providers = More throughput
```

您将获得一个 **元模型** ：一个单一的端点，它路由到下一个可用的免费提供商，提供灵活的上下文管理，保持会话亲和性，并自动故障转移以保持您的应用程序运行。

---

## 您将获得

| 特征 | 为什么这很重要 |
| --- | --- |
| **兼容 OpenAI** | 可直接替换现有代码。支持 LangChain、LlamaIndex 和任何 SDK。 |
| **会话亲和力** | `X-Session-ID` 通过提供商端上下文缓存 将用户锁定到特定提供商。加快响应速度。 |
| **上下文管理** | 4 种模式（静态、动态、储层、自适应）。利用多轮抽取式摘要技术智能地修剪过长的历史数据。 |
| **自动故障转移** | 服务商宕机了？某个型号达到使用次数上限了？我们会自动尝试下一个型号。零停机时间。 |
| **一致的输出风格** | 通用风格指南和响应规范化工具消除了提供商特有的怪癖。 |
| **严格的启动验证** | 服务器在绑定之前会验证所有模型、注册表项和 API 密钥，以确保网关运行正常。 |
| **实时流媒体** | 所有后端提供商均提供全面的SSE流媒体支持。 |
| **本地模型** | 将云端免费套餐与您的私有 Ollama 实例无缝混合使用。 |

---

## 适用人群

| 用户 | 用例 |
| --- | --- |
| **独立开发者** | 无需每月支付高额 API 费用即可使用人工智能功能 |
| **学生和业余爱好者** | GPT级别的AI，无需信用卡或电话号码 |
| **自托管者** | 将 Ollama 隐私与云容量相结合 |
| **研究人员** | 跨提供商批量查询以提高吞吐量 |

---

## 快速入门

### 1\. 安装

```
git clone https://github.com/msmarkgu/RelayFreeLLM.git
cd RelayFreeLLM
pip install -r requirements.txt
```

### 2\. 添加免费 API 密钥

创建`.env` 文件：

```
# --- Providers (Required) ---
GEMINI_APIKEY=      # ai.google.dev
GROQ_APIKEY=        # console.groq.com
MISTRAL_APIKEY=     # console.mistral.ai
CEREBRAS_APIKEY=    # cloud.cerebras.ai

# --- Optional Providers ---
DEEPSEEK_APIKEY=
OLLAMA_BASE_URL=http://localhost:11434
```

**注意：** 所有其他设置（上下文管理、会话亲和性、HTTP 超时等）均在 中配置 `settings.json` 。

### 3\. 编辑模型限制（可选）

编辑 [`provider_model_limits.json`](https://github.com/msmarkgu/RelayFreeLLM/blob/main/src/provider_model_limits.json) 以更新各型号的速率限制。默认值适用于大多数使用场景。

```
{
  "providers": [
    {
      "name": "Groq",
      "models": [
        {
          "name": "llama-3.3-70b-versatile",
          "limits": {
            "requests_per_second": 1,
            "requests_per_minute": 30,
            "requests_per_hour": 1800,
            "requests_per_day": 1000,
            "tokens_per_minute": 12000,
            "tokens_per_hour": 30000,
            "tokens_per_day": 100000
          },
          "max_context_length": 131072
        }
      ]
    }
  ]
}
```

**推断限制：** 供应商通常只记录部分限制（例如，仅 RPM 和 TPM）。推断其他限制：

- `requests_per_hour ≈ requests_per_minute × 60`
- `requests_per_day ≈ requests_per_hour × 24`
- 代币限额也遵循同样的模式。

| 提供者 | 文档网址 |
| --- | --- |
| 格罗克 | [https://console.groq.com/docs/models](https://console.groq.com/docs/models) |
| 米斯特拉尔 | [https://docs.mistral.ai/deployment/ai-studio/tier](https://docs.mistral.ai/deployment/ai-studio/tier) |
| 大脑 | [https://inference-docs.cerebras.ai/support/rate-limits](https://inference-docs.cerebras.ai/support/rate-limits) |
| 双子座 | [https://ai.google.dev/gemini-api/docs/rate-limits](https://ai.google.dev/gemini-api/docs/rate-limits) |
| 深潜 | [https://api-docs.deepseek.com/quick\_start/rate\_limit](https://api-docs.deepseek.com/quick_start/rate_limit) |

**注意：** 速率限制因账户级别而异。默认值适用于大多数使用情况。

**添加新提供商：** 要添加新提供商，请创建一个新客户端， `src/api_clients/` 并将其模型/限制添加到此文件中。有关 JSON 结构，请参阅现有提供商。

**自动化功能即将上线：** 我们计划推出一个命令行工具，用于从供应商文档中自动获取/刷新模型限制。这将使步骤 3 完全自动化。

### 4\. 验证连接性（可选，但建议）

```
python -m tests.test_models_availability
```

根据您选择的服务提供商，结果应如下所示：

```
==================================================
MODEL AVAILABILITY SUMMARY
==================================================
✅ PASS | Cerebras     | qwen-3-235b-a22b-instruct-2507           | Success
✅ PASS | Groq         | llama-3.3-70b-versatile                  | Success
✅ PASS | Groq         | qwen/qwen3-32b                           | Success
✅ PASS | Groq         | openai/gpt-oss-20b                       | Success
✅ PASS | Groq         | openai/gpt-oss-120b                      | Success
✅ PASS | Groq         | moonshotai/kimi-k2-instruct-0905         | Success
✅ PASS | Groq         | moonshotai/kimi-k2-instruct              | Success
✅ PASS | Groq         | groq/compound                            | Success
✅ PASS | Mistral      | mistral-large-latest                     | Success
✅ PASS | Mistral      | mistral-medium-latest                    | Success
✅ PASS | Mistral      | codestral-latest                         | Success
✅ PASS | Mistral      | mistral-large-2512                       | Success
✅ PASS | Mistral      | mistral-medium-2508                      | Success
✅ PASS | Mistral      | mistral-medium-2505                      | Success
✅ PASS | Mistral      | mistral-medium                           | Success
✅ PASS | Mistral      | codestral-2508                           | Success
✅ PASS | Gemini       | gemini-2.5-flash                         | Success
==================================================
TOTAL: 17/17 models available.
==================================================
```

### 5\. 启动服务器

```
python -m src.server
```

控制台应该会显示类似这样的信息：

```
INFO:     Started server process [203452]
INFO:     Waiting for application startup.
...
...
...
2026-04-01 19:44:04,123 - src.model_selector - INFO - Provider sequence: ['Cerebras', 'Groq', 'Mistral', 'Gemini', 'Ollama'], Provider Strategy: roundrobin, Model Strategy: roundrobin
2026-04-01 19:44:04,123 - __main__ - INFO - Meta model 'meta-model' ready with providers: ['Cerebras', 'Cloudflare', 'Gemini', 'Groq', 'Mistral', 'Ollama']
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### 6\. 使用它

**Python SDK：**

```
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="relay-free"
)

# Automatic routing - picks the next available free provider
response = client.chat.completions.create(
    model="meta-model",
    messages=[{"role": "user", "content": "Hello!"}]
)

# Or route to specific provider
response = client.chat.completions.create(
    model="groq/llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

**关于输出一致性的说明** ：无论哪个服务提供商（Gemini、Groq、Mistral 等）处理您的请求，RelayFreeLLM 都会通过通用的样式指南和响应规范化来确保输出风格的一致性。这意味着当系统在不同服务提供商之间自动切换时，不会出现语气或格式上的突兀变化。

**卷曲：**

```
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Authorization: Bearer relay-free" \
  -H "Content-Type: application/json" \
  -d '{"model": "meta-model", "messages": [{"role": "user", "content": "Hi"}]}'
```

**朗链：**

```
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    base_url="http://localhost:8000/v1",
    api_key="relay-free",
    model="meta-model"
)
```

**REST 客户端示例** （使用 [VS Code REST 客户端](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) 扩展）

```
POST http://localhost:8000/v1/chat/completions HTTP/1.1
content-type: application/json

{
    "model": "meta-model",
    "messages": [
        {"role": "system", "content": "Format response in JSON."},
        {"role": "user", "content": "When was the country Romania founded?"}
    ]
}

### Specific Model Routing
# Directly target a specific provider and model
POST http://localhost:8000/v1/chat/completions HTTP/1.1
content-type: application/json

{
    "model": "Mistral/mistral-large-latest",
    "messages": [
        {"role": "user", "content": "What is the capital of France?"}
    ]
}
```

更多示例请参见[./tests/api.http](https://github.com/msmarkgu/RelayFreeLLM/blob/main/tests/api.http) 。

---

## 观看实际演示

[![RelayFreeLLM 演示](https://raw.githubusercontent.com/msmarkgu/RelayFreeLLM/main/relayfreellm-demo.gif)](https://raw.githubusercontent.com/msmarkgu/RelayFreeLLM/main/relayfreellm-demo.gif)

---

## 路由工作原理

### 基于意图的选择

告诉 RelayFreeLLM 你需要什么：

```
// "Any model from any providers, RelayFreeLLM will choose the next available"
{"model": "meta-model", "messages": [...]}

// "Give me coding model from any providers"
{"model": "meta-model", "model_type": "coding", "messages": [...]}

// "I prefer small models to run fast, give simple responses"
{"model": "meta-model", "model_scale": "small", "messages": [...]}

// "I want large models to do most capable reasoning"
{"model": "meta-model", "model_scale": "large", "messages": [...]}

// "I want DeepSeek models if available"
{"model": "meta-model", "model_name": "deepseek", "messages": [...]}

// "Specific provider/model"
{"model": "Gemini/gemini-2.5-flash", "messages": [...]}
```

### 自动故障转移

当服务提供商达到速率限制时：

```
Request → Groq (rate limited)
        → Circuit breaker activates
        → Retry → Gemini
        → Retry → Mistral
        → Success ✓
```

### 一致的输出风格

尽管 RelayFreeLLM 会自动在不同服务提供商之间切换，但它仍能保持一致的输出风格：

- **通用样式指南** 已注入到每个请求的系统提示中
- **响应规范化** 消除了提供商特有的差异
- 在不同提供商之间进行故障切换时， **不会出现突兀的风格切换。**
- 无论后端如何， **都要保持一致的语气、格式和质量。**

---

## 高级功能

### 会话亲和性（对话缓存）

在多轮对话中，许多服务提供商（例如 Gemini 和 Anthropic）提供 **上下文缓存** 优化功能。为了充分利用这些功能，RelayFreeLLM 支持会话亲和性。

By passing the `X-Session-ID` header, RelayFreeLLM will try to "pin" a user to the same provider for the duration of their session.

1. **User sends request** with `X-Session-ID: user-123`.
2. **Gateway routes** to Gemini and locks that session ID to Gemini.
3. **Subsequent requests** from `user-123` bypass the round-robin logic and go straight back to Gemini.
4. If Gemini fails or hit limits, the gateway automatically migrates the session to the next best provider and re-pins it.

### Multi-Turn Context Management

As conversations grow, they exceed free tier context limits. RelayFreeLLM's `ContextManager` uses advanced pruning to keep chats alive:

| Mode | Behavior |
| --- | --- |
| **Static** | Keeps the last $N$ messages verbatim. Simplest but loses far context. |
| **Dynamic** | Uses real-time token tracking to boost the context window when usage is low, or contract it when usage spikes, ensuring you never exceed model context limits. |
| **Reservoir** | Keeps recent messages verbatim + adds an **extractive summary** of the older conversation. |
| **Adaptive** | Detects task type (e.g., coding vs chat) and switches between Reservoir and Static modes automatically. |

**Extractive Summarization**: Unlike simple truncation, Reservoir mode preserves the "essence" of your history. It uses a **TF-scoring algorithm** (Term Frequency) to identify sentences with the most unique information, applies a **position bias** for topicality, and greedily selects the highest-scoring segments to fit within your token budget.

```
Request → Gemini (adds "As an AI..." preamble)
        → Normalizer removes preamble
        → Clean, direct response returned

Request → Groq (adds "Sure thing!" opener)
        → Normalizer removes opener
        → Same clean, direct response style
```

---

## API Reference

### POST /v1/chat/completions

| Parameter | Type | Description |
| --- | --- | --- |
| `model` | string | `"meta-model"` for auto-routing, or `"provider/model"` for direct |
| `messages` | array | Standard OpenAI message format |
| `stream` | bool | Enable SSE streaming (default: false) |
| `model_type` | string | Filter: `text`, `coding`, `ocr` |
| `model_scale` | string | Filter: `large`, `medium`, `small` |
| `model_name` | string | Match model name substring |

### GET /v1/models

List available models with status:

```
curl http://localhost:8000/v1/models?type=coding&scale=large
```

### GET /v1/usage

Track your aggregated usage:

```
curl http://localhost:8000/v1/usage
```

---

## Architecture

```
┌─────────────────────────────────────────────────┐
       │                 Your Application                │
       │         (OpenAI SDK, LangChain, etc.)           │
       └─────────────────────┬───────────────────────────┘
                             │ OpenAI-compatible API
                             │ (with optional X-Session-ID)
       ┌─────────────────────▼───────────────────────────┐
       │              RelayFreeLLM Gateway               │
       │  ┌───────────┐    ┌───────────┐    ┌──────────┐ │
       │  │  Router   │───▶│Dispatcher │───▶│ContextMgr│ │
       │  │ /v1/chat  │    │ (Retries) │    │(Summary) │ │
       │  └───────────┘    └─────┬─────┘    └──────────┘ │
       │                         │          ┌──────────┐ │
       │                         └─────────▶│Affinity  │ │
       │                                    │  Map     │ │
       │                                    └──────────┘ │
       └─────────────────────────┬───────────────────────┘
                                 │
     ┌──────────┬──────────┬─────┴────┬──────────┬──────────┐
     ▼          ▼          ▼          ▼          ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Gemini │ │  Groq  │ │ Mistral│ │Cerebras│ │DeepSeek│ │ Ollama │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘ └────────┘
```

### Output Homogenization

To ensure consistent user experience despite provider switching:

1. **Style Directive Injection**: Universal style guide added to every request's system prompt
2. **Response Normalization**: Post-processing removes provider-specific quirks:
	- Strips AI preambles ("As an AI", "Certainly!", etc.)
		- Standardizes markdown and code formatting
		- Fixes and extracts JSON from code fences
		- Ensures consistent tone and formatting

This means users get the same high-quality, consistent output whether their request was handled by Gemini, Groq, Mistral, or any other provider.

---

## Project Structure

```
RelayFreeLLM/
├── src/
│   ├── server.py                 # Entry point
│   ├── router.py                 # API endpoints
│   ├── model_dispatcher.py       # Retry & circuit breaker logic
│   ├── model_selector.py         # Quota-aware routing
│   ├── provider_registry.py      # Auto-discovers providers
│   ├── models.py                 # Request/response models
│   └── api_clients/              # Provider implementations
│       ├── gemini_client.py
│       ├── groq_client.py
│       ├── mistral_client.py
│       └── ...
├── tests/                        # Unit & integration tests
└── provider_model_limits.json    # Rate limit configuration
```

---

## Roadmap

- Web dashboard for live provider status
- Persistent rate limit state
- Prompt caching layer
- Embeddings & image generation routing
- One-command Docker deploy

---

## Contributing

Found a new free provider? Adding one takes about 50 lines:

```
# src/api_clients/my_provider_client.py
class MyProviderClient(ApiInterface):
    PROVIDER_NAME = "myprovider"

    async def call_model_api(self, request, stream):
        # Your API logic here
        pass
```

PRs welcome.

---

## Acknowledgements

Built with [FastAPI](https://fastapi.tiangolo.com/), [Pydantic](https://docs.pydantic.dev/), [httpx](https://www.python-httpx.org/), and AI coding tools.

[由Google Gemini](https://ai.google.dev/) 、 [Groq](https://groq.com/) 、 [Mistral AI](https://mistral.ai/) 、 [Cerebras](https://cerebras.ai/) 和 [Ollama](https://ollama.com/) 的慷慨免费层级提供支持 。

---

*专为希望拥有强大AI功能但又不想支付高昂费用的开发者而设计。*