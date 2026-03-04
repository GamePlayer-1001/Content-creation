/**
 * LINE 聊天风格预览
 *
 * 翻倍参数（1080x1920完整分辨率）：气泡字体48px，内边距40x52px，顶部/底部各120px
 */

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BackIcon, MoreIcon, PlusIcon, SmileIcon } from './chat-icons';

export const ChatLinePreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#d4e4f7', display: 'flex', flexDirection: 'column' }}>
      {/* 极简顶部栏 - 120px（翻倍） */}
      <div style={{ height: 120, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', borderBottom: '2px solid #e0e0e0' }}>
        <BackIcon size={52} color="#000" />
        <div style={{ fontSize: 40, fontWeight: '600', color: '#000' }}>玄学工坊</div>
        <MoreIcon size={52} color="#000" />
      </div>

      {/* 聊天内容 - 占据大部分空间 */}
      <div style={{ flex: 1, padding: '50px 40px', display: 'flex', flexDirection: 'column', gap: 40 }}>
        {/* 接收消息 */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', flexShrink: 0 }} />
          <div style={{ background: 'white', padding: '40px 52px', borderRadius: 36, maxWidth: '72%', fontSize: 48, lineHeight: 1.6, boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
            大师...股票爆仓了，亏了整整200万😭
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', flexShrink: 0 }} />
          <div style={{ background: 'white', padding: '40px 52px', borderRadius: 36, maxWidth: '72%', fontSize: 48, lineHeight: 1.6, boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
            老婆刚才把离婚协议书扔我脸上...
          </div>
        </div>

        {/* 发送消息 */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#00b900', color: 'white', padding: '40px 52px', borderRadius: 36, maxWidth: '72%', fontSize: 48, lineHeight: 1.6, boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
            别慌，你还有翻盘的机会
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#00b900', color: 'white', padding: '40px 52px', borderRadius: 36, maxWidth: '72%', fontSize: 48, lineHeight: 1.6, boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
            报上你的生辰八字，我看看你的财运
          </div>
        </div>
      </div>

      {/* 极简底部栏 - 120px（翻倍） */}
      <div style={{ height: 120, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', padding: '0 32px', gap: 20, borderTop: '2px solid #e0e0e0' }}>
        <PlusIcon size={56} color="#000" />
        <div style={{ flex: 1, height: 80, background: 'white', borderRadius: 40, border: '2px solid #ddd' }} />
        <SmileIcon size={56} color="#000" />
      </div>
    </AbsoluteFill>
  );
};
