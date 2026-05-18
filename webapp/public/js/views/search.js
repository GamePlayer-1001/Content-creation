/**
 * [INPUT]: 依赖 API
 * [OUTPUT]: Views.search 对象
 * [POS]: views/ 的热点信息页面，负责热点读取与向工作流第一步导流
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const SearchView = {
  state: {
    query: '',
    source: 'google_sheets',
    sourceUsed: '',
    items: [],
    warnings: [],
    loading: false,
  },

  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="loading">加载热点池...</div>';

    if (!this.state.items.length && !this.state.loading) {
      await this._loadHotspots();
    }

    const warningHtml = this.state.warnings.length > 0
      ? `<div class="warning-box">${this.state.warnings.map((item) => `<div>${this._escape(item)}</div>`).join('')}</div>`
      : '';

    const rows = this.state.items.map((item, idx) => {
      const meta = [item.platform, item.category, item.source || this.state.sourceUsed, item.heat ? `热度 ${item.heat}` : '']
        .filter(Boolean)
        .join(' · ');
      const tags = Array.isArray(item.tags) ? item.tags.slice(0, 6) : [];
      return `
        <div class="hotspot-card">
          <div class="hotspot-card-main">
            <div class="hotspot-card-title">${this._escape(item.title || '未命名热点')}</div>
            <div class="hotspot-card-meta">${this._escape(meta || '-')}</div>
            ${item.summary ? `<div class="hotspot-card-summary">${this._escape(item.summary)}</div>` : ''}
            ${tags.length > 0 ? `<div class="stats-row" style="margin:10px 0 0">${tags.map((tag) => `<span class="platform-badge">${this._escape(tag)}</span>`).join('')}</div>` : ''}
          </div>
          <div class="hotspot-card-actions">
            ${item.url ? `<a class="btn btn-sm" href="${this._escapeAttr(item.url)}" target="_blank" rel="noreferrer">打开原链接</a>` : ''}
            <button class="btn btn-primary btn-sm hs-import" data-idx="${idx}">全流程生成</button>
          </div>
        </div>
      `;
    }).join('');

    app.innerHTML = `
      <h2>热点信息</h2>
      <p style="font-size:13px;color:var(--muted);margin-bottom:16px">
        独立处理热点读取、筛选和导入。这里不再占用工作流步骤，只负责把热点内容送入工作流第一步。
      </p>

      <div class="card" style="margin-bottom:16px">
        <div class="card-header">热点池读取</div>
        <div class="toolbar-row">
          <input class="form-input" id="hs-query" placeholder="关键词过滤，可留空" value="${this._escapeAttr(this.state.query)}" />
          <select class="form-select" id="hs-source">
            <option value="google_sheets" ${this.state.source === 'google_sheets' ? 'selected' : ''}>仅 Google Sheets</option>
            <option value="auto" ${this.state.source === 'auto' ? 'selected' : ''}>自动</option>
            <option value="manual" ${this.state.source === 'manual' ? 'selected' : ''}>仅手动热点池</option>
          </select>
          <button class="btn btn-primary" id="hs-refresh">刷新热点</button>
        </div>
        <div style="font-size:12px;color:var(--muted);margin-top:8px">
          当前来源: ${this._escape(this.state.sourceUsed || this.state.source || '-')}
        </div>
        ${warningHtml}
      </div>

      <div class="card" style="margin-bottom:16px">
        <div class="card-header">导入说明</div>
        <div style="font-size:13px;line-height:1.8;color:var(--muted)">
          1. 读取 Google Sheets 热点池。<br>
          2. 选择一个热点并点击“全流程生成”。<br>
          3. 自动写入热点列表、选中热点和补充信息。<br>
          4. 跳转到工作流第 1 步“根据输入内容生成母稿”。
        </div>
      </div>

      <div class="hotspot-list">
        ${rows || '<div class="empty">暂无热点数据，先刷新一次。</div>'}
      </div>
    `;

    document.getElementById('hs-refresh').onclick = async () => {
      this.state.query = document.getElementById('hs-query').value.trim();
      this.state.source = document.getElementById('hs-source').value || 'google_sheets';
      await this._loadHotspots();
      this.render();
    };

    document.getElementById('hs-query').onkeydown = async (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      this.state.query = document.getElementById('hs-query').value.trim();
      this.state.source = document.getElementById('hs-source').value || 'google_sheets';
      await this._loadHotspots();
      this.render();
    };

    document.querySelectorAll('.hs-import').forEach((button) => {
      button.onclick = async () => {
        const idx = Number.parseInt(button.dataset.idx, 10);
        const hotspot = this.state.items[idx];
        if (!hotspot) return;
        await this._importToPipeline(hotspot);
      };
    });
  },

  async _loadHotspots() {
    this.state.loading = true;
    try {
      const query = encodeURIComponent(this.state.query || '');
      const source = encodeURIComponent(this.state.source || 'google_sheets');
      const data = await API.get(`/pipeline/hotspots?query=${query}&limit=30&source=${source}`);
      this.state.items = Array.isArray(data?.items) ? data.items : [];
      this.state.warnings = Array.isArray(data?.warnings) ? data.warnings : [];
      this.state.sourceUsed = data?.source || this.state.source;
    } catch (e) {
      this.state.items = [];
      this.state.warnings = [`热点池读取失败: ${e.message}`];
      this.state.sourceUsed = '';
    } finally {
      this.state.loading = false;
    }
  },

  async _importToPipeline(hotspot) {
    try {
      const title = String(hotspot?.title || '热点任务').trim() || '热点任务';
      const enrichment = [hotspot.title, hotspot.summary].filter(Boolean).join('\n\n');
      const facts = Array.isArray(hotspot.tags) ? hotspot.tags : [];
      const materials = hotspot.url ? [String(hotspot.url)] : [];

      const created = await API.post('/pipeline/tasks', {
        title,
        source: 'hotspot-center',
        metadata: {
          entry: 'hotspot-center',
          hotspotQuery: this.state.query || '',
          hotspotSource: this.state.source || 'google_sheets',
        },
      });
      const taskId = created?.task?.id;
      if (!taskId) throw new Error('任务创建失败');

      await API.post(`/pipeline/tasks/${encodeURIComponent(taskId)}/hotspot-list`, {
        query: this.state.query || '',
        source: this.state.source || 'google_sheets',
        limit: 30,
        note: 'Hotspot Center 导入任务时同步热点列表',
      });

      await API.post(`/pipeline/tasks/${encodeURIComponent(taskId)}/hotspot-select`, {
        hotspotId: hotspot.id || hotspot.title || '',
        hotspot,
        confirm: true,
        note: 'Hotspot Center 选定热点',
      });

      await API.post(`/pipeline/tasks/${encodeURIComponent(taskId)}/hotspot-enrich`, {
        enrichment,
        facts,
        constraints: [],
        materials,
        confirm: true,
        note: 'Hotspot Center 同步热点补充信息',
      });

      sessionStorage.setItem('pipeline_task_handoff', taskId);
      sessionStorage.setItem('pipeline_task_handoff_stage', 'draft-generate');
      location.hash = '#/pipeline';
    } catch (e) {
      showToast(`导入失败: ${e.message}`, 'error');
    }
  },

  _escape(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  _escapeAttr(value) {
    return this._escape(value).replace(/`/g, '&#96;');
  },
};
