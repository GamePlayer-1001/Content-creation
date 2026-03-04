"""
剪映草稿自动化分析工具

用于分析剪映草稿、提取模板、批量应用剪辑配置
"""

__version__ = "0.1.0"
__author__ = "Claude Code"

from .scanner import DraftScanner

__all__ = ["DraftScanner"]
