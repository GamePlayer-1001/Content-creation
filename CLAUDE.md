# 内容生成输出 — 全平台内容推广工具集
Claude Code Skills + YAML Config + 外部工具链

> L1 项目宪法 | 9平台内容流水线 | 母稿驱动 + 配置化赛道

## 架构概览

一篇母稿 → 9个平台衍生内容。所有创作遵循：三轮润色 → 质量门控(>=9分) → 合规检查 → 后处理。

## 目录结构

```
内容生成输出/
├── .claude/
│   ├── commands/           # Skills 入口（13个 /命令）
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
│   │   └── 全平台分发.md   # 一键从母稿衍生全平台
│   └── settings.local.json # 工具权限白名单
│
├── config/                 # 可配置层（换赛道只改这里）
│   ├── product.yaml        # 产品/品牌/赛道/选题池
│   ├── platforms.yaml      # 9平台语气风格规则
│   ├── schedule.yaml       # 60天排期 + 日类型系统
│   ├── compliance.yaml     # 合规规则库（敏感词/红线）
│   └── creator.yaml        # 人设 + 写作风格DNA + 思维模板
│
├── templates/              # 内容模板
│   ├── 母稿-猎奇型.md
│   ├── 母稿-教程型.md
│   ├── 母稿-互动型.md
│   └── 周复盘.md
│
├── output/                 # 所有生成内容
│   ├── 母稿/               # 核心长文（所有内容的源头）
│   ├── 小红书/             # 小红书文案
│   ├── 公众号/             # 公众号/百家号/头条文章
│   ├── 即刻/               # 即刻短文
│   ├── X/                  # 英文推文
│   ├── linuxdo/            # 技术社区帖
│   ├── GitHub/             # GitHub草稿
│   ├── 朋友圈/             # 朋友圈文案
│   ├── 封面/               # 封面图片
│   ├── 卡片/               # 小红书卡片
│   └── 复盘/               # 周复盘报告
│
├── Auto-Redbook-Skills/    # 卡片渲染引擎（已有，只引用）
├── 内容/                   # 内容工具链（已有，只引用）
│   └── tools/
│       ├── generate-cover.mjs        # Gemini封面生成
│       └── wechat-screenshot/        # 微信截图生成
├── 推广计划&方案/           # 推广方案文档（只读参考）
└── 中国社区规范/            # 社区规范（只读参考）
```

## 日常使用

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

### 工具命令
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

### 四种思维模板
反驳型 | 新视角型 | 论点转换型 | 价值提取型

### 平台分组
- A组(长图文同步): 公众号 → 百家号/今日头条
- B组(技术社区): linuxdo / GitHub
- C组(社交平台): 小红书 / 即刻
- D组(国际化): X/Twitter
- E组(私域): 朋友圈

## 外部工具路径

```bash
# 封面生成
node "D:/Software/内容生成输出/内容/tools/generate-cover.mjs" --title "..." --type narrative --output "..." --keywords "..."

# 卡片渲染
python "D:/Software/内容生成输出/Auto-Redbook-Skills/scripts/render_xhs.py" file.md -t professional -m auto-split -o "output/卡片/"

# 小红书发布
python "D:/Software/内容生成输出/Auto-Redbook-Skills/scripts/publish_xhs.py" --title "..." --desc "..." --images *.png

# 微信截图
node "D:/Software/内容生成输出/内容/tools/wechat-screenshot/generate-wechat-screenshot.mjs" "input.md" --output-dir "..."
```

## 换赛道

只需修改 `config/` 下的 5 个 YAML 文件。Skills 本身是赛道无关的。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
