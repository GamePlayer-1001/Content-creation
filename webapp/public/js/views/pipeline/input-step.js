/**
 * [INPUT]: 依赖 PipelineView 状态、escapeHtml 与 parseTextList
 * [OUTPUT]: 挂接 _renderInput 热点准备阶段视图
 * [POS]: views/pipeline 的输入阶段模块，负责任务恢复、热点选择与补充信息录入
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

Object.assign(PipelineView, {
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
      <h3>阶段 1-3：热点准备</h3>
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
      if (!val) {
        showToast('请输入素材内容', 'error');
        return;
      }
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
      this._focusStage('draft-generate');
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
});
