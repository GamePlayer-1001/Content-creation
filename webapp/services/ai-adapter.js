/**
 * [INPUT]: 依赖 child_process (Claude CLI), https/http (API 调用)
 * [OUTPUT]: 对外提供 AIAdapter 类 (stream 方法, 统一三引擎)
 * [POS]: services/ 的 AI 通信核心, 被所有需要 AI 生成的路由消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const { spawn } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

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
      throw new Error(`AI 引擎不可用: ${engine}`);
    }

    switch (engine) {
      case 'claude':
        yield* this._claudeCLI(prompt);
        break;
      case 'openrouter':
        yield* this._apiStream(cfg, prompt);
        break;
      case 'deepseek':
        yield* this._apiStream(cfg, prompt);
        break;
      default:
        throw new Error(`未知引擎: ${engine}`);
    }
  }

  // --- Claude CLI: 本地已认证，通过临时文件传入长 Prompt ---
  async *_claudeCLI(prompt) {
    // 写入临时文件避免 Windows 命令行长度限制
    const tmpFile = path.join(os.tmpdir(), `claude-prompt-${Date.now()}.txt`);
    fs.writeFileSync(tmpFile, prompt, 'utf-8');

    try {
      const child = spawn('claude', [
        '--print',
        '-p', `请阅读以下完整指令并严格执行：\n\n$(cat "${tmpFile.replace(/\\/g, '/')}")`,
      ], {
        shell: true,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env },
      });

      // 也尝试直接通过 stdin 传入
      // 但 claude CLI --print -p 不支持 stdin 读取
      // 所以用 cat 临时文件的方式

      let stderr = '';
      child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });

      for await (const chunk of child.stdout) {
        yield chunk.toString('utf-8');
      }

      const exitCode = await new Promise((resolve) => child.on('close', resolve));

      if (exitCode !== 0 && stderr) {
        // 备选: 直接用 -p 传入（短 prompt 情况）
        console.error('[Claude CLI stderr]', stderr.slice(0, 200));
      }
    } finally {
      // 清理临时文件
      try { fs.unlinkSync(tmpFile); } catch {}
    }
  }

  // --- OpenRouter / DeepSeek: 标准 OpenAI 兼容 API ---
  async *_apiStream(cfg, prompt) {
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

module.exports = AIAdapter;
