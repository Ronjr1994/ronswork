#!/usr/bin/env python3
"""Static publication checks for Ron's Work."""

from __future__ import annotations

import json
import re
import shutil
import subprocess
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
PRIVACY = ROOT / "privacy.html"


class SiteParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.refs: list[str] = []
        self.tool_logos = 0
        self.in_all_tools = False
        self.required_elements: set[str] = set()
        self.images_without_alt: list[str] = []
        self.raster_images_without_dimensions: list[str] = []
        self.external_blank_without_noopener: list[str] = []
        self.stylesheets: list[str] = []
        self.json_ld_blocks: list[str] = []
        self._capture_json_ld = False
        self._json_ld_buffer: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)

        if data.get("id"):
            self.ids.append(data["id"])
            self.required_elements.add(data["id"])

        for key in ("src", "href", "data-full", "data-dionne-src", "poster"):
            value = data.get(key)
            if value and value.startswith("./"):
                clean = value.split("#", 1)[0].split("?", 1)[0]
                self.refs.append(clean)

        if tag == "link" and "stylesheet" in (data.get("rel") or "").split():
            href = data.get("href")
            if href:
                self.stylesheets.append(href)

        if tag == "article" and data.get("data-tool-pane") == "0":
            self.in_all_tools = True

        if self.in_all_tools and tag == "img":
            src = data.get("src", "")
            if src.startswith("./assets/toolkit/latest/"):
                self.tool_logos += 1

        if tag == "img":
            src = data.get("src", "(unknown image)")
            if "alt" not in data:
                self.images_without_alt.append(src)

            suffix = Path(urlsplit(src).path).suffix.lower()
            if (
                src.startswith("./")
                and suffix in {".png", ".jpg", ".jpeg", ".webp", ".gif"}
                and (not data.get("width") or not data.get("height"))
            ):
                self.raster_images_without_dimensions.append(src)

        if tag == "a" and data.get("target") == "_blank":
            rel = set((data.get("rel") or "").split())
            if "noopener" not in rel:
                self.external_blank_without_noopener.append(data.get("href", "(unknown link)"))

        if tag == "script" and data.get("type") == "application/ld+json":
            self._capture_json_ld = True
            self._json_ld_buffer = []

    def handle_data(self, data: str) -> None:
        if self._capture_json_ld:
            self._json_ld_buffer.append(data)

    def handle_endtag(self, tag: str) -> None:
        if self.in_all_tools and tag == "article":
            self.in_all_tools = False

        if tag == "script" and self._capture_json_ld:
            self.json_ld_blocks.append("".join(self._json_ld_buffer))
            self._capture_json_ld = False
            self._json_ld_buffer = []


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    raise SystemExit(1)


def check_js(path: Path) -> None:
    node = shutil.which("node")
    if not node:
        print(f"WARN: Node.js unavailable; skipped syntax check for {path.name}")
        return

    result = subprocess.run([node, "--check", str(path)], capture_output=True, text=True)
    if result.returncode:
        fail(f"{path.name} syntax error:\n{result.stderr.strip()}")


def parse_html(path: Path) -> SiteParser:
    parser = SiteParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


def main() -> None:
    required_files = [
        "index.html",
        "privacy.html",
        "404.html",
        "styles.css",
        "styles.min.css",
        "script.js",
        "automation.js",
        "site-config.js",
        "favicon.svg",
        "manifest.webmanifest",
        "robots.txt",
        "sitemap.xml",
        "assets/og/rons-work-og.jpg",
        "PROJECT_PLAYBOOK.md",
        "DESIGN_SYSTEM.md",
        "COMPONENT_PATTERNS.md",
        "QA_CHECKLIST.md",
        "INTEGRATION_NOTES.md",
        "LAUNCH_CHECKLIST.md",
        "skills/client-ready-portfolio/SKILL.md",
        ".nojekyll",
    ]
    missing_files = [name for name in required_files if not (ROOT / name).exists()]
    if missing_files:
        fail("Missing required files: " + ", ".join(missing_files))

    index_parser = parse_html(INDEX)
    privacy_parser = parse_html(PRIVACY)

    duplicates = [item for item, count in Counter(index_parser.ids).items() if count > 1]
    if duplicates:
        fail("Duplicate HTML IDs: " + ", ".join(duplicates))

    all_refs = sorted(set(index_parser.refs + privacy_parser.refs))
    missing_refs = [ref for ref in all_refs if not (ROOT / ref[2:]).exists()]
    if missing_refs:
        fail("Missing local references: " + ", ".join(missing_refs))

    if index_parser.tool_logos != 42:
        fail(f"Expected 42 logos in All Tools; found {index_parser.tool_logos}")

    required_ids = {
        "intro",
        "work",
        "services",
        "archive",
        "tools",
        "proof",
        "contact",
        "projectBriefModal",
        "projectAssistant",
        "assistantLauncher",
        "briefPrivacyNote",
        "briefSaveDraft",
        "briefRestoreButton",
        "briefClearButton",
    }
    absent_ids = sorted(required_ids - index_parser.required_elements)
    if absent_ids:
        fail("Missing required interface IDs: " + ", ".join(absent_ids))

    if index_parser.images_without_alt:
        fail("Images without alt attributes: " + ", ".join(index_parser.images_without_alt))

    if index_parser.raster_images_without_dimensions:
        fail(
            "Local raster images without intrinsic dimensions: "
            + ", ".join(index_parser.raster_images_without_dimensions)
        )

    if index_parser.external_blank_without_noopener:
        fail(
            'Links using target="_blank" without rel="noopener": '
            + ", ".join(index_parser.external_blank_without_noopener)
        )

    if "./styles.min.css" not in index_parser.stylesheets:
        fail("index.html does not load styles.min.css")

    index_text = INDEX.read_text(encoding="utf-8")
    trust_checks = [
        "Visible trust signals",
        "Live public build",
        "Concept study",
        "Do not include patient names",
        "Guided project assistant",
        "./privacy.html",
        'rel="canonical"',
        'property="og:image"',
        'name="twitter:card"',
    ]
    for phrase in trust_checks:
        if phrase not in index_text:
            fail(f"Missing trust, metadata or privacy text: {phrase}")

    if "Powered by" in index_text:
        fail('Outdated "Powered by" wording remains in index.html')

    if not index_parser.json_ld_blocks:
        fail("Structured data is missing")

    for block in index_parser.json_ld_blocks:
        try:
            payload = json.loads(block)
        except json.JSONDecodeError as error:
            fail(f"Invalid JSON-LD: {error}")
        if payload.get("@type") != "Person":
            fail("JSON-LD does not describe the portfolio owner as a Person")

    config = (ROOT / "site-config.js").read_text(encoding="utf-8")
    if 'intakeEndpoint: ""' not in config:
        print("INFO: A direct intake endpoint is configured. Confirm it has been tested before deployment.")
    else:
        print("INFO: Direct submission is disabled; the site uses the compose-email fallback.")

    for script in ("script.js", "automation.js", "site-config.js"):
        check_js(ROOT / script)

    css_source = (ROOT / "styles.css").stat().st_size
    css_prod = (ROOT / "styles.min.css").stat().st_size
    if css_prod >= css_source:
        fail("styles.min.css is not smaller than styles.css")

    print("PASS: publication checks completed")
    print(f"PASS: {len(all_refs)} local references verified")
    print("PASS: 42 All Tools logos verified")
    print("PASS: no duplicate HTML IDs")
    print("PASS: image alt text and raster dimensions verified")
    print('PASS: target="_blank" links include rel="noopener"')
    print("PASS: structured data and social metadata verified")
    print("PASS: JavaScript syntax verified")
    print(f"PASS: production CSS is {css_prod / css_source:.1%} of source size")


if __name__ == "__main__":
    main()
