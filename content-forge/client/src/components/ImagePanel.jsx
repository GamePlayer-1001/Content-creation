import React, { useState, useEffect } from 'react';

export default function ImagePanel({ content, images, setImages }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatingIdx, setGeneratingIdx] = useState(-1);
  const [customPrompt, setCustomPrompt] = useState('');

  // 自动提取配图建议
  useEffect(() => {
    if (!content) return;
    fetch('/api/image/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) setSuggestions(data.suggestions);
      })
      .catch(() => {});
  }, [content]);

  const handleGenerate = async (prompt, idx) => {
    if (loading) return;
    setLoading(true);
    setGeneratingIdx(idx);

    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, size: '1536x1024' }),
      });
      const data = await res.json();
      if (data.success && data.images.length > 0) {
        const newImg = {
          url: data.images[0].url || `data:image/png;base64,${data.images[0].b64}`,
          prompt,
          description: prompt,
        };
        setImages(prev => [...prev, newImg]);
      }
    } catch (err) {
      console.error('图片生成失败:', err);
    } finally {
      setLoading(false);
      setGeneratingIdx(-1);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 overflow-auto">
      <h2 className="text-lg font-semibold mb-4">配图管理</h2>

      {/* 配图建议 */}
      {suggestions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
            从文章提取的配图需求：
          </h3>
          <div className="flex flex-col gap-2">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]"
              >
                <span className="flex-1 text-sm text-[var(--text-primary)]">{s}</span>
                <button
                  onClick={() => handleGenerate(s, i)}
                  disabled={loading}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--accent)] text-white hover:brightness-110 disabled:opacity-50 flex items-center gap-1"
                >
                  {generatingIdx === i ? (
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                  )}
                  生成
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 自定义配图 */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">自定义配图：</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="输入图片描述（英文效果更好）..."
            className="flex-1 px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customPrompt.trim()) {
                handleGenerate(customPrompt.trim(), -2);
                setCustomPrompt('');
              }
            }}
          />
          <button
            onClick={() => {
              if (customPrompt.trim()) {
                handleGenerate(customPrompt.trim(), -2);
                setCustomPrompt('');
              }
            }}
            disabled={loading || !customPrompt.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent)] text-white hover:brightness-110 disabled:opacity-50"
          >
            生成
          </button>
        </div>
      </div>

      {/* 已生成的图片 */}
      {images.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">
            已生成 ({images.length})：
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {images.map((img, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)]">
                <img src={img.url} alt={img.prompt} className="w-full aspect-video object-cover" />
                <div className="p-2">
                  <p className="text-xs text-[var(--text-secondary)] truncate">{img.prompt}</p>
                  <button
                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="text-xs text-red-500 hover:text-red-700 mt-1"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 空状态 */}
      {images.length === 0 && suggestions.length === 0 && (
        <div className="flex flex-col items-center justify-center h-40 text-[var(--text-secondary)]/50">
          <p className="text-sm">生成文章后会自动提取配图需求</p>
        </div>
      )}
    </div>
  );
}
