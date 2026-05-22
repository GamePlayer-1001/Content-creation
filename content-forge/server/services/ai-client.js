/**
 * AI API 客户端 - 统一封装文字和图片生成
 * 文字生成: 兼容 OpenAI Chat Completions API
 * 图片生成: 使用 OpenAI Responses API (gpt-image-2)
 */

// 动态读取配置（支持运行时通过 /api/config 修改）
function getTextApiBase() { return process.env.TEXT_API_BASE || process.env.AI_API_BASE || 'https://api.dlapi.xyz/v1'; }
function getTextApiKey() { return process.env.TEXT_API_KEY || process.env.AI_API_KEY || ''; }
function getTextModel() { return process.env.AI_TEXT_MODEL || 'gpt-4o'; }
function getImageApiBase() { return process.env.AI_API_BASE || 'https://api.dlapi.xyz/v1'; }
function getImageApiKey() { return process.env.AI_API_KEY || ''; }
function getImageModel() { return process.env.AI_IMAGE_MODEL || 'gpt-image-2'; }

/**
 * 文字生成（流式）
 */
export async function streamChat(messages, onChunk, options = {}) {
  const body = {
    model: options.model || getTextModel(),
    messages,
    stream: true,
    temperature: options.temperature ?? 0.8,
    max_tokens: options.maxTokens ?? 4096,
    top_p: options.topP ?? 1,
    frequency_penalty: options.frequencyPenalty ?? 0,
    presence_penalty: options.presencePenalty ?? 0,
  };

  const apiBase = options.apiBase || getTextApiBase();
  const apiKey = options.apiKey || getTextApiKey();
  if (!apiKey) throw new Error('文字 API Key 未配置，请在设置中填写');

  const response = await fetch(`${apiBase}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI API 错误 (${response.status}): ${err}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;
      const data = trimmed.slice(6);
      if (data === '[DONE]') continue;

      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) {
          fullContent += delta;
          if (onChunk) onChunk(delta);
        }
      } catch {
        // 跳过无法解析的 chunk
      }
    }
  }

  return fullContent;
}

/**
 * 文字生成（非流式）
 */
export async function chat(messages, options = {}) {
  const body = {
    model: options.model || getTextModel(),
    messages,
    temperature: options.temperature ?? 0.8,
    max_tokens: options.maxTokens ?? 4096,
  };

  const apiBase = options.apiBase || getTextApiBase();
  const apiKey = options.apiKey || getTextApiKey();
  if (!apiKey) throw new Error('文字 API Key 未配置，请在设置中填写');

  const response = await fetch(`${apiBase}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI API 错误 (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * 图片生成 (gpt-image-2) - 使用 OpenAI Responses API
 */
export async function generateImage(prompt, options = {}) {
  const body = {
    model: getImageModel(),
    input: prompt,
    tools: [{
      type: 'image_generation',
      size: options.size || '1024x1024',
    }],
  };

  const apiBase = getImageApiBase();
  const apiKey = getImageApiKey();
  if (!apiKey) throw new Error('图片 API Key 未配置，请在设置中填写');

  const response = await fetch(`${apiBase}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`图片生成 API 错误 (${response.status}): ${err}`);
  }

  const data = await response.json();

  // 从 Responses API 输出中提取图片
  const images = [];
  if (data.output) {
    for (const item of data.output) {
      if (item.type === 'image_generation_call' && item.result) {
        images.push({
          b64_json: item.result,
          revised_prompt: prompt,
        });
      }
      // 也处理 message 类型中的图片
      if (item.content) {
        for (const content of item.content) {
          if (content.type === 'output_image') {
            images.push({
              b64_json: content.image_base64 || content.b64_json,
              revised_prompt: prompt,
            });
          }
        }
      }
    }
  }

  return images;
}
