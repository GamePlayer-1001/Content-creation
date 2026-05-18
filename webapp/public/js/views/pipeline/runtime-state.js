/**
 * [INPUT]: 依赖 API/showToast/escapeHtml/parseTextList/createInitialPipelineState
 * [OUTPUT]: 扩展 PipelineTaskRuntime 的状态恢复、热点同步与共享结果方法
 * [POS]: views/pipeline 的运行时状态层，被 pipeline.js 入口与 6 步视图复用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

Object.assign(PipelineTaskRuntime, {
  _updateTaskFromResponse(payload) {
    const task = payload?.task;
    if (!task) return;
    this.state.taskId = task.id || this.state.taskId;
    this.state.taskStatus = task.status || this.state.taskStatus;
    this.state.taskCurrentStage = task.currentStage || this.state.taskCurrentStage;
    this.state.taskSnapshot = task;
    this.state.activeStageKey = task.pendingConfirmationStage || task.currentStage || this.state.activeStageKey;
    if (Array.isArray(this.state.recentTasks)) {
      const idx = this.state.recentTasks.findIndex((item) => item.id === task.id);
      if (idx >= 0) {
        this.state.recentTasks[idx] = { ...this.state.recentTasks[idx], ...task };
      } else {
        this.state.recentTasks.unshift(task);
        this.state.recentTasks = this.state.recentTasks.slice(0, 8);
      }
    }
    if (payload?.taskProgressError) {
      showToast(`任务状态同步警告: ${payload.taskProgressError}`, 'error');
    }
  },

  _normalizeFilePath(filePath) {
    return String(filePath || '').trim();
  },

  _readSharedExecutionText(filePath) {
    const normalized = this._normalizeFilePath(filePath);
    if (!normalized || !normalized.includes('/')) {
      throw new Error(`无效输出文件路径: ${normalized || '(empty)'}`);
    }
    return API.readOutputFile(normalized);
  },

  _writeSharedExecutionText(filePath, content) {
    const normalized = this._normalizeFilePath(filePath);
    if (!normalized || !normalized.includes('/')) {
      throw new Error(`无效输出文件路径: ${normalized || '(empty)'}`);
    }
    return API.writeOutputFile(normalized, content);
  },

  async _loadSharedTextOutputs(items, mapFn) {
    const list = Array.isArray(items) ? items : [];
    const results = await Promise.allSettled(list.map(async (item, index) => {
      const mapped = mapFn ? mapFn(item, index) : item;
      if (!mapped?.file) return null;
      const data = await this._readSharedExecutionText(mapped.file);
      return {
        ...mapped,
        content: data?.content || '',
      };
    }));

    return results
      .filter((entry) => entry.status === 'fulfilled' && entry.value)
      .map((entry) => {
        const value = entry.value;
        return {
          ...value,
          length: value.length || value.content.length,
        };
      });
  },

  async _hydrateTaskExecutionResults(task = this.state.taskSnapshot) {
    if (!task) return;

    const metadata = task?.metadata && typeof task.metadata === 'object' ? task.metadata : {};
    this.state.draftFile = '';
    this.state.draftContent = '';
    this.state.platforms = [];
    this.state.platformsOptimize = [];
    this.state.platformResults = [];
    this.state.finalResults = [];
    this.state.images = [];
    this.state.coverExtractions = {};
    this.state.illustrationExtractions = {};
    this.state.coverStylePrompts = {};
    this.state.illustrationStylePrompts = {};
    const draftFile = this._normalizeFilePath(metadata.draftFile || '');
    const platformFileMap = metadata.platformFiles && typeof metadata.platformFiles === 'object'
      ? metadata.platformFiles
      : {};
    const platformResultsMeta = Array.isArray(metadata.platformResults) ? metadata.platformResults : [];
    const platformEntries = platformResultsMeta.length > 0
      ? platformResultsMeta
        .filter((item) => item?.platform && this._normalizeFilePath(item.file).includes('/'))
        .map((item) => ({ platform: item.platform, file: item.file, length: item.length || 0 }))
      : Object.entries(platformFileMap)
        .filter(([, file]) => this._normalizeFilePath(file).includes('/'))
        .map(([platform, file]) => ({ platform, file }));
    const finalResultsMeta = Array.isArray(metadata.finalResults) ? metadata.finalResults : [];
    const finalFiles = Array.isArray(metadata.finalFiles) ? metadata.finalFiles : [];
    const imageAssets = Array.isArray(metadata.imageAssets) ? metadata.imageAssets : [];
    const optimizedPlatforms = Array.isArray(metadata.optimizedPlatforms) ? metadata.optimizedPlatforms : [];

    if (draftFile) {
      try {
        const draftData = await this._readSharedExecutionText(draftFile);
        this.state.draftFile = draftFile;
        this.state.draftContent = draftData?.content || '';
      } catch {
        this.state.draftFile = '';
        this.state.draftContent = '';
      }
    }

    if (platformEntries.length > 0) {
      const restoredResults = await this._loadSharedTextOutputs(platformEntries, (item) => item);
      if (restoredResults.length > 0) {
        this.state.platformResults = restoredResults;
        this.state.platforms = restoredResults.map((item) => item.platform).filter(Boolean);
        this.state.platformsOptimize = this.state.platforms.filter((platform) => optimizedPlatforms.includes(platform));
      }
    }

    if (imageAssets.length > 0) {
      this.state.images = imageAssets
        .filter((item) => item?.platform && item?.path)
        .map((item) => ({
          platform: item.platform,
          imageType: item.imageType || 'illustration',
          path: item.path,
          filename: item.filename || '',
        }));
      for (const item of this.state.images) {
        if (item.imageType === 'cover') {
          this.state.coverExtractions[item.platform] = this.state.coverExtractions[item.platform] || {};
        } else {
          this.state.illustrationExtractions[item.platform] = this.state.illustrationExtractions[item.platform] || '';
        }
      }
    }

    if (finalResultsMeta.length > 0) {
      this.state.finalResults = finalResultsMeta
        .filter((item) => item?.file)
        .map((item) => ({
          platform: item.platform || '',
          file: item.file,
          obsidianUri: item.obsidianUri || '',
          length: item.length || 0,
        }));
    } else if (finalFiles.length > 0) {
      this.state.finalResults = finalFiles
        .filter((file) => this._normalizeFilePath(file))
        .map((file) => ({ file, platform: '', obsidianUri: '', length: 0 }));
    }
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
      { key: 'draft-generate', order: 1, label: '根据输入内容生成母稿', implemented: true },
      { key: 'platform-rewrite', order: 2, label: '根据母稿多平台改写', implemented: true },
      { key: 'review-optimize', order: 3, label: '合规审查 + 去 AI 味优化', implemented: true },
      { key: 'visual-generate', order: 4, label: '生成多张配图', implemented: true },
      { key: 'layout-compose', order: 5, label: '排版', implemented: true },
      { key: 'export-output', order: 6, label: '导出结果并打开', implemented: true },
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
      showToast(`热点阶段同步失败: ${e.message}`, 'error');
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
      showToast(`热点选择同步失败: ${e.message}`, 'error');
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
      showToast(`热点补充信息同步失败: ${e.message}`, 'error');
    }
  },

  _mapStageToViewStep(stageKey) {
    if (!stageKey) return 0;
    if (['hotspot-list', 'hotspot-select', 'hotspot-enrich', 'draft-generate'].includes(stageKey)) return 0;
    if (stageKey === 'platform-rewrite') return 1;
    if (stageKey === 'review-optimize') return 2;
    if (stageKey === 'visual-generate') return 3;
    if (stageKey === 'layout-compose') return 4;
    if (stageKey === 'export-output') return 5;
    return 0;
  },

  async _restoreTask(taskId, { silent = false, rerender = true } = {}) {
    try {
      const data = await API.get(`/pipeline/tasks/${encodeURIComponent(taskId)}`);
      this._updateTaskFromResponse(data);
      const task = data?.task;
      if (!task) return;
      await this._hydrateTaskExecutionResults(task);

      const restoreStage = task?.pendingConfirmationStage || task?.currentStage || '';
      const restoreStep = this._mapStageToViewStep(restoreStage);
      this.state.step = restoreStep;
      this.state.activeStageKey = restoreStage || this._getDefaultStageKeyForPanel(restoreStep, { preferLast: true });
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
      if (!silent) {
        showToast(`已恢复任务: ${task.id}`);
      }
      if (rerender) {
        this.render();
      }
    } catch (e) {
      showToast(`恢复任务失败: ${e.message}`, 'error');
    }
  },

  async _restoreHandoffTask() {
    const taskId = sessionStorage.getItem('pipeline_task_handoff');
    const stageOverride = sessionStorage.getItem('pipeline_task_handoff_stage');
    if (!taskId || taskId === this.state.taskId) return;
    sessionStorage.removeItem('pipeline_task_handoff');
    sessionStorage.removeItem('pipeline_task_handoff_stage');
    await this._restoreTask(taskId, { silent: true, rerender: false });
    if (stageOverride) {
      this._focusStage(stageOverride);
    }
  },
});
