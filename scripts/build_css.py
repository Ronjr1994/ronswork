#!/usr/bin/env python3
"""Conservatively minify the Ron's Work production stylesheet."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "styles.css"
OUTPUT = ROOT / "styles.min.css"


def minify_css(source: str) -> str:
    result: list[str] = []
    index = 0
    length = len(source)
    quote: str | None = None
    escaped = False
    pending_space = False

    while index < length:
        char = source[index]
        next_char = source[index + 1] if index + 1 < length else ""

        if quote:
            result.append(char)
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == quote:
                quote = None
            index += 1
            continue

        if char in {'"', "'"}:
            if pending_space and result and result[-1] not in "{(:,;>~":
                result.append(" ")
            pending_space = False
            quote = char
            result.append(char)
            index += 1
            continue

        if char == "/" and next_char == "*":
            index += 2
            while index + 1 < length and not (source[index] == "*" and source[index + 1] == "/"):
                index += 1
            index += 2
            pending_space = True
            continue

        if char.isspace():
            pending_space = True
            index += 1
            continue

        if char in "{}:;,>~":
            while result and result[-1] == " ":
                result.pop()
            if char == "}" and result and result[-1] == ";":
                result.pop()
            result.append(char)
            pending_space = False
            index += 1
            continue

        if pending_space:
            if result and result[-1] not in "{(:,;>~":
                result.append(" ")
            pending_space = False

        result.append(char)
        index += 1

    return "".join(result).strip()


def main() -> None:
    source = SOURCE.read_text(encoding="utf-8")
    output = minify_css(source)
    OUTPUT.write_text(output + "\n", encoding="utf-8")

    source_size = SOURCE.stat().st_size
    output_size = OUTPUT.stat().st_size
    reduction = 100 - (output_size / source_size * 100)

    print(f"Built {OUTPUT.name}")
    print(f"Source: {source_size:,} bytes")
    print(f"Production: {output_size:,} bytes")
    print(f"Reduction: {reduction:.1f}%")


if __name__ == "__main__":
    main()
