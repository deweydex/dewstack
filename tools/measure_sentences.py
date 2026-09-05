"""Show the longest sentences in a markdown file, as candidates for the
plain-language trim test (dewlab's PEDAGOGICAL_STYLE_GUIDE.md, section 4:
read a sentence back, then try a shorter version. If it still says the
same thing, the words that vanished were never necessary).

This is not a pass/fail gate. There is no fixed word count a sentence has
to stay under; a list of four things may run long because the reader is
counting, and a short sentence can still hide a clause that does not
survive the trim. What this script gives you is the sentences most worth
reading back out loud, in each file, so the trim test lands on the ones
it actually matters for.

Headings, code blocks, tables, link targets and web addresses are left
out of the count. Bulleted lists are counted, one item at a time.

    python3 tools/measure_sentences.py README.md tutorials/**/*.md
"""
import re
import sys
from pathlib import Path

SHOW = 3  # the longest sentences worth reading back, per file


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
    for name in paths:
        sents = sentences(Path(name).read_text(encoding="utf-8"))
        if not sents:
            print(f"{name}: no sentences found")
            continue
        lengths = [len(s.split()) for s in sents]
        mean = sum(lengths) / len(lengths)
        print(f"{name}: {len(sents)} sentences, mean {mean:.1f} words, longest {max(lengths)}")
        ranked = sorted(zip(lengths, sents), key=lambda pair: -pair[0])[:SHOW]
        for n, s in ranked:
            print(f"  {n:3d}  {s}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:] or ["README.md"]))
