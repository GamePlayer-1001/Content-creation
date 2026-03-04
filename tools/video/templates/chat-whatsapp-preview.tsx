/**
 * WhatsApp 聊天风格预览
 *
 * 翻倍参数（1080x1920完整分辨率）：气泡字体48px，内边距40x52px，顶部/底部各120px
 */

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BackIcon, MoreIcon, SmileIcon, MicIcon } from './chat-icons';

export const ChatWhatsAppPreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#e5ddd5', display: 'flex', flexDirection: 'column' }}>
      {/* 极简顶部栏 - 120px，WhatsApp 绿色 */}
      <div style={{ height: 120, background: '#075e54', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
        <BackIcon size={52} color="white" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)' }} />
          <div style={{ fontSize: 40, fontWeight: '600', color: 'white' }}>玄学工坊</div>
        </div>
        <MoreIcon size={52} color="white" />
      </div>

      {/* 聊天内容 - 占据大部分空间 */}
      <div style={{ flex: 1, padding: '50px 40px', display: 'flex', flexDirection: 'column', gap: 36 }}>
        {/* 接收消息 - 白色背景 */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ background: 'white', padding: '40px 52px', borderRadius: '16px 16px 16px 0', maxWidth: '72%', fontSize: 48, lineHeight: 1.6, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', position: 'relative' }}>
            大师...股票爆仓了，亏了整整200万😭
            <div style={{ fontSize: 32, color: '#667781', marginTop: 16, textAlign: 'right' }}>14:23</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ background: 'white', padding: '40px 52px', borderRadius: '16px 16px 16px 0', maxWidth: '72%', fontSize: 48, lineHeight: 1.6, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            老婆刚才把离婚协议书扔我脸上...
            <div style={{ fontSize: 32, color: '#667781', marginTop: 16, textAlign: 'right' }}>14:24</div>
          </div>
        </div>

        {/* 发送消息 - 浅绿色背景 */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#d9fdd3', padding: '40px 52px', borderRadius: '16px 16px 0 16px', maxWidth: '72%', fontSize: 48, lineHeight: 1.6, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            别慌，你还有翻盘的机会
            <div style={{ fontSize: 32, color: '#667781', marginTop: 16, textAlign: 'right' }}>14:25 ✓✓</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#d9fdd3', padding: '40px 52px', borderRadius: '16px 16px 0 16px', maxWidth: '72%', fontSize: 48, lineHeight: 1.6, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            报上你的生辰八字，我看看你的财运
            <div style={{ fontSize: 32, color: '#667781', marginTop: 16, textAlign: 'right' }}>14:25 ✓✓</div>
          </div>
        </div>
      </div>

      {/* 极简底部栏 - 120px */}
      <div style={{ height: 120, background: '#f0f0f0', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 20 }}>
        <SmileIcon size={56} color="#54656f" />
        <div style={{ flex: 1, height: 80, background: 'white', borderRadius: 40, padding: '0 32px', display: 'flex', alignItems: 'center', fontSize: 40, color: '#8696a0' }}>
          输入消息
        </div>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#00a884', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MicIcon size={48} color="white" />
        </div>
      </div>
    </AbsoluteFill>
  );
};
