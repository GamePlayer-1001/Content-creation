/**
 * 4种聊天软件风格对比
 *
 * 用于生成静态截图，展示不同聊天平台的视觉效果
 */

import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';

// 聊天消息数据
const messages = [
  { id: 1, type: 'received', text: '大师...股票爆仓了，亏了整整200万😭', time: '14:23' },
  { id: 2, type: 'received', text: '老婆刚才把离婚协议书扔我脸上...', time: '14:24' },
  { id: 3, type: 'sent', text: '别慌，你还有翻盘的机会', time: '14:25' },
  { id: 4, type: 'sent', text: '报上你的生辰八字，我看看你的财运', time: '14:25' },
  { id: 5, type: 'received', text: '1985年10月28日，晚上11点17分', time: '14:26' },
  { id: 6, type: 'sent', text: '你命中财星被冲，但3天内有贵人相助！', time: '14:27' },
];

export const ChatStylesComparison: React.FC = () => {
  return (
    <AbsoluteFill style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
      {/* LINE 风格 - 左上 */}
      <Sequence from={0}>
        <LineStyle />
      </Sequence>

      {/* WhatsApp 风格 - 右上 */}
      <Sequence from={0}>
        <WhatsAppStyle />
      </Sequence>

      {/* 微信风格 - 左下 */}
      <Sequence from={0}>
        <WeChatStyle />
      </Sequence>

      {/* Messenger 风格 - 右下 */}
      <Sequence from={0}>
        <MessengerStyle />
      </Sequence>
    </AbsoluteFill>
  );
};

// ============================================================================
// LINE 风格（蓝色背景）
// ============================================================================

const LineStyle: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', background: '#d4e4f7', display: 'flex', flexDirection: 'column' }}>
      {/* 极简顶部栏 */}
      <div style={{ height: 80, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ fontSize: 24 }}>←</div>
        <div style={{ fontSize: 20, fontWeight: '600' }}>玄学工坊</div>
        <div style={{ fontSize: 24 }}>⋮</div>
      </div>

      {/* 聊天内容 - 占据大部分空间 */}
      <div style={{ flex: 1, padding: '20px 15px', display: 'flex', flexDirection: 'column', gap: 15 }}>
        {/* 接收消息 */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#00b900', flexShrink: 0 }} />
          <div style={{ background: 'white', padding: '15px 18px', borderRadius: 18, maxWidth: '75%', fontSize: 18, lineHeight: 1.5, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            大师...股票爆仓了，亏了整整200万😭
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#00b900', flexShrink: 0 }} />
          <div style={{ background: 'white', padding: '15px 18px', borderRadius: 18, maxWidth: '75%', fontSize: 18, lineHeight: 1.5, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            老婆刚才把离婚协议书扔我脸上...
          </div>
        </div>

        {/* 发送消息 */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#00b900', color: 'white', padding: '15px 18px', borderRadius: 18, maxWidth: '75%', fontSize: 18, lineHeight: 1.5, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            别慌，你还有翻盘的机会
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#00b900', color: 'white', padding: '15px 18px', borderRadius: 18, maxWidth: '75%', fontSize: 18, lineHeight: 1.5, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            报上你的生辰八字，我看看你的财运
          </div>
        </div>
      </div>

      {/* 极简底部栏 */}
      <div style={{ height: 70, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', padding: '0 15px', gap: 10, borderTop: '1px solid #e0e0e0' }}>
        <div style={{ fontSize: 28 }}>➕</div>
        <div style={{ flex: 1, height: 42, background: 'white', borderRadius: 21, border: '1px solid #ddd' }} />
        <div style={{ fontSize: 28 }}>😊</div>
      </div>
    </div>
  );
};

// ============================================================================
// WhatsApp 风格（米色背景）
// ============================================================================

const WhatsAppStyle: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', background: '#e5ddd5', display: 'flex', flexDirection: 'column' }}>
      {/* 极简顶部栏 */}
      <div style={{ height: 80, background: '#075e54', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
        <div style={{ fontSize: 24, color: 'white' }}>←</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 45, height: 45, borderRadius: '50%', background: '#25d366' }} />
          <div style={{ fontSize: 20, fontWeight: '600', color: 'white' }}>玄学工坊</div>
        </div>
        <div style={{ fontSize: 24, color: 'white' }}>⋮</div>
      </div>

      {/* 聊天内容 - 占据大部分空间 */}
      <div style={{ flex: 1, padding: '20px 15px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* 接收消息 */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ background: 'white', padding: '12px 16px', borderRadius: '8px 8px 8px 0', maxWidth: '75%', fontSize: 18, lineHeight: 1.5, boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
            大师...股票爆仓了，亏了整整200万😭
            <div style={{ fontSize: 13, color: '#667781', marginTop: 4, textAlign: 'right' }}>14:23</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ background: 'white', padding: '12px 16px', borderRadius: '8px 8px 8px 0', maxWidth: '75%', fontSize: 18, lineHeight: 1.5, boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
            老婆刚才把离婚协议书扔我脸上...
            <div style={{ fontSize: 13, color: '#667781', marginTop: 4, textAlign: 'right' }}>14:24</div>
          </div>
        </div>

        {/* 发送消息 */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#d9fdd3', padding: '12px 16px', borderRadius: '8px 8px 0 8px', maxWidth: '75%', fontSize: 18, lineHeight: 1.5, boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
            别慌，你还有翻盘的机会
            <div style={{ fontSize: 13, color: '#667781', marginTop: 4, textAlign: 'right' }}>14:25</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#d9fdd3', padding: '12px 16px', borderRadius: '8px 8px 0 8px', maxWidth: '75%', fontSize: 18, lineHeight: 1.5, boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
            报上你的生辰八字，我看看你的财运
            <div style={{ fontSize: 13, color: '#667781', marginTop: 4, textAlign: 'right' }}>14:25</div>
          </div>
        </div>
      </div>

      {/* 极简底部栏 */}
      <div style={{ height: 70, background: '#f0f0f0', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
        <div style={{ fontSize: 28, color: '#54656f' }}>😊</div>
        <div style={{ flex: 1, height: 42, background: 'white', borderRadius: 21, padding: '0 15px', display: 'flex', alignItems: 'center', fontSize: 17, color: '#667781' }}>
          输入消息
        </div>
        <div style={{ fontSize: 28, color: '#54656f' }}>📎</div>
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#00a884', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: 'white' }}>
          🎤
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 微信风格（灰白背景）
// ============================================================================

const WeChatStyle: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', background: '#ededed', display: 'flex', flexDirection: 'column' }}>
      {/* 极简顶部栏 */}
      <div style={{ height: 75, background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', borderBottom: '0.5px solid #d9d9d9' }}>
        <div style={{ fontSize: 22, color: '#000' }}>‹</div>
        <div style={{ fontSize: 19, fontWeight: '600', color: '#000' }}>玄学工坊</div>
        <div style={{ fontSize: 22, color: '#000' }}>⋯</div>
      </div>

      {/* 聊天内容 - 占据大部分空间，气泡更大 */}
      <div style={{ flex: 1, padding: '25px 18px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* 接收消息 */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 52, height: 52, borderRadius: 6, background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
            ☯
          </div>
          <div style={{ background: 'white', padding: '16px 20px', borderRadius: 8, maxWidth: '70%', fontSize: 20, lineHeight: 1.6, boxShadow: '0 2px 4px rgba(0,0,0,0.08)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: -8, top: 16, width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '8px solid white' }} />
            大师...股票爆仓了，亏了整整200万😭
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 52, height: 52, borderRadius: 6, background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
            ☯
          </div>
          <div style={{ background: 'white', padding: '16px 20px', borderRadius: 8, maxWidth: '70%', fontSize: 20, lineHeight: 1.6, boxShadow: '0 2px 4px rgba(0,0,0,0.08)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: -8, top: 16, width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '8px solid white' }} />
            老婆刚才把离婚协议书扔我脸上...
          </div>
        </div>

        {/* 发送消息 */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#95ec69', padding: '16px 20px', borderRadius: 8, maxWidth: '70%', fontSize: 20, lineHeight: 1.6, boxShadow: '0 2px 4px rgba(0,0,0,0.08)', position: 'relative' }}>
            <div style={{ position: 'absolute', right: -8, top: 16, width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '8px solid #95ec69' }} />
            别慌，你还有翻盘的机会
          </div>
          <div style={{ width: 52, height: 52, borderRadius: 6, background: '#576b95', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
            👤
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#95ec69', padding: '16px 20px', borderRadius: 8, maxWidth: '70%', fontSize: 20, lineHeight: 1.6, boxShadow: '0 2px 4px rgba(0,0,0,0.08)', position: 'relative' }}>
            <div style={{ position: 'absolute', right: -8, top: 16, width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '8px solid #95ec69' }} />
            报上你的生辰八字，我看看你的财运
          </div>
          <div style={{ width: 52, height: 52, borderRadius: 6, background: '#576b95', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
            👤
          </div>
        </div>
      </div>

      {/* 极简底部栏 */}
      <div style={{ height: 70, background: '#f7f7f7', display: 'flex', alignItems: 'center', padding: '0 15px', gap: 10, borderTop: '0.5px solid #d9d9d9' }}>
        <div style={{ fontSize: 26 }}>🎤</div>
        <div style={{ flex: 1, height: 40, background: 'white', borderRadius: 6, border: '1px solid #d9d9d9' }} />
        <div style={{ fontSize: 26 }}>😊</div>
        <div style={{ fontSize: 26 }}>➕</div>
      </div>
    </div>
  );
};

// ============================================================================
// Messenger 风格（白色背景，紫色气泡）
// ============================================================================

const MessengerStyle: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', background: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* 极简顶部栏 */}
      <div style={{ height: 80, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '1px solid #e4e6eb' }}>
        <div style={{ fontSize: 24, color: '#050505' }}>←</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 45, height: 45, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)' }} />
          <div style={{ fontSize: 20, fontWeight: '600', color: '#050505' }}>玄学工坊</div>
        </div>
        <div style={{ display: 'flex', gap: 15 }}>
          <div style={{ fontSize: 24, color: '#0084ff' }}>📞</div>
          <div style={{ fontSize: 24, color: '#0084ff' }}>🎥</div>
        </div>
      </div>

      {/* 聊天内容 - 占据大部分空间 */}
      <div style={{ flex: 1, padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* 接收消息 - 灰色背景 */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', flexShrink: 0 }} />
          <div style={{ background: '#e4e6eb', color: '#050505', padding: '14px 18px', borderRadius: 20, maxWidth: '75%', fontSize: 18, lineHeight: 1.5 }}>
            大师...股票爆仓了，亏了整整200万😭
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginLeft: 50 }}>
          <div style={{ background: '#e4e6eb', color: '#050505', padding: '14px 18px', borderRadius: 20, maxWidth: '75%', fontSize: 18, lineHeight: 1.5 }}>
            老婆刚才把离婚协议书扔我脸上...
          </div>
        </div>

        {/* 发送消息 - 蓝紫色渐变 */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: 'linear-gradient(135deg, #0084ff 0%, #00c6ff 100%)', color: 'white', padding: '14px 18px', borderRadius: 20, maxWidth: '75%', fontSize: 18, lineHeight: 1.5 }}>
            别慌，你还有翻盘的机会
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: 'flex-end', marginRight: 0 }}>
          <div style={{ background: 'linear-gradient(135deg, #0084ff 0%, #00c6ff 100%)', color: 'white', padding: '14px 18px', borderRadius: 20, maxWidth: '75%', fontSize: 18, lineHeight: 1.5 }}>
            报上你的生辰八字，我看看你的财运
          </div>
        </div>
      </div>

      {/* 极简底部栏 */}
      <div style={{ height: 70, background: 'white', display: 'flex', alignItems: 'center', padding: '0 15px', gap: 10, borderTop: '1px solid #e4e6eb' }}>
        <div style={{ fontSize: 28, color: '#0084ff' }}>➕</div>
        <div style={{ fontSize: 28, color: '#0084ff' }}>📷</div>
        <div style={{ flex: 1, height: 40, background: '#f0f2f5', borderRadius: 20, padding: '0 15px', display: 'flex', alignItems: 'center', fontSize: 17, color: '#65676b' }}>
          Aa
        </div>
        <div style={{ fontSize: 28, color: '#0084ff' }}>👍</div>
      </div>
    </div>
  );
};
