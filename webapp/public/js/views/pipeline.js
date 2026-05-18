/**
 * [INPUT]: 依赖 API + PipelineTaskRuntime + views/pipeline/shared.js
 * [OUTPUT]: Views.pipeline 对象
 * [POS]: views/ 的内容流水线页面壳，以 6 步生产主线编排 9 阶段共享执行能力
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const PipelineView = {
  // ============================================================
  //  状态管理
  // ============================================================
  state: createInitialPipelineState(),

  STAGE_GROUPS: [
    { panel: 0, stages: ['draft-generate'] },
    { panel: 1, stages: ['platform-rewrite'] },
    { panel: 2, stages: ['review-optimize'] },
    { panel: 3, stages: ['visual-generate'] },
    { panel: 4, stages: ['layout-compose'] },
    { panel: 5, stages: ['export-output'] },
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
    await this._restoreHandoffTask();
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

    let html = `<h2>内容流水线</h2>
      <p style="font-size:13px;color:var(--muted);margin:-4px 0 12px">
        当前页面按 6 步展示正式生产流程：1 母稿，2 多平台改写，3 合规审查与去 AI 味，4 配图，5 排版，6 导出并打开。热点输入已独立到“热点信息”页面。
      </p>`;
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

    const visibleStageKeys = new Set(this.STAGE_GROUPS.flatMap((group) => group.stages));
    const navStages = (Array.isArray(this.state.pipelineStages) ? this.state.pipelineStages : [])
      .filter((stage) => visibleStageKeys.has(stage.key));
    const activeStageKey = this._getActiveNavigationStageKey();
    const task = this.state.taskSnapshot || {};
    const completed = new Set(Array.isArray(task?.completedStages) ? task.completedStages : []);
    const currentStage = task?.currentStage || '';
    const waitingStage = task?.pendingConfirmationStage || '';
    const activeStage = navStages.find((stage) => stage.key === activeStageKey) || null;
    const hasTaskProgress = completed.size > 0 || !!currentStage || !!waitingStage;

    html += `<div class="pipeline-steps">`;
    navStages.forEach((stage) => {
      const panelIndex = this._mapStageToViewStep(stage.key);
      const fallbackDone = !hasTaskProgress && activeStage && stage.order < activeStage.order;
      const cls = [
        stage.key === activeStageKey ? 'active' : '',
        completed.has(stage.key) || fallbackDone ? 'done' : '',
        currentStage === stage.key || (!hasTaskProgress && stage.key === activeStageKey) ? 'current' : '',
        waitingStage === stage.key ? 'waiting' : '',
      ].filter(Boolean).join(' ');
      html += `
        <div class="pipeline-step ${cls}" data-step="${panelIndex}" data-stage-key="${stage.key}" title="${escapeHtml(stage.description || stage.label || stage.key)}">
          <span class="step-num"><span>${stage.order}</span></span>
          <span class="step-label">${escapeHtml(stage.label || stage.key)}</span>
        </div>`;
    });
    html += `</div>`;

    html += `<div class="pipeline-content" id="pipeline-content"></div>`;

    app.innerHTML = html;
    this._bindTaskActions();

    document.querySelectorAll('.pipeline-step').forEach((el) => {
      el.onclick = () => {
        const targetStep = Number.parseInt(el.dataset.step, 10);
        const stageKey = el.dataset.stageKey || '';
        if (targetStep > this.state.step) return;
        this.state.step = targetStep;
        this.state.activeStageKey = stageKey || this._getDefaultStageKeyForPanel(targetStep);
        this.render();
      };
    });

    this._renderStep();
  },

  // ============================================================
  //  步骤路由
  // ============================================================
  _renderStep() {
    const renderers = [
      () => this._renderDraft(),
      () => this._renderRewrite(),
      () => this._renderReview(),
      () => this._renderImage(),
      () => this._renderLayout(),
      () => this._renderExport(),
    ];
    renderers[this.state.step]();
  },

  _getStageGroupForPanel(panelIndex) {
    return this.STAGE_GROUPS.find((group) => group.panel === panelIndex) || null;
  },

  _getDefaultStageKeyForPanel(panelIndex, { preferLast = false } = {}) {
    const group = this._getStageGroupForPanel(panelIndex);
    if (!group || !Array.isArray(group.stages) || group.stages.length === 0) return '';
    return preferLast ? group.stages[group.stages.length - 1] : group.stages[0];
  },

  _getActiveNavigationStageKey() {
    const stageKeys = new Set(
      (Array.isArray(this.state.pipelineStages) ? this.state.pipelineStages : []).map((stage) => stage.key)
    );
    const candidate = this.state.activeStageKey
      || this.state.taskSnapshot?.pendingConfirmationStage
      || this.state.taskSnapshot?.currentStage
      || this.state.taskCurrentStage
      || this._getDefaultStageKeyForPanel(this.state.step);
    if (candidate && stageKeys.has(candidate)) return candidate;
    return this._getDefaultStageKeyForPanel(this.state.step);
  },

  _focusStage(stageKey, { preferLastInPanel = false } = {}) {
    const panelIndex = this._mapStageToViewStep(stageKey);
    this.state.step = panelIndex;
    this.state.activeStageKey = stageKey || this._getDefaultStageKeyForPanel(panelIndex, { preferLast: preferLastInPanel });
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
      showToast(`创建任务上下文失败: ${e.message}`, 'error');
      return false;
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
        const normalized = (engines || []).map((e) => ({
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
};

Object.assign(PipelineView, PipelineTaskRuntime);
