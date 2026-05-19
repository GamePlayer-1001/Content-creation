/**
 * [INPUT]: 依赖 PipelineView 状态、escapeHtml 与 parseTextList
 * [OUTPUT]: 挂接输入源摘要、热点预填绑定与输入同步方法
 * [POS]: views/pipeline 的输入源辅助模块，负责把热点输入映射到母稿生成步骤
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

Object.assign(PipelineView, {
  _buildInputSourceSummary() {
    const hotspot = this.state.selectedHotspot;
    const blocks = [];

    if (hotspot) {
      blocks.push(`
        <div class="card" style="margin-bottom:12px">
          <div class="card-header">当前热点输入</div>
          <div style="font-size:12px;line-height:1.7">
            <div><strong>${escapeHtml(hotspot.title || hotspot.id || '未命名热点')}</strong></div>
            <div style="color:var(--muted)">${escapeHtml(hotspot.category || hotspot.platform || hotspot.source || '-')}</div>
            ${hotspot.summary ? `<div style="margin-top:6px;color:var(--muted)">${escapeHtml(hotspot.summary)}</div>` : ''}
          </div>
        </div>
      `);
    }

    if (this.state.hotspotFactsText || this.state.hotspotConstraintsText || this.state.hotspotMaterialsText) {
      blocks.push(`
        <div class="card" style="margin-bottom:12px">
          <div class="card-header">已同步的补充信息</div>
          <div style="font-size:12px;line-height:1.8;color:var(--muted)">
            ${this.state.hotspotFactsText ? `<div><strong style="color:var(--text)">关键事实:</strong> ${escapeHtml(this.state.hotspotFactsText).replace(/\n/g, ' / ')}</div>` : ''}
            ${this.state.hotspotConstraintsText ? `<div><strong style="color:var(--text)">约束条件:</strong> ${escapeHtml(this.state.hotspotConstraintsText).replace(/\n/g, ' / ')}</div>` : ''}
            ${this.state.hotspotMaterialsText ? `<div><strong style="color:var(--text)">参考素材:</strong> ${escapeHtml(this.state.hotspotMaterialsText).replace(/\n/g, ' / ')}</div>` : ''}
          </div>
        </div>
      `);
    }

    blocks.push(`
      <div class="card" style="margin-bottom:16px">
        <div class="card-header" style="display:flex;justify-content:space-between;align-items:center">
          <span>输入来源</span>
          <button class="btn btn-sm" id="pl-open-hotspots">去热点信息页</button>
        </div>
        <div style="font-size:12px;color:var(--muted);line-height:1.8">
          热点能力已经从工作流中拆出。你可以直接输入内容，也可以先去“热点信息”页选择热点，再回到这里生成母稿。
        </div>
      </div>
    `);

    return blocks.join('');
  },

  _bindInputSourceSummary() {
    const hotspotBtn = document.getElementById('pl-open-hotspots');
    if (hotspotBtn) {
      hotspotBtn.onclick = () => {
        location.hash = '#/hotspots';
      };
    }
  },

  async _syncDraftInputFromForm() {
    const inputEl = document.getElementById('pl-input');
    const promotionEl = document.getElementById('pl-promotion-product');
    const val = inputEl?.value.trim() || '';

    if (!val) {
      showToast('请输入素材内容', 'error');
      return false;
    }

    this.state.input = val;
    this.state.promotionProduct = promotionEl?.value.trim() || '';

    const ready = await this._ensureTaskContext();
    if (!ready) return false;

    await this._syncHotspotStage();
    await this._syncHotspotSelect();
    await this._syncHotspotEnrich({
      enrichment: this.state.input,
      facts: parseTextList(this.state.hotspotFactsText),
      constraints: parseTextList(this.state.hotspotConstraintsText),
      materials: parseTextList(this.state.hotspotMaterialsText),
    });

    return true;
  },
});
