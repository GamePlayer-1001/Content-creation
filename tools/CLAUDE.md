# tools/
> L2 | 父级: /CLAUDE.md

统一工具链 — 三项目融合后的所有可执行工具，按功能分子目录。

## 成员清单

### cover/ — 封面生成
`generate-cover.mjs`: Gemini API 封面生成器，3种风格(narrative/tutorial/rant) × 20+话题元素 × 8反AI修饰词
`package.json`: Node.js 依赖（@google/genai）

### card/ — 卡片渲染
`render_xhs.py`: Python 版卡片渲染引擎，8主题 × 4分页模式，输出 1080×1440 PNG
`render_xhs.js`: Node.js 版卡片渲染引擎，Puppeteer 驱动
`render_xhs_v2.py`: V2 Python 版（简化参数）
`render_xhs_v2.js`: V2 Node.js 版
`render_cover.js`: 封面 HTML → PNG 渲染器
`image_renderer.py`: OOP 渲染器类，封装 render_xhs_v2.js

### screenshot/ — 微信截图
`generate-wechat-screenshot.mjs`: CLI 入口，串联 parse → nickname → avatar → split-screen 流水线
`lib/parse-md.mjs`: MD → 9种消息类型解析器
`lib/nickname.mjs`: 随机昵称生成器
`lib/avatar.mjs`: 头像下载/缓存器
`lib/build-html.mjs`: 核心模板引擎（wxdh 资源 + 表情包）
`lib/split-screens.mjs`: 分屏算法（贪心bin-packing @ 1831px/屏）
`package.json`: Node.js 依赖（puppeteer）

### publish/ — 发布工具
`publish_xhs.py`: 标准发布 CLI（本地签名/API双模式）
`auto_publish.py`: Playwright 通用自动化发布
`auto_publish_final.py`: 完善版自动化发布
`auto_publish_stealth.py`: 反检测隐身发布（7项反检测措施）
`auto_publish_old.py`: 早期版本（参考用）
`playwright_publisher.py`: OOP 发布器类

### scraper/ — 热点抓取
`xhs_trending_scraper.py`: Playwright 小红书热点抓取器
`rss_trending_scraper.py`: RSS 订阅热点抓取器

### scheduler/ — 自动调度
`daily_scheduler.py`: 3时段调度器（06:00/11:00/17:00 → 抓取→生成→发布）
`run_scheduler.bat`: Windows 启动脚本

### generator/ — AI 内容生成
`claude_content_generator.py`: Claude 内容生成器（提示词构建 + 示例内容）
`content_pipeline.py`: 内容生成管道（生成→渲染→元数据）
`content_with_icons.py`: Lucide Icons 封面生成器
`test_icon_cover.py`: 图标封面 HTML 生成器

### video/ — 视频渲染
`render-dialog-video.mjs`: Remotion 对话视频渲染入口
`pipeline/`: 渲染管道 TypeScript 模块（parser/splitter/frame-calculator/sticker-pool/virtual-date/types）

### jianying/ — 剪映自动化
`parser.py`: 剪映草稿解析器
`scanner.py`: 剪映项目扫描器
`style_learner.py`: 风格学习器
`template.py`: 模板生成器

### utils/ — 通用工具
`logger.py`: 统一日志系统

### 根级文件
`manage.py`: 交互式 CLI 管理器（素材/生成/发布/调度一站式管理）
`requirements.txt`: 统一 Python 依赖
`package.json`: 统一 Node.js 依赖

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
