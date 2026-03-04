#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
内容生成器 - 强制使用 Lucide Icons
完全自动化生成内容 + 图标封面
"""
import json
import random
import subprocess
from pathlib import Path
from datetime import datetime
import sys
PROJECT_ROOT = Path(__file__).parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))
from tools.generator.test_icon_cover import generate_icon_cover_html


class ContentGeneratorWithIcons:
    """带Lucide Icons的内容生成器"""

    def __init__(self):
        self.icon_config_file = PROJECT_ROOT / 'config' / 'icons.json'
        self.load_icon_config()

    def load_icon_config(self):
        """加载图标配置"""
        with open(self.icon_config_file, 'r', encoding='utf-8') as f:
            self.icon_config = json.load(f)

    def generate_content(self, time_slot, date_str=None):
        """
        生成完整内容（Markdown + 图标封面）

        Args:
            time_slot: 时段 (morning/midday/evening)
            date_str: 日期字符串，默认今天

        Returns:
            dict: 生成结果
        """
        if date_str is None:
            date_str = datetime.now().strftime('%Y-%m-%d')

        # 根据时段选择内容类型
        category = self._select_category(time_slot)

        # 生成内容
        title, subtitle, description = self._generate_text(category, time_slot)

        # 创建输出目录
        output_dir = PROJECT_ROOT / 'output' / 'queue' / date_str / time_slot
        output_dir.mkdir(parents=True, exist_ok=True)

        # 1. 生成 Markdown 内容
        markdown_content = self._create_markdown(title, subtitle, description, category)
        markdown_file = output_dir / 'content.md'
        with open(markdown_file, 'w', encoding='utf-8') as f:
            f.write(markdown_content)

        # 2. 生成图标封面 HTML
        cover_html = output_dir / 'cover.html'
        generate_icon_cover_html(
            title=title,
            subtitle=subtitle,
            category=category,
            output_path=cover_html
        )

        # 3. 渲染封面为 PNG
        cover_png = output_dir / 'cover.png'
        self._render_cover(cover_html, cover_png)

        # 4. 保存元数据
        metadata = {
            'title': title,
            'subtitle': subtitle,
            'category': category,
            'time_slot': time_slot,
            'date': date_str,
            'generated_at': datetime.now().isoformat(),
            'icon_system': 'Lucide Icons',  # 标记使用图标系统
            'files': {
                'markdown': str(markdown_file),
                'cover_html': str(cover_html),
                'cover_png': str(cover_png)
            }
        }

        metadata_file = output_dir / 'metadata.json'
        with open(metadata_file, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, ensure_ascii=False, indent=2)

        print(f"\n[OK] Content generated for {time_slot}")
        print(f"  Category: {category}")
        print(f"  Title: {title}")
        print(f"  Output: {output_dir}")

        return metadata

    def _select_category(self, time_slot):
        """根据时段选择内容类别"""
        categories_by_slot = {
            'morning': ['运势占卜', '每日指南', '心灵成长'],
            'midday': ['塔罗牌', '命理知识', '事业财运', '数字命理'],
            'evening': ['情感咨询', '水晶能量', '梦境解析', '星座配对']
        }

        available = categories_by_slot.get(time_slot, list(self.icon_config['categories'].keys()))
        return random.choice(available)

    def _generate_text(self, category, time_slot):
        """生成文本内容（示例）"""
        # 这里使用示例内容，实际应该调用Claude API生成

        title_templates = {
            '运势占卜': ['今日运势来啦', '运势播报', '今日星座运势'],
            '塔罗牌': ['塔罗牌解读', '塔罗奥秘', '牌意分享'],
            '情感咨询': ['桃花运势', '感情指南', '脱单秘籍'],
            '事业财运': ['财运爆棚', '升职加薪', '事业高峰'],
            '心灵成长': ['内心疗愈', '找回自己', '心灵觉醒'],
            '水晶能量': ['水晶魔法', '能量觉醒', '水晶疗愈']
        }

        subtitle_templates = {
            '运势占卜': ['准到离谱', '快来看看', '今日必看'],
            '塔罗牌': ['深度剖析', '玄妙解读', '牌意揭秘'],
            '情感咨询': ['脱单指南', '爱情秘籍', '桃花攻略'],
            '事业财运': ['升职秘诀', '财富密码', '事业巅峰'],
            '心灵成长': ['疗愈之旅', '重获新生', '内在觉醒'],
            '水晶能量': ['能量觉醒', '魔法启程', '水晶之力']
        }

        title = random.choice(title_templates.get(category, ['每日分享']))
        subtitle = random.choice(subtitle_templates.get(category, ['值得一看']))

        description = f"""💫 {category}专题

今日为大家带来关于{category}的深度解读。

## 核心要点

1. 把握今日能量
2. 了解运势走向
3. 掌握开运技巧

## 幸运提示

✨ 保持积极心态
✨ 相信自己的直觉
✨ 把握当下机遇

想了解更多专业解读？我常用 destinyteller.com 查看详细分析~

#今日运势 #{category} #命理 #占卜 #每日分享"""

        return title, subtitle, description

    def _create_markdown(self, title, subtitle, description, category):
        """创建Markdown内容（带YAML frontmatter）"""
        # 从icon_config获取推荐图标
        category_data = self.icon_config['categories'].get(category, {})
        icon_name = random.choice(category_data.get('primary_icons', ['sparkles']))

        frontmatter = f"""---
title: "{title}"
subtitle: "{subtitle}"
category: "{category}"
icon: "{icon_name}"
icon_system: "Lucide Icons"
generated_at: "{datetime.now().isoformat()}"
---

"""
        return frontmatter + description

    def _render_cover(self, html_file, output_file):
        """渲染封面HTML为PNG"""
        try:
            result = subprocess.run(
                ['node', str(PROJECT_ROOT / 'tools' / 'card' / 'render_cover.js'), str(html_file), str(output_file)],
                capture_output=True,
                text=True,
                check=True
            )
            print(f"  [OK] Cover rendered: {output_file.name}")
        except subprocess.CalledProcessError as e:
            print(f"  [ERROR] Cover render failed: {e}")
            print(f"  stderr: {e.stderr}")


def test_generator():
    """测试生成器"""
    generator = ContentGeneratorWithIcons()

    print("\n" + "="*60)
    print("Testing Content Generator with Lucide Icons")
    print("="*60)

    # 测试三个时段
    for time_slot in ['morning', 'midday', 'evening']:
        print(f"\n--- Testing {time_slot} ---")
        result = generator.generate_content(time_slot)
        print(f"[OK] Generated: {result['title']}")

    print("\n" + "="*60)
    print("[DONE] All test contents generated")
    print("Check: content/queue/")
    print("="*60)


if __name__ == '__main__':
    test_generator()
