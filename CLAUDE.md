# dewstack

The home of the web authoring and databases course. The site's front page
is written for the student, from `tutorials/front.md` and the module list;
the README is the longer map for people who read the repository. The two
are different texts on purpose. `build.py` turns `tutorials/**/*.md` into
`site/`, which GitHub Pages serves. There is no backend and no database
behind the site.

`sources/` holds verbatim copies of the two older sites, `WADB_Tutorials`
in `sources/wadb/` and `HTML-CSS-SQL-JS` in `sources/playground/`. They
are coverage material for the rewrites, not part of the build, and the
README links to the originals rather than to them.

`planning/NEXT_STEPS.md` is where a session starts: where things stand,
the order of work, and the open questions. `planning/CONSOLIDATION_PLAN.md`
says where the content is coming from, in what order, and what "done"
means for each step. Read both before moving anything, and update the
plan's ledger when you finish a piece.

## Running things

```bash
pip install -r requirements-build.txt   # first time only
python3 build.py --clean                # writes site/ from scratch
python3 -m pytest                       # the build's checks
python3 tools/measure_sentences.py README.md tutorials/**/*.md   # longest sentences, for the trim test
```

`site/` is gitignored and rebuilt every time. Never edit it. If you
change anything under `vendor-src/`, rebuild `assets/vendor/` with
`npm ci && npm run build` in `vendor-src/` and commit the result, or CI
fails. Only the workspace page loads that bundle.

## Before you write a word a student will read

The rules are dewlab's, in `planning/PEDAGOGICAL_STYLE_GUIDE.md` of
`deweydex/dewlab`, section 4 and its "Plain language" and "Vocabulary"
subsections. Section 3 of the plan here lists the plain-language checks. Run
them over the README, every tutorial, and every string in `build.py` that ends
up on a page.

The short version: every sentence has a verb, every clause earns its
place (read it back, try a shorter version — if it still says the same
thing, the clause was never necessary), the meaning comes before any
dash, say what a thing is before what it is not, mark sequences, no
metaphor in place of a plain statement, no idiom from any dialect and no
rare word where a common one works, hedge what is not a binary. "We" for
the learning, "you" for what is the student's own. No emoji.

## Two traps

**A slug is a contract once a class has seen the page.** It is the page's
address and the key any saved work will live under. Change the title
freely; leave the slug alone.

**Nothing moves from a source repository by deletion.** Content is copied
here and improved here. The source stays until the plan's ledger says its
replacement has been in front of a class.
