import React, { useState } from 'react';
import { PLATFORM_GROUPS } from '../platforms.js';

export default function EditorPanel({
  draft,
  platformVersions,
  activePlatform,
  setActivePlatform,
  onContentUpdate,
  onPlatformAdapted,
  generating,
  setGenerating,
}) {
  const [adaptingPlatform, setAdaptingPlatform] = useState(null);

  const currentContent = platformVersions[activePlatform] || draft;

  const handleAdapt = async (platform) => {
    if (generating || adaptingPlatform) return;
    setAdaptingPlatform(platform);
    setGenerating(true);
    setActivePlatform(platform);

    try {
      const response = await fetch('/api/generate/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: draft, platform }),
      });

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
            if (data.type === 'chunk') {
              fullContent += data.content;
              onPlatformAdapted(platform, fullContent);
            } else if (data.type === 'done') {
              onPlatformAdapted(platform, data.content);
            }
          } catch {}
        }
      }
    } catch (err) {
      console.error('平台适配失败:', err);
    } finally {
      setGenerating(false);
      setAdaptingPlatform(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 平台选择栏 */}
      <div className="flex items-center gap-1 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--bg-secondary)] overflow-x-auto">
        <button
          onClick={() => setActivePlatform('draft')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
            activePlatform === 'draft' || !platformVersions[activePlatform]
              ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
          }`}
        >
          母稿
        </button>
        {PLATFORM_GROUPS.map((group, gi) => (
          <React.Fragment key={group.label}>
            {gi > 0 && <div className="w-px h-5 bg-[var(--border)] mx-1 shrink-0" />}
            {group.platforms.map(p => {
              const hasVersion = !!platformVersions[p.id];
              const isAdapting = adaptingPlatform === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => hasVersion ? setActivePlatform(p.id) : handleAdapt(p.id)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1 shrink-0 ${
                    activePlatform === p.id && hasVersion
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                      : hasVersion
                        ? 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                        : 'text-[var(--text-secondary)]/60 border border-dashed border-[var(--border)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)]'
                  }`}
                  disabled={isAdapting}
                  title={`${group.label} - ${p.name}`}
                >
                  {isAdapting ? (
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                  ) : null}
                  {p.name}
                  {!hasVersion && !isAdapting && <span className="text-[10px] opacity-60">+</span>}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* 编辑区 */}
      <div className="flex-1 flex overflow-hidden">
        <textarea
          value={currentContent}
          onChange={(e) => onContentUpdate(e.target.value)}
          className="w-full h-full p-6 bg-[var(--bg-primary)] text-[var(--text-primary)] text-sm leading-relaxed resize-none focus:outline-none font-mono"
          placeholder="母稿内容将显示在这里..."
        />
      </div>
    </div>
  );
}
