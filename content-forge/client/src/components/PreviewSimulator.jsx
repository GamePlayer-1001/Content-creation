import React, { useMemo, useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import { PLATFORM_GROUPS, ALL_PLATFORMS, getPlatformById } from '../platforms.js';

function PhoneFrame({ children, width, platform }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative bg-[#1a1a1a] rounded-[40px] p-3 shadow-2xl"
        style={{ width: width + 24 }}
      >
        {/* 刘海 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-[#1a1a1a] rounded-b-2xl z-10" />

        {/* 屏幕 */}
        <div
          className="relative bg-white rounded-[28px] overflow-hidden"
          style={{ width, height: 720 }}
        >
          {/* 状态栏 */}
          <div className="h-12 bg-white flex items-end justify-between px-6 pb-1 text-[11px] font-medium text-gray-800 sticky top-0 z-10">
            <span>12:32</span>
            <div className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
            </div>
          </div>

          {/* 平台导航栏 */}
          <div className="h-11 bg-white border-b border-gray-100 flex items-center px-4 sticky top-12 z-10">
            <span className="text-sm font-semibold text-gray-900">
              {getPlatformById(platform)?.name || '预览'}
            </span>
          </div>

          {/* 内容区 */}
          <div
            className={`overflow-y-auto platform-${platform}`}
            style={{ height: 720 - 48 - 44 }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreviewSimulator({ content, platform, onPlatformChange, images, onContentUpdate }) {
  const [editContent, setEditContent] = useState(content || '');
  const editorRef = useRef(null);

  useEffect(() => {
    setEditContent(content || '');
  }, [content]);

  const handleEdit = (val) => {
    setEditContent(val);
    if (onContentUpdate) onContentUpdate(val);
  };

  const renderedHtml = useMemo(() => {
    if (!editContent) return '';

    marked.setOptions({ breaks: true, gfm: true });
    let html = marked.parse(editContent);

    html = html.replace(
      /&lt;!--\s*IMAGE:\s*(.+?)\s*--&gt;/g,
      (_, desc) => {
        const img = images.find(i => i.prompt?.includes(desc) || i.description?.includes(desc));
        if (img?.url) {
          return `<figure style="margin:16px 0;text-align:center"><img src="${img.url}" alt="${desc}" style="max-width:100%;border-radius:6px"/><figcaption style="font-size:12px;color:#999;margin-top:6px">${desc}</figcaption></figure>`;
        }
        return `<div style="margin:16px 0;padding:32px;background:#f5f5f7;border-radius:8px;text-align:center;color:#999;font-size:13px;border:2px dashed #ddd">配图位置：${desc}</div>`;
      }
    );

    return html;
  }, [editContent, images]);

  const currentPlatform = getPlatformById(platform);

  // 统计信息
  const charCount = editContent.length;
  const wordCount = editContent.replace(/\s+/g, '').length;

  return (
    <div className="h-full flex flex-col">
      {/* 平台切换栏 */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <span className="text-xs text-[var(--text-secondary)] mr-2">预览平台：</span>
        {PLATFORM_GROUPS.map((group, gi) => (
          <React.Fragment key={group.label}>
            {gi > 0 && <div className="w-px h-5 bg-[var(--border)] mx-1 shrink-0" />}
            {group.platforms.map(p => (
              <button
                key={p.id}
                onClick={() => onPlatformChange(p.id)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
                  platform === p.id
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                }`}
              >
                {p.name}
              </button>
            ))}
          </React.Fragment>
        ))}
        <div className="ml-auto text-xs text-[var(--text-secondary)]">
          {wordCount} 字
        </div>
      </div>

      {/* 左右分栏 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：文章编辑器 */}
        <div className="w-1/2 flex flex-col border-r border-[var(--border)]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-tertiary)]">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-secondary)]">
                <path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>
              </svg>
              <span className="text-xs font-medium text-[var(--text-secondary)]">Markdown 编辑</span>
            </div>
          </div>
          {editContent ? (
            <textarea
              ref={editorRef}
              value={editContent}
              onChange={(e) => handleEdit(e.target.value)}
              className="flex-1 w-full p-5 text-sm leading-relaxed bg-[var(--bg-primary)] text-[var(--text-primary)] resize-none focus:outline-none font-mono"
              spellCheck={false}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-secondary)]/50">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-30">
                <path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>
              </svg>
              <p className="text-sm">请先生成内容</p>
            </div>
          )}
        </div>

        {/* 右侧：手机模拟器 */}
        <div className="w-1/2 overflow-auto flex justify-center items-start py-6 bg-[var(--bg-tertiary)]">
          {editContent ? (
            <PhoneFrame width={currentPlatform.width} platform={platform}>
              <div
                className="preview-frame"
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            </PhoneFrame>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-[var(--text-secondary)]/50">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-30">
                <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>
              </svg>
              <p className="text-sm">请先生成内容</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
