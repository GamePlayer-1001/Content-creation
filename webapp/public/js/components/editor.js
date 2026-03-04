/**
 * [INPUT]: 无
 * [OUTPUT]: createEditor 函数
 * [POS]: components/ Markdown/YAML 文本编辑器
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

function createEditor(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const textarea = document.createElement('textarea');
  textarea.className = 'form-textarea';
  textarea.value = options.value || '';
  textarea.placeholder = options.placeholder || '';
  if (options.rows) textarea.rows = options.rows;

  container.innerHTML = '';
  container.appendChild(textarea);

  return {
    getValue: () => textarea.value,
    setValue: (v) => { textarea.value = v; },
    focus: () => textarea.focus(),
    el: textarea,
  };
}
