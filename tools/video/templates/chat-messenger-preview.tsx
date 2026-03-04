/**
 * Messenger 聊天风格预览
 *
 * 翻倍参数（1080x1920完整分辨率）：气泡字体48px，内边距40x52px，顶部/底部各120px
 */

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BackIcon, PhoneIcon, VideoIcon, PlusIcon, ThumbsUpIcon } from './chat-icons';

export const ChatMessengerPreview: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* 极简顶部栏 - 120px */}
      <div style={{ height: 120, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px', borderBottom: '2px solid #e4e6eb' }}>
        <BackIcon size={52} color="#050505" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)' }} />
          <div style={{ fontSize: 40, fontWeight: '600', color: '#050505' }}>玄学工坊</div>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          <PhoneIcon size={52} color="#0084ff" />
          <VideoIcon size={52} color="#0084ff" />
        </div>
      </div>

      {/* 聊天内容 - 占据大部分空间 */}
      <div style={{ flex: 1, padding: '50px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* 接收消息 - 灰色背景 */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', flexShrink: 0 }} />
          <div style={{ background: '#e4e6eb', color: '#050505', padding: '40px 52px', borderRadius: 40, maxWidth: '72%', fontSize: 48, lineHeight: 1.6 }}>
            大师...股票爆仓了，亏了整整200万😭
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginLeft: 104 }}>
          <div style={{ background: '#e4e6eb', color: '#050505', padding: '40px 52px', borderRadius: 40, maxWidth: '72%', fontSize: 48, lineHeight: 1.6 }}>
            老婆刚才把离婚协议书扔我脸上...
          </div>
        </div>

        {/* 发送消息 - 蓝色渐变 */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: 'linear-gradient(135deg, #0084ff 0%, #00c6ff 100%)', color: 'white', padding: '40px 52px', borderRadius: 40, maxWidth: '72%', fontSize: 48, lineHeight: 1.6 }}>
            别慌，你还有翻盘的机会
          </div>
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'flex-end', marginRight: 0 }}>
          <div style={{ background: 'linear-gradient(135deg, #0084ff 0%, #00c6ff 100%)', color: 'white', padding: '40px 52px', borderRadius: 40, maxWidth: '72%', fontSize: 48, lineHeight: 1.6 }}>
            报上你的生辰八字，我看看你的财运
          </div>
        </div>
      </div>

      {/* 极简底部栏 - 120px */}
      <div style={{ height: 120, background: 'white', display: 'flex', alignItems: 'center', padding: '0 28px', gap: 20, borderTop: '2px solid #e4e6eb' }}>
        <PlusIcon size={56} color="#0084ff" />
        <div style={{ flex: 1, height: 80, background: '#f0f2f5', borderRadius: 40, padding: '0 32px', display: 'flex', alignItems: 'center', fontSize: 40, color: '#65676b' }}>
          Aa
        </div>
        <ThumbsUpIcon size={56} color="#0084ff" />
      </div>
    </AbsoluteFill>
  );
};
