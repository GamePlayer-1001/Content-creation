/**
 * [INPUT]: 依赖阶段定义与 TaskStateStore
 * [OUTPUT]: 导出 WorkflowRunner（create/list/get/advance）
 * [POS]: core/pipeline 的任务推进器，统一阶段推进与确认策略
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const {
  PIPELINE_STAGES,
  getPipelineStage,
  compareStageOrder,
} = require('./stages');

class WorkflowRunner {
  constructor(taskStateStore) {
    this.taskStateStore = taskStateStore;
    this.lastStageKey = PIPELINE_STAGES[PIPELINE_STAGES.length - 1].key;
  }

  listStages() {
    return PIPELINE_STAGES.map((stage) => ({ ...stage }));
  }

  listTasks(limit = 20) {
    return this.taskStateStore.listTasks(limit);
  }

  getTask(taskId) {
    return this.taskStateStore.getTask(taskId);
  }

  getStage(stageKey) {
    return getPipelineStage(stageKey);
  }

  createTask(payload = {}) {
    const task = this.taskStateStore.createTask(payload);
    return {
      task,
      nextRecommendedStage: PIPELINE_STAGES[0].key,
    };
  }

  advanceTask(taskId, { toStage, confirm = false, note = '', metadataPatch = null } = {}) {
    const task = this.taskStateStore.getTask(taskId);
    if (!task) {
      throw new Error(`任务不存在: ${taskId}`);
    }

    const targetStage = getPipelineStage(toStage);
    if (!targetStage) {
      throw new Error(`未知阶段: ${toStage}`);
    }

    const pendingConfirmationStage = String(task.pendingConfirmationStage || '').trim();
    if (pendingConfirmationStage) {
      const isConfirmingPendingStage = pendingConfirmationStage === targetStage.key && confirm;
      if (!isConfirmingPendingStage) {
        throw new Error(`任务存在待确认阶段: ${pendingConfirmationStage}，请先确认后再继续`);
      }
    }

    const currentStage = task.currentStage ? getPipelineStage(task.currentStage) : null;
    if (currentStage) {
      const orderDiff = compareStageOrder(targetStage.key, currentStage.key);
      if (orderDiff === null) {
        throw new Error('阶段顺序校验失败');
      }
      if (orderDiff < 0) {
        throw new Error(`暂不支持回退阶段: ${task.currentStage} -> ${targetStage.key}`);
      }
    }

    const now = new Date().toISOString();
    const history = Array.isArray(task.history) ? [...task.history] : [];

    if (targetStage.requiresConfirmation && !confirm) {
      const waitingTask = {
        ...task,
        status: 'awaiting_confirmation',
        pendingConfirmationStage: targetStage.key,
        metadata: _mergeMetadata(task.metadata, metadataPatch),
        updatedAt: now,
        history: [
          ...history,
          {
            at: now,
            type: 'confirmation_required',
            fromStage: task.currentStage,
            toStage: targetStage.key,
            note: note || '',
          },
        ],
      };
      const saved = this.taskStateStore.saveTask(waitingTask);
      return {
        advanced: false,
        requiresConfirmation: true,
        task: saved,
        message: `阶段 ${targetStage.label} 需要人工确认，请补充 confirm 后再推进。`,
      };
    }

    const completed = new Set(task.completedStages || []);
    for (const stage of PIPELINE_STAGES) {
      if (stage.order <= targetStage.order) {
        completed.add(stage.key);
      }
    }

    const advancedTask = {
      ...task,
      status: targetStage.key === this.lastStageKey ? 'completed' : 'in_progress',
      currentStage: targetStage.key,
      pendingConfirmationStage: null,
      completedStages: Array.from(completed).sort((a, b) => compareStageOrder(a, b)),
      metadata: _mergeMetadata(task.metadata, metadataPatch),
      updatedAt: now,
      history: [
        ...history,
        {
          at: now,
          type: 'stage_advanced',
          fromStage: task.currentStage,
          toStage: targetStage.key,
          note: note || '',
        },
      ],
    };

    const saved = this.taskStateStore.saveTask(advancedTask);
    return {
      advanced: true,
      requiresConfirmation: false,
      isCompleted: saved.status === 'completed',
      task: saved,
    };
  }

  rewindTask(taskId, { toStage, note = '', metadataPatch = null } = {}) {
    const task = this.taskStateStore.getTask(taskId);
    if (!task) {
      throw new Error(`任务不存在: ${taskId}`);
    }

    const targetStage = getPipelineStage(toStage);
    if (!targetStage) {
      throw new Error(`未知阶段: ${toStage}`);
    }

    const currentStage = task.currentStage ? getPipelineStage(task.currentStage) : null;
    const pendingStage = task.pendingConfirmationStage ? getPipelineStage(task.pendingConfirmationStage) : null;
    const anchorStage = pendingStage || currentStage;
    if (anchorStage && compareStageOrder(targetStage.key, anchorStage.key) > 0) {
      throw new Error(`不能回退到更靠后的阶段: ${targetStage.key}`);
    }

    const now = new Date().toISOString();
    const history = Array.isArray(task.history) ? [...task.history] : [];
    const completedStages = PIPELINE_STAGES
      .filter((stage) => stage.order < targetStage.order)
      .map((stage) => stage.key);
    const previousStage = PIPELINE_STAGES
      .filter((stage) => stage.order < targetStage.order)
      .sort((a, b) => b.order - a.order)[0] || null;

    const rewoundTask = {
      ...task,
      status: completedStages.length > 0 ? 'in_progress' : 'pending',
      currentStage: previousStage ? previousStage.key : null,
      pendingConfirmationStage: null,
      completedStages,
      metadata: _mergeMetadata(task.metadata, metadataPatch),
      updatedAt: now,
      history: [
        ...history,
        {
          at: now,
          type: 'stage_rewound',
          fromStage: pendingStage?.key || currentStage?.key || null,
          toStage: targetStage.key,
          note: note || '',
        },
      ],
    };

    const saved = this.taskStateStore.saveTask(rewoundTask);
    return {
      rewound: true,
      task: saved,
      nextRecommendedStage: targetStage.key,
    };
  }
}

function _mergeMetadata(currentMetadata, patch) {
  const base = currentMetadata && typeof currentMetadata === 'object' ? currentMetadata : {};
  const extra = patch && typeof patch === 'object' ? patch : null;
  if (!extra) return base;
  return {
    ...base,
    ...extra,
  };
}

module.exports = WorkflowRunner;
