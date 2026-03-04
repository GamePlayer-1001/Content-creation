# Remotion 视频模板库

本目录包含预定义的视频模板，可直接使用或自定义。

## 📚 可用模板

### 1. 数据可视化 (DataVisualization)

**文件**: [data-visualization.tsx](./data-visualization.tsx)

**用途**: 创建动画图表和数据展示视频

**支持图表类型**:
- 柱状图 (bar)
- 折线图 (line)
- 饼图 (pie)
- 面积图 (area)

**特性**:
- 多种动画风格 (smooth, bounce, elastic)
- 自定义配色方案
- 网格和标签可选
- 响应式设计

**示例**:
```tsx
<DataVisualization
  title="2026 年度销售"
  data={[
    { label: 'Q1', value: 250, color: '#FF6B6B' },
    { label: 'Q2', value: 320, color: '#4ECDC4' }
  ]}
  chartType="bar"
  animationStyle="bounce"
/>
```

---

### 2. 玄学工坊宣传 (DestinyTellerPromo)

**文件**: [destiny-teller-promo.tsx](./destiny-teller-promo.tsx)

**用途**: 为 [destinyteller.com](https://destinyteller.com/) 创建品牌宣传视频

**核心元素**:
- 太极符号旋转动画
- 深蓝 + 金色配色
- 粒子背景效果
- 多场景时序编排

**场景结构** (16秒):
1. **开场** (0-4秒): 太极出现 + 旋转
2. **品牌** (4-7秒): 品牌名称展示
3. **特性** (7-13秒): 3个功能卡片
4. **CTA** (13-16秒): 网站地址 + 二维码

**输出格式**:
- 横屏: 1920x1080 (YouTube, 官网)
- 方形: 1080x1080 (Instagram, 微信)
- 竖屏: 1080x1920 (抖音, TikTok)

**示例**:
```tsx
<DestinyTellerPromo
  brandName="玄学工坊"
  tagline="Destiny Teller"
  subtitle="探索命运的智慧指引"
  features={[
    { icon: '☯', title: 'AI 八字分析', description: '...' },
    { icon: '🔮', title: '梅花易数', description: '...' },
    { icon: '✨', title: '智慧指引', description: '...' }
  ]}
  website="destinyteller.com"
/>
```

**详细文档**: [DESTINY_TELLER.md](../examples/DESTINY_TELLER.md)

---

## 🎨 即将推出的模板

### 3. 社交媒体模板 (SocialMediaTemplate)

**计划特性**:
- 方形/竖屏格式优化
- 快节奏动画
- 大字幕效果
- 适用于 Instagram/TikTok

### 4. 解释器视频 (ExplainerVideo)

**计划特性**:
- 文字 + 图标动画
- 步骤式展示
- 配音同步
- 适用于教育内容

### 5. 产品介绍 (ProductIntro)

**计划特性**:
- 3D 旋转效果
- 特性高亮
- 价格展示
- 购买按钮 CTA

### 6. 公司简介 (CompanyProfile)

**计划特性**:
- 团队照片展示
- 公司文化元素
- 历程时间线
- 联系方式

---

## 🚀 使用方式

### 在 Claude Code 中使用

只需告诉 Claude：

```
用数据可视化模板创建一个销售图表视频
```

或

```
用玄学工坊模板生成宣传视频
```

### 在代码中使用

```tsx
import { DataVisualization } from './templates/data-visualization';
import { DestinyTellerPromo } from './templates/destiny-teller-promo';

// 在 Remotion composition 中使用
<Composition
  id="my-video"
  component={DataVisualization}
  durationInFrames={180}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    title: '我的数据',
    data: [...]
  }}
/>
```

### 在 CLI 中使用

```bash
# 预览
npm run studio

# 渲染
npx remotion render src/index.tsx my-composition output.mp4
```

---

## 🎬 创建自定义模板

### 步骤 1: 创建模板文件

```tsx
// templates/my-template.tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';

export interface MyTemplateProps {
  title: string;
  color: string;
}

export const MyTemplate: React.FC<MyTemplateProps> = ({ title, color }) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: color }}>
      <h1 style={{ opacity }}>{title}</h1>
    </AbsoluteFill>
  );
};
```

### 步骤 2: 注册到 Root

```tsx
// src/Root.tsx
import { MyTemplate } from './templates/my-template';

<Composition
  id="my-template"
  component={MyTemplate}
  durationInFrames={300}
  fps={30}
  width={1920}
  height={1080}
  defaultProps={{
    title: 'Hello',
    color: '#000'
  }}
/>
```

### 步骤 3: 测试和调优

```bash
npm run studio
# 访问 http://localhost:3000
# 选择 "my-template" 预览
```

---

## 📖 模板开发指南

### 设计原则

1. **参数化**: 所有可变元素通过 props 控制
2. **响应式**: 支持多种分辨率
3. **性能**: 使用 useMemo 优化
4. **可维护**: 代码结构清晰，注释完整

### 最佳实践

#### 1. Props 类型定义

```tsx
export interface MyTemplateProps {
  // 必需属性
  title: string;

  // 可选属性（提供默认值）
  backgroundColor?: string;

  // 联合类型
  layout?: 'horizontal' | 'vertical';

  // 复杂对象
  items?: Array<{
    label: string;
    value: number;
  }>;
}

const defaultProps: MyTemplateProps = {
  title: 'Default Title',
  backgroundColor: '#000',
  layout: 'horizontal',
  items: []
};
```

#### 2. 动画优化

```tsx
// ✅ 好 - 使用 useMemo
const animatedValue = useMemo(
  () => interpolate(frame, [0, 100], [0, 1]),
  [frame]
);

// ❌ 不好 - 每帧重新计算
const animatedValue = interpolate(frame, [0, 100], [0, 1]);
```

#### 3. 样式管理

```tsx
// ✅ 好 - 使用 useMemo
const style = useMemo(() => ({
  transform: `scale(${scale})`,
  opacity: opacity
}), [scale, opacity]);

// ❌ 不好 - 每帧创建新对象
const style = {
  transform: `scale(${scale})`,
  opacity: opacity
};
```

#### 4. 场景分离

```tsx
// 使用 Sequence 分离场景
<Sequence from={0} durationInFrames={100}>
  <IntroScene />
</Sequence>

<Sequence from={100} durationInFrames={200}>
  <MainScene />
</Sequence>

<Sequence from={300} durationInFrames={100}>
  <OutroScene />
</Sequence>
```

#### 5. 配色系统

```tsx
// 定义配色主题
const themes = {
  dark: {
    background: '#1a1a2e',
    primary: '#d4af37',
    text: '#ffffff'
  },
  light: {
    background: '#ffffff',
    primary: '#4a90e2',
    text: '#333333'
  }
};

// 使用主题
const theme = themes[props.theme || 'dark'];
```

---

## 🎨 视觉资源

### 颜色推荐

**品牌色**:
- 蓝色: #4A90E2 (科技感)
- 金色: #D4AF37 (高端感)
- 红色: #FF6B6B (活力感)
- 绿色: #4ECDC4 (清新感)

**渐变组合**:
- `linear-gradient(135deg, #667eea 0%, #764ba2 100%)` - 紫色渐变
- `linear-gradient(135deg, #0f3460 0%, #1a1a2e 100%)` - 深蓝渐变
- `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)` - 粉色渐变

### 字体推荐

**中文**:
- 标题: Noto Serif SC (思源宋体), STSong
- 正文: Noto Sans SC (思源黑体), STHeiti
- 装饰: Ma Shan Zheng (马善政)

**英文**:
- 标题: Georgia, Playfair Display
- 正文: Inter, Roboto
- 等宽: Fira Code, JetBrains Mono

### 动画曲线

```tsx
import { Easing } from 'remotion';

// 进入动画
Easing.out(Easing.cubic)

// 退出动画
Easing.in(Easing.cubic)

// 弹性效果
Easing.elastic(1)

// 弹跳效果
Easing.bounce
```

---

## 📊 性能优化

### 渲染优化

1. **减少粒子数量**
2. **使用 CSS transform 替代 position**
3. **避免复杂滤镜（blur, shadow）**
4. **限制 SVG 复杂度**

### 文件大小优化

1. **使用 WebP/AVIF 图片**
2. **压缩音频文件**
3. **适当的 CRF 值** (18-23)
4. **删除未使用资源**

---

## 🔗 相关资源

- [主文档](../SKILL.md)
- [示例代码](../examples/)
- [Remotion 官方文档](https://www.remotion.dev/docs)
- [动画灵感](https://motion.dev/)

---

## 📝 贡献模板

欢迎提交新模板！请确保：

1. ✅ 完整的 TypeScript 类型定义
2. ✅ 详细的注释和文档
3. ✅ 示例 props 和默认值
4. ✅ 响应式支持
5. ✅ 性能优化

提交模板时请包含：
- 模板源代码 (.tsx)
- 使用文档 (.md)
- 示例渲染视频
- Props 接口说明

---

**更新时间**: 2026-02-02
**模板数量**: 2 (+ 4 即将推出)
