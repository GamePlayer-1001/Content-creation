# 📁 项目结构规范

**项目名称**: Auto-Redbook-Skills - 小红书自动化推广系统
**目标网站**: https://destinyteller.com
**最后更新**: 2026-02-06

---

## 🎯 核心目标

每天自动发布 3 篇高质量命理相关内容到小红书，自然推广 destinyteller.com

---

## 📂 标准目录结构

```
h:\Project\Auto-Redbook-Skills\
│
├── 📁 automation/                    # 自动化系统核心代码
│   ├── config/                       # 配置文件（4个JSON）
│   │   ├── schedule.json            # 发布时间表
│   │   ├── hashtags.json            # 标签库（已弃用，移至 materials/）
│   │   ├── promotion_strategy.json  # 推广策略
│   │   └── xhs_selectors.json       # 页面选择器
│   │
│   ├── generators/                   # 内容生成模块
│   │   ├── claude_content_generator.py  # Claude内容生成器
│   │   ├── content_pipeline.py          # 内容管道
│   │   ├── promotion_integrator.py      # 推广集成
│   │   └── markdown_builder.py          # Markdown构建
│   │
│   ├── publishers/                   # 发布模块
│   │   ├── image_renderer.py        # 图片渲染封装
│   │   └── playwright_publisher.py  # Playwright自动发布
│   │
│   ├── scrapers/                     # 抓取模块
│   │   ├── xhs_trending_scraper.py  # 小红书热点抓取
│   │   └── rss_trending_scraper.py  # RSS热点抓取
│   │
│   ├── schedulers/                   # 调度模块
│   │   └── daily_scheduler.py       # 每日调度器
│   │
│   └── utils/                        # 工具函数
│       ├── logger.py                # 日志系统
│       ├── file_manager.py          # 文件管理
│       └── validator.py             # 内容验证
│
├── 📁 materials/                     # 素材管理中心 ⭐ 新增
│   ├── topics/                       # 话题素材库
│   │   ├── trending_topics.json     # 15个热门话题
│   │   ├── seasonal_topics.json     # 季节性话题
│   │   └── evergreen_topics.json    # 常青话题
│   │
│   ├── hashtags/                     # 标签素材库
│   │   ├── primary_tags.json        # 12类83个核心标签
│   │   ├── trending_tags.json       # 实时热门标签
│   │   └── tag_combinations.json    # 标签组合策略
│   │
│   ├── templates/                    # 内容模板库
│   │   ├── morning_templates/       # 早间模板
│   │   ├── midday_templates/        # 午间模板
│   │   └── evening_templates/       # 晚间模板
│   │
│   ├── examples/                     # 优秀案例库
│   │   ├── high_engagement/         # 高互动案例
│   │   ├── viral_content/           # 爆款内容
│   │   └── competitor_analysis/     # 竞品分析
│   │
│   ├── archive/                      # 素材归档
│   │   ├── daily/                   # 每日快照
│   │   ├── weekly/                  # 每周汇总
│   │   └── monthly/                 # 每月统计
│   │
│   ├── scripts/                      # 素材管理脚本
│   │   └── show_materials.py        # 查看素材工具
│   │
│   └── README.md                     # 素材管理说明
│
├── 📁 content/                       # 内容生成和发布
│   ├── drafts/                       # 草稿内容
│   │   └── {YYYY-MM-DD}/            # 按日期组织
│   │       ├── morning/             # 早间内容
│   │       ├── midday/              # 午间内容
│   │       └── evening/             # 晚间内容
│   │
│   └── published/                    # 已发布内容归档
│       └── {YYYY-MM-DD}/            # 按日期组织
│           ├── morning/
│           │   ├── content.md       # Markdown源文件
│           │   ├── metadata.json    # 元数据
│           │   ├── cover.png        # 封面图
│           │   ├── card_*.png       # 卡片图
│           │   └── publish_result.json  # 发布结果
│           ├── midday/
│           └── evening/
│
├── 📁 data/                          # 数据缓存（已弃用，合并到 materials/）
│   └── trending_topics/
│       └── latest.json
│
├── 📁 logs/                          # 系统日志
│   ├── scheduler/                    # 调度器日志
│   ├── scraping/                     # 抓取日志
│   ├── generation/                   # 生成日志
│   └── publishing/                   # 发布日志
│
├── 📁 scripts/                       # 现有渲染和发布脚本
│   ├── render_xhs_v2.js             # 图片渲染（Node.js）
│   └── publish_xhs.py               # 小红书发布
│
├── 📁 assets/                        # 静态资源
│   ├── cover.html                   # 封面模板
│   ├── card.html                    # 卡片模板
│   └── themes/                      # 7套主题CSS
│
├── 📁 docs/                          # 文档中心 ⭐ 新增
│   ├── 快速启动.md
│   ├── 系统完成总结.md
│   ├── 项目检查清单.md
│   ├── 系统架构说明.md
│   └── 素材收集总结.md
│
├── 📄 .env                           # 环境变量（不提交）
├── 📄 package.json                   # Node.js依赖
├── 📄 requirements.txt               # Python依赖
├── 📄 README.md                      # 项目说明
└── 📄 PROJECT_STRUCTURE.md          # 本文件

---

## 🔑 核心文件说明

### 自动化核心 (automation/)

| 文件 | 功能 | 状态 |
|------|------|------|
| `daily_scheduler.py` | 每日调度器，协调全流程 | ✅ 已实现 |
| `claude_content_generator.py` | Claude内容生成 | ✅ 已实现 |
| `content_pipeline.py` | 内容生成+渲染管道 | ✅ 已实现 |
| `image_renderer.py` | 图片渲染封装 | ✅ 已实现 |
| `playwright_publisher.py` | Playwright自动发布 | ✅ 已实现 |
| `xhs_trending_scraper.py` | 热点抓取 | ✅ 已实现 |

### 素材管理 (materials/) ⭐ 新增

| 文件 | 功能 | 状态 |
|------|------|------|
| `topics/trending_topics.json` | 15个核心话题 | ✅ 已创建 |
| `hashtags/primary_tags.json` | 12类83个标签 | ✅ 已创建 |
| `scripts/show_materials.py` | 素材查看工具 | ✅ 已创建 |
| `templates/` | 内容模板 | ⏳ 待创建 |
| `examples/` | 优秀案例 | ⏳ 待收集 |

### 配置文件 (automation/config/)

| 文件 | 内容 | 状态 |
|------|------|------|
| `schedule.json` | 发布时间表 | ✅ 已配置 |
| `promotion_strategy.json` | 4种推广风格 | ✅ 已配置 |
| `xhs_selectors.json` | 页面选择器 | ✅ 已配置 |
| `xhs_cookies.json` | Cookie（首次登录生成） | ⏳ 待生成 |

---

## 🚫 禁止事项

### 不要创建的文件/文件夹
- ❌ 根目录下的零散 `.md` 文档（统一放入 `docs/`）
- ❌ `data/trending_topics/` 下的文件（已迁移到 `materials/topics/`）
- ❌ 重复的配置文件（如 `automation/config/hashtags.json`，已合并到 `materials/hashtags/`）
- ❌ 临时测试文件散落在根目录

### 文件命名规范
- ✅ Python文件：`snake_case.py`
- ✅ JSON配置：`kebab-case.json`
- ✅ Markdown文档：`中文标题.md` 或 `ENGLISH_TITLE.md`
- ✅ 目录：`lowercase` 或 `snake_case`

---

## 📋 待办事项

### 立即处理
1. ⏳ 删除/移动根目录零散文档到 `docs/`
2. ⏳ 删除 `data/trending_topics/`（已迁移到 `materials/`）
3. ⏳ 清理 `automation/config/hashtags.json`（已合并）

### 素材完善
1. ⏳ 创建内容模板（`materials/templates/`）
2. ⏳ 收集优秀案例（`materials/examples/`）
3. ⏳ 建立归档机制（`materials/archive/`）

### 系统测试
1. ⏳ 测试 Playwright 自动发布
2. ⏳ 启动完整调度系统
3. ⏳ 配置 Windows 任务计划

---

## 📊 当前状态

- **项目完成度**: 90%
- **核心功能**: ✅ 完成
- **素材管理**: ✅ 已重组
- **文档整理**: ⏳ 进行中
- **系统测试**: ⏳ 待执行

---

## 🎯 下一步

1. **清理项目结构**（当前任务）
2. 测试自动发布功能
3. 启动完整调度系统
4. 监控运行效果

---

**维护者**: Claude Sonnet 4.5
**最后检查**: 2026-02-06
