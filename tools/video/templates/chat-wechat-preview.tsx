/**
 * 微信聊天风格预览
 *
 * 翻倍参数（1080x1920完整分辨率）：气泡字体48px，内边距40x52px，顶部/底部各120px
 */

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BackIcon, MoreIcon, VoiceIcon, SmileIcon, PlusIcon } from './chat-icons';

export const ChatWeChatPreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#ededed', display: 'flex', flexDirection: 'column' }}>
      {/* 极简顶部栏 - 120px（翻倍） */}
      <div style={{ height: 120, background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', borderBottom: '1px solid #d9d9d9' }}>
        <BackIcon size={52} color="#000" />
        <div style={{ fontSize: 40, fontWeight: '600', color: '#000' }}>玄学工坊</div>
        <MoreIcon size={52} color="#000" />
      </div>

      {/* 聊天内容 - 占据大部分空间 */}
      <div style={{ flex: 1, padding: '50px 40px', display: 'flex', flexDirection: 'column', gap: 40 }}>
        {/* 接收消息 */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ width: 104, height: 104, borderRadius: 12, background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 68 }}>
            ☯
          </div>
          <div style={{ background: 'white', padding: '40px 52px', borderRadius: 16, maxWidth: '72%', fontSize: 48, lineHeight: 1.6, boxShadow: '0 4px 12px rgba(0,0,0,0.12)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: -16, top: 40, width: 0, height: 0, borderTop: '16px solid transparent', borderBottom: '16px solid transparent', borderRight: '16px solid white' }} />
            大师...股票爆仓了，亏了整整200万😭
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ width: 104, height: 104, borderRadius: 12, background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 68 }}>
            ☯
          </div>
          <div style={{ background: 'white', padding: '40px 52px', borderRadius: 16, maxWidth: '72%', fontSize: 48, lineHeight: 1.6, boxShadow: '0 4px 12px rgba(0,0,0,0.12)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: -16, top: 40, width: 0, height: 0, borderTop: '16px solid transparent', borderBottom: '16px solid transparent', borderRight: '16px solid white' }} />
            老婆刚才把离婚协议书扔我脸上...
          </div>
        </div>

        {/* 发送消息 */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#95ec69', padding: '40px 52px', borderRadius: 16, maxWidth: '72%', fontSize: 48, lineHeight: 1.6, boxShadow: '0 4px 12px rgba(0,0,0,0.12)', position: 'relative' }}>
            <div style={{ position: 'absolute', right: -16, top: 40, width: 0, height: 0, borderTop: '16px solid transparent', borderBottom: '16px solid transparent', borderLeft: '16px solid #95ec69' }} />
            别慌，你还有翻盘的机会
          </div>
          <div style={{ width: 104, height: 104, borderRadius: 12, background: '#576b95', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 68 }}>
            👤
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#95ec69', padding: '40px 52px', borderRadius: 16, maxWidth: '72%', fontSize: 48, lineHeight: 1.6, boxShadow: '0 4px 12px rgba(0,0,0,0.12)', position: 'relative' }}>
            <div style={{ position: 'absolute', right: -16, top: 40, width: 0, height: 0, borderTop: '16px solid transparent', borderBottom: '16px solid transparent', borderLeft: '16px solid #95ec69' }} />
            报上你的生辰八字，我看看你的财运
          </div>
          <div style={{ width: 104, height: 104, borderRadius: 12, background: '#576b95', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 68 }}>
            👤
          </div>
        </div>
      </div>

      {/* 极简底部栏 - 120px（翻倍） */}
      <div style={{ height: 120, background: '#f7f7f7', display: 'flex', alignItems: 'center', padding: '0 32px', gap: 20, borderTop: '1px solid #d9d9d9' }}>
        <VoiceIcon size={56} color="#000" />
        <div style={{ flex: 1, height: 76, background: 'white', borderRadius: 12, border: '2px solid #d9d9d9' }} />
        <SmileIcon size={56} color="#000" />
        <PlusIcon size={56} color="#000" />
      </div>
    </AbsoluteFill>
  );
};
