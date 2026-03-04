/**
 * 微信聊天风格 - Destiny Teller 软性推广视频
 * 故事：神秘预测成真
 * 时长：60秒（1800帧 @ 30fps）
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Sequence } from 'remotion';
import { BackIcon, MoreIcon, VoiceIcon, SmileIcon, PlusIcon } from './chat-icons';

// 对话数据结构
interface Message {
  speaker: 'A' | 'B';
  text: string;
  startFrame: number;
}

// 完整对话脚本（60秒，30fps = 1800帧）
const messages: Message[] = [
  // 第1幕：引发好奇（0-15秒，0-450帧）
  { speaker: 'A', text: '哎你还记得上周我说的那个网站吗', startFrame: 0 },
  { speaker: 'B', text: '哪个？', startFrame: 90 },
  { speaker: 'A', text: '就那个AI算命的，你不是说都是骗人的吗😅', startFrame: 150 },
  { speaker: 'B', text: '怎么了？', startFrame: 300 },

  // 第2幕：制造悬念（15-30秒，450-900帧）
  { speaker: 'A', text: '它预测我这个月会有职场大变动', startFrame: 360 },
  { speaker: 'A', text: '而且会遇到贵人相助', startFrame: 510 },
  { speaker: 'B', text: '所以呢？准了？', startFrame: 660 },

  // 第3幕：高潮反转（30-45秒，900-1350帧）
  { speaker: 'A', text: '今天老板突然找我谈话...', startFrame: 750 },
  { speaker: 'A', text: '说要提拔我做项目经理！🎉', startFrame: 900 },
  { speaker: 'A', text: '工资直接涨50%', startFrame: 1050 },
  { speaker: 'B', text: '卧槽？真的假的', startFrame: 1140 },
  { speaker: 'B', text: '那个网站叫啥来着', startFrame: 1230 },

  // 第4幕：自然推广（45-60秒，1350-1800帧）
  { speaker: 'A', text: 'destinyteller.com', startFrame: 1320 },
  { speaker: 'A', text: '有免费版可以试试', startFrame: 1440 },
  { speaker: 'A', text: '我当时也是抱着玩玩的心态😂', startFrame: 1530 },
  { speaker: 'B', text: '行，我晚上试试', startFrame: 1680 },
];

// 单条消息气泡组件
const MessageBubble: React.FC<{
  message: Message;
  index: number;
  globalFrame: number;
}> = ({ message, index, globalFrame }) => {
  const { fps } = useVideoConfig();
  const frame = globalFrame - message.startFrame;

  // 气泡进入动画（spring 弹性效果）
  const bubbleScale = spring({
    frame,
    fps,
    config: {
      damping: 15,
      mass: 0.5,
      stiffness: 200,
    },
  });

  // 气泡透明度（快速淡入）
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 如果还未到显示时间，不渲染
  if (frame < 0) return null;

  const isLeft = message.speaker === 'A';

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
      {/* 左侧头像（接收消息） */}
      {isLeft && (
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #d4af37 0%, #e8c547 100%)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 68,
          }}
        >
          ☯
        </div>
      )}

      {/* 消息气泡 */}
      <div
        style={{
          background: isLeft ? 'white' : '#95ec69',
          padding: '40px 52px',
          borderRadius: 16,
          maxWidth: '72%',
          fontSize: 48,
          lineHeight: 1.6,
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
          position: 'relative',
        }}
      >
        {/* 小三角 */}
        {isLeft ? (
          <div
            style={{
              position: 'absolute',
              left: -16,
              top: 40,
              width: 0,
              height: 0,
              borderTop: '16px solid transparent',
              borderBottom: '16px solid transparent',
              borderRight: '16px solid white',
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              right: -16,
              top: 40,
              width: 0,
              height: 0,
              borderTop: '16px solid transparent',
              borderBottom: '16px solid transparent',
              borderLeft: '16px solid #95ec69',
            }}
          />
        )}

        {/* 打字动画效果 */}
        <TypewriterText text={message.text} frame={frame} fps={fps} />
      </div>

      {/* 右侧头像（发送消息） */}
      {!isLeft && (
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: 12,
            background: '#576b95',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 68,
          }}
        >
          👤
        </div>
      )}
    </div>
  );
};

// 打字机效果组件
const TypewriterText: React.FC<{
  text: string;
  frame: number;
  fps: number;
}> = ({ text, frame, fps }) => {
  // 打字速度：每2帧显示一个字符（15字/秒）
  const charsToShow = Math.floor(frame / 2);
  const displayText = text.slice(0, charsToShow);

  return <span>{displayText}</span>;
};

// 主视频组件
export const WeChatDestinyPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // 计算当前应该显示的消息（已经出现的所有消息）
  const visibleMessages = messages.filter((msg) => frame >= msg.startFrame);

  // 自动滚动效果：随着消息增多，内容区域向上滚动
  const scrollY = interpolate(
    visibleMessages.length,
    [0, messages.length],
    [0, -500],
    {
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill style={{ background: '#ededed', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航栏 - 120px */}
      <div
        style={{
          height: 120,
          background: '#f7f7f7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          borderBottom: '1px solid #d9d9d9',
          zIndex: 10,
        }}
      >
        <BackIcon size={52} color="#000" />
        <div style={{ fontSize: 40, fontWeight: '600', color: '#000' }}>小李</div>
        <MoreIcon size={52} color="#000" />
      </div>

      {/* 聊天内容区域 - 可滚动 */}
      <div
        style={{
          flex: 1,
          padding: '50px 40px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            transform: `translateY(${scrollY}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          {visibleMessages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              index={index}
              globalFrame={frame}
            />
          ))}
        </div>
      </div>

      {/* 底部工具栏 - 120px */}
      <div
        style={{
          height: 120,
          background: '#f7f7f7',
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          gap: 20,
          borderTop: '1px solid #d9d9d9',
          zIndex: 10,
        }}
      >
        <VoiceIcon size={56} color="#000" />
        <div
          style={{
            flex: 1,
            height: 76,
            background: 'white',
            borderRadius: 12,
            border: '2px solid #d9d9d9',
          }}
        />
        <SmileIcon size={56} color="#000" />
        <PlusIcon size={56} color="#000" />
      </div>

      {/* 片尾字幕（最后5秒，1350-1800帧） */}
      {frame >= 1350 && (
        <div
          style={{
            position: 'absolute',
            bottom: 200,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: interpolate(frame, [1350, 1380, 1770, 1800], [0, 1, 1, 0]),
          }}
        >
          <div
            style={{
              fontSize: 32,
              color: '#999',
              marginBottom: 10,
            }}
          >
            探索你的命运密码
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: '600',
              color: '#d4af37',
              letterSpacing: 2,
            }}
          >
            destinyteller.com
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
