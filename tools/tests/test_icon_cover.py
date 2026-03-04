#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
测试使用 Lucide Icons 的新封面生成
"""
import json
import random
from pathlib import Path


def generate_icon_cover_html(title, subtitle, category, output_path):
    """
    生成带有精美图标的封面HTML

    Args:
        title: 标题
        subtitle: 副标题
        category: 内容类别（从icon_mapping.json中选择）
        output_path: 输出路径
    """

    # 读取图标映射配置
    icon_config_file = Path('automation/config/icon_mapping.json')
    with open(icon_config_file, 'r', encoding='utf-8') as f:
        icon_config = json.load(f)

    # 获取该类别的图标和配色
    if category in icon_config['categories']:
        category_data = icon_config['categories'][category]
        # 随机选择一个主图标
        icon_name = random.choice(category_data['primary_icons'])

        # 随机选择一个配色方案
        color_scheme_name = random.choice(list(icon_config['color_schemes'].keys()))
        color_scheme = icon_config['color_schemes'][color_scheme_name]
    else:
        # 默认配置
        icon_name = 'sparkles'
        color_scheme = icon_config['color_schemes']['purple_gradient']

    # 读取模板
    template_file = Path('assets/cover_with_icons.html')
    with open(template_file, 'r', encoding='utf-8') as f:
        template = f.read()

    # 替换占位符
    html_content = template.replace('{{ICON_NAME}}', icon_name)
    html_content = html_content.replace('{{TITLE}}', title)
    html_content = html_content.replace('{{SUBTITLE}}', subtitle)

    # 应用配色方案
    html_content = html_content.replace(
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color_scheme['background'],
        1  # 只替换第一个（背景）
    )

    html_content = html_content.replace(
        'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
        f'background: {color_scheme["icon_bg"]};'
    )

    html_content = html_content.replace(
        'background: linear-gradient(135deg, #111827 0%, #667eea 100%);',
        f'background: {color_scheme["text"]};'
    )

    html_content = html_content.replace(
        'color: #667eea;',
        f'color: {color_scheme["subtitle_color"]};'
    )

    html_content = html_content.replace(
        'stroke: #667eea;',
        f'stroke: {color_scheme["subtitle_color"]};'
    )

    # 保存
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    print(f"[OK] Generated: {output_path}")
    print(f"  Category: {category}")
    print(f"  Icon: {icon_name}")
    print(f"  Color: {color_scheme_name}")

    return output_path


def test_all_categories():
    """测试所有类别的封面生成"""

    icon_config_file = Path('automation/config/icon_mapping.json')
    with open(icon_config_file, 'r', encoding='utf-8') as f:
        icon_config = json.load(f)

    output_dir = Path('content/test_covers')
    output_dir.mkdir(parents=True, exist_ok=True)

    test_cases = [
        {
            'category': '运势占卜',
            'title': '今日运势',
            'subtitle': '准到离谱'
        },
        {
            'category': '塔罗牌',
            'title': '塔罗解读',
            'subtitle': '深度剖析'
        },
        {
            'category': '情感咨询',
            'title': '桃花运势',
            'subtitle': '脱单指南'
        },
        {
            'category': '事业财运',
            'title': '财运爆棚',
            'subtitle': '升职加薪'
        },
        {
            'category': '心灵成长',
            'title': '内心疗愈',
            'subtitle': '找回自己'
        },
        {
            'category': '水晶能量',
            'title': '水晶魔法',
            'subtitle': '能量觉醒'
        }
    ]

    print("\n" + "="*60)
    print("Testing Icon Cover Generation")
    print("="*60 + "\n")

    for i, test_case in enumerate(test_cases):
        output_path = output_dir / f'{i+1}_{test_case["category"]}_cover.html'
        generate_icon_cover_html(
            title=test_case['title'],
            subtitle=test_case['subtitle'],
            category=test_case['category'],
            output_path=output_path
        )
        print()

    print("="*60)
    print(f"[DONE] Generated {len(test_cases)} test covers")
    print(f"[INFO] Output directory: {output_dir}")
    print("="*60)
    print("\n[NEXT] Use Playwright to render these HTML files to PNG:")
    print(f"  node scripts/render_xhs_v2.js <html_file> -o {output_dir}")


def generate_single_cover():
    """生成单个封面示例"""

    output_dir = Path('content/drafts/test_publish')
    output_dir.mkdir(parents=True, exist_ok=True)

    output_path = output_dir / 'cover_with_icons.html'

    generate_icon_cover_html(
        title='今日运势来啦',
        subtitle='准到离谱',
        category='运势占卜',
        output_path=output_path
    )

    print("\n[INFO] To render to PNG:")
    print(f"  cd h:\\Project\\Auto-Redbook-Skills")
    print(f"  node scripts/render_xhs_v2.js {output_path} -o {output_dir}")


if __name__ == '__main__':
    # 生成单个示例
    generate_single_cover()

    print("\n" + "-"*60 + "\n")

    # 生成所有类别测试
    test_all_categories()
