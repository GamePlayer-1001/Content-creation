"""
剪映草稿深度解析器

使用 pyJianYingDraft 库解析草稿内容
"""

import sys
import os
import json
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional, Any

# 添加 vectcut-integration 到路径
VECTCUT_PATH = Path(__file__).parent.parent / "vectcut-integration"
if str(VECTCUT_PATH) not in sys.path:
    sys.path.insert(0, str(VECTCUT_PATH))

try:
    from pyJianYingDraft import Script_file, Draft_folder
    PYJIANYINGDRAFT_AVAILABLE = True
except ImportError:
    PYJIANYINGDRAFT_AVAILABLE = False
    print("警告: pyJianYingDraft 不可用，部分功能受限")


@dataclass
class TrackInfo:
    """轨道信息"""
    type: str  # 'video', 'audio', 'text', 'sticker', 'effect'
    segment_count: int
    duration_ms: int


@dataclass
class SegmentInfo:
    """片段信息"""
    type: str
    material_id: Optional[str]
    start_ms: int
    end_ms: int
    duration_ms: int
    extra_info: Dict[str, Any]


@dataclass
class DraftAnalysis:
    """草稿深度分析结果"""
    draft_name: str
    draft_path: str

    # 基本信息
    canvas_width: int
    canvas_height: int
    fps: int
    duration_ms: int

    # 轨道统计
    tracks: List[TrackInfo]
    track_count_by_type: Dict[str, int]

    # 素材统计
    video_count: int
    audio_count: int
    text_count: int
    sticker_count: int

    # 特效统计
    transition_count: int
    filter_count: int
    effect_count: int
    animation_count: int

    # AI 功能
    has_keyframe_animation: bool
    has_speed_change: bool
    has_chroma_key: bool

    # 详细片段信息
    segments: List[SegmentInfo]

    # 原始数据（可选）
    raw_materials: Optional[Dict] = None


class ConfigParser:
    """剪映草稿配置解析器"""

    def __init__(self, draft_path: str):
        self.draft_path = Path(draft_path)
        self.draft_name = self.draft_path.name

        if not PYJIANYINGDRAFT_AVAILABLE:
            raise RuntimeError("pyJianYingDraft 库不可用，无法解析草稿")

    def parse(self, include_raw=False) -> DraftAnalysis:
        """解析草稿内容"""
        print(f"解析草稿: {self.draft_name}")

        try:
            # 使用 pyJianYingDraft 加载草稿
            script = self._load_script()

            # 提取基本信息
            canvas_config = script.canvas_config

            # 分析轨道
            tracks = self._analyze_tracks(script)
            track_count_by_type = self._count_tracks_by_type(tracks)

            # 分析片段
            segments = self._analyze_segments(script)

            # 统计素材
            materials = script.materials

            # 统计特效
            effects_count = self._count_effects(materials)

            # 检测高级功能
            has_keyframe = self._has_keyframe_animation(script)
            has_speed = len(materials.speeds) > 0
            has_chroma = self._has_chroma_key(script)

            result = DraftAnalysis(
                draft_name=self.draft_name,
                draft_path=str(self.draft_path),
                canvas_width=canvas_config.get("width", 0),
                canvas_height=canvas_config.get("height", 0),
                fps=canvas_config.get("fps", 30),
                duration_ms=script.duration,
                tracks=tracks,
                track_count_by_type=track_count_by_type,
                video_count=len(materials.videos),
                audio_count=len(materials.audios),
                text_count=len(materials.texts),
                sticker_count=len(materials.stickers),
                transition_count=len(materials.transitions),
                filter_count=len(materials.filters),
                effect_count=len(materials.video_effects) + len(materials.audio_effects),
                animation_count=len(materials.animations),
                has_keyframe_animation=has_keyframe,
                has_speed_change=has_speed,
                has_chroma_key=has_chroma,
                segments=segments,
                raw_materials=materials.export_json() if include_raw else None
            )

            return result

        except Exception as e:
            print(f"  解析失败: {e}")
            raise

    def _load_script(self) -> 'Script_file':
        """加载草稿脚本"""
        # 尝试不同的草稿文件路径
        possible_paths = [
            self.draft_path / "draft_info.json",
            self.draft_path / "draft_content.json",
        ]

        for path in possible_paths:
            if path.exists():
                try:
                    return Script_file.load_template(str(path))
                except Exception:
                    continue

        raise FileNotFoundError(f"无法找到有效的草稿文件")

    def _analyze_tracks(self, script: 'Script_file') -> List[TrackInfo]:
        """分析轨道信息"""
        tracks = []

        for track in script.tracks:
            track_type = self._get_track_type(track)
            segment_count = len(track.segments)
            duration = self._calculate_track_duration(track)

            tracks.append(TrackInfo(
                type=track_type,
                segment_count=segment_count,
                duration_ms=duration
            ))

        return tracks

    def _get_track_type(self, track) -> str:
        """获取轨道类型"""
        track_type_map = {
            "video": "video",
            "audio": "audio",
            "sticker": "sticker",
            "effect": "effect",
            "filter": "filter",
        }

        if hasattr(track, 'type'):
            return track_type_map.get(track.type, "unknown")

        return "unknown"

    def _calculate_track_duration(self, track) -> int:
        """计算轨道时长（毫秒）"""
        if not track.segments:
            return 0

        max_end = 0
        for segment in track.segments:
            if hasattr(segment, 'target_timerange') and segment.target_timerange:
                end_time = segment.target_timerange.end
                max_end = max(max_end, end_time)

        return max_end

    def _count_tracks_by_type(self, tracks: List[TrackInfo]) -> Dict[str, int]:
        """按类型统计轨道数量"""
        count = {}
        for track in tracks:
            count[track.type] = count.get(track.type, 0) + 1
        return count

    def _analyze_segments(self, script: 'Script_file') -> List[SegmentInfo]:
        """分析片段信息"""
        segments = []

        for track in script.tracks:
            for segment in track.segments:
                seg_type = type(segment).__name__

                material_id = None
                if hasattr(segment, 'material_id'):
                    material_id = segment.material_id

                start_ms = 0
                end_ms = 0
                if hasattr(segment, 'target_timerange') and segment.target_timerange:
                    start_ms = segment.target_timerange.start
                    end_ms = segment.target_timerange.end

                extra_info = self._extract_segment_extras(segment)

                segments.append(SegmentInfo(
                    type=seg_type,
                    material_id=material_id,
                    start_ms=start_ms,
                    end_ms=end_ms,
                    duration_ms=end_ms - start_ms,
                    extra_info=extra_info
                ))

        return segments

    def _extract_segment_extras(self, segment) -> Dict[str, Any]:
        """提取片段额外信息"""
        extras = {}

        # 提取音量
        if hasattr(segment, 'volume'):
            extras['volume'] = segment.volume

        # 提取变速
        if hasattr(segment, 'speed'):
            extras['speed'] = segment.speed

        # 提取关键帧
        if hasattr(segment, 'common_keyframes'):
            extras['has_keyframes'] = True

        # 提取文本内容
        if hasattr(segment, 'content'):
            extras['text_content'] = segment.content

        return extras

    def _count_effects(self, materials) -> Dict[str, int]:
        """统计特效数量"""
        return {
            'transitions': len(materials.transitions),
            'filters': len(materials.filters),
            'video_effects': len(materials.video_effects),
            'audio_effects': len(materials.audio_effects),
            'animations': len(materials.animations)
        }

    def _has_keyframe_animation(self, script: 'Script_file') -> bool:
        """检测是否使用关键帧动画"""
        for track in script.tracks:
            for segment in track.segments:
                if hasattr(segment, 'common_keyframes') and segment.common_keyframes:
                    return True
        return False

    def _has_chroma_key(self, script: 'Script_file') -> bool:
        """检测是否使用色度键（绿幕）"""
        materials = script.materials
        return hasattr(materials, 'green_screens') and len(materials.green_screens) > 0

    def export_analysis(self, output_file: str):
        """导出分析结果"""
        analysis = self.parse(include_raw=False)

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(asdict(analysis), f, ensure_ascii=False, indent=2)

        print(f"分析结果已导出到: {output_file}")


def batch_analyze(drafts_directory: str, output_dir: str):
    """批量分析多个草稿"""
    drafts_path = Path(drafts_directory)
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)

    print(f"批量分析目录: {drafts_directory}\n")

    results = []

    for draft_dir in drafts_path.iterdir():
        if not draft_dir.is_dir():
            continue

        # 跳过系统目录
        if draft_dir.name.startswith('.') or draft_dir.name == '整合':
            continue

        try:
            parser = ConfigParser(str(draft_dir))
            analysis = parser.parse(include_raw=False)
            results.append(asdict(analysis))

            # 导出单个分析
            output_file = output_path / f"{draft_dir.name}_analysis.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(asdict(analysis), f, ensure_ascii=False, indent=2)

            print(f"  ✓ {draft_dir.name}")

        except Exception as e:
            print(f"  ✗ {draft_dir.name}: {e}")

    # 导出汇总
    summary_file = output_path / "analysis_summary.json"
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n批量分析完成，共分析 {len(results)} 个草稿")
    print(f"汇总结果: {summary_file}")


if __name__ == "__main__":
    # 测试单个草稿解析
    if PYJIANYINGDRAFT_AVAILABLE:
        test_draft = r"H:\video\JianyingPro Drafts\001"
        if os.path.exists(test_draft):
            parser = ConfigParser(test_draft)
            analysis = parser.parse(include_raw=True)

            print("\n=== 草稿分析结果 ===")
            print(f"名称: {analysis.draft_name}")
            print(f"分辨率: {analysis.canvas_width}x{analysis.canvas_height}")
            print(f"时长: {analysis.duration_ms / 1000:.2f}s")
            print(f"轨道: {analysis.track_count_by_type}")
            print(f"素材: 视频{analysis.video_count} 音频{analysis.audio_count} 文字{analysis.text_count}")
            print(f"特效: 转场{analysis.transition_count} 滤镜{analysis.filter_count}")
            print(f"关键帧动画: {analysis.has_keyframe_animation}")
