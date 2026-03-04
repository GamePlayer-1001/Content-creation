/**
 * [INPUT]: 无
 * [OUTPUT]: 全局 Toast 函数
 * [POS]: components/ 通知组件
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

function showToast(msg, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), duration);
}
