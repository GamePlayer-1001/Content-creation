/**
 * [INPUT]: 依赖 WorkflowRunner + AI/Skill/Output/Compliance/Image 服务
 * [OUTPUT]: 导出 PipelineStepExecutor（runStep 执行已实现阶段）
 * [POS]: core/pipeline 的阶段执行器，被 CLI 复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const path = require('path');
const { getPipelineStage } = require('./stages');
const { composeLayoutMarkdown } = require('./layout-composer');
const {
  buildStepMetadataPatch,
  mergeImageAssets,
  todayTag,
  safeFileName,
  parseOutputPath,
  stripMarkdown,
  parseImageTypes,
  toStringList,
} = require('./step-executor-support');
const {
  CREATION_STYLES,
  PLATFORM_CATALOG,
  resolvePlatformSkillName,
} = require('./catalog');

class PipelineStepExecutor {
  constructor({
    runner,
    hotspotService = null,
    aiAdapter,
    skillLoader,
    outputManager,
    complianceEngine,
    imageGenerator = null,
    knowledgeRetriever = null,
    projectRoot,
    logger = console,
  }) {
    this.runner = runner;
    this.hotspotService = hotspotService;
    this.aiAdapter = aiAdapter;
    this.skillLoader = skillLoader;
    this.outputManager = outputManager;
    this.complianceEngine = complianceEngine;
    this.imageGenerator = imageGenerator;
    this.knowledgeRetriever = knowledgeRetriever;
    this.projectRoot = projectRoot;
    this.logger = logger;
  }

  async runStep(taskId, {
    stage,
    engine = 'claude',
    query = '',
    limit = 20,
    source = 'auto',
    hotspotId = '',
    enrichment = '',
    facts = [],
    constraints = [],
    materials = [],
    input = '',
    style = '',
    platforms = [],
    draftFile = '',
    draftContent = '',
    imagePrompt = '',
    stylePrompt = '',
    coverTitle = '',
    coverSubtitle = '',
    imageType = '',
    aspectRatio = '',
    imageSize = '',
    note = '',
    confirm = false,
  } = {}) {
    const stageDef = getPipelineStage(stage);
    if (!stageDef) throw new Error(`未知阶段: ${stage}`);
    if (!stageDef.implemented) {
      throw new Error(`阶段尚未实现: ${stage} (${stageDef.label})`);
    }

    const task = this.runner.getTask(taskId);
    if (!task) throw new Error(`任务不存在: ${taskId}`);

    let execution;
    if (stage === 'hotspot-list') {
      execution = await this._runHotspotList(task, { query, limit, source });
    } else if (stage === 'hotspot-select') {
      execution = await this._runHotspotSelect(task, { hotspotId });
    } else if (stage === 'hotspot-enrich') {
      execution = await this._runHotspotEnrich(task, {
        enrichment,
        facts,
        constraints,
        materials,
        input,
      });
    } else if (stage === 'draft-generate') {
      execution = await this._runDraftGenerate(task, { input, style, engine });
    } else if (stage === 'platform-rewrite') {
      execution = await this._runPlatformRewrite(task, { draftFile, draftContent, engine, platforms });
    } else if (stage === 'review-optimize') {
      execution = await this._runReviewOptimize(task, { engine, platforms });
    } else if (stage === 'visual-generate') {
      execution = await this._runVisualGenerate(task, {
        platforms,
        imagePrompt,
        stylePrompt,
        coverTitle,
        coverSubtitle,
        imageType,
        aspectRatio,
        imageSize,
      });
    } else if (stage === 'layout-compose') {
      execution = await this._runLayoutCompose(task, { platforms });
    } else if (stage === 'export-output') {
      execution = await this._runExportOutput(task, { platforms });
    } else {
      throw new Error(`CLI run-step 暂不支持阶段: ${stage}`);
    }

    const shouldConfirm = !!confirm;

    const metadataPatch = this._buildMetadataPatch(task, stage, {
      stageOutput: execution.stageOutput,
      artifacts: execution.artifacts,
      metadataExtra: execution.metadataExtra,
      checkpointNote: note || execution.note || '',
    });

    const advanced = this.runner.advanceTask(taskId, {
      toStage: stage,
      confirm: shouldConfirm,
      note: note || execution.note || `CLI run-step 执行 ${stageDef.label}`,
        metadataPatch,
      });

    return {
      stage,
      label: stageDef.label,
      taskId,
      output: execution.output,
      task: advanced.task,
      advanced: advanced.advanced,
      requiresConfirmation: advanced.requiresConfirmation,
      message: advanced.message || null,
    };
  }

  async _runHotspotList(task, { query, limit, source }) {
    if (!this.hotspotService) {
      throw new Error('hotspot-list 需要热点服务，请先配置 hotspotService');
    }

    const effectiveQuery = (query || task?.metadata?.hotspotQuery || '').trim();
    const result = await this.hotspotService.listHotspots({
      query: effectiveQuery,
      limit,
      source,
    });
    const snapshotItems = Array.isArray(result.items)
      ? result.items.slice(0, 50).map((item) => ({
        id: item.id || '',
        title: item.title || '',
        summary: item.summary || '',
        category: item.category || '',
        platform: item.platform || '',
        url: item.url || '',
        score: item.score ?? null,
        heat: item.heat || '',
        tags: Array.isArray(item.tags) ? item.tags : [],
        publishedAt: item.publishedAt || '',
        source: item.source || result.source || '',
      }))
      : [];

    return {
      note: `CLI 热点列表读取完成 (${result.total})`,
      output: result,
      stageOutput: {
        source: result.source,
        query: result.query || '',
        total: result.total || 0,
        warnings: Array.isArray(result.warnings) ? result.warnings : [],
      },
      artifacts: snapshotItems.slice(0, 20).map((item) => ({
        type: 'hotspot',
        stage: 'hotspot-list',
        path: item.url || item.title || item.id || '',
        title: item.title,
      })),
      metadataExtra: {
        hotspotQuery: result.query || '',
        hotspotListSnapshot: {
          at: result.fetchedAt || new Date().toISOString(),
          source: result.source,
          query: result.query || '',
          total: result.total || 0,
          warnings: Array.isArray(result.warnings) ? result.warnings : [],
          items: snapshotItems,
        },
      },
    };
  }

  async _runHotspotSelect(task, { hotspotId }) {
    const snapshotItems = Array.isArray(task?.metadata?.hotspotListSnapshot?.items)
      ? task.metadata.hotspotListSnapshot.items
      : [];
    const selectedBefore = task?.metadata?.selectedHotspot || null;
    let selected = selectedBefore;

    if (hotspotId) {
      selected = snapshotItems.find((item) => {
        if (!item) return false;
        if (item.id && String(item.id) === hotspotId) return true;
        if (item.title && String(item.title) === hotspotId) return true;
        return false;
      }) || null;
    } else if (!selected && snapshotItems.length > 0) {
      selected = snapshotItems[0];
    }

    if (!selected) {
      throw new Error('hotspot-select 需要有效热点，请先执行 hotspot-list 或传入 --hotspot-id');
    }

    const normalized = {
      id: selected.id || '',
      title: selected.title || '',
      summary: selected.summary || '',
      category: selected.category || '',
      platform: selected.platform || '',
      url: selected.url || '',
      score: selected.score ?? null,
      heat: selected.heat || '',
      tags: Array.isArray(selected.tags) ? selected.tags : [],
      publishedAt: selected.publishedAt || '',
      source: selected.source || '',
    };

    return {
      note: `CLI 热点选择完成: ${normalized.title || normalized.id || '未命名热点'}`,
      output: { selectedHotspot: normalized },
      stageOutput: {
        selectedHotspotId: normalized.id || '',
        selectedTitle: normalized.title || '',
      },
      artifacts: [
        {
          type: 'hotspot-selected',
          stage: 'hotspot-select',
          path: normalized.url || normalized.title || normalized.id || '',
        },
      ],
      metadataExtra: {
        selectedHotspot: normalized,
      },
    };
  }

  async _runHotspotEnrich(task, {
    enrichment,
    facts,
    constraints,
    materials,
    input,
  }) {
    const selected = task?.metadata?.selectedHotspot || null;
    const rawText = (enrichment || input || '').trim();
    const fallback = selected
      ? [selected.title, selected.summary].filter(Boolean).join('\n\n')
      : '';
    const finalEnrichment = rawText || fallback;
    const normalizedFacts = toStringList(facts);
    const normalizedConstraints = toStringList(constraints);
    const normalizedMaterials = toStringList(materials);

    if (!finalEnrichment && !normalizedFacts.length && !normalizedConstraints.length && !normalizedMaterials.length) {
      throw new Error('hotspot-enrich 缺少内容，请传入 --enrichment 或 --input');
    }

    const now = new Date().toISOString();
    return {
      note: 'CLI 热点补充信息录入完成',
      output: {
        enrichment: finalEnrichment,
        facts: normalizedFacts,
        constraints: normalizedConstraints,
        materials: normalizedMaterials,
      },
      stageOutput: {
        enrichmentLength: finalEnrichment.length,
        facts: normalizedFacts.length,
        constraints: normalizedConstraints.length,
        materials: normalizedMaterials.length,
      },
      artifacts: [],
      metadataExtra: {
        hotspotEnrichment: {
          at: now,
          enrichment: finalEnrichment,
          facts: normalizedFacts,
          constraints: normalizedConstraints,
          materials: normalizedMaterials,
        },
        inputSnapshot: finalEnrichment || task?.metadata?.inputSnapshot || '',
      },
    };
  }

  async _runDraftGenerate(task, { input, style, engine }) {
    const topicInput = (input || task?.metadata?.inputSnapshot || task.title || '').trim();
    if (!topicInput) {
      throw new Error('draft-generate 需要输入内容: --input 或任务 metadata.inputSnapshot');
    }

    const styleKey = (style || task?.metadata?.style || '').trim();
    const styleConfig = CREATION_STYLES[styleKey];
    const stylePrefix = styleConfig
      ? `\n\n【创作方向】${styleConfig.label}\n${styleConfig.prompt}\n\n`
      : '';

    this.logger.log(`[CLI] 执行 draft-generate, engine=${engine}, style=${styleKey || 'default'}`);
    const knowledge = this._retrieveKnowledge({
      stage: 'draft-generate',
      query: [stylePrefix, topicInput, task?.metadata?.hotspotEnrichment?.enrichment || ''].join('\n'),
      limit: 4,
      extraTerms: ['母稿', '写作规则', '质量门控', styleKey],
    });
    const prompt = this.skillLoader.buildPrompt('母稿', {
      topic: stylePrefix + topicInput,
      draftContent: '',
    }) + knowledge.context;
    const content = await this.aiAdapter.generate(prompt, engine);

    const filename = `${todayTag()}-${safeFileName(topicInput, 20)}.md`;
    const file = `母稿/${filename}`;
    this.outputManager.writeFile('母稿', filename, content);

    return {
      note: 'CLI 执行母稿生成完成',
      output: {
        file,
        length: content.length,
      },
      stageOutput: {
        file,
        length: content.length,
        engine,
        style: styleKey || '',
        inputPreview: topicInput.slice(0, 100),
        knowledgeSources: knowledge.sources,
      },
      artifacts: [
        { type: 'text', stage: 'draft-generate', path: file },
      ],
      metadataExtra: {
        inputSnapshot: topicInput,
        style: styleKey || '',
        engine,
        draftFile: file,
        knowledgeUsage: this._mergeKnowledgeUsage(task, 'draft-generate', knowledge.sources),
      },
    };
  }

  async _runPlatformRewrite(task, { draftFile, draftContent, engine, platforms }) {
    const {
      text: sourceDraft,
      file: sourceDraftFile,
    } = this._resolveDraftSource(task, { draftFile, draftContent });

    const targets = this._resolveTargetPlatforms(platforms);
    if (targets.length === 0) {
      throw new Error('platform-rewrite 未匹配到任何平台');
    }

    this.logger.log(`[CLI] 执行 platform-rewrite, targets=${targets.length}, engine=${engine}`);

    const results = [];
    const platformFiles = {};
    const knowledgeUsage = {};
    for (const target of targets) {
      const knowledge = this._retrieveKnowledge({
        stage: 'platform-rewrite',
        platform: target.skill,
        query: sourceDraft,
        limit: 3,
        extraTerms: [target.skill, target.dir, '平台改写', '术语', '禁忌', '表达'],
      });
      knowledgeUsage[target.skill] = knowledge.sources;
      const prompt = this.skillLoader.buildPrompt(target.skill, {
        topic: '',
        draftContent: sourceDraft,
      }) + knowledge.context;
      const content = await this.aiAdapter.generate(prompt, engine);
      const filename = `${todayTag()}-${safeFileName(sourceDraft, 15)}.md`;
      this.outputManager.writeFile(target.dir, filename, content);
      const file = `${target.dir}/${filename}`;
      platformFiles[target.skill] = file;
      results.push({
        platform: target.skill,
        file,
        length: content.length,
      });
    }

    return {
      note: `CLI 多平台改写完成 (${results.length}/${targets.length})`,
      output: {
        sourceDraftFile: sourceDraftFile || '',
        results,
      },
      stageOutput: {
        sourceDraftFile: sourceDraftFile || '',
        total: targets.length,
        success: results.length,
        engine,
        platformFiles,
        knowledgeSources: knowledgeUsage,
      },
      artifacts: results.map((item) => ({
        type: 'text',
        stage: 'platform-rewrite',
        platform: item.platform,
        path: item.file,
      })),
      metadataExtra: {
        engine,
        platformFiles: {
          ...(task?.metadata?.platformFiles || {}),
          ...platformFiles,
        },
        platformResults: results.map((item) => ({
          platform: item.platform,
          file: item.file,
          length: item.length || 0,
        })),
        knowledgeUsage: this._mergeKnowledgeUsage(task, 'platform-rewrite', knowledgeUsage),
      },
    };
  }

  async _runReviewOptimize(task, { engine, platforms }) {
    const platformFileMap = task?.metadata?.platformFiles || {};
    const targetPlatforms = this._filterPlatformsByName(Object.keys(platformFileMap), platforms);
    if (targetPlatforms.length === 0) {
      throw new Error('review-optimize 需要先有 metadata.platformFiles');
    }

    this.logger.log(`[CLI] 执行 review-optimize, targets=${targetPlatforms.length}, engine=${engine}`);

    const results = [];
    for (const platformName of targetPlatforms) {
      const file = platformFileMap[platformName];
      const parsed = parseOutputPath(file);
      const sourceContent = this.outputManager.readFile(parsed.platform, parsed.filename);
      const compliance = this.complianceEngine.check(sourceContent);

      const prompt = this.skillLoader.buildPrompt('优化去AI', {
        topic: platformName,
        draftContent: sourceContent,
        contentLabel: '待优化的平台内容',
      });
      const optimized = await this.aiAdapter.generate(prompt, engine);
      this.outputManager.writeFile(parsed.platform, parsed.filename, optimized);

      results.push({
        platform: platformName,
        file,
        length: optimized.length,
        complianceScore: compliance.score,
        hitCount: compliance.hits.length,
      });
    }

    return {
      note: `CLI 审核优化完成 (${results.length}/${targetPlatforms.length})`,
      output: { results },
      stageOutput: {
        total: targetPlatforms.length,
        success: results.length,
        engine,
        optimizedPlatforms: results.map((r) => r.platform),
      },
      artifacts: results.map((item) => ({
        type: 'text',
        stage: 'review-optimize',
        platform: item.platform,
        path: item.file,
      })),
      metadataExtra: {
        optimizedPlatforms: results.map((r) => r.platform),
      },
    };
  }

  async _runVisualGenerate(task, {
    platforms,
    imagePrompt,
    stylePrompt,
    coverTitle,
    coverSubtitle,
    imageType,
    aspectRatio,
    imageSize,
  }) {
    if (!this.imageGenerator) {
      throw new Error('visual-generate 需要图片服务，请先配置 GOOGLE_GENAI_API_KEY（兼容 GOOGLE_AI_KEY / GEMINI_API_KEY）');
    }

    const targets = this._resolveVisualTargets(task, platforms);
    if (targets.length === 0) {
      throw new Error('visual-generate 未匹配到任何平台');
    }

    const types = parseImageTypes(imageType);
    const ratio = aspectRatio || '1:1';
    const size = imageSize || '1K';
    this.logger.log(`[CLI] 执行 visual-generate, targets=${targets.length}, types=${types.join('+')}`);

    const results = [];
    let index = 0;
    for (const target of targets) {
      for (const type of types) {
        const prompt = this._buildImagePrompt(task, target, {
          type,
          imagePrompt,
          stylePrompt,
          coverTitle,
          coverSubtitle,
        });
        const saveResult = await this.imageGenerator.generateAndSave(
          prompt,
          target.dir,
          (task.title || target.skill || 'image').slice(0, 24),
          `${type}-${index}`,
          { aspectRatio: ratio, imageSize: size }
        );
        index += 1;
        results.push({
          platform: target.skill,
          dir: target.dir,
          imageType: type,
          path: saveResult.path,
          filename: saveResult.filename,
        });
      }
    }

    const mergedImageAssets = mergeImageAssets(task?.metadata?.imageAssets, results);

    return {
      note: `CLI 生成配图完成 (${results.length} 张)`,
      output: {
        total: results.length,
        results,
      },
      stageOutput: {
        total: results.length,
        imageTypes: types,
        aspectRatio: ratio,
        imageSize: size,
      },
      artifacts: results.map((item) => ({
        type: 'image',
        stage: 'visual-generate',
        platform: item.platform,
        imageType: item.imageType,
        path: item.path,
      })),
      metadataExtra: {
        imageAssets: mergedImageAssets,
        lastImage: results.length ? results[results.length - 1] : task?.metadata?.lastImage || null,
      },
    };
  }

  async _runLayoutCompose(task, { platforms }) {
    const platformFileMap = task?.metadata?.platformFiles || {};
    const targetPlatforms = this._filterPlatformsByName(Object.keys(platformFileMap), platforms);
    if (targetPlatforms.length === 0) {
      throw new Error('layout-compose 需要先有 metadata.platformFiles');
    }

    this.logger.log(`[CLI] 执行 layout-compose, targets=${targetPlatforms.length}`);

    const imageAssets = Array.isArray(task?.metadata?.imageAssets) ? task.metadata.imageAssets : [];
    const selectedHotspot = task?.metadata?.selectedHotspot || {};
    const enrichment = task?.metadata?.hotspotEnrichment?.enrichment || task?.metadata?.inputSnapshot || '';
    const results = [];

    for (const platformName of targetPlatforms) {
      const sourceFile = platformFileMap[platformName];
      const parsed = parseOutputPath(sourceFile);
      const content = this.outputManager.readFile(parsed.platform, parsed.filename);
      const relatedImages = imageAssets.filter((img) => img.platform === platformName);
      const markdown = composeLayoutMarkdown({
        platform: platformName,
        sourceFile,
        sourceContent: content,
        hotspotTitle: selectedHotspot?.title || task?.title || '',
        hotspotSummary: selectedHotspot?.summary || enrichment || '',
        images: relatedImages,
      });

      const filename = `${todayTag()}-layout-${safeFileName(platformName, 20)}.md`;
      this.outputManager.writeFile(parsed.platform, filename, markdown);
      const layoutFile = `${parsed.platform}/${filename}`;

      results.push({
        platform: platformName,
        sourceFile,
        file: layoutFile,
        imageCount: relatedImages.length,
        length: markdown.length,
      });
    }

    return {
      note: `CLI 排版完成 (${results.length} 个平台)`,
      output: { results },
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
          sourceFile: item.sourceFile,
          file: item.file,
          imageCount: item.imageCount || 0,
          length: item.length || 0,
        })),
        layoutFiles: results.map((r) => r.file),
      },
    };
  }

  async _runExportOutput(task, { platforms }) {
    const platformFileMap = task?.metadata?.platformFiles || {};
    const targetPlatforms = this._filterPlatformsByName(Object.keys(platformFileMap), platforms);
    if (targetPlatforms.length === 0) {
      throw new Error('export-output 需要先有 metadata.platformFiles');
    }

    this.logger.log(`[CLI] 执行 export-output, targets=${targetPlatforms.length}`);

    const imageAssets = Array.isArray(task?.metadata?.imageAssets) ? task.metadata.imageAssets : [];
    const projectName = path.basename(this.projectRoot || process.cwd());
    const results = [];

    for (const platformName of targetPlatforms) {
      const file = platformFileMap[platformName];
      const parsed = parseOutputPath(file);
      let clean = stripMarkdown(this.outputManager.readFile(parsed.platform, parsed.filename));

      const relatedImages = imageAssets.filter((img) => img.platform === platformName);
      if (relatedImages.length > 0) {
        clean += '\n\n---\n配图:\n';
        relatedImages.forEach((img, idx) => {
          const typeLabel = img.imageType === 'cover' ? '封面' : '配图';
          clean += `${idx + 1}. [${typeLabel}] ${img.path}\n`;
        });
      }

      const finalName = `${todayTag()}-final-${platformName}.txt`;
      this.outputManager.writeFile(platformName, finalName, clean);
      const finalFile = `${platformName}/${finalName}`;

      results.push({
        platform: platformName,
        file: finalFile,
        obsidianUri: `obsidian://open?vault=${encodeURIComponent(projectName)}&file=${encodeURIComponent(`output/${finalFile}`)}`,
        length: clean.length,
      });
    }

    return {
      note: `CLI 导出完成 (${results.length} 个文件)`,
      output: { results },
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
        finalResults: results.map((item) => ({
          platform: item.platform,
          file: item.file,
          obsidianUri: item.obsidianUri,
          length: item.length || 0,
        })),
        finalFiles: results.map((r) => r.file),
      },
    };
  }

  _resolveVisualTargets(task, platforms) {
    if (Array.isArray(platforms) && platforms.length > 0) {
      return this._resolveTargetPlatforms(platforms);
    }

    const platformFiles = task?.metadata?.platformFiles || {};
    const names = Object.keys(platformFiles);
    if (names.length > 0) {
      return names.map((name) => {
        const skillName = resolvePlatformSkillName(name);
        const found = PLATFORM_CATALOG.find((p) => p.skill === skillName);
        if (found) return found;
        return { skill: name, dir: name };
      });
    }

    return [{ skill: '通用', dir: 'general' }];
  }

  _buildImagePrompt(task, target, {
    type,
    imagePrompt,
    stylePrompt,
    coverTitle,
    coverSubtitle,
  }) {
    const platformFileMap = task?.metadata?.platformFiles || {};
    const platformFile = platformFileMap[target.skill] || '';
    let contentHint = '';
    if (platformFile) {
      try {
        const parsed = parseOutputPath(platformFile);
        contentHint = this.outputManager.readFile(parsed.platform, parsed.filename).slice(0, 360);
      } catch {}
    }

    const antiAiCore = [
      'Use natural, organic color palette only.',
      'Absolutely NO electric blue and NO neon purple.',
      'No AI-typical cyan glow, no oversaturated fluorescent tones.',
      'Prefer warm earth tones, muted natural hues, subtle film grain.',
    ].join(' ');

    if (type === 'cover') {
      const title = (coverTitle || task?.title || `${target.skill}封面`).slice(0, 28);
      const subtitle = (coverSubtitle || '').slice(0, 40);
      const titleBlock = subtitle ? `${title}\n${subtitle}` : title;
      return [
        'Generate a poster/cover image with clearly visible, perfectly spelled text.',
        antiAiCore,
        stylePrompt || '',
        imagePrompt || '',
        `Target platform: ${target.skill}.`,
        `Text on image: "${titleBlock}"`,
      ].filter(Boolean).join('\n');
    }

    return [
      'Generate a pure visual illustration with NO text, NO letters, NO watermarks.',
      antiAiCore,
      stylePrompt || '',
      imagePrompt || contentHint || task?.title || target.skill,
      `Target platform: ${target.skill}.`,
    ].filter(Boolean).join('\n');
  }

  _resolveDraftSource(task, { draftFile, draftContent }) {
    if (draftContent && draftContent.trim()) {
      return {
        text: draftContent,
        file: draftFile || '',
      };
    }

    const candidateFile = (draftFile || task?.metadata?.draftFile || '').trim();
    if (!candidateFile) {
      throw new Error('platform-rewrite 需要 --draft-content 或 --draft-file（或任务 metadata.draftFile）');
    }

    const parsed = parseOutputPath(candidateFile);
    const content = this.outputManager.readFile(parsed.platform, parsed.filename);
    return {
      text: content,
      file: candidateFile,
    };
  }

  _resolveTargetPlatforms(platforms) {
    if (!Array.isArray(platforms) || platforms.length === 0) {
      return [...PLATFORM_CATALOG];
    }
    const allowSet = new Set(
      platforms
        .map((x) => resolvePlatformSkillName(String(x).trim()))
        .filter(Boolean)
    );
    return PLATFORM_CATALOG.filter((p) => allowSet.has(p.skill));
  }

  _filterPlatformsByName(platforms, includes) {
    if (!Array.isArray(includes) || includes.length === 0) return platforms;
    const allow = new Set(
      includes
        .map((x) => resolvePlatformSkillName(String(x).trim()))
        .filter(Boolean)
    );
    return platforms.filter((name) => {
      const skillName = resolvePlatformSkillName(name) || name;
      return allow.has(skillName);
    });
  }

  _retrieveKnowledge({ stage, query, platform = '', limit = 3, extraTerms = [] } = {}) {
    if (!this.knowledgeRetriever || typeof this.knowledgeRetriever.retrieve !== 'function') {
      return { context: '', sources: [] };
    }

    try {
      const result = this.knowledgeRetriever.retrieve({
        stage,
        query,
        platform,
        limit,
        extraTerms,
      }) || {};
      const matches = Array.isArray(result.matches) ? result.matches : [];
      return {
        context: String(result.context || ''),
        sources: matches.map((item) => ({
          source: item.source || '',
          title: item.title || '',
          score: item.score || 0,
        })).filter((item) => item.source),
      };
    } catch (error) {
      this.logger?.warn?.(`[knowledge] ${stage || 'unknown'} 检索失败: ${error.message}`);
      return { context: '', sources: [] };
    }
  }

  _mergeKnowledgeUsage(task, stage, sources) {
    return {
      ...(task?.metadata?.knowledgeUsage || {}),
      [stage]: sources,
    };
  }

  _buildMetadataPatch(task, stageKey, {
    stageOutput,
    artifacts = [],
    metadataExtra = {},
    checkpointNote = '',
  }) {
    return buildStepMetadataPatch(task, stageKey, {
      stageOutput,
      artifacts,
      metadataExtra,
      checkpointNote,
      source: 'cli-runner',
    });
  }
}

module.exports = PipelineStepExecutor;
