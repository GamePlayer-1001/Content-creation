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
  '#/workshop':    () => WorkshopView.render(),
  '#/distribute':  () => DistributeView.render(),
  '#/content':     () => ContentView.render(),
  '#/config':      () => ConfigView.render(),
  '#/compliance':  () => ComplianceView.render(),
  '#/rewrite':     () => RewriteView.render(),
  '#/trending':    () => TrendingView.render(),
  '#/schedule':    () => ScheduleView.render(),
  '#/review':      () => ReviewView.render(),
};

// ============================================================
//  路由切换
// ============================================================
function navigate() {
  const hash = location.hash || '#/';
  const render = ROUTES[hash];

  renderNav();

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
