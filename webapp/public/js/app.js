/**
 * [INPUT]: 依赖所有 views/* + components/nav
 * [OUTPUT]: SPA 路由系统，全局初始化
 * [POS]: js/ 的入口，控制页面切换
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

// ============================================================
//  Hash 路由表
// ============================================================
const ROUTES = {
  '#/':           () => DashboardView.render(),
  '#/hotspots':   () => SearchView.render(),
  '#/search':     () => SearchView.render(),
  '#/pipeline':   () => PipelineView.render(),
  '#/toolbox':    () => ToolboxView.render(),
  '#/content':    () => ContentView.render(),
  '#/config':     () => ConfigView.render(),
  '#/compliance': () => ComplianceView.render(),
  '#/rewrite':    () => RewriteView.render(),
  '#/review':     () => ReviewView.render(),
};

// 旧路由重定向
const REDIRECTS = ['#/workshop', '#/distribute', '#/schedule', '#/trending'];
const ROUTE_ALIASES = {
  '#/search': '#/hotspots',
};

// ============================================================
//  路由切换
// ============================================================
function navigate() {
  const hash = location.hash || '#/';

  if (REDIRECTS.includes(hash)) {
    location.hash = '#/';
    return;
  }

  if (ROUTE_ALIASES[hash]) {
    location.hash = ROUTE_ALIASES[hash];
    return;
  }

  renderNav();

  const render = ROUTES[hash];
  if (render) {
    render();
  } else {
    document.getElementById('app').innerHTML = `<div class="empty">页面不存在: ${hash}</div>`;
  }
}

// ============================================================
//  初始化
// ============================================================
window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', navigate);

if (!location.hash) location.hash = '#/';
navigate();
