/**
 * [INPUT]: 依赖 shared pipeline runner/step-executor + outputManager
 * [OUTPUT]: GET/POST /api/pipeline 的任务、阶段、热点、平台与样式 API，并挂载 legacy pipeline 子路由
 * [POS]: routes/ 的内容流水线主入口，承接 Web 端任务编排并将兼容接口委托给 legacy 子路由
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();
const {
  PLATFORM_CATALOG,
  resolvePlatformSkillName,
  listCreationStyles,
} = require('../../core/pipeline/catalog');
const {
  ts: _ts,
  normalizeList: _normalizeList,
  buildStepRunOptions: _buildStepRunOptions,
  resolveExecutableStageRange: _resolveExecutableStageRange,
  runStageWithRetry: _runStageWithRetry,
  toBoolean: _toBoolean,
  toInt: _toInt,
  applySseHeaders: _sseHeaders,
  sendSse: _send,
  saveRunRangeSnapshot: _saveRunRangeSnapshot,
  buildRewindMetadataPatch: _buildRewindMetadataPatch,
  requireTaskId: _requireTaskId,
  readOutputText: _readOutputText,
  persistEditableContents: _persistEditableContents,
  resolveTargetPlatforms: _resolveTargetPlatforms,
} = require('./pipeline-route-support');
const legacyRouter = require('./pipeline-legacy-routes');

router.get('/stages', (req, res) => {
  const stages = req.app.locals.pipelineStages || [];
  res.json(stages);
});

router.get('/tasks', (req, res) => {
  const runner = req.app.locals.workflowRunner;
  if (!runner) return res.status(500).json({ error: 'workflowRunner 未初始化' });

  const limit = Number.parseInt(req.query.limit, 10);
  const tasks = runner.listTasks(Number.isNaN(limit) ? 20 : limit);
  res.json({ tasks });
});

router.post('/tasks', (req, res) => {
  const runner = req.app.locals.workflowRunner;
  if (!runner) return res.status(500).json({ error: 'workflowRunner 未初始化' });

  const { title = '', source = 'manual', metadata = {} } = req.body || {};
  const result = runner.createTask({ title, source, metadata });
  res.status(201).json(result);
});

router.get('/tasks/:taskId', (req, res) => {
  const runner = req.app.locals.workflowRunner;
  if (!runner) return res.status(500).json({ error: 'workflowRunner 未初始化' });

  const task = runner.getTask(req.params.taskId);
  if (!task) return res.status(404).json({ error: `任务不存在: ${req.params.taskId}` });
  res.json({ task });
});

router.post('/tasks/:taskId/advance', (req, res) => {
  const runner = req.app.locals.workflowRunner;
  if (!runner) return res.status(500).json({ error: 'workflowRunner 未初始化' });

  try {
    const { toStage, confirm = false, note = '', metadataPatch = null } = req.body || {};
    if (!toStage) {
      return res.status(400).json({ error: '缺少参数: toStage' });
    }
    const result = runner.advanceTask(req.params.taskId, { toStage, confirm, note, metadataPatch });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/tasks/:taskId/rewind', (req, res) => {
  const runner = req.app.locals.workflowRunner;
  if (!runner) return res.status(500).json({ error: 'workflowRunner 未初始化' });

  try {
    const { toStage, note = '' } = req.body || {};
    if (!toStage) {
      return res.status(400).json({ error: '缺少参数: toStage' });
    }
    const metadataPatch = _buildRewindMetadataPatch(req, req.params.taskId, toStage, note);
    const result = runner.rewindTask(req.params.taskId, { toStage, note, metadataPatch });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/tasks/:taskId/run-step', async (req, res) => {
  const stepExecutor = req.app.locals.pipelineStepExecutor;
  if (!stepExecutor) return res.status(500).json({ error: 'pipelineStepExecutor 未初始化' });

  const taskId = req.params.taskId;
  const stage = String(req.body?.stage || req.body?.toStage || '').trim();
  if (!stage) {
    return res.status(400).json({ error: '缺少参数: stage（或 toStage）' });
  }

  try {
    const runOptions = _buildStepRunOptions(req.body || {});
    const result = await stepExecutor.runStep(taskId, {
      stage,
      ...runOptions,
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/tasks/:taskId/run-range', async (req, res) => {
  const stepExecutor = req.app.locals.pipelineStepExecutor;
  const runner = req.app.locals.workflowRunner;
  const stageDefs = Array.isArray(req.app.locals.pipelineStages) ? req.app.locals.pipelineStages : [];
  if (!stepExecutor) return res.status(500).json({ error: 'pipelineStepExecutor 未初始化' });
  if (!runner) return res.status(500).json({ error: 'workflowRunner 未初始化' });

  const taskId = req.params.taskId;
  const task = runner.getTask(taskId);
  if (!task) return res.status(404).json({ error: `任务不存在: ${taskId}` });

  const fromStage = String(req.body?.fromStage || req.body?.from || '').trim();
  const toStage = String(req.body?.toStage || req.body?.to || '').trim();
  if (!fromStage || !toStage) {
    return res.status(400).json({ error: '缺少参数: fromStage/toStage（或 from/to）' });
  }

  try {
    const includeVisual = !!req.app.locals.imageGenerator;
    const stageList = _resolveExecutableStageRange(stageDefs, fromStage, toStage, { includeVisual });
    const onError = String(req.body?.onError || 'stop').trim().toLowerCase() === 'skip' ? 'skip' : 'stop';
    const retry = _toInt(req.body?.retry, 0, 0, 5);
    const runOptions = _buildStepRunOptions(req.body || {});
    const startedAt = new Date().toISOString();

    const results = [];
    let stopped = false;
    let stopReason = '';
    for (const stage of stageList) {
      const stageResult = await _runStageWithRetry(stepExecutor, taskId, stage, runOptions, retry);
      results.push(stageResult);
      if (stageResult.requiresConfirmation) {
        stopped = true;
        stopReason = `阶段待确认: ${stage}`;
        break;
      }
      if (!stageResult.ok && onError === 'stop') {
        stopped = true;
        stopReason = stageResult.error || `阶段失败: ${stage}`;
        break;
      }
    }

    const failedStages = results.filter((item) => !item.ok).map((item) => item.stage);
    const finishedAt = new Date().toISOString();
    const latestTask = runner.getTask(taskId);
    const pendingConfirmationStage = latestTask?.pendingConfirmationStage || null;
    const executedStages = results.map((item) => item.stage);
    const resumeFromStage = failedStages[0] || null;
    _saveRunRangeSnapshot(req, taskId, {
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
    });
    const snapshotTask = runner.getTask(taskId);

    res.json({
      taskId,
      fromStage,
      toStage,
      onError,
      retry,
      startedAt,
      finishedAt,
      executedStages,
      failedStages,
      pendingConfirmationStage,
      resumeFromStage,
      stopped,
      stopReason,
      results,
      task: snapshotTask,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/hotspots', async (req, res) => {
  const hotspotService = req.app.locals.hotspotService;
  if (!hotspotService) return res.status(500).json({ error: 'hotspotService 未初始化' });

  try {
    const query = String(req.query.query || '');
    const limit = Number.parseInt(req.query.limit, 10);
    const source = String(req.query.source || 'auto');
    const result = await hotspotService.listHotspots({
      query,
      limit: Number.isNaN(limit) ? 20 : limit,
      source,
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/tasks/:taskId/hotspot-list', async (req, res) => {
  const stepExecutor = req.app.locals.pipelineStepExecutor;
  if (!stepExecutor) return res.status(500).json({ error: 'pipelineStepExecutor 未初始化' });

  try {
    const query = String(req.body?.query || '');
    const limit = Number.parseInt(req.body?.limit, 10);
    const source = String(req.body?.source || 'auto');
    const note = String(req.body?.note || '');
    const result = await stepExecutor.runStep(req.params.taskId, {
      stage: 'hotspot-list',
      query,
      limit: Number.isNaN(limit) ? 20 : limit,
      source,
      note: note || 'WebApp 热点列表同步',
    });

    res.json({
      ...(result.output || {}),
      task: result.task,
      advanced: result.advanced,
      requiresConfirmation: result.requiresConfirmation,
      message: result.message || null,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/tasks/:taskId/hotspot-select', async (req, res) => {
  const stepExecutor = req.app.locals.pipelineStepExecutor;
  if (!stepExecutor) return res.status(500).json({ error: 'pipelineStepExecutor 未初始化' });

  try {
    const hotspotId = String(req.body?.hotspotId || '').trim();
    const note = String(req.body?.note || '').trim();
    const result = await stepExecutor.runStep(req.params.taskId, {
      stage: 'hotspot-select',
      hotspotId,
      confirm: _toBoolean(req.body?.confirm, false),
      note: note || '热点选择完成',
    });

    res.json({
      ...(result.output || {}),
      task: result.task,
      advanced: result.advanced,
      requiresConfirmation: result.requiresConfirmation,
      message: result.message || null,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/tasks/:taskId/hotspot-enrich', async (req, res) => {
  const stepExecutor = req.app.locals.pipelineStepExecutor;
  if (!stepExecutor) return res.status(500).json({ error: 'pipelineStepExecutor 未初始化' });

  try {
    const note = String(req.body?.note || '').trim();
    const result = await stepExecutor.runStep(req.params.taskId, {
      stage: 'hotspot-enrich',
      enrichment: String(req.body?.enrichment || '').trim(),
      input: String(req.body?.input || '').trim(),
      facts: _normalizeList(req.body?.facts),
      constraints: _normalizeList(req.body?.constraints),
      materials: _normalizeList(req.body?.materials),
      confirm: _toBoolean(req.body?.confirm, false),
      note: note || '热点补充信息已录入',
    });

    res.json({
      hotspotEnrichment: result.output || {},
      task: result.task,
      advanced: result.advanced,
      requiresConfirmation: result.requiresConfirmation,
      message: result.message || null,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/platforms', (req, res) => {
  const { configManager } = req.app.locals;
  const enabledBySkill = new Map();
  try {
    const parsed = configManager.read('platforms.yaml');
    if (parsed && typeof parsed === 'object') {
      for (const [name, value] of Object.entries(parsed)) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
        const skillName = resolvePlatformSkillName(name);
        if (!skillName) continue;
        enabledBySkill.set(skillName, value.enabled !== false);
      }
    }
  } catch {}

  res.json(PLATFORM_CATALOG.map((item) => ({
    name: item.skill,
    value: item.skill,
    enabled: enabledBySkill.has(item.skill) ? enabledBySkill.get(item.skill) : true,
    group: item.group,
  })));
});

router.get('/styles', (_req, res) => {
  res.json(listCreationStyles().map((item) => ({
    key: item.key,
    label: item.label,
    desc: item.desc || item.thinking || '',
  })));
});

router.use(legacyRouter);

module.exports = router;
