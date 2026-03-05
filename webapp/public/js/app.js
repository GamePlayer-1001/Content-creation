/**
 * [INPUT]: 依赖所有 views/* + components/nav
 * [OUTPUT]: SPA 路由系统, 全局初始化
 * [POS]: js/ 的入口, 控制页面切换
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

// ============================================================
//  Hash 路由表
// ============================================================
const ROUTES = {
  '#/':            () => DashboardView.render(),
  '#/search':      () => SearchView.render(),
  '#/pipeline':    () => PipelineView.render(),
  '#/content':     () => ContentView.render(),
  '#/config':      () => ConfigView.render(),
  '#/compliance':  () => ComplianceView.render(),
  '#/rewrite':     () => RewriteView.render(),
  '#/review':      () => ReviewView.render(),
};

// 旧路由重定向
const REDIRECTS = ['#/workshop', '#/distribute', '#/schedule', '#/trending'];

// ============================================================
//  路由切换
// ============================================================
function navigate() {
  let hash = location.hash || '#/';

  // 旧路由重定向到首页
  if (REDIRECTS.includes(hash)) {
    location.hash = '#/';
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

// 初始路由
if (!location.hash) location.hash = '#/';
navigate();
