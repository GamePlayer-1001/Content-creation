/**
 * [INPUT]: 依赖任务 metadata、产物列表与输出文件路径字符串
 * [OUTPUT]: 导出执行器复用的命名、路径解析、Markdown 清洗、图片类型解析与 metadata 合并函数
 * [POS]: core/pipeline 的执行器辅助层，被 step-executor.js 复用以收口纯函数
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

function buildStepMetadataPatch(task, stageKey, {
  stageOutput,
  artifacts = [],
  metadataExtra = {},
  checkpointNote = '',
  source = 'cli-runner',
} = {}) {
  const now = new Date().toISOString();
  const metadata = task?.metadata && typeof task.metadata === 'object' ? task.metadata : {};

  const stageOutputs = {
    ...(metadata.stageOutputs || {}),
    [stageKey]: {
      at: now,
      ...(stageOutput || {}),
    },
  };

  const checkpoints = [
    ...(Array.isArray(metadata.checkpoints) ? metadata.checkpoints : []),
    {
      at: now,
      stage: stageKey,
      source,
      note: checkpointNote || '',
    },
  ].slice(-80);

  return {
    ...metadata,
    ...metadataExtra,
    stageOutputs,
    artifacts: mergeArtifacts(metadata.artifacts, artifacts, now),
    checkpoints,
    lastUpdatedBy: source,
    lastUpdatedAt: now,
  };
}

function mergeArtifacts(currentArtifacts, newArtifacts, now = new Date().toISOString()) {
  const existing = Array.isArray(currentArtifacts) ? currentArtifacts : [];
  const incoming = Array.isArray(newArtifacts) ? newArtifacts : [];
  const map = new Map();

  for (const item of [...existing, ...incoming]) {
    if (!item || !item.path) continue;
    const normalized = {
      at: item.at || now,
      ...item,
    };
    const key = `${normalized.stage || '-'}|${normalized.type || '-'}|${normalized.path}`;
    map.set(key, normalized);
  }
  return Array.from(map.values()).slice(-200);
}

function mergeImageAssets(currentAssets, newAssets) {
  const current = Array.isArray(currentAssets) ? currentAssets : [];
  const incoming = Array.isArray(newAssets) ? newAssets : [];
  const map = new Map();
  for (const item of [...current, ...incoming]) {
    if (!item || !item.path) continue;
    const key = `${item.platform || '-'}|${item.imageType || '-'}|${item.path}`;
    map.set(key, item);
  }
  return Array.from(map.values()).slice(-300);
}

function todayTag() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}

function safeFileName(text, maxLen = 20) {
  const safe = String(text || '')
    .replace(/[<>:"/\\|?*\n\r#]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, maxLen)
    .trim();
  return safe || 'untitled';
}

function parseOutputPath(file) {
  const parts = String(file || '').split('/').filter(Boolean);
  if (parts.length < 2) {
    throw new Error(`文件路径无效: ${file}`);
  }
  return {
    platform: parts[0],
    filename: parts.slice(1).join('/'),
  };
}

function stripMarkdown(text) {
  return String(text || '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`{1,3}([\s\S]*?)`{1,3}/g, '$1')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/^---+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseImageTypes(imageType) {
  const raw = (imageType || '').trim().toLowerCase();
  if (!raw || raw === 'illustration') return ['illustration'];
  if (raw === 'cover') return ['cover'];
  if (raw === 'both') return ['cover', 'illustration'];
  throw new Error(`不支持的 imageType: ${imageType}（可选: cover|illustration|both）`);
}

function toStringList(input) {
  if (Array.isArray(input)) {
    return input.map((x) => String(x || '').trim()).filter(Boolean);
  }
  const raw = String(input || '').trim();
  if (!raw) return [];
  return raw
    .split(/[,\uFF0C;\n]/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

module.exports = {
  buildStepMetadataPatch,
  mergeArtifacts,
  mergeImageAssets,
  todayTag,
  safeFileName,
  parseOutputPath,
  stripMarkdown,
  parseImageTypes,
  toStringList,
};
