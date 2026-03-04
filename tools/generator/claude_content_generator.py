"""
Claude 内容生成器（简化版本 - 直接生成）
使用当前 Claude 会话直接生成内容
"""
import re
import json
import random
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional


class ClaudeContentGenerator:
    """Claude 内容生成器"""

    def __init__(self):
        """初始化生成器"""
        # 加载配置 (tools/generator/ → 项目根/config/)
        self.config_dir = Path(__file__).parent.parent.parent / 'config'
        self.hashtags = self._load_hashtags()
        self.promotion_strategy = self._load_promotion_strategy()

    def _load_hashtags(self) -> Dict:
        """加载标签配置"""
        hashtags_file = self.config_dir / 'hashtags.json'
        with open(hashtags_file, 'r', encoding='utf-8') as f:
            return json.load(f)

    def _load_promotion_strategy(self) -> Dict:
        """加载推广策略配置"""
        strategy_file = self.config_dir / 'promotion_strategy.json'
        with open(strategy_file, 'r', encoding='utf-8') as f:
            return json.load(f)

    def generate_content(
        self,
        time_slot: str,
        trending_data: Optional[Dict] = None,
        theme: Optional[str] = None
    ) -> Dict[str, any]:
        """
        生成小红书内容

        由于使用当前 Claude 会话，此方法返回提示词和基本信息
        实际内容需要 Claude 根据提示词生成

        Args:
            time_slot: 时段 (morning/midday/evening)
            trending_data: 热点数据
            theme: 视觉主题

        Returns:
            包含 prompt, theme 等信息的字典
        """
        # 构建提示词
        prompt = self._build_prompt(time_slot, trending_data or {})

        # 选择主题
        if not theme:
            theme = self._select_theme(time_slot)

        # 返回生成任务信息
        return {
            'prompt': prompt,
            'time_slot': time_slot,
            'theme': theme,
            'trending_keywords': trending_data.get('keywords', []) if trending_data else []
        }

    def create_sample_content(self, time_slot: str, theme: str) -> str:
        """创建示例内容（用于测试）"""
        samples = {
            'morning': '''---
emoji: "🌟"
title: "今日运势来啦"
subtitle: "准到离谱"
---

# 💫 今日运势

## 白羊座

今天的白羊座运势4.5分！适合主动出击，把握机会。事业上会有贵人相助，感情方面也有不错的进展。

## 金牛座

今天的金牛座运势4分。财运不错，可以考虑小额投资。工作上保持稳定就好，不要冒进。

## 开运小贴士

✨ 幸运颜色：天蓝色
✨ 幸运数字：7
✨ 开运方位：东南方

---

💡 想了解更多专属运势？我平时在 destinyteller.com 上查看详细解读，姐妹们也可以试试~

#今日运势 #星座运程 #塔罗占卜 #每日运势 #命理''',

            'midday': '''---
emoji: "🔮"
title: "塔罗牌教学"
subtitle: "新手必看"
---

# 🔮 塔罗牌入门指南

## 什么是塔罗牌

塔罗牌是一种古老的占卜工具，由78张牌组成，分为大阿尔卡那和小阿尔卡那。每张牌都有独特的象征意义。

## 新手如何开始

1. **选择合适的牌组**：建议从经典的韦特塔罗开始
2. **学习牌意**：先掌握大阿尔卡那22张牌的基本含义
3. **每日一抽**：养成每天抽一张牌的习惯

## 常见误区

❌ 塔罗牌能预知未来
✅ 塔罗牌是心灵的镜子，帮助你看清当下

## 实践建议

初学者可以先从简单的单张牌开始，逐步过渡到三张牌、凯尔特十字牌阵。

---

💡 系统学习塔罗知识，可以看看 destinyteller.com 的教程，我觉得讲得很清晰~

#塔罗占卜 #塔罗牌 #命理学习 #占卜分享 #新手教学''',

            'evening': '''---
emoji: "🌙"
title: "梦境解析"
subtitle: "潜意识的秘密"
---

# 🌙 你的梦境在说什么

## 关于梦的故事

昨晚做了一个奇怪的梦，梦见自己在一片花海中奔跑。醒来后一直在想，这个梦想告诉我什么？

## 常见梦境解析

### 梦见飞翔
通常代表渴望自由，想要摆脱现实的束缚。

### 梦见水
水象征情感。清澈的水代表情绪稳定，浑浊的水可能意味着内心的困惑。

### 梦见追赶
可能是现实中的焦虑在梦中的投射，提醒你需要正视压力。

## 如何记录梦境

🌟 在床头放一本梦境日记
🌟 醒来立即记录，不要等
🌟 关注梦中的情绪和符号

---

💡 有姐妹在 destinyteller.com 上测了梦境解析，说很准，我也去试了试，确实有帮助~

#梦境解析 #心灵成长 #潜意识 #心理学 #命理分享 #塔罗占卜'''
        }

        return samples.get(time_slot, samples['morning'])

    def _build_prompt(self, time_slot: str, trending_data: Dict) -> str:
        """构建给 Claude 的提示词"""
        trending_keywords = trending_data.get('keywords', [])

        prompts = {
            'morning': f"""
请为 destinyteller.com 创作一篇小红书命理相关内容（早间发布）。

**要求**：
1. 主题类型：每日运势、星座/生肖运势、幸运提示、简短占卜、开运方法等轻松向内容
2. 内容长度：200-400字
3. 风格：轻松、正能量、易读
4. 当前热点：{', '.join(trending_keywords[:3]) if trending_keywords else '无'}
5. 推广要求：自然提及 destinyteller.com（如"我常用的测试平台"），不要生硬广告

**输出格式**（Markdown + YAML frontmatter）：请参考示例格式生成。
""",
            'midday': f"""
请为 destinyteller.com 创作一篇小红书命理相关内容（午间发布）。

**要求**：
1. 主题类型：塔罗牌解读、事业财运、命理知识科普、数字命理、八字紫微等专业向内容
2. 内容长度：500-800字
3. 风格：专业、有深度、干货向
4. 当前热点：{', '.join(trending_keywords[:3]) if trending_keywords else '无'}
5. 推广要求：作为学习资源推荐 destinyteller.com（如"系统学习可以看这个平台"）

**输出格式**：同早间格式
""",
            'evening': f"""
请为 destinyteller.com 创作一篇小红书命理相关内容（晚间发布）。

**要求**：
1. 主题类型：情感占卜、心灵疗愈、梦境解析、水晶能量、心灵成长故事等疗愈向内容
2. 内容长度：600-900字
3. 风格：温暖、共鸣、故事性强
4. 当前热点：{', '.join(trending_keywords[:3]) if trending_keywords else '无'}
5. 推广要求：通过用户故事自然引出 destinyteller.com（如"有个姐妹在这个网站测了很准"）

**输出格式**：同早间格式
"""
        }

        return prompts.get(time_slot, prompts['morning'])

    def parse_content(self, markdown: str) -> Dict[str, any]:
        """解析生成的 Markdown 内容"""
        # 提取 YAML frontmatter
        frontmatter_match = re.search(r'^---\n(.*?)\n---', markdown, re.DOTALL)

        title = "未命名"
        subtitle = ""

        if frontmatter_match:
            frontmatter = frontmatter_match.group(1)
            title_match = re.search(r'title:\s*"([^"]+)"', frontmatter)
            if title_match:
                title = title_match.group(1)

            subtitle_match = re.search(r'subtitle:\s*"([^"]+)"', frontmatter)
            if subtitle_match:
                subtitle = subtitle_match.group(1)

        # 提取标签
        hashtags = re.findall(r'#(\S+)', markdown)

        # 提取描述
        content_after_frontmatter = re.sub(r'^---\n.*?\n---\n', '', markdown, flags=re.DOTALL)
        description_match = re.search(r'\n\n(.+?)\n\n', content_after_frontmatter, re.DOTALL)
        description = description_match.group(1).strip() if description_match else title

        return {
            'title': title,
            'subtitle': subtitle,
            'description': description[:100],
            'hashtags': hashtags[:8] if hashtags else self._get_default_hashtags()
        }

    def _get_default_hashtags(self) -> List[str]:
        """获取默认标签"""
        all_tags = []
        for category_tags in self.hashtags['categories'].values():
            all_tags.extend(category_tags)

        num_tags = random.randint(5, 8)
        return random.sample(all_tags, min(num_tags, len(all_tags)))

    def _select_theme(self, time_slot: str) -> str:
        """根据时段选择视觉主题"""
        theme_map = {
            'morning': ['mint', 'sunset', 'xiaohongshu'],  # 清新明亮
            'midday': ['elegant', 'ocean', 'purple'],  # 专业稳重
            'evening': ['dark', 'sunset', 'purple']  # 温暖神秘
        }

        themes = theme_map.get(time_slot, ['purple'])
        return random.choice(themes)


if __name__ == '__main__':
    generator = ClaudeContentGenerator()
    print("内容生成器初始化成功")
