/**
 * 微信聊天故事 - 投资翻盘记
 *
 * 完全基于 wechat-story.tsx 的尺寸
 * 只替换 emoji 为专业 SVG 图标
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
// 专业 SVG 图标
// ============================================================================

const MicIcon: React.FC = () => (
  <svg width="45" height="45" viewBox="0 0 24 24" fill="none">
    <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z" fill="#191919"/>
    <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="#191919"/>
  </svg>
);

const SmileIcon: React.FC = () => (
  <svg width="45" height="45" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#191919" strokeWidth="1.5" fill="none"/>
    <circle cx="9" cy="10" r="1.5" fill="#191919"/>
    <circle cx="15" cy="10" r="1.5" fill="#191919"/>
    <path d="M8 14C8.5 15.5 10 17 12 17C14 17 15.5 15.5 16 14" stroke="#191919" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
);

const PlusIcon: React.FC = () => (
  <svg width="45" height="45" viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19M5 12H19" stroke="#191919" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const BackArrow: React.FC = () => (
  <svg width="35" height="35" viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MoreDots: React.FC = () => (
  <svg width="35" height="35" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="6" r="1.8" fill="#191919"/>
    <circle cx="12" cy="12" r="1.8" fill="#191919"/>
    <circle cx="12" cy="18" r="1.8" fill="#191919"/>
  </svg>
);

// ============================================================================
// 类型定义
// ============================================================================

interface Message {
  id: number;
  type: 'sent' | 'received';
  text: string;
  time?: string;
  startFrame: number;
  typingDuration?: number;
}

// 投资翻盘故事
const story = {
  title: '亏损200万，一周翻盘赚回300万',
  contactName: '玄学工坊',
  contactAvatar: '☯',
  userAvatar: '👤',
  messages: [
    { id: 1, type: 'sent' as const, text: '大师，我炒股亏了200万😭', startFrame: 30, typingDuration: 35 },
    { id: 2, type: 'sent' as const, text: '老婆要跟我离婚了', startFrame: 90, typingDuration: 30 },
    { id: 3, type: 'received' as const, text: '别急，先告诉我你的生辰八字', startFrame: 140, typingDuration: 32 },
    { id: 4, type: 'sent' as const, text: '1985年10月28日 晚上11点', startFrame: 190, typingDuration: 30 },
    { id: 5, type: 'received' as const, text: '你的财星被冲，但转运就在眼前', startFrame: 260, typingDuration: 38 },
    { id: 6, type: 'received' as const, text: '下周二有一次重大机会', startFrame: 318, typingDuration: 30 },
    { id: 7, type: 'sent' as const, text: '什么机会？我已经不敢投了', startFrame: 368, typingDuration: 32 },
    { id: 8, type: 'received' as const, text: '有只尾数68的股票，周二买周五卖', startFrame: 420, typingDuration: 40 },
    { id: 9, type: 'received' as const, text: '能帮你回本甚至翻倍', startFrame: 480, typingDuration: 28 },
    { id: 10, type: 'sent' as const, text: '真的吗？但我已经没钱了', startFrame: 528, typingDuration: 30 },
    { id: 11, type: 'received' as const, text: '富贵险中求，这是最后的转运机会', startFrame: 578, typingDuration: 38 },
    { id: 12, type: 'sent' as const, text: '好！我相信你！拼了！🙏', startFrame: 636, typingDuration: 28 }
  ],
  endingText: '一周后...',
  result: '按指引操作，5天赚回300万',
  detail: '不仅回本，还多赚了100万',
  emotion: '老婆说我是她的骄傲 ❤️'
};

const primaryColor = '#d4af37';
const secondaryColor = '#0f3460';

// ============================================================================
// 主组件
// ============================================================================

export const WeChatStoryInvestment: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={60} name="Title">
        <TitleScene title={story.title} primaryColor={primaryColor} />
      </Sequence>

      <Sequence from={60} durationInFrames={690} name="Chat">
        <ChatScene />
      </Sequence>

      <Sequence from={750} durationInFrames={60} name="Transition">
        <TransitionScene text={story.endingText!} />
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

const TitleScene: React.FC<{ title: string; primaryColor: string }> = ({ title, primaryColor }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20, 40, 60], [0, 1, 1, 0]);
  const scale = spring({ frame, fps: 30, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0f3460 100%)', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 60, fontWeight: 'bold', color: primaryColor, textAlign: 'center', padding: '0 60px', opacity, transform: `scale(${scale})`, lineHeight: 1.6 }}>
        {title}
      </div>
    </AbsoluteFill>
  );
};

const ChatScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <div style={{ width: '100%', height: '100%', background: '#ededed' }}>
        {/* 顶部导航栏 - 完全复制 wechat-story.tsx */}
        <div style={{ height: 120, background: '#f7f7f7', borderBottom: '1px solid #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', paddingTop: 40 }}>
          <div style={{ position: 'absolute', left: 30, top: 55 }}>
            <BackArrow />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <div style={{ fontSize: 50 }}>{story.contactAvatar}</div>
            <div style={{ fontSize: 32, fontWeight: 'bold', color: '#000' }}>{story.contactName}</div>
          </div>

          <div style={{ position: 'absolute', right: 30, top: 55 }}>
            <MoreDots />
          </div>
        </div>

        {/* 聊天内容区域 - 完全复制 wechat-story.tsx */}
        <div style={{ height: 'calc(100% - 240px)', overflowY: 'hidden', padding: '30px 25px' }}>
          {story.messages.map((message) => (
            <MessageBubble key={message.id} message={message} currentFrame={frame} />
          ))}
        </div>

        {/* 底部输入栏 - 完全复制 wechat-story.tsx，只替换图标 */}
        <div style={{ height: 120, background: '#f7f7f7', borderTop: '1px solid #d9d9d9', display: 'flex', alignItems: 'center', padding: '0 25px', gap: 20 }}>
          <MicIcon />
          <div style={{ flex: 1, height: 65, background: 'white', borderRadius: 10, border: '1px solid #d9d9d9' }} />
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

  const opacity = interpolate(localFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(localFrame, [0, 15], [20, 0], { extrapolateRight: 'clamp' });

  const typingProgress = Math.min(localFrame / typingDuration, 1);
  const visibleText = message.text.slice(0, Math.floor(message.text.length * typingProgress));

  return (
    <div style={{ display: 'flex', justifyContent: isSent ? 'flex-end' : 'flex-start', marginBottom: 25, opacity, transform: `translateY(${translateY}px)` }}>
      {!isSent && (
        <div style={{ width: 70, height: 70, borderRadius: 10, background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 45, marginRight: 15, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          {story.contactAvatar}
        </div>
      )}

      <div style={{ maxWidth: '70%', padding: '20px 25px', borderRadius: 12, background: isSent ? '#95ec69' : 'white', fontSize: 28, lineHeight: 1.6, color: '#000', wordBreak: 'break-word', position: 'relative', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ position: 'absolute', top: 20, [isSent ? 'right' : 'left']: -10, width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', [isSent ? 'borderLeft' : 'borderRight']: `10px solid ${isSent ? '#95ec69' : 'white'}` }} />
        {visibleText}
        {typingProgress < 1 && (
          <span style={{ display: 'inline-block', width: 3, height: 30, background: '#000', marginLeft: 4, verticalAlign: 'middle', opacity: Math.sin(localFrame * 0.2) > 0 ? 1 : 0 }} />
        )}
      </div>

      {isSent && (
        <div style={{ width: 70, height: 70, borderRadius: 10, background: '#576b95', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 45, marginLeft: 15, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          {story.userAvatar}
        </div>
      )}
    </div>
  );
};

const TransitionScene: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 45, 60], [0, 1, 1, 0]);
  const scale = spring({ frame, fps: 30, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ background: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 70, color: primaryColor, fontWeight: 'bold', opacity, transform: `scale(${scale})` }}>
        {text}
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
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0f3460 0%, #1a1a2e 100%)', justifyContent: 'center', alignItems: 'center', padding: 60 }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <div style={{ fontSize: 65, fontWeight: 'bold', color: primaryColor, opacity: line1, transform: `scale(${line1})` }}>
          {story.result}
        </div>
        <div style={{ fontSize: 42, color: 'white', opacity: line2 }}>{story.detail}</div>
        <div style={{ fontSize: 48, opacity: line3, marginTop: 20 }}>{story.emotion}</div>
        <div style={{ fontSize: 100, opacity: line4, marginTop: 20, transform: `scale(${line4}) rotate(${frame * 3}deg)` }}>
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
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0f3460 0%, #000 100%)', justifyContent: 'center', alignItems: 'center', padding: 60, gap: 50 }}>
      <div style={{ fontSize: 48, color: 'white', textAlign: 'center', lineHeight: 1.6, opacity: textOpacity }}>
        命运转折点
        <br />
        <span style={{ fontSize: 38, color: primaryColor }}>就在你的选择中</span>
      </div>

      <div style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, #e8c547 100%)`, padding: '28px 85px', borderRadius: 50, fontSize: 42, fontWeight: 'bold', color: '#000', transform: `scale(${buttonScale})`, boxShadow: `0 15px 50px rgba(212, 175, 55, 0.6)` }}>
        立即测算
      </div>

      <div style={{ fontSize: 30, color: 'rgba(255, 255, 255, 0.7)', opacity: textOpacity }}>
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
    <AbsoluteFill style={{ background: '#000', justifyContent: 'center', alignItems: 'center', gap: 35 }}>
      <div style={{ fontSize: 150, transform: `scale(${logoScale}) rotate(${frame * 2}deg)`, filter: `drop-shadow(0 0 50px ${primaryColor})` }}>
        ☯
      </div>

      <div style={{ fontSize: 60, fontWeight: 'bold', color: primaryColor, opacity: textOpacity }}>
        玄学工坊
      </div>

      <div style={{ fontSize: 36, color: 'white', opacity: textOpacity, letterSpacing: 2 }}>
        destinyteller.com
      </div>

      <div style={{ fontSize: 26, color: 'rgba(255, 255, 255, 0.6)', opacity: textOpacity, marginTop: 10 }}>
        探索命运的智慧指引
      </div>
    </AbsoluteFill>
  );
};
