"""Put the course bar at the top of every tutorial and database page.

The bar is the one thing added to pages that are otherwise verbatim copies
of their sources: a thin strip with a link back to the course front page
and its stages, so that a student who lands on a lesson from a search
or a bookmark can find the rest of the course. It is inserted, never
edited into the page's own markup: right after <body>, or after the
skip-to-content link where a page has one, so keyboard users still meet
that link first.

Run it again after refreshing a copy from its source, or after changing
the bar itself: a page that already carries the bar gets the new one in
place of the old. Templates and examples
are skipped on purpose, because students copy those files to start their
own pages, and the bar must not travel with them.

    python3 tools/add_course_bar.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MARK = 'class="dewstack-bar"'

BAR = (
    '<nav class="dewstack-bar" aria-label="Course" style="background:#2d3748;color:#fff;'
    'font:15px/1.5 system-ui,-apple-system,\'Segoe UI\',Roboto,sans-serif;padding:8px 16px;'
    'display:flex;flex-wrap:wrap;gap:4px 20px;align-items:center;box-sizing:border-box">'
    '<a href="{p}index.html" style="color:#fff;font-weight:700;text-decoration:none">'
    'Web Authoring and Databases: course front page</a>'
    '<a href="{p}index.html#start" style="color:#fff">Begin</a>'
    '<a href="{p}index.html#web" style="color:#fff">Web tutorials</a>'
    '<a href="{p}index.html#data" style="color:#fff">Database tutorials</a>'
    '</nav>\n'
)

TARGETS = (
    sorted((ROOT / 'tutorials').glob('*.html')) +
    sorted((ROOT / 'tutorials' / 'lessons').glob('*.html')) +
    sorted((ROOT / 'tutorials' / 'github-guides').glob('*.html')) +
    [ROOT / 'databases' / 'playground' / 'index.html',
     ROOT / 'databases' / 'playground' / 'teacher.html']
)

SKIP_LINK = re.compile(r'\s*<a [^>]*class="skip-link"[^>]*>.*?</a>\s*', re.S)


def add_bar(page: Path) -> str:
    text = page.read_text()
    if MARK in text:
        # Replace a bar from an earlier run, so a change to the bar's links
        # reaches every page with one command.
        text = re.sub(r'<nav class="dewstack-bar".*?</nav>\n', '', text, count=1, flags=re.S)
        page.write_text(text)
    depth = len(page.relative_to(ROOT).parts) - 1
    bar = BAR.format(p='../' * depth)
    body = re.search(r'<body[^>]*>\n?', text)
    if not body:
        return 'no body'
    at = body.end()
    skip = SKIP_LINK.match(text, at)
    if skip:
        at = skip.end()
    page.write_text(text[:at] + bar + text[at:])
    return 'added'


if __name__ == '__main__':
    for page in TARGETS:
        print(f'{add_bar(page):8s} {page.relative_to(ROOT)}')
