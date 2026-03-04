# Destinyteller 小红书自动化系统使用说明

## 系统架构

完整的自动化工作流程：

```
每天06:00 → 抓取小红书热点
       ↓
每天07:00 → 生成早间内容 + 渲染图片
       ↓
每天08:00 → 自动发布早间内容到小红书
       ↓
每天11:00 → 刷新热点数据
       ↓
每天11:30 → 生成午间内容 + 渲染图片
       ↓
每天12:30 → 自动发布午间内容到小红书
       ↓
每天17:00 → 刷新热点数据
       ↓
每天17:30 → 生成晚间内容 + 渲染图片
       ↓
每天19:30 → 自动发布晚间内容到小红书
```

## 快速开始

### 1. 测试内容生成

```bash
# 生成演示内容（早间）
python generate_content_demo.py

# 查看生成的文件
ls content/drafts/2026-02-06/demo_morning/
# 应该看到: content.md, metadata.json, cover.png, card_1.png, card_2.png
```

### 2. 测试发布功能

⚠️ **首次运行需要手动登录小红书**

```bash
# 测试自动发布
python test_publish.py
```

第一次运行时：
1. 浏览器会自动打开小红书发布页面
2. 如果需要登录，请手动登录
3. 登录后，Cookie 会自动保存到 `automation/config/xhs_cookies.json`
4. 后续运行会自动加载 Cookie，无需再次登录

### 3. 启动完整调度器

**方式1：直接运行 Python 脚本**

```bash
python automation/schedulers/daily_scheduler.py
```

**方式2：使用批处理文件**

```bash
run_scheduler.bat
```

**方式3：配置为 Windows 开机自启动**

1. 打开"任务计划程序"（Win + R → `taskschd.msc`）
2. 创建基本任务 → 名称：`DestinyTeller-Scheduler`
3. 触发器：计算机启动时
4. 操作：启动程序 → 浏览并选择 `h:\Project\Auto-Redbook-Skills\run_scheduler.bat`
5. 条件：取消"只有在计算机使用交流电源时才启动"
6. 设置：允许按需运行任务

## 文件结构说明

### 内容存储

```
content/
├── drafts/          # 草稿（生成后暂存）
│   └── 2026-02-06/
│       ├── morning/
│       │   ├── content.md      # Markdown 内容
│       │   ├── metadata.json   # 元数据（标题、标签等）
│       │   ├── cover.png       # 封面图
│       │   ├── card_1.png      # 卡片1
│       │   └── card_2.png      # 卡片2
│       ├── midday/
│       └── evening/
│
└── published/       # 已发布归档
    └── 2026-02-06/
        ├── morning/
        │   ├── content.md
        │   ├── metadata.json
        │   ├── cover.png
        │   ├── card_1.png
        │   ├── card_2.png
        │   └── publish_result.json  # 发布结果（URL等）
        ├── midday/
        └── evening/
```

### 配置文件

- `automation/config/schedule.json` - 发布时间表
- `automation/config/hashtags.json` - 标签库（6个分类）
- `automation/config/promotion_strategy.json` - 推广策略
- `automation/config/xhs_selectors.json` - 小红书页面选择器
- `automation/config/xhs_cookies.json` - 小红书 Cookie（自动生成）

### 日志文件

```
logs/
├── scheduler/        # 调度器日志
├── scraping/         # 热点抓取日志
└── generation/       # 内容生成日志
```

## 功能模块说明

### 1. 热点抓取（xhs_trending_scraper.py）

- 自动抓取小红书热门话题
- 搜索 12 个命理相关关键词：塔罗、占卜、运势、星座、生肖、八字、紫微斗数、命理、风水、水晶、冥想、心灵成长
- 提取热门帖子的标签组合
- 数据保存到 `data/trending_topics/{date}.json`

**防封策略**：
- 随机延迟 2-5 秒
- 移动端 User-Agent
- 每分钟最多 10 个请求

### 2. 内容生成器（claude_content_generator.py）

**当前版本**：示例模式（用于测试系统）

- 提供 3 个时段的示例内容（morning/midday/evening）
- 包含正确的 YAML frontmatter 格式
- 自然融入 destinyteller.com 推广

**时段内容风格**：
- **早间**：轻松、正能量、易读（每日运势、开运方法）
- **午间**：专业、有深度、干货向（塔罗牌解读、命理知识）
- **晚间**：温暖、共鸣、故事性强（情感占卜、心灵疗愈）

### 3. 内容管道（content_pipeline.py）

完整的内容生成和渲染流程：

1. 加载热点数据
2. 调用内容生成器
3. 保存 Markdown 文件
4. 调用图片渲染器（render_xhs_v2.js）
5. 保存元数据

### 4. 图片渲染器（image_renderer.py）

封装现有的 `scripts/render_xhs_v2.js` 脚本：

**支持的主题**（按时段）：
- **早间**：mint（清新）、sunset（日落）、xiaohongshu（小红书风）
- **午间**：elegant（优雅）、ocean（海洋）、purple（紫色）
- **晚间**：dark（深色）、sunset（日落）、purple（紫色）

**图片规格**：
- 尺寸：1080×1440 像素
- DPR：2（高清）
- 格式：PNG
- 自动分页（封面 + 多张卡片）

### 5. Playwright 自动发布器（playwright_publisher.py）

⭐ **核心功能**

使用 Playwright 浏览器自动化，模拟真实用户操作：

**工作流程**：
1. 启动浏览器（首次非无头模式便于登录）
2. 加载已保存的 Cookie
3. 访问小红书创作中心
4. 检测登录状态（首次需手动登录）
5. 上传图片
6. 填写标题和描述
7. 等待用户确认（可选）
8. 点击发布按钮
9. 获取笔记 URL

**Cookie 管理**：
- 首次运行：手动登录 → 自动保存 Cookie
- 后续运行：自动加载 Cookie → 保持登录状态
- Cookie 文件：`automation/config/xhs_cookies.json`

**错误处理**：
- 选择器失败 → 提示手动操作
- 上传失败 → 等待用户手动上传
- Cookie 过期 → 提示重新登录

### 6. 每日调度器（daily_scheduler.py）

完整的自动化调度系统：

**注册的任务**：
- 06:00, 11:00, 17:00 → 热点抓取
- 07:00, 11:30, 17:30 → 内容生成
- 08:00, 12:30, 19:30 → 自动发布

**功能**：
- 自动协调所有模块
- 归档已发布内容
- 错误日志记录
- 持续运行监控

## 推广策略

系统采用 **4 种软性推广风格**：

### 1. 无推广（10%）
纯内容分享，不提网站。仅在个人主页简介中有链接。

### 2. 自然提及（40%）
```
"我平时在 destinyteller.com 上查看详细解读"
"最近在这个平台上看到一个很准的测试"
```

### 3. 资源分享（30%）
```
"想深入学习的可以去 destinyteller.com 看看系统教程"
"分享一个我常用的占卜工具，姐妹们可以试试"
```

### 4. 直接推荐（20%）
```
"专业塔罗师都在用 destinyteller.com"
"推荐一个靠谱的在线占卜网站，我自己在用"
```

**禁用词汇**：
避免使用明显的广告词，如：广告、推广、必买、点击、关注我、私信、优惠、折扣、限时

## 标签策略

系统包含 **6 大标签分类**：

1. **占卜类**：塔罗占卜、每日运势、星座运程、占卜分享、八字命理、紫微斗数
2. **情感类**：情感占卜、桃花运、感情运势、爱情塔罗
3. **事业类**：事业运势、职场占卜、财运测试、工作指引
4. **灵性类**：心灵成长、水晶疗愈、冥想、正念、能量提升
5. **风水类**：风水布局、家居风水、办公室风水、招财风水
6. **星座类**：星座配对、星盘解读、月亮星座、水逆

每篇内容自动选择 5-8 个标签，优先使用主要标签，融入 10% 热点标签。

## 监控与维护

### 查看实时日志

```bash
# 查看调度器日志
tail -f logs/scheduler/2026-02-06_daily_scheduler.log

# 查看生成日志
tail -f logs/generation/2026-02-06_content_pipeline.log
```

### 检查今日生成的内容

```bash
# 查看今日所有内容
ls content/drafts/2026-02-06/

# 查看早间内容
ls content/drafts/2026-02-06/morning/
```

### 检查已发布内容

```bash
# 查看今日发布记录
ls content/published/2026-02-06/

# 查看发布结果（包含笔记 URL）
cat content/published/2026-02-06/morning/publish_result.json
```

## 故障排查

### 1. Cookie 过期

**现象**：浏览器打开后显示登录页面

**解决**：
1. 手动登录小红书
2. 登录成功后按回车继续
3. Cookie 会自动更新保存

### 2. 图片渲染失败

**现象**：未生成 PNG 文件

**检查**：
1. Node.js 是否安装：`node --version`
2. Playwright 包是否安装：`npm list playwright`
3. 主题名称是否正确

**解决**：
```bash
npm install playwright
```

### 3. 发布失败

**现象**：publish_workflow 返回 success: false

**可能原因**：
- Cookie 过期
- 网络问题
- 小红书限流
- 页面选择器变化

**解决**：
1. 检查日志文件查看具体错误
2. 手动运行 `python test_publish.py` 测试
3. 更新 `automation/config/xhs_selectors.json` 中的选择器

### 4. 热点抓取失败

**现象**：trending_topics 数据为空

**可能原因**：
- 小红书反爬机制
- 网络连接问题
- 页面结构变化

**解决**：
1. 调整延迟时间（增加 min_delay）
2. 使用代理
3. 手动创建热点数据文件：
   ```json
   {
     "timestamp": "2026-02-06T06:00:00",
     "trending_topics": ["水逆", "2026运势"],
     "keyword_hashtags": {
       "塔罗": ["塔罗占卜", "每日塔罗"],
       "星座": ["星座运势", "12星座"]
     }
   }
   ```

## 优化建议

### 第一周

1. **监控发布效果**
   - 记录每篇内容的点赞/评论/收藏数
   - 识别表现最好的内容类型
   - 分析最佳发布时间

2. **调整推广策略**
   - 如果流量不足，增加推广频率
   - 如果被判定为广告，减少推广力度

3. **优化内容质量**
   - 根据用户反馈调整内容风格
   - 增加新的内容模板
   - 更新热点关键词

### 每月任务

1. **数据分析**
   - 统计月度发布量（目标：90篇）
   - 计算平均互动率
   - 追踪网站流量来源

2. **竞品分析**
   - 研究头部账号的成功模式
   - 学习他们的内容风格
   - 更新标签策略

3. **系统维护**
   - 清理旧日志（>30天）
   - 归档旧内容（>90天）
   - 更新依赖包

## 预期效果

### 第一个月
- **发布量**：90 篇内容（每天 3 篇 × 30 天）
- **推广提及**：约 30 次自然提及 destinyteller.com
- **预期流量**：5-10 个新用户点击链接

### 第三个月
- **发布量**：270 篇内容
- **粉丝增长**：50-100 新粉丝
- **互动数据**：平均每篇 10-20 点赞
- **网站流量**：20-50 个新用户/月

### 第六个月
- **发布量**：540 篇内容
- **账号成长**：200-500 粉丝
- **爆款内容**：1-3 篇破千点赞
- **品牌认知**：在命理圈有一定知名度

## 技术支持

如有问题，请查看：
- 项目文档：`automation/README.md`
- 实施计划：`C:\Users\Administrator\.claude\plans\synthetic-gathering-oasis.md`
- 日志文件：`logs/` 目录

## 许可证

MIT License
