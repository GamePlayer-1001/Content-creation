/**
 * DestinyTeller 扩展版视频模板
 *
 * 横版: 66 秒完整版
 * 竖版: 30 秒快节奏版
 */

import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  Sequence
} from 'remotion';

// ============================================================================
// 类型定义
// ============================================================================

export interface DestinyExtendedProps {
  version?: 'landscape' | 'vertical'; // 版本选择
  brandName?: string;
  website?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

const defaultProps: DestinyExtendedProps = {
  version: 'landscape',
  brandName: '玄学工坊',
  website: 'destinyteller.com',
  primaryColor: '#d4af37',
  secondaryColor: '#0f3460'
};

// ============================================================================
// 主组件
// ============================================================================

export const DestinyExtended: React.FC<DestinyExtendedProps> = (props) => {
  const mergedProps = { ...defaultProps, ...props };
  const { fps } = useVideoConfig();

  if (mergedProps.version === 'landscape') {
    return <LandscapeVersion {...mergedProps} />;
  } else {
    return <VerticalVersion {...mergedProps} />;
  }
};

// ============================================================================
// 横版 66 秒完整版
// ============================================================================

const LandscapeVersion: React.FC<DestinyExtendedProps> = (props) => {
  return (
    <AbsoluteFill>
      {/* 1. 开场 - 太极宇宙 (0-5秒) */}
      <Sequence from={0} durationInFrames={150} name="Intro">
        <IntroScene {...props} />
      </Sequence>

      {/* 2. 品牌展示 (5-9秒) */}
      <Sequence from={150} durationInFrames={120} name="Brand">
        <BrandScene {...props} />
      </Sequence>

      {/* 3. 平台介绍 (9-15秒) */}
      <Sequence from={270} durationInFrames={180} name="Introduction">
        <IntroductionScene {...props} />
      </Sequence>

      {/* 4. 功能 1 - AI 八字 (15-25秒) */}
      <Sequence from={450} durationInFrames={300} name="Feature1">
        <Feature1Scene {...props} />
      </Sequence>

      {/* 5. 功能 2 - 梅花易数 (25-35秒) */}
      <Sequence from={750} durationInFrames={300} name="Feature2">
        <Feature2Scene {...props} />
      </Sequence>

      {/* 6. 功能 3 - 智能指引 (35-45秒) */}
      <Sequence from={1050} durationInFrames={300} name="Feature3">
        <Feature3Scene {...props} />
      </Sequence>

      {/* 7. 应用场景 (45-53秒) */}
      <Sequence from={1350} durationInFrames={240} name="Showcase">
        <ShowcaseScene {...props} />
      </Sequence>

      {/* 8. 用户评价 (53-60秒) */}
      <Sequence from={1590} durationInFrames={210} name="Testimonials">
        <TestimonialsScene {...props} />
      </Sequence>

      {/* 9. CTA 召唤 (60-66秒) */}
      <Sequence from={1800} durationInFrames={180} name="CTA">
        <CTAScene {...props} />
      </Sequence>

      {/* 背景音乐 (全程) */}
      {/* <Audio src="./assets/bg-music.mp3" /> */}
    </AbsoluteFill>
  );
};

// ============================================================================
// 竖版 30 秒快节奏版
// ============================================================================

const VerticalVersion: React.FC<DestinyExtendedProps> = (props) => {
  return (
    <AbsoluteFill>
      {/* 1. 开场 (0-3秒) */}
      <Sequence from={0} durationInFrames={90} name="Intro">
        <IntroSceneVertical {...props} />
      </Sequence>

      {/* 2. Hook 吸引 (3-6秒) */}
      <Sequence from={90} durationInFrames={90} name="Hook">
        <HookScene {...props} />
      </Sequence>

      {/* 3. 功能快闪 (6-21秒) */}
      <Sequence from={180} durationInFrames={450} name="Features">
        <FeaturesQuickScene {...props} />
      </Sequence>

      {/* 4. 核心利益 (21-25秒) */}
      <Sequence from={630} durationInFrames={120} name="Benefit">
        <BenefitScene {...props} />
      </Sequence>

      {/* 5. CTA (25-30秒) */}
      <Sequence from={750} durationInFrames={150} name="CTA">
        <CTASceneVertical {...props} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ============================================================================
// 场景组件 - 横版
// ============================================================================

// 1. 开场 - 太极宇宙
const IntroScene: React.FC<DestinyExtendedProps> = ({ primaryColor, secondaryColor }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const taijiScale = spring({
    frame,
    fps: 30,
    config: { damping: 15 }
  });

  const taijiRotation = interpolate(frame, [0, 150], [0, 720]);

  const particlesOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: 'clamp'
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #1a1a2e 0%, ${secondaryColor} 100%)`,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {/* 背景粒子 */}
      <div style={{ position: 'absolute', opacity: particlesOpacity }}>
        <BackgroundParticles color={primaryColor!} />
      </div>

      {/* 太极符号 */}
      <div
        style={{
          fontSize: 200,
          transform: `scale(${taijiScale}) rotate(${taijiRotation}deg)`,
          filter: `drop-shadow(0 0 40px ${primaryColor})`,
          transition: 'all 0.3s ease'
        }}
      >
        ☯
      </div>
    </AbsoluteFill>
  );
};

// 2. 品牌展示
const BrandScene: React.FC<DestinyExtendedProps> = ({ brandName, primaryColor, secondaryColor }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const titleY = spring({
    frame,
    fps: 30,
    from: 100,
    to: 0,
    config: { damping: 12 }
  });

  const subtitleOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateRight: 'clamp'
  });

  const taglineOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateRight: 'clamp'
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #1a1a2e 0%, ${secondaryColor} 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20
      }}
    >
      {/* 背景太极 */}
      <div
        style={{
          position: 'absolute',
          fontSize: 400,
          opacity: 0.05,
          transform: `rotate(${frame * 0.5}deg)`
        }}
      >
        ☯
      </div>

      {/* 品牌名 */}
      <div
        style={{
          fontSize: 120,
          fontWeight: 'bold',
          background: `linear-gradient(135deg, ${primaryColor} 0%, #e8c547 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transform: `translateY(${titleY}px)`,
          textAlign: 'center',
          fontFamily: 'STSong, "Noto Serif SC", serif'
        }}
      >
        {brandName}
      </div>

      {/* 英文名 */}
      <div
        style={{
          fontSize: 56,
          color: 'white',
          opacity: subtitleOpacity,
          letterSpacing: 8,
          textAlign: 'center',
          fontFamily: 'Georgia, serif'
        }}
      >
        DestinyTeller
      </div>

      {/* 标语 */}
      <div
        style={{
          fontSize: 32,
          color: 'rgba(255, 255, 255, 0.8)',
          opacity: taglineOpacity,
          textAlign: 'center',
          marginTop: 20
        }}
      >
        探索命运的智慧指引
      </div>
    </AbsoluteFill>
  );
};

// 3. 平台介绍
const IntroductionScene: React.FC<DestinyExtendedProps> = ({ primaryColor, secondaryColor }) => {
  const frame = useCurrentFrame();

  const textOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp'
  });

  const line1Opacity = interpolate(frame, [30, 60], [0, 1], { extrapolateRight: 'clamp' });
  const line2Opacity = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp' });
  const line3Opacity = interpolate(frame, [90, 120], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #1a1a2e 0%, ${secondaryColor} 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 100
      }}
    >
      {/* 背景装饰 */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%)`,
          opacity: textOpacity
        }}
      />

      {/* 主标题 */}
      <div
        style={{
          fontSize: 64,
          color: primaryColor,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 60,
          opacity: textOpacity
        }}
      >
        传统智慧 × AI 科技
      </div>

      {/* 介绍文字 */}
      <div style={{ textAlign: 'center', fontSize: 36, lineHeight: 1.8, color: 'white' }}>
        <div style={{ opacity: line1Opacity, marginBottom: 20 }}>
          融合千年易学精髓与现代人工智能
        </div>
        <div style={{ opacity: line2Opacity, marginBottom: 20 }}>
          为您提供精准的命运分析与指引
        </div>
        <div style={{ opacity: line3Opacity, color: 'rgba(255, 255, 255, 0.8)' }}>
          让未来不再迷茫，让决策更加从容
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4-6. 功能展示场景 (AI 八字、梅花易数、智能指引)
const Feature1Scene: React.FC<DestinyExtendedProps> = ({ primaryColor, secondaryColor }) => {
  return (
    <FeatureSceneTemplate
      icon="☯"
      title="AI 八字命理分析"
      subtitle="Ba Zi Analysis"
      points={[
        '基于生辰八字的精准分析',
        '性格特质深度解读',
        '事业发展趋势预测',
        '财运机遇分析',
        '婚姻情感指引'
      ]}
      primaryColor={primaryColor!}
      secondaryColor={secondaryColor!}
    />
  );
};

const Feature2Scene: React.FC<DestinyExtendedProps> = ({ primaryColor, secondaryColor }) => {
  return (
    <FeatureSceneTemplate
      icon="🔮"
      title="梅花易数占卜"
      subtitle="Plum Blossom Divination"
      points={[
        '传统起卦方法',
        '事业决策智能分析',
        '财运趋势精准预测',
        '人际关系解读',
        '吉凶时机选择'
      ]}
      primaryColor={primaryColor!}
      secondaryColor={secondaryColor!}
    />
  );
};

const Feature3Scene: React.FC<DestinyExtendedProps> = ({ primaryColor, secondaryColor }) => {
  return (
    <FeatureSceneTemplate
      icon="🎯"
      title="智能命运指引"
      subtitle="AI-Powered Guidance"
      points={[
        '每日运势实时推送',
        '关键决策智能建议',
        '个人潜能深度挖掘',
        '趋吉避凶策略规划',
        '长期人生路径咨询'
      ]}
      primaryColor={primaryColor!}
      secondaryColor={secondaryColor!}
    />
  );
};

// 功能展示模板
const FeatureSceneTemplate: React.FC<{
  icon: string;
  title: string;
  subtitle: string;
  points: string[];
  primaryColor: string;
  secondaryColor: string;
}> = ({ icon, title, subtitle, points, primaryColor, secondaryColor }) => {
  const frame = useCurrentFrame();

  const iconScale = spring({ frame, fps: 30, config: { damping: 10 } });
  const titleOpacity = interpolate(frame, [15, 45], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #1a1a2e 0%, ${secondaryColor} 100%)`,
        padding: 100
      }}
    >
      <div style={{ display: 'flex', gap: 80, alignItems: 'center', height: '100%' }}>
        {/* 左侧图标 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              fontSize: 280,
              transform: `scale(${iconScale})`,
              filter: `drop-shadow(0 0 60px ${primaryColor})`
            }}
          >
            {icon}
          </div>
        </div>

        {/* 右侧内容 */}
        <div style={{ flex: 1.5, opacity: titleOpacity }}>
          {/* 标题 */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: primaryColor,
              marginBottom: 20
            }}
          >
            {title}
          </div>

          {/* 副标题 */}
          <div
            style={{
              fontSize: 32,
              color: 'rgba(255, 255, 255, 0.6)',
              marginBottom: 50,
              letterSpacing: 2
            }}
          >
            {subtitle}
          </div>

          {/* 功能点 */}
          <div style={{ fontSize: 28, lineHeight: 2, color: 'white' }}>
            {points.map((point, index) => {
              const pointOpacity = interpolate(
                frame,
                [60 + index * 30, 90 + index * 30],
                [0, 1],
                { extrapolateRight: 'clamp' }
              );

              return (
                <div
                  key={index}
                  style={{
                    opacity: pointOpacity,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 15,
                    marginBottom: 15
                  }}
                >
                  <span style={{ color: primaryColor, fontSize: 32 }}>✓</span>
                  {point}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 7. 应用场景展示
const ShowcaseScene: React.FC<DestinyExtendedProps> = ({ primaryColor, secondaryColor }) => {
  const frame = useCurrentFrame();

  const scenarios = [
    { icon: '💼', title: '职场晋升决策', desc: '分析最佳时机' },
    { icon: '💰', title: '投资理财规划', desc: '把握财运机遇' },
    { icon: '💕', title: '婚姻择偶指导', desc: '寻找命中注定' },
    { icon: '🏥', title: '健康养生建议', desc: '预防胜于治疗' }
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #1a1a2e 0%, ${secondaryColor} 100%)`,
        padding: 100
      }}
    >
      {/* 标题 */}
      <div
        style={{
          fontSize: 64,
          color: primaryColor,
          textAlign: 'center',
          marginBottom: 80,
          fontWeight: 'bold'
        }}
      >
        多场景智能应用
      </div>

      {/* 场景卡片 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 50,
          padding: '0 50px'
        }}
      >
        {scenarios.map((scenario, index) => {
          const cardOpacity = interpolate(
            frame,
            [30 + index * 30, 60 + index * 30],
            [0, 1],
            { extrapolateRight: 'clamp' }
          );

          const cardY = interpolate(
            frame,
            [30 + index * 30, 60 + index * 30],
            [50, 0],
            { extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: `2px solid ${primaryColor}`,
                borderRadius: 20,
                padding: 40,
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ fontSize: 80, marginBottom: 20 }}>{scenario.icon}</div>
              <div style={{ fontSize: 36, color: 'white', fontWeight: 'bold', marginBottom: 10 }}>
                {scenario.title}
              </div>
              <div style={{ fontSize: 24, color: 'rgba(255, 255, 255, 0.7)' }}>
                {scenario.desc}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 8. 用户评价
const TestimonialsScene: React.FC<DestinyExtendedProps> = ({ primaryColor, secondaryColor }) => {
  const frame = useCurrentFrame();

  const testimonials = [
    { text: '分析准确度令人惊叹，真的帮我做出了重要决策', author: '张先生', role: '企业高管' },
    { text: '传统文化与AI结合得很好，每日运势特别实用', author: '李女士', role: '自由职业者' },
    { text: '八字分析非常专业，给了我很多人生启发', author: '王先生', role: '投资人' }
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #1a1a2e 0%, ${secondaryColor} 100%)`,
        padding: 100
      }}
    >
      {/* 标题 */}
      <div
        style={{
          fontSize: 64,
          color: primaryColor,
          textAlign: 'center',
          marginBottom: 60,
          fontWeight: 'bold'
        }}
      >
        用户真实评价
      </div>

      {/* 评价卡片 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
        {testimonials.map((item, index) => {
          const opacity = interpolate(
            frame,
            [20 + index * 40, 50 + index * 40],
            [0, 1],
            { extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderLeft: `4px solid ${primaryColor}`,
                borderRadius: 10,
                padding: 30,
                opacity,
                backdropFilter: 'blur(10px)'
              }}
            >
              <div style={{ fontSize: 28, color: 'white', marginBottom: 15, lineHeight: 1.6 }}>
                "{item.text}"
              </div>
              <div style={{ fontSize: 22, color: primaryColor }}>
                — {item.author} · {item.role}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// 9. CTA 召唤
const CTAScene: React.FC<DestinyExtendedProps> = ({ website, primaryColor, secondaryColor }) => {
  const frame = useCurrentFrame();

  const logoScale = spring({ frame, fps: 30, config: { damping: 10 } });
  const textOpacity = interpolate(frame, [20, 50], [0, 1], { extrapolateRight: 'clamp' });
  const buttonScale = spring({ frame: frame - 60, fps: 30, config: { damping: 8 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #1a1a2e 0%, ${secondaryColor} 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 50
      }}
    >
      {/* 背景太极 */}
      <div
        style={{
          position: 'absolute',
          fontSize: 600,
          opacity: 0.05,
          transform: `rotate(${frame * 0.3}deg)`
        }}
      >
        ☯
      </div>

      {/* Logo */}
      <div
        style={{
          fontSize: 150,
          transform: `scale(${logoScale})`,
          filter: `drop-shadow(0 0 40px ${primaryColor})`
        }}
      >
        ☯
      </div>

      {/* 网站地址 */}
      <div
        style={{
          fontSize: 80,
          fontWeight: 'bold',
          color: primaryColor,
          opacity: textOpacity,
          letterSpacing: 4
        }}
      >
        {website}
      </div>

      {/* CTA 文字 */}
      <div
        style={{
          fontSize: 40,
          color: 'white',
          opacity: textOpacity,
          textAlign: 'center'
        }}
      >
        立即开启您的命运探索之旅
      </div>

      {/* 按钮 */}
      <div
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, #e8c547 100%)`,
          padding: '20px 80px',
          borderRadius: 50,
          fontSize: 36,
          fontWeight: 'bold',
          color: secondaryColor,
          transform: `scale(${buttonScale})`,
          boxShadow: `0 10px 40px rgba(212, 175, 55, 0.4)`,
          cursor: 'pointer'
        }}
      >
        免费体验
      </div>

      {/* 二维码占位 */}
      <div
        style={{
          width: 180,
          height: 180,
          background: 'white',
          borderRadius: 10,
          opacity: textOpacity,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 24,
          color: '#333'
        }}
      >
        [二维码]
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// 场景组件 - 竖版 (快节奏)
// ============================================================================

const IntroSceneVertical: React.FC<DestinyExtendedProps> = ({ primaryColor, secondaryColor }) => {
  const frame = useCurrentFrame();

  const logoScale = spring({ frame, fps: 30, config: { damping: 20, mass: 0.3 } });
  const textOpacity = interpolate(frame, [15, 40], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #1a1a2e 0%, ${secondaryColor} 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30
      }}
    >
      <div
        style={{
          fontSize: 200,
          transform: `scale(${logoScale}) rotate(${frame * 3}deg)`,
          filter: `drop-shadow(0 0 40px ${primaryColor})`
        }}
      >
        ☯
      </div>
      <div
        style={{
          fontSize: 70,
          fontWeight: 'bold',
          color: primaryColor,
          opacity: textOpacity
        }}
      >
        玄学工坊
      </div>
      <div style={{ fontSize: 40, color: 'white', opacity: textOpacity }}>
        DestinyTeller
      </div>
    </AbsoluteFill>
  );
};

const HookScene: React.FC<DestinyExtendedProps> = ({ primaryColor }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps: 30, config: { damping: 10 } });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #0f3460 0%, #1a1a2e 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60
      }}
    >
      <div
        style={{
          fontSize: 60,
          fontWeight: 'bold',
          color: primaryColor,
          textAlign: 'center',
          lineHeight: 1.5,
          transform: `scale(${scale})`
        }}
      >
        想知道你的
        <br />
        命运密码吗？
      </div>
    </AbsoluteFill>
  );
};

const FeaturesQuickScene: React.FC<DestinyExtendedProps> = ({ primaryColor }) => {
  const frame = useCurrentFrame();

  const features = [
    { icon: '☯', title: 'AI 八字', text: '精准解读命运密码', startFrame: 0 },
    { icon: '🔮', title: '梅花易数', text: '洞察未来趋势', startFrame: 150 },
    { icon: '🎯', title: '智能指引', text: '把握人生方向', startFrame: 300 }
  ];

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0f3460 100%)' }}>
      {features.map((feature, index) => {
        const localFrame = frame - feature.startFrame;
        if (localFrame < 0 || localFrame >= 150) return null;

        const opacity = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
        const scale = spring({ frame: localFrame, fps: 30, config: { damping: 15 } });

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 30,
              opacity,
              padding: 60
            }}
          >
            <div
              style={{
                fontSize: 220,
                transform: `scale(${scale})`,
                filter: `drop-shadow(0 0 40px ${primaryColor})`
              }}
            >
              {feature.icon}
            </div>
            <div style={{ fontSize: 70, fontWeight: 'bold', color: primaryColor }}>
              {feature.title}
            </div>
            <div style={{ fontSize: 40, color: 'white', textAlign: 'center', lineHeight: 1.5 }}>
              {feature.text}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const BenefitScene: React.FC<DestinyExtendedProps> = ({ primaryColor }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #0f3460 0%, #1a1a2e 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60
      }}
    >
      <div
        style={{
          fontSize: 55,
          fontWeight: 'bold',
          color: primaryColor,
          textAlign: 'center',
          lineHeight: 1.8,
          opacity
        }}
      >
        传统智慧 × AI 科技
        <br />
        <span style={{ fontSize: 45, color: 'white' }}>让命运不再迷茫</span>
      </div>
    </AbsoluteFill>
  );
};

const CTASceneVertical: React.FC<DestinyExtendedProps> = ({ website, primaryColor }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame, fps: 30, config: { damping: 12 } });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #1a1a2e 0%, #0f3460 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40
      }}
    >
      <div
        style={{
          fontSize: 90,
          transform: `scale(${scale})`,
          filter: `drop-shadow(0 0 40px ${primaryColor})`
        }}
      >
        ☯
      </div>
      <div style={{ fontSize: 55, fontWeight: 'bold', color: primaryColor, letterSpacing: 3 }}>
        {website}
      </div>
      <div
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, #e8c547 100%)`,
          padding: '25px 70px',
          borderRadius: 50,
          fontSize: 45,
          fontWeight: 'bold',
          color: '#1a1a2e',
          transform: `scale(${interpolate(frame, [30, 60], [0.8, 1], { extrapolateRight: 'clamp' })})`,
          boxShadow: `0 10px 40px rgba(212, 175, 55, 0.5)`
        }}
      >
        扫码体验
      </div>
      <div
        style={{
          width: 280,
          height: 280,
          background: 'white',
          borderRadius: 15,
          marginTop: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 35,
          color: '#333'
        }}
      >
        [二维码]
      </div>
    </AbsoluteFill>
  );
};

// ============================================================================
// 辅助组件
// ============================================================================

const BackgroundParticles: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const particles = Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * 1920,
    y: Math.random() * 1080,
    size: Math.random() * 4 + 2,
    speed: Math.random() * 0.5 + 0.2
  }));

  return (
    <div style={{ position: 'absolute', width: 1920, height: 1080 }}>
      {particles.map((p, i) => {
        const y = (p.y + frame * p.speed) % 1080;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: p.x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 ${p.size * 2}px ${color}`,
              opacity: 0.6
            }}
          />
        );
      })}
    </div>
  );
};
