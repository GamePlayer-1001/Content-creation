/**
 * [INPUT]: 依赖 API + createEditor
 * [OUTPUT]: Views.config 对象
 * [POS]: views/ 的配置管理页面
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const ConfigView = {
  currentFile: null,
  editor: null,

  async render() {
    const app = document.getElementById('app');
    let files = [];
    try { files = await API.get('/config'); } catch {}

    let html = `<h2>配置管理</h2>`;
    html += `<div style="display:flex;gap:24px">`;

    // 左侧文件列表
    html += `<div style="min-width:200px">`;
    for (const f of files) {
      html += `
        <div class="file-item" data-config="${f.name}" style="cursor:pointer">
          <span class="file-name">${f.name}</span>
          <span class="file-meta">${(f.size / 1024).toFixed(1)}K</span>
        </div>
      `;
    }
    html += `</div>`;

    // 右侧编辑器
    html += `<div style="flex:1">
      <div id="config-editor-area">
        <div class="empty">选择左侧配置文件</div>
      </div>
    </div>`;

    html += `</div>`;
    app.innerHTML = html;

    // 文件点击
    document.querySelectorAll('[data-config]').forEach(item => {
      item.onclick = () => this._loadConfig(item.dataset.config);
    });
  },

  async _loadConfig(name) {
    const area = document.getElementById('config-editor-area');
    try {
      const { raw } = await API.get(`/config/${name}`);
      this.currentFile = name;

      area.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <h3>${name}</h3>
          <button class="btn btn-primary btn-sm" id="config-save">保存</button>
        </div>
        <div id="config-editor"></div>
      `;

      this.editor = createEditor('config-editor', { value: raw, rows: 25 });

      document.getElementById('config-save').onclick = async () => {
        try {
          await API.put(`/config/${name}`, { raw: this.editor.getValue() });
          showToast(`${name} 已保存`);
        } catch (e) { showToast(e.message, 'error'); }
      };
    } catch (e) { area.innerHTML = `<div class="empty">${e.message}</div>`; }
  }
};
