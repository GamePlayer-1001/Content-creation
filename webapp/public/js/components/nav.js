/**
 * [INPUT]: 无
 * [OUTPUT]: renderNav 函数
 * [POS]: components/ 侧边导航栏
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

function renderNav() {
  const current = location.hash || '#/';
  const engine = localStorage.getItem('ai_engine') || 'claude';

  const items = [
    { section: '概览' },
    { hash: '#/',          label: '仪表盘' },

    { section: '创作' },
    { hash: '#/search',    label: '热帖搜索' },
    { hash: '#/pipeline',  label: '内容流水线' },
    { hash: '#/rewrite',   label: '洗稿' },

    { section: '管理' },
    { hash: '#/content',    label: '内容管理' },
    { hash: '#/compliance', label: '合规检查' },
    { hash: '#/config',     label: '配置管理' },

    { section: '工具' },
    { hash: '#/review',     label: '周复盘' },
  ];

  let html = `
    <div class="nav-brand">
      <h1>内容工具集</h1>
      <p>Web 控制台</p>
    </div>
  `;

  for (const item of items) {
    if (item.section) {
      html += `<div class="nav-section">${item.section}</div>`;
    } else {
      const active = current === item.hash ? 'active' : '';
      html += `<a class="nav-item ${active}" href="${item.hash}">${item.label}</a>`;
    }
  }

  html += `
    <div class="nav-status">
      AI: ${engine.toUpperCase()}
    </div>
  `;

  document.getElementById('sidebar').innerHTML = html;
}
