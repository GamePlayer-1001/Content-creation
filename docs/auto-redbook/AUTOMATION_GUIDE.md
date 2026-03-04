# 🤖 Destinyteller 自动化推广系统完整指南

> 基于 Auto-Redbook-Skills 项目构建的完全自动化小红书发布系统

## 📋 目录

- [系统概述](#系统概述)
- [快速开始](#快速开始)
- [系统架构](#系统架构)
- [配置说明](#配置说明)
- [使用指南](#使用指南)
- [监控维护](#监控维护)
- [常见问题](#常见问题)

---

## 系统概述

### 功能特性

✅ **完全自动化** - 每天自动发布3篇内容，无需人工干预
✅ **智能内容生成** - 3种时段风格（轻松/专业/疗愈）
✅ **热点追踪** - 自动抓取小红书热点话题
✅ **精美图片渲染** - 7种主题，自动分页
✅ **自动发布** - Playwright 浏览器自动化
✅ **定时调度** - 每天06:00-19:30分时段执行

### 工作流程

```
每日 06:00 → 抓取热点
     07:00 → 生成早间内容 + 渲染图片
     08:00 → 自动发布 [轻松正能量]

     11:00 → 刷新热点
     11:30 → 生成午间内容 + 渲染图片
     12:30 → 自动发布 [专业干货]

     17:00 → 刷新热点
     17:30 → 生成晚间内容 + 渲染图片
     19:30 → 自动发布 [温暖疗愈]
```

---

## 快速开始

### 步骤 1：测试内容生成

```bash
python generate_content_demo.py
```

选择时段（1=早间，2=午间，3=晚间），查看生成的图片。

### 步骤 2：测试自动发布

```bash
python test_publish_manual.py
```

⚠️ **首次运行需要手动登录小红书**，Cookie 会自动保存。

### 步骤 3：启动自动化系统

```bash
run_scheduler.bat
```

系统开始按时间表自动运行！

---

## 系统架构

### 核心组件

| 组件 | 文件 | 功能 |
|------|------|------|
| 内容生成器 | `automation/generators/claude_content_generator.py` | 生成3种时段内容 |
| 图片渲染器 | `automation/publishers/image_renderer.py` | 封装 render_xhs_v2.js |
| 内容管道 | `automation/generators/content_pipeline.py` | 生成+渲染工作流 |
| 自动发布器 | `automation/publishers/playwright_publisher.py` | Playwright 自动化 |
| 热点抓取器 | `automation/scrapers/xhs_trending_scraper.py` | 抓取小红书热点 |
| 调度器 | `automation/schedulers/daily_scheduler.py` | 定时任务调度 |

### 数据流

```
热点数据 → 内容生成 → Markdown 文件 → 图片渲染 → PNG 图片 → 自动发布 → 归档
```

---

## 配置说明

### 配置文件位置

```
automation/config/
├── schedule.json              # 发布时间表
├── hashtags.json              # 6大标签分类
├── promotion_strategy.json    # 4种推广策略
├── xhs_selectors.json         # 页面选择器
└── xhs_cookies.json           # Cookie（首次登录后生成）
```

### 发布时间表（schedule.json）

```json
{
  "timezone": "Asia/Shanghai",
  "posting_times": {
    "morning": {
      "optimal_time": "08:00",
      "theme_rotation": ["mint", "sunset", "xiaohongshu"]
    },
    "midday": {
      "optimal_time": "12:30",
      "theme_rotation": ["elegant", "ocean", "purple"]
    },
    "evening": {
      "optimal_time": "19:30",
      "theme_rotation": ["dark", "sunset", "purple"]
    }
  }
}
```

### 标签策略（hashtags.json）

6大分类，每篇自动选择5-8个标签：
- 占卜类：塔罗占卜、每日运势、八字命理
- 情感类：情感占卜、桃花运、感情运势
- 事业类：事业运势、职场占卜、财运测试
- 灵性类：心灵成长、水晶疗愈、冥想
- 风水类：风水布局、家居风水
- 星座类：星座配对、星盘解读

---

## 使用指南

### 方式 1：直接运行（测试用）

```bash
# 运行调度器
python automation/schedulers/daily_scheduler.py

# 或使用批处理
run_scheduler.bat
```

适合测试和临时运行，关闭命令行窗口即停止。

### 方式 2：配置开机启动（推荐）

**步骤**：

1. Win + R → 输入 `taskschd.msc` → 回车

2. 右侧"创建基本任务"

3. 配置：
   - 名称：`DestinyTeller-AutoScheduler`
   - 触发器：计算机启动时
   - 程序：`h:\Project\Auto-Redbook-Skills\run_scheduler.bat`

4. 高级设置：
   - ✓ 取消"只有在使用交流电源时才启动"
   - ✓ 勾选"允许按需运行任务"
   - ✓ 勾选"如果失败，重新启动"

5. 完成！开机自动运行

### 立即测试任务

在任务计划程序中：
1. 找到 `DestinyTeller-AutoScheduler`
2. 右键 → "运行"
3. 查看日志确认运行

---

## 监控维护

### 查看实时日志

**PowerShell**:
```powershell
Get-Content logs/scheduler/2026-02-06_daily_scheduler.log -Wait -Tail 20
```

**Git Bash**:
```bash
tail -f logs/scheduler/2026-02-06_daily_scheduler.log
```

### 检查今日内容

```bash
# 查看草稿
ls content/drafts/2026-02-06/

# 查看已发布
ls content/published/2026-02-06/

# 查看发布结果
cat content/published/2026-02-06/morning/publish_result.json
```

### 发布结果示例

```json
{
  "success": true,
  "note_url": "https://www.xiaohongshu.com/explore/xxxxxx",
  "timestamp": "2026-02-06T08:05:23"
}
```

### 验证小红书账号

1. 登录小红书 APP 或网页版
2. 查看"我的" → "笔记"
3. 确认今日发布的3篇内容

---

## 常见问题

### 1. Cookie 过期

**现象**：浏览器打开后显示登录页面

**解决**：
```bash
python test_publish_manual.py
```
手动登录后，Cookie 自动更新保存。

### 2. 图片渲染失败

**检查依赖**：
```bash
node --version
npm list playwright
```

**修复**：
```bash
npm install playwright
```

### 3. 发布失败

**查看日志**：
```bash
cat logs/scheduler/2026-02-06_daily_scheduler.log
```

**可能原因**：
- Cookie 过期
- 网络问题
- 小红书限流
- 页面选择器变化

**解决**：
1. 更新 Cookie（运行 test_publish_manual.py）
2. 检查网络连接
3. 如果是选择器问题，更新 `automation/config/xhs_selectors.json`

### 4. 调度器未按时执行

**检查调度器是否运行**：
- 打开任务管理器
- 查找 `python.exe` 进程
- 查看命令行参数是否包含 `daily_scheduler.py`

**检查系统时间**：
确保 Windows 系统时间正确

**查看日志**：
```bash
cat logs/scheduler/2026-02-06_daily_scheduler.log
```

---

## 内容策略

### 时段内容风格

| 时段 | 时间 | 风格 | 内容类型 | 视觉主题 |
|------|------|------|---------|---------|
| 早间 | 08:00 | 轻松、正能量 | 每日运势、开运方法 | mint, sunset, xiaohongshu |
| 午间 | 12:30 | 专业、干货 | 塔罗解读、命理知识 | elegant, ocean, purple |
| 晚间 | 19:30 | 温暖、疗愈 | 情感占卜、心灵成长 | dark, sunset, purple |

### 推广策略

1. **无推广（10%）** - 纯内容分享
2. **自然提及（40%）** - "我平时在 destinyteller.com 上查看"
3. **资源分享（30%）** - "系统学习可以看看 destinyteller.com"
4. **直接推荐（20%）** - "专业塔罗师都在用 destinyteller.com"

**禁用词汇**：广告、推广、必买、点击、私信、优惠、限时

---

## 数据统计

### 预期效果

**第一个月**：
- 发布量：90篇（每天3篇 × 30天）
- 推广提及：约30次 destinyteller.com
- 预期流量：5-10个新用户

**第三个月**：
- 发布量：270篇
- 粉丝增长：50-100
- 互动数据：平均10-20点赞/篇
- 网站流量：20-50新用户/月

**第六个月**：
- 发布量：540篇
- 账号粉丝：200-500
- 爆款内容：1-3篇破千点赞
- 品牌认知：在命理圈建立知名度

### 监控指标

每周记录：
- 发布成功率
- 平均点赞/评论/收藏数
- 最佳发布时间
- 表现最好的内容类型
- 网站流量来源

---

## 优化建议

### 第一周

1. **监控发布**
   - 每天检查3篇是否成功
   - 记录互动数据
   - 识别热门内容

2. **调整策略**
   - 观察哪个时段效果最好
   - 调整推广频率
   - 优化标签组合

### 持续优化

1. **内容质量**
   - 根据用户反馈调整风格
   - 增加新的内容模板
   - 更新热点关键词

2. **数据分析**
   - 统计月度发布量
   - 计算平均互动率
   - 追踪流量转化

3. **竞品学习**
   - 研究头部账号策略
   - 学习成功内容模式
   - 更新推广方式

---

## 技术架构

### 依赖项

**Python 包**：
- `playwright` - 浏览器自动化
- `schedule` - 定时任务调度

**Node.js 包**：
- `playwright` - 图片渲染引擎
- `js-yaml` - YAML 解析
- `marked` - Markdown 解析

### 文件结构

```
automation/
├── config/          # 4个配置文件
├── scrapers/        # 热点抓取
├── generators/      # 内容生成+管道
├── publishers/      # 图片渲染+自动发布
├── schedulers/      # 调度器
└── utils/           # 日志系统

content/
├── drafts/          # 草稿暂存
└── published/       # 已发布归档

data/
└── trending_topics/ # 热点数据

logs/
├── scheduler/       # 调度日志
├── scraping/        # 抓取日志
└── generation/      # 生成日志
```

---

## 相关文档

- [系统使用说明](automation/使用说明.md) - 详细操作指南
- [系统就绪报告](SYSTEM_READY.md) - 功能总览
- [测试完成报告](TESTING_COMPLETE.md) - 测试结果
- [下一步指南](NEXT_STEPS.md) - 启动步骤
- [项目文档](automation/README.md) - 系统架构

---

## 快速命令参考

```bash
# 测试
python generate_content_demo.py              # 测试内容生成
python test_publish_manual.py                # 测试自动发布
python test_complete_system.py               # 完整系统测试

# 运行
python automation/schedulers/daily_scheduler.py  # 启动调度器
run_scheduler.bat                            # Windows 启动脚本

# 监控
tail -f logs/scheduler/$(date +%Y-%m-%d)_daily_scheduler.log  # 查看日志
ls content/published/$(date +%Y-%m-%d)/     # 查看今日发布
```

---

## 开始使用

**立即开始 3 步**：

1. **测试发布**（首次必须）
   ```bash
   python test_publish_manual.py
   ```

2. **启动调度器**
   ```bash
   run_scheduler.bat
   ```

3. **配置开机自启**
   - 任务计划程序 → 创建任务
   - 指向 run_scheduler.bat

**系统就绪！自动化推广开始！** 🚀

---

MIT License
