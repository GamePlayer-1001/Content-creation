/**
 * [INPUT]: 依赖 API + StreamRenderer
 * [OUTPUT]: Views.workshop 对象
 * [POS]: views/ 的创作工坊页面 (Phase 2 完善 AI 流式)
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const WorkshopView = {
  async render() {
    const app = document.getElementById('app');

    // 加载 Skill 列表
    let skills = [];
    try { skills = await API.get('/skills'); } catch {}

    // 加载母稿列表(供选择已有母稿)
    let drafts = [];
    try { drafts = await API.get('/content/母稿'); } catch {}

    const engine = localStorage.getItem('ai_engine') || 'claude';

    let html = `<h2>创作工坊</h2>`;

    // Skill 选择
    html += `<div class="form-group">
      <label class="form-label">选择 Skill</label>
      <select class="form-select" id="ws-skill">
        ${skills.map(s => `<option value="${s.name}">${s.name}</option>`).join('')}
      </select>
    </div>`;

    // 输入模式
    html += `<div class="form-group">
      <label class="form-label">输入主题 / 关键词</label>
      <input class="form-input" id="ws-topic" placeholder="例: AI工具效率提升" />
    </div>`;

    // 或选择已有母稿
    if (drafts.length > 0) {
      html += `<div class="form-group">
        <label class="form-label">或选择已有母稿</label>
        <select class="form-select" id="ws-draft">
          <option value="">(不选，从零创作)</option>
          ${drafts.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
        </select>
      </div>`;
    }

    // AI 引擎选择
    html += `<div class="form-group">
      <label class="form-label">AI 引擎</label>
      <select class="form-select" id="ws-engine">
        <option value="claude" ${engine === 'claude' ? 'selected' : ''}>Claude CLI (本地)</option>
        <option value="openrouter" ${engine === 'openrouter' ? 'selected' : ''}>OpenRouter (云端)</option>
        <option value="deepseek" ${engine === 'deepseek' ? 'selected' : ''}>DeepSeek (云端)</option>
      </select>
    </div>`;

    // 操作按钮
    html += `<div class="btn-group">
      <button class="btn btn-primary" id="ws-generate">开始创作</button>
      <button class="btn" id="ws-stop" style="display:none">停止</button>
      <button class="btn" id="ws-save" style="display:none">保存</button>
    </div>`;

    // 输出区
    html += `<div class="stream-output" id="ws-output" style="display:none"></div>`;

    app.innerHTML = html;

    // --- 事件绑定 ---
    const engineSelect = document.getElementById('ws-engine');
    engineSelect.onchange = () => localStorage.setItem('ai_engine', engineSelect.value);

    const genBtn = document.getElementById('ws-generate');
    const stopBtn = document.getElementById('ws-stop');
    const saveBtn = document.getElementById('ws-save');
    const outputEl = document.getElementById('ws-output');

    let renderer = null;

    genBtn.onclick = async () => {
      const skill = document.getElementById('ws-skill').value;
      const topic = document.getElementById('ws-topic').value;
      const draft = document.getElementById('ws-draft')?.value || '';
      const selectedEngine = document.getElementById('ws-engine').value;

      if (!topic && !draft) {
        showToast('请输入主题或选择母稿', 'error');
        return;
      }

      outputEl.style.display = 'block';
      genBtn.style.display = 'none';
      stopBtn.style.display = 'inline-block';
      saveBtn.style.display = 'none';

      renderer = new StreamRenderer(outputEl);
      const result = await renderer.start('/create', {
        skill, topic, draft, engine: selectedEngine,
      });

      stopBtn.style.display = 'none';
      genBtn.style.display = 'inline-block';
      saveBtn.style.display = 'inline-block';
    };

    stopBtn.onclick = () => {
      if (renderer) renderer.stop();
      stopBtn.style.display = 'none';
      genBtn.style.display = 'inline-block';
    };

    saveBtn.onclick = async () => {
      if (!renderer) return;
      const content = renderer.getContent();
      const skill = document.getElementById('ws-skill').value;
      const topic = document.getElementById('ws-topic').value || 'untitled';
      const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const filename = `${today}-${topic}.md`;

      try {
        await API.put(`/content/${skill}/${filename}`, { content });
        showToast(`已保存: ${skill}/${filename}`);
      } catch (e) {
        showToast(`保存失败: ${e.message}`, 'error');
      }
    };
  }
};
