/**
 * [INPUT]: 依赖 WorkflowRunner + AI/Skill/Output/Compliance 服务
 * [OUTPUT]: 导出 PipelineStepExecutor（runStep 执行已实现阶段）
 * [POS]: core/pipeline 的阶段执行器，被 CLI 复用
 */

const path = require('path');
const { getPipelineStage } = require('./stages');

const CREATION_STYLES = {
  contrarian: {
    label: '反对大众观点',
    prompt: '请以挑战主流认知的角度来写。大胆质疑大众普遍接受的观点，用事实和逻辑反驳常见误区，引发读者重新思考。语气犀利但有理有据。',
  },
  fresh: {
    label: '提出新观点',
    prompt: '请从一个全新的、前所未有的角度来解读这个话题。避免重复已有的讨论，而是提出独到的见解和创新性的思考框架，让读者有"原来还能这样看"的感觉。',
  },
  debunk: {
    label: '反对旧观点提出新观点',
    prompt: '先破后立：先指出现有主流观点的漏洞和局限性，用数据或案例论证其不足，然后提出你的新观点作为替代方案。逻辑链条要清晰有力。',
  },
  extend: {
    label: '剖析旧观点引申新价值',
    prompt: '深入剖析已有观点的底层逻辑，挖掘出被忽视的新维度和隐藏价值。不是否定原有观点，而是在其基础上发现新的可能性和应用场景。',
  },
  contrast: {
    label: '反差冲突对比',
    prompt: '用强烈的对比和反差来制造认知冲击。将看似矛盾的事物放在一起比较，揭示隐藏的联系或讽刺的现实。善用"你以为是A，其实是B"的叙事结构。',
  },
  review: {
    label: '对比评测',
    prompt: '以客观评测者的视角，从多个维度（成本、效果、易用性、适用场景等）横向对比。用具体数据和真实使用体验说话，给出有理有据的推荐结论。',
  },
  deconstruct: {
    label: '深度拆解',
    prompt: '像庖丁解牛一样，逐层剖析这个话题的底层逻辑、运作机制、关键节点。从表象到本质，从现象到规律，让读者获得系统性的认知升级。',
  },
  predict: {
    label: '趋势预判',
    prompt: '基于当前信号和历史规律，预测这个领域的未来走向。分析关键趋势、拐点信号和可能的演化路径。语气要自信但留有余地，让读者觉得有前瞻性。',
  },
};

const PLATFORMS = [
  { skill: '公众号', dir: '公众号' },
  { skill: '知乎', dir: '知乎' },
  { skill: 'linuxdo', dir: 'linuxdo' },
  { skill: 'GitHub', dir: 'GitHub' },
  { skill: '小红书', dir: '小红书' },
  { skill: '即刻', dir: '即刻' },
  { skill: 'Medium', dir: 'Medium' },
  { skill: 'Quora', dir: 'Quora' },
  { skill: 'X推文', dir: 'X' },
  { skill: 'Reddit', dir: 'Reddit' },
  { skill: '朋友圈', dir: '朋友圈' },
];

class PipelineStepExecutor {
  constructor({
    runner,
    aiAdapter,
    skillLoader,
    outputManager,
    complianceEngine,
    projectRoot,
    logger = console,
  }) {
    this.runner = runner;
    this.aiAdapter = aiAdapter;
    this.skillLoader = skillLoader;
    this.outputManager = outputManager;
    this.complianceEngine = complianceEngine;
    this.projectRoot = projectRoot;
    this.logger = logger;
  }

  async runStep(taskId, {
    stage,
    engine = 'claude',
    input = '',
    style = '',
    platforms = [],
    draftFile = '',
    draftContent = '',
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
    if (stage === 'draft-generate') {
      execution = await this._runDraftGenerate(task, { input, style, engine });
    } else if (stage === 'platform-rewrite') {
      execution = await this._runPlatformRewrite(task, { draftFile, draftContent, engine, platforms });
    } else if (stage === 'review-optimize') {
      execution = await this._runReviewOptimize(task, { engine, platforms });
    } else if (stage === 'export-output') {
      execution = await this._runExportOutput(task, { platforms });
    } else {
      throw new Error(`CLI run-step 暂不支持阶段: ${stage}`);
    }

    const shouldConfirm = stageDef.requiresConfirmation ? true : !!confirm;

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
    const prompt = this.skillLoader.buildPrompt('母稿', {
      topic: stylePrefix + topicInput,
      draftContent: '',
    });
    const content = await this.aiAdapter.generate(prompt, engine);

    const filename = `${_todayTag()}-${_safeFileName(topicInput, 20)}.md`;
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
      },
      artifacts: [
        { type: 'text', stage: 'draft-generate', path: file },
      ],
      metadataExtra: {
        inputSnapshot: topicInput,
        style: styleKey || '',
        engine,
        draftFile: file,
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
    for (const target of targets) {
      const prompt = this.skillLoader.buildPrompt(target.skill, {
        topic: '',
        draftContent: sourceDraft,
      });
      const content = await this.aiAdapter.generate(prompt, engine);
      const filename = `${_todayTag()}-${_safeFileName(sourceDraft, 15)}.md`;
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
      const parsed = _parseOutputPath(file);
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
      const parsed = _parseOutputPath(file);
      let clean = _stripMarkdown(this.outputManager.readFile(parsed.platform, parsed.filename));

      const relatedImages = imageAssets.filter((img) => img.platform === platformName);
      if (relatedImages.length > 0) {
        clean += '\n\n---\n配图:\n';
        relatedImages.forEach((img, idx) => {
          const typeLabel = img.imageType === 'cover' ? '封面' : '配图';
          clean += `${idx + 1}. [${typeLabel}] ${img.path}\n`;
        });
      }

      const finalName = `${_todayTag()}-final-${platformName}.txt`;
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
        finalFiles: results.map((r) => r.file),
      },
    };
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

    const parsed = _parseOutputPath(candidateFile);
    const content = this.outputManager.readFile(parsed.platform, parsed.filename);
    return {
      text: content,
      file: candidateFile,
    };
  }

  _resolveTargetPlatforms(platforms) {
    if (!Array.isArray(platforms) || platforms.length === 0) {
      return [...PLATFORMS];
    }
    const allowSet = new Set(platforms.map((x) => x.trim()).filter(Boolean));
    return PLATFORMS.filter((p) => allowSet.has(p.skill) || allowSet.has(p.dir));
  }

  _filterPlatformsByName(platforms, includes) {
    if (!Array.isArray(includes) || includes.length === 0) return platforms;
    const allow = new Set(includes.map((x) => x.trim()).filter(Boolean));
    return platforms.filter((name) => allow.has(name));
  }

  _buildMetadataPatch(task, stageKey, {
    stageOutput,
    artifacts = [],
    metadataExtra = {},
    checkpointNote = '',
  }) {
    const now = new Date().toISOString();
    const metadata = task?.metadata && typeof task.metadata === 'object' ? task.metadata : {};

    const stageOutputs = {
      ...(metadata.stageOutputs || {}),
      [stageKey]: {
        at: now,
        ...(stageOutput || {}),
      },
    };

    const mergedArtifacts = this._mergeArtifacts(metadata.artifacts, artifacts, now);
    const checkpoints = [
      ...(Array.isArray(metadata.checkpoints) ? metadata.checkpoints : []),
      {
        at: now,
        stage: stageKey,
        source: 'cli-runner',
        note: checkpointNote || '',
      },
    ].slice(-80);

    return {
      ...metadata,
      ...metadataExtra,
      stageOutputs,
      artifacts: mergedArtifacts,
      checkpoints,
      lastUpdatedBy: 'cli-runner',
      lastUpdatedAt: now,
    };
  }

  _mergeArtifacts(currentArtifacts, newArtifacts, now) {
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
}

function _todayTag() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, '');
}

function _safeFileName(text, maxLen = 20) {
  const safe = String(text || '')
    .replace(/[<>:"/\\|?*\n\r#]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, maxLen)
    .trim();
  return safe || 'untitled';
}

function _parseOutputPath(file) {
  const parts = String(file || '').split('/').filter(Boolean);
  if (parts.length < 2) {
    throw new Error(`文件路径无效: ${file}`);
  }
  return {
    platform: parts[0],
    filename: parts.slice(1).join('/'),
  };
}

function _stripMarkdown(text) {
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

module.exports = PipelineStepExecutor;
