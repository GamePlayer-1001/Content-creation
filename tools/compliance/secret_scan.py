#!/usr/bin/env python3
"""
[INPUT]: ?? git diff ??????????
[OUTPUT]: ???????? CLI
[POS]: tools/compliance ??????
[PROTOCOL]: ????????????? CLAUDE.md
"""
from __future__ import annotations
import argparse
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TEXT_EXTS = {
    '.js', '.mjs', '.cjs', '.ts', '.tsx', '.json', '.yaml', '.yml', '.md', '.txt', '.py', '.sh', '.bat', '.env'
}
EXCLUDE_DIRS = {'.git', 'node_modules', '__pycache__', 'output', 'web hot', '排除'}
PATTERNS = {
    'google_api_key': re.compile(r'AIza[0-9A-Za-z\-_]{20,}'),
    'openrouter_key': re.compile(r'sk-or-v1-[A-Za-z0-9]{20,}'),
    'generic_sk_key': re.compile(r'sk-[A-Za-z0-9\-_]{20,}'),
    'sensitive_env_assignment': re.compile(r'\b(?:OPENAI_API_KEY|OPENROUTER_API_KEY|DEEPSEEK_API_KEY|GEMINI_API_KEY|GOOGLE_AI_KEY|GOOGLE_GENAI_API_KEY|XHS_COOKIE|ACCESS_TOKEN|REFRESH_TOKEN|AUTH_TOKEN|SECRET_KEY|PASSWORD)\b\s*[:=]\s*[^\s#\"\']+', re.I),
}


def is_text_candidate(path: Path) -> bool:
    if path.name.startswith('.env'):
        return True
    return path.suffix.lower() in TEXT_EXTS


def mask(text: str) -> str:
    text = re.sub(r'AIza[0-9A-Za-z\-_]{20,}', 'AIza***MASKED***', text)
    text = re.sub(r'sk-or-v1-[A-Za-z0-9]{20,}', 'sk-or-v1-***MASKED***', text)
    text = re.sub(r'sk-[A-Za-z0-9\-_]{20,}', 'sk-***MASKED***', text)
    text = re.sub(r'((?:API|KEY|TOKEN|SECRET|PASSWORD)[A-Z0-9_\-]*\s*[:=]\s*)([^\s#\"\']+)', r'\1***MASKED***', text, flags=re.I)
    return text


PLACEHOLDER_MARKERS = (
    'your_cookie_string_here',
    'your_key_here',
    'your_api_key_here',
    'example',
    'placeholder',
)


def scan_text(label: str, text: str):
    hits = []
    for i, line in enumerate(text.splitlines(), 1):
        lowered = line.lower()
        if any(m in lowered for m in PLACEHOLDER_MARKERS):
            continue
        if any(p.search(line) for p in PATTERNS.values()):
            hits.append(f'{label}:{i}:{mask(line)[:240]}')
    return hits


def scan_worktree():
    out = []
    for dp, dns, fns in os.walk(ROOT):
        dns[:] = [d for d in dns if d not in EXCLUDE_DIRS]
        for fn in fns:
            path = Path(dp) / fn
            if not is_text_candidate(path):
                continue
            try:
                text = path.read_text(encoding='utf-8', errors='ignore')
            except Exception:
                continue
            out.extend(scan_text(str(path.relative_to(ROOT)), text))
    return out


def git_show(obj: str) -> str:
    return subprocess.check_output(['git', 'show', obj], cwd=ROOT, text=True, stderr=subprocess.DEVNULL)


def scan_git_history(limit_revs: int | None = None):
    revs = subprocess.check_output(['git', 'rev-list', '--all'], cwd=ROOT, text=True).splitlines()
    if limit_revs:
        revs = revs[:limit_revs]
    tracked = subprocess.check_output(['git', 'ls-files'], cwd=ROOT, text=True).splitlines()
    out = []
    for rel in tracked:
        if not is_text_candidate(Path(rel)):
            continue
        for rev in revs:
            obj = f'{rev}:{rel}'
            try:
                text = git_show(obj)
            except Exception:
                continue
            hits = scan_text(f'{rev[:12]}:{rel}', text)
            if hits:
                out.extend(hits)
                break
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--git', action='store_true', help='扫描 git 历史')
    ap.add_argument('--limit-revs', type=int, default=None, help='仅扫描前 N 个 revision（历史模式）')
    args = ap.parse_args()

    hits = scan_git_history(args.limit_revs) if args.git else scan_worktree()
    if hits:
        print('\n'.join(hits))
        sys.exit(2)
    print('OK: no obvious secrets found')


if __name__ == '__main__':
    main()
