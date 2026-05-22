import React, { useState, useEffect } from 'react';

export default function ConfigModal({ open, onClose }) {
  const [config, setConfig] = useState({
    textApiBase: '',
    textApiKey: '',
    textModel: 'gpt-4o',
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!open) return;
    fetch('/api/config')
      .then(r => r.json())
      .then(data => {
        setConfig({
          textApiBase: data.textApiBase || '',
          textApiKey: '', // 不回显 key
          textModel: data.textModel || 'gpt-4o',
        });
      });
  }, [open]);

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      const body = {};
      if (config.textApiBase) body.textApiBase = config.textApiBase;
      if (config.textApiKey) body.textApiKey = config.textApiKey;
      if (config.textModel) body.textModel = config.textModel;
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setMsg(data.success ? '配置已保存' : '保存失败');
    } catch (e) {
      setMsg('保存失败: ' + e.message);
    }
    setSaving(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl shadow-2xl w-[520px] p-6"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">API 配置</h2>
        <p className="text-xs text-[var(--text-secondary)] mb-4">
          图片 API (gpt-image-2) 已预配置。文字生成需要配置支持 OpenAI Chat Completions API 的服务。
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">
              文字 API Base URL
            </label>
            <input
              type="text"
              value={config.textApiBase}
              onChange={e => setConfig(c => ({ ...c, textApiBase: e.target.value }))}
              placeholder="https://api.openai.com/v1"
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent)]"
            />
            <div className="mt-1 text-[10px] text-[var(--text-secondary)]/60 space-y-0.5">
              <p>OpenAI: https://api.openai.com/v1</p>
              <p>DeepSeek: https://api.deepseek.com/v1</p>
              <p>通义千问: https://dashscope.aliyuncs.com/compatible-mode/v1</p>
              <p>OpenRouter: https://openrouter.ai/api/v1</p>
            </div>
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">
              API Key
            </label>
            <input
              type="password"
              value={config.textApiKey}
              onChange={e => setConfig(c => ({ ...c, textApiKey: e.target.value }))}
              placeholder="sk-..."
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)] mb-1 block">
              模型名称
            </label>
            <input
              type="text"
              value={config.textModel}
              onChange={e => setConfig(c => ({ ...c, textModel: e.target.value }))}
              placeholder="gpt-4o"
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        {msg && (
          <p className={`text-xs mt-3 ${msg.includes('成功') || msg.includes('保存') ? 'text-green-600' : 'text-red-600'}`}>
            {msg}
          </p>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
          >
            关闭
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[var(--accent)] text-white hover:brightness-110 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
