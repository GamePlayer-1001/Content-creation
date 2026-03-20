/**
 * [INPUT]: 读取 process.env
 * [OUTPUT]: 导出 resolveRuntimeEnv（统一环境变量口径 + 兼容映射）
 * [POS]: core/config 的运行时配置入口，被 WebApp/CLI/服务层复用
 */

function resolveRuntimeEnv(env = process.env) {
  const geminiKey = pickFirst(env, ['GOOGLE_GENAI_API_KEY', 'GOOGLE_AI_KEY', 'GEMINI_API_KEY'], '');
  const geminiModel = pickFirst(env, ['GOOGLE_GENAI_MODEL', 'GEMINI_MODEL'], 'gemini-3.1-pro-preview');

  return {
    server: {
      port: toPort(pickFirst(env, ['PORT'], '3210'), 3210),
    },
    codex: {
      path: pickFirst(env, ['CODEX_PATH'], 'codex'),
      model: pickFirst(env, ['CODEX_MODEL', 'OPENAI_MODEL'], 'gpt-5.4'),
    },
    openai: {
      apiKey: pickFirst(env, ['OPENAI_API_KEY'], ''),
      model: pickFirst(env, ['OPENAI_MODEL', 'CODEX_MODEL'], 'gpt-5.4'),
    },
    openrouter: {
      apiKey: pickFirst(env, ['OPENROUTER_API_KEY'], ''),
      model: pickFirst(env, ['OPENROUTER_MODEL'], 'anthropic/claude-3.5-sonnet'),
    },
    deepseek: {
      apiKey: pickFirst(env, ['DEEPSEEK_API_KEY'], ''),
      model: pickFirst(env, ['DEEPSEEK_MODEL'], 'deepseek-chat'),
    },
    gemini: {
      apiKey: geminiKey,
      model: geminiModel,
    },
    image: {
      apiKey: geminiKey,
      model: pickFirst(
        env,
        ['GOOGLE_IMAGE_MODEL', 'GOOGLE_GENAI_IMAGE_MODEL', 'GOOGLE_GENAI_MODEL', 'GEMINI_MODEL'],
        'gemini-3.1-flash-image-preview'
      ),
    },
    hotspot: {
      source: pickFirst(env, ['HOTSPOT_SOURCE'], 'auto'),
      googleSheetsCsvUrl: pickFirst(env, ['HOTSPOT_GOOGLE_SHEETS_CSV_URL', 'GOOGLE_SHEETS_CSV_URL'], ''),
      googleSheetId: pickFirst(env, ['HOTSPOT_GOOGLE_SHEET_ID', 'GOOGLE_SHEET_ID'], ''),
      googleSheetGid: pickFirst(env, ['HOTSPOT_GOOGLE_SHEET_GID', 'GOOGLE_SHEET_GID'], '0'),
      fetchTimeoutMs: toPositiveInt(
        pickFirst(env, ['HOTSPOT_FETCH_TIMEOUT_MS'], '8000'),
        8000
      ),
    },
  };
}

function pickFirst(env, keys, fallback = '') {
  for (const key of keys) {
    const value = env[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return fallback;
}

function toPort(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function toPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) return fallback;
  return parsed;
}

module.exports = {
  resolveRuntimeEnv,
};

