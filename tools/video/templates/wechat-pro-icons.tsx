/**
 * 微信聊天 - 专业图标版
 *
 * 基于 wechat-story.tsx 的良好尺寸比例
 * 只替换 emoji 为专业 SVG 图标
 */

import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence
} from 'remotion';

// ============================================================================
// 专业 SVG 图标（保持小巧尺寸）
// ============================================================================

const MicIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z" fill="#191919"/>
    <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="#191919"/>
  </svg>
);

const SmileIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#191919" strokeWidth="1.5" fill="none"/>
    <circle cx="9" cy="10" r="1.5" fill="#191919"/>
    <circle cx="15" cy="10" r="1.5" fill="#191919"/>
    <path d="M8 14C8.5 15.5 10 17 12 17C14 17 15.5 15.5 16 14" stroke="#191919" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
);

const PlusIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19M5 12H19" stroke="#191919" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const BackArrow: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke="#576b95" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MoreDots: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="6" r="1.8" fill="#191919"/>
    <circle cx="12" cy="12" r="1.8" fill="#191919"/>
    <circle cx="12" cy="18" r="1.8" fill="#191919"/>
  </svg>
);

// ============================================================================
// 消息类型
// ============================================================================

interface Message {
  id: number;
  type: 'sent' | 'received';
  text: string;
  time?: string;
  startFrame: number;
  typingDuration?: number;
}

// 投资翻盘故事（移除"正在输入..."，调整时间轴）
const story: Message[] = [
  { id: 1, type: 'sent', text: '大师，我炒股亏了200万😭', startFrame: 30, typingDuration: 35 },
  { id: 2, type: 'sent', text: '老婆要跟我离婚了', startFrame: 90, typingDuration: 30 },
  { id: 3, type: 'received', text: '别急，先告诉我你的生辰八字', startFrame: 140, typingDuration: 32 },
  { id: 4, type: 'sent', text: '1985年10月28日 晚上11点', startFrame: 190, typingDuration: 30 },
  // 移除了"正在输入..."消息
  { id: 5, type: 'received', text: '你的财星被冲，但转运就在眼前', startFrame: 260, typingDuration: 38 },
  { id: 6, type: 'received', text: '下周二有一次重大机会', startFrame: 318, typingDuration: 30 },
  { id: 7, type: 'sent', text: '什么机会？我已经不敢投了', startFrame: 368, typingDuration: 32 },
  { id: 8, type: 'received', text: '有只尾数68的股票，周二买周五卖', startFrame: 420, typingDuration: 40 },
  { id: 9, type: 'received', text: '能帮你回本甚至翻倍', startFrame: 480, typingDuration: 28 },
  { id: 10, type: 'sent', text: '真的吗？但我已经没钱了', startFrame: 528, typingDuration: 30 },
  { id: 11, type: 'received', text: '富贵险中求，这是最后的转运机会', startFrame: 578, typingDuration: 38 },
  { id: 12, type: 'sent', text: '好！我相信你！拼了！🙏', startFrame: 636, typingDuration: 28 }
];

const ending = {
  timeline: '一周后...',
  result: '按指引操作，5天赚回300万',
  detail: '不仅回本，还多赚了100万',
  emotion: '老婆说我是她的骄傲 ❤️'
};

// ============================================================================
// 主组件
// ============================================================================

export const WeChatProIcons: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={60} name="Opening">
        <OpeningScene />
      </Sequence>

      <Sequence from={60} durationInFrames={690} name="Chat">
        <ChatScene messages={story} />
      </Sequence>

      <Sequence from={750} durationInFrames={60} name="Transition">
        <TransitionScene text={ending.timeline} />
      </Sequence>

      <Sequence from={810} durationInFrames={120} name="Result">
        <ResultScene ending={ending} />
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

const OpeningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 45, 60], [0, 1, 1, 0]);
  const scale = spring({ frame, fps: 30, config: { damping: 20 } });

  return (
    <AbsoluteFill style={{ background: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 60, fontWeight: 'bold', color: '#d4af37', textAlign: 'center', padding: '0 60px', lineHeight: 1.5, opacity, transform: `scale(${scale})` }}>
        亏损200万
        <br />
        <span style={{ fontSize: 50, color: 'white' }}>一周翻盘赚回300万</span>
      </div>
    </AbsoluteFill>
  );
};

const ChatScene: React.FC<{ messages: Message[] }> = ({ messages }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <div style={{ width: '100%', height: '100%', background: '#ededed' }}>
        {/* 状态栏 - 缩小 */}
        <div style={{ height: 36, background: '#f7f7f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 15px', fontSize: 12, fontWeight: '600', color: '#000' }}>
          <div>9:41</div>
          <div style={{ fontSize: 10 }}>📶 📡 🔋</div>
        </div>

        {/* 导航栏 - 缩小 */}
        <div style={{ height: 72, background: '#f7f7f7', borderBottom: '0.5px solid #d9d9d9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
            <BackArrow size={20} />
            <div style={{ fontSize: 15, color: '#576b95' }}>返回</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 5, background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              ☯
            </div>
            <div style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>玄学工坊</div>
          </div>

          <div style={{ position: 'absolute', right: 14 }}>
            <MoreDots size={20} />
          </div>
        </div>

        {/* 聊天内容 - 显著放大气泡和文字 */}
        <div style={{ height: 'calc(100% - 108px - 80px)', overflowY: 'hidden', padding: '30px 20px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} currentFrame={frame} />
          ))}
        </div>

        {/* 输入栏 - 缩小 */}
        <div style={{ height: 80, background: '#f7f7f7', borderTop: '0.5px solid #d9d9d9', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 8 }}>
          <div style={{ width: 44, height: 44, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <MicIcon size={24} />
          </div>
          <div style={{ flex: 1, height: 36, background: 'white', borderRadius: 6, border: '1px solid #d9d9d9' }} />
          <div style={{ width: 44, height: 44, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <SmileIcon size={24} />
          </div>
          <div style={{ width: 44, height: 44, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <PlusIcon size={24} />
          </div>
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
  const translateX = interpolate(localFrame, [0, 15], [isSent ? 50 : -50, 0], { extrapolateRight: 'clamp' });

  const typingProgress = Math.min(localFrame / typingDuration, 1);
  const visibleText = message.text.slice(0, Math.floor(message.text.length * typingProgress));

  // 不显示"正在输入..."
  if (message.time === '正在输入...') {
    return null;
  }

  return (
    <div style={{ display: 'flex', justifyContent: isSent ? 'flex-end' : 'flex-start', gap: 14, opacity, transform: `translateX(${translateX}px)` }}>
      {!isSent && (
        <div style={{ width: 56, height: 56, borderRadius: 8, background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 34, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          ☯
        </div>
      )}

      <div style={{ maxWidth: '68%', padding: '18px 24px', borderRadius: 12, background: isSent ? '#95ec69' : 'white', fontSize: 24, lineHeight: 1.6, color: '#000', wordBreak: 'break-word', position: 'relative', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}>
        <div style={{ position: 'absolute', top: 18, [isSent ? 'right' : 'left']: -9, width: 0, height: 0, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', [isSent ? 'borderLeft' : 'borderRight']: `9px solid ${isSent ? '#95ec69' : 'white'}` }} />
        {visibleText}
        {typingProgress < 1 && (
          <span style={{ display: 'inline-block', width: 3, height: 26, background: '#000', marginLeft: 3, verticalAlign: 'middle', opacity: Math.sin(localFrame * 0.2) > 0 ? 1 : 0 }} />
        )}
      </div>

      {isSent && (
        <div style={{ width: 56, height: 56, borderRadius: 8, background: '#576b95', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 34, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          👤
        </div>
      )}
    </div>
  );
};

const LoadingDots: React.FC<{ frame: number }> = ({ frame }) => (
  <div style={{ display: 'flex', gap: 4 }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#999', opacity: Math.sin((frame + i * 10) * 0.15) * 0.5 + 0.5 }} />
    ))}
  </div>
);

const TransitionScene: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 45, 60], [0, 1, 1, 0]);
  const scale = spring({ frame, fps: 30, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ background: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 70, color: '#d4af37', fontWeight: 'bold', opacity, transform: `scale(${scale})` }}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

const ResultScene: React.FC<{ ending: typeof ending }> = ({ ending }) => {
  const frame = useCurrentFrame();

  const line1 = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const line2 = interpolate(frame, [25, 50], [0, 1], { extrapolateRight: 'clamp' });
  const line3 = interpolate(frame, [50, 75], [0, 1], { extrapolateRight: 'clamp' });
  const line4 = interpolate(frame, [75, 100], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0f3460 0%, #1a1a2e 100%)', justifyContent: 'center', alignItems: 'center', padding: 60 }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 30 }}>
        <div style={{ fontSize: 65, fontWeight: 'bold', color: '#d4af37', opacity: line1, transform: `scale(${line1})` }}>
          {ending.result}
        </div>
        <div style={{ fontSize: 42, color: 'white', opacity: line2 }}>{ending.detail}</div>
        <div style={{ fontSize: 48, opacity: line3, marginTop: 20 }}>{ending.emotion}</div>
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
        <span style={{ fontSize: 38, color: '#d4af37' }}>就在你的选择中</span>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)', padding: '28px 85px', borderRadius: 50, fontSize: 42, fontWeight: 'bold', color: '#000', transform: `scale(${buttonScale})`, boxShadow: '0 15px 50px rgba(212, 175, 55, 0.6)' }}>
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
      <div style={{ fontSize: 150, transform: `scale(${logoScale}) rotate(${frame * 2}deg)`, filter: 'drop-shadow(0 0 50px #d4af37)' }}>
        ☯
      </div>

      <div style={{ fontSize: 60, fontWeight: 'bold', color: '#d4af37', opacity: textOpacity }}>
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
