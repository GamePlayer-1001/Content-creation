/**
 * 4种聊天软件风格对比 - 优化版
 *
 * 使用方案A参数：气泡字体24px，内边距20x26px，顶部/底部各60px
 * 完全还原参考图的视觉质量
 */

import React from 'react';
import { AbsoluteFill } from 'remotion';

// 精简消息数据（每个平台显示4-5条）
const messages = [
  { type: 'received', text: '大师...股票爆仓了，亏了整整200万😭' },
  { type: 'received', text: '老婆刚才把离婚协议书扔我脸上...' },
  { type: 'sent', text: '别慌，你还有翻盘的机会' },
  { type: 'sent', text: '报上你的生辰八字，我看看你的财运' },
];

export const ChatStylesPreviewOptimized: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#f0f0f0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', width: '100%', height: '100%', gap: 0 }}>
        {/* LINE 风格 - 左上 */}
        <div style={{ background: '#d4e4f7' }}>
          <LineStyle />
        </div>

        {/* WhatsApp 风格 - 右上 */}
        <div style={{ background: '#e5ddd5' }}>
          <WhatsAppStyle />
        </div>

        {/* 微信风格 - 左下 */}
        <div style={{ background: '#ededed' }}>
          <WeChatStyle />
        </div>

        {/* Messenger 风格 - 右下 */}
        <div style={{ background: 'white' }}>
          <MessengerStyle />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// LINE 风格（蓝色背景）
// ============================================================================

const LineStyle: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 极简顶部栏 - 60px */}
      <div style={{ height: 60, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ fontSize: 20 }}>←</div>
        <div style={{ fontSize: 16, fontWeight: '600' }}>玄学工坊</div>
        <div style={{ fontSize: 20 }}>⋮</div>
      </div>

      {/* 聊天内容 - 占据大部分空间 */}
      <div style={{ flex: 1, padding: '25px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* 接收消息 */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', flexShrink: 0 }} />
          <div style={{ background: 'white', padding: '20px 26px', borderRadius: 18, maxWidth: '72%', fontSize: 24, lineHeight: 1.6, boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}>
            大师...股票爆仓了，亏了整整200万😭
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', flexShrink: 0 }} />
          <div style={{ background: 'white', padding: '20px 26px', borderRadius: 18, maxWidth: '72%', fontSize: 24, lineHeight: 1.6, boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}>
            老婆刚才把离婚协议书扔我脸上...
          </div>
        </div>

        {/* 发送消息 */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#00b900', color: 'white', padding: '20px 26px', borderRadius: 18, maxWidth: '72%', fontSize: 24, lineHeight: 1.6, boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}>
            别慌，你还有翻盘的机会
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#00b900', color: 'white', padding: '20px 26px', borderRadius: 18, maxWidth: '72%', fontSize: 24, lineHeight: 1.6, boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}>
            报上你的生辰八字
          </div>
        </div>
      </div>

      {/* 极简底部栏 - 60px */}
      <div style={{ height: 60, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8, borderTop: '1px solid #e0e0e0' }}>
        <div style={{ fontSize: 24 }}>➕</div>
        <div style={{ flex: 1, height: 38, background: 'white', borderRadius: 19, border: '1px solid #ddd' }} />
        <div style={{ fontSize: 24 }}>😊</div>
      </div>
    </div>
  );
};

// ============================================================================
// WhatsApp 风格（米色背景）
// ============================================================================

const WhatsAppStyle: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 极简顶部栏 - 60px，WhatsApp 绿色 */}
      <div style={{ height: 60, background: '#075e54', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <div style={{ fontSize: 20, color: 'white' }}>←</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)' }} />
          <div style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>玄学工坊</div>
        </div>
        <div style={{ fontSize: 20, color: 'white' }}>⋮</div>
      </div>

      {/* 聊天内容 - 占据大部分空间 */}
      <div style={{ flex: 1, padding: '25px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* 接收消息 - 白色背景 */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ background: 'white', padding: '20px 26px', borderRadius: '8px 8px 8px 0', maxWidth: '72%', fontSize: 24, lineHeight: 1.6, boxShadow: '0 2px 6px rgba(0,0,0,0.15)', position: 'relative' }}>
            大师...股票爆仓了，亏了整整200万😭
            <div style={{ fontSize: 15, color: '#667781', marginTop: 6, textAlign: 'right' }}>14:23</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ background: 'white', padding: '20px 26px', borderRadius: '8px 8px 8px 0', maxWidth: '72%', fontSize: 24, lineHeight: 1.6, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
            老婆刚才把离婚协议书扔我脸上...
            <div style={{ fontSize: 15, color: '#667781', marginTop: 6, textAlign: 'right' }}>14:24</div>
          </div>
        </div>

        {/* 发送消息 - 浅绿色背景 */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#d9fdd3', padding: '20px 26px', borderRadius: '8px 8px 0 8px', maxWidth: '72%', fontSize: 24, lineHeight: 1.6, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
            别慌，你还有翻盘的机会
            <div style={{ fontSize: 15, color: '#667781', marginTop: 6, textAlign: 'right' }}>14:25 ✓✓</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#d9fdd3', padding: '20px 26px', borderRadius: '8px 8px 0 8px', maxWidth: '72%', fontSize: 24, lineHeight: 1.6, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
            报上你的生辰八字
            <div style={{ fontSize: 15, color: '#667781', marginTop: 6, textAlign: 'right' }}>14:25 ✓✓</div>
          </div>
        </div>
      </div>

      {/* 极简底部栏 - 60px */}
      <div style={{ height: 60, background: '#f0f0f0', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
        <div style={{ fontSize: 24, color: '#54656f' }}>😊</div>
        <div style={{ flex: 1, height: 38, background: 'white', borderRadius: 19, padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 18, color: '#8696a0' }}>
          输入消息
        </div>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#00a884', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: 'white' }}>
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
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 极简顶部栏 - 60px */}
      <div style={{ height: 60, background: '#f7f7f7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '0.5px solid #d9d9d9' }}>
        <div style={{ fontSize: 20, color: '#000' }}>‹</div>
        <div style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>玄学工坊</div>
        <div style={{ fontSize: 20, color: '#000' }}>⋯</div>
      </div>

      {/* 聊天内容 - 占据大部分空间，气泡更大 */}
      <div style={{ flex: 1, padding: '25px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* 接收消息 */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 52, height: 52, borderRadius: 6, background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>
            ☯
          </div>
          <div style={{ background: 'white', padding: '20px 26px', borderRadius: 8, maxWidth: '72%', fontSize: 24, lineHeight: 1.6, boxShadow: '0 2px 6px rgba(0,0,0,0.12)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: -8, top: 20, width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '8px solid white' }} />
            大师...股票爆仓了，亏了整整200万😭
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 52, height: 52, borderRadius: 6, background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>
            ☯
          </div>
          <div style={{ background: 'white', padding: '20px 26px', borderRadius: 8, maxWidth: '72%', fontSize: 24, lineHeight: 1.6, boxShadow: '0 2px 6px rgba(0,0,0,0.12)', position: 'relative' }}>
            <div style={{ position: 'absolute', left: -8, top: 20, width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '8px solid white' }} />
            老婆刚才把离婚协议书扔我脸上...
          </div>
        </div>

        {/* 发送消息 */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#95ec69', padding: '20px 26px', borderRadius: 8, maxWidth: '72%', fontSize: 24, lineHeight: 1.6, boxShadow: '0 2px 6px rgba(0,0,0,0.12)', position: 'relative' }}>
            <div style={{ position: 'absolute', right: -8, top: 20, width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '8px solid #95ec69' }} />
            别慌，你还有翻盘的机会
          </div>
          <div style={{ width: 52, height: 52, borderRadius: 6, background: '#576b95', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>
            👤
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: '#95ec69', padding: '20px 26px', borderRadius: 8, maxWidth: '72%', fontSize: 24, lineHeight: 1.6, boxShadow: '0 2px 6px rgba(0,0,0,0.12)', position: 'relative' }}>
            <div style={{ position: 'absolute', right: -8, top: 20, width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '8px solid #95ec69' }} />
            报上你的生辰八字
          </div>
          <div style={{ width: 52, height: 52, borderRadius: 6, background: '#576b95', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>
            👤
          </div>
        </div>
      </div>

      {/* 极简底部栏 - 60px */}
      <div style={{ height: 60, background: '#f7f7f7', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8, borderTop: '0.5px solid #d9d9d9' }}>
        <div style={{ fontSize: 24 }}>🎤</div>
        <div style={{ flex: 1, height: 36, background: 'white', borderRadius: 6, border: '1px solid #d9d9d9' }} />
        <div style={{ fontSize: 24 }}>😊</div>
        <div style={{ fontSize: 24 }}>➕</div>
      </div>
    </div>
  );
};

// ============================================================================
// Messenger 风格（白色背景，蓝色渐变气泡）
// ============================================================================

const MessengerStyle: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 极简顶部栏 - 60px */}
      <div style={{ height: 60, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', borderBottom: '1px solid #e4e6eb' }}>
        <div style={{ fontSize: 20, color: '#050505' }}>←</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)' }} />
          <div style={{ fontSize: 16, fontWeight: '600', color: '#050505' }}>玄学工坊</div>
        </div>
        <div style={{ display: 'flex', gap: 12, fontSize: 20, color: '#0084ff' }}>
          <div>📞</div>
          <div>🎥</div>
        </div>
      </div>

      {/* 聊天内容 - 占据大部分空间 */}
      <div style={{ flex: 1, padding: '25px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* 接收消息 - 灰色背景 */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', flexShrink: 0 }} />
          <div style={{ background: '#e4e6eb', color: '#050505', padding: '20px 26px', borderRadius: 20, maxWidth: '72%', fontSize: 24, lineHeight: 1.6 }}>
            大师...股票爆仓了，亏了整整200万😭
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginLeft: 50 }}>
          <div style={{ background: '#e4e6eb', color: '#050505', padding: '20px 26px', borderRadius: 20, maxWidth: '72%', fontSize: 24, lineHeight: 1.6 }}>
            老婆刚才把离婚协议书扔我脸上...
          </div>
        </div>

        {/* 发送消息 - 蓝色渐变 */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <div style={{ background: 'linear-gradient(135deg, #0084ff 0%, #00c6ff 100%)', color: 'white', padding: '20px 26px', borderRadius: 20, maxWidth: '72%', fontSize: 24, lineHeight: 1.6 }}>
            别慌，你还有翻盘的机会
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', justifyContent: 'flex-end', marginRight: 0 }}>
          <div style={{ background: 'linear-gradient(135deg, #0084ff 0%, #00c6ff 100%)', color: 'white', padding: '20px 26px', borderRadius: 20, maxWidth: '72%', fontSize: 24, lineHeight: 1.6 }}>
            报上你的生辰八字
          </div>
        </div>
      </div>

      {/* 极简底部栏 - 60px */}
      <div style={{ height: 60, background: 'white', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, borderTop: '1px solid #e4e6eb' }}>
        <div style={{ fontSize: 24, color: '#0084ff' }}>➕</div>
        <div style={{ flex: 1, height: 38, background: '#f0f2f5', borderRadius: 19, padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 18, color: '#65676b' }}>
          Aa
        </div>
        <div style={{ fontSize: 24, color: '#0084ff' }}>👍</div>
      </div>
    </div>
  );
};
