/**
 * [INPUT]: 依赖 API + StreamRenderer
 * [OUTPUT]: RewriteView 对象
 * [POS]: views/ 的洗稿页面, 5 种风格 SSE 改写
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const RewriteView = {
  async render() {
    const app = document.getElementById('app');

    let drafts = [];
    try { drafts = await API.get('/content/母稿'); } catch {}

    const styles = [
      { id: 'A', name: '个人故事型', desc: '第一人称叙事，沉浸感强' },
      { id: 'B', name: '对话场景型', desc: '对话体，轻松易读' },
      { id: 'C', name: '情感共鸣型', desc: '情感导向，共鸣触发' },
      { id: 'D', name: '优化版', desc: '结构优化，逻辑清晰' },
      { id: 'E', name: '口语重写版', desc: '最强口语化，降AI检测' },
    ];

    const engine = localStorage.getItem('ai_engine') || 'claude';

    let html = `<h2>洗稿</h2>`;

    html += `<div class="form-group">
      <label class="form-label">选择源文件</label>
      <select class="form-select" id="rw-source">
        <option value="">-- 请选择 --</option>
        ${drafts.map(d => `<option value="${d.name}">${d.name}</option>`).join('')}
      </select>
    </div>`;

    html += `<div class="form-group">
      <label class="form-label">改写风格</label>
      <div class="btn-group" id="rw-styles">
        ${styles.map(s => `
          <button class="btn" data-style="${s.id}" title="${s.desc}">${s.id}. ${s.name}</button>
        `).join('')}
      </div>
    </div>`;

    html += `<div class="form-group">
      <label class="form-label">AI 引擎</label>
      <select class="form-select" id="rw-engine">
        <option value="claude" ${engine === 'claude' ? 'selected' : ''}>Claude CLI</option>
        <option value="openrouter" ${engine === 'openrouter' ? 'selected' : ''}>OpenRouter</option>
        <option value="deepseek" ${engine === 'deepseek' ? 'selected' : ''}>DeepSeek</option>
      </select>
    </div>`;

    html += `<div class="btn-group">
      <button class="btn btn-primary" id="rw-start">开始改写</button>
      <button class="btn" id="rw-stop" style="display:none">停止</button>
    </div>`;

    html += `<div class="stream-output" id="rw-output" style="display:none"></div>`;

    app.innerHTML = html;

    // 风格选择
    let selectedStyle = 'A';
    document.querySelectorAll('#rw-styles .btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('#rw-styles .btn').forEach(b => b.classList.remove('btn-primary'));
        btn.classList.add('btn-primary');
        selectedStyle = btn.dataset.style;
      };
    });
    document.querySelector('#rw-styles .btn').classList.add('btn-primary');

    let renderer = null;

    document.getElementById('rw-start').onclick = async () => {
      const source = document.getElementById('rw-source').value;
      if (!source) { showToast('请选择源文件', 'error'); return; }

      const selectedEngine = document.getElementById('rw-engine').value;
      const outputEl = document.getElementById('rw-output');
      outputEl.style.display = 'block';

      document.getElementById('rw-start').style.display = 'none';
      document.getElementById('rw-stop').style.display = 'inline-block';

      renderer = new StreamRenderer(outputEl);
      const result = await renderer.start('/rewrite', {
        source, style: selectedStyle, engine: selectedEngine,
      });

      document.getElementById('rw-stop').style.display = 'none';
      document.getElementById('rw-start').style.display = 'inline-block';

      if (result) {
        showToast(`改写完成: ${result.file} (${result.length} 字)`);
      }
    };

    document.getElementById('rw-stop').onclick = () => {
      if (renderer) renderer.stop();
      document.getElementById('rw-stop').style.display = 'none';
      document.getElementById('rw-start').style.display = 'inline-block';
    };
  }
};
