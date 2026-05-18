/**
 * [INPUT]: 依赖 PipelineView 状态、API 流式请求与共享文件读写
 * [OUTPUT]: 挂接多平台改写与自然化编辑阶段相关方法
 * [POS]: views/pipeline 的平台阶段模块，负责平台勾选、改写、审查与结果保存
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

Object.assign(PipelineView, {
  _renderRewrite() {
    const el = document.getElementById('pipeline-content');
    const platformList = this._getActivePlatforms();
    const allowedSet = new Set(platformList.map((item) => item.value));
    this.state.platforms = this.state.platforms.filter((name) => allowedSet.has(name));
    this.state.platformsOptimize = this.state.platformsOptimize.filter((name) => allowedSet.has(name));
    let html = `<h3>第 2 步：根据母稿多平台改写</h3>
      <p style="font-size:13px;color:var(--muted);margin-bottom:16px">
        先选择要生成的平台，再决定哪些平台在下一步进入合规审查与去 AI 味优化。
      </p>`;

    html += `<div class="platform-grid">`;
    platformList.forEach((p) => {
      const checked = this.state.platforms.includes(p.value) ? 'checked' : '';
      html += `
        <label class="platform-check ${checked}" data-platform="${p.value}">
          <input type="checkbox" ${checked ? 'checked' : ''} />
          ${p.name}
        </label>`;
    });
    html += `</div>`;

    html += `<div class="btn-group"><button class="btn" id="pl-select-all">全选</button></div>`;

    html += `
      <div style="margin-top:16px">
        <label class="form-label">下一步进入合规审查与去 AI 味优化的平台</label>
        <div id="pl-optimize-picks" class="platform-grid" style="margin-top:4px"></div>
        <div class="btn-group" style="margin-top:4px">
          <button class="btn btn-sm" id="pl-opt-all">全选优化</button>
          <button class="btn btn-sm" id="pl-opt-none">全不优化</button>
        </div>
      </div>
    `;

    html += `
      <div class="btn-group" style="margin-top:16px">
        <button class="btn btn-primary" id="pl-gen-platforms">开始生成</button>
        <button class="btn" id="pl-stop-platforms" style="display:none">停止</button>
      </div>
    `;

    html += `<div id="pl-platform-results"></div>`;
    html += `<div id="pl-optimize-stream"></div>`;

    html += `
      <div class="pipeline-nav">
        <button class="btn" id="pl-back3">上一步</button>
        <button class="btn btn-primary" id="pl-next3" ${this.state.platformResults.length === 0 ? 'disabled' : ''}>
          下一步: 合规审查与去 AI 味
        </button>
      </div>
    `;

    el.innerHTML = html;

    if (this.state.platformResults.length > 0) {
      this._showPlatformResults();
    }

    this._updateOptimizeChecks();

    document.querySelectorAll('.platform-check').forEach((label) => {
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
      this.state.platforms = platformList.map((p) => p.value);
      document.querySelectorAll('.platform-check').forEach((label) => {
        label.classList.add('checked');
        label.querySelector('input').checked = true;
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

    document.getElementById('pl-back3').onclick = () => {
      this._focusStage('draft-generate');
      this.render();
    };
    document.getElementById('pl-next3').onclick = () => {
      this._focusStage('review-optimize');
      this.render();
    };

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

        const toOptimize = this.state.platformResults.filter(
          (r) => this.state.platformsOptimize.includes(r.platform)
        );

        if (toOptimize.length > 0) {
          resultsEl.innerHTML += '<div class="loading" style="margin-top:12px">合规审查与去 AI 味处理中...</div>';
          await this._runOptimize(toOptimize, optStreamEl);
        }

        document.getElementById('pl-next3').disabled = false;
        this._showPlatformResults();
        showToast(toOptimize.length > 0 ? '多平台改写与审查优化完成' : '多平台改写完成');
      } catch (e) {
        showToast(e.message, 'error');
      }

      stopBtn.style.display = 'none';
      genBtn.style.display = 'inline-block';
    };
  },

  _renderReview() {
    const el = document.getElementById('pipeline-content');
    const reviewedPlatforms = this.state.platformResults.filter((item) => this.state.platformsOptimize.includes(item.platform));
    const skippedPlatforms = this.state.platformResults.filter((item) => !this.state.platformsOptimize.includes(item.platform));

    let html = `<h3>第 3 步：合规审查这些多平台文章 + 去 AI 味优化</h3>
      <p style="font-size:13px;color:var(--muted);margin-bottom:16px">
        这里展示已经完成审查优化的平台结果。未勾选的平台会保留改写结果，直接进入后续步骤。
      </p>
    `;

    html += `
      <div class="card" style="margin-bottom:16px">
        <div class="card-header">审查范围</div>
        <div style="font-size:12px;line-height:1.8;color:var(--muted)">
          已纳入审查优化: ${reviewedPlatforms.length > 0 ? reviewedPlatforms.map((item) => escapeHtml(item.platform)).join('、') : '未选择平台'}
          <br>
          仅保留改写结果: ${skippedPlatforms.length > 0 ? skippedPlatforms.map((item) => escapeHtml(item.platform)).join('、') : '无'}
        </div>
      </div>
      <div id="pl-platform-results"></div>
      <div id="pl-optimize-stream"></div>
      <div class="pipeline-nav">
        <button class="btn" id="pl-back-review">上一步</button>
        <button class="btn btn-primary" id="pl-next-review" ${this.state.platformResults.length === 0 ? 'disabled' : ''}>
          下一步: 生成多张配图
        </button>
      </div>
    `;

    el.innerHTML = html;
    this._showPlatformResults();

    document.getElementById('pl-back-review').onclick = () => {
      this._focusStage('platform-rewrite');
      this.render();
    };
    document.getElementById('pl-next-review').onclick = () => {
      this._focusStage('visual-generate');
      this.render();
    };
  },

  _updateOptimizeChecks() {
    const el = document.getElementById('pl-optimize-picks');
    if (!el) return;

    this.state.platformsOptimize = this.state.platformsOptimize.filter(
      (p) => this.state.platforms.includes(p)
    );

    if (this.state.platforms.length === 0) {
      el.innerHTML = '<span style="color:var(--muted);font-size:12px">请先选择平台</span>';
      return;
    }

    let html = '';
    this.state.platforms.forEach((p) => {
      const checked = this.state.platformsOptimize.includes(p) ? 'checked' : '';
      html += `
        <label class="platform-check opt-pick ${checked}" data-platform="${p}">
          <input type="checkbox" ${checked ? 'checked' : ''} />
          ${p}
        </label>`;
    });
    el.innerHTML = html;

    el.querySelectorAll('.opt-pick').forEach((label) => {
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

  async _runOptimize(toOptimize, streamEl) {
    const contents = toOptimize.map((r) => ({
      platform: r.platform,
      content: r.content,
      file: r.file,
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
            `${data.platform} · 合规 ${data.score}分 · 编辑中...`;
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
        const pr = this.state.platformResults.find((item) => item.platform === data.platform);
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
    if (!el) return;
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

    el.querySelectorAll('.pr-save-btn').forEach((btn) => {
      btn.onclick = async () => {
        const idx = Number.parseInt(btn.dataset.idx, 10);
        const r = this.state.platformResults[idx];
        const textarea = document.getElementById(`pr-edit-${idx}`);
        if (!textarea || !r.file) return;
        try {
          await this._writeSharedExecutionText(r.file, textarea.value);
          r.content = textarea.value;
          r.length = textarea.value.length;
          btn.closest('.collapsible').querySelector('.collapsible-header').childNodes[0].textContent = `${r.platform} (${r.length}字) `;
          showToast(`${r.platform} 已保存`);
        } catch (e) {
          showToast(`保存失败: ${e.message}`, 'error');
        }
      };
    });
  },
});
