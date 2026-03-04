/**
 * 微信聊天风格动画视频
 * 通用模板 - 支持自定义对话内容
 * 默认故事：神秘预测成真（60秒）
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Audio, staticFile } from 'remotion';
import { BackIcon, MoreIcon, VoiceIcon, SmileIcon, PlusIcon } from './chat-icons';

// 对话数据结构
interface Message {
  speaker: 'left' | 'right';  // left=接收，right=发送
  text: string;
  startFrame: number;
}

// 组件 Props
interface ChatWeChatVideoProps {
  // 聊天对象名称
  chatName?: string;
  // 对话内容（如果不提供，使用默认故事）
  messages?: Message[];
  // 是否显示片尾字幕
  showEndingCredits?: boolean;
  // 片尾文字
  endingText?: string;
  endingUrl?: string;
  // 背景音乐
  bgmUrl?: string;
  bgmVolume?: number;
  // 是否播放消息提示音
  enableMessageSound?: boolean;
}

// 小红书爆款故事：我终于不再讨好所有人了（情绪共鸣型）
const defaultMessages: Message[] = [
  { speaker: 'right', text: '姐妹救命😭我又被PUA了', startFrame: 0 },
  { speaker: 'left', text: '怎么了？！谁欺负你', startFrame: 100 },
  { speaker: 'right', text: '同事让我帮忙做她的工作', startFrame: 190 },
  { speaker: 'right', text: '我不想做又不好意思拒绝', startFrame: 310 },
  { speaker: 'right', text: '结果做完了她还嫌弃我做得不好...', startFrame: 460 },
  { speaker: 'left', text: '宝你这是典型的讨好型人格啊', startFrame: 640 },
  { speaker: 'right', text: '我知道😢但就是改不了', startFrame: 760 },
  { speaker: 'right', text: '总怕别人不开心', startFrame: 850 },
  { speaker: 'left', text: '你有没有想过', startFrame: 940 },
  { speaker: 'left', text: '可能是因为不够了解真实的自己？', startFrame: 1030 },
  { speaker: 'right', text: '真实的自己？什么意思', startFrame: 1180 },
  { speaker: 'left', text: '我之前也是讨好型', startFrame: 1270 },
  { speaker: 'left', text: '后来做了个深度性格分析', startFrame: 1390 },
  { speaker: 'left', text: '才发现我其实是需要界限感的人', startFrame: 1540 },
  { speaker: 'right', text: '性格分析？在哪做的', startFrame: 1720 },
  { speaker: 'left', text: 'destiny teller 搜这个', startFrame: 1810 },
  { speaker: 'left', text: '它会告诉你的性格底层逻辑', startFrame: 1930 },
  { speaker: 'left', text: '和为什么总是讨好别人', startFrame: 2080 },
  { speaker: 'right', text: '我现在就去试！🥺', startFrame: 2230 },
  { speaker: 'left', text: '看完你就知道', startFrame: 2320 },
  { speaker: 'left', text: '拒绝不是冷漠，是尊重自己💜', startFrame: 2410 },
];

// 单条消息气泡组件
const MessageBubble: React.FC<{
  message: Message;
  index: number;
  globalFrame: number;
}> = ({ message, index, globalFrame }) => {
  const { fps } = useVideoConfig();
  const frame = globalFrame - message.startFrame;

  // 气泡进入动画
  const bubbleScale = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.5, stiffness: 200 },
  });

  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  if (frame < 0) return null;

  const isLeft = message.speaker === 'left';

  return (
    <div
      style={{
        display: 'flex',
        gap: 24,
        alignItems: 'flex-start',
        justifyContent: isLeft ? 'flex-start' : 'flex-end',
        marginBottom: 40,
        opacity,
        transform: `scale(${bubbleScale})`,
      }}
    >
      {isLeft && (
        <div style={{
          width: 104,
          height: 104,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 68,
        }}>
          ☯
        </div>
      )}

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
        {isLeft ? (
          <div style={{
            position: 'absolute',
            left: -16,
            top: 40,
            width: 0,
            height: 0,
            borderTop: '16px solid transparent',
            borderBottom: '16px solid transparent',
            borderRight: '16px solid white',
          }} />
        ) : (
          <div style={{
            position: 'absolute',
            right: -16,
            top: 40,
            width: 0,
            height: 0,
            borderTop: '16px solid transparent',
            borderBottom: '16px solid transparent',
            borderLeft: '16px solid #95ec69',
          }} />
        )}
        <TypewriterText text={message.text} frame={frame} fps={fps} />
      </div>

      {!isLeft && (
        <div style={{
          width: 104,
          height: 104,
          borderRadius: 12,
          background: '#576b95',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 68,
        }}>
          👤
        </div>
      )}
    </div>
  );
};

// 打字机效果 (1.5倍速度)
const TypewriterText: React.FC<{ text: string; frame: number; fps: number }> = ({ text, frame }) => {
  const charsToShow = Math.floor(frame * 0.75); // 1.5倍速：从 frame/2 改为 frame*0.75
  return <span>{text.slice(0, charsToShow)}</span>;
};

// 主视频组件
export const ChatWeChatVideo: React.FC<ChatWeChatVideoProps> = ({
  chatName = '树洞姐妹',
  messages = defaultMessages,
  showEndingCredits = true,
  endingText = '了解自己，从这里开始',
  endingUrl = 'destinyteller.com',
  bgmUrl = '', // 暂时禁用外部BGM
  bgmVolume = 0.15,
  enableMessageSound = false, // 暂时禁用消息音
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const visibleMessages = messages.filter((msg) => frame >= msg.startFrame);

  // 计算每条消息的估算高度
  const calculateMessageHeight = (msg: Message) => {
    const baseHeight = 104; // 头像高度
    const bubblePadding = 80; // 上下padding (40px top + 40px bottom)
    const lineHeight = 48 * 1.6; // 字体大小 * 行高 = 76.8px
    const maxWidth = 1080 * 0.72; // 最大宽度72%
    const charWidth = 48; // 平均每个字符宽度（考虑中文、英文、emoji混合）
    const effectiveWidth = maxWidth - 52 * 2; // 减去左右padding
    const charsPerLine = Math.floor(effectiveWidth / charWidth);
    const lines = Math.ceil(msg.text.length / charsPerLine);
    // 确保至少有1行，并给多行消息额外的高度余量
    const actualLines = Math.max(1, lines);
    const bubbleHeight = Math.max(baseHeight, bubblePadding + actualLines * lineHeight);
    return bubbleHeight + 40; // 加上 marginBottom
  };

  // 可见区域高度 (总高度 - 顶部栏 - 底部栏 - padding)
  const visibleAreaHeight = 1920 - 120 - 120 - 100; // 1580px

  // 计算所有消息的累计位置（用于确定何时需要滚动）
  let accumulatedHeight = 0;
  const messagePositions = messages.map((msg) => {
    const height = calculateMessageHeight(msg);
    const position = accumulatedHeight;
    accumulatedHeight += height;
    return { message: msg, position, height };
  });

  // 找到当前最后一条显示的消息
  const lastVisibleMessage = visibleMessages.length > 0
    ? visibleMessages[visibleMessages.length - 1]
    : null;

  // 找到该消息的底部位置
  const lastMessageData = lastVisibleMessage
    ? messagePositions.find(m => m.message === lastVisibleMessage)
    : null;

  // 计算目标滚动位置：确保最后一条消息完整显示
  let targetScrollY = 0;
  if (lastMessageData) {
    const lastMessageBottom = lastMessageData.position + lastMessageData.height;
    // 底部安全边距：确保消息与底部工具栏之间有足够空间
    const bottomSafetyMargin = 150;
    const contentBottom = lastMessageBottom + bottomSafetyMargin;

    // 只有当内容底部超出可见区域时才滚动
    if (contentBottom > visibleAreaHeight) {
      targetScrollY = -(contentBottom - visibleAreaHeight);
    }
  }

  // 使用累积的方式计算滚动动画，避免每次新消息都重置动画
  const scrollY = spring({
    frame,
    fps,
    from: 0,
    to: targetScrollY,
    config: {
      damping: 25,  // 增加阻尼，减少弹性
      stiffness: 60,  // 降低刚度，使动画更柔和
      mass: 1,  // 增加质量，减慢速度
    },
  });

  // 片尾显示时机（最后5秒）
  const endingStartFrame = durationInFrames - 450;

  return (
    <AbsoluteFill style={{ background: '#ededed', display: 'flex', flexDirection: 'column' }}>
      {/* 背景音乐 */}
      {bgmUrl && (
        <Audio
          src={bgmUrl}
          volume={bgmVolume}
          startFrom={0}
        />
      )}

      {/* 消息提示音 */}
      {enableMessageSound && visibleMessages.map((msg, idx) => {
        const isNewMessage = frame >= msg.startFrame && frame < msg.startFrame + 5;
        if (!isNewMessage) return null;

        return (
          <Audio
            key={`sound-${idx}`}
            src="https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3"
            volume={0.3}
            startFrom={msg.startFrame}
          />
        );
      })}

      {/* 顶部导航栏 */}
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
        <div style={{ fontSize: 40, fontWeight: '600', color: '#000' }}>{chatName}</div>
        <MoreIcon size={52} color="#000" />
      </div>

      {/* 聊天内容区域 */}
      <div style={{
        flex: 1,
        padding: '50px 40px',
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          transform: `translateY(${scrollY}px)`,
          willChange: 'transform',
        }}>
          {visibleMessages.map((message, index) => (
            <MessageBubble key={index} message={message} index={index} globalFrame={frame} />
          ))}
        </div>
      </div>

      {/* 底部工具栏 */}
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

      {/* 片尾字幕 */}
      {showEndingCredits && frame >= endingStartFrame && (
        <div style={{
          position: 'absolute',
          bottom: 200,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: interpolate(
            frame,
            [endingStartFrame, endingStartFrame + 30, durationInFrames - 30, durationInFrames],
            [0, 1, 1, 0]
          ),
        }}>
          <div style={{ fontSize: 32, color: '#999', marginBottom: 10 }}>{endingText}</div>
          <div style={{ fontSize: 42, fontWeight: '600', color: '#d4af37', letterSpacing: 2 }}>
            {endingUrl}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
