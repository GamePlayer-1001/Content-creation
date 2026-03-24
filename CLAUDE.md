# 内容生成输出 - 9阶段内容生产系统
Node.js + Express + Vanilla JS SPA + Python tools + Markdown/YAML rules

<directory>
.claude/ - Agent 命令资产与本地协作配置 (1子目录: commands)
.md/ - 项目主线方案与专题设计稿 (7文件)
app/ - CLI 入口层 (1子目录: cli)
assets/ - 视觉素材与排版资源 (8子目录: demos/images/stickers/templates/themes/wechat-css/wechat-fonts/wechat-images)
config/ - 配置中心与规则资产 (1子目录: rules)
core/ - WebApp/CLI 共用执行核心 (3子目录: config/pipeline/services)
docs/ - 外部参考资料与历史存档 (4子目录: auto-redbook/社区规范/推广方案/赛道存档)
output/ - 运行产物、平台输出与日志分区 (17子目录: drafts/GitHub/linuxdo/logs/Medium/queue/Quora/Reddit/X/公众号/卡片/即刻/复盘/封面/小红书/母稿/知乎)
templates/ - 母稿、洗稿与复盘模板 (1子目录: 参考案例)
tools/ - 辅助工具链与测试脚本 (13子目录: card/compliance/cover/generator/hooks/jianying/publish/scheduler/scraper/screenshot/tests/utils/video)
web hot/ - 热点抓取历史输出与 dryrun 分区 (3子目录: weekly/yearly/_dryruns)
webapp/ - 本地 Web 控制台 (3稳定子目录: public/routes/services)
排除/ - 待归档或不纳入主线的历史材料 (3子目录: 中国社区规范/博客/推广计划&方案)
</directory>

<config>
start.bat - 启动本地 Web 控制台
config/.env.example - 共享环境变量示例
webapp/package.json - Web 控制台依赖与启动脚本
tools/package.json - Node 工具链依赖
tools/requirements.txt - Python 工具链依赖
</config>

法则: 单一执行核心·双通道不双实现·文档同构·动态产物按语义分区管理
