/**
 * [INPUT]: 依赖 core/pipeline/catalog 的平台目录，依赖 Express req/app.locals 与 outputManager
 * [OUTPUT]: 导出 pipeline 路由复用的参数解析、legacy SSE 执行器、任务快照与输出文件辅助函数
 * [POS]: webapp/routes 的流水线辅助层，被 pipeline.js 复用以收口非协议逻辑
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const {
  PLATFORM_CATALOG,
  resolvePlatformSkillName,
} = require('../../core/pipeline/catalog');

function ts() {
  return new Date().toLocaleTimeString('zh-CN', { hour12: false });
}

function normalizeList(input) {
  if (Array.isArray(input)) {
    return input.map((value) => String(value || '').trim()).filter(Boolean);
  }
  const text = String(input || '').trim();
  if (!text) return [];
  return text
    .split(/[,\uFF0C;\n]/g)
    .map((value) => value.trim())
    .filter(Boolean);
}

function parseOutputPath(file) {
  const raw = String(file || '').trim();
  if (!raw.includes('/')) return null;

  const parts = raw.split('/').filter(Boolean);
  if (parts.length < 2) return null;
  return {
    platform: parts[0],
    filename: parts.slice(1).join('/'),
  };
}

function buildStepRunOptions(body = {}) {
  return {
    engine: String(body.engine || 'claude').trim() || 'claude',
    query: String(body.query || '').trim(),
    limit: toInt(body.limit, 20, 1, 200),
    source: String(body.source || 'auto').trim() || 'auto',
    hotspotId: String(body.hotspotId || '').trim(),
    enrichment: String(body.enrichment || '').trim(),
    facts: normalizeList(body.facts),
    constraints: normalizeList(body.constraints),
    materials: normalizeList(body.materials),
    input: String(body.input || '').trim(),
    style: String(body.style || '').trim(),
    platforms: normalizeList(body.platforms),
    draftFile: String(body.draftFile || '').trim(),
    draftContent: String(body.draftContent || ''),
    imagePrompt: String(body.imagePrompt || ''),
    stylePrompt: String(body.stylePrompt || ''),
    coverTitle: String(body.coverTitle || ''),
    coverSubtitle: String(body.coverSubtitle || ''),
    imageType: String(body.imageType || ''),
    aspectRatio: String(body.aspectRatio || ''),
    imageSize: String(body.imageSize || ''),
    note: String(body.note || ''),
    confirm: toBoolean(body.confirm, false),
  };
}

function resolveExecutableStageRange(stageDefs, fromStage, toStage, { includeVisual = true } = {}) {
  const list = (Array.isArray(stageDefs) ? stageDefs : [])
    .filter((stage) => stage && stage.key && stage.implemented)
    .filter((stage) => includeVisual || stage.key !== 'visual-generate');
  const fromDef = list.find((stage) => stage.key === fromStage);
  const toDef = list.find((stage) => stage.key === toStage);
  if (!fromDef || !toDef) {
    throw new Error(`阶段不存在或不可执行: ${fromStage} / ${toStage}`);
  }
  if (fromDef.order > toDef.order) {
    throw new Error(`阶段顺序非法: ${fromStage} 在 ${toStage} 之后`);
  }

  return list
    .filter((stage) => stage.order >= fromDef.order && stage.order <= toDef.order)
    .sort((a, b) => a.order - b.order)
    .map((stage) => stage.key);
}

async function runStageWithRetry(stepExecutor, taskId, stage, runOptions, retry) {
  let attempts = 0;
  let lastError = null;
  while (attempts <= retry) {
    attempts += 1;
    try {
      const result = await stepExecutor.runStep(taskId, {
        stage,
        ...runOptions,
      });
      return {
        stage,
        ok: true,
        attempts,
        requiresConfirmation: !!result?.requiresConfirmation,
        result,
      };
    } catch (error) {
      lastError = error;
    }
  }

  return {
    stage,
    ok: false,
    attempts,
    error: lastError?.message || '未知错误',
  };
}

function toBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false;
  }
  return fallback;
}

function toInt(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  const upper = Number.isFinite(max) ? Math.min(parsed, max) : parsed;
  return Math.max(min, upper);
}

function applySseHeaders(res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
}

function sendSse(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

async function runLegacySseStep(res, {
  validate = null,
  resolveTaskId = null,
  beforeRun = null,
  run = null,
  afterRun = null,
  errorLabel = '执行失败',
} = {}) {
  applySseHeaders(res);

  try {
    const validationError = typeof validate === 'function' ? await validate() : null;
    if (validationError) {
      sendSse(res, { type: 'error', message: validationError });
      return;
    }

    const taskId = typeof resolveTaskId === 'function' ? resolveTaskId() : '';
    if (typeof beforeRun === 'function') {
      await beforeRun(taskId);
    }

    if (typeof run !== 'function') {
      throw new Error('legacy SSE 路由缺少 run 执行器');
    }

    const result = await run(taskId);
    const donePayload = typeof afterRun === 'function' ? await afterRun(result, taskId) : {};
    sendSse(res, {
      type: 'done',
      ...(donePayload && typeof donePayload === 'object' ? donePayload : {}),
      task: result?.task || null,
      taskProgressError: null,
    });
  } catch (error) {
    console.error(`  ${ts()}  [流水线] ✗ ${errorLabel}: ${error.message}`);
    sendSse(res, { type: 'error', message: error.message });
  } finally {
    res.end();
  }
}

function saveRunRangeSnapshot(req, taskId, {
  fromStage,
  toStage,
  onError,
  retry,
  startedAt,
  finishedAt,
  executedStages,
  failedStages,
  resumeFromStage,
  pendingConfirmationStage,
  stopped,
  stopReason,
  results,
}) {
  const runner = req.app.locals.workflowRunner;
  if (!runner) return;
  const task = runner.getTask(taskId);
  if (!task) return;

  const metadata = task.metadata && typeof task.metadata === 'object' ? task.metadata : {};
  const sanitizedResults = Array.isArray(results)
    ? results.map((item) => ({
      stage: item.stage,
      ok: !!item.ok,
      attempts: item.attempts || 0,
      requiresConfirmation: !!item.requiresConfirmation,
      error: item.error || null,
    }))
    : [];

  const checkpoints = [
    ...(Array.isArray(metadata.checkpoints) ? metadata.checkpoints : []),
    {
      at: finishedAt,
      stage: failedStages[0] || pendingConfirmationStage || toStage,
      source: 'webapp-run-range',
      note: failedStages.length
        ? `run-range 完成(失败:${failedStages.join(',')})`
        : pendingConfirmationStage
          ? `run-range 停止(待确认:${pendingConfirmationStage})`
          : `run-range 完成(${fromStage} -> ${toStage})`,
    },
  ].slice(-120);

  const nextTask = {
    ...task,
    updatedAt: finishedAt,
    metadata: {
      ...metadata,
      runRange: {
        fromStage,
        toStage,
        onError,
        retry,
        startedAt,
        finishedAt,
        executedStages: Array.isArray(executedStages) ? executedStages : [],
        failedStages: Array.isArray(failedStages) ? failedStages : [],
        resumeFromStage: resumeFromStage || null,
        pendingConfirmationStage: pendingConfirmationStage || null,
        stopped: !!stopped,
        stopReason: stopReason || '',
        results: sanitizedResults,
      },
      checkpoints,
      lastUpdatedBy: 'webapp-run-range',
      lastUpdatedAt: finishedAt,
    },
  };

  runner.taskStateStore.saveTask(nextTask);
}

function buildRewindMetadataPatch(req, taskId, toStage, note = '') {
  const runner = req.app.locals.workflowRunner;
  const task = taskId && runner ? runner.getTask(taskId) : null;
  const now = new Date().toISOString();
  const metadata = task?.metadata && typeof task.metadata === 'object' ? task.metadata : {};
  const runRange = metadata.runRange && typeof metadata.runRange === 'object' ? metadata.runRange : {};
  const checkpoints = [
    ...(Array.isArray(metadata.checkpoints) ? metadata.checkpoints : []),
    {
      at: now,
      stage: toStage,
      source: 'webapp-rewind',
      note: note || `任务回退到 ${toStage}`,
    },
  ].slice(-120);

  return {
    ...metadata,
    runRange: {
      ...runRange,
      resumeFromStage: toStage,
      pendingConfirmationStage: null,
      stopped: false,
      stopReason: '',
    },
    checkpoints,
    lastUpdatedBy: 'webapp-rewind',
    lastUpdatedAt: now,
  };
}

function requireTaskId(taskId) {
  const normalized = String(taskId || '').trim();
  if (!normalized) {
    throw new Error('缺少参数: taskId');
  }
  return normalized;
}

function readOutputText(outputManager, file) {
  const parsed = parseOutputPath(file);
  if (!parsed) return '';
  return outputManager.readFile(parsed.platform, parsed.filename);
}

function hydrateTextResult(outputManager, item, extra = {}) {
  const file = String(item?.file || '').trim();
  const content = file ? readOutputText(outputManager, file) : '';
  return {
    ...extra,
    file,
    content,
    length: content.length || item?.length || 0,
  };
}

function writeOutputText(outputManager, file, content) {
  const parsed = parseOutputPath(file);
  if (!parsed) return;
  outputManager.writeFile(parsed.platform, parsed.filename, String(content || ''));
}

function persistEditableContents(outputManager, contents) {
  const list = Array.isArray(contents) ? contents : [];
  for (const item of list) {
    if (!item?.file || typeof item.content !== 'string') continue;
    writeOutputText(outputManager, item.file, item.content);
  }
}

function resolveTargetPlatforms(platforms) {
  const allow = new Set(
    normalizeList(platforms)
      .map((name) => resolvePlatformSkillName(name))
      .filter(Boolean)
  );
  if (allow.size === 0) return PLATFORM_CATALOG.slice();
  return PLATFORM_CATALOG.filter((item) => allow.has(item.skill));
}

module.exports = {
  ts,
  normalizeList,
  buildStepRunOptions,
  resolveExecutableStageRange,
  runStageWithRetry,
  toBoolean,
  toInt,
  applySseHeaders,
  sendSse,
  runLegacySseStep,
  saveRunRangeSnapshot,
  buildRewindMetadataPatch,
  requireTaskId,
  readOutputText,
  hydrateTextResult,
  writeOutputText,
  persistEditableContents,
  resolveTargetPlatforms,
};
