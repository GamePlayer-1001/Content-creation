# 内容生成输出 — 全平台内容推广工具集
Claude Code Skills + YAML Config + 统一工具链

> L1 项目宪法 | 13平台内容流水线 | 母稿驱动 + 配置化赛道 | 四项目融合

## 架构概览

一篇母稿 → 13个平台衍生内容。双层质量体系：
- **母稿层**：双路径输入 → 角度发散(4维评分) → 原创编撰(病毒公式) → 对抗性审查(Cold Editor) → 质量门控(>=8分) → 合规检查
- **平台层**：三轮润色 → 质量门控(>=9分) → 合规检查 → 后处理

母稿是干净的高质量内容原料，不做口语化/降AI味处理。三轮润色下沉到平台适配层。
四项目融合完毕(CAT5_Brain/CAT5_Factory/Auto-Redbook/玄学赛道)，CAT5_Factory v5.0 全量吸收（病毒方法论+10种洗稿风格+4新平台+四轨审核+海报提示词）。

## 目录结构

```
内容生成输出/
├── .claude/
│   ├── commands/           # Skills 入口（22个 /命令）
│   │   ├── 母稿.md         # 核心创作引擎（9步：输入→方向→角度→编撰→审查→修订→门控→合规→输出）
│   │   ├── 小红书.md       # C组：小红书图文 + 卡片 + 封面
│   │   ├── 公众号.md       # A组：公众号/百家号/头条
│   │   ├── 即刻.md         # C组：即刻短文本（100-300字）
│   │   ├── 知乎.md         # A组：知乎深度长文（1500-3000字）
│   │   ├── X推文.md        # E组：英文推文（280字符）
│   │   ├── Medium.md       # D组：英文长文（1500-3000 words）
│   │   ├── Quora.md        # D组：英文问答（500-2000 words）
│   │   ├── Reddit.md       # E组：英文社区帖（灵活长度）
│   │   ├── linuxdo.md      # B组：技术社区帖（零营销感）
│   │   ├── GitHub.md       # B组：Discussion/PR/Issue 草稿
│   │   ├── 朋友圈.md       # F组：私域内容
│   │   ├── 今日任务.md     # 根据Day N生成待办清单
│   │   ├── 周复盘.md       # 周复盘报告
│   │   ├── 合规检查.md     # 内容合规审查
│   │   ├── 卡片渲染.md     # MD → 小红书卡片PNG
│   │   ├── 全平台分发.md   # 一键从母稿衍生全平台
│   │   ├── 优化去AI.md     # 流水线Step4：去AI优化（保持原风格，不做风格改写）
│   │   ├── 洗稿.md         # 10种风格改写(A-J) + 降AI检测
│   │   ├── 热点抓取.md     # 小红书/RSS热点采集
│   │   ├── 自动发布.md     # Playwright自动化发布
│   │   └── 图标封面.md     # Lucide Icons封面生成
│   └── settings.local.json # 工具权限白名单
│
├── config/                 # 可配置层（换赛道只改这里）
│   ├── product.yaml        # 产品/品牌/赛道/选题池
│   ├── platforms.yaml      # 13平台语气风格规则(6组) + 配图命名
│   ├── schedule.yaml       # 60天排期 + 日类型 + 发布时段
│   ├── compliance.yaml     # 合规规则库（敏感词/红线）
│   ├── creator.yaml        # 人设 + 风格DNA + 病毒方法论 + 8种创作方向 + 双层质量体系
│   ├── icons.json          # Lucide图标分类映射（12类×1000+）
│   ├── hashtags.json       # 标签库（12类×83标签）
│   ├── topics.json         # 热门话题库
│   ├── promotion.json      # 推广策略（4种风格权重）
│   ├── selectors.json      # 小红书CSS选择器（自动化发布）
│   ├── image-prompts.json  # 图片 prompt 历史存储
│   ├── poster-templates.json # 海报提示词模板（11种文字放置×8视觉风格）
│   ├── .env                # 环境变量 (GOOGLE_AI_KEY 等)
│   └── .env.example        # 环境变量模板
│
├── templates/              # 内容模板（11 + 参考案例）
│   ├── 母稿-猎奇型.md
│   ├── 母稿-教程型.md
│   ├── 母稿-互动型.md
│   ├── 洗稿-个人故事型.md   # from CAT5_Brain
│   ├── 洗稿-对话场景型.md
│   ├── 洗稿-情感共鸣型.md
│   ├── 洗稿-优化版.md
│   ├── 洗稿-口语重写版.md
│   ├── 技术文章-mentor.md   # from CAT5_Brain linuxdo
│   ├── 技术文章-mentor-v2.md
│   ├── 周复盘.md
│   └── 参考案例/            # 小红书案例 + 输入案例
│
├── tools/                  # 统一工具链
│   ├── cover/              # 封面生成（Gemini API）
│   ├── card/               # 卡片渲染（8主题×4模式）
│   ├── screenshot/         # 微信截图（9种消息类型）
│   ├── publish/            # 发布工具（标准/隐身/API）
│   ├── scraper/            # 热点抓取（小红书/RSS）
│   ├── scheduler/          # 自动调度（3时段）
│   ├── generator/          # AI内容生成管道
│   ├── video/              # Remotion视频渲染
│   ├── jianying/           # 剪映自动化
│   ├── tests/              # 测试脚本（from Auto-Redbook-Skills）
│   ├── hooks/              # Git hooks
│   ├── utils/              # 日志等通用工具
│   └── manage.py           # 交互式CLI管理器
│
├── assets/                 # 静态资源
│   ├── themes/             # 8种卡片渲染主题CSS
│   ├── templates/          # HTML渲染模板
│   ├── stickers/           # 表情包（9情绪×37+贴纸）
│   ├── wechat-css/         # 微信截图CSS
│   ├── wechat-fonts/       # 微信截图字体
│   └── wechat-images/      # 微信截图UI资源
│
├── output/                 # 所有生成内容
│   ├── 母稿/ 小红书/ 公众号/ 即刻/ 知乎/ X/ Medium/ Quora/ Reddit/ linuxdo/ GitHub/ 朋友圈/
│   ├── 图片/               # AI 生成图片 (按平台子目录)
│   ├── 封面/ 卡片/ 复盘/
│   ├── drafts/             # 草稿队列
│   └── queue/              # 发布队列
│
├── docs/                   # 只读参考文档
│   ├── 推广方案/
│   ├── 社区规范/
│   ├── auto-redbook/       # Auto-Redbook-Skills 存档文档（25篇）
│   └── 赛道存档/           # 赛道专有Skill存档（玄学赛道）
│
├── webapp/                 # Web 控制台（本地 HTTP 服务）
│   ├── server.js           # Express 入口 (port 3210)
│   ├── services/           # 核心服务层 (8个模块)
│   │   ├── ai-adapter.js       # AI 三引擎统一适配 (Claude/OpenRouter/DeepSeek)
│   │   ├── compliance-engine.js # 6维合规扫描
│   │   ├── config-manager.js    # YAML/JSON 读写
│   │   ├── output-manager.js    # output/ 目录管理
│   │   ├── schedule-engine.js   # 60天排期计算
│   │   ├── skill-loader.js      # Skill 模板引擎
│   │   ├── image-generator.js   # Nano Banana Pro 图片生成
│   │   └── prompt-store.js      # 图片 prompt 历史管理
│   ├── routes/             # API 路由层 (8个路由)
│   │   ├── dashboard.js    # GET /api/dashboard
│   │   ├── pipeline.js     # POST /api/pipeline/* (6步流水线)
│   │   ├── image.js        # POST /api/image/* (图片生成)
│   │   ├── creation.js     # POST /api/create (单次创作)
│   │   ├── content.js      # CRUD /api/content/*
│   │   ├── config.js       # CRUD /api/config/*
│   │   ├── compliance.js   # POST /api/compliance/*
│   │   ├── rewrite.js      # POST /api/rewrite (洗稿)
│   │   └── review.js       # GET/POST /api/review/*
│   └── public/             # Vanilla JS SPA (8个视图)
│       ├── index.html
│       ├── css/style.css
│       ├── lib/marked.min.js
│       └── js/
│           ├── app.js          # SPA 路由
│           ├── api.js          # API 客户端
│           ├── components/     # toast/nav/stream/editor/modal
│           └── views/          # 8个页面视图
│               ├── dashboard.js   # 仪表盘
│               ├── search.js      # 热帖搜索 (占位)
│               ├── pipeline.js    # 内容流水线 (6步向导)
│               ├── content.js     # 内容管理
│               ├── config.js      # 配置管理
│               ├── compliance.js  # 合规检查
│               ├── rewrite.js     # 洗稿
│               └── review.js      # 周复盘
│
├── videocheck/             # AI视频处理子系统（独立模块）
│
├── start.bat               # 一键启动 Web 控制台
└── improvements-backlog.md # 改进建议跟踪
```

## Web 控制台

双击 `start.bat` 启动，浏览器自动打开 `http://localhost:3210`。

### 8 个页面

| 页面 | 路由 | 功能 |
|------|------|------|
| 仪表盘 | `#/` | 产出统计 + 今日产出 + 快捷操作 |
| 热帖搜索 | `#/search` | 跨平台关键词搜索热帖 (占位, 搜索引擎接入中) |
| 内容流水线 | `#/pipeline` | **核心** — 6步向导式创作 |
| 内容管理 | `#/content` | 多平台 Tab 浏览 + CRUD |
| 配置管理 | `#/config` | YAML/JSON 编辑 |
| 合规检查 | `#/compliance` | 6维合规扫描 |
| 洗稿 | `#/rewrite` | 10种风格改写(A-J) + 降AI检测 |
| 周复盘 | `#/review` | 产出统计 + AI 周复盘报告 |

### 内容流水线 6 步

1. **输入素材** — 关键词/想法/长文本/热帖
2. **生成母稿** — 8种创作方向 + AI引擎选择 → SSE 流式生成
3. **多平台生成** — 选择平台 → 逐平台衍生
4. **优化去AI** — 合规检查 + 去AI优化（保持原风格，不做风格改写）
5. **图片生成** — Nano Banana Pro API + prompt 历史复用
6. **最终输出** — 去markdown + 文件链接 + Obsidian 打开

### 8 种创作方向

反对大众观点 / 提出新观点 / 反对旧观点提新 / 剖析引申新价值 / 反差冲突对比 / 对比评测 / 深度拆解 / 趋势预判

### AI 引擎

默认 Claude CLI（本地认证），可选 OpenRouter / DeepSeek（需配置 config/.env）。
图片生成使用 Nano Banana Pro (Gemini 3 Pro Image)，需配置 GOOGLE_AI_KEY。

## 日常使用（CLI 模式）

### 核心工作流
```
/今日任务           → 查看今天该做什么
/母稿 AI工具效率    → 创作核心长文
/全平台分发 output/母稿/xxx.md  → 一键13平台
```

### 单平台创作
```
/小红书 output/母稿/xxx.md   → 小红书图文+卡片+封面
/公众号 output/母稿/xxx.md   → 公众号+百家号+头条
/即刻 output/母稿/xxx.md     → 即刻短文
/知乎 output/母稿/xxx.md     → 知乎深度长文
/X推文 output/母稿/xxx.md    → 英文推文
/Medium output/母稿/xxx.md   → 英文长文
/Quora 问题内容              → 英文问答
/Reddit output/母稿/xxx.md   → 英文社区帖
/linuxdo 技术选型踩坑        → 技术社区帖
/GitHub Discussion: xxx      → GitHub草稿
/朋友圈 周三                 → 朋友圈文案
```

### 工具命令
```
/洗稿 output/母稿/xxx.md --style A  → 10种风格改写(A-J)
/合规检查 output/小红书/xxx.md       → 合规审查
/卡片渲染 xxx.md --theme retro       → 卡片PNG
/周复盘                              → 周复盘报告
```

## 核心机制

### 母稿创作引擎（9步流程）
1. **加载配置** — product.yaml + creator.yaml + compliance.yaml
2. **输入分流** — <200字走关键词路径，>=200字走文章拆解路径（五维度）
3. **角度发散** — 在创作方向约束下发散3-5角度，4维评分(爆点潜力/病毒传播力/交互感/内容深度)选最优
4. **原创编撰** — 病毒公式(Virality=Novelty×Resonance) + 三种钩子 + Burstiness节奏 + 中文黑名单零容忍
5. **对抗性审查** — Cold Editor 三问攻击（为什么继续看/观点早知道了/看完所以呢），致命级→打回
6. **修订循环** — 最多2轮 Writer↔Editor 循环
7. **质量门控** — 四维评分(钩子强度/洞察密度/传播基因/论证深度) >= 8分通过
8. **合规检查** — compliance.yaml 规则扫描
9. **输出** — 只输出标题+正文，零过程信息

### 平台适配层（三轮润色）
1. 降AI味：删除书面连接词 + 替换书面表达 + 打破逻辑链
2. 加人类废话(10-15%)：语气词 + 口头废话 + 情绪爆发
3. 加倒装句(3-5个)：先蹦重点再补主语
平台质量门控：四维评分(钩子强度/互动设计/人味指数/趣味度) >= 9分 + 四轨审核(SEO20%+AI痕迹30%+爆发度25%+传播潜力25%) >= 70分

### 病毒方法论（from CAT5_Factory v5.0）
- **公式**: Virality = Novelty × Resonance
- **三种钩子**: 半讲故事 / 无答案问题 / 反直觉事实
- **Burstiness**: 短句(≤10字)占25-35%，连续长句≤5，情绪爆点≥2个/千字
- **中文黑名单**: 翻译腔/空洞过渡/AI废话/假客观/总结套话/过度修饰/大词虚词 — 零容忍

### 反AI检测策略
8项操作：打破对仗 → 口语碎碎念 → 删总结句 → 场景替代 → 术语口语化 → 思考过程句 → 随意化 → 故事展开

### 洗稿10种风格(A-J)
A=个人故事型 / B=对话场景型 / C=观点论述型 / D=情感共鸣型 / E=干货清单型 / F=视频口播型 / G=技术深度型 / H=争议讨论型 / I=轻松娱乐型 / J=专业权威型

### 平台分组（6组13平台）
- A组(长图文): 公众号 → 百家号/今日头条 / 知乎
- B组(技术社区): linuxdo / GitHub
- C组(社交平台): 小红书 / 即刻
- D组(国际长文): Medium / Quora
- E组(国际社交): X/Twitter / Reddit
- F组(私域): 朋友圈

## 工具路径

```bash
# 封面生成（Gemini API）
cd "D:/Software/内容生成输出" && node tools/cover/generate-cover.mjs --title "..." --type narrative --output "..."

# 卡片渲染（8主题×4模式）
python "D:/Software/内容生成输出/tools/card/render_xhs.py" file.md -t professional -m auto-split -o "output/卡片/"

# 小红书发布
python "D:/Software/内容生成输出/tools/publish/publish_xhs.py" --title "..." --desc "..." --images *.png

# 微信截图（9种消息类型）
cd "D:/Software/内容生成输出" && node tools/screenshot/generate-wechat-screenshot.mjs "input.md"
```

## 换赛道

只需修改 `config/` 下的 YAML/JSON 文件。Skills 和 tools/ 本身是赛道无关的。

## 融合记录

| 子项目 | 状态 | 吸收内容 |
|--------|------|----------|
| CAT5_Brain | 已清除 | 洗稿模板、技术文章模板 → templates/ |
| Auto-Redbook-Skills | 已清除 | 存档文档 → docs/auto-redbook/ |
| CAT5_Factory v5.0 | 已删除 | 病毒方法论 + 10种洗稿风格(A-J) + 4新平台(知乎/Medium/Reddit/Quora) + 四轨审核 + 海报提示词 → creator.yaml + 洗稿.md + platforms.yaml + poster-templates.json |

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
