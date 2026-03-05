/**
 * [INPUT]: 依赖 child_process (Claude CLI), https/http (API 调用)
 * [OUTPUT]: 对外提供 AIAdapter 类 (stream 方法, 统一三引擎)
 * [POS]: services/ 的 AI 通信核心, 被所有需要 AI 生成的路由消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const { spawn } = require('child_process');
const https = require('https');

class AIAdapter {
  constructor() {
    this.engines = {
      claude: { available: true },
      openrouter: {
        available: !!process.env.OPENROUTER_API_KEY,
        key: process.env.OPENROUTER_API_KEY,
        model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
        endpoint: 'https://openrouter.ai/api/v1/chat/completions',
      },
      deepseek: {
        available: !!process.env.DEEPSEEK_API_KEY,
        key: process.env.DEEPSEEK_API_KEY,
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        endpoint: 'https://api.deepseek.com/v1/chat/completions',
      },
    };
  }

  // --- 获取可用引擎列表 ---
  listEngines() {
    return Object.entries(this.engines).map(([name, cfg]) => ({
      name,
      available: cfg.available,
    }));
  }

  // --- 流式生成 (AsyncGenerator) ---
  async *stream(prompt, engine = 'claude') {
    const cfg = this.engines[engine];
    if (!cfg || !cfg.available) {
      console.log(`  [AI] ✗ 引擎不可用: ${engine}`);
      throw new Error(`AI 引擎不可用: ${engine}`);
    }

    const t = _ts();
    const promptLen = prompt.length;
    const promptPreview = prompt.replace(/\s+/g, ' ').slice(0, 80);
    console.log(`  ${t}  [AI] 引擎=${engine}  prompt=${promptLen}字`);
    console.log(`  ${t}  [AI] 内容预览: ${promptPreview}...`);

    const start = Date.now();
    let totalChars = 0;

    const gen = engine === 'claude'
      ? this._claudeCLI(prompt)
      : this._apiStream(cfg, prompt);

    for await (const chunk of gen) {
      totalChars += chunk.length;
      yield chunk;
    }

    const sec = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`  ${_ts()}  [AI] 生成完成  输出=${totalChars}字  耗时=${sec}s  引擎=${engine}`);
  }

  // --- Claude CLI: 本地已认证，stdin 管道传入 Prompt ---
  async *_claudeCLI(prompt) {
    console.log(`  ${_ts()}  [AI] Claude CLI 启动 → claude --print (stdin 管道)`);

    const child = spawn('claude', ['--print'], {
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env },
    });

    // stdin 管道写入 prompt，绕开 shell 语法差异和命令行长度限制
    child.stdin.write(prompt);
    child.stdin.end();

    let stderr = '';
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });

    let firstChunk = true;
    for await (const chunk of child.stdout) {
      if (firstChunk) {
        console.log(`  ${_ts()}  [AI] Claude CLI 开始输出...`);
        firstChunk = false;
      }
      yield chunk.toString('utf-8');
    }

    const exitCode = await new Promise((resolve) => child.on('close', resolve));

    if (exitCode !== 0) {
      console.error(`  ${_ts()}  [AI] ✗ Claude CLI 退出码=${exitCode}`);
      if (stderr) console.error(`  ${_ts()}  [AI] ✗ stderr: ${stderr.slice(0, 300)}`);
    } else {
      console.log(`  ${_ts()}  [AI] Claude CLI 正常退出`);
    }
  }

  // --- OpenRouter / DeepSeek: 标准 OpenAI 兼容 API ---
  async *_apiStream(cfg, prompt) {
    console.log(`  ${_ts()}  [AI] API 请求 → ${cfg.endpoint}  model=${cfg.model}`);
    const url = new URL(cfg.endpoint);
    const body = JSON.stringify({
      model: cfg.model,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      max_tokens: 8192,
    });

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cfg.key}`,
        'Content-Length': Buffer.byteLength(body),
      },
    };

    yield* await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        if (res.statusCode !== 200) {
          let errBody = '';
          res.on('data', c => errBody += c);
          res.on('end', () => reject(new Error(`API ${res.statusCode}: ${errBody.slice(0, 200)}`)));
          return;
        }

        // 返回 AsyncGenerator
        resolve((async function* () {
          let buffer = '';
          for await (const chunk of res) {
            buffer += chunk.toString();
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
                try {
                  const data = JSON.parse(trimmed.slice(6));
                  const content = data.choices?.[0]?.delta?.content;
                  if (content) yield content;
                } catch {}
              }
            }
          }
        })());
      });

      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }
}

function _ts() {
  return new Date().toLocaleTimeString('zh-CN', { hour12: false });
}

module.exports = AIAdapter;
