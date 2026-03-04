# Destinyteller 小红书自动化推广系统

完全自动化的小红书内容生成与发布系统，用于推广 destinyteller.com。

## 功能特性

- ✅ **AI 内容生成**：使用 Claude Sonnet 4.5 生成高质量命理相关内容
- ✅ **热点追踪**：自动抓取小红书热点话题和关键词
- ✅ **图片渲染**：自动将 Markdown 渲染为精美的小红书图片
- ✅ **自动发布**：使用 Playwright 自动发布到小红书（待实现）
- ✅ **定时调度**：每天自动发布 3 篇内容（早中晚）

## 快速开始

### 1. 环境准备

```bash
# 安装依赖
pip install anthropic playwright schedule python-dotenv

# 安装 Playwright 浏览器
playwright install chromium
```

### 2. 系统配置

系统使用**当前 Claude Code 会话**生成内容，无需 API Key。

工作原理：
- Python 脚本创建任务文件（包含提示词）
- Claude Code 读取任务并生成内容
- 生成的内容保存为 Markdown 文件
- 系统自动渲染为图片

### 3. 测试系统

运行测试脚本：

```bash
python test_generation.py
```

这会测试：
- 热点抓取（可选）
- 内容生成
- 图片渲染

### 4. 手动生成内容

```bash
# 生成早间内容
python automation/generators/content_pipeline.py \
    --slot morning \
    --output content/drafts/2026-02-06/morning

# 生成午间内容
python automation/generators/content_pipeline.py \
    --slot midday \
    --output content/drafts/2026-02-06/midday

# 生成晚间内容
python automation/generators/content_pipeline.py \
    --slot evening \
    --output content/drafts/2026-02-06/evening
```

## 目录结构

```
automation/
├── config/                 # 配置文件
│   ├── schedule.json       # 发布时间表
│   ├── hashtags.json       # 标签库
│   ├── promotion_strategy.json  # 推广策略
│   └── xhs_selectors.json  # 小红书页面选择器
│
├── scrapers/              # 抓取模块
│   └── xhs_trending_scraper.py  # 热点抓取
│
├── generators/            # 内容生成
│   ├── claude_content_generator.py  # Claude API 调用
│   └── content_pipeline.py          # 生成+渲染管道
│
├── publishers/            # 发布模块
│   ├── image_renderer.py           # 图片渲染
│   └── playwright_publisher.py     # 自动发布（待实现）
│
├── schedulers/            # 调度系统
│   └── daily_scheduler.py         # 每日调度器（待实现）
│
└── utils/                 # 工具函数
    └── logger.py          # 日志系统

content/                   # 内容存储
├── drafts/               # 草稿
├── approved/             # 待发布
└── published/            # 已发布归档

data/                     # 数据缓存
└── trending_topics/      # 热点数据
```

## 内容类型

系统支持 15 种命理相关内容类型：

### 早间（7:30-8:30）
- 每日运势（12星座、生肖）
- 幸运小贴士
- 开运方法

### 午间（12:00-13:00）
- 塔罗牌解读
- 事业财运
- 命理知识科普（八字、紫微斗数）
- 数字命理

### 晚间（18:00-21:00）
- 情感占卜
- 心灵疗愈
- 梦境解析
- 水晶能量
- 心灵成长故事

## 视觉主题

系统自动根据时段选择合适的视觉主题：

- **早间**: botanical, playful-geometric, default
- **午间**: professional, retro, neo-brutalism
- **晚间**: terminal, sketch, retro

## 推广策略

内容会自然地提及 destinyteller.com，包括 4 种推广风格：

1. **无推广（10%）** - 纯内容分享
2. **自然提及（40%）** - "我常用的测试平台"
3. **资源分享（30%）** - "系统学习可以看这个平台"
4. **直接推荐（20%）** - "专业塔罗师都在用"

## 下一步开发

- [ ] 实现 Playwright 自动发布
- [ ] 实现完整的调度系统
- [ ] 添加 Windows 任务计划程序集成
- [ ] 实现错误重试和失败队列
- [ ] 添加数据分析和统计

## 注意事项

1. **API 密钥安全**：不要将 `.env` 文件提交到 Git
2. **发布频率**：遵守小红书平台规则，不要过于频繁
3. **内容审核**：建议在自动发布前先人工审核内容
4. **Cookie 管理**：定期更新小红书登录 Cookie

## 故障排查

### 内容生成超时

系统会等待 Claude 生成内容（最多5分钟）。如果超时：
- 检查任务文件是否正确创建（`automation/.tasks/`）
- 确保 Claude Code 正在运行并可以访问该目录

### 图片渲染失败

确保 Node.js 已安装，且 `scripts/render_xhs_v2.js` 存在。

### 热点抓取失败

小红书可能有反爬机制，可以：
- 手动创建热点数据文件
- 调整延迟时间
- 使用代理

## 许可证

MIT License
