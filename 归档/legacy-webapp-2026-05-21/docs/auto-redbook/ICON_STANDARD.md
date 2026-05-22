# 图标使用标准 - 强制性规范

## 🚨 强制性要求

**所有封面生成必须使用 Lucide Icons，不得使用 Emoji。**

---

## ✅ 标准封面模板

**唯一官方模板**: `assets/cover_with_icons.html`

### 模板特点
- ✅ 使用 Lucide Icons（开源SVG图标库）
- ✅ 渐变色背景（5种配色方案）
- ✅ 主图标 + 装饰图标
- ✅ 响应式布局
- ✅ 高清渲染（2x分辨率）

---

## 📚 Lucide Icons 图标库

**官方网站**: https://lucide.dev/icons

**CDN**: `https://unpkg.com/lucide@latest`

**总图标数**: 1000+ 个高质量SVG图标

### 推荐图标列表

#### 运势占卜类
```
sparkles  - 闪光（最常用）
star      - 星星
moon      - 月亮
sun       - 太阳
zap       - 闪电
compass   - 罗盘
eye       - 眼睛
```

#### 塔罗牌类
```
scroll       - 卷轴
book-open    - 打开的书
flame        - 火焰
gem          - 宝石
crown        - 皇冠
shield       - 盾牌
```

#### 情感咨询类
```
heart                 - 爱心
heart-handshake      - 握手之心
message-circle-heart - 爱心对话
users                - 用户
flower               - 花朵
gift                 - 礼物
```

#### 事业财运类
```
trending-up  - 上升趋势
trophy       - 奖杯
coins        - 硬币
wallet       - 钱包
briefcase    - 公文包
target       - 目标
```

#### 心灵成长类
```
brain      - 大脑
compass    - 指南针
leaf       - 叶子
sunrise    - 日出
mountain   - 山峰
feather    - 羽毛
```

#### 水晶能量类
```
gem       - 宝石
diamond   - 钻石
hexagon   - 六边形
triangle  - 三角形
circle    - 圆形
pentagon  - 五边形
```

完整列表见: `automation/config/icon_mapping.json`

---

## 🎨 配色方案

### 5种渐变配色（随机选择）

1. **purple_gradient** - 紫色渐变
   - 背景: #667eea → #764ba2
   - 适合: 运势、占卜、神秘类

2. **pink_gradient** - 粉色渐变
   - 背景: #f093fb → #f5576c
   - 适合: 情感、桃花、浪漫类

3. **blue_gradient** - 蓝色渐变
   - 背景: #4facfe → #00f2fe
   - 适合: 事业、财运、理性类

4. **orange_gradient** - 橙色渐变
   - 背景: #fa709a → #fee140
   - 适合: 活力、阳光、疗愈类

5. **green_gradient** - 绿色渐变
   - 背景: #30cfd0 → #330867
   - 适合: 自然、能量、成长类

---

## 🛠️ 生成流程

### 方法1: 使用Python脚本（推荐）

```bash
python test_icon_cover.py
```

**脚本功能**:
- 自动读取 `icon_mapping.json` 配置
- 根据内容类别选择合适图标
- 随机选择配色方案
- 生成HTML文件

### 方法2: 手动指定参数

```python
from test_icon_cover import generate_icon_cover_html

generate_icon_cover_html(
    title='今日运势来啦',
    subtitle='准到离谱',
    category='运势占卜',  # 从icon_mapping.json中选择
    output_path='content/cover.html'
)
```

### 方法3: 渲染为PNG

```bash
node scripts/render_cover.js content/cover.html output/cover.png
```

---

## 📋 完整示例

### 1. 生成HTML
```python
from test_icon_cover import generate_icon_cover_html

generate_icon_cover_html(
    title='桃花运势爆棚',
    subtitle='脱单指南',
    category='情感咨询',
    output_path='content/love_cover.html'
)
```

### 2. 渲染PNG
```bash
node scripts/render_cover.js content/love_cover.html content/love_cover.png
```

### 3. 查看效果
打开 `content/love_cover.png` 即可看到：
- 主图标: heart（爱心）
- 配色: pink_gradient（粉色渐变）
- 标题: 桃花运势爆棚
- 副标题: 脱单指南
- 装饰图标: heart, flower-2, sparkles

---

## ⚙️ 配置文件

### icon_mapping.json 结构

```json
{
  "categories": {
    "运势占卜": {
      "primary_icons": ["sparkles", "star", "moon"],
      "decorative_icons": ["sparkles", "star", "zap"],
      "description": "星座、运势、占卜相关"
    }
  },
  "color_schemes": {
    "purple_gradient": {
      "background": "linear-gradient(...)",
      "icon_bg": "linear-gradient(...)",
      "text": "linear-gradient(...)",
      "subtitle_color": "#667eea"
    }
  }
}
```

---

## 🚫 禁止使用

### ❌ 禁止使用 Emoji
```html
<!-- 错误示例 -->
<div class="cover-emoji">🌟</div>
```

理由：
- Emoji在不同设备显示不一致
- 无法精确控制大小和颜色
- 缺乏专业感

### ❌ 禁止使用其他图标库
- Font Awesome
- Material Icons
- Bootstrap Icons
- 自制PNG图标

理由：
- Lucide Icons 是统一标准
- 保持视觉一致性
- SVG矢量无失真

---

## 📊 质量检查清单

发布前必须检查：

- [ ] 使用了 `cover_with_icons.html` 模板
- [ ] 图标来自 Lucide Icons
- [ ] 配色从5种方案中选择
- [ ] 标题清晰可读
- [ ] 副标题有箭头图标
- [ ] 装饰图标正确显示
- [ ] PNG分辨率为 1080×1440 @2x

---

## 🔄 自动化集成

### 内容生成器集成

```python
# automation/generators/content_generator.py

def generate_daily_content(time_slot):
    # ... 生成内容 ...

    # 自动生成图标封面
    from test_icon_cover import generate_icon_cover_html

    category = determine_category(content)  # 根据内容确定类别

    html_path = generate_icon_cover_html(
        title=title,
        subtitle=subtitle,
        category=category,
        output_path=f'content/queue/{date}/{time_slot}/cover.html'
    )

    # 渲染PNG
    import subprocess
    subprocess.run([
        'node',
        'scripts/render_cover.js',
        html_path,
        html_path.replace('.html', '.png')
    ])
```

---

## 📈 未来扩展

### 可选增强（不改变Lucide Icons要求）

1. **动态图标动画** - 添加CSS动画
2. **多图标组合** - 主图标+副图标
3. **图标颜色渐变** - SVG渐变填充
4. **3D图标效果** - CSS 3D变换

但核心要求不变：**必须使用 Lucide Icons**

---

## 🆘 故障排查

### Q: 图标不显示？
**A**: 检查CDN加载
```html
<script src="https://unpkg.com/lucide@latest"></script>
<script>lucide.createIcons();</script>
```

### Q: 图标颜色错误？
**A**: 检查配色方案替换
```python
html_content.replace('stroke: #667eea;', f'stroke: {color};')
```

### Q: 渲染后图标模糊？
**A**: 确保使用2x分辨率
```javascript
deviceScaleFactor: 2
```

---

## 📝 总结

**强制性标准**:
1. ✅ 使用 Lucide Icons（官方唯一图标库）
2. ✅ 使用 `cover_with_icons.html` 模板
3. ✅ 使用 `render_cover.js` 渲染脚本
4. ✅ 配色从5种方案中选择
5. ❌ 禁止 Emoji
6. ❌ 禁止其他图标库

**执行工具**:
- `test_icon_cover.py` - 生成HTML
- `scripts/render_cover.js` - 渲染PNG
- `icon_mapping.json` - 配置文件

**质量保证**:
- 所有封面必须通过质量检查清单
- 定期更新图标库版本
- 保持视觉一致性

---

**最后更新**: 2026-02-07
**强制执行**: 是
**违规处理**: 拒绝发布
