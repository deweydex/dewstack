# dewadaba

The home of the web authoring and databases course. The README is the
course map and is what a student sees first. `build.py` turns
`tutorials/**/*.md` into `site/`, which GitHub Pages serves. There is no
backend and no database behind the site.

`planning/CONSOLIDATION_PLAN.md` says where the content is coming from,
in what order, and what "done" means for each step. Read it before moving
anything, and update its ledger when you finish a piece.

## Running things

```bash
pip install -r requirements-build.txt   # first time only
python3 build.py --clean                # writes site/ from scratch
python3 -m pytest                       # the build's checks
```

`site/` is gitignored and rebuilt every time. Never edit it.

## Before you write a word a student will read

The rules are dewlab's, in `planning/PEDAGOGICAL_STYLE_GUIDE.md` of
`deweydex/dewlab`, section 4 and its "Plain language" subsection. Section
3 of the plan here lists the eight checks. Run them over the README, every
tutorial, and every string in `build.py` that ends up on a page.

The short version: every sentence has a verb, none is over twenty-five
words, the meaning comes before any dash, say what a thing is before what
it is not, mark sequences, no metaphor in place of a plain statement, no
Irish or British idiom, hedge what is not a binary. "We" for the learning,
"you" for what is the student's own. No emoji.

## Two traps

**A slug is a contract once a class has seen the page.** It is the page's
address and the key any saved work will live under. Change the title
freely; leave the slug alone.

**Nothing moves from a source repository by deletion.** Content is copied
here and improved here. The source stays until the plan's ledger says its
replacement has been in front of a class.
