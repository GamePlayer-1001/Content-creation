"""
[INPUT]: 依赖同目录 parser scanner style_learner template 模块
[OUTPUT]: 导出剪映自动化包标记
[POS]: tools/jianying 包入口
[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
"""

"""
剪映草稿自动化分析工具

用于分析剪映草稿、提取模板、批量应用剪辑配置
"""

__version__ = "0.1.0"
__author__ = "Claude Code"

from .scanner import DraftScanner

__all__ = ["DraftScanner"]
