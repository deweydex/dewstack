"""Measure the sentences of a markdown file against the plain-language bar.

The bar (CONSOLIDATION_PLAN.md, section 3; dewlab's CLAUDE.md) says no
sentence over twenty-five words and a mean under eighteen. This script
counts, and prints every sentence over the limit so it can be split. It
is a first pass, not a judge: it cannot see a missing verb, an idiom or a
metaphor doing a statement's job. Those still need reading.

Headings, code blocks, tables, link targets and web addresses are left
out of the count. Bulleted lists are counted, one item at a time.

    python3 tools/measure_sentences.py README.md tutorials/**/*.md
"""
import re
import sys
from pathlib import Path

LIMIT = 25


def sentences(text: str) -> list[str]:
    text = re.sub(r"^---\n.*?\n---\n", "", text, count=1, flags=re.S)   # frontmatter
    text = re.sub(r"```.*?```", "", text, flags=re.S)                    # code blocks
    text = re.sub(r"^\|.*$", "", text, flags=re.M)                       # tables
    text = re.sub(r"^#.*$", "", text, flags=re.M)                        # headings
    text = re.sub(r"<!--.*?-->", "", text, flags=re.S)                   # comments
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)                 # [text](url) -> text
    text = re.sub(r"<?https?://\S+>?", "URL", text)                      # bare addresses
    text = re.sub(r"`[^`]*`", "CODE", text)                              # inline code
    text = re.sub(r"^\s*(?:[-*]|\d+\.)\s+", "\n\n", text, flags=re.M)    # a list item is its own block
    out = []
    for block in re.split(r"\n\s*\n", text):
        block = " ".join(block.split())                                    # wrapped lines rejoin
        if not block:
            continue
        out.extend(s.strip() for s in re.split(r"(?<=[.!?])\s+", block) if s.strip())
    return out


def main(paths: list[str]) -> int:
    worst = 0
    for name in paths:
        sents = sentences(Path(name).read_text(encoding="utf-8"))
        if not sents:
            print(f"{name}: no sentences found")
            continue
        lengths = [len(s.split()) for s in sents]
        mean = sum(lengths) / len(lengths)
        over = [(n, s) for n, s in zip(lengths, sents) if n > LIMIT]
        print(f"{name}: {len(sents)} sentences, mean {mean:.1f} words, longest {max(lengths)}, over {LIMIT}: {len(over)}")
        for n, s in over:
            print(f"  {n:3d}  {s}")
        worst = max(worst, len(over))
    return 1 if worst else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:] or ["README.md"]))
