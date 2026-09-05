#!/usr/bin/env python3
"""Download a trimmed, self-hosted Pyodide into assets/vendor/pyodide/.

Adapted from dewlab's dev/fetch_pyodide.py (DECISIONS_LOG.md-equivalent:
NEXT_STEPS.md step 7, question 5), trimmed further: dewstack's SQL cell
never runs arbitrary Python, so the default package list here is just
`sqlite3`, not dewlab's numpy/pandas/matplotlib/jedi baseline. That is
about 13 MB against dewlab's roughly 32 MB.

The default is the CDN in assets/sql-cell.js (matching dewlab's own
default). This script exists for the same reason dewlab's does: the
escape hatch if a school network turns out to block the CDN. Point a
page at the result with `window.DEWSTACK_PYODIDE_BASE =
"../assets/vendor/pyodide/"` before sql-cell.js runs.

    python3 tools/fetch_pyodide.py
"""

from __future__ import annotations

import argparse
import json
import shutil
import tarfile
import tempfile
import urllib.request
from pathlib import Path

PYODIDE_VERSION = "0.28.3"
RELEASE = (
    "https://github.com/pyodide/pyodide/releases/download/"
    "{v}/pyodide-{v}.tar.bz2"
)
BASELINE = ["sqlite3"]
CORE = [
    "pyodide.js",
    "pyodide.mjs",
    "pyodide.asm.js",
    "pyodide.asm.wasm",
    "python_stdlib.zip",
    "pyodide-lock.json",
]


def resolve(lock: dict, roots: list[str]) -> set[str]:
    """Every package needed to load `roots`, following Pyodide's own
    depends — see dewlab's dev/fetch_pyodide.py for the full explanation
    of this walk; unchanged here."""
    packages = lock["packages"]
    found: set[str] = set()
    pending = list(roots)
    while pending:
        name = pending.pop()
        if name in found or name not in packages:
            continue
        found.add(name)
        pending.extend(packages[name].get("depends", []))
    return found


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--version", default=PYODIDE_VERSION)
    parser.add_argument(
        "--packages", nargs="*", default=BASELINE,
        help="packages to keep, with their dependencies (default: sqlite3 alone)",
    )
    parser.add_argument(
        "--out", type=Path,
        default=Path(__file__).resolve().parent.parent / "assets" / "vendor" / "pyodide",
    )
    args = parser.parse_args()

    url = RELEASE.format(v=args.version)
    with tempfile.TemporaryDirectory() as tmp:
        tmp_path = Path(tmp)
        archive = tmp_path / "pyodide.tar.bz2"
        print(f"downloading {url}")
        urllib.request.urlretrieve(url, archive)  # noqa: S310 - fixed https URL

        print("extracting")
        with tarfile.open(archive) as tar:
            tar.extractall(tmp_path, filter="data")
        dist = tmp_path / "pyodide"

        lock = json.loads((dist / "pyodide-lock.json").read_text())
        wanted = resolve(lock, args.packages)

        if args.out.exists():
            shutil.rmtree(args.out)
        args.out.mkdir(parents=True)

        for name in CORE:
            shutil.copy2(dist / name, args.out / name)

        total = 0
        for name in sorted(wanted):
            wheel = lock["packages"][name]["file_name"]
            source = dist / wheel
            if source.exists():
                shutil.copy2(source, args.out / wheel)
                total += source.stat().st_size

    size = sum(f.stat().st_size for f in args.out.rglob("*") if f.is_file())
    print(
        f"{args.out}: {len(wanted)} packages "
        f"({total / 1e6:.1f} MB of wheels, {size / 1e6:.1f} MB total)"
    )


if __name__ == "__main__":
    main()
