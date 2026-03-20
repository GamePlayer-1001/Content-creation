# 内容生成输出项目 - tools 目录标签化梳理结果

更新时间：2026-03-19
状态：实施前规划文档（标签化梳理，不执行迁移）

---

## 一、目标

这份文档的目标不是立即拆 `tools/`，而是先回答：

1. `tools/` 下每个子目录现在更像什么角色？
2. 哪些属于主用核心？
3. 哪些属于辅助脚本？
4. 哪些属于历史实现或待归档内容？
5. 后续应该优先从哪几块开始收口？

---

## 二、标签定义

为避免后面讨论混乱，先统一标签体系。

### 标签 A：主用核心（Core Candidate）
定义：
- 明显与项目主流程直接相关
- 应该进入未来 shared service / pipeline 的候选模块
- 后续大概率要进入 `core/`

### 标签 B：辅助脚本（Script Candidate）
定义：
- 有价值，但更像开发/调试/辅助工具
- 不适合作为产品主流程核心能力
- 后续更适合进入 `scripts/`

### 标签 C：历史实现（Legacy Candidate）
定义：
- 存在明显多版本并存
- 命名本身带有 old / final / v2 / stealth 等历史痕迹
- 需要后续判断主实现，剩余进入 `archive/`

### 标签 D：待判定（Needs Review）
定义：
- 目前从目录名看不出是否仍在主流程中发挥关键作用
- 需要结合代码引用关系再做判定

---

## 三、`tools/` 总体判断

当前 `tools/` 最大的问题不是“东西太多”，而是：

> **核心能力、辅助脚本、历史实现、测试代码，全都混在同一个层级里。**

因此，`tools/` 现在更像：
- 一部分是未来 `core/` 的雏形
- 一部分是未来 `scripts/` 的候选区
- 一部分其实应该进入 `archive/`

结论：

### `tools/` 不适合长期作为单一总目录继续存在
后续应该拆分，而不是继续往里堆。

---

## 四、子目录标签化结果

---

### 1. `tools/generator/`
**标签：主用核心（Core Candidate）**

#### 判断理由
- 名称直接对应内容生成主链路
- 包含：
  - `claude_content_generator.py`
  - `content_pipeline.py`
  - `content_with_icons.py`
- 明显与“母稿生成 / 内容生成流程”强相关

#### 未来建议归属
- `core/services/draft/`
- `core/pipeline/`

#### 后续动作建议
- 优先识别其中哪个是真正主实现
- 判断哪些逻辑是“生成能力”，哪些是“编排能力”

---

### 2. `tools/scraper/`
**标签：主用核心（Core Candidate） / 待判定（Needs Review）**

#### 判断理由
- 与热点来源有关
- 当前有：
  - `rss_trending_scraper.py`
  - `xhs_trending_scraper.py`
- 但你现在已经把主流程第一步定义为“读谷歌表格的热点列表”

#### 关键判断
这意味着：
- `scraper/` 不再一定是 WebApp / CLI 主流程直接调用的核心
- 它更可能变成“热点来源生产侧”的辅助能力

#### 未来建议归属
二选一：
1. 如果仍为项目内部热点供应链的一部分 → `core/services/hotspot/` 或 `core/adapters/`
2. 如果只是上游采集脚本 → `scripts/data-sources/` 或 `archive/`

#### 后续动作建议
- 先判定：这些 scraper 未来是不是还会被持续使用
- 若 Google Sheets 成为唯一正式入口，则 scraper 更像外部供应层，不一定留在核心主干

---

### 3. `tools/card/`
**标签：主用核心（Core Candidate） + 历史实现（Legacy Candidate）**

#### 判断理由
- 与卡片、封面、渲染直接相关
- 明显服务于视觉生成和排版链路
- 但存在多版本并存：
  - `render_xhs.js`
  - `render_xhs.py`
  - `render_xhs_v2.js`
  - `render_xhs_v2.py`

#### 结论
- 这个目录本身属于核心能力
- 但内部明显存在历史实现并存问题

#### 未来建议归属
- 主实现 → `core/services/visual/` 或 `core/services/layout/`
- 历史实现 → `archive/deprecated-tools/card/`

#### 后续动作建议
- 先选“当前唯一主实现”
- 再把其余版本标记为对照版或归档版

---

### 4. `tools/cover/`
**标签：主用核心（Core Candidate）**

#### 判断理由
- 封面生成直接属于视觉产出主链路
- 未来主流程中“生成多张配图”与“排版”之间，封面能力有明确位置

#### 未来建议归属
- `core/services/visual/`

#### 后续动作建议
- 判断与 `tools/card/` 是否存在重叠
- 后续可能和 card 一起并入视觉服务层

---

### 5. `tools/compliance/`
**标签：主用核心（Core Candidate） / 辅助脚本（Script Candidate）**

#### 判断理由
- 合规检查属于你定义的“质量检查”链路的一部分
- 但当前目录内容带有明显工具性质：
  - `index.html`
  - `secret_scan.py`
  - `合规检查.bat`

#### 结论
需要拆开看：
- 与内容审核、规则检查相关的部分 → 核心能力
- 与密钥扫描、工程治理相关的部分 → 辅助脚本

#### 未来建议归属
- 业务审核能力 → `core/services/review/`
- 审计/扫描工具 → `scripts/audit/`

#### 后续动作建议
- 先分清“内容合规检查”和“工程安全扫描”这两件事

---

### 6. `tools/publish/`
**标签：历史实现（Legacy Candidate） / 待判定（Needs Review）**

#### 判断理由
- 当前项目目标里，暂时不把“平台自动分发”作为主路径核心
- 同时存在多版本并存：
  - `auto_publish.py`
  - `auto_publish_final.py`
  - `auto_publish_old.py`
  - `auto_publish_stealth.py`
  - `playwright_publisher.py`
  - `publish_xhs.py`

#### 结论
- 这是目前最明显的“历史堆叠区”之一
- 短期不应进入主流程重构优先级前列

#### 未来建议归属
- 主实现若保留 → `scripts/publish/` 或独立 `integration/publish/`
- 其余版本 → `archive/deprecated-tools/publish/`

#### 后续动作建议
- 当前阶段先不作为主系统关键模块推进
- 先做主实现识别和归档判断

---

### 7. `tools/scheduler/`
**标签：历史实现（Legacy Candidate）**

#### 判断理由
- 已知 `run_scheduler.bat` 存在路径漂移
- 当前项目也已明确：**暂不并入 cron**
- 说明这个目录当前不是主路径推进重点

#### 未来建议归属
- 历史调度脚本 → `archive/deprecated-tools/scheduler/`
- 若未来保留调度配置逻辑 → `config/schedules/`
- 若未来重建执行器 → 另起 CLI / automation 通道

#### 后续动作建议
- 当前阶段先明确“历史残留”身份
- 不要继续围绕现有 scheduler 叠加新逻辑

---

### 8. `tools/screenshot/`
**标签：辅助脚本（Script Candidate） / 主用核心（Core Candidate）**

#### 判断理由
- 若截图只是输出或辅助能力，则更像工具脚本
- 若它承担某类视觉产出（如微信截图模拟），则可能是视觉链路的一部分

#### 结论
当前应先标为：
- **偏核心的辅助模块**

#### 未来建议归属
- 若融入正式视觉工作流 → `core/services/visual/`
- 若主要用于补充素材生成 → `scripts/visual-tools/`

#### 后续动作建议
- 结合实际调用频率决定是否纳入核心视觉层

---

### 9. `tools/video/`
**标签：辅助脚本（Script Candidate）**

#### 判断理由
- 当前主流程以图文结果为主
- 视频渲染能力当前不在正式主流程 1-9 步里

#### 未来建议归属
- `scripts/media/` 或未来独立扩展层

#### 后续动作建议
- 当前阶段不进入主流程重构优先级

---

### 10. `tools/jianying/`
**标签：待判定（Needs Review） / 辅助脚本（Script Candidate）**

#### 判断理由
- 剪映相关能力看起来更偏视频侧或素材解析侧
- 当前不属于正式主流程核心

#### 未来建议归属
- 若持续使用 → `scripts/media/` 或 `archive/legacy-integrations/`

#### 后续动作建议
- 当前不优先推进
- 先判定是否仍有实际使用价值

---

### 11. `tools/tests/`
**标签：辅助脚本（Script Candidate）**

#### 判断理由
- 属于测试体系，不应与业务工具混在一层长期保留

#### 未来建议归属
- 顶层 `tests/`
- 或 `scripts/tests/`

#### 后续动作建议
- 后续可从 `tools/` 独立出去，成为正式测试目录

---

### 12. `tools/utils/`
**标签：主用核心（Core Candidate） / 辅助脚本（Script Candidate）**

#### 判断理由
- `utils` 通常会被多个模块复用
- 如果是业务通用能力，应进入 `core/utils/`
- 如果只是脚本辅助函数，则进入 `scripts/utils/`

#### 后续动作建议
- 先查引用关系
- 再拆成 core-utils 和 script-utils

---

### 13. `tools/hooks/`
**标签：辅助脚本（Script Candidate）**

#### 判断理由
- 明显属于开发流程辅助
- 不属于产品主流程

#### 未来建议归属
- `scripts/dev/hooks/`

---

## 五、单文件标签化结果

### 1. `tools/manage.py`
**标签：待判定（Needs Review）**

#### 判断理由
- 名字像总入口
- 但需判断它未来是：
  - 正式 CLI 雏形
  - 开发辅助入口
  - 历史管理脚本

#### 建议
- 优先检查它是否可升级为未来 `app/cli/` 的过渡入口

---

### 2. `tools/show_materials.py`
**标签：辅助脚本（Script Candidate）**

#### 判断理由
- 明显更像开发或调试辅助脚本

#### 未来建议归属
- `scripts/debug/` 或 `scripts/dev/`

---

### 3. `tools/package.json`
**标签：待判定（Needs Review）**

#### 判断理由
- 需判断它支撑哪些工具链
- 后续可能被拆分到具体模块目录

---

### 4. `tools/requirements.txt`
**标签：待判定（Needs Review）**

#### 判断理由
- 当前是工具层统一依赖文件
- 未来若拆分为 core / scripts，则依赖也需要拆分或重组

---

## 六、按优先级排序的梳理对象

### 第一优先级（最值得先梳）
1. `tools/generator/`
2. `tools/card/`
3. `tools/cover/`
4. `tools/compliance/`
5. `tools/manage.py`

#### 原因
- 与主流程关系最强
- 决定 shared service / pipeline 如何落地

---

### 第二优先级（需要判断是否保留为核心）
6. `tools/scraper/`
7. `tools/screenshot/`
8. `tools/utils/`

#### 原因
- 有价值，但在新主流程中的位置需要重新定义

---

### 第三优先级（当前先视为历史或外围）
9. `tools/publish/`
10. `tools/scheduler/`
11. `tools/video/`
12. `tools/jianying/`
13. `tools/hooks/`
14. `tools/tests/`
15. `tools/show_materials.py`

#### 原因
- 当前不属于主流程重构核心
- 可先做身份标记，不急着投入主线精力

---

## 七、对 `tools/` 的总体收口建议

### 当前最重要的事情，不是直接迁移，而是先做 3 步

#### 第一步：识别“真正主实现”
尤其是：
- `generator/`
- `card/`
- `cover/`
- `compliance/`

#### 第二步：识别“历史并存版本”
尤其是：
- `publish/`
- `scheduler/`
- `card/` 的多版本渲染器

#### 第三步：识别“未来是否仍有主流程价值”
尤其是：
- `scraper/`
- `screenshot/`
- `jianying/`
- `video/`

---

## 八、一句话总结

`tools/` 当前不是一个可以继续扩张的统一目录，而是一个混合层。

后续正确做法不是“继续往 tools 里加东西”，而是：

> **把与主流程强相关的部分识别为 core 候选，把开发/调试能力识别为 scripts 候选，把多版本历史残留识别为 archive 候选。**
