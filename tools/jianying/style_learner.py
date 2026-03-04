"""
剪辑风格学习器

从多个草稿中学习剪辑风格和技巧，提取可复用的剪辑模式
"""

import json
import os
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, asdict
from collections import Counter


@dataclass
class EditingPattern:
    """剪辑模式"""
    pattern_name: str
    description: str
    frequency: int  # 出现次数
    examples: List[str]  # 示例草稿
    parameters: Dict[str, Any]  # 参数


@dataclass
class EditingStyle:
    """剪辑风格"""
    style_name: str
    total_drafts_analyzed: int

    # 分辨率偏好
    common_resolutions: List[tuple]  # [(分辨率, 次数)]

    # AI 功能使用模式
    ai_features_usage: Dict[str, int]  # {功能名: 使用次数}

    # 项目时长分布
    avg_duration_seconds: float
    duration_range: tuple  # (最小, 最大)

    # 轨道使用模式
    avg_timeline_count: float
    media_count_per_draft: float

    # 识别的剪辑模式
    patterns: List[EditingPattern]

    # 推荐的工作流
    recommended_workflow: List[str]


class StyleLearner:
    """剪辑风格学习器"""

    def __init__(self, summary_file: str):
        """初始化

        Args:
            summary_file: scanner 生成的 draft_summary.json 文件
        """
        self.summary_file = Path(summary_file)

        if not self.summary_file.exists():
            raise FileNotFoundError(f"找不到摘要文件: {summary_file}")

        with open(self.summary_file, 'r', encoding='utf-8') as f:
            self.drafts = json.load(f)

        print(f"加载了 {len(self.drafts)} 个草稿的数据")

    def learn_style(self, style_name: str = "learned_style") -> EditingStyle:
        """学习剪辑风格"""
        print(f"\n=== 开始学习剪辑风格 ===\n")

        # 1. 分析分辨率偏好
        resolutions = self._analyze_resolutions()
        print(f"1. 分辨率偏好分析完成")

        # 2. 分析 AI 功能使用
        ai_usage = self._analyze_ai_features()
        print(f"2. AI功能使用分析完成")

        # 3. 分析项目时长
        duration_stats = self._analyze_duration()
        print(f"3. 项目时长分析完成")

        # 4. 分析轨道和媒体使用
        track_stats = self._analyze_tracks()
        print(f"4. 轨道和媒体分析完成")

        # 5. 识别剪辑模式
        patterns = self._identify_patterns()
        print(f"5. 识别到 {len(patterns)} 种剪辑模式")

        # 6. 生成推荐工作流
        workflow = self._generate_workflow(ai_usage, patterns)
        print(f"6. 生成推荐工作流")

        style = EditingStyle(
            style_name=style_name,
            total_drafts_analyzed=len(self.drafts),
            common_resolutions=resolutions,
            ai_features_usage=ai_usage,
            avg_duration_seconds=duration_stats['avg'],
            duration_range=duration_stats['range'],
            avg_timeline_count=track_stats['avg_timelines'],
            media_count_per_draft=track_stats['avg_media'],
            patterns=patterns,
            recommended_workflow=workflow
        )

        print(f"\n=== 风格学习完成 ===")
        return style

    def _analyze_resolutions(self) -> List[tuple]:
        """分析分辨率偏好"""
        resolutions = []
        for draft in self.drafts:
            res = draft.get('resolution', 0)
            if res > 0:
                resolutions.append(res)

        counter = Counter(resolutions)
        return counter.most_common(5)

    def _analyze_ai_features(self) -> Dict[str, int]:
        """分析 AI 功能使用频率"""
        ai_counter = Counter()

        for draft in self.drafts:
            features = draft.get('ai_features', [])
            for feature in features:
                ai_counter[feature] += 1

        return dict(ai_counter)

    def _analyze_duration(self) -> Dict[str, Any]:
        """分析项目时长"""
        durations = [
            draft.get('edit_duration_seconds', 0)
            for draft in self.drafts
            if draft.get('edit_duration_seconds', 0) > 0
        ]

        if not durations:
            return {'avg': 0, 'range': (0, 0)}

        return {
            'avg': sum(durations) / len(durations),
            'range': (min(durations), max(durations))
        }

    def _analyze_tracks(self) -> Dict[str, float]:
        """分析轨道和媒体使用"""
        timeline_counts = [
            draft.get('timeline_count', 0)
            for draft in self.drafts
        ]

        media_counts = [
            draft.get('media_count', 0)
            for draft in self.drafts
        ]

        return {
            'avg_timelines': sum(timeline_counts) / len(timeline_counts) if timeline_counts else 0,
            'avg_media': sum(media_counts) / len(media_counts) if media_counts else 0
        }

    def _identify_patterns(self) -> List[EditingPattern]:
        """识别剪辑模式"""
        patterns = []

        # 模式1: 数字人视频制作
        digital_human_drafts = [
            d['name'] for d in self.drafts
            if d.get('has_digital_human', False)
        ]

        if len(digital_human_drafts) >= 3:
            patterns.append(EditingPattern(
                pattern_name="数字人视频制作",
                description="使用数字人技术制作视频，通常包含AI配音",
                frequency=len(digital_human_drafts),
                examples=digital_human_drafts[:3],
                parameters={
                    "typical_resolution": "720p",
                    "uses_ai_voice": True,
                    "avg_timelines": 1.5
                }
            ))

        # 模式2: AIGC内容生成
        aigc_drafts = [
            d['name'] for d in self.drafts
            if d.get('has_aigc', False)
        ]

        if len(aigc_drafts) >= 2:
            patterns.append(EditingPattern(
                pattern_name="AIGC内容混合",
                description="结合AI生成的图像/视频素材",
                frequency=len(aigc_drafts),
                examples=aigc_drafts[:3],
                parameters={
                    "typical_features": ["AIGC", "数字人", "AI配音"],
                    "content_type": "mixed"
                }
            ))

        # 模式3: 多时间线复杂剪辑
        multi_timeline_drafts = [
            d['name'] for d in self.drafts
            if d.get('timeline_count', 0) >= 2
        ]

        if len(multi_timeline_drafts) >= 2:
            patterns.append(EditingPattern(
                pattern_name="多时间线复杂剪辑",
                description="使用多个时间线进行复杂的剪辑编排",
                frequency=len(multi_timeline_drafts),
                examples=multi_timeline_drafts[:3],
                parameters={
                    "timeline_count": "2+",
                    "complexity": "high"
                }
            ))

        # 模式4: 快速短视频（根据编辑时长判断）
        quick_edits = [
            d['name'] for d in self.drafts
            if 0 < d.get('edit_duration_seconds', 0) < 3600  # 小于1小时
        ]

        if len(quick_edits) >= 3:
            patterns.append(EditingPattern(
                pattern_name="快速短视频制作",
                description="编辑时长较短，适合快速产出",
                frequency=len(quick_edits),
                examples=quick_edits[:3],
                parameters={
                    "edit_time": "< 1 hour",
                    "production_speed": "fast"
                }
            ))

        return patterns

    def _generate_workflow(
        self,
        ai_usage: Dict[str, int],
        patterns: List[EditingPattern]
    ) -> List[str]:
        """生成推荐工作流"""
        workflow = []

        # 基础步骤
        workflow.append("1. 准备媒体素材（视频/音频/图片）")

        # 根据AI使用情况添加步骤
        if "数字人" in ai_usage:
            workflow.append("2. 使用数字人功能生成虚拟主播")

        if "AI配音" in ai_usage:
            workflow.append("3. 使用AI配音功能添加旁白")

        if "AIGC" in ai_usage:
            workflow.append("4. 使用AIGC生成辅助素材")

        # 根据模式添加步骤
        has_multi_timeline = any(p.pattern_name == "多时间线复杂剪辑" for p in patterns)
        if has_multi_timeline:
            workflow.append("5. 创建多个时间线进行复杂编排")
        else:
            workflow.append("5. 在单时间线上排列素材")

        # 通用步骤
        workflow.extend([
            "6. 添加转场和特效",
            "7. 调整音频音量和配乐",
            "8. 添加字幕和文本",
            "9. 预览和微调",
            "10. 导出视频"
        ])

        return workflow

    def export_style(self, output_file: str):
        """导出学习到的风格"""
        style = self.learn_style()

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(asdict(style), f, ensure_ascii=False, indent=2)

        print(f"\n风格已导出到: {output_file}")

    def print_report(self):
        """打印学习报告"""
        style = self.learn_style()

        print("\n" + "=" * 80)
        print(f"剪辑风格分析报告: {style.style_name}")
        print("=" * 80)

        print(f"\n【基本统计】")
        print(f"  分析草稿数: {style.total_drafts_analyzed}")
        print(f"  平均时间线数: {style.avg_timeline_count:.1f}")
        print(f"  平均媒体数: {style.media_count_per_draft:.1f}")
        print(f"  平均编辑时长: {style.avg_duration_seconds / 60:.1f} 分钟")

        print(f"\n【分辨率偏好】")
        for res, count in style.common_resolutions[:3]:
            print(f"  {res}p: {count} 个项目")

        print(f"\n【AI功能使用】")
        for feature, count in sorted(style.ai_features_usage.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / style.total_drafts_analyzed) * 100
            print(f"  {feature}: {count} 次 ({percentage:.1f}%)")

        print(f"\n【识别的剪辑模式】({len(style.patterns)} 种)")
        for i, pattern in enumerate(style.patterns, 1):
            print(f"\n  {i}. {pattern.pattern_name}")
            print(f"     描述: {pattern.description}")
            print(f"     出现次数: {pattern.frequency}")
            print(f"     示例: {', '.join(pattern.examples)}")

        print(f"\n【推荐工作流】")
        for step in style.recommended_workflow:
            print(f"  {step}")

        print("\n" + "=" * 80)


if __name__ == "__main__":
    # 测试代码
    summary_file = r"H:\Project\videocheck\draft_summary.json"

    if os.path.exists(summary_file):
        learner = StyleLearner(summary_file)

        # 打印学习报告
        learner.print_report()

        # 导出风格
        learner.export_style("learned_editing_style.json")
