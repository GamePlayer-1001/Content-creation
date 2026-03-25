/**
 * [INPUT]: 无外部输入
 * [OUTPUT]: 提供 createDynamicLimiter/escapeHtml/parseTextList/createInitialPipelineState
 * [POS]: views/pipeline 的共享工具层，被 runtime、页面壳与阶段子模块复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

function createDynamicLimiter(initial, max, rampAfter) {
  let running = 0;
  let completed = 0;
  let concurrency = initial;
  const queue = [];

  function drain() {
    if (completed >= rampAfter) concurrency = max;
    while (running < concurrency && queue.length) {
      running += 1;
      const { fn, resolve, reject } = queue.shift();
      fn()
        .then(resolve, reject)
        .finally(() => {
          running -= 1;
          completed += 1;
          drain();
        });
    }
  }

  return (fn) => new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject });
    drain();
  });
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseTextList(value) {
  return String(value || '')
    .split(/[\n,，;；]/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

function createInitialPipelineState(overrides = {}) {
  return {
    step: 0,
    activeStageKey: '',
    taskId: '',
    taskStatus: '',
    taskCurrentStage: '',
    taskSnapshot: null,
    recentTasks: [],
    hotspots: [],
    hotspotQuery: '',
    hotspotSource: 'auto',
    hotspotWarnings: [],
    hotspotSourceUsed: '',
    selectedHotspot: null,
    hotspotFactsText: '',
    hotspotConstraintsText: '',
    hotspotMaterialsText: '',
    input: '',
    style: '',
    engine: 'claude',
    draftContent: '',
    draftFile: '',
    platforms: [],
    platformsOptimize: [],
    platformResults: [],
    images: [],
    coverExtractions: {},
    illustrationExtractions: {},
    coverStylePrompts: {},
    illustrationStylePrompts: {},
    finalResults: [],
    platformCatalog: [],
    styleCatalog: [],
    engineOptions: [],
    pipelineStages: [],
    ...overrides,
  };
}
