import React, { useState } from 'react';
import { getPlatformById } from '../platforms.js';

export default function ExportPanel({ title, content, platform, platformVersions, draft }) {
  const [vaultPath, setVaultPath] = useState('');
  const [exporting, setExporting] = useState(false);
  const [result, setResult] = useState(null);

  const handleExportObsidian = async (targetPlatform, targetContent) => {
    if (exporting || !targetContent) return;
    setExporting(true);
    setResult(null);

    try {
      const res = await fetch('/api/export/obsidian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: targetContent,
          platform: targetPlatform,
          vaultPath: vaultPath || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ type: 'success', message: `已保存到 ${data.path}` });
      } else {
        setResult({ type: 'error', message: data.error });
      }
    } catch (err) {
      setResult({ type: 'error', message: err.message });
    } finally {
      setExporting(false);
    }
  };

  const handleCopyHtml = async () => {
    if (!content) return;
    try {
      // 简单的 Markdown→HTML 转换用于复制
      const { marked } = await import('marked');
      const html = marked.parse(content);
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([content], { type: 'text/plain' }),
        }),
      ]);
      setResult({ type: 'success', message: '已复制富文本到剪贴板，可直接粘贴到公众号编辑器' });
    } catch (err) {
      // 退回纯文本复制
      await navigator.clipboard.writeText(content);
      setResult({ type: 'success', message: '已复制 Markdown 文本到剪贴板' });
    }
  };

  const allVersions = [
    { key: 'draft', label: '母稿', content: draft },
    ...Object.entries(platformVersions).map(([k, v]) => ({
      key: k,
      label: getPlatformById(k)?.name || k,
      content: v,
    })),
  ].filter(v => v.content);

  return (
    <div className="h-full p-6 overflow-auto">
      <h2 className="text-lg font-semibold mb-6">导出保存</h2>

      {/* Obsidian Vault 路径配置 */}
      <div className="mb-6">
        <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
          Obsidian Vault 路径（留空使用 .env 配置）：
        </label>
        <input
          type="text"
          value={vaultPath}
          onChange={(e) => setVaultPath(e.target.value)}
          placeholder="D:\MyVault"
          className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      {/* 版本列表 */}
      <div className="space-y-3">
        {allVersions.map(v => (
          <div
            key={v.key}
            className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]"
          >
            <div>
              <span className="text-sm font-medium">{v.label}</span>
              <span className="text-xs text-[var(--text-secondary)] ml-2">
                {v.content.length} 字
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyHtml}
                className="px-3 py-1.5 rounded-md text-xs font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                复制富文本
              </button>
              <button
                onClick={() => handleExportObsidian(v.key, v.content)}
                disabled={exporting}
                className="px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--accent)] text-white hover:brightness-110 disabled:opacity-50 flex items-center gap-1"
              >
                {exporting ? (
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                )}
                保存到 Obsidian
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 提示信息 */}
      {result && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          result.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {result.message}
        </div>
      )}

      {allVersions.length === 0 && (
        <div className="flex flex-col items-center justify-center h-40 text-[var(--text-secondary)]/50">
          <p className="text-sm">请先生成内容</p>
        </div>
      )}
    </div>
  );
}
