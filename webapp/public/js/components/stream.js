/**
 * [INPUT]: 依赖 marked.js
 * [OUTPUT]: StreamRenderer 类
 * [POS]: components/ SSE 流式输出渲染器
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

class StreamRenderer {
  constructor(containerEl) {
    this.container = containerEl;
    this.content = '';
    this.abortController = null;
  }

  async start(path, body) {
    this.content = '';
    this.container.innerHTML = '<span class="stream-cursor"></span>';
    this.container.classList.add('streaming');

    this.abortController = new AbortController();

    try {
      const res = await fetch(`/api${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: this.abortController.signal,
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'chunk') {
                this.content += data.content;
                this._render();
              } else if (data.type === 'done') {
                this._finalize(data);
                return data;
              } else if (data.type === 'error') {
                this.container.classList.remove('streaming');
                showToast(data.message, 'error');
                return null;
              }
            } catch {}
          }
        }
      }
    } catch (e) {
      if (e.name !== 'AbortError') showToast(e.message, 'error');
    }

    this.container.classList.remove('streaming');
    return null;
  }

  stop() {
    if (this.abortController) this.abortController.abort();
    this.container.classList.remove('streaming');
  }

  _render() {
    if (typeof marked !== 'undefined') {
      this.container.innerHTML = marked.parse(this.content) + '<span class="stream-cursor"></span>';
    } else {
      this.container.textContent = this.content;
    }
    this.container.scrollTop = this.container.scrollHeight;
  }

  _finalize(data) {
    this.container.classList.remove('streaming');
    if (typeof marked !== 'undefined') {
      this.container.innerHTML = marked.parse(this.content);
    }
  }

  getContent() { return this.content; }
}
