# 内容生成输出 — 全平台内容推广工具集
Claude Code Skills + YAML Config + 统一工具链

> L1 项目宪法 | 9平台内容流水线 | 母稿驱动 + 配置化赛道 | 三项目融合

## 架构概览

一篇母稿 → 9个平台衍生内容。所有创作遵循：三轮润色 → 质量门控(>=9分) → 合规检查 → 后处理。
三个独立子项目已融合完毕，子项目目录已清除。差异化文件归档至 docs/。

## 目录结构

```
内容生成输出/
├── .claude/
│   ├── commands/           # Skills 入口（17个 /命令）
│   │   ├── 母稿.md         # 核心长文创作引擎
│   │   ├── 小红书.md       # 小红书图文 + 卡片 + 封面
│   │   ├── 公众号.md       # A组：公众号/百家号/头条
│   │   ├── 即刻.md         # 即刻短文本（100-300字）
│   │   ├── X推文.md        # 英文推文（280字符）
│   │   ├── linuxdo.md      # 技术社区帖（零营销感）
│   │   ├── GitHub.md       # Discussion/PR/Issue 草稿
│   │   ├── 朋友圈.md       # 私域内容
│   │   ├── 今日任务.md     # 根据Day N生成待办清单
│   │   ├── 周复盘.md       # 周复盘报告
│   │   ├── 合规检查.md     # 内容合规审查
│   │   ├── 卡片渲染.md     # MD → 小红书卡片PNG
│   │   ├── 全平台分发.md   # 一键从母稿衍生全平台
│   │   ├── 洗稿.md         # 5种风格改写 + 降AI检测
│   │   ├── 热点抓取.md     # 小红书/RSS热点采集
│   │   ├── 自动发布.md     # Playwright自动化发布
│   │   └── 图标封面.md     # Lucide Icons封面生成
│   └── settings.local.json # 工具权限白名单
│
├── config/                 # 可配置层（换赛道只改这里）
│   ├── product.yaml        # 产品/品牌/赛道/选题池
│   ├── platforms.yaml      # 9平台语气风格规则 + 配图命名
│   ├── schedule.yaml       # 60天排期 + 日类型 + 发布时段
│   ├── compliance.yaml     # 合规规则库（敏感词/红线）
│   ├── creator.yaml        # 人设 + 风格DNA + 反AI检测策略
│   ├── icons.json          # Lucide图标分类映射（12类×1000+）
│   ├── hashtags.json       # 标签库（12类×83标签）
│   ├── topics.json         # 热门话题库
│   ├── promotion.json      # 推广策略（4种风格权重）
│   ├── selectors.json      # 小红书CSS选择器（自动化发布）
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
│   ├── 母稿/ 小红书/ 公众号/ 即刻/ X/ linuxdo/ GitHub/ 朋友圈/
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
│   ├── services/           # 核心服务层 (6个模块)
│   ├── routes/             # API 路由层 (10个路由)
│   └── public/             # Vanilla JS SPA (10个视图)
│
├── videocheck/             # AI视频处理子系统（独立模块）
│
├── start.bat               # 一键启动 Web 控制台
└── improvements-backlog.md # 改进建议跟踪
```

## Web 控制台

双击 `start.bat` 启动，浏览器自动打开 `http://localhost:3210`。
10 个页面覆盖全部功能：仪表盘/创作工坊/全平台分发/内容管理/配置管理/合规检查/洗稿/热点抓取/排期管理/周复盘。
AI 引擎默认 Claude CLI（本地认证），可选 OpenRouter / DeepSeek（需配置 .env Key）。

## 日常使用（CLI 模式）

### 核心工作流
```
/今日任务           → 查看今天该做什么
/母稿 AI工具效率    → 创作核心长文
/全平台分发 output/母稿/xxx.md  → 一键9平台
```

### 单平台创作
```
/小红书 output/母稿/xxx.md   → 小红书图文+卡片+封面
/公众号 output/母稿/xxx.md   → 公众号+百家号+头条
/即刻 output/母稿/xxx.md     → 即刻短文
/X推文 output/母稿/xxx.md    → 英文推文
/linuxdo 技术选型踩坑        → 技术社区帖
/GitHub Discussion: xxx      → GitHub草稿
/朋友圈 周三                 → 朋友圈文案
```

### 新增工具命令
```
/洗稿 output/母稿/xxx.md --style A  → 5种风格改写
/热点抓取 --platform xhs            → 热点话题采集
/自动发布 output/小红书/xxx.md       → 自动化发布
/图标封面 运势占卜                   → Lucide封面生成
```

### 基础工具命令
```
/合规检查 output/小红书/xxx.md  → 合规审查
/卡片渲染 xxx.md --theme retro  → 卡片PNG
/周复盘                         → 周复盘报告
```

## 核心机制

### 三轮润色引擎
1. 降AI味：删除书面连接词 + 替换书面表达 + 打破逻辑链
2. 加人类废话(10-15%)：语气词 + 口头废话 + 情绪爆发
3. 加倒装句(3-5个)：先蹦重点再补主语

### 质量门控
四维评分(钩子强度/互动设计/人味指数/趣味度) >= 9分通过

### 反AI检测策略
8项操作：打破对仗 → 口语碎碎念 → 删总结句 → 场景替代 → 术语口语化 → 思考过程句 → 随意化 → 故事展开

### 平台分组
- A组(长图文同步): 公众号 → 百家号/今日头条
- B组(技术社区): linuxdo / GitHub
- C组(社交平台): 小红书 / 即刻
- D组(国际化): X/Twitter
- E组(私域): 朋友圈

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

# 热点抓取
python "D:/Software/内容生成输出/tools/scraper/xhs_trending_scraper.py"

# 自动调度（3时段）
python "D:/Software/内容生成输出/tools/scheduler/daily_scheduler.py"
```

## 换赛道

只需修改 `config/` 下的 YAML/JSON 文件。Skills 和 tools/ 本身是赛道无关的。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
