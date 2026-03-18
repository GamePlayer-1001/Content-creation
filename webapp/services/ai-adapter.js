/**
 * [INPUT]: 依赖 child_process (Claude CLI), https/http (API 调用)
 * [OUTPUT]: 对外提供 AIAdapter 类 (stream + generate 方法, 统一三引擎)
 * [POS]: services/ 的 AI 通信核心, 被所有需要 AI 生成的路由消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const https = require('https');

class AIAdapter {
  constructor() {
    this.codexCommand = process.env.CODEX_PATH || 'codex';
    this.engines = {
      claude: { available: true },
      codex: {
        available: this._commandExists(this.codexCommand),
        model: process.env.CODEX_MODEL || process.env.OPENAI_MODEL || 'gpt-5.2',
      },
      openai: {
        available: !!process.env.OPENAI_API_KEY,
        key: process.env.OPENAI_API_KEY,
        model: process.env.OPENAI_MODEL || 'gpt-5.2',
        endpoint: 'https://api.openai.com/v1/chat/completions',
      },
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
      gemini: {
        available: !!(process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_AI_KEY || process.env.GEMINI_API_KEY),
        key: process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_AI_KEY || process.env.GEMINI_API_KEY,
        model: process.env.GOOGLE_GENAI_MODEL || process.env.GEMINI_MODEL || 'gemini-3.1-pro-preview',
        endpoint: 'https://generativelanguage.googleapis.com',
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
      : engine === 'codex'
        ? this._codexCLI(prompt, cfg)
      : engine === 'gemini'
        ? this._geminiStream(cfg, prompt)
        : this._apiStream(cfg, prompt);

    for await (const chunk of gen) {
      totalChars += chunk.length;
      yield chunk;
    }

    const sec = ((Date.now() - start) / 1000).toFixed(1);
    console.log(`  ${_ts()}  [AI] 生成完成  输出=${totalChars}字  耗时=${sec}s  引擎=${engine}`);
  }

  // --- 一次性生成 (非流式, 收集 stream 全部输出) ---
  async generate(prompt, engine = 'claude') {
    let result = '';
    for await (const chunk of this.stream(prompt, engine)) {
      result += chunk;
    }
    return result;
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

  // --- Codex CLI: 本地登录态，非交互 exec 输出最终消息 ---
  async *_codexCLI(prompt, cfg) {
    const outputFile = path.join(os.tmpdir(), `codex-last-${Date.now()}-${Math.random().toString(36).slice(2)}.txt`);
    console.log(`  ${_ts()}  [AI] Codex CLI 启动 -> codex exec -m ${cfg.model}`);

    const child = spawn(this.codexCommand, [
      'exec',
      '--skip-git-repo-check',
      '--sandbox', 'read-only',
      '--color', 'never',
      '--model', cfg.model,
      '--output-last-message', outputFile,
      '-',
    ], {
      shell: true,
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env },
    });

    child.stdin.write(prompt);
    child.stdin.end();

    let stderr = '';
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });

    let stdout = '';
    for await (const chunk of child.stdout) {
      stdout += chunk.toString('utf-8');
    }

    const exitCode = await new Promise((resolve) => child.on('close', resolve));
    if (exitCode !== 0) {
      const detail = stderr || stdout || 'Codex CLI 调用失败';
      throw new Error(`Codex CLI 退出码=${exitCode}: ${detail.slice(0, 400)}`);
    }

    let result = '';
    if (fs.existsSync(outputFile)) {
      result = fs.readFileSync(outputFile, 'utf-8');
      fs.unlinkSync(outputFile);
    }
    if (!result.trim()) {
      result = stdout.trim();
    }
    if (!result.trim()) {
      throw new Error('Codex CLI 未返回文本内容');
    }
    yield result;
  }

  // --- OpenAI / OpenRouter / DeepSeek: 标准 Chat Completions API ---
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

  // --- Gemini: Google Generative Language API (文本生成) ---
  async *_geminiStream(cfg, prompt) {
    const body = JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    });

    const path = `/v1beta/models/${encodeURIComponent(cfg.model)}:generateContent?key=${cfg.key}`;
    console.log(`  ${_ts()}  [AI] Gemini 请求 => ${path.replace(cfg.key, '***')} `);

    const data = await this._httpsJson({
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }, body);

    const parts = data?.candidates?.[0]?.content?.parts || [];
    const text = parts.map(p => p?.text || '').join('');
    if (!text) {
      throw new Error('Gemini 未返回文本内容');
    }
    yield text;
  }

  _httpsJson(options, body) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let chunks = '';
        res.on('data', c => chunks += c);
        res.on('end', () => {
          if (res.statusCode !== 200) {
            return reject(new Error(`API ${res.statusCode}: ${chunks.slice(0, 300)}`));
          }
          try {
            resolve(JSON.parse(chunks));
          } catch (e) {
            reject(new Error(`JSON 解析失败: ${e.message}`));
          }
        });
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }

  _commandExists(command) {
    if (!command) return false;
    if (path.isAbsolute(command)) {
      return fs.existsSync(command);
    }

    if (process.platform === 'win32') {
      const comspec = process.env.ComSpec || 'cmd.exe';
      const result = spawnSync(comspec, ['/d', '/s', '/c', `where ${command}`], {
        stdio: 'ignore',
        timeout: 3000,
        windowsHide: true,
      });
      return result.status === 0;
    }

    const result = spawnSync('which', [command], {
      stdio: 'ignore',
      timeout: 3000,
    });
    return result.status === 0;
  }
}

function _ts() {
  return new Date().toLocaleTimeString('zh-CN', { hour12: false });
}

module.exports = AIAdapter;
