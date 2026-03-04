# 下一步操作指南

## 当前系统状态

### ✅ 已完成并测试通过
1. **内容生成系统** - 3个时段内容自动生成
2. **图片渲染系统** - 自动渲染为精美图片
3. **内容管道系统** - 完整的生成+渲染工作流
4. **文件管理系统** - 自动目录创建和文件保存

### ✅ 已实现但需要手动测试
5. **Playwright 自动发布** - 需要首次手动登录
6. **完整调度系统** - 每日自动化工作流
7. **热点抓取系统** - 抓取小红书热点

---

## 立即执行：测试自动发布

### 方法 1：手动测试（推荐）

运行手动测试脚本：
```bash
python test_publish_manual.py
```

**工作流程**：
1. 脚本会显示要发布的内容信息
2. 按回车后，浏览器自动打开
3. 如果需要登录：
   - 在浏览器中手动登录小红书（扫码或密码）
   - 登录成功后，在命令行按回车
   - Cookie 会自动保存到 `automation/config/xhs_cookies.json`
4. 系统自动操作：
   - 上传图片（3张）
   - 填写标题
   - 填写描述和标签
5. 确认：
   - 在浏览器中检查内容
   - 在命令行按回车确认发布
6. 发布完成，显示笔记 URL

### 方法 2：跳过发布测试（直接启动调度器）

如果你想先跳过手动测试，直接让系统自动运行，可以：

1. 确保之前已经登录过小红书（有 Cookie 文件）
2. 直接启动调度器：
   ```bash
   run_scheduler.bat
   ```

**调度器会按时间表自动执行所有任务**：
- 06:00/11:00/17:00 → 抓取热点
- 07:00/11:30/17:30 → 生成内容
- 08:00/12:30/19:30 → 自动发布

---

## 测试结果确认

### 发布成功的标志

如果发布成功，你会看到：
```
[OK] 发布成功！
笔记 URL: https://www.xiaohongshu.com/explore/xxxxxx
时间: 2026-02-06T13:25:00
```

### 验证步骤

1. **检查小红书账号**
   - 登录小红书 APP 或网页版
   - 查看"我的"→"笔记"
   - 确认新发布的笔记

2. **检查文件归档**
   ```bash
   ls content/published/2026-02-06/
   ```
   应该看到归档的内容和 `publish_result.json`

3. **检查日志**
   ```bash
   cat logs/scheduler/2026-02-06_daily_scheduler.log
   ```

---

## 启动完整自动化系统

### 方式 1：临时运行

在命令行运行（会持续运行，关闭命令行窗口即停止）：
```bash
python automation/schedulers/daily_scheduler.py
```

或使用批处理：
```bash
run_scheduler.bat
```

### 方式 2：配置为 Windows 开机启动（推荐）

**步骤**：

1. 按 Win + R，输入 `taskschd.msc`，回车打开"任务计划程序"

2. 右侧点击"创建基本任务"

3. 配置任务：
   - **名称**: `DestinyTeller-AutoScheduler`
   - **描述**: Destinyteller 小红书自动化发布系统
   - **触发器**: 计算机启动时
   - **操作**: 启动程序
   - **程序/脚本**: 浏览并选择
     ```
     h:\Project\Auto-Redbook-Skills\run_scheduler.bat
     ```

4. 高级设置：
   - 取消"只有在计算机使用交流电源时才启动"
   - 勾选"允许按需运行任务"
   - 勾选"如果任务失败，重新启动"

5. 完成！电脑开机后系统会自动启动

### 方式 3：立即启动任务（测试）

配置好任务计划程序后，可以立即测试：

1. 在任务计划程序中找到 `DestinyTeller-AutoScheduler`
2. 右键 → "运行"
3. 查看日志确认运行状态

---

## 监控系统运行

### 查看实时日志

```bash
# Windows PowerShell
Get-Content logs/scheduler/2026-02-06_daily_scheduler.log -Wait -Tail 20

# 或使用 Git Bash
tail -f logs/scheduler/2026-02-06_daily_scheduler.log
```

### 检查今日生成的内容

```bash
# 查看草稿
ls content/drafts/2026-02-06/

# 查看已发布
ls content/published/2026-02-06/
```

### 检查发布结果

```bash
# 查看发布记录
cat content/published/2026-02-06/morning/publish_result.json
```

示例输出：
```json
{
  "success": true,
  "note_url": "https://www.xiaohongshu.com/explore/xxxxxx",
  "timestamp": "2026-02-06T08:05:23"
}
```

---

## 常见问题解决

### 1. Cookie 过期

**现象**：浏览器打开后显示登录页面

**解决**：
1. 运行 `python test_publish_manual.py`
2. 手动登录小红书
3. Cookie 会自动更新

### 2. 发布失败

**可能原因**：
- Cookie 过期
- 网络问题
- 小红书限流
- 页面选择器变化

**解决步骤**：
1. 查看日志文件：`logs/scheduler/日期_daily_scheduler.log`
2. 手动测试：`python test_publish_manual.py`
3. 如果是选择器问题，更新 `automation/config/xhs_selectors.json`

### 3. 图片渲染失败

**检查**：
```bash
node --version
npm list playwright
```

**修复**：
```bash
npm install playwright
```

### 4. 调度器未按时执行

**检查**：
1. 确认调度器正在运行（任务管理器中查看 python.exe）
2. 检查系统时间是否正确
3. 查看日志文件

---

## 系统运行时间表

系统启动后，将按以下时间表自动运行：

### 早间工作流（7:30-8:30 发布）
```
06:00 → 抓取小红书热点
07:00 → 生成早间内容 + 渲染图片
08:00 → 自动发布到小红书
```

### 午间工作流（12:00-13:00 发布）
```
11:00 → 刷新热点数据
11:30 → 生成午间内容 + 渲染图片
12:30 → 自动发布到小红书
```

### 晚间工作流（18:00-21:00 发布）
```
17:00 → 刷新热点数据
17:30 → 生成晚间内容 + 渲染图片
19:30 → 自动发布到小红书
```

**每天发布 3 篇内容，完全自动化！**

---

## 预期效果

### 第一周
- 发布量：21 篇（每天 3 篇 × 7 天）
- 建立发布习惯
- 监控数据反馈

### 第一个月
- 发布量：90 篇
- 推广提及：约 30 次 destinyteller.com
- 预期流量：5-10 个新用户

### 第三个月
- 发布量：270 篇
- 粉丝增长：50-100
- 互动数据：平均 10-20 点赞/篇
- 网站流量：20-50 新用户/月

---

## 优化建议

### 第一周任务

1. **监控发布效果**
   - 每天检查 3 篇内容是否成功发布
   - 记录每篇的点赞/评论/收藏数
   - 识别表现最好的内容类型

2. **调整发布时间**
   - 观察哪个时段互动率最高
   - 根据数据优化时间表

3. **内容质量评估**
   - 查看用户评论反馈
   - 调整内容风格和推广策略

### 持续优化

1. **内容多样化**
   - 当前使用示例内容
   - 后期可集成 Claude API 生成动态内容
   - 根据热点数据调整主题

2. **数据分析**
   - 统计月度发布量
   - 计算平均互动率
   - 追踪网站流量来源

3. **竞品学习**
   - 研究头部账号策略
   - 学习成功内容模式
   - 更新标签和推广方式

---

## 相关文档

- [系统使用说明](automation/使用说明.md) - 详细操作指南
- [系统就绪报告](SYSTEM_READY.md) - 功能总览
- [测试完成报告](TESTING_COMPLETE.md) - 测试结果
- [项目文档](automation/README.md) - 系统架构

---

## 技术支持

### 日志位置
- 调度器日志：`logs/scheduler/`
- 抓取日志：`logs/scraping/`
- 生成日志：`logs/generation/`

### 配置文件
- 时间表：`automation/config/schedule.json`
- 标签库：`automation/config/hashtags.json`
- 推广策略：`automation/config/promotion_strategy.json`
- Cookie：`automation/config/xhs_cookies.json`（首次登录后生成）

---

## 开始使用

**现在就开始吧！**

### 快速启动 3 步：

1. **测试发布**（首次必须）
   ```bash
   python test_publish_manual.py
   ```

2. **启动调度器**
   ```bash
   run_scheduler.bat
   ```

3. **配置开机自启**（可选）
   - 任务计划程序 → 创建任务
   - 指向 `run_scheduler.bat`

系统就绪！自动化推广开始！🚀
