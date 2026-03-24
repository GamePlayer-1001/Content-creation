/**
 * [INPUT]: 依赖 fs/path, 读写任务状态 JSON 文件
 * [OUTPUT]: 导出 TaskStateStore 类（create/list/get/save）
 * [POS]: core/pipeline 的轻量任务状态存储，被 WebApp 与 CLI 共用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const fs = require('fs');
const path = require('path');

class TaskStateStore {
  constructor(stateFilePath) {
    this.stateFilePath = stateFilePath;
    this._ensureStateFile();
  }

  createTask({ title, source = 'manual', metadata = {} }) {
    const now = new Date().toISOString();
    const task = {
      id: this._nextTaskId(),
      title: (title || '').trim() || '未命名任务',
      source,
      status: 'pending',
      currentStage: null,
      pendingConfirmationStage: null,
      completedStages: [],
      metadata,
      createdAt: now,
      updatedAt: now,
      history: [
        {
          at: now,
          type: 'created',
          detail: `任务创建 (${source})`,
        },
      ],
    };

    this.saveTask(task);
    return task;
  }

  listTasks(limit = 20) {
    const state = this._readState();
    return Object.values(state.tasks)
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      .slice(0, Math.max(1, limit))
      .map((task) => ({ ...task }));
  }

  getTask(taskId) {
    const state = this._readState();
    const task = state.tasks[taskId];
    return task ? { ...task } : null;
  }

  saveTask(task) {
    const state = this._readState();
    state.tasks[task.id] = { ...task };
    this._writeState(state);
    return { ...state.tasks[task.id] };
  }

  _ensureStateFile() {
    const dir = path.dirname(this.stateFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.stateFilePath)) {
      const initState = {
        version: 1,
        tasks: {},
      };
      fs.writeFileSync(this.stateFilePath, JSON.stringify(initState, null, 2), 'utf-8');
    }
  }

  _readState() {
    this._ensureStateFile();
    try {
      const raw = fs.readFileSync(this.stateFilePath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (typeof parsed !== 'object' || !parsed || typeof parsed.tasks !== 'object') {
        throw new Error('任务状态文件结构无效');
      }
      return parsed;
    } catch {
      const fallback = { version: 1, tasks: {} };
      this._writeState(fallback);
      return fallback;
    }
  }

  _writeState(state) {
    fs.writeFileSync(this.stateFilePath, JSON.stringify(state, null, 2), 'utf-8');
  }

  _nextTaskId() {
    const stamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
    const rand = Math.random().toString(36).slice(2, 8);
    return `task-${stamp}-${rand}`;
  }
}

module.exports = TaskStateStore;

