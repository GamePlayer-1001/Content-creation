/**
 * [INPUT]: 依赖 pipeline-route-support、shared step-executor 与 aiAdapter/outputManager
 * [OUTPUT]: 导出 legacy pipeline 路由（draft/platforms/optimize/extract/compose/assemble）
 * [POS]: webapp/routes 的流水线兼容层，承接旧前端工作流接口并桥接 shared pipeline
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();
const {
  ts: _ts,
  normalizeList: _normalizeList,
  toBoolean: _toBoolean,
  sendSse: _send,
  runLegacySseStep: _runLegacySseStep,
  requireTaskId: _requireTaskId,
  hydrateTextResult: _hydrateTextResult,
  persistEditableContents: _persistEditableContents,
  resolveTargetPlatforms: _resolveTargetPlatforms,
} = require('./pipeline-route-support');

router.post('/draft', async (req, res) => {
  const { input = '', style = '', engine = 'claude', taskId = '', promotionProduct = '' } = req.body || {};
  const stepExecutor = req.app.locals.pipelineStepExecutor;
  const { outputManager } = req.app.locals;

  const inputPreview = String(input || '').replace(/\s+/g, ' ').slice(0, 60);
  console.log(`  ${_ts()}  [流水线] Stage4 生成母稿  方向=${style || '默认'}  引擎=${engine}  输入="${inputPreview}..."`);

  await _runLegacySseStep(res, {
    validate: () => (String(input || '').trim() ? null : '请输入素材内容'),
    resolveTaskId: () => _requireTaskId(taskId),
    beforeRun: () => {
      _send(res, { type: 'status', message: `AI 引擎: ${engine} · 调用 shared pipeline 生成母稿...` });
    },
    run: (resolvedTaskId) => stepExecutor.runStep(resolvedTaskId, {
      stage: 'draft-generate',
      input: String(input || ''),
      style: String(style || ''),
      engine: String(engine || 'claude'),
      promotionProduct: String(promotionProduct || ''),
      note: 'WebApp legacy /pipeline/draft -> shared draft-generate',
    }),
    afterRun: (result) => {
      const payload = _hydrateTextResult(outputManager, {
        file: String(result?.output?.file || result?.task?.metadata?.draftFile || '').trim(),
        length: result?.output?.length || 0,
      });
      if (payload.content) {
        _send(res, { type: 'chunk', content: payload.content });
      }
      return payload;
    },
    errorLabel: '母稿生成失败',
  });
});

router.post('/platforms', async (req, res) => {
  const { draftContent = '', platforms = [], engine = 'claude', taskId = '' } = req.body || {};
  const stepExecutor = req.app.locals.pipelineStepExecutor;
  const { outputManager } = req.app.locals;

  const targetPlatforms = _resolveTargetPlatforms(platforms);
  console.log(`  ${_ts()}  [流水线] Stage5 多平台生成  平台=[${targetPlatforms.map((item) => item.skill).join(',') || '全部'}]  引擎=${engine}`);

  await _runLegacySseStep(res, {
    validate: () => (String(draftContent || '').trim() ? null : '缺少母稿内容'),
    resolveTaskId: () => _requireTaskId(taskId),
    beforeRun: () => {
      _send(res, {
        type: 'status',
        message: `开始生成 ${targetPlatforms.length} 个平台（shared pipeline）...`,
        total: targetPlatforms.length,
      });
    },
    run: (resolvedTaskId) => stepExecutor.runStep(resolvedTaskId, {
      stage: 'platform-rewrite',
      draftContent: String(draftContent || ''),
      platforms: _normalizeList(platforms),
      engine: String(engine || 'claude'),
      note: 'WebApp legacy /pipeline/platforms -> shared platform-rewrite',
    }),
    afterRun: (result) => {
      const stageResults = Array.isArray(result?.output?.results) ? result.output.results : [];
      const results = stageResults.map((item, index) => {
        const payload = _hydrateTextResult(outputManager, item, { platform: item.platform });
        _send(res, { type: 'platform_start', platform: item.platform, index });
        _send(res, {
          type: 'platform_done',
          ...payload,
        });
        return payload;
      });

      return {
        results,
        success: results.length,
        total: targetPlatforms.length,
      };
    },
    errorLabel: '多平台生成整体失败',
  });
});

router.post('/optimize', async (req, res) => {
  const { contents = [], engine = 'claude', taskId = '' } = req.body || {};
  const stepExecutor = req.app.locals.pipelineStepExecutor;
  const { outputManager } = req.app.locals;

  console.log(`  ${_ts()}  [流水线] Stage6 优化去AI  待优化=${contents.length}篇  引擎=${engine}`);

  await _runLegacySseStep(res, {
    validate: () => (Array.isArray(contents) && contents.length > 0 ? null : '缺少待优化内容'),
    resolveTaskId: () => _requireTaskId(taskId),
    beforeRun: () => {
      _persistEditableContents(outputManager, contents);
    },
    run: (resolvedTaskId) => {
      const targetPlatforms = contents.map((item) => item?.platform).filter(Boolean);
      return stepExecutor.runStep(resolvedTaskId, {
        stage: 'review-optimize',
        platforms: targetPlatforms,
        engine: String(engine || 'claude'),
        confirm: true,
        note: 'WebApp legacy /pipeline/optimize -> shared review-optimize',
      });
    },
    afterRun: (result) => {
      const stageResults = Array.isArray(result?.output?.results) ? result.output.results : [];
      const results = stageResults.map((item, index) => {
        const payload = _hydrateTextResult(outputManager, item, {
          platform: item.platform,
          complianceScore: item.complianceScore ?? null,
        });
        _send(res, { type: 'optimize_start', platform: item.platform, index });
        _send(res, {
          type: 'compliance_result',
          platform: item.platform,
          score: item.complianceScore ?? null,
          hits: item.hitCount ?? null,
        });
        _send(res, {
          type: 'optimize_done',
          ...payload,
        });
        return payload;
      });

      return { results };
    },
    errorLabel: '优化整体失败',
  });
});

router.post('/extract', async (req, res) => {
  const { draftContent, platforms, engine = 'claude' } = req.body || {};
  const { aiAdapter } = req.app.locals;

  console.log(`  ${_ts()}  [流水线] Stage7 双轨提炼  平台=${(platforms || []).join(',')}  引擎=${engine}`);

  if (!draftContent) {
    return res.status(400).json({ error: '缺少母稿内容' });
  }

  const targetPlatforms = Array.isArray(platforms) && platforms.length > 0 ? platforms : ['通用'];
  const exampleJson = Object.fromEntries(targetPlatforms.map((name) => [name, {
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

${String(draftContent).slice(0, 3000)}`;

    const raw = await aiAdapter.generate(prompt, engine);
    let extractions = {};
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractions = JSON.parse(jsonMatch[0]);
      }
    } catch {
      targetPlatforms.forEach((name) => {
        extractions[name] = {
          cover: { title: String(draftContent).slice(0, 20), subtitle: String(draftContent).slice(20, 50) },
          illustration: String(draftContent).slice(0, 300),
        };
      });
    }

    res.json({ extractions });
  } catch (error) {
    console.error(`  ${_ts()}  [流水线] ✗ 双轨提炼失败: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

router.post('/compose', async (req, res) => {
  const { contents = [], taskId = '' } = req.body || {};
  const stepExecutor = req.app.locals.pipelineStepExecutor;
  const { outputManager } = req.app.locals;

  try {
    if (!Array.isArray(contents) || contents.length === 0) {
      return res.status(400).json({ error: 'compose 需要 contents' });
    }

    const resolvedTaskId = _requireTaskId(taskId);
    _persistEditableContents(outputManager, contents);
    const result = await stepExecutor.runStep(resolvedTaskId, {
      stage: 'layout-compose',
      platforms: contents.map((item) => item?.platform).filter(Boolean),
      confirm: true,
      note: 'WebApp legacy /pipeline/compose -> shared layout-compose',
    });

    res.json({
      results: Array.isArray(result?.output?.results) ? result.output.results : [],
      task: result?.task || null,
      taskProgressError: null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/assemble', async (req, res) => {
  const { contents = [], taskId = '' } = req.body || {};
  const stepExecutor = req.app.locals.pipelineStepExecutor;
  const { outputManager } = req.app.locals;

  console.log(`  ${_ts()}  [流水线] Stage9 组装最终文件  内容=${contents.length}篇`);

  try {
    const resolvedTaskId = _requireTaskId(taskId);
    _persistEditableContents(outputManager, contents);
    const result = await stepExecutor.runStep(resolvedTaskId, {
      stage: 'export-output',
      platforms: contents.map((item) => item?.platform).filter(Boolean),
      note: 'WebApp legacy /pipeline/assemble -> shared export-output',
    });

    res.json({
      results: Array.isArray(result?.output?.results) ? result.output.results : [],
      task: result?.task || null,
      taskProgressError: null,
    });
  } catch (error) {
    console.error(`  ${_ts()}  [流水线] ✗ 组装失败: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
