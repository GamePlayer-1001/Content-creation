/**
 * [INPUT]: 依赖 aiAdapter + skillLoader + outputManager + complianceEngine
 * [OUTPUT]: GET /api/pipeline/stages + hotspots/platforms + task API + draft/platforms/optimize/compose/assemble
 * [POS]: routes/ 的内容流水线 API, 5步向导核心后端（含热点阶段与排版导出）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();
const path = require('path');
const {
  CREATION_STYLES,
  PLATFORM_CATALOG,
  resolvePlatformSkillName,
  listCreationStyles,
} = require('../../core/pipeline/catalog');
const { composeLayoutMarkdown } = require('../../core/pipeline/layout-composer');

// ============================================================
//  动态并发信号量 — 2并发起步, 4任务完成后升至4并发
// ============================================================
function createDynamicLimiter(initial, max, rampAfter) {
  let running = 0, completed = 0, concurrency = initial;
  const queue = [];

  function drain() {
    if (completed >= rampAfter) concurrency = max;
    while (running < concurrency && queue.length) {
      running++;
      const { fn, resolve, reject } = queue.shift();
      fn().then(resolve, reject).finally(() => {
        running--;
        completed++;
        drain();
      });
    }
  }

  return (fn) => new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject });
    drain();
  });
}


// ============================================================
//  共享阶段定义与任务状态 API（WebApp/CLI 共用）
// ============================================================
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

router.post('/tasks/:taskId/hotspot-select', (req, res) => {
  const stepExecutor = req.app.locals.pipelineStepExecutor;
  if (!stepExecutor) return res.status(500).json({ error: 'pipelineStepExecutor 未初始化' });

  try {
    const hotspotId = String(req.body?.hotspotId || '').trim();
    const note = String(req.body?.note || '').trim();
    const result = stepExecutor.runStep(req.params.taskId, {
      stage: 'hotspot-select',
      hotspotId,
      confirm: _toBoolean(req.body?.confirm, false),
      note: note || '热点选择完成',
    });
    Promise.resolve(result)
      .then((data) => {
        res.json({
          ...(data.output || {}),
          task: data.task,
          advanced: data.advanced,
          requiresConfirmation: data.requiresConfirmation,
          message: data.message || null,
        });
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/tasks/:taskId/hotspot-enrich', (req, res) => {
  const stepExecutor = req.app.locals.pipelineStepExecutor;
  if (!stepExecutor) return res.status(500).json({ error: 'pipelineStepExecutor 未初始化' });

  try {
    const note = String(req.body?.note || '').trim();
    const result = stepExecutor.runStep(req.params.taskId, {
      stage: 'hotspot-enrich',
      enrichment: String(req.body?.enrichment || '').trim(),
      input: String(req.body?.input || '').trim(),
      facts: _normalizeList(req.body?.facts),
      constraints: _normalizeList(req.body?.constraints),
      materials: _normalizeList(req.body?.materials),
      confirm: _toBoolean(req.body?.confirm, false),
      note: note || '热点补充信息已录入',
    });
    Promise.resolve(result)
      .then((data) => {
        res.json({
          hotspotEnrichment: data.output || {},
          task: data.task,
          advanced: data.advanced,
          requiresConfirmation: data.requiresConfirmation,
          message: data.message || null,
        });
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
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

// ============================================================
//  获取创作方向列表
// ============================================================
router.get('/styles', (req, res) => {
  res.json(listCreationStyles().map((item) => ({
    key: item.key,
    label: item.label,
    desc: item.desc || item.thinking || '',
  })));
});

// ============================================================
//  Step 2: 生成母稿 (SSE)
// ============================================================
router.post('/draft', async (req, res) => {
  const { input, style, engine = 'claude', taskId = null } = req.body;
  const { aiAdapter, skillLoader, outputManager } = req.app.locals;

  const inputPreview = (input || '').replace(/\s+/g, ' ').slice(0, 60);
  console.log(`  ${_ts()}  [流水线] Step2 生成母稿  方向=${style || '默认'}  引擎=${engine}  输入="${inputPreview}..."`);

  _sseHeaders(res);

  try {
    if (!input || !input.trim()) {
      console.log(`  ${_ts()}  [流水线] ✗ 输入为空，中止`);
      _send(res, { type: 'error', message: '请输入素材内容' });
      return res.end();
    }

    const styleConfig = CREATION_STYLES[style];
    const stylePrefix = styleConfig
      ? `\n\n【创作方向】${styleConfig.label}\n${styleConfig.prompt}\n\n`
      : '';

    // 构建 prompt: 母稿 Skill + 创作方向 + 用户输入
    _send(res, { type: 'status', message: `创作方向: ${styleConfig?.label || '默认'} · 构建 Prompt...` });

    const prompt = skillLoader.buildPrompt('母稿', {
      topic: stylePrefix + input,
      draftContent: '',
    });
    console.log(`  ${_ts()}  [流水线] Prompt 构建完成  总长=${prompt.length}字`);

    _send(res, { type: 'status', message: `AI 引擎: ${engine} · 开始生成母稿...` });

    let fullContent = '';
    for await (const chunk of aiAdapter.stream(prompt, engine)) {
      fullContent += chunk;
      _send(res, { type: 'chunk', content: chunk });
    }

    // 自动保存
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const safeTopic = input.slice(0, 20).replace(/[<>:"/\\|?*\n\r]/g, '_');
    const filename = `${today}-${safeTopic}.md`;
    outputManager.writeFile('母稿', filename, fullContent);
    const draftFile = `母稿/${filename}`;
    const taskProgress = _advanceTask(req, taskId, 'draft-generate', {
      note: 'WebApp Step2 母稿生成完成',
      metadataPatch: _buildTaskMetadataPatch(req, taskId, 'draft-generate', {
        checkpointNote: 'WebApp Step2 母稿生成完成',
        stageOutput: {
          file: draftFile,
          length: fullContent.length,
          engine,
          style: style || '',
          inputPreview: input.slice(0, 100),
        },
        artifacts: [
          {
            type: 'text',
            stage: 'draft-generate',
            path: draftFile,
          },
        ],
        metadataExtra: {
        inputSnapshot: input,
        style: style || '',
        engine,
        draftFile,
        },
      }),
    });

    console.log(`  ${_ts()}  [流水线] ✓ 母稿已保存  文件=母稿/${filename}  长度=${fullContent.length}字`);
    _send(res, {
      type: 'done',
      file: draftFile,
      length: fullContent.length,
      task: taskProgress?.task || null,
      taskProgressError: taskProgress?.error || null,
    });
  } catch (e) {
    console.error(`  ${_ts()}  [流水线] ✗ 母稿生成失败: ${e.message}`);
    _send(res, { type: 'error', message: e.message });
  }
  res.end();
});

// ============================================================
//  Step 3: 多平台生成 (SSE)
// ============================================================
router.post('/platforms', async (req, res) => {
  const { draftContent, platforms, engine = 'claude', taskId = null } = req.body;
  const { aiAdapter, skillLoader, outputManager } = req.app.locals;

  const platformList = platforms?.join(',') || '全部';
  console.log(`  ${_ts()}  [流水线] Step3 多平台生成  平台=[${platformList}]  引擎=${engine}  母稿=${(draftContent||'').length}字`);

  _sseHeaders(res);

  try {
    if (!draftContent) {
      console.log(`  ${_ts()}  [流水线] ✗ 母稿内容为空`);
      _send(res, { type: 'error', message: '缺少母稿内容' });
      return res.end();
    }

    const allowed = Array.isArray(platforms) && platforms.length > 0
      ? new Set(platforms.map((name) => resolvePlatformSkillName(name)).filter(Boolean))
      : null;
    const targetPlatforms = allowed
      ? PLATFORM_CATALOG.filter((p) => allowed.has(p.skill))
      : PLATFORM_CATALOG;

    _send(res, { type: 'status', message: `开始生成 ${targetPlatforms.length} 个平台 (并发2→4)...`, total: targetPlatforms.length });

    const limiter = createDynamicLimiter(2, 4, 4);
    const settled = await Promise.allSettled(
      targetPlatforms.map((p, i) => limiter(async () => {
        console.log(`  ${_ts()}  [流水线] → 平台 ${i+1}/${targetPlatforms.length}: ${p.skill}`);
        _send(res, { type: 'platform_start', platform: p.skill, index: i });

        const prompt = skillLoader.buildPrompt(p.skill, { topic: '', draftContent });

        let fullContent = '';
        for await (const chunk of aiAdapter.stream(prompt, engine)) {
          fullContent += chunk;
          _send(res, { type: 'chunk', platform: p.skill, content: chunk });
        }

        const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const safeTopic = draftContent.slice(0, 15).replace(/[<>:"/\\|?*\n\r#]/g, '_');
        const filename = `${today}-${safeTopic}.md`;
        outputManager.writeFile(p.dir, filename, fullContent);

        console.log(`  ${_ts()}  [流水线] ✓ ${p.skill} 完成  输出=${fullContent.length}字  文件=${p.dir}/${filename}`);
        _send(res, { type: 'platform_done', platform: p.skill, file: `${p.dir}/${filename}`, length: fullContent.length, content: fullContent });
        return { platform: p.skill, dir: p.dir, file: `${p.dir}/${filename}`, content: fullContent, length: fullContent.length };
      }))
    );

    const results = settled.map((r, i) => {
      if (r.status === 'fulfilled') return r.value;
      const p = targetPlatforms[i];
      console.error(`  ${_ts()}  [流水线] ✗ ${p.skill} 失败: ${r.reason?.message}`);
      _send(res, { type: 'platform_error', platform: p.skill, message: r.reason?.message });
      return { platform: p.skill, error: r.reason?.message };
    });

    const ok = results.filter(r => !r.error).length;
    const platformFiles = {};
    for (const item of results) {
      if (!item.error && item.platform && item.file) {
        platformFiles[item.platform] = item.file;
      }
    }
    const taskProgress = _advanceTask(req, taskId, 'platform-rewrite', {
      note: `WebApp Step3 多平台生成完成 (${ok}/${targetPlatforms.length})`,
      metadataPatch: _buildTaskMetadataPatch(req, taskId, 'platform-rewrite', {
        checkpointNote: `WebApp Step3 多平台生成完成 (${ok}/${targetPlatforms.length})`,
        stageOutput: {
          total: targetPlatforms.length,
          success: ok,
          engine,
          platformFiles,
        },
        artifacts: results
          .filter((item) => !item.error && item.file)
          .map((item) => ({
            type: 'text',
            stage: 'platform-rewrite',
            platform: item.platform,
            path: item.file,
          })),
        metadataExtra: {
        engine,
        platformFiles,
        platformResults: results
          .filter((item) => !item.error && item.file)
          .map((item) => ({
            platform: item.platform,
            file: item.file,
            length: item.length || 0,
          })),
        },
      }),
    });
    console.log(`  ${_ts()}  [流水线] Step3 完成  成功=${ok}/${targetPlatforms.length}`);
    _send(res, {
      type: 'done',
      results,
      success: ok,
      total: targetPlatforms.length,
      task: taskProgress?.task || null,
      taskProgressError: taskProgress?.error || null,
    });
  } catch (e) {
    console.error(`  ${_ts()}  [流水线] ✗ 多平台生成整体失败: ${e.message}`);
    _send(res, { type: 'error', message: e.message });
  }
  res.end();
});

// ============================================================
//  Step 3b: 自循环优化 (SSE) — 合并入 Step 3 前端调用
// ============================================================
router.post('/optimize', async (req, res) => {
  const { contents, engine = 'claude', taskId = null } = req.body;
  // contents: [{ platform, content, file }]
  const { aiAdapter, skillLoader, outputManager, complianceEngine } = req.app.locals;

  console.log(`  ${_ts()}  [流水线] Step3b 优化去AI  待优化=${(contents||[]).length}篇  引擎=${engine}`);

  _sseHeaders(res);

  try {
    if (!contents || contents.length === 0) {
      console.log(`  ${_ts()}  [流水线] ✗ 待优化内容为空`);
      _send(res, { type: 'error', message: '缺少待优化内容' });
      return res.end();
    }

    const limiter = createDynamicLimiter(2, 4, 4);
    const settled = await Promise.allSettled(
      contents.map((item, i) => limiter(async () => {
        console.log(`  ${_ts()}  [流水线] → 优化 ${i+1}/${contents.length}: ${item.platform}  原文=${item.content?.length || 0}字`);
        _send(res, { type: 'optimize_start', platform: item.platform, index: i });

        // 合规检查
        const compliance = complianceEngine.check(item.content);
        console.log(`  ${_ts()}  [流水线]   合规检查: 得分=${compliance.score}  命中=${compliance.hits.length}项`);
        _send(res, { type: 'compliance_result', platform: item.platform, score: compliance.score, hits: compliance.hits.length });

        // 调用去AI优化
        const prompt = skillLoader.buildPrompt('优化去AI', {
          topic: item.platform,
          draftContent: item.content,
          contentLabel: '待优化的平台内容',
        });

        let optimized = '';
        for await (const chunk of aiAdapter.stream(prompt, engine)) {
          optimized += chunk;
          _send(res, { type: 'chunk', platform: item.platform, content: chunk });
        }

        // 覆盖保存
        if (item.file) {
          const parts = item.file.split('/');
          if (parts.length === 2) {
            outputManager.writeFile(parts[0], parts[1], optimized);
          }
        }

        console.log(`  ${_ts()}  [流水线] ✓ ${item.platform} 优化完成  输出=${optimized.length}字`);
        _send(res, { type: 'optimize_done', platform: item.platform, length: optimized.length, content: optimized });
        return {
          platform: item.platform,
          file: item.file || '',
          content: optimized,
          length: optimized.length,
          complianceScore: compliance.score,
        };
      }))
    );

    const results = settled.map((r, i) => {
      if (r.status === 'fulfilled') return r.value;
      const item = contents[i];
      console.error(`  ${_ts()}  [流水线] ✗ ${item.platform} 优化失败: ${r.reason?.message}`);
      _send(res, { type: 'optimize_error', platform: item.platform, message: r.reason?.message });
      return { platform: item.platform, error: r.reason?.message };
    });

    const ok = results.filter(r => !r.error).length;
    const optimizedPlatforms = results.filter(r => !r.error).map(r => r.platform);
    const taskProgress = _advanceTask(req, taskId, 'review-optimize', {
      confirm: true,
      note: `WebApp Step3b 优化完成 (${ok}/${results.length})`,
      metadataPatch: _buildTaskMetadataPatch(req, taskId, 'review-optimize', {
        checkpointNote: `WebApp Step3b 优化完成 (${ok}/${results.length})`,
        stageOutput: {
          total: results.length,
          success: ok,
          engine,
          optimizedPlatforms,
        },
        artifacts: results
          .filter((item) => !item.error && item.file)
          .map((item) => ({
            type: 'text',
            stage: 'review-optimize',
            platform: item.platform,
            path: item.file,
          })),
        metadataExtra: {
          optimizedPlatforms,
        },
      }),
    });
    console.log(`  ${_ts()}  [流水线] Step3b 优化完成`);
    _send(res, {
      type: 'done',
      results,
      task: taskProgress?.task || null,
      taskProgressError: taskProgress?.error || null,
    });
  } catch (e) {
    console.error(`  ${_ts()}  [流水线] ✗ 优化整体失败: ${e.message}`);
    _send(res, { type: 'error', message: e.message });
  }
  res.end();
});

// ============================================================
//  Step 4: 双轨智能提炼 (封面文字 + 配图视觉隐喻)
// ============================================================
router.post('/extract', async (req, res) => {
  const { draftContent, platforms, engine = 'claude' } = req.body;
  const { aiAdapter } = req.app.locals;

  console.log(`  ${_ts()}  [流水线] Step4 双轨提炼  平台=${(platforms||[]).join(',')}  引擎=${engine}`);

  if (!draftContent) {
    return res.status(400).json({ error: '缺少母稿内容' });
  }

  const targetPlatforms = platforms && platforms.length > 0 ? platforms : ['通用'];

  // 示例 JSON 结构 (引导 AI 返回格式)
  const exampleJson = Object.fromEntries(targetPlatforms.map(p => [p, {
    cover: { title: '标题金句', subtitle: '核心观点一句话' },
    illustration: '精准视觉隐喻描述...',
  }]));

  try {
    const prompt = `你是视觉创意总监，擅长将文字转化为精准的视觉隐喻。请从以下文章中，为每个平台提取两种图片描述：

## 任务

### 1. 封面 (cover) — 用于AI生成带文字的海报封面
提取：
- title: 文章标题或核心金句（≤20字中文 / ≤60字符英文，适合叠加在图上）
- subtitle: 1句话核心观点（≤30字中文 / ≤100字符英文，作为副标题）

### 2. 配图 (illustration) — 纯视觉隐喻，无文字
要求：
- 必须是具体的视觉隐喻场景，不是泛泛的"氛围描述"
- 用物理世界的具象事物来隐喻文章核心冲突/观点
- 描述光线、材质、构图、色调（禁止蓝紫荧光色）
- 100-150字中文描述
- 国际平台（Medium/Quora/X/Reddit）用英文描述

### 反面示例（太泛，禁止）：
"一个关于AI和效率的科技感场景"
"蓝色背景上的数字化图案"

### 正面示例（精准视觉隐喻）：
"一台老式打字机的键盘上长出了发光的蘑菇群落，金色的孢子飘散在温暖的侧光中，背景是堆叠的旧稿纸，暗示旧工具正在被新生命力接管"

目标平台: ${targetPlatforms.join(', ')}

请严格按以下JSON格式返回（不要有任何其他文字）:
${JSON.stringify(exampleJson)}

---
文章内容:

${draftContent.slice(0, 3000)}`;

    const raw = await aiAdapter.generate(prompt, engine);

    // 容错解析: 提取 JSON 部分
    let extractions = {};
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractions = JSON.parse(jsonMatch[0]);
      }
    } catch (parseErr) {
      console.error(`  ${_ts()}  [流水线] ✗ JSON 解析失败, 回退为母稿摘要`);
      targetPlatforms.forEach(p => {
        extractions[p] = {
          cover: { title: draftContent.slice(0, 20), subtitle: draftContent.slice(20, 50) },
          illustration: draftContent.slice(0, 300),
        };
      });
    }

    console.log(`  ${_ts()}  [流水线] ✓ 双轨提炼完成  ${Object.keys(extractions).length} 个平台`);
    res.json({ extractions });
  } catch (e) {
    console.error(`  ${_ts()}  [流水线] ✗ 双轨提炼失败: ${e.message}`);
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
//  Step 4.5: 排版（布局稿）
// ============================================================
router.post('/compose', async (req, res) => {
  const { contents = [], images = [], taskId = null } = req.body || {};
  const { outputManager } = req.app.locals;

  try {
    const composeItems = Array.isArray(contents) ? contents : [];
    if (composeItems.length === 0) {
      return res.status(400).json({ error: 'compose 需要 contents' });
    }

    const now = new Date().toISOString();
    const today = now.slice(0, 10).replace(/-/g, '');
    const results = [];

    for (const item of composeItems) {
      const platform = String(item?.platform || '').trim();
      if (!platform) continue;
      const platformSkill = resolvePlatformSkillName(platform) || platform;
      const outputDir = _resolvePlatformOutputDir(platform, item?.file || '');

      const sourceContent = String(item?.content || '');
      const relatedImages = (Array.isArray(images) ? images : []).filter((img) => {
        const imgSkill = resolvePlatformSkillName(img?.platform || '') || String(img?.platform || '').trim();
        return imgSkill === platformSkill;
      });
      const markdown = composeLayoutMarkdown({
        platform: platformSkill,
        sourceFile: item?.file || '',
        sourceContent,
        images: relatedImages,
      });

      const filename = `${today}-layout-${_safeFileName(platformSkill, 24)}.md`;
      outputManager.writeFile(outputDir, filename, markdown);
      results.push({
        platform: platformSkill,
        file: `${outputDir}/${filename}`,
        length: markdown.length,
        imageCount: relatedImages.length,
      });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'compose 未生成任何排版文件' });
    }

    const taskProgress = _advanceTask(req, taskId, 'layout-compose', {
      confirm: true,
      note: `WebApp 排版完成 (${results.length} 个平台)`,
      metadataPatch: _buildTaskMetadataPatch(req, taskId, 'layout-compose', {
        checkpointNote: `WebApp 排版完成 (${results.length} 个平台)`,
        stageOutput: {
          total: results.length,
          files: results.map((r) => r.file),
        },
        artifacts: results.map((item) => ({
          type: 'layout-markdown',
          stage: 'layout-compose',
          platform: item.platform,
          path: item.file,
        })),
        metadataExtra: {
          layoutResults: results.map((item) => ({
            platform: item.platform,
            file: item.file,
            length: item.length || 0,
            imageCount: item.imageCount || 0,
          })),
          layoutFiles: results.map((r) => r.file),
        },
      }),
    });

    res.json({
      results,
      task: taskProgress?.task || null,
      taskProgressError: taskProgress?.error || null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================================
//  Step 5: 组装最终文件
// ============================================================
router.post('/assemble', async (req, res) => {
  const { contents, images, layoutFiles = [], taskId = null } = req.body;
  // contents: [{ platform, content, file }]
  // images: [{ platform, path }]
  const { outputManager } = req.app.locals;
  const projectRoot = req.app.locals.projectRoot;

  console.log(`  ${_ts()}  [流水线] Step5 组装最终文件  内容=${(contents||[]).length}篇  图片=${(images||[]).length}张`);

  try {
    const results = [];
    for (const item of contents) {
      const platformRaw = String(item?.platform || '').trim();
      const platformSkill = resolvePlatformSkillName(platformRaw) || platformRaw;
      const dir = _resolvePlatformOutputDir(platformRaw, item?.file || '');
      // 移除 markdown 特殊符号
      let clean = _stripMarkdown(item.content);

      // 如果有对应图片, 在末尾追加图片路径
      const relatedImages = (images || []).filter((img) => {
        const imgSkill = resolvePlatformSkillName(img?.platform || '') || String(img?.platform || '').trim();
        return imgSkill === platformSkill;
      });
      if (relatedImages.length > 0) {
        clean += '\n\n---\n配图:\n';
        relatedImages.forEach((img, idx) => {
          const typeLabel = img.imageType === 'cover' ? '封面' : '配图';
          clean += `${idx + 1}. [${typeLabel}] ${img.path}\n`;
        });
      }

      // 保存最终文件
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const filename = `${today}-final-${_safeFileName(platformSkill || dir, 24)}.txt`;
      outputManager.writeFile(dir, filename, clean);

      // 构建 Obsidian URI
      const vaultName = path.basename(projectRoot);
      const obsidianFile = `output/${dir}/${filename}`;
      const obsidianUri = `obsidian://open?vault=${encodeURIComponent(vaultName)}&file=${encodeURIComponent(obsidianFile)}`;

      results.push({
        platform: platformSkill,
        file: `${dir}/${filename}`,
        obsidianUri,
        length: clean.length,
      });
    }

    const taskProgress = _advanceTask(req, taskId, 'export-output', {
      note: `WebApp Step5 导出完成 (${results.length} 个文件)`,
      metadataPatch: _buildTaskMetadataPatch(req, taskId, 'export-output', {
        checkpointNote: `WebApp Step5 导出完成 (${results.length} 个文件)`,
        stageOutput: {
          total: results.length,
          files: results.map((r) => r.file),
        },
        artifacts: results.map((item) => ({
          type: 'final-text',
          stage: 'export-output',
          platform: item.platform,
          path: item.file,
        })),
        metadataExtra: {
          layoutFiles: Array.isArray(layoutFiles) ? layoutFiles : [],
          finalFiles: results.map(r => r.file),
          finalResults: results.map((item) => ({
            platform: item.platform,
            file: item.file,
            obsidianUri: item.obsidianUri,
            length: item.length || 0,
          })),
        },
      }),
    });
    console.log(`  ${_ts()}  [流水线] ✓ Step5 组装完成  文件=${results.map(r => r.file).join(', ')}`);
    res.json({
      results,
      task: taskProgress?.task || null,
      taskProgressError: taskProgress?.error || null,
    });
  } catch (e) {
    console.error(`  ${_ts()}  [流水线] ✗ 组装失败: ${e.message}`);
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
//  工具函数
// ============================================================
function _ts() {
  return new Date().toLocaleTimeString('zh-CN', { hour12: false });
}

function _stripMarkdown(text) {
  return text
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

function _normalizeList(input) {
  if (Array.isArray(input)) {
    return input.map((x) => String(x || '').trim()).filter(Boolean);
  }
  const text = String(input || '').trim();
  if (!text) return [];
  return text
    .split(/[,\uFF0C;\n]/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

function _safeFileName(text, maxLen = 24) {
  const safe = String(text || '')
    .replace(/[<>:"/\\|?*\n\r#]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, maxLen)
    .trim();
  return safe || 'untitled';
}

function _resolvePlatformOutputDir(platform, sourceFile = '') {
  const parsed = _parseOutputPath(sourceFile);
  if (parsed) return parsed.platform;

  const skillName = resolvePlatformSkillName(platform) || String(platform || '').trim();
  if (!skillName) return 'drafts';

  const found = PLATFORM_CATALOG.find((item) => item.skill === skillName);
  return found?.dir || skillName;
}

function _parseOutputPath(file) {
  const raw = String(file || '').trim();
  if (!raw.includes('/')) return null;

  const parts = raw.split('/').filter(Boolean);
  if (parts.length < 2) return null;
  return {
    platform: parts[0],
    filename: parts.slice(1).join('/'),
  };
}

function _buildStepRunOptions(body = {}) {
  return {
    engine: String(body.engine || 'claude').trim() || 'claude',
    query: String(body.query || '').trim(),
    limit: _toInt(body.limit, 20, 1, 200),
    source: String(body.source || 'auto').trim() || 'auto',
    hotspotId: String(body.hotspotId || '').trim(),
    enrichment: String(body.enrichment || '').trim(),
    facts: _normalizeList(body.facts),
    constraints: _normalizeList(body.constraints),
    materials: _normalizeList(body.materials),
    input: String(body.input || '').trim(),
    style: String(body.style || '').trim(),
    platforms: _normalizeList(body.platforms),
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
    confirm: _toBoolean(body.confirm, false),
  };
}

function _resolveExecutableStageRange(stageDefs, fromStage, toStage, { includeVisual = true } = {}) {
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

async function _runStageWithRetry(stepExecutor, taskId, stage, runOptions, retry) {
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

function _toBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false;
  }
  return fallback;
}

function _toInt(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  const upper = Number.isFinite(max) ? Math.min(parsed, max) : parsed;
  return Math.max(min, upper);
}

function _sseHeaders(res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
}

function _send(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function _buildTaskMetadataPatch(req, taskId, stageKey, {
  metadataExtra = {},
  stageOutput = null,
  artifacts = [],
  checkpointNote = '',
  source = 'webapp-pipeline-route',
} = {}) {
  const runner = req.app.locals.workflowRunner;
  const task = taskId && runner ? runner.getTask(taskId) : null;
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
  ].slice(-120);

  return {
    ...metadata,
    ...(metadataExtra && typeof metadataExtra === 'object' ? metadataExtra : {}),
    stageOutputs,
    artifacts: _mergeArtifacts(metadata.artifacts, artifacts, now),
    checkpoints,
    lastUpdatedBy: source,
    lastUpdatedAt: now,
  };
}

function _mergeArtifacts(currentArtifacts, newArtifacts, now) {
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

  return Array.from(map.values()).slice(-300);
}

function _saveRunRangeSnapshot(req, taskId, {
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

function _buildRewindMetadataPatch(req, taskId, toStage, note = '') {
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

function _advanceTask(req, taskId, toStage, { confirm = false, note = '', metadataPatch = null } = {}) {
  if (!taskId) return null;
  const runner = req.app.locals.workflowRunner;
  if (!runner) return null;
  try {
    return runner.advanceTask(taskId, { toStage, confirm, note, metadataPatch });
  } catch (error) {
    console.warn(`  ${_ts()}  [流水线] ⚠ 任务推进失败 taskId=${taskId} stage=${toStage}: ${error.message}`);
    return { error: error.message };
  }
}

module.exports = router;
