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
    { section: '主入口' },
    { hash: '#/', label: '首页总览' },
    { hash: '#/hotspots', label: 'Google Sheets 热点' },
    { hash: '#/pipeline', label: '全流程工作流' },
    { hash: '#/toolbox', label: '工具箱' },

    { section: '模块直达' },
    { hash: '#/rewrite', label: '洗稿改写' },
    { hash: '#/compliance', label: '合规检查' },
    { hash: '#/review', label: '周复盘' },
    { hash: '#/content', label: '内容管理' },
    { hash: '#/config', label: '配置管理' },
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
      continue;
    }

    const active = current === item.hash ? 'active' : '';
    html += `<a class="nav-item ${active}" href="${item.hash}">${item.label}</a>`;
  }

  html += `
    <div class="nav-status">
      AI: ${engine.toUpperCase()}
    </div>
  `;

  document.getElementById('sidebar').innerHTML = html;
}
