/**
 * [INPUT]: 依赖 aiAdapter + skillLoader + outputManager + complianceEngine
 * [OUTPUT]: POST /api/pipeline/draft, /api/pipeline/platforms, /api/pipeline/optimize, /api/pipeline/assemble
 * [POS]: routes/ 的内容流水线 API, 6步向导核心后端
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const router = require('express').Router();
const fs = require('fs');
const path = require('path');

// ============================================================
//  8 种创作方向 — prompt 前缀
// ============================================================
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

// ============================================================
//  平台映射 (Skill → 输出目录)
// ============================================================
const PLATFORMS = [
  { skill: '公众号', dir: '公众号', group: 'A' },
  { skill: '小红书', dir: '小红书', group: 'C' },
  { skill: '即刻',   dir: '即刻',   group: 'C' },
  { skill: 'X推文',  dir: 'X',      group: 'D' },
  { skill: 'linuxdo', dir: 'linuxdo', group: 'B' },
  { skill: 'GitHub', dir: 'GitHub', group: 'B' },
  { skill: '朋友圈', dir: '朋友圈', group: 'E' },
];

// ============================================================
//  获取创作方向列表
// ============================================================
router.get('/styles', (req, res) => {
  const styles = Object.entries(CREATION_STYLES).map(([key, val]) => ({
    key,
    label: val.label,
  }));
  res.json(styles);
});

// ============================================================
//  Step 2: 生成母稿 (SSE)
// ============================================================
router.post('/draft', async (req, res) => {
  const { input, style, engine = 'claude' } = req.body;
  const { aiAdapter, skillLoader, outputManager } = req.app.locals;

  _sseHeaders(res);

  try {
    if (!input || !input.trim()) {
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

    _send(res, { type: 'done', file: `母稿/${filename}`, length: fullContent.length });
  } catch (e) {
    _send(res, { type: 'error', message: e.message });
  }
  res.end();
});

// ============================================================
//  Step 3: 多平台生成 (SSE)
// ============================================================
router.post('/platforms', async (req, res) => {
  const { draftContent, platforms, engine = 'claude' } = req.body;
  const { aiAdapter, skillLoader, outputManager } = req.app.locals;

  _sseHeaders(res);

  try {
    if (!draftContent) {
      _send(res, { type: 'error', message: '缺少母稿内容' });
      return res.end();
    }

    const targetPlatforms = platforms && platforms.length > 0
      ? PLATFORMS.filter(p => platforms.includes(p.skill))
      : PLATFORMS;

    _send(res, { type: 'status', message: `开始生成 ${targetPlatforms.length} 个平台...`, total: targetPlatforms.length });

    const results = [];
    for (let i = 0; i < targetPlatforms.length; i++) {
      const p = targetPlatforms[i];
      _send(res, { type: 'platform_start', platform: p.skill, index: i });

      try {
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

        _send(res, { type: 'platform_done', platform: p.skill, file: `${p.dir}/${filename}`, length: fullContent.length, content: fullContent });
        results.push({ platform: p.skill, dir: p.dir, file: `${p.dir}/${filename}`, content: fullContent, length: fullContent.length });
      } catch (e) {
        _send(res, { type: 'platform_error', platform: p.skill, message: e.message });
        results.push({ platform: p.skill, error: e.message });
      }
    }

    _send(res, { type: 'done', results, success: results.filter(r => !r.error).length, total: targetPlatforms.length });
  } catch (e) {
    _send(res, { type: 'error', message: e.message });
  }
  res.end();
});

// ============================================================
//  Step 4: 自循环优化 (SSE)
// ============================================================
router.post('/optimize', async (req, res) => {
  const { contents, engine = 'claude' } = req.body;
  // contents: [{ platform, content, file }]
  const { aiAdapter, skillLoader, outputManager, complianceEngine } = req.app.locals;

  _sseHeaders(res);

  try {
    if (!contents || contents.length === 0) {
      _send(res, { type: 'error', message: '缺少待优化内容' });
      return res.end();
    }

    const results = [];
    for (let i = 0; i < contents.length; i++) {
      const item = contents[i];
      _send(res, { type: 'optimize_start', platform: item.platform, index: i });

      // 合规检查
      const compliance = complianceEngine.check(item.content);
      _send(res, { type: 'compliance_result', platform: item.platform, score: compliance.score, hits: compliance.hits.length });

      // 调用洗稿去 AI 味 (使用口语重写版 style E)
      try {
        const prompt = skillLoader.buildPrompt('洗稿', {
          topic: '--style E',
          draftContent: item.content,
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

        _send(res, { type: 'optimize_done', platform: item.platform, length: optimized.length, content: optimized });
        results.push({ platform: item.platform, content: optimized, length: optimized.length, complianceScore: compliance.score });
      } catch (e) {
        _send(res, { type: 'optimize_error', platform: item.platform, message: e.message });
        results.push({ platform: item.platform, error: e.message });
      }
    }

    _send(res, { type: 'done', results });
  } catch (e) {
    _send(res, { type: 'error', message: e.message });
  }
  res.end();
});

// ============================================================
//  Step 6: 组装最终文件
// ============================================================
router.post('/assemble', async (req, res) => {
  const { contents, images } = req.body;
  // contents: [{ platform, content, file }]
  // images: [{ platform, path }]
  const { outputManager } = req.app.locals;
  const projectRoot = req.app.locals.projectRoot;

  try {
    const results = [];
    for (const item of contents) {
      // 移除 markdown 特殊符号
      let clean = _stripMarkdown(item.content);

      // 如果有对应图片, 在末尾追加图片路径
      const relatedImages = (images || []).filter(img => img.platform === item.platform);
      if (relatedImages.length > 0) {
        clean += '\n\n---\n配图:\n';
        relatedImages.forEach((img, idx) => {
          clean += `${idx + 1}. ${img.path}\n`;
        });
      }

      // 保存最终文件
      const dir = item.platform || '母稿';
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const filename = `${today}-final-${dir}.txt`;
      outputManager.writeFile(dir, filename, clean);

      // 构建 Obsidian URI
      const vaultName = path.basename(projectRoot);
      const obsidianFile = `output/${dir}/${filename}`;
      const obsidianUri = `obsidian://open?vault=${encodeURIComponent(vaultName)}&file=${encodeURIComponent(obsidianFile)}`;

      results.push({
        platform: item.platform,
        file: `${dir}/${filename}`,
        obsidianUri,
        length: clean.length,
      });
    }

    res.json({ results });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================================
//  工具函数
// ============================================================
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

function _sseHeaders(res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
}

function _send(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

module.exports = router;
