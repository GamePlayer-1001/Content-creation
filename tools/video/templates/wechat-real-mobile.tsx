/**
 * 微信聊天 - 真实手机端还原
 *
 * 基于真实微信截图的像素级还原
 */

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Sequence
} from 'remotion';

// ============================================================================
// 真实微信风格的线框图标
// ============================================================================

const VoiceIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#000" strokeWidth="1.5"/>
    <path d="M10 8L15 12L10 16V8Z" fill="#000"/>
  </svg>
);

const MicIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <path d="M12 14C13.1 14 14 13.1 14 12V6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6V12C10 13.1 10.9 14 12 14Z" stroke="#000" strokeWidth="1.5" fill="none"/>
    <path d="M16 12C16 14.2 14.2 16 12 16C9.8 16 8 14.2 8 12" stroke="#000" strokeWidth="1.5"/>
  </svg>
);

const SmileIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#000" strokeWidth="1.5"/>
    <circle cx="9" cy="10" r="1" fill="#000"/>
    <circle cx="15" cy="10" r="1" fill="#000"/>
    <path d="M8 14C8.5 15 10 16 12 16C14 16 15.5 15 16 14" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const PlusIcon: React.FC = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="#000" strokeWidth="1.5"/>
    <path d="M12 8V16M8 12H16" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const BackIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MoreIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="6" r="1.5" fill="#000"/>
    <circle cx="12" cy="12" r="1.5" fill="#000"/>
    <circle cx="12" cy="18" r="1.5" fill="#000"/>
  </svg>
);

// ============================================================================
// 类型定义
// ============================================================================

interface Message {
  id: number;
  type: 'sent' | 'received';
  text: string;
  startFrame: number;
  typingDuration?: number;
}

// 投资翻盘故事（优化版 - 更强戏剧性）
const story = {
  title: '他亏了200万，妻子递上离婚协议...',
  contactName: '玄学工坊',
  messages: [
    { id: 1, type: 'sent' as const, text: '大师...股票爆仓了，亏了整整200万😭', startFrame: 30, typingDuration: 40 },
    { id: 2, type: 'sent' as const, text: '老婆刚才把离婚协议书扔我脸上...', startFrame: 100, typingDuration: 38 },
    { id: 3, type: 'received' as const, text: '别慌，你还有翻盘的机会', startFrame: 160, typingDuration: 32 },
    { id: 4, type: 'received' as const, text: '报上你的生辰八字，我看看你的财运', startFrame: 210, typingDuration: 36 },
    { id: 5, type: 'sent' as const, text: '1985年10月28日，晚上11点17分', startFrame: 270, typingDuration: 35 },
    { id: 6, type: 'received' as const, text: '你命中财星被冲，但3天内有贵人相助！', startFrame: 330, typingDuration: 42 },
    { id: 7, type: 'sent' as const, text: '3天？！我现在连房租都付不起了💸', startFrame: 400, typingDuration: 36 },
    { id: 8, type: 'received' as const, text: '周二上午9:30，买入代码尾数68的股票', startFrame: 460, typingDuration: 44 },
    { id: 9, type: 'received' as const, text: '周五收盘前卖出，至少翻3倍💰', startFrame: 530, typingDuration: 38 },
    { id: 10, type: 'sent' as const, text: '可是...我只剩50万了，全是借的😰', startFrame: 590, typingDuration: 38 },
    { id: 11, type: 'received' as const, text: '这就是你最后的转机！相信我！', startFrame: 650, typingDuration: 36 },
    { id: 12, type: 'sent' as const, text: '好！拼了！我信你！🙏', startFrame: 706, typingDuration: 30 }
  ],
  endingText: '5天后...',
  result: '50万变成163万！',
  detail: '又追加投资，3个月后资产突破600万',
  emotion: '妻子："原来你真的是天选之子" 💕'
};

const primaryColor = '#d4af37';

// ============================================================================
// 主组件
// ============================================================================

export const WeChatRealMobile: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={60} name="Title">
        <TitleScene />
      </Sequence>

      <Sequence from={60} durationInFrames={690} name="Chat">
        <ChatScene />
      </Sequence>

      <Sequence from={750} durationInFrames={60} name="Transition">
        <TransitionScene />
      </Sequence>

      <Sequence from={810} durationInFrames={120} name="Result">
        <ResultScene />
      </Sequence>

      <Sequence from={930} durationInFrames={120} name="CTA">
        <CTAScene />
      </Sequence>

      <Sequence from={1050} durationInFrames={90} name="Ending">
        <EndingScene />
      </Sequence>
    </AbsoluteFill>
  );
};

// ============================================================================
// 场景组件
// ============================================================================

const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20, 40, 60], [0, 1, 1, 0]);
  const scale = spring({ frame, fps: 30, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0f3460 100%)', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 56, fontWeight: 'bold', color: primaryColor, textAlign: 'center', padding: '0 50px', opacity, transform: `scale(${scale})`, lineHeight: 1.5 }}>
        {story.title}
      </div>
    </AbsoluteFill>
  );
};

const ChatScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <div style={{ width: '100%', height: '100%', background: '#ededed' }}>
        {/* 状态栏 - 真实微信风格：紧凑 */}
        <div style={{ height: 44, background: 'linear-gradient(180deg, #f8f8f8 0%, #f0f0f0 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', fontSize: 14, color: '#000' }}>
          <div style={{ fontWeight: '500' }}>7:18</div>
          <div style={{ fontSize: 16, letterSpacing: 2 }}>👁 📵 🔕 📶 4G 🔋</div>
        </div>

        {/* 导航栏 - 真实微信风格 */}
        <div style={{ height: 56, background: '#ededed', borderBottom: '0.5px solid #c8c8c8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
          <BackIcon />
          <div style={{ fontSize: 18, fontWeight: '600', color: '#000' }}>{story.contactName}</div>
          <MoreIcon />
        </div>

        {/* 聊天内容 - 真实微信风格：紧凑间距 */}
        <div style={{ height: 'calc(100% - 100px - 56px)', overflowY: 'hidden', padding: '16px 12px' }}>
          {story.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} currentFrame={frame} />
          ))}
        </div>

        {/* 底部工具栏 - 真实微信风格：线框图标 */}
        <div style={{ height: 56, background: '#f7f7f7', borderTop: '0.5px solid #d9d9d9', display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
          <VoiceIcon />
          <div style={{ flex: 1, height: 36, background: 'white', borderRadius: 6, border: '1px solid #d9d9d9', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: 16, color: '#999' }} />
          <MicIcon />
          <SmileIcon />
          <PlusIcon />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const MessageBubble: React.FC<{ message: Message; currentFrame: number }> = ({ message, currentFrame }) => {
  const localFrame = currentFrame - message.startFrame;
  if (localFrame < 0) return null;

  const isSent = message.type === 'sent';
  const typingDuration = message.typingDuration || 30;

  const opacity = interpolate(localFrame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(localFrame, [0, 12], [15, 0], { extrapolateRight: 'clamp' });

  const typingProgress = Math.min(localFrame / typingDuration, 1);
  const visibleText = message.text.slice(0, Math.floor(message.text.length * typingProgress));

  return (
    <div style={{ display: 'flex', justifyContent: isSent ? 'flex-end' : 'flex-start', marginBottom: 12, opacity, transform: `translateY(${translateY}px)` }}>
      {!isSent && (
        <div style={{ width: 40, height: 40, borderRadius: 4, background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 26, marginRight: 8, flexShrink: 0 }}>
          ☯
        </div>
      )}

      <div style={{ maxWidth: '65%', padding: '10px 12px', borderRadius: 6, background: isSent ? '#95ec69' : 'white', fontSize: 16, lineHeight: 1.5, color: '#000', wordBreak: 'break-word', position: 'relative', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
        {/* 小三角 */}
        <div style={{ position: 'absolute', top: 12, [isSent ? 'right' : 'left']: -5, width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', [isSent ? 'borderLeft' : 'borderRight']: `6px solid ${isSent ? '#95ec69' : 'white'}` }} />
        {visibleText}
        {typingProgress < 1 && (
          <span style={{ display: 'inline-block', width: 2, height: 18, background: '#000', marginLeft: 2, verticalAlign: 'middle', opacity: Math.sin(localFrame * 0.2) > 0 ? 1 : 0 }} />
        )}
      </div>

      {isSent && (
        <div style={{ width: 40, height: 40, borderRadius: 4, background: '#576b95', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 26, marginLeft: 8, flexShrink: 0 }}>
          👤
        </div>
      )}
    </div>
  );
};

const TransitionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 45, 60], [0, 1, 1, 0]);
  const scale = spring({ frame, fps: 30, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ background: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 64, color: primaryColor, fontWeight: 'bold', opacity, transform: `scale(${scale})` }}>
        {story.endingText}
      </div>
    </AbsoluteFill>
  );
};

const ResultScene: React.FC = () => {
  const frame = useCurrentFrame();

  const line1 = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const line2 = interpolate(frame, [25, 50], [0, 1], { extrapolateRight: 'clamp' });
  const line3 = interpolate(frame, [50, 75], [0, 1], { extrapolateRight: 'clamp' });
  const line4 = interpolate(frame, [75, 100], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0f3460 0%, #1a1a2e 100%)', justifyContent: 'center', alignItems: 'center', padding: 50 }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div style={{ fontSize: 58, fontWeight: 'bold', color: primaryColor, opacity: line1, transform: `scale(${line1})` }}>
          {story.result}
        </div>
        <div style={{ fontSize: 38, color: 'white', opacity: line2 }}>{story.detail}</div>
        <div style={{ fontSize: 44, opacity: line3, marginTop: 16 }}>{story.emotion}</div>
        <div style={{ fontSize: 90, opacity: line4, marginTop: 16, transform: `scale(${line4}) rotate(${frame * 3}deg)` }}>
          🎊
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const buttonScale = spring({ frame: frame - 40, fps: 30, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0f3460 0%, #000 100%)', justifyContent: 'center', alignItems: 'center', padding: 50, gap: 44 }}>
      <div style={{ fontSize: 44, color: 'white', textAlign: 'center', lineHeight: 1.5, opacity: textOpacity }}>
        命运转折点
        <br />
        <span style={{ fontSize: 36, color: primaryColor }}>就在你的选择中</span>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, #e8c547 100%)`, padding: '24px 72px', borderRadius: 48, fontSize: 38, fontWeight: 'bold', color: '#000', transform: `scale(${buttonScale})`, boxShadow: `0 12px 40px rgba(212, 175, 55, 0.6)` }}>
        立即测算
      </div>

      <div style={{ fontSize: 28, color: 'rgba(255, 255, 255, 0.7)', opacity: textOpacity }}>
        前100名免费咨询
      </div>
    </AbsoluteFill>
  );
};

const EndingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const logoScale = spring({ frame, fps: 30, config: { damping: 12 } });
  const textOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#000', justifyContent: 'center', alignItems: 'center', gap: 32 }}>
      <div style={{ fontSize: 140, transform: `scale(${logoScale}) rotate(${frame * 2}deg)`, filter: `drop-shadow(0 0 40px ${primaryColor})` }}>
        ☯
      </div>

      <div style={{ fontSize: 56, fontWeight: 'bold', color: primaryColor, opacity: textOpacity }}>
        玄学工坊
      </div>

      <div style={{ fontSize: 34, color: 'white', opacity: textOpacity, letterSpacing: 2 }}>
        destinyteller.com
      </div>

      <div style={{ fontSize: 24, color: 'rgba(255, 255, 255, 0.6)', opacity: textOpacity, marginTop: 8 }}>
        探索命运的智慧指引
      </div>
    </AbsoluteFill>
  );
};
