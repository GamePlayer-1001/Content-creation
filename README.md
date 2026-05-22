# 内容生成输出

当前主线已经切换为新版 `content-forge`。

## 启动方式

双击根目录：

```bat
start.bat
```

启动后访问：

```text
http://localhost:5173
```

后端 API 默认运行在：

```text
http://localhost:3210
```

## 当前主线目录

```text
内容生成输出/
├── start.bat
├── content-forge/
│   ├── client/        React + Vite 前端
│   ├── server/        Express 后端
│   ├── config/        新版配置、规则、平台规范
│   ├── templates/     新版写作范文和学术论文模板
│   ├── tools/         新版辅助工具
│   ├── .env           本地运行环境变量
│   └── package.json
└── 归档/
    └── legacy-webapp-2026-05-21/
```

## 新版应用能力

- 母稿生成
- 多平台改写
- 图片生成
- Markdown 导出
- Obsidian 导出
- 范文风格分析
- 学术论文模板 few-shot 注入
- 运行时文字 API 配置

## 新版模板位置

```text
content-forge/templates/
├── 中文/
│   ├── 公众号/
│   ├── 头条/
│   ├── 小红书/
│   └── 学术论文/
└── 英文/
    └── academic/
```

## 新版规则位置

```text
content-forge/config/
├── rules/
├── platforms.yaml
├── compliance.yaml
└── .env.example
```

## 已移除的旧版内容

旧版 `webapp`、`core`、`cli`、旧工具链代码已经从主线移除。

可复用资料已归档到：

```text
归档/legacy-webapp-2026-05-21/
```

归档内容只作参考，不再作为应用运行入口。

## 常用命令

进入新版目录后可以手动运行：

```bat
npm run dev
```

构建前端：

```bat
npm run build
```

生产启动：

```bat
npm run start
```