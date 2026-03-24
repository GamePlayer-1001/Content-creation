# 内容生成输出 - 9阶段内容生产系统
Node.js + Express + Vanilla JS SPA + Python tools + Markdown/YAML rules

<directory>
.claude/ - Agent 命令资产与本地权限配置（1子目录: commands）
.md/ - 主线方案、专题设计稿与执行清单（7文件）
app/ - 命令行入口层（1子目录: cli）
assets/ - 静态视觉资源与渲染素材（6子目录: themes/templates/stickers/wechat-css/wechat-fonts/wechat-images）
config/ - 配置中心与规则资产（1子目录: rules）
core/ - WebApp/CLI 共用的执行核心（3子目录: config/pipeline/services）
docs/ - 参考资料与历史存档（2子目录: auto-redbook/赛道存档）
output/ - 任务状态、内容产物与导出结果
templates/ - 母稿、改写与复盘模板
tools/ - 辅助工具链与测试脚本
webapp/ - 本地 Web 控制台
web hot/ - 历史热点抓取输出
排除/ - 排除或待归档材料
</directory>

<config>
start.bat - 启动本地 Web 控制台
webapp/package.json - Web 控制台依赖与启动脚本
tools/package.json - Node 工具链依赖
tools/requirements.txt - Python 工具链依赖
</config>

法则: 单一执行核心·双通道不双实现·文档同构·阶段显式
