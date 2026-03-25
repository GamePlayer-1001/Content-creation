/**
 * [INPUT]: 依赖 PipelineView 状态、createDynamicLimiter 与图片 API
 * [OUTPUT]: 挂接图片阶段相关方法
 * [POS]: views/pipeline 的图片阶段模块，负责双轨提炼、单图生成与批量生图
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

Object.assign(PipelineView, {
  async _renderImage() {
    const el = document.getElementById('pipeline-content');
    const finalContents = this.state.platformResults;

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

    let html = `<h3>阶段 7：图片生成 (双轨模式)</h3>
      <p style="font-size:13px;color:var(--muted);margin-bottom:16px">
        每平台 2 张图: <strong>封面</strong>(带文字海报) + <strong>配图</strong>(视觉隐喻) — 已内置禁用蓝紫荧光色
      </p>
    `;

    html += `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
        <button class="btn btn-primary" id="pl-extract-all">智能提炼全部平台</button>
        <span id="extract-status" style="font-size:12px;color:var(--muted)"></span>
      </div>
    `;

    finalContents.forEach((item, i) => {
      const pCfg = platformConfig[item.platform] || {};
      const imageStyle = pCfg.image_style || {};
      const presets = imageStyle.presets || [];
      const defaultStyle = imageStyle.default || '';
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
                    ${presets.map((p) => `
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

    if (historyPrompts.length > 0) {
      html += `
        <div class="form-group prompt-history" style="margin-bottom:16px">
          <button class="btn btn-sm" id="pl-toggle-history">历史 Prompt</button>
          <div class="prompt-dropdown" id="prompt-dd-global">
            ${historyPrompts.map((p) => `
              <div class="prompt-item" data-text="${p.text.replace(/"/g, '&quot;')}">
                <span class="prompt-text">${p.text}</span>
                <span class="prompt-del" data-id="${p.id}">&times;</span>
              </div>`).join('')}
          </div>
        </div>`;
    }

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

    document.getElementById('pl-extract-all').onclick = () => this._extractContentDual();
    document.querySelectorAll('.style-preset-btn').forEach((btn) => {
      btn.onclick = () => {
        const idx = btn.dataset.idx;
        document.getElementById(`img-ill-style-${idx}`).value = btn.dataset.prompt;
      };
    });

    document.getElementById('pl-back5').onclick = () => {
      this._focusStage('review-optimize');
      this.render();
    };
    document.getElementById('pl-next5').onclick = () => {
      this._focusStage('layout-compose');
      this.render();
    };
    document.getElementById('pl-skip-images').onclick = () => {
      this._focusStage('layout-compose');
      this.render();
    };

    finalContents.forEach((item, i) => {
      document.getElementById(`img-gen-cover-${i}`).onclick =
        () => this._generateImageDual(i, item.platform, 'cover');
      document.getElementById(`img-gen-ill-${i}`).onclick =
        () => this._generateImageDual(i, item.platform, 'illustration');
    });

    document.getElementById('pl-gen-all-images').onclick = async () => {
      const limiter = createDynamicLimiter(2, 4, 4);
      const results = await Promise.allSettled(
        finalContents.flatMap((item, i) => [
          limiter(() => this._generateImageDual(i, item.platform, 'cover')),
          limiter(() => this._generateImageDual(i, item.platform, 'illustration')),
        ])
      );
      const failed = results.filter((r) => r.status === 'rejected').length;
      showToast(failed ? `图片生成完成, ${failed}张失败` : '全部图片生成完成 (封面+配图)');
    };
    document.getElementById('pl-gen-all-covers').onclick = async () => {
      const limiter = createDynamicLimiter(2, 4, 4);
      const results = await Promise.allSettled(
        finalContents.map((item, i) => limiter(() => this._generateImageDual(i, item.platform, 'cover')))
      );
      const failed = results.filter((r) => r.status === 'rejected').length;
      showToast(failed ? `封面生成完成, ${failed}张失败` : '全部封面生成完成');
    };
    document.getElementById('pl-gen-all-ills').onclick = async () => {
      const limiter = createDynamicLimiter(2, 4, 4);
      const results = await Promise.allSettled(
        finalContents.map((item, i) => limiter(() => this._generateImageDual(i, item.platform, 'illustration')))
      );
      const failed = results.filter((r) => r.status === 'rejected').length;
      showToast(failed ? `配图生成完成, ${failed}张失败` : '全部配图生成完成');
    };

    const historyToggle = document.getElementById('pl-toggle-history');
    if (historyToggle) {
      historyToggle.onclick = () => {
        document.getElementById('prompt-dd-global')?.classList.toggle('show');
      };
    }
    document.querySelectorAll('.prompt-item').forEach((item) => {
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

  async _extractContentDual() {
    const statusEl = document.getElementById('extract-status');
    const btn = document.getElementById('pl-extract-all');
    const platforms = this.state.platformResults.map((r) => r.platform);

    btn.disabled = true;
    statusEl.textContent = '正在双轨提炼...';

    try {
      const data = await API.post('/pipeline/extract', {
        draftContent: this.state.draftContent,
        platforms,
        engine: this.state.engine,
        taskId: this.state.taskId,
      });

      this.state.platformResults.forEach((item, i) => {
        const ext = data.extractions[item.platform];
        if (!ext) return;
        if (ext.cover) {
          const titleEl = document.getElementById(`img-cover-title-${i}`);
          const subtitleEl = document.getElementById(`img-cover-subtitle-${i}`);
          if (titleEl) titleEl.value = ext.cover.title || '';
          if (subtitleEl) subtitleEl.value = ext.cover.subtitle || '';
          this.state.coverExtractions[item.platform] = ext.cover;
        }

        const illText = ext.illustration || '';
        const illEl = document.getElementById(`img-ill-extract-${i}`);
        if (illEl) illEl.value = illText;
        this.state.illustrationExtractions[item.platform] = illText;
      });

      statusEl.textContent = '双轨提炼完成';
      showToast('智能提炼完成: 封面标题 + 配图隐喻');
    } catch (e) {
      statusEl.textContent = `提炼失败: ${e.message}`;
      showToast(`提炼失败: ${e.message}`, 'error');
    }

    btn.disabled = false;
  },

  _toggleHistory(idx) {
    const dd = document.getElementById(`prompt-dd-${idx}`);
    if (dd) dd.classList.toggle('show');
  },

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

      this.state.images = this.state.images.filter(
        (img) => !(img.platform === platform && img.imageType === imageType)
      );
      this.state.images.push({
        platform,
        imageType,
        path: result.path,
        filename: result.filename,
      });
    } catch (e) {
      previewEl.innerHTML = `<div style="color:var(--muted);font-size:12px">${typeLabel}生成失败: ${e.message}</div>`;
    }
  },
});
