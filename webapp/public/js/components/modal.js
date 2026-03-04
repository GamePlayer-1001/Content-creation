/**
 * [INPUT]: 无
 * [OUTPUT]: showModal / closeModal 函数
 * [POS]: components/ 模态框
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

function showModal(title, contentHTML, buttons = []) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

  let btns = buttons.map(b =>
    `<button class="btn ${b.primary ? 'btn-primary' : ''}" data-action="${b.action}">${b.label}</button>`
  ).join('');

  overlay.innerHTML = `
    <div class="modal-box">
      <h3>${title}</h3>
      <div>${contentHTML}</div>
      ${btns ? `<div class="btn-group" style="margin-top:16px">${btns}</div>` : ''}
    </div>
  `;

  overlay.querySelectorAll('[data-action]').forEach(btn => {
    btn.onclick = () => {
      const b = buttons.find(x => x.action === btn.dataset.action);
      if (b && b.onClick) b.onClick();
      overlay.remove();
    };
  });

  document.body.appendChild(overlay);
  return overlay;
}

function closeModal() {
  document.querySelector('.modal-overlay')?.remove();
}
