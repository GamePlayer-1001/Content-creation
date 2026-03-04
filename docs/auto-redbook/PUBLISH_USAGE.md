# 自动发布使用说明

## 📝 通用发布脚本

**文件**: `auto_publish.py`

这是支持命令行参数的通用发布脚本，可以发布任何目录的内容。

---

## 🚀 使用方法

### 方法1: 使用默认测试内容
```bash
python auto_publish.py
```
- 发布 `content/drafts/test_publish/` 目录的内容
- 适合测试

### 方法2: 指定内容目录
```bash
python auto_publish.py content/queue/2026-02-07/midday
```
- 发布指定目录的内容
- 适合手动发布特定内容

### 方法3: 使用时段参数（推荐）
```bash
python auto_publish.py --time-slot morning
python auto_publish.py --time-slot midday
python auto_publish.py --time-slot evening
```
- 自动使用今天对应时段的内容
- 最方便的方式

---

## 📂 内容目录结构要求

发布脚本会读取以下文件：

```
content_dir/
├── metadata.json       # 元数据（必需）
├── content.md          # Markdown内容（必需）
├── cover.png           # 封面图片（必需）
├── card_1.png          # 卡片图片（可选）
├── card_2.png          # 卡片图片（可选）
└── ...
```

### metadata.json 格式
```json
{
  "title": "财运爆棚",
  "subtitle": "升职秘诀",
  "category": "事业财运",
  "icon_system": "Lucide Icons"
}
```

### content.md 格式
```markdown
---
title: "财运爆棚"
subtitle: "升职秘诀"
---

💫 内容正文...

#标签1 #标签2
```

---

## 📊 实际使用示例

### 示例1: 发布今天中午的内容
```bash
# 1. 生成中午内容
python automation/generators/content_with_icons.py

# 2. 发布中午内容
python auto_publish.py --time-slot midday
```

### 示例2: 发布指定日期的内容
```bash
python auto_publish.py content/queue/2026-02-07/evening
```

### 示例3: 发布测试内容
```bash
python auto_publish.py
```

---

## 🔄 每日自动化流程

### 早间（08:00）
```bash
# 生成内容
python automation/generators/content_with_icons.py

# 发布
python auto_publish.py --time-slot morning
```

### 中午（11:30）
```bash
python auto_publish.py --time-slot midday
```

### 晚间（18:30）
```bash
python auto_publish.py --time-slot evening
```

---

## ✅ 发布日志

每次发布后会自动保存日志到：
- `logs/publish_log_YYYYMMDD.json`

日志格式：
```json
{
  "timestamp": "2026-02-07T11:35:13",
  "content_dir": "content/queue/2026-02-07/midday",
  "title": "财运爆棚",
  "images_count": 1,
  "success": true,
  "final_url": "...",
  "screenshot": "logs/final_20260207_113513.png"
}
```

---

## 🎯 验证发布成功

### 方法1: 检查URL
发布成功时，URL会包含 `published=true`：
```
https://creator.xiaohongshu.com/publish/publish?source=&published=true
```

### 方法2: 查看截图
检查最终截图：
```bash
ls -lt logs/final_*.png | head -1
```

### 方法3: 查看日志
```bash
cat logs/publish_log_20260207.json
```

### 方法4: 小红书后台
访问：https://creator.xiaohongshu.com/creator/notes
查看"笔记管理"

---

## ⚠️ 常见问题

### Q1: 提示目录不存在
**原因**: 内容目录路径错误或内容未生成
**解决**:
```bash
# 先生成内容
python automation/generators/content_with_icons.py

# 检查目录
ls content/queue/2026-02-07/
```

### Q2: 提示没有图片
**原因**: 图片未生成或文件名不匹配
**解决**:
```bash
# 检查图片
ls content/queue/2026-02-07/midday/*.png

# 确保有 cover.png
```

### Q3: 发布按钮找不到
**原因**: 页面结构变化或加载超时
**解决**: 脚本会自动使用 Tab 键导航，通常能成功

### Q4: Cookie过期
**原因**: 登录状态失效
**解决**:
```bash
# 手动登录小红书并保存Cookie
# 参考 ANTI_DETECTION.md
```

---

## 📚 相关文档

- `FINAL_SUMMARY.md` - 完整系统总结
- `ANTI_DETECTION.md` - 反检测方案
- `ICON_STANDARD.md` - 图标使用标准
- `automation/config/schedule.json` - 发布时间配置

---

## 🎉 快速测试

立即测试通用发布脚本：

```bash
# 使用中午刚生成的内容
python auto_publish.py --time-slot midday
```

应该看到：
- ✅ 读取 metadata.json
- ✅ 读取 content.md
- ✅ 找到图片（cover.png）
- ✅ 上传图片
- ✅ 填写内容
- ✅ 点击发布
- ✅ 保存日志

完成！
