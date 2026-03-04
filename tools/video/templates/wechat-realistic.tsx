/**
 * 微信真实尺寸版本
 *
 * 所有元素按照真实手机界面比例设计
 * 字体、图标、间距都恢复到合理大小
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
// SVG 图标组件（小尺寸）
// ============================================================================

const MicIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 14C13.66 14 15 12.66 15 11V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 12.66 10.34 14 12 14Z" fill="#191919"/>
    <path d="M17 11C17 13.76 14.76 16 12 16C9.24 16 7 13.76 7 11H5C5 14.53 7.61 17.43 11 17.92V21H13V17.92C16.39 17.43 19 14.53 19 11H17Z" fill="#191919"/>
  </svg>
);

const SmileIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="#191919" strokeWidth="1.5" fill="none"/>
    <circle cx="9" cy="10" r="1.2" fill="#191919"/>
    <circle cx="15" cy="10" r="1.2" fill="#191919"/>
    <path d="M8 14C8.5 15 10 16 12 16C14 16 15.5 15 16 14" stroke="#191919" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
);

const PlusIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19M5 12H19" stroke="#191919" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const BackIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke="#576b95" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MoreIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="6" r="1.5" fill="#191919"/>
    <circle cx="12" cy="12" r="1.5" fill="#191919"/>
    <circle cx="12" cy="18" r="1.5" fill="#191919"/>
  </svg>
);

// ============================================================================
// 消息类型
// ============================================================================

interface Message {
  id: number;
  type: 'sent' | 'received';
  contentType: 'text' | 'voice' | 'typing';
  text?: string;
  voiceDuration?: number;
  time?: string;
  startFrame: number;
  typingDuration?: number;
}

// 投资翻盘故事（最吸引人）
const investmentStory: Message[] = [
  { id: 1, type: 'sent', contentType: 'text', text: '大师救命，我股票亏了200万', time: '14:20', startFrame: 30, typingDuration: 35 },
  { id: 2, type: 'sent', contentType: 'text', text: '老婆要跟我离婚了😭', startFrame: 90, typingDuration: 30 },
  { id: 3, type: 'received', contentType: 'text', text: '别急，告诉我你的生辰八字', time: '14:21', startFrame: 140, typingDuration: 30 },
  { id: 4, type: 'sent', contentType: 'text', text: '1985.10.28 晚上11点', startFrame: 190, typingDuration: 25 },
  { id: 5, type: 'received', contentType: 'typing', text: '正在分析...', startFrame: 235, typingDuration: 90 },
  { id: 6, type: 'received', contentType: 'text', text: '你的财星被冲，但转运就在眼前', time: '14:22', startFrame: 345, typingDuration: 35 },
  { id: 7, type: 'received', contentType: 'text', text: '下周二有重大机会', startFrame: 400, typingDuration: 25 },
  { id: 8, type: 'received', contentType: 'voice', text: '15', voiceDuration: 15, startFrame: 445, typingDuration: 20 },
  { id: 9, type: 'received', contentType: 'text', text: '买尾数68的股票，周二买周五卖', startFrame: 485, typingDuration: 40 },
  { id: 10, type: 'received', contentType: 'text', text: '能回本甚至翻倍', startFrame: 545, typingDuration: 25 },
  { id: 11, type: 'sent', contentType: 'text', text: '真的吗？我已经没钱了', startFrame: 590, typingDuration: 28 },
  { id: 12, type: 'received', contentType: 'text', text: '富贵险中求，这是最后机会', startFrame: 638, typingDuration: 32 },
  { id: 13, type: 'sent', contentType: 'text', text: '好！拼了！🙏', startFrame: 690, typingDuration: 20 }
];

const ending = {
  timeline: '一周后...',
  result: '5天赚回300万！',
  detail: '不仅回本还多赚100万',
  emotion: '老婆说我是她的骄傲❤️'
};

// ============================================================================
// 主组件
// ============================================================================

export const WeChatRealistic: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={60} name="Opening">
        <OpeningScene />
      </Sequence>

      <Sequence from={60} durationInFrames={780} name="Chat">
        <ChatScene messages={investmentStory} />
      </Sequence>

      <Sequence from={840} durationInFrames={60} name="Transition">
        <TransitionScene text={ending.timeline} />
      </Sequence>

      <Sequence from={900} durationInFrames={120} name="Result">
        <ResultScene ending={ending} />
      </Sequence>

      <Sequence from={1020} durationInFrames={120} name="CTA">
        <CTAScene />
      </Sequence>

      <Sequence from={1140} durationInFrames={90} name="Ending">
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
      <div style={{ fontSize: 48, fontWeight: 'bold', color: '#d4af37', textAlign: 'center', padding: '0 50px', lineHeight: 1.4, opacity, transform: `scale(${scale})` }}>
        亏损200万
        <br />
        <span style={{ fontSize: 40, color: 'white' }}>一周翻盘赚回300万</span>
      </div>
    </AbsoluteFill>
  );
};

const ChatScene: React.FC<{ messages: Message[] }> = ({ messages }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <div style={{ width: '100%', height: '100%', background: '#ededed' }}>
        {/* 状态栏 */}
        <div style={{ height: 44, background: '#f7f7f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 15px', fontSize: 12, fontWeight: '600', color: '#000' }}>
          <div>9:41</div>
          <div style={{ fontSize: 10 }}>📶 📡 🔋</div>
        </div>

        {/* 导航栏 */}
        <div style={{ height: 88, background: '#f7f7f7', borderBottom: '0.5px solid #d6d6d6', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            <BackIcon size={16} />
            <div style={{ fontSize: 15, color: '#576b95' }}>返回</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 5, background: 'linear-gradient(135deg, #d4af37 0%, #f0d68a 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 20, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>☯</div>
            <div style={{ fontSize: 16, fontWeight: '600', color: '#191919' }}>玄学工坊</div>
          </div>
          <div style={{ position: 'absolute', right: 12 }}>
            <MoreIcon size={16} />
          </div>
        </div>

        {/* 聊天内容 */}
        <div style={{ height: 'calc(100% - 132px - 90px)', overflowY: 'hidden', padding: '15px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} currentFrame={frame} />
          ))}
        </div>

        {/* 输入栏 */}
        <div style={{ height: 90, background: '#f7f7f7', borderTop: '0.5px solid #d6d6d6', display: 'flex', alignItems: 'center', padding: '0 8px', gap: 6 }}>
          <div style={{ width: 42, height: 42, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <MicIcon size={22} />
          </div>
          <div style={{ flex: 1, height: 34, background: 'white', borderRadius: 5, border: '1px solid #d6d6d6' }} />
          <div style={{ width: 42, height: 42, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <SmileIcon size={22} />
          </div>
          <div style={{ width: 42, height: 42, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <PlusIcon size={22} />
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
  const opacity = interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });
  const translateX = interpolate(localFrame, [0, 12], [isSent ? 20 : -20, 0], { extrapolateRight: 'clamp' });
  const typingProgress = Math.min(localFrame / typingDuration, 1);
  const visibleText = message.text ? message.text.slice(0, Math.floor(message.text.length * typingProgress)) : '';
  const showTime = message.time && localFrame > 5;

  if (message.contentType === 'typing') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start', opacity, transform: `translateX(${translateX}px)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 34, height: 34, borderRadius: 5, background: 'linear-gradient(135deg, #d4af37 0%, #f0d68a 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 18 }}>☯</div>
          <span style={{ fontSize: 12, color: '#999' }}>正在输入</span>
          <LoadingDots frame={localFrame} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ opacity, transform: `translateX(${translateX}px)` }}>
      {showTime && <div style={{ textAlign: 'center', fontSize: 11, color: '#999', marginBottom: 6 }}>{message.time}</div>}

      <div style={{ display: 'flex', justifyContent: isSent ? 'flex-end' : 'flex-start', gap: 6 }}>
        {!isSent && (
          <div style={{ width: 34, height: 34, borderRadius: 5, background: 'linear-gradient(135deg, #d4af37 0%, #f0d68a 100%)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 18, flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>☯</div>
        )}

        {message.contentType === 'voice' ? (
          <VoiceBubble duration={message.voiceDuration!} isSent={isSent} frame={localFrame} />
        ) : (
          <div style={{ maxWidth: '68%', padding: '10px 14px', borderRadius: 6, background: isSent ? '#95ec69' : 'white', fontSize: 15, lineHeight: 1.4, color: '#191919', wordBreak: 'break-word', position: 'relative', boxShadow: isSent ? '0 1px 2px rgba(149,236,105,0.3)' : '0 1px 2px rgba(0,0,0,0.1)' }}>
            <div style={{ position: 'absolute', top: 10, [isSent ? 'right' : 'left']: -5, width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', [isSent ? 'borderLeft' : 'borderRight']: `5px solid ${isSent ? '#95ec69' : 'white'}` }} />
            {visibleText}
            {typingProgress < 1 && message.text && (
              <span style={{ display: 'inline-block', width: 2, height: 16, background: '#191919', marginLeft: 2, verticalAlign: 'middle', opacity: Math.sin(localFrame * 0.2) > 0 ? 1 : 0 }} />
            )}
          </div>
        )}

        {isSent && (
          <div style={{ width: 34, height: 34, borderRadius: 5, background: '#576b95', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 18, flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }}>👤</div>
        )}
      </div>
    </div>
  );
};

const VoiceBubble: React.FC<{ duration: number; isSent: boolean; frame: number }> = ({ duration, isSent, frame }) => (
  <div style={{ minWidth: 110, maxWidth: 180, padding: '10px 14px', borderRadius: 6, background: isSent ? '#95ec69' : 'white', display: 'flex', alignItems: 'center', gap: 8, position: 'relative', boxShadow: isSent ? '0 1px 2px rgba(149,236,105,0.3)' : '0 1px 2px rgba(0,0,0,0.1)' }}>
    <div style={{ position: 'absolute', top: 10, [isSent ? 'right' : 'left']: -5, width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', [isSent ? 'borderLeft' : 'borderRight']: `5px solid ${isSent ? '#95ec69' : 'white'}` }} />
    <MicIcon size={16} />
    <VoiceWave frame={frame} />
    <div style={{ fontSize: 13, color: '#191919', fontWeight: '500' }}>{duration}"</div>
  </div>
);

const VoiceWave: React.FC<{ frame: number }> = ({ frame }) => (
  <svg width="45" height="18" viewBox="0 0 45 18">
    {[6, 12, 9, 15, 8, 14, 10].map((h, i) => {
      const height = h + Math.sin((frame + i * 4) * 0.15) * 4;
      return <rect key={i} x={i * 6.5} y={(18 - height) / 2} width="4" height={height} rx="2" fill="#191919" opacity="0.7" />;
    })}
  </svg>
);

const LoadingDots: React.FC<{ frame: number }> = ({ frame }) => (
  <div style={{ display: 'flex', gap: 3 }}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#999', opacity: Math.sin((frame + i * 8) * 0.15) * 0.5 + 0.5 }} />
    ))}
  </div>
);

const TransitionScene: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 45, 60], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ background: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ fontSize: 55, color: '#d4af37', fontWeight: 'bold', opacity }}>{text}</div>
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
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0f3460 0%, #1a1a2e 100%)', justifyContent: 'center', alignItems: 'center', padding: 50 }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 25 }}>
        <div style={{ fontSize: 55, fontWeight: 'bold', color: '#d4af37', opacity: line1 }}>{ending.result}</div>
        <div style={{ fontSize: 36, color: 'white', opacity: line2 }}>{ending.detail}</div>
        <div style={{ fontSize: 38, opacity: line3, marginTop: 15 }}>{ending.emotion}</div>
        <div style={{ fontSize: 80, opacity: line4, marginTop: 15, transform: `rotate(${frame * 2}deg)` }}>🎊</div>
      </div>
    </AbsoluteFill>
  );
};

const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: 'clamp' });
  const buttonScale = spring({ frame: frame - 40, fps: 30, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #0f3460 0%, #000 100%)', justifyContent: 'center', alignItems: 'center', padding: 50, gap: 40 }}>
      <div style={{ fontSize: 40, color: 'white', textAlign: 'center', lineHeight: 1.5, opacity: textOpacity }}>
        命运转折点
        <br />
        <span style={{ fontSize: 32, color: '#d4af37' }}>就在你的选择中</span>
      </div>
      <div style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f0d68a 100%)', padding: '24px 70px', borderRadius: 45, fontSize: 36, fontWeight: 'bold', color: '#000', transform: `scale(${buttonScale})`, boxShadow: '0 12px 40px rgba(212,175,55,0.5)' }}>
        立即测算
      </div>
      <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.7)', opacity: textOpacity }}>前100名免费</div>
    </AbsoluteFill>
  );
};

const EndingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const logoScale = spring({ frame, fps: 30, config: { damping: 12 } });
  const textOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: '#000', justifyContent: 'center', alignItems: 'center', gap: 28 }}>
      <div style={{ fontSize: 120, transform: `scale(${logoScale}) rotate(${frame * 2}deg)`, filter: 'drop-shadow(0 0 40px #d4af37)' }}>☯</div>
      <div style={{ fontSize: 50, fontWeight: 'bold', color: '#d4af37', opacity: textOpacity }}>玄学工坊</div>
      <div style={{ fontSize: 30, color: 'white', opacity: textOpacity, letterSpacing: 1 }}>destinyteller.com</div>
      <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.6)', opacity: textOpacity, marginTop: 8 }}>探索命运的智慧指引</div>
    </AbsoluteFill>
  );
};
