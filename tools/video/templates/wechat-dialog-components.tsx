/**
 * [INPUT]: 依赖 remotion 的 spring/interpolate/useVideoConfig/staticFile; 依赖 ./chat-icons
 * [OUTPUT]: MessageBubble, TimeSeparator, TransferCard, ReceivedCard, VoiceCallBanner, StickerMessage
 * [POS]: wechat-dialog-video 的子组件集合，每个组件对应一种 RenderItem.kind
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import React from 'react';
import { spring, interpolate, useVideoConfig, Img, staticFile } from 'remotion';
import { BackIcon, MoreIcon, VoiceIcon, SmileIcon, PlusIcon } from './chat-icons';

// ================================================================
//  共用动画 Hook
// ================================================================

function useBubbleAnimation(globalFrame: number, startFrame: number) {
  const { fps } = useVideoConfig();
  const frame = globalFrame - startFrame;

  const scale = frame < 0 ? 0 : spring({
    frame,
    fps,
    config: { damping: 18, mass: 0.4, stiffness: 220 },
  });

  const opacity = frame < 0 ? 0 : interpolate(
    frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' },
  );

  return { scale, opacity, visible: frame >= 0 };
}

// ================================================================
//  MessageBubble —— 文字气泡（无打字机效果）
// ================================================================

export const MessageBubble: React.FC<{
  side: 'left' | 'right';
  text: string;
  startFrame: number;
  globalFrame: number;
}> = ({ side, text, startFrame, globalFrame }) => {
  const { scale, opacity, visible } = useBubbleAnimation(globalFrame, startFrame);
  if (!visible) return null;

  const isLeft = side === 'left';

  return (
    <div style={{
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start',
      justifyContent: isLeft ? 'flex-start' : 'flex-end',
      marginBottom: 40,
      opacity,
      transform: `scale(${scale})`,
    }}>
      {isLeft && <Avatar side="left" />}
      <div style={{
        background: isLeft ? 'white' : '#95ec69',
        padding: '40px 52px',
        borderRadius: 16,
        maxWidth: '72%',
        fontSize: 48,
        lineHeight: 1.6,
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
        position: 'relative',
      }}>
        <BubbleTail side={side} />
        <span>{text}</span>
      </div>
      {!isLeft && <Avatar side="right" />}
    </div>
  );
};

// ================================================================
//  TimeSeparator —— 微信时间分隔条
// ================================================================

export const TimeSeparator: React.FC<{
  label: string;
  startFrame: number;
  globalFrame: number;
}> = ({ label, startFrame, globalFrame }) => {
  const { scale, opacity, visible } = useBubbleAnimation(globalFrame, startFrame);
  if (!visible) return null;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40,
      marginTop: 20,
      opacity,
      transform: `scale(${scale})`,
    }}>
      <div style={{
        fontSize: 28,
        color: '#b2b2b2',
        background: '#e5e5e5',
        padding: '8px 28px',
        borderRadius: 8,
      }}>
        {label}
      </div>
    </div>
  );
};

// ================================================================
//  TransferCard —— 微信转账卡片
// ================================================================

export const TransferCard: React.FC<{
  side: 'left' | 'right';
  amount: number;
  startFrame: number;
  globalFrame: number;
}> = ({ side, amount, startFrame, globalFrame }) => {
  const { scale, opacity, visible } = useBubbleAnimation(globalFrame, startFrame);
  if (!visible) return null;

  const isLeft = side === 'left';

  return (
    <div style={{
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start',
      justifyContent: isLeft ? 'flex-start' : 'flex-end',
      marginBottom: 40,
      opacity,
      transform: `scale(${scale})`,
    }}>
      {isLeft && <Avatar side="left" />}
      <div style={{
        width: 520,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
      }}>
        {/* 橙色主体 */}
        <div style={{
          background: 'linear-gradient(135deg, #fa9d3b 0%, #f5a623 100%)',
          padding: '36px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          <div style={{ fontSize: 44, color: 'white', fontWeight: '500' }}>
            ¥{amount.toFixed(2)}
          </div>
          <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.85)' }}>
            微信转账
          </div>
        </div>
        {/* 底部标记 */}
        <div style={{
          background: 'white',
          padding: '16px 40px',
          fontSize: 24,
          color: '#999',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ fontSize: 20 }}>💰</span> 微信转账
        </div>
      </div>
      {!isLeft && <Avatar side="right" />}
    </div>
  );
};

// ================================================================
//  ReceivedCard —— 已收款卡片
// ================================================================

export const ReceivedCard: React.FC<{
  side: 'left' | 'right';
  startFrame: number;
  globalFrame: number;
}> = ({ side, startFrame, globalFrame }) => {
  const { scale, opacity, visible } = useBubbleAnimation(globalFrame, startFrame);
  if (!visible) return null;

  const isLeft = side === 'left';

  return (
    <div style={{
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start',
      justifyContent: isLeft ? 'flex-start' : 'flex-end',
      marginBottom: 40,
      opacity,
      transform: `scale(${scale})`,
    }}>
      {isLeft && <Avatar side="left" />}
      <div style={{
        width: 520,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          padding: '36px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <span style={{ fontSize: 40 }}>✓</span>
          <div style={{ fontSize: 40, color: 'white', fontWeight: '500' }}>
            已收款
          </div>
        </div>
        <div style={{
          background: 'white',
          padding: '16px 40px',
          fontSize: 24,
          color: '#999',
        }}>
          微信转账
        </div>
      </div>
      {!isLeft && <Avatar side="right" />}
    </div>
  );
};

// ================================================================
//  VoiceCallBanner —— 通话提示条
// ================================================================

export const VoiceCallBanner: React.FC<{
  description: string;
  startFrame: number;
  globalFrame: number;
}> = ({ description, startFrame, globalFrame }) => {
  const { scale, opacity, visible } = useBubbleAnimation(globalFrame, startFrame);
  if (!visible) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 40,
      marginTop: 20,
      opacity,
      transform: `scale(${scale})`,
    }}>
      <div style={{
        background: '#f0f0f0',
        padding: '16px 36px',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        fontSize: 28,
        color: '#999',
      }}>
        <span style={{ fontSize: 24 }}>📞</span>
        {description}
      </div>
    </div>
  );
};

// ================================================================
//  StickerMessage —— 表情包消息
// ================================================================

export const StickerMessage: React.FC<{
  side: 'left' | 'right';
  stickerPath: string;
  startFrame: number;
  globalFrame: number;
}> = ({ side, stickerPath, startFrame, globalFrame }) => {
  const { scale, opacity, visible } = useBubbleAnimation(globalFrame, startFrame);
  if (!visible) return null;

  const isLeft = side === 'left';

  return (
    <div style={{
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start',
      justifyContent: isLeft ? 'flex-start' : 'flex-end',
      marginBottom: 40,
      opacity,
      transform: `scale(${scale})`,
    }}>
      {isLeft && <Avatar side="left" />}
      <div style={{
        width: 450,
        height: 450,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {stickerPath ? (
          <Img
            src={staticFile(`stickers/${stickerPath}`)}
            style={{ width: 405, height: 405, objectFit: 'contain' }}
          />
        ) : (
          /* fallback: 无图片时显示文字符号 */
          <div style={{
            width: 405,
            height: 405,
            background: '#f5f5f5',
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 160,
          }}>
            😯
          </div>
        )}
      </div>
      {!isLeft && <Avatar side="right" />}
    </div>
  );
};

// ================================================================
//  TopNavBar / BottomToolbar —— 导出给主模板使用
// ================================================================

export const TopNavBar: React.FC<{
  chatName: string;
  episodeLabel?: string;
}> = ({ chatName, episodeLabel }) => (
  <div style={{
    height: 120,
    background: '#f7f7f7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 40px',
    borderBottom: '1px solid #d9d9d9',
    zIndex: 10,
  }}>
    <BackIcon size={52} color="#000" />
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: 40, fontWeight: '600', color: '#000' }}>{chatName}</div>
      {episodeLabel && (
        <div style={{ fontSize: 22, color: '#999', marginTop: 2 }}>{episodeLabel}</div>
      )}
    </div>
    <MoreIcon size={52} color="#000" />
  </div>
);

export const BottomToolbar: React.FC = () => (
  <div style={{
    height: 120,
    background: '#f7f7f7',
    display: 'flex',
    alignItems: 'center',
    padding: '0 32px',
    gap: 20,
    borderTop: '1px solid #d9d9d9',
    zIndex: 10,
  }}>
    <VoiceIcon size={56} color="#000" />
    <div style={{
      flex: 1,
      height: 76,
      background: 'white',
      borderRadius: 12,
      border: '2px solid #d9d9d9',
    }} />
    <SmileIcon size={56} color="#000" />
    <PlusIcon size={56} color="#000" />
  </div>
);

// ================================================================
//  头像上下文 —— 通过 Context 传递昵称，避免逐层 prop drilling
// ================================================================

export const AvatarContext = React.createContext<{
  leftName: string;
  rightName: string;
  leftAvatar: string;
  rightAvatar: string;
}>({ leftName: '对方', rightName: '我', leftAvatar: '', rightAvatar: '' });

// ================================================================
//  内部组件
// ================================================================

const Avatar: React.FC<{ side: 'left' | 'right' }> = ({ side }) => {
  const ctx = React.useContext(AvatarContext);
  const raw = side === 'left' ? ctx.leftAvatar : ctx.rightAvatar;
  const src = raw ? (raw.startsWith('http') ? raw : staticFile(raw)) : '';

  return (
    <div style={{
      width: 104,
      height: 104,
      borderRadius: 12,
      overflow: 'hidden',
      flexShrink: 0,
      background: '#e0e0e0',
    }}>
      {src ? (
        <Img src={src} style={{ width: 104, height: 104, objectFit: 'cover' }} />
      ) : (
        <div style={{
          width: 104, height: 104,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 52, fontWeight: '700', color: 'white',
          background: side === 'left' ? '#e8a04c' : '#576b95',
        }}>
          {(side === 'left' ? ctx.leftName : ctx.rightName).charAt(0)}
        </div>
      )}
    </div>
  );
};

const BubbleTail: React.FC<{ side: 'left' | 'right' }> = ({ side }) => (
  <div style={{
    position: 'absolute',
    [side === 'left' ? 'left' : 'right']: -16,
    top: 40,
    width: 0,
    height: 0,
    borderTop: '16px solid transparent',
    borderBottom: '16px solid transparent',
    [side === 'left' ? 'borderRight' : 'borderLeft']:
      `16px solid ${side === 'left' ? 'white' : '#95ec69'}`,
  }} />
);
