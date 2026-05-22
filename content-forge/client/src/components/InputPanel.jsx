import React, { useState, useRef } from 'react';

export default function InputPanel({ topic, setTopic, generating, setGenerating, onDraftGenerated }) {
  const [context, setContext] = useState('');
  const [streamContent, setStreamContent] = useState('');
  const abortRef = useRef(null);

  const handleGenerate = async () => {
    if (!topic.trim() || generating) return;
    setGenerating(true);
    setStreamContent('');

    try {
      const response = await fetch('/api/generate/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), context: context.trim() }),
      });

      if (!response.ok) {
        let errMsg = `服务器错误 (${response.status})`;
        try {
          const errData = await response.json();
          errMsg = errData.error || errMsg;
        } catch {}
        setStreamContent(`⚠️ 生成失败：${errMsg}`);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(trimmed.slice(6));
            if (data.type === 'phase') {
              // 两阶段生成的进度指示：清空之前内容，显示当前阶段
              fullContent = '';
              setStreamContent(data.content + '\n\n');
            } else if (data.type === 'chunk') {
              fullContent += data.content;
              setStreamContent(fullContent);
            } else if (data.type === 'done') {
              fullContent = data.content;
              onDraftGenerated(fullContent);
            } else if (data.type === 'error') {
              console.error('生成错误:', data.message);
            }
          } catch {}
        }
      }
    } catch (err) {
      console.error('请求失败:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="h-full flex">
      {/* 左侧输入 */}
      <div className="w-1/2 p-6 flex flex-col border-r border-[var(--border)]">
        <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
          创作主题
        </h2>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="输入你想写的主题，比如：AI 时代普通人的 10 个赚钱机会"
          className="w-full px-4 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)] transition-colors text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />

        <h3 className="text-sm font-medium mt-6 mb-2 text-[var(--text-secondary)]">
          补充素材（可选）
        </h3>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="粘贴参考资料、核心观点、关键数据等素材..."
          className="flex-1 w-full px-4 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:outline-none focus:border-[var(--accent)] transition-colors text-sm resize-none"
          rows={8}
        />

        <button
          onClick={handleGenerate}
          disabled={!topic.trim() || generating}
          className="mt-4 px-6 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 bg-[var(--accent)] text-white hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              正在生成母稿...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>
              </svg>
              生成母稿
            </>
          )}
        </button>
      </div>

      {/* 右侧实时预览 */}
      <div className="w-1/2 p-6 overflow-auto">
        <h2 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
          {generating ? '正在生成...' : streamContent ? '生成完成' : '等待输入'}
        </h2>
        {streamContent ? (
          <div className="prose max-w-none text-sm leading-relaxed whitespace-pre-wrap text-[var(--text-primary)]/90">
            {streamContent}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-[var(--text-secondary)]/50">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-30">
              <path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>
            </svg>
            <p className="text-sm">输入主题后点击「生成母稿」</p>
            <p className="text-xs mt-1 opacity-60">AI 会参考范文库学习人类写作风格</p>
          </div>
        )}
      </div>
    </div>
  );
}
