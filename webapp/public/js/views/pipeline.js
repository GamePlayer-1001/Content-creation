/**
 * [INPUT]: 依赖 API + StreamRenderer
 * [OUTPUT]: Views.pipeline 对象
 * [POS]: views/ 的内容流水线页面, 5步向导式创作核心
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

// ============================================================
//  动态并发信号量 — 2并发起步, 4张完成后升至4并发
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

const PipelineView = {
  // ============================================================
  //  状态管理
  // ============================================================
  state: {
    step: 0,
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
    images: [],                    // [{ platform, imageType, path, filename }]
    coverExtractions: {},          // { '小红书': { title, subtitle } }
    illustrationExtractions: {},   // { '小红书': '视觉隐喻描述' }
    coverStylePrompts: {},         // { '小红书': '风格...' }
    illustrationStylePrompts: {},  // { '小红书': '风格...' }
    finalResults: [],
    platformCatalog: [],
    styleCatalog: [],
    engineOptions: [],
    pipelineStages: [],
  },

  STEPS: [
    { label: '输入素材', key: 'input' },
    { label: '生成母稿', key: 'draft' },
    { label: '多平台生成', key: 'platforms' },
    { label: '图片生成', key: 'image' },
    { label: '最终输出', key: 'output' },
  ],

  STYLE_FALLBACK: [
    { key: 'contrarian', label: '反对大众观点', desc: '大家都说XX对，但其实...' },
    { key: 'fresh', label: '提出新观点', desc: '没人这么想过，但如果...' },
    { key: 'debunk', label: '反对旧观点提出新观点', desc: '传统做法是XX，更好的是...' },
    { key: 'extend', label: '剖析旧观点引申新价值', desc: '大家都知道XX，但很少人意识到...' },
    { key: 'contrast', label: '反差冲突对比', desc: '你以为是A，其实是B' },
    { key: 'review', label: '对比评测', desc: '多维度横评，数据说话' },
    { key: 'deconstruct', label: '深度拆解', desc: '逐层剖析底层逻辑' },
    { key: 'predict', label: '趋势预判', desc: '信号→趋势→预测' },
  ],

  // ============================================================
  //  渲染入口
  // ============================================================
  async render() {
    const app = document.getElementById('app');
    this.state.engine = localStorage.getItem('ai_engine') || 'claude';
    await this._ensureRuntimeOptions();
    await this._loadPipelineStages();
    if (this.state.step === 0) {
      await this._loadRecentTasks();
      await this._loadHotspots();
    }
    const hasUsableEngine = this.state.engineOptions.some(
      (e) => e.value === this.state.engine && e.available !== false
    );
    if (!hasUsableEngine) {
      const firstAvailable = this.state.engineOptions.find((e) => e.available !== false);
      this.state.engine = firstAvailable?.value || this.state.engineOptions[0]?.value || 'claude';
      localStorage.setItem('ai_engine', this.state.engine);
    }

    let html = `<h2>内容流水线</h2>`;
    if (this.state.taskId) {
      html += `
        <p style="font-size:12px;color:var(--muted);margin:4px 0 12px">
          任务: <code>${this.state.taskId}</code>
          · 状态: ${this.state.taskStatus || '-'}
          · 当前阶段: ${this.state.taskCurrentStage || '-'}
        </p>
      `;
      html += this._renderTaskSummaryCard();
    }
    html += this._renderStageProgressStrip();

    // 步骤指示器
    html += `<div class="pipeline-steps">`;
    this.STEPS.forEach((s, i) => {
      const cls = i === this.state.step ? 'active' : (i < this.state.step ? 'done' : '');
      html += `
        <div class="pipeline-step ${cls}" data-step="${i}">
          <span class="step-num"><span>${i + 1}</span></span>
          ${s.label}
        </div>`;
    });
    html += `</div>`;

    // 内容区
    html += `<div class="pipeline-content" id="pipeline-content"></div>`;

    app.innerHTML = html;
    this._bindTaskActions();

    // 步骤点击
    document.querySelectorAll('.pipeline-step').forEach(el => {
      el.onclick = () => {
        const targetStep = parseInt(el.dataset.step);
        if (targetStep <= this.state.step) {
          this.state.step = targetStep;
          this.render();
        }
      };
    });

    // 渲染当前步骤
    this._renderStep();
  },

  // ============================================================
  //  步骤路由
  // ============================================================
  _renderStep() {
    const fns = [
      () => this._renderInput(),
      () => this._renderDraft(),
      () => this._renderPlatforms(),
      () => this._renderImage(),
      () => this._renderOutput(),
    ];
    fns[this.state.step]();
  },

  // ============================================================
  //  任务上下文（WebApp/CLI 共用）
  // ============================================================
  async _ensureTaskContext() {
    if (this.state.taskId) return true;
    const shortInput = (this.state.input || '').replace(/\s+/g, ' ').slice(0, 24);
    const title = shortInput || `内容任务-${new Date().toISOString().slice(0, 10)}`;

    try {
      const data = await API.post('/pipeline/tasks', {
        title,
        source: 'webapp',
        metadata: { entry: 'pipeline-view' },
      });
      this._updateTaskFromResponse(data);
      await this._loadRecentTasks(true);
      return !!this.state.taskId;
    } catch (e) {
      showToast('创建任务上下文失败: ' + e.message, 'error');
      return false;
    }
  },

  _updateTaskFromResponse(payload) {
    const task = payload?.task;
    if (!task) return;
    this.state.taskId = task.id || this.state.taskId;
    this.state.taskStatus = task.status || this.state.taskStatus;
    this.state.taskCurrentStage = task.currentStage || this.state.taskCurrentStage;
    this.state.taskSnapshot = task;
    if (Array.isArray(this.state.recentTasks)) {
      const idx = this.state.recentTasks.findIndex(t => t.id === task.id);
      if (idx >= 0) {
        this.state.recentTasks[idx] = { ...this.state.recentTasks[idx], ...task };
      } else {
        this.state.recentTasks.unshift(task);
        this.state.recentTasks = this.state.recentTasks.slice(0, 8);
      }
    }
    if (payload?.taskProgressError) {
      showToast('任务状态同步警告: ' + payload.taskProgressError, 'error');
    }
  },

  _renderTaskSummaryCard() {
    const task = this.state.taskSnapshot;
    if (!task) return '';

    const metadata = task.metadata && typeof task.metadata === 'object' ? task.metadata : {};
    const stageOutputs = metadata.stageOutputs && typeof metadata.stageOutputs === 'object'
      ? metadata.stageOutputs
      : {};
    const stageKeys = Object.keys(stageOutputs);
    const artifacts = Array.isArray(metadata.artifacts) ? metadata.artifacts : [];
    const checkpoints = Array.isArray(metadata.checkpoints) ? metadata.checkpoints : [];
    const latestCheckpoint = checkpoints.length ? checkpoints[checkpoints.length - 1] : null;
    const finalFiles = Array.isArray(metadata.finalFiles) ? metadata.finalFiles : [];
    const runRange = metadata.runRange && typeof metadata.runRange === 'object' ? metadata.runRange : null;
    const nextStage = this._resolveNextRunnableStage(task);
    const implementedStages = this._getImplementedStages();
    const lastStage = implementedStages.length > 0 ? implementedStages[implementedStages.length - 1] : null;

    const stageRows = stageKeys.slice(-4).map((key) => {
      const output = stageOutputs[key] || {};
      const stamp = output.at ? output.at.replace('T', ' ').slice(0, 19) : '-';
      return `
        <div style="font-size:11px;color:var(--muted);margin-top:4px">
          <code>${key}</code> · ${stamp}
        </div>
      `;
    }).join('');

    const finalRows = finalFiles.slice(-3).map((file) => `
      <div style="font-size:11px;color:var(--muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
        ${file}
      </div>
    `).join('');

    const runRangeRow = runRange ? `
      <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">
        <div style="font-size:11px;color:var(--muted)">最近批量执行</div>
        <div style="font-size:12px;margin-top:2px">
          ${runRange.fromStage || '-'} → ${runRange.toStage || '-'}
          · 失败 ${Array.isArray(runRange.failedStages) ? runRange.failedStages.length : 0}
          · 建议续跑 ${runRange.resumeFromStage || '-'}
        </div>
      </div>
    ` : '';

    const runControlRow = `
      <div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">
        <div style="font-size:11px;color:var(--muted)">阶段控制台</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:6px">
          <button class="btn btn-sm" id="pl-task-run-next" ${nextStage ? '' : 'disabled'}>
            ${nextStage ? `执行下一阶段: ${nextStage.key}` : '阶段已全部完成'}
          </button>
          <button class="btn btn-sm" id="pl-task-run-range" ${nextStage && lastStage ? '' : 'disabled'}>
            ${nextStage && lastStage ? `从 ${nextStage.key} 跑到 ${lastStage.key}` : '无可执行区间'}
          </button>
          <span id="pl-task-run-status" style="font-size:11px;color:var(--muted)"></span>
        </div>
      </div>
    `;

    const checkpointRows = checkpoints.slice(-6).reverse().map((cp) => {
      const stamp = cp?.at ? String(cp.at).replace('T', ' ').slice(0, 19) : '-';
      const stage = cp?.stage || '-';
      const source = cp?.source || '-';
      const note = cp?.note || '';
      return `
        <div style="font-size:11px;color:var(--muted);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${stamp} · <code>${stage}</code> · ${source}${note ? ` · ${note}` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="card" style="margin:-4px 0 14px">
        <div class="card-header">任务摘要</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;font-size:12px">
          <div>
            <div style="color:var(--muted)">阶段输出</div>
            <div style="margin-top:2px">${stageKeys.length}</div>
          </div>
          <div>
            <div style="color:var(--muted)">产物条目</div>
            <div style="margin-top:2px">${artifacts.length}</div>
          </div>
          <div>
            <div style="color:var(--muted)">检查点</div>
            <div style="margin-top:2px">${checkpoints.length}</div>
          </div>
          <div>
            <div style="color:var(--muted)">最近检查点</div>
            <div style="margin-top:2px">${latestCheckpoint?.stage || '-'}</div>
          </div>
        </div>
        ${stageRows ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)"><div style="font-size:11px;color:var(--muted)">最近阶段输出</div>${stageRows}</div>` : ''}
        ${finalRows ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)"><div style="font-size:11px;color:var(--muted)">最近导出文件</div>${finalRows}</div>` : ''}
        ${runControlRow}
        ${runRangeRow}
        ${checkpointRows ? `<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)"><div style="font-size:11px;color:var(--muted)">执行时间线</div>${checkpointRows}</div>` : ''}
      </div>
    `;
  },

  _getImplementedStages() {
    return (Array.isArray(this.state.pipelineStages) ? this.state.pipelineStages : [])
      .filter((stage) => stage && stage.key && stage.implemented)
      .sort((a, b) => a.order - b.order);
  },

  _resolveNextRunnableStage(task = this.state.taskSnapshot) {
    const implemented = this._getImplementedStages();
    if (implemented.length === 0) return null;
    const completed = new Set(Array.isArray(task?.completedStages) ? task.completedStages : []);
    return implemented.find((stage) => !completed.has(stage.key)) || null;
  },

  _buildTaskRunPayload() {
    const fallbackPlatforms = this.state.platformResults.map((item) => item.platform).filter(Boolean);
    return {
      source: this.state.hotspotSource || 'auto',
      query: this.state.hotspotQuery || '',
      limit: 20,
      hotspotId: this.state.selectedHotspot?.id || this.state.selectedHotspot?.title || '',
      enrichment: this.state.input || '',
      facts: parseTextList(this.state.hotspotFactsText || ''),
      constraints: parseTextList(this.state.hotspotConstraintsText || ''),
      materials: parseTextList(this.state.hotspotMaterialsText || ''),
      input: this.state.input || '',
      style: this.state.style || '',
      engine: this.state.engine || 'claude',
      platforms: this.state.platforms.length > 0 ? this.state.platforms : fallbackPlatforms,
      draftFile: this.state.draftFile || '',
      draftContent: this.state.draftContent || '',
      note: 'WebApp 任务摘要卡阶段执行',
      confirm: true,
    };
  },

  async _runTaskStage(stageKey) {
    if (!this.state.taskId || !stageKey) return null;
    const payload = {
      stage: stageKey,
      ...this._buildTaskRunPayload(),
    };
    const result = await API.post(`/pipeline/tasks/${encodeURIComponent(this.state.taskId)}/run-step`, payload);
    this._updateTaskFromResponse(result);
    return result;
  },

  async _runTaskRange(fromStage, toStage) {
    if (!this.state.taskId || !fromStage || !toStage) return null;
    const payload = {
      fromStage,
      toStage,
      onError: 'stop',
      retry: 0,
      ...this._buildTaskRunPayload(),
    };
    const result = await API.post(`/pipeline/tasks/${encodeURIComponent(this.state.taskId)}/run-range`, payload);
    try {
      const latest = await API.get(`/pipeline/tasks/${encodeURIComponent(this.state.taskId)}`);
      this._updateTaskFromResponse(latest);
    } catch {}
    return result;
  },

  _bindTaskActions() {
    const runNextBtn = document.getElementById('pl-task-run-next');
    const runRangeBtn = document.getElementById('pl-task-run-range');
    const statusEl = document.getElementById('pl-task-run-status');
    if (!runNextBtn && !runRangeBtn) return;
    const baseRunNextDisabled = runNextBtn ? runNextBtn.disabled : true;
    const baseRunRangeDisabled = runRangeBtn ? runRangeBtn.disabled : true;

    const setStatus = (text, isError = false) => {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.style.color = isError ? '#b91c1c' : 'var(--muted)';
    };

    const setButtonsDisabled = (disabled) => {
      if (runNextBtn) runNextBtn.disabled = baseRunNextDisabled || disabled;
      if (runRangeBtn) runRangeBtn.disabled = baseRunRangeDisabled || disabled;
    };

    if (runNextBtn) {
      runNextBtn.onclick = async () => {
        const next = this._resolveNextRunnableStage(this.state.taskSnapshot);
        if (!next) {
          showToast('任务阶段已全部完成');
          return;
        }
        setButtonsDisabled(true);
        setStatus(`执行中: ${next.key} ...`);
        try {
          await this._runTaskStage(next.key);
          showToast(`阶段执行完成: ${next.key}`);
          setStatus(`完成: ${next.key}`);
          await this.render();
        } catch (error) {
          showToast(error.message, 'error');
          setStatus(`失败: ${error.message}`, true);
          setButtonsDisabled(false);
        }
      };
    }

    if (runRangeBtn) {
      runRangeBtn.onclick = async () => {
        const next = this._resolveNextRunnableStage(this.state.taskSnapshot);
        const implemented = this._getImplementedStages();
        const last = implemented.length > 0 ? implemented[implemented.length - 1] : null;
        if (!next || !last) {
          showToast('无可执行区间');
          return;
        }
        setButtonsDisabled(true);
        setStatus(`批量执行中: ${next.key} -> ${last.key} ...`);
        try {
          const result = await this._runTaskRange(next.key, last.key);
          const failed = Array.isArray(result?.failedStages) ? result.failedStages : [];
          if (failed.length > 0) {
            showToast(`批量执行完成，失败阶段: ${failed.join(', ')}`, 'error');
            setStatus(`完成（有失败）: ${failed.join(', ')}`, true);
          } else {
            showToast(`批量执行完成: ${next.key} -> ${last.key}`);
            setStatus(`完成: ${next.key} -> ${last.key}`);
          }
          await this.render();
        } catch (error) {
          showToast(error.message, 'error');
          setStatus(`失败: ${error.message}`, true);
          setButtonsDisabled(false);
        }
      };
    }
  },

  _renderStageProgressStrip() {
    const stages = Array.isArray(this.state.pipelineStages) ? this.state.pipelineStages : [];
    if (stages.length === 0) return '';

    const task = this.state.taskSnapshot || {};
    const completed = new Set(Array.isArray(task?.completedStages) ? task.completedStages : []);
    const current = task?.currentStage || '';
    const waiting = task?.pendingConfirmationStage || '';

    const chips = stages.map((stage) => {
      let status = 'planned';
      if (completed.has(stage.key)) status = 'done';
      else if (current === stage.key) status = 'current';
      else if (waiting === stage.key) status = 'waiting';
      else if (stage.implemented) status = 'ready';

      const colorMap = {
        done: '#16a34a',
        current: '#2563eb',
        waiting: '#d97706',
        ready: '#64748b',
        planned: '#9ca3af',
      };
      const dot = colorMap[status] || '#9ca3af';
      const hint = stage.implemented ? '已实现' : '规划中';
      return `
        <div style="display:inline-flex;align-items:center;gap:6px;border:1px solid var(--border);border-radius:999px;padding:4px 10px;font-size:11px;white-space:nowrap">
          <span style="width:7px;height:7px;border-radius:50%;background:${dot};display:inline-block"></span>
          <span>${stage.order}. ${escapeHtml(stage.label)}</span>
          <span style="color:var(--muted)">(${hint})</span>
        </div>
      `;
    }).join('');

    return `
      <div class="card" style="margin:-2px 0 12px">
        <div class="card-header">9阶段进度</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">${chips}</div>
      </div>
    `;
  },

  async _loadRecentTasks(force = false) {
    if (!force && this.state.recentTasks.length > 0) return;
    try {
      const data = await API.get('/pipeline/tasks?limit=8');
      this.state.recentTasks = Array.isArray(data?.tasks) ? data.tasks : [];
    } catch {
      this.state.recentTasks = [];
    }
  },

  async _loadPipelineStages(force = false) {
    if (!force && this.state.pipelineStages.length > 0) return;
    try {
      const data = await API.get('/pipeline/stages');
      if (Array.isArray(data) && data.length > 0) {
        this.state.pipelineStages = data;
        return;
      }
    } catch {}

    this.state.pipelineStages = [
      { key: 'hotspot-list', order: 1, label: '读谷歌表格热点列表', implemented: true },
      { key: 'hotspot-select', order: 2, label: '选热点', implemented: true },
      { key: 'hotspot-enrich', order: 3, label: '录入热点详细内容', implemented: true },
      { key: 'draft-generate', order: 4, label: '生成母稿', implemented: true },
      { key: 'platform-rewrite', order: 5, label: '多平台改写', implemented: true },
      { key: 'review-optimize', order: 6, label: '审核优化 / 去 AI 味', implemented: true },
      { key: 'visual-generate', order: 7, label: '生成多张配图', implemented: true },
      { key: 'layout-compose', order: 8, label: '排版', implemented: true },
      { key: 'export-output', order: 9, label: '导出图文结果并可打开', implemented: true },
    ];
  },

  async _loadHotspots(force = false) {
    if (!force && this.state.hotspots.length > 0) return;
    try {
      const query = encodeURIComponent(this.state.hotspotQuery || '');
      const source = encodeURIComponent(this.state.hotspotSource || 'auto');
      const data = await API.get(`/pipeline/hotspots?query=${query}&limit=20&source=${source}`);
      this.state.hotspots = Array.isArray(data?.items) ? data.items : [];
      this.state.hotspotWarnings = Array.isArray(data?.warnings) ? data.warnings : [];
      this.state.hotspotSourceUsed = data?.source || '';
    } catch (e) {
      this.state.hotspots = [];
      this.state.hotspotWarnings = [`热点池读取失败: ${e.message}`];
      this.state.hotspotSourceUsed = '';
    }
  },

  async _syncHotspotStage() {
    if (!this.state.taskId) return;
    try {
      const data = await API.post(`/pipeline/tasks/${encodeURIComponent(this.state.taskId)}/hotspot-list`, {
        query: this.state.hotspotQuery || '',
        source: this.state.hotspotSource || 'auto',
        limit: 20,
        note: 'WebApp Step1 输入素材阶段同步热点列表',
      });
      this._updateTaskFromResponse(data);
      if (Array.isArray(data?.items)) {
        this.state.hotspots = data.items;
      }
      this.state.hotspotWarnings = Array.isArray(data?.warnings) ? data.warnings : [];
      this.state.hotspotSourceUsed = data?.source || this.state.hotspotSourceUsed;
      if (this.state.hotspotWarnings.length > 0) {
        showToast(`热点读取提示: ${this.state.hotspotWarnings[0]}`);
      }
    } catch (e) {
      showToast('热点阶段同步失败: ' + e.message, 'error');
    }
  },

  async _syncHotspotSelect() {
    if (!this.state.taskId || !this.state.selectedHotspot) return;
    try {
      const payload = {
        hotspotId: this.state.selectedHotspot.id || this.state.selectedHotspot.title || '',
        hotspot: this.state.selectedHotspot,
        confirm: true,
        note: 'WebApp Step1 选择热点',
      };
      const data = await API.post(`/pipeline/tasks/${encodeURIComponent(this.state.taskId)}/hotspot-select`, payload);
      this._updateTaskFromResponse(data);
    } catch (e) {
      showToast('热点选择同步失败: ' + e.message, 'error');
    }
  },

  async _syncHotspotEnrich({ enrichment = '', facts = [], constraints = [], materials = [] } = {}) {
    if (!this.state.taskId) return;
    try {
      const data = await API.post(`/pipeline/tasks/${encodeURIComponent(this.state.taskId)}/hotspot-enrich`, {
        enrichment: enrichment || '',
        facts,
        constraints,
        materials,
        confirm: true,
        note: 'WebApp Step1 录入热点补充信息',
      });
      this._updateTaskFromResponse(data);
    } catch (e) {
      showToast('热点补充信息同步失败: ' + e.message, 'error');
    }
  },

  _mapStageToViewStep(stageKey) {
    if (!stageKey) return 0;
    if (['hotspot-list', 'hotspot-select', 'hotspot-enrich'].includes(stageKey)) return 0;
    if (stageKey === 'draft-generate') return 1;
    if (['platform-rewrite', 'review-optimize'].includes(stageKey)) return 2;
    if (stageKey === 'visual-generate') return 3;
    if (['layout-compose', 'export-output'].includes(stageKey)) return 4;
    return 0;
  },

  async _restoreTask(taskId) {
    try {
      const data = await API.get(`/pipeline/tasks/${encodeURIComponent(taskId)}`);
      this._updateTaskFromResponse(data);
      const task = data?.task;
      if (!task) return;

      const draftFile = task?.metadata?.draftFile || '';
      if (draftFile && draftFile.includes('/')) {
        try {
          const [platform, filename] = draftFile.split('/');
          const draftData = await API.get(`/content/${encodeURIComponent(platform)}/${encodeURIComponent(filename)}`);
          this.state.draftFile = draftFile;
          this.state.draftContent = draftData?.content || '';
        } catch {
          this.state.draftFile = '';
          this.state.draftContent = '';
        }
      }

      const restoreStep = this._mapStageToViewStep(task.currentStage);
      this.state.step = restoreStep;
      if (!this.state.input && task.title) {
        this.state.input = task.title;
      }
      if (task?.metadata?.style) {
        this.state.style = task.metadata.style;
      }
      const hotspotSnapshot = task?.metadata?.hotspotListSnapshot;
      if (Array.isArray(hotspotSnapshot?.items) && hotspotSnapshot.items.length > 0) {
        this.state.hotspots = hotspotSnapshot.items;
        this.state.hotspotQuery = hotspotSnapshot.query || '';
        this.state.hotspotSource = hotspotSnapshot.source || this.state.hotspotSource;
        this.state.hotspotSourceUsed = hotspotSnapshot.source || '';
      }
      if (task?.metadata?.selectedHotspot) {
        this.state.selectedHotspot = task.metadata.selectedHotspot;
      }
      if (task?.metadata?.hotspotEnrichment) {
        const enrich = task.metadata.hotspotEnrichment;
        if (enrich.enrichment) {
          this.state.input = enrich.enrichment;
        }
        this.state.hotspotFactsText = Array.isArray(enrich.facts) ? enrich.facts.join('\n') : '';
        this.state.hotspotConstraintsText = Array.isArray(enrich.constraints) ? enrich.constraints.join('\n') : '';
        this.state.hotspotMaterialsText = Array.isArray(enrich.materials) ? enrich.materials.join('\n') : '';
      }
      showToast(`已恢复任务: ${task.id}`);
      this.render();
    } catch (e) {
      showToast('恢复任务失败: ' + e.message, 'error');
    }
  },

  // ============================================================
  //  运行时选项加载（平台列表 + AI 引擎）
  // ============================================================
  async _ensureRuntimeOptions() {
    if (this.state.platformCatalog.length === 0) {
      try {
        const platforms = await API.get('/pipeline/platforms');
        if (Array.isArray(platforms) && platforms.length > 0) {
          this.state.platformCatalog = platforms.filter((item) => item && item.value && item.enabled !== false);
        }
      } catch {}
      if (this.state.platformCatalog.length === 0) {
        this.state.platformCatalog = [
          { name: '公众号', value: '公众号', enabled: true, group: 'A' },
          { name: '知乎', value: '知乎', enabled: true, group: 'A' },
          { name: 'linuxdo', value: 'linuxdo', enabled: true, group: 'B' },
          { name: 'GitHub', value: 'GitHub', enabled: true, group: 'B' },
          { name: '小红书', value: '小红书', enabled: true, group: 'C' },
          { name: '即刻', value: '即刻', enabled: true, group: 'C' },
          { name: 'Medium', value: 'Medium', enabled: true, group: 'D' },
          { name: 'Quora', value: 'Quora', enabled: true, group: 'D' },
          { name: 'X推文', value: 'X推文', enabled: true, group: 'E' },
          { name: 'Reddit', value: 'Reddit', enabled: true, group: 'E' },
          { name: '朋友圈', value: '朋友圈', enabled: true, group: 'F' },
        ];
      }
    }

    if (this.state.styleCatalog.length === 0) {
      try {
        const styles = await API.get('/pipeline/styles');
        if (Array.isArray(styles) && styles.length > 0) {
          this.state.styleCatalog = styles.map((item) => ({
            key: item.key,
            label: item.label || item.name || item.key,
            desc: item.desc || '',
          }));
        }
      } catch {}
      if (this.state.styleCatalog.length === 0) {
        this.state.styleCatalog = this.STYLE_FALLBACK.map((item) => ({ ...item }));
      }
    }

    if (this.state.engineOptions.length === 0) {
      try {
        const engines = await API.get('/engines');
        const normalized = (engines || []).map(e => ({
          value: e.name,
          label: this._engineLabel(e.name),
          available: !!e.available,
        }));
        if (normalized.length > 0) {
          this.state.engineOptions = normalized;
        }
      } catch {}
      if (this.state.engineOptions.length === 0) {
        this.state.engineOptions = [
          { value: 'claude', label: this._engineLabel('claude'), available: true },
          { value: 'codex', label: this._engineLabel('codex'), available: false },
          { value: 'openai', label: this._engineLabel('openai'), available: false },
          { value: 'openrouter', label: this._engineLabel('openrouter'), available: false },
          { value: 'deepseek', label: this._engineLabel('deepseek'), available: false },
          { value: 'gemini', label: this._engineLabel('gemini'), available: false },
        ];
      }
    }
  },

  _engineLabel(name) {
    const map = {
      claude: 'Claude CLI (本地)',
      codex: 'Codex CLI (本地)',
      openai: 'OpenAI (云端)',
      openrouter: 'OpenRouter (云端)',
      deepseek: 'DeepSeek (云端)',
      gemini: 'Gemini (Google)',
    };
    return map[name] || name;
  },

  _getActivePlatforms() {
    const list = Array.isArray(this.state.platformCatalog) ? this.state.platformCatalog : [];
    const enabled = list.filter((item) => item && item.value && item.enabled !== false);
    if (enabled.length > 0) return enabled;
    return [
      { name: '公众号', value: '公众号', enabled: true, group: 'A' },
      { name: '知乎', value: '知乎', enabled: true, group: 'A' },
      { name: 'linuxdo', value: 'linuxdo', enabled: true, group: 'B' },
      { name: 'GitHub', value: 'GitHub', enabled: true, group: 'B' },
      { name: '小红书', value: '小红书', enabled: true, group: 'C' },
      { name: '即刻', value: '即刻', enabled: true, group: 'C' },
      { name: 'Medium', value: 'Medium', enabled: true, group: 'D' },
      { name: 'Quora', value: 'Quora', enabled: true, group: 'D' },
      { name: 'X推文', value: 'X推文', enabled: true, group: 'E' },
      { name: 'Reddit', value: 'Reddit', enabled: true, group: 'E' },
      { name: '朋友圈', value: '朋友圈', enabled: true, group: 'F' },
    ];
  },

  // ============================================================
  //  Step 1: 输入素材
  // ============================================================
  _renderInput() {
    const el = document.getElementById('pipeline-content');
    const taskRows = this.state.recentTasks.map((task) => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border:1px solid var(--border);border-radius:8px;margin-top:8px">
        <div style="min-width:0">
          <div style="font-size:12px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${task.title || task.id}</div>
          <div style="font-size:11px;color:var(--muted)">
            ${task.id} · ${task.status || '-'} · ${task.currentStage || '-'}
          </div>
        </div>
        <button class="btn btn-sm pl-task-restore" data-task-id="${task.id}">恢复</button>
      </div>
    `).join('');
    const hotspotRows = this.state.hotspots.map((item, idx) => `
      <div style="padding:8px 10px;border:1px solid var(--border);border-radius:8px;margin-top:8px">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
          <div style="font-size:12px;line-height:1.5;min-width:0">
            <div style="color:var(--text);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(item.title || '')}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:2px">
              ${escapeHtml(item.platform || item.category || item.source || '-')}${item.score != null ? ` · 分值 ${escapeHtml(item.score)}` : ''}${item.heat ? ` · 热度 ${escapeHtml(item.heat)}` : ''}
            </div>
          </div>
          <button class="btn btn-sm pl-pick-hotspot" data-hotspot-idx="${idx}">选用</button>
        </div>
        ${item.summary ? `<div style="font-size:11px;color:var(--muted);margin-top:6px;line-height:1.6">${escapeHtml(item.summary)}</div>` : ''}
      </div>
    `).join('');
    const warningRows = this.state.hotspotWarnings
      .map((w) => `<div style="font-size:11px;color:#b45309;line-height:1.5">${escapeHtml(w)}</div>`)
      .join('');
    const sourceLabel = this.state.hotspotSourceUsed
      ? `<span style="font-size:11px;color:var(--muted)">来源: ${escapeHtml(this.state.hotspotSourceUsed)}</span>`
      : '';

    el.innerHTML = `
      <h3>输入素材</h3>
      <p style="font-size:13px;color:var(--muted);margin-bottom:16px">
        输入关键词、想法、长文本或热帖内容作为创作素材
      </p>
      <div class="card" style="margin-bottom:14px">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <span>最近任务</span>
          <button class="btn btn-sm" id="pl-refresh-tasks">刷新</button>
        </div>
        <div style="font-size:11px;color:var(--muted);margin-bottom:6px">
          可从历史任务恢复 taskId，并续接到对应阶段
        </div>
        ${taskRows || '<div style="font-size:12px;color:var(--muted)">暂无历史任务</div>'}
      </div>
      <div class="card" style="margin-bottom:14px">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <span>热点池（阶段1）</span>
          ${sourceLabel}
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px">
          <input class="form-input" id="pl-hotspot-query" placeholder="关键词过滤（可留空）" style="max-width:280px" value="${escapeHtml(this.state.hotspotQuery || '')}" />
          <select class="form-select" id="pl-hotspot-source" style="width:auto">
            <option value="auto" ${this.state.hotspotSource === 'auto' ? 'selected' : ''}>自动</option>
            <option value="google_sheets" ${this.state.hotspotSource === 'google_sheets' ? 'selected' : ''}>仅 Google Sheets</option>
            <option value="manual" ${this.state.hotspotSource === 'manual' ? 'selected' : ''}>仅手动热点池</option>
          </select>
          <button class="btn btn-sm" id="pl-hotspot-search">刷新热点</button>
        </div>
        ${warningRows ? `<div style="margin-bottom:8px">${warningRows}</div>` : ''}
        <div style="max-height:260px;overflow:auto;padding-right:2px">
          ${hotspotRows || '<div style="font-size:12px;color:var(--muted)">暂无热点数据，点击“刷新热点”重试</div>'}
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">素材内容</label>
        <textarea class="form-textarea" id="pl-input" placeholder="输入关键词、想法、或粘贴一段长文本/热帖内容..."
          style="min-height:250px">${this.state.input}</textarea>
      </div>
      ${this.state.selectedHotspot ? `
        <div class="card" style="margin-bottom:12px">
          <div class="card-header">已选热点（阶段2）</div>
          <div style="font-size:12px;line-height:1.7">
            <div><strong>${escapeHtml(this.state.selectedHotspot.title || this.state.selectedHotspot.id || '')}</strong></div>
            <div style="color:var(--muted)">${escapeHtml(this.state.selectedHotspot.category || this.state.selectedHotspot.platform || '-')}</div>
          </div>
        </div>
      ` : ''}
      <div class="card" style="margin-bottom:14px">
        <div class="card-header">热点补充信息（阶段3）</div>
        <div style="font-size:11px;color:var(--muted);margin-bottom:8px">
          支持换行或逗号分隔。会写入任务状态，供后续母稿生成使用。
        </div>
        <div class="form-group">
          <label class="form-label">关键事实（facts）</label>
          <textarea class="form-textarea" id="pl-hotspot-facts" placeholder="例如：数据、时间、事件、案例..."
            style="min-height:90px">${escapeHtml(this.state.hotspotFactsText || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">约束条件（constraints）</label>
          <textarea class="form-textarea" id="pl-hotspot-constraints" placeholder="例如：口吻限制、不能提及、合规边界..."
            style="min-height:90px">${escapeHtml(this.state.hotspotConstraintsText || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">参考素材（materials）</label>
          <textarea class="form-textarea" id="pl-hotspot-materials" placeholder="例如：引用链接、资料来源、补充线索..."
            style="min-height:90px">${escapeHtml(this.state.hotspotMaterialsText || '')}</textarea>
        </div>
      </div>
      <div class="pipeline-nav">
        <span></span>
        <button class="btn btn-primary" id="pl-next1">下一步: 生成母稿</button>
      </div>
    `;

    document.getElementById('pl-next1').onclick = async () => {
      const val = document.getElementById('pl-input').value.trim();
      if (!val) { showToast('请输入素材内容', 'error'); return; }
      const factsText = document.getElementById('pl-hotspot-facts').value.trim();
      const constraintsText = document.getElementById('pl-hotspot-constraints').value.trim();
      const materialsText = document.getElementById('pl-hotspot-materials').value.trim();

      this.state.input = val;
      this.state.hotspotFactsText = factsText;
      this.state.hotspotConstraintsText = constraintsText;
      this.state.hotspotMaterialsText = materialsText;
      const ready = await this._ensureTaskContext();
      if (!ready) return;
      await this._syncHotspotStage();
      await this._syncHotspotSelect();
      await this._syncHotspotEnrich({
        enrichment: val,
        facts: parseTextList(factsText),
        constraints: parseTextList(constraintsText),
        materials: parseTextList(materialsText),
      });
      this.state.step = 1;
      this.render();
    };

    document.getElementById('pl-refresh-tasks').onclick = async () => {
      await this._loadRecentTasks(true);
      this._renderInput();
    };

    document.getElementById('pl-hotspot-search').onclick = async () => {
      this.state.hotspotQuery = document.getElementById('pl-hotspot-query').value.trim();
      this.state.hotspotSource = document.getElementById('pl-hotspot-source').value || 'auto';
      await this._loadHotspots(true);
      this._renderInput();
    };

    document.getElementById('pl-hotspot-query').onkeydown = async (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      this.state.hotspotQuery = document.getElementById('pl-hotspot-query').value.trim();
      this.state.hotspotSource = document.getElementById('pl-hotspot-source').value || 'auto';
      await this._loadHotspots(true);
      this._renderInput();
    };

    document.querySelectorAll('.pl-task-restore').forEach((btn) => {
      btn.onclick = () => this._restoreTask(btn.dataset.taskId);
    });

    document.querySelectorAll('.pl-pick-hotspot').forEach((btn) => {
      btn.onclick = () => {
        const idx = Number.parseInt(btn.dataset.hotspotIdx, 10);
        const hotspot = this.state.hotspots[idx];
        if (!hotspot) return;

        const sourceText = [hotspot.title, hotspot.summary].filter(Boolean).join('\n\n');
        this.state.selectedHotspot = hotspot;
        this.state.input = sourceText || hotspot.title || '';
        this.state.hotspotFactsText = Array.isArray(hotspot.tags) ? hotspot.tags.join('\n') : '';
        this.state.hotspotConstraintsText = '';
        this.state.hotspotMaterialsText = hotspot.url ? String(hotspot.url) : '';
        const inputEl = document.getElementById('pl-input');
        if (inputEl) inputEl.value = this.state.input;
        const factsEl = document.getElementById('pl-hotspot-facts');
        if (factsEl) factsEl.value = this.state.hotspotFactsText;
        const constraintsEl = document.getElementById('pl-hotspot-constraints');
        if (constraintsEl) constraintsEl.value = this.state.hotspotConstraintsText;
        const materialsEl = document.getElementById('pl-hotspot-materials');
        if (materialsEl) materialsEl.value = this.state.hotspotMaterialsText;
        showToast(`已选热点: ${hotspot.title || hotspot.id || '未命名热点'}`);
      };
    });
  },

  // ============================================================
  //  Step 2: 选择创作方向 + 生成母稿
  // ============================================================
  _renderDraft() {
    const el = document.getElementById('pipeline-content');
    let html = `<h3>选择创作方向 & AI 引擎</h3>`;
    const styleList = this.state.styleCatalog.length > 0 ? this.state.styleCatalog : this.STYLE_FALLBACK;
    const engineOptions = this.state.engineOptions.length > 0
      ? this.state.engineOptions
      : [{ value: 'claude', label: 'Claude CLI (本地)', available: true }];
    const engineOptionRows = engineOptions.map((item) => {
      const value = String(item?.value || '').trim();
      if (!value) return '';
      const label = item?.label || value;
      const selected = this.state.engine === value ? 'selected' : '';
      const unavailable = item?.available === false;
      const disabled = unavailable ? 'disabled' : '';
      const suffix = unavailable ? ' (未配置)' : '';
      return `<option value="${escapeHtml(value)}" ${selected} ${disabled}>${escapeHtml(`${label}${suffix}`)}</option>`;
    }).join('');

    // 创作方向
    html += `<div class="style-grid">`;
    styleList.forEach(s => {
      const sel = this.state.style === s.key ? 'selected' : '';
      html += `
        <div class="style-option ${sel}" data-style="${s.key}">
          <div class="style-name">${s.label || s.name || s.key}</div>
          <div class="style-desc">${s.desc}</div>
        </div>`;
    });
    html += `</div>`;

    // AI 引擎
    html += `
      <div class="form-group">
        <label class="form-label">AI 引擎</label>
        <select class="form-select" id="pl-engine">
          ${engineOptionRows}
        </select>
      </div>
    `;

    // 操作区
    html += `
      <div class="btn-group">
        <button class="btn btn-primary" id="pl-gen-draft">生成母稿</button>
        <button class="btn" id="pl-stop-draft" style="display:none">停止</button>
      </div>
      <div class="stream-output" id="pl-draft-output" style="display:none"></div>
    `;

    // 如果已有母稿内容，显示编辑区 + 保存按钮
    if (this.state.draftContent) {
      html += `
        <div class="form-group" style="margin-top:16px">
          <label class="form-label">母稿内容 (可编辑)</label>
          <textarea class="form-textarea" id="pl-draft-edit" style="min-height:300px">${this.state.draftContent}</textarea>
          <button class="btn btn-sm" id="pl-save-draft" style="margin-top:8px">保存到文件</button>
        </div>
      `;
    }

    html += `
      <div class="pipeline-nav">
        <button class="btn" id="pl-back2">上一步</button>
        <button class="btn btn-primary" id="pl-next2" ${!this.state.draftContent ? 'disabled' : ''}>
          下一步: 多平台生成
        </button>
      </div>
    `;

    el.innerHTML = html;

    // 事件绑定
    document.querySelectorAll('.style-option').forEach(opt => {
      opt.onclick = () => {
        document.querySelectorAll('.style-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        this.state.style = opt.dataset.style;
      };
    });

    document.getElementById('pl-engine').onchange = (e) => {
      this.state.engine = e.target.value;
      localStorage.setItem('ai_engine', e.target.value);
    };

    document.getElementById('pl-back2').onclick = () => {
      this.state.step = 0;
      this.render();
    };

    document.getElementById('pl-next2').onclick = () => {
      // 如果有编辑区，保存编辑内容
      const editEl = document.getElementById('pl-draft-edit');
      if (editEl) this.state.draftContent = editEl.value;
      this.state.step = 2;
      this.render();
    };

    // 保存母稿到文件
    const saveDraftBtn = document.getElementById('pl-save-draft');
    if (saveDraftBtn) {
      saveDraftBtn.onclick = async () => {
        const editEl = document.getElementById('pl-draft-edit');
        if (!editEl || !this.state.draftFile) return;
        const parts = this.state.draftFile.split('/');
        if (parts.length !== 2) return;
        try {
          await API.put(`/content/${parts[0]}/${parts[1]}`, { content: editEl.value });
          this.state.draftContent = editEl.value;
          showToast('母稿已保存');
        } catch (e) { showToast('保存失败: ' + e.message, 'error'); }
      };
    }

    // 生成母稿
    let renderer = null;
    const genBtn = document.getElementById('pl-gen-draft');
    const stopBtn = document.getElementById('pl-stop-draft');
    const outputEl = document.getElementById('pl-draft-output');

    genBtn.onclick = async () => {
      const ready = await this._ensureTaskContext();
      if (!ready) return;

      outputEl.style.display = 'block';
      genBtn.style.display = 'none';
      stopBtn.style.display = 'inline-block';

      renderer = new StreamRenderer(outputEl);
      const result = await renderer.start('/pipeline/draft', {
        input: this.state.input,
        style: this.state.style,
        engine: this.state.engine,
        taskId: this.state.taskId,
      });

      stopBtn.style.display = 'none';
      genBtn.style.display = 'inline-block';

      if (result && renderer.getContent()) {
        this._updateTaskFromResponse(result);
        this.state.draftContent = renderer.getContent();
        this.state.draftFile = result.file || '';
        // 重新渲染以显示编辑区和启用下一步
        this._renderDraft();
      }
    };

    stopBtn.onclick = () => {
      if (renderer) renderer.stop();
      stopBtn.style.display = 'none';
      genBtn.style.display = 'inline-block';
    };
  },

  // ============================================================
  //  Step 3: 多平台生成 + 勾选式优化去AI
  // ============================================================
  _renderPlatforms() {
    const el = document.getElementById('pipeline-content');
    const platformList = this._getActivePlatforms();
    const allowedSet = new Set(platformList.map((item) => item.value));
    this.state.platforms = this.state.platforms.filter((name) => allowedSet.has(name));
    this.state.platformsOptimize = this.state.platformsOptimize.filter((name) => allowedSet.has(name));
    let html = `<h3>选择目标平台</h3>`;

    // 平台选择
    html += `<div class="platform-grid">`;
    platformList.forEach(p => {
      const checked = this.state.platforms.includes(p.value) ? 'checked' : '';
      html += `
        <label class="platform-check ${checked}" data-platform="${p.value}">
          <input type="checkbox" ${checked ? 'checked' : ''} />
          ${p.name}
        </label>`;
    });
    html += `</div>`;

    html += `<div class="btn-group"><button class="btn" id="pl-select-all">全选</button></div>`;

    // 优化去AI 勾选区
    html += `
      <div style="margin-top:16px">
        <label class="form-label">优化去AI (可选 — 勾选的平台生成后自动优化)</label>
        <div id="pl-optimize-picks" class="platform-grid" style="margin-top:4px"></div>
        <div class="btn-group" style="margin-top:4px">
          <button class="btn btn-sm" id="pl-opt-all">全选优化</button>
          <button class="btn btn-sm" id="pl-opt-none">全不优化</button>
        </div>
      </div>
    `;

    // 操作按钮
    html += `
      <div class="btn-group" style="margin-top:16px">
        <button class="btn btn-primary" id="pl-gen-platforms">开始生成</button>
        <button class="btn" id="pl-stop-platforms" style="display:none">停止</button>
      </div>
    `;

    // 结果区
    html += `<div id="pl-platform-results"></div>`;
    html += `<div id="pl-optimize-stream"></div>`;

    html += `
      <div class="pipeline-nav">
        <button class="btn" id="pl-back3">上一步</button>
        <button class="btn btn-primary" id="pl-next3" ${this.state.platformResults.length === 0 ? 'disabled' : ''}>
          下一步: 图片生成
        </button>
      </div>
    `;

    el.innerHTML = html;

    // 如果有之前的结果，显示
    if (this.state.platformResults.length > 0) {
      this._showPlatformResults();
    }

    // 初始化优化勾选列表
    this._updateOptimizeChecks();

    // --- 平台选择事件 ---
    document.querySelectorAll('.platform-check').forEach(label => {
      label.onclick = (e) => {
        e.preventDefault();
        const p = label.dataset.platform;
        const idx = this.state.platforms.indexOf(p);
        if (idx >= 0) {
          this.state.platforms.splice(idx, 1);
          label.classList.remove('checked');
          label.querySelector('input').checked = false;
        } else {
          this.state.platforms.push(p);
          label.classList.add('checked');
          label.querySelector('input').checked = true;
        }
        this._updateOptimizeChecks();
      };
    });

    document.getElementById('pl-select-all').onclick = () => {
      this.state.platforms = platformList.map(p => p.value);
      document.querySelectorAll('.platform-check').forEach(l => {
        l.classList.add('checked');
        l.querySelector('input').checked = true;
      });
      this._updateOptimizeChecks();
    };

    document.getElementById('pl-opt-all').onclick = () => {
      this.state.platformsOptimize = [...this.state.platforms];
      this._updateOptimizeChecks();
    };
    document.getElementById('pl-opt-none').onclick = () => {
      this.state.platformsOptimize = [];
      this._updateOptimizeChecks();
    };

    document.getElementById('pl-back3').onclick = () => { this.state.step = 1; this.render(); };
    document.getElementById('pl-next3').onclick = () => { this.state.step = 3; this.render(); };

    // --- 一键生成（生成 + 自动优化勾选平台）---
    document.getElementById('pl-gen-platforms').onclick = async () => {
      const ready = await this._ensureTaskContext();
      if (!ready) return;

      if (this.state.platforms.length === 0) {
        showToast('请至少选择一个平台', 'error');
        return;
      }

      const genBtn = document.getElementById('pl-gen-platforms');
      const stopBtn = document.getElementById('pl-stop-platforms');
      const resultsEl = document.getElementById('pl-platform-results');
      const optStreamEl = document.getElementById('pl-optimize-stream');

      genBtn.style.display = 'none';
      stopBtn.style.display = 'inline-block';
      resultsEl.innerHTML = '<div class="loading">生成中...</div>';
      optStreamEl.innerHTML = '';
      this.state.platformResults = [];

      try {
        // Phase 1: 多平台生成
        await API.stream('/pipeline/platforms', {
          draftContent: this.state.draftContent,
          platforms: this.state.platforms,
          engine: this.state.engine,
          taskId: this.state.taskId,
        }, (data) => {
          if (data.type === 'platform_start') {
            resultsEl.innerHTML += `<div class="card" id="pr-${data.platform}">
              <div class="card-header">${data.platform} 生成中...</div>
              <div class="stream-output streaming" style="max-height:200px"></div>
            </div>`;
          } else if (data.type === 'chunk' && data.platform) {
            const card = document.getElementById(`pr-${data.platform}`);
            if (card) {
              const out = card.querySelector('.stream-output');
              out.textContent += data.content;
              out.scrollTop = out.scrollHeight;
            }
          } else if (data.type === 'platform_done') {
            const card = document.getElementById(`pr-${data.platform}`);
            if (card) {
              card.querySelector('.card-header').textContent = `${data.platform} (${data.length}字)`;
              card.querySelector('.stream-output').classList.remove('streaming');
            }
            this.state.platformResults.push({
              platform: data.platform,
              content: data.content || '',
              file: data.file || '',
              length: data.length,
            });
          } else if (data.type === 'done') {
            this._updateTaskFromResponse(data);
          }
        });

        // Phase 2: 自动优化勾选的平台
        const toOptimize = this.state.platformResults.filter(
          r => this.state.platformsOptimize.includes(r.platform)
        );

        if (toOptimize.length > 0) {
          resultsEl.innerHTML += '<div class="loading" style="margin-top:12px">优化去AI中...</div>';
          await this._runOptimize(toOptimize, optStreamEl);
        }

        // Phase 3: 显示最终可编辑结果
        document.getElementById('pl-next3').disabled = false;
        this._showPlatformResults();
        showToast(toOptimize.length > 0 ? '生成 + 优化完成' : '生成完成');
      } catch (e) {
        showToast(e.message, 'error');
      }

      stopBtn.style.display = 'none';
      genBtn.style.display = 'inline-block';
    };
  },

  // --- 优化勾选列表动态更新 ---
  _updateOptimizeChecks() {
    const el = document.getElementById('pl-optimize-picks');
    if (!el) return;

    // 清理已取消选择的平台
    this.state.platformsOptimize = this.state.platformsOptimize.filter(
      p => this.state.platforms.includes(p)
    );

    if (this.state.platforms.length === 0) {
      el.innerHTML = '<span style="color:var(--muted);font-size:12px">请先选择平台</span>';
      return;
    }

    let html = '';
    this.state.platforms.forEach(p => {
      const checked = this.state.platformsOptimize.includes(p) ? 'checked' : '';
      html += `
        <label class="platform-check opt-pick ${checked}" data-platform="${p}">
          <input type="checkbox" ${checked ? 'checked' : ''} />
          ${p}
        </label>`;
    });
    el.innerHTML = html;

    el.querySelectorAll('.opt-pick').forEach(label => {
      label.onclick = (e) => {
        e.preventDefault();
        const p = label.dataset.platform;
        const idx = this.state.platformsOptimize.indexOf(p);
        if (idx >= 0) {
          this.state.platformsOptimize.splice(idx, 1);
          label.classList.remove('checked');
          label.querySelector('input').checked = false;
        } else {
          this.state.platformsOptimize.push(p);
          label.classList.add('checked');
          label.querySelector('input').checked = true;
        }
      };
    });
  },

  // --- 执行优化流 ---
  async _runOptimize(toOptimize, streamEl) {
    const contents = toOptimize.map(r => ({
      platform: r.platform, content: r.content, file: r.file,
    }));

    await API.stream('/pipeline/optimize', {
      contents,
      engine: this.state.engine,
      taskId: this.state.taskId,
    }, (data) => {
      if (data.type === 'optimize_start') {
        streamEl.innerHTML += `<div class="card" id="opt-${data.platform}">
          <div class="card-header">${data.platform} 优化中...</div>
          <div class="stream-output streaming" style="max-height:150px"></div>
        </div>`;
      } else if (data.type === 'compliance_result') {
        const card = document.getElementById(`opt-${data.platform}`);
        if (card) {
          card.querySelector('.card-header').textContent =
            `${data.platform} · 合规 ${data.score}分 · 去AI中...`;
        }
      } else if (data.type === 'chunk' && data.platform) {
        const card = document.getElementById(`opt-${data.platform}`);
        if (card) {
          const out = card.querySelector('.stream-output');
          out.textContent += data.content;
          out.scrollTop = out.scrollHeight;
        }
      } else if (data.type === 'optimize_done') {
        const card = document.getElementById(`opt-${data.platform}`);
        if (card) {
          card.querySelector('.card-header').textContent = `${data.platform} 优化完成 (${data.length}字)`;
          card.querySelector('.stream-output').classList.remove('streaming');
        }
        const pr = this.state.platformResults.find(p => p.platform === data.platform);
        if (pr) {
          pr.content = data.content || '';
          pr.length = data.length;
        }
      } else if (data.type === 'done') {
        this._updateTaskFromResponse(data);
      }
    });
  },

  _showPlatformResults() {
    const el = document.getElementById('pl-platform-results');
    const optEl = document.getElementById('pl-optimize-stream');
    if (optEl) optEl.innerHTML = '';
    let html = '';
    this.state.platformResults.forEach((r, i) => {
      html += `
        <div class="collapsible">
          <div class="collapsible-header" onclick="this.parentElement.classList.toggle('open')">
            ${r.platform} (${r.length || 0}字)
            <span class="arrow">&#9654;</span>
          </div>
          <div class="collapsible-body">
            <textarea class="form-textarea" id="pr-edit-${i}" style="min-height:200px">${r.content || ''}</textarea>
            <button class="btn btn-sm pr-save-btn" data-idx="${i}" style="margin-top:8px">保存</button>
          </div>
        </div>`;
    });
    el.innerHTML = html;

    el.querySelectorAll('.pr-save-btn').forEach(btn => {
      btn.onclick = async () => {
        const idx = parseInt(btn.dataset.idx);
        const r = this.state.platformResults[idx];
        const textarea = document.getElementById(`pr-edit-${idx}`);
        if (!textarea || !r.file) return;
        const parts = r.file.split('/');
        if (parts.length !== 2) return;
        try {
          await API.put(`/content/${parts[0]}/${parts[1]}`, { content: textarea.value });
          r.content = textarea.value;
          r.length = textarea.value.length;
          btn.closest('.collapsible').querySelector('.collapsible-header').childNodes[0].textContent = `${r.platform} (${r.length}字) `;
          showToast(`${r.platform} 已保存`);
        } catch (e) { showToast('保存失败: ' + e.message, 'error'); }
      };
    });
  },

  // ============================================================
  //  Step 4: 双轨图片生成 (封面带文字 + 配图视觉隐喻)
  // ============================================================
  async _renderImage() {
    const el = document.getElementById('pipeline-content');
    const finalContents = this.state.platformResults;

    // 并行加载: 历史 prompts + 平台配置
    let historyPrompts = [];
    let platformConfig = {};
    try {
      const [hp, pc] = await Promise.all([
        API.get('/image/prompts').catch(() => []),
        API.get('/config/platforms.yaml').catch(() => ({ parsed: {} })),
      ]);
      historyPrompts = hp || [];
      platformConfig = pc.parsed || {};
    } catch {}

    let html = `<h3>图片生成 (双轨模式)</h3>
      <p style="font-size:13px;color:var(--muted);margin-bottom:16px">
        每平台 2 张图: <strong>封面</strong>(带文字海报) + <strong>配图</strong>(视觉隐喻) — 反AI荧光色已内置
      </p>
    `;

    // --- 全局操作栏 ---
    html += `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
        <button class="btn btn-primary" id="pl-extract-all">智能提炼全部平台</button>
        <span id="extract-status" style="font-size:12px;color:var(--muted)"></span>
      </div>
    `;

    // --- 每个平台的双轨卡片 ---
    finalContents.forEach((item, i) => {
      const pCfg = platformConfig[item.platform] || {};
      const imageStyle = pCfg.image_style || {};
      const presets = imageStyle.presets || [];
      const defaultStyle = imageStyle.default || '';

      // 恢复已有值
      const savedCover = this.state.coverExtractions[item.platform] || {};
      const savedIll = this.state.illustrationExtractions[item.platform] || '';
      const savedCoverStyle = this.state.coverStylePrompts[item.platform] || '';
      const savedIllStyle = this.state.illustrationStylePrompts[item.platform] || defaultStyle;

      html += `
        <div class="card" style="margin-bottom:16px">
          <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
            <span>${item.platform}</span>
            <div style="display:flex;gap:6px;align-items:center">
              <select class="form-select" id="img-ratio-${i}" style="width:auto;font-size:12px;padding:2px 6px">
                <option value="1:1">1:1</option>
                <option value="3:4" ${['小红书', '即刻'].includes(item.platform) ? 'selected' : ''}>3:4</option>
                <option value="4:3">4:3</option>
                <option value="16:9" ${['公众号', 'Medium'].includes(item.platform) ? 'selected' : ''}>16:9</option>
                <option value="9:16">9:16</option>
              </select>
              <select class="form-select" id="img-size-${i}" style="width:auto;font-size:12px;padding:2px 6px">
                <option value="1K">1K</option>
                <option value="2K">2K</option>
                <option value="4K">4K</option>
              </select>
            </div>
          </div>

          <div class="dual-track-grid">
            <!-- 左栏: 封面 (带文字海报) -->
            <div class="dual-track-panel">
              <div class="dual-track-label">封面 (带文字)</div>
              <div class="form-group">
                <label style="font-size:11px;color:var(--muted)">标题金句</label>
                <input class="form-input" id="img-cover-title-${i}"
                  placeholder="≤20字, 渲染在图上"
                  value="${(savedCover.title || '').replace(/"/g, '&quot;')}" />
              </div>
              <div class="form-group">
                <label style="font-size:11px;color:var(--muted)">副标题/观点 (可选)</label>
                <input class="form-input" id="img-cover-subtitle-${i}"
                  placeholder="核心观点一句话"
                  value="${(savedCover.subtitle || '').replace(/"/g, '&quot;')}" />
              </div>
              <div class="form-group">
                <label style="font-size:11px;color:var(--muted)">封面风格 (留空随机)</label>
                <textarea class="form-textarea" id="img-cover-style-${i}"
                  style="min-height:36px"
                  placeholder="如: cyberpunk neon city / minimal clean...">${savedCoverStyle}</textarea>
              </div>
              <button class="btn btn-sm" id="img-gen-cover-${i}">生成封面</button>
              <div id="img-preview-cover-${i}" style="margin-top:8px"></div>
            </div>

            <!-- 右栏: 配图 (视觉隐喻, 无文字) -->
            <div class="dual-track-panel">
              <div class="dual-track-label">配图 (视觉隐喻)</div>
              <div class="form-group">
                <label style="font-size:11px;color:var(--muted)">视觉隐喻描述 (画什么)</label>
                <textarea class="form-textarea" id="img-ill-extract-${i}"
                  style="min-height:60px"
                  placeholder="用具象事物隐喻核心概念，不是泛泛氛围...">${savedIll}</textarea>
              </div>
              <div class="form-group">
                <label style="font-size:11px;color:var(--muted)">风格提示词 (怎么画)</label>
                ${presets.length > 0 ? `
                  <div style="margin-bottom:4px">
                    ${presets.map(p => `
                      <button class="btn btn-sm style-preset-btn"
                        data-idx="${i}"
                        data-prompt="${p.prompt.replace(/"/g, '&quot;')}"
                        style="margin-right:3px;margin-bottom:3px;font-size:11px">${p.name}</button>
                    `).join('')}
                  </div>
                ` : ''}
                <textarea class="form-textarea" id="img-ill-style-${i}"
                  style="min-height:36px"
                  placeholder="风格描述...">${savedIllStyle}</textarea>
              </div>
              <button class="btn btn-sm" id="img-gen-ill-${i}">生成配图</button>
              <div id="img-preview-ill-${i}" style="margin-top:8px"></div>
            </div>
          </div>
        </div>
      `;
    });

    // --- 历史 Prompt ---
    if (historyPrompts.length > 0) {
      html += `
        <div class="form-group prompt-history" style="margin-bottom:16px">
          <button class="btn btn-sm" id="pl-toggle-history">历史 Prompt</button>
          <div class="prompt-dropdown" id="prompt-dd-global">
            ${historyPrompts.map(p => `
              <div class="prompt-item" data-text="${p.text.replace(/"/g, '&quot;')}">
                <span class="prompt-text">${p.text}</span>
                <span class="prompt-del" data-id="${p.id}">&times;</span>
              </div>`).join('')}
          </div>
        </div>`;
    }

    // --- 全局按钮 ---
    html += `
      <div class="btn-group" style="margin-top:16px">
        <button class="btn btn-primary" id="pl-gen-all-images">全部生成 (封面+配图)</button>
        <button class="btn" id="pl-gen-all-covers">只生成封面</button>
        <button class="btn" id="pl-gen-all-ills">只生成配图</button>
        <button class="btn" id="pl-skip-images">跳过图片</button>
      </div>
    `;

    html += `
      <div class="pipeline-nav">
        <button class="btn" id="pl-back5">上一步</button>
        <button class="btn btn-primary" id="pl-next5">下一步: 最终输出</button>
      </div>
    `;

    el.innerHTML = html;

    // ---- 事件绑定 ----

    // 智能提炼 (双轨)
    document.getElementById('pl-extract-all').onclick = () => this._extractContentDual();

    // 风格预设 → 填入配图风格框
    document.querySelectorAll('.style-preset-btn').forEach(btn => {
      btn.onclick = () => {
        const idx = btn.dataset.idx;
        document.getElementById(`img-ill-style-${idx}`).value = btn.dataset.prompt;
      };
    });

    // 导航
    document.getElementById('pl-back5').onclick = () => { this.state.step = 2; this.render(); };
    document.getElementById('pl-next5').onclick = () => { this.state.step = 4; this.render(); };
    document.getElementById('pl-skip-images').onclick = () => { this.state.step = 4; this.render(); };

    // 单平台封面/配图生成
    finalContents.forEach((item, i) => {
      document.getElementById(`img-gen-cover-${i}`).onclick =
        () => this._generateImageDual(i, item.platform, 'cover');
      document.getElementById(`img-gen-ill-${i}`).onclick =
        () => this._generateImageDual(i, item.platform, 'illustration');
    });

    // 全部生成 (动态并发: 2→4)
    document.getElementById('pl-gen-all-images').onclick = async () => {
      const limiter = createDynamicLimiter(2, 4, 4);
      const results = await Promise.allSettled(
        finalContents.flatMap((item, i) => [
          limiter(() => this._generateImageDual(i, item.platform, 'cover')),
          limiter(() => this._generateImageDual(i, item.platform, 'illustration')),
        ])
      );
      const failed = results.filter(r => r.status === 'rejected').length;
      showToast(failed ? `图片生成完成, ${failed}张失败` : '全部图片生成完成 (封面+配图)');
    };
    document.getElementById('pl-gen-all-covers').onclick = async () => {
      const limiter = createDynamicLimiter(2, 4, 4);
      const results = await Promise.allSettled(
        finalContents.map((item, i) => limiter(() => this._generateImageDual(i, item.platform, 'cover')))
      );
      const failed = results.filter(r => r.status === 'rejected').length;
      showToast(failed ? `封面生成完成, ${failed}张失败` : '全部封面生成完成');
    };
    document.getElementById('pl-gen-all-ills').onclick = async () => {
      const limiter = createDynamicLimiter(2, 4, 4);
      const results = await Promise.allSettled(
        finalContents.map((item, i) => limiter(() => this._generateImageDual(i, item.platform, 'illustration')))
      );
      const failed = results.filter(r => r.status === 'rejected').length;
      showToast(failed ? `配图生成完成, ${failed}张失败` : '全部配图生成完成');
    };

    // 历史 Prompt
    const historyToggle = document.getElementById('pl-toggle-history');
    if (historyToggle) {
      historyToggle.onclick = () => {
        document.getElementById('prompt-dd-global')?.classList.toggle('show');
      };
    }
    document.querySelectorAll('.prompt-item').forEach(item => {
      item.onclick = (e) => {
        if (e.target.classList.contains('prompt-del')) {
          const id = e.target.dataset.id;
          API.del(`/image/prompts/${id}`).then(() => this._renderImage());
          return;
        }
        document.getElementById('prompt-dd-global')?.classList.remove('show');
      };
    });
  },

  // --- 双轨智能提炼: 封面标题 + 配图视觉隐喻 ---
  async _extractContentDual() {
    const statusEl = document.getElementById('extract-status');
    const btn = document.getElementById('pl-extract-all');
    const platforms = this.state.platformResults.map(r => r.platform);

    btn.disabled = true;
    statusEl.textContent = '正在双轨提炼...';

    try {
      const data = await API.post('/pipeline/extract', {
        draftContent: this.state.draftContent,
        platforms,
        engine: this.state.engine,
        taskId: this.state.taskId,
      });

      // 填充双轨数据
      this.state.platformResults.forEach((item, i) => {
        const ext = data.extractions[item.platform];
        if (!ext) return;

        // 封面轨道
        if (ext.cover) {
          const titleEl = document.getElementById(`img-cover-title-${i}`);
          const subtitleEl = document.getElementById(`img-cover-subtitle-${i}`);
          if (titleEl) titleEl.value = ext.cover.title || '';
          if (subtitleEl) subtitleEl.value = ext.cover.subtitle || '';
          this.state.coverExtractions[item.platform] = ext.cover;
        }

        // 配图轨道
        const illText = ext.illustration || '';
        const illEl = document.getElementById(`img-ill-extract-${i}`);
        if (illEl) illEl.value = illText;
        this.state.illustrationExtractions[item.platform] = illText;
      });

      statusEl.textContent = '双轨提炼完成';
      showToast('智能提炼完成: 封面标题 + 配图隐喻');
    } catch (e) {
      statusEl.textContent = '提炼失败: ' + e.message;
      showToast('提炼失败: ' + e.message, 'error');
    }

    btn.disabled = false;
  },

  _toggleHistory(idx) {
    const dd = document.getElementById(`prompt-dd-${idx}`);
    if (dd) dd.classList.toggle('show');
  },

  // --- 双轨生成: cover(封面) / illustration(配图) ---
  async _generateImageDual(idx, platform, imageType) {
    const previewId = imageType === 'cover' ? `img-preview-cover-${idx}` : `img-preview-ill-${idx}`;
    const previewEl = document.getElementById(previewId);
    const ratioEl = document.getElementById(`img-ratio-${idx}`);
    const sizeEl = document.getElementById(`img-size-${idx}`);

    const requestBody = {
      platform,
      topic: this.state.input.slice(0, 20),
      index: idx,
      aspectRatio: ratioEl.value,
      imageSize: sizeEl.value,
      engine: this.state.engine,
      imageType,
      taskId: this.state.taskId,
    };

    if (imageType === 'cover') {
      // 封面: 标题 + 副标题 + 风格
      const title = document.getElementById(`img-cover-title-${idx}`)?.value?.trim() || '';
      const subtitle = document.getElementById(`img-cover-subtitle-${idx}`)?.value?.trim() || '';
      const style = document.getElementById(`img-cover-style-${idx}`)?.value?.trim() || '';

      if (!title) {
        showToast(`${platform} 封面需要标题文字`, 'error');
        return;
      }

      requestBody.coverTitle = title;
      requestBody.coverSubtitle = subtitle;
      requestBody.stylePrompt = style;
      this.state.coverExtractions[platform] = { title, subtitle };
      this.state.coverStylePrompts[platform] = style;
    } else {
      // 配图: 视觉隐喻 + 风格
      const extraction = document.getElementById(`img-ill-extract-${idx}`)?.value?.trim() || '';
      const style = document.getElementById(`img-ill-style-${idx}`)?.value?.trim() || '';

      if (!extraction && !style) {
        showToast(`${platform} 配图需要视觉描述`, 'error');
        return;
      }

      requestBody.extraction = extraction;
      requestBody.stylePrompt = style;
      this.state.illustrationExtractions[platform] = extraction;
      this.state.illustrationStylePrompts[platform] = style;
    }

    const typeLabel = imageType === 'cover' ? '封面' : '配图';
    previewEl.innerHTML = `<div class="image-loading">${typeLabel}生成中...</div>`;

    try {
      const result = await API.post('/image/generate', requestBody);
      this._updateTaskFromResponse(result);

      previewEl.innerHTML = `
        <div class="image-card">
          <img src="data:${result.mimeType};base64,${result.base64}" alt="${platform}-${imageType}" />
          <div class="image-info">
            <span>${result.filename}</span>
            <a href="data:${result.mimeType};base64,${result.base64}"
               download="${result.filename}" class="btn btn-sm">下载</a>
          </div>
        </div>
      `;

      // 按 platform + imageType 去重存储
      this.state.images = this.state.images.filter(
        img => !(img.platform === platform && img.imageType === imageType)
      );
      this.state.images.push({
        platform, imageType, path: result.path, filename: result.filename,
      });
    } catch (e) {
      previewEl.innerHTML = `<div style="color:var(--muted);font-size:12px">${typeLabel}生成失败: ${e.message}</div>`;
    }
  },

  // ============================================================
  //  Step 5: 最终输出
  // ============================================================
  async _renderOutput() {
    const el = document.getElementById('pipeline-content');
    const finalContents = this.state.platformResults;

    let html = `<h3>最终输出</h3>
      <p style="font-size:13px;color:var(--muted);margin-bottom:16px">
        生成纯文本文件 + Obsidian 打开链接
      </p>
    `;

    html += `
      <button class="btn btn-primary" id="pl-assemble" style="margin-bottom:20px">
        组装最终文件
      </button>
      <div id="pl-final-results"></div>
    `;

    if (this.state.finalResults.length > 0) {
      html += `<div id="pl-final-links"></div>`;
    }

    html += `
      <div class="pipeline-nav">
        <button class="btn" id="pl-back6">上一步</button>
        <button class="btn btn-primary" id="pl-restart">重新开始</button>
      </div>
    `;

    el.innerHTML = html;

    if (this.state.finalResults.length > 0) {
      this._showFinalLinks();
    }

    document.getElementById('pl-back6').onclick = () => { this.state.step = 3; this.render(); };
    document.getElementById('pl-restart').onclick = () => {
      const { engine, platformCatalog, styleCatalog, engineOptions, recentTasks, hotspotSource, pipelineStages } = this.state;
      this.state = {
        step: 0,
        taskId: '',
        taskStatus: '',
        taskCurrentStage: '',
        taskSnapshot: null,
        recentTasks,
        hotspots: [],
        hotspotQuery: '',
        hotspotSource: hotspotSource || 'auto',
        hotspotWarnings: [],
        hotspotSourceUsed: '',
        selectedHotspot: null,
        hotspotFactsText: '',
        hotspotConstraintsText: '',
        hotspotMaterialsText: '',
        input: '',
        style: '',
        engine,
        draftContent: '',
        draftFile: '',
        platforms: [],
        platformsOptimize: [],
        platformResults: [],
        platformCatalog,
        styleCatalog,
        engineOptions,
        pipelineStages,
        images: [],
        coverExtractions: {},
        illustrationExtractions: {},
        coverStylePrompts: {},
        illustrationStylePrompts: {},
        finalResults: [],
      };
      this.render();
    };

    document.getElementById('pl-assemble').onclick = async () => {
      const btn = document.getElementById('pl-assemble');
      btn.disabled = true;
      btn.textContent = '排版中...';

      try {
        const contents = finalContents.map(r => ({
          platform: r.platform,
          content: r.content || '',
          file: r.file || '',
        }));

        const composeResult = await API.post('/pipeline/compose', {
          contents,
          images: this.state.images,
          taskId: this.state.taskId,
        });
        this._updateTaskFromResponse(composeResult);
        const layoutFiles = Array.isArray(composeResult?.results)
          ? composeResult.results.map((x) => x.file).filter(Boolean)
          : [];

        btn.textContent = '导出中...';
        const result = await API.post('/pipeline/assemble', {
          contents,
          images: this.state.images,
          layoutFiles,
          taskId: this.state.taskId,
        });

        this._updateTaskFromResponse(result);
        this.state.finalResults = result.results;
        this._showFinalLinks();
        btn.textContent = '重新组装';
        btn.disabled = false;
      } catch (e) {
        showToast(e.message, 'error');
        btn.textContent = '组装最终文件';
        btn.disabled = false;
      }
    };
  },

  _showFinalLinks() {
    let container = document.getElementById('pl-final-links');
    if (!container) {
      container = document.getElementById('pl-final-results');
    }

    let html = `<h3 style="margin-top:16px">输出文件</h3>
      <div class="file-links">`;

    this.state.finalResults.forEach(r => {
      html += `
        <div class="file-link">
          <span class="link-icon">&#128196;</span>
          <span class="link-name">${r.file}</span>
          <span class="link-action" onclick="PipelineView._copyFile('${r.file}')">复制</span>
          <a class="link-action" href="${r.obsidianUri}" style="text-decoration:none;color:inherit">
            Obsidian 打开
          </a>
        </div>
      `;
    });

    html += `</div>`;
    container.innerHTML = html;
  },

  async _copyFile(filePath) {
    try {
      const parts = filePath.split('/');
      const data = await API.get(`/content/${parts[0]}/${parts[1]}`);
      await navigator.clipboard.writeText(data.content || data);
      showToast('已复制到剪贴板');
    } catch (e) {
      showToast('复制失败', 'error');
    }
  },
};
