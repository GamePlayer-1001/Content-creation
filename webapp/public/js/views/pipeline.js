/**
 * [INPUT]: 依赖 API + StreamRenderer
 * [OUTPUT]: Views.pipeline 对象
 * [POS]: views/ 的内容流水线页面, 5步向导式创作核心
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const PipelineView = {
  // ============================================================
  //  状态管理
  // ============================================================
  state: {
    step: 0,
    input: '',
    style: '',
    engine: 'claude',
    draftContent: '',
    draftFile: '',
    platforms: [],
    platformsOptimize: [],
    platformResults: [],
    images: [],
    imageExtractions: {},
    imageStylePrompts: {},
    finalResults: [],
  },

  STEPS: [
    { label: '输入素材', key: 'input' },
    { label: '生成母稿', key: 'draft' },
    { label: '多平台生成', key: 'platforms' },
    { label: '图片生成', key: 'image' },
    { label: '最终输出', key: 'output' },
  ],

  STYLES: [
    { key: 'contrarian', name: '反对大众观点', desc: '大家都说XX对，但其实...' },
    { key: 'fresh', name: '提出新观点', desc: '没人这么想过，但如果...' },
    { key: 'debunk', name: '反对旧观点提新', desc: '传统做法是XX，更好的是...' },
    { key: 'extend', name: '剖析引申新价值', desc: '大家都知道XX，但很少人意识到...' },
    { key: 'contrast', name: '反差冲突对比', desc: '你以为是A，其实是B' },
    { key: 'review', name: '对比评测', desc: '多维度横评，数据说话' },
    { key: 'deconstruct', name: '深度拆解', desc: '逐层剖析底层逻辑' },
    { key: 'predict', name: '趋势预判', desc: '信号→趋势→预测' },
  ],

  PLATFORMS: [
    { skill: '公众号', dir: '公众号', group: 'A' },
    { skill: '知乎', dir: '知乎', group: 'A' },
    { skill: 'linuxdo', dir: 'linuxdo', group: 'B' },
    { skill: 'GitHub', dir: 'GitHub', group: 'B' },
    { skill: '小红书', dir: '小红书', group: 'C' },
    { skill: '即刻', dir: '即刻', group: 'C' },
    { skill: 'Medium', dir: 'Medium', group: 'D' },
    { skill: 'Quora', dir: 'Quora', group: 'D' },
    { skill: 'X推文', dir: 'X', group: 'E' },
    { skill: 'Reddit', dir: 'Reddit', group: 'E' },
    { skill: '朋友圈', dir: '朋友圈', group: 'F' },
  ],

  // ============================================================
  //  渲染入口
  // ============================================================
  async render() {
    const app = document.getElementById('app');
    this.state.engine = localStorage.getItem('ai_engine') || 'claude';

    let html = `<h2>内容流水线</h2>`;

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
  //  Step 1: 输入素材
  // ============================================================
  _renderInput() {
    const el = document.getElementById('pipeline-content');
    el.innerHTML = `
      <h3>输入素材</h3>
      <p style="font-size:13px;color:var(--muted);margin-bottom:16px">
        输入关键词、想法、长文本或热帖内容作为创作素材
      </p>
      <div class="form-group">
        <label class="form-label">素材内容</label>
        <textarea class="form-textarea" id="pl-input" placeholder="输入关键词、想法、或粘贴一段长文本/热帖内容..."
          style="min-height:250px">${this.state.input}</textarea>
      </div>
      <div class="pipeline-nav">
        <span></span>
        <button class="btn btn-primary" id="pl-next1">下一步: 生成母稿</button>
      </div>
    `;

    document.getElementById('pl-next1').onclick = () => {
      const val = document.getElementById('pl-input').value.trim();
      if (!val) { showToast('请输入素材内容', 'error'); return; }
      this.state.input = val;
      this.state.step = 1;
      this.render();
    };
  },

  // ============================================================
  //  Step 2: 选择创作方向 + 生成母稿
  // ============================================================
  _renderDraft() {
    const el = document.getElementById('pipeline-content');
    let html = `<h3>选择创作方向 & AI 引擎</h3>`;

    // 创作方向
    html += `<div class="style-grid">`;
    this.STYLES.forEach(s => {
      const sel = this.state.style === s.key ? 'selected' : '';
      html += `
        <div class="style-option ${sel}" data-style="${s.key}">
          <div class="style-name">${s.name}</div>
          <div class="style-desc">${s.desc}</div>
        </div>`;
    });
    html += `</div>`;

    // AI 引擎
    html += `
      <div class="form-group">
        <label class="form-label">AI 引擎</label>
        <select class="form-select" id="pl-engine">
          <option value="claude" ${this.state.engine === 'claude' ? 'selected' : ''}>Claude CLI (本地)</option>
          <option value="openrouter" ${this.state.engine === 'openrouter' ? 'selected' : ''}>OpenRouter (云端)</option>
          <option value="deepseek" ${this.state.engine === 'deepseek' ? 'selected' : ''}>DeepSeek (云端)</option>
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
      outputEl.style.display = 'block';
      genBtn.style.display = 'none';
      stopBtn.style.display = 'inline-block';

      renderer = new StreamRenderer(outputEl);
      const result = await renderer.start('/pipeline/draft', {
        input: this.state.input,
        style: this.state.style,
        engine: this.state.engine,
      });

      stopBtn.style.display = 'none';
      genBtn.style.display = 'inline-block';

      if (result && renderer.getContent()) {
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
    let html = `<h3>选择目标平台</h3>`;

    // 平台选择
    html += `<div class="platform-grid">`;
    this.PLATFORMS.forEach(p => {
      const checked = this.state.platforms.includes(p.skill) ? 'checked' : '';
      html += `
        <label class="platform-check ${checked}" data-platform="${p.skill}">
          <input type="checkbox" ${checked ? 'checked' : ''} />
          ${p.skill}
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
      this.state.platforms = this.PLATFORMS.map(p => p.skill);
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
      contents, engine: this.state.engine,
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
  //  Step 4: 图片生成 (智能提炼 + 双框 + 风格模板 + 后端翻译)
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

    let html = `<h3>图片生成</h3>
      <p style="font-size:13px;color:var(--muted);margin-bottom:16px">
        AI 智能提炼文章主题 + 风格模板 → 后端翻译 → 生成配图 (Nano Banana Pro)
      </p>
    `;

    // --- 全局操作栏 ---
    html += `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
        <button class="btn btn-primary" id="pl-extract-all">智能提炼全部平台</button>
        <span id="extract-status" style="font-size:12px;color:var(--muted)"></span>
      </div>
    `;

    // --- 每个平台的卡片 ---
    finalContents.forEach((item, i) => {
      const pCfg = platformConfig[item.platform] || {};
      const imageStyle = pCfg.image_style || {};
      const presets = imageStyle.presets || [];
      const defaultStyle = imageStyle.default || '为以下内容生成配图，美观精致，色调自然，避免AI蓝AI紫：';

      // 恢复之前的值
      const savedExtraction = this.state.imageExtractions[item.platform] || '';
      const savedStyle = this.state.imageStylePrompts[item.platform] || defaultStyle;

      html += `
        <div class="card" style="margin-bottom:12px">
          <div class="card-header">${item.platform}</div>

          <!-- 文章提炼 (画什么) -->
          <div class="form-group">
            <label style="font-size:12px;color:var(--muted);margin-bottom:4px;display:block">文章提炼 (画什么)</label>
            <textarea class="form-textarea" id="img-extract-${i}"
              style="min-height:60px"
              placeholder="点击「智能提炼」自动填充，或手动输入核心视觉主题..."
              data-platform="${item.platform}">${savedExtraction}</textarea>
          </div>

          <!-- 风格提示词 (怎么画) -->
          <div class="form-group">
            <label style="font-size:12px;color:var(--muted);margin-bottom:4px;display:block">风格提示词 (怎么画)</label>
            ${presets.length > 0 ? `
              <div style="margin-bottom:6px">
                ${presets.map(p => `
                  <button class="btn btn-sm style-preset-btn"
                    data-idx="${i}" data-prompt="${p.prompt.replace(/"/g, '&quot;')}"
                    style="margin-right:4px;margin-bottom:4px">${p.name}</button>
                `).join('')}
              </div>
            ` : ''}
            <textarea class="form-textarea" id="img-style-${i}"
              style="min-height:50px"
              placeholder="风格描述..."
              data-platform="${item.platform}">${savedStyle}</textarea>
          </div>

          <!-- 历史 Prompt -->
          ${historyPrompts.length > 0 ? `
            <div class="form-group prompt-history">
              <button class="btn btn-sm" onclick="PipelineView._toggleHistory(${i})" style="margin-bottom:4px">
                历史 Prompt
              </button>
              <div class="prompt-dropdown" id="prompt-dd-${i}">
                ${historyPrompts.map(p => `
                  <div class="prompt-item" data-idx="${i}" data-text="${p.text.replace(/"/g, '&quot;')}">
                    <span class="prompt-text">${p.text}</span>
                    <span class="prompt-del" data-id="${p.id}">&times;</span>
                  </div>`).join('')}
              </div>
            </div>` : ''}

          <!-- 操作区 -->
          <div class="form-group" style="margin-bottom:0">
            <select class="form-select" id="img-ratio-${i}" style="width:auto;display:inline-block">
              <option value="1:1">1:1 正方</option>
              <option value="4:3">4:3 横屏</option>
              <option value="16:9">16:9 宽屏</option>
              <option value="9:16">9:16 竖屏</option>
            </select>
            <select class="form-select" id="img-size-${i}" style="width:auto;display:inline-block;margin-left:6px">
              <option value="1K">1K 标准</option>
              <option value="2K">2K 高清</option>
              <option value="4K">4K 超清</option>
            </select>
            <button class="btn btn-sm" id="img-gen-${i}" data-idx="${i}">生成</button>
            <button class="btn btn-sm" id="img-save-prompt-${i}" data-idx="${i}" data-platform="${item.platform}">保存提示词</button>
          </div>
          <div id="img-preview-${i}" style="margin-top:8px"></div>
        </div>
      `;
    });

    html += `
      <div class="btn-group" style="margin-top:16px">
        <button class="btn btn-primary" id="pl-gen-all-images">全部生成</button>
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

    // 智能提炼
    document.getElementById('pl-extract-all').onclick = () => this._extractContent();

    // 风格预设按钮 → 填入提示词框
    document.querySelectorAll('.style-preset-btn').forEach(btn => {
      btn.onclick = () => {
        const idx = btn.dataset.idx;
        document.getElementById(`img-style-${idx}`).value = btn.dataset.prompt;
      };
    });

    // 导航
    document.getElementById('pl-back5').onclick = () => { this.state.step = 2; this.render(); };
    document.getElementById('pl-next5').onclick = () => { this.state.step = 4; this.render(); };
    document.getElementById('pl-skip-images').onclick = () => { this.state.step = 4; this.render(); };

    // 保存提示词
    finalContents.forEach((item, i) => {
      const saveBtn = document.getElementById(`img-save-prompt-${i}`);
      if (saveBtn) {
        saveBtn.onclick = async () => {
          const style = document.getElementById(`img-style-${i}`)?.value?.trim() || '';
          const extract = document.getElementById(`img-extract-${i}`)?.value?.trim() || '';
          const text = (style + '\n' + extract).trim();
          if (!text) { showToast('请先填写内容', 'error'); return; }
          try {
            await API.post('/image/prompts', { text, platform: item.platform });
            showToast('提示词已保存');
          } catch (e) { showToast('保存失败: ' + e.message, 'error'); }
        };
      }
    });

    // 单个平台生成
    finalContents.forEach((item, i) => {
      const genBtn = document.getElementById(`img-gen-${i}`);
      if (genBtn) {
        genBtn.onclick = () => this._generateImage(i, item.platform);
      }
    });

    // 全部生成
    document.getElementById('pl-gen-all-images').onclick = async () => {
      for (let i = 0; i < finalContents.length; i++) {
        await this._generateImage(i, finalContents[i].platform);
      }
      showToast('全部图片生成完成');
    };

    // Prompt 历史点击
    document.querySelectorAll('.prompt-item').forEach(item => {
      item.onclick = (e) => {
        if (e.target.classList.contains('prompt-del')) {
          const id = e.target.dataset.id;
          API.del(`/image/prompts/${id}`).then(() => this._renderImage());
          return;
        }
        const idx = item.dataset.idx;
        const text = item.dataset.text;
        // 历史 prompt 填入提炼框
        document.getElementById(`img-extract-${idx}`).value = text;
        document.getElementById(`prompt-dd-${idx}`).classList.remove('show');
      };
    });
  },

  // --- 智能提炼: 调用 AI 批量提取视觉主题 ---
  async _extractContent() {
    const statusEl = document.getElementById('extract-status');
    const btn = document.getElementById('pl-extract-all');
    const platforms = this.state.platformResults.map(r => r.platform);

    btn.disabled = true;
    statusEl.textContent = '正在提炼...';

    try {
      const data = await API.post('/pipeline/extract', {
        draftContent: this.state.draftContent,
        platforms,
        engine: this.state.engine,
      });

      // 填充到每个平台的提炼框
      this.state.platformResults.forEach((item, i) => {
        const text = data.extractions[item.platform] || '';
        const textarea = document.getElementById(`img-extract-${i}`);
        if (textarea) textarea.value = text;
        this.state.imageExtractions[item.platform] = text;
      });

      statusEl.textContent = '提炼完成';
      showToast('智能提炼完成，可手动调整');
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

  // --- 生成单张图片: 双框拼接 → 后端翻译 → Gemini ---
  async _generateImage(idx, platform) {
    const extractEl = document.getElementById(`img-extract-${idx}`);
    const styleEl = document.getElementById(`img-style-${idx}`);
    const ratioEl = document.getElementById(`img-ratio-${idx}`);
    const sizeEl = document.getElementById(`img-size-${idx}`);
    const previewEl = document.getElementById(`img-preview-${idx}`);

    const extraction = extractEl?.value?.trim() || '';
    const stylePrompt = styleEl?.value?.trim() || '';

    if (!extraction && !stylePrompt) {
      showToast(`请输入 ${platform} 的图片描述`, 'error');
      return;
    }

    // 保存到 state (步骤切换时恢复)
    this.state.imageExtractions[platform] = extraction;
    this.state.imageStylePrompts[platform] = stylePrompt;

    previewEl.innerHTML = `<div class="image-loading">翻译 + 生成中...</div>`;

    try {
      const result = await API.post('/image/generate', {
        extraction,
        stylePrompt,
        platform,
        topic: this.state.input.slice(0, 20),
        index: idx,
        aspectRatio: ratioEl.value,
        imageSize: sizeEl.value,
        engine: this.state.engine,
      });

      previewEl.innerHTML = `
        <div class="image-card">
          <img src="data:${result.mimeType};base64,${result.base64}" alt="${platform}" />
          <div class="image-info">
            <span>${result.filename}</span>
            <a href="data:${result.mimeType};base64,${result.base64}"
               download="${result.filename}" class="btn btn-sm">下载</a>
          </div>
        </div>
      `;

      // 保存图片信息
      this.state.images = this.state.images.filter(img => img.platform !== platform);
      this.state.images.push({ platform, path: result.path, filename: result.filename });
    } catch (e) {
      previewEl.innerHTML = `<div style="color:var(--muted);font-size:12px">生成失败: ${e.message}</div>`;
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
      this.state = {
        step: 0, input: '', style: '', engine: this.state.engine,
        draftContent: '', draftFile: '', platforms: [],
        platformsOptimize: [], platformResults: [], images: [], finalResults: [],
      };
      this.render();
    };

    document.getElementById('pl-assemble').onclick = async () => {
      const btn = document.getElementById('pl-assemble');
      btn.disabled = true;
      btn.textContent = '组装中...';

      try {
        const contents = finalContents.map(r => ({
          platform: r.platform,
          content: r.content || '',
          file: r.file || '',
        }));

        const result = await API.post('/pipeline/assemble', {
          contents,
          images: this.state.images,
        });

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
