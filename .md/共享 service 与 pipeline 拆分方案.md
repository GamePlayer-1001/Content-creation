# 内容生成输出项目 - 共享 Service 与 Pipeline 拆分方案

更新时间：2026-03-19
状态：规划文档（先定拆分方案，不执行实现）

---

## 一、结论

如果这个项目要同时支持：
- WebApp 人工使用
- CLI 批处理 / 自动化使用
- 未来调度器接入

那么最关键的不是继续堆页面，也不是继续堆脚本，而是：

> **把真正的业务能力从页面、路由、历史脚本里抽出来，沉到共享 Service 与 Pipeline 层。**

这一步是整个项目后续能否低维护、可扩展、可接自动化的分水岭。

---

## 二、为什么必须拆 Shared Service / Pipeline

### 当前风险
从现有结构看，业务逻辑分散在：
- `webapp/routes/`
- `webapp/services/`
- `tools/generator/`
- `tools/publish/`
- `tools/scraper/`
- `tools/card/`
- 其他历史脚本

这意味着：
- 有些逻辑偏向页面入口
- 有些逻辑偏向脚本调用
- 有些逻辑可能重复实现
- 后续做 CLI 时容易再复制一套

### 不拆的后果
如果不拆：
- WebApp 和 CLI 会逐渐变成两套逻辑
- 后面只要改一个规则，就要改多个地方
- 调试和排错会越来越痛苦
- 将来接入 cron 更危险

### 拆完的收益
拆成 Shared Core 后：
- WebApp 只是调用它
- CLI 也是调用它
- 日后调度器也是调用它
- 规则只维护一份
- 日志和错误处理能统一

---

## 三、建议的核心拆分原则

### 原则 1：按业务能力拆，不按当前文件位置拆
不是看“现在代码在哪”，而是看“它解决的是什么问题”。

### 原则 2：Service 负责能力，Pipeline 负责顺序
- **Service**：提供单项能力
- **Pipeline**：编排这些能力按阶段串起来

### 原则 3：Pipeline 不直接依赖页面交互
Pipeline 应该只依赖：
- 输入数据
- 配置
- Service
- 状态管理

不应直接依赖：
- 页面按钮
- DOM 事件
- 某个具体路由的实现细节

### 原则 4：支持“自动承接 + 人工确认”
Pipeline 不是为了强行全自动，而是为了：
- 让阶段自然衔接
- 保留中间停顿和人工确认节点

---

## 四、推荐的拆分结构

建议未来核心层形成如下结构：

```text
core/
├─ services/
│  ├─ hotspot/
│  ├─ draft/
│  ├─ rewrite/
│  ├─ review/
│  ├─ visual/
│  ├─ layout/
│  ├─ export/
│  ├─ config/
│  └─ storage/
├─ pipeline/
│  ├─ stages/
│  ├─ runners/
│  ├─ state/
│  └─ policies/
├─ adapters/
│  ├─ sheets/
│  ├─ ai/
│  ├─ filesystem/
│  └─ platform/
└─ utils/
```

---

## 五、Service 层拆分建议

### 1. Hotspot Service
负责：
- 读取 Google Sheets 热点池
- 格式化热点数据
- 平台 / 时间 / 主题筛选
- 将热点导入为内容任务

输入：
- Sheets 数据 / 用户选中的热点

输出：
- 标准化 hotspot object / content task seed

说明：
- WebApp 用它来展示与选择热点
- CLI 用它来批量读取和预处理热点

---

### 2. Draft Service
负责：
- 根据热点 + 想法 + 长文本生成母稿
- 应用写作策略模板
- 组织上下文输入
- 输出结构化母稿

输入：
- 热点对象
- 用户补充内容
- 写作策略

输出：
- draft object
- draft text
- metadata

说明：
- 这是内容生产的第一核心服务

---

### 3. Rewrite Service
负责：
- 基于母稿生成多平台版本
- 应用平台规则
- 控制字数、语气、结构、开头方式

输入：
- draft
- target platform
- 平台模板 / 风格参数

输出：
- platform-specific copy

说明：
- 不应让每个平台散落成独立脚本思维
- 应该是统一 Rewrite Service + Platform Rules

---

### 4. Review Service
负责：
- 审核优化
- 去 AI 味
- 删除冗余和废话
- 进行基础风格与表达检查
- 执行合规性规则检查（若业务上归这里）

输入：
- draft / platform copy
- review rules
- anti-AI rules

输出：
- reviewed version
- issues list
- suggestion list

说明：
- 这是未来很可能与“写作大师”协作最紧密的服务层

---

### 5. Visual Service
负责：
- 图片生成参数组装
- 主配图 / 章节图 / 封面 / 卡片的生成流程
- 图片提示词模板调用
- 图像结果组织

输入：
- content context
- image prompt template
- image generation params

输出：
- visual assets metadata
- image file paths

说明：
- 不建议把主配图、封面、卡片渲染完全散落在不同小脚本里

---

### 6. Layout Service
负责：
- 图文排版
- 章节结构组织
- 将文本和图片整合成可阅读成品
- 输出排版结果对象

输入：
- reviewed text
- visual assets
- layout template

输出：
- layout result
- renderable package

说明：
- Layout Service 更偏“成品结构组织”
- 不等同于最终导出写文件

---

### 7. Export Service
负责：
- 按命名规则落盘
- 维护输出目录结构
- 生成导出摘要
- 返回文件路径与索引结果

输入：
- draft / platform copy / visuals / layout result

输出：
- file paths
- export manifest
- output summary

说明：
- 所有“写文件到 output/”的行为尽量通过它统一处理

---

### 8. Config Service
负责：
- 读取配置
- 合并默认配置与环境变量
- 返回各模块可用配置
- 提供配置校验

输入：
- config files
- env vars

输出：
- normalized config object

说明：
- 配置读取不要散落在各个脚本里各自实现

---

### 9. Storage / Asset Registry Service
负责：
- 内容任务的中间状态存储
- 阶段产物注册
- 版本记录
- 结果索引

输入：
- stage outputs

输出：
- task state
- artifact index

说明：
- 如果未来要支持回退 / 局部重跑 / 多版本比较，这层很重要

---

## 六、Pipeline 层拆分建议

Service 解决“能做什么”，Pipeline 解决“按什么顺序做”。

建议 Pipeline 至少拆成以下部分：

### 1. Stage Definitions
定义标准阶段：
1. hotspot-search
2. hotspot-select
3. hotspot-enrich
4. draft-generate
5. platform-rewrite
6. review-optimize
7. visual-generate
8. layout-compose
9. export-output

说明：
- 主流程的 9 步应正式变成 pipeline stage 定义

---

### 2. Workflow Runner
负责：
- 顺序执行 stages
- 支持从任意 stage 开始
- 支持只执行子流程
- 支持中断恢复

说明：
- CLI 很可能就是调用 Runner
- WebApp 则按交互需要逐步调用 Runner / Stage Action

---

### 3. State Manager
负责：
- 当前任务处于哪个阶段
- 上一阶段输出是什么
- 用户修改后的内容版本是什么
- 哪些阶段已确认，哪些待确认

说明：
- “自动承接 + 人工确认” 的关键就在这里

---

### 4. Policies / Checkpoints
负责：
- 哪些阶段可自动继续
- 哪些阶段必须人工确认
- 哪些阶段失败后允许重试
- 哪些阶段需要写入日志 / 快照

说明：
- 这层非常适合把“当前不追求一键全自动”的原则写死

---

### 5. Output Manifest Builder
负责：
- 统一记录每个内容任务产出的文本、图片、排版、导出文件
- 建立从热点 → 母稿 → 平台稿 → 图片 → 排版结果的追踪链

说明：
- 未来非常利于复盘、检索和重用

---

## 七、当前代码到未来 Service / Pipeline 的映射思路

### 当前可能可吸纳进共享层的部分

| 当前位置 | 未来方向 |
|---|---|
| `webapp/services/ai-adapter.js` | `core/adapters/ai/` + `core/services/draft` / `rewrite` |
| `webapp/services/compliance-engine.js` | `core/services/review/` |
| `webapp/services/config-manager.js` | `core/services/config/` |
| `webapp/services/image-generator.js` | `core/services/visual/` |
| `webapp/services/output-manager.js` | `core/services/export/` |
| `webapp/services/platform-registry.js` | `core/services/rewrite/` 或 `config/platforms/` |
| `webapp/services/prompt-store.js` | `core/services/config/` 或 `storage/asset registry` |
| `tools/generator/content_pipeline.py` | 可作为 pipeline 设计参考 |
| `tools/scraper/*` | `core/services/hotspot/` 或 `adapters/` |
| `tools/card/*` / `tools/cover/*` | `core/services/visual/` + `layout/` |

说明：
- 现在先是“规划吸纳方向”
- 不是说直接照搬文件
- 应按能力重构，而不是按路径复制

---

## 八、先后拆分顺序建议

### Phase 1：先抽稳定能力
优先抽：
1. Config Service
2. Export Service
3. Visual Service
4. Review Service

原因：
- 边界相对更容易定义
- 复用价值高
- 有助于减少散落逻辑

### Phase 2：再抽内容核心
再抽：
5. Draft Service
6. Rewrite Service
7. Hotspot Service

原因：
- 与主流程绑定最深
- 需要和模板 / 规则体系一起收口

### Phase 3：最后抽编排层
再做：
8. State Manager
9. Workflow Runner
10. Policies / Checkpoints

原因：
- 需要建立在单项服务边界清楚的前提上

---

## 九、当前阶段的实施边界

这份文档当前只做规划，不做代码迁移。

当前阶段的正确动作是：
1. 先确定 Service 列表
2. 先确定 Pipeline 9 阶段定义
3. 先确定哪些能力未来归 Service，哪些只是脚本或历史实现
4. 再结合目录重组方案，推进真正的代码收口

不建议现在直接一把梭重构。

---

## 十、一句话总结

这个项目后续能不能稳，不取决于你再加多少页面，而取决于：

> **你能不能把“生成、改写、审核、配图、排版、导出”这些真正的业务能力，从页面和脚本里抽出来，形成一套可被 WebApp、CLI、未来调度器共同调用的 Shared Service 与 Pipeline。**
