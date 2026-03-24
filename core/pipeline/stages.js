/**
 * [INPUT]: 无外部输入，维护内容生产主流程的统一阶段定义
 * [OUTPUT]: 导出 PIPELINE_STAGES + 阶段查询工具函数
 * [POS]: core/pipeline 的阶段单一信号源，被 WebApp 与 CLI 共用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const PIPELINE_STAGES = Object.freeze([
  {
    key: 'hotspot-list',
    order: 1,
    label: '读谷歌表格热点列表',
    description: '从热点池读取可选主题并做初步过滤。',
    requiresConfirmation: false,
    implemented: true,
    apiPath: '/api/pipeline/hotspots',
  },
  {
    key: 'hotspot-select',
    order: 2,
    label: '选热点',
    description: '选择本轮要进入创作流程的热点。',
    requiresConfirmation: true,
    implemented: true,
    apiPath: '/api/pipeline/tasks/:taskId/hotspot-select',
  },
  {
    key: 'hotspot-enrich',
    order: 3,
    label: '录入热点详细内容',
    description: '补充事实、观点、约束和素材上下文。',
    requiresConfirmation: true,
    implemented: true,
    apiPath: '/api/pipeline/tasks/:taskId/hotspot-enrich',
  },
  {
    key: 'draft-generate',
    order: 4,
    label: '生成母稿',
    description: '基于素材与创作方向产出母稿。',
    requiresConfirmation: false,
    implemented: true,
    apiPath: '/api/pipeline/draft',
  },
  {
    key: 'platform-rewrite',
    order: 5,
    label: '多平台改写',
    description: '将母稿改写为平台特化版本。',
    requiresConfirmation: false,
    implemented: true,
    apiPath: '/api/pipeline/platforms',
  },
  {
    key: 'review-optimize',
    order: 6,
    label: '审核优化 / 去 AI 味',
    description: '执行质量门控、合规检查与文本优化。',
    requiresConfirmation: true,
    implemented: true,
    apiPath: '/api/pipeline/optimize',
  },
  {
    key: 'visual-generate',
    order: 7,
    label: '生成多张配图',
    description: '产出封面与配图等视觉素材。',
    requiresConfirmation: false,
    implemented: true,
    apiPath: '/api/image/generate',
  },
  {
    key: 'layout-compose',
    order: 8,
    label: '排版',
    description: '组织图文结构并输出可读成品形态。',
    requiresConfirmation: true,
    implemented: true,
    apiPath: '/api/pipeline/compose',
  },
  {
    key: 'export-output',
    order: 9,
    label: '导出图文结果并可打开',
    description: '统一命名落盘并返回产物索引。',
    requiresConfirmation: false,
    implemented: true,
    apiPath: '/api/pipeline/assemble',
  },
]);

const STAGE_MAP = new Map(PIPELINE_STAGES.map((stage) => [stage.key, stage]));

function listPipelineStages() {
  return PIPELINE_STAGES.map((stage) => ({ ...stage }));
}

function getPipelineStage(stageKey) {
  return STAGE_MAP.get(stageKey) || null;
}

function compareStageOrder(aKey, bKey) {
  const a = getPipelineStage(aKey);
  const b = getPipelineStage(bKey);
  if (!a || !b) return null;
  return a.order - b.order;
}

module.exports = {
  PIPELINE_STAGES,
  listPipelineStages,
  getPipelineStage,
  compareStageOrder,
};

