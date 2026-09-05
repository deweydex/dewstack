---
name: triage-report
description: Work an issue opened through dewstack's own report doors (the footer's three-doors disclosure on every page) — decide what kind of thing it actually is, reproduce it, check for a duplicate, and either fix it, escalate it, or say why not. Use when asked to triage, work through, or clear the report inbox, when handed one such issue directly (including via an `@claude` mention), or when picking up an issue labelled `pattern`.
---

# Triaging a student report

An issue from the report doors has a fixed shape: `page` and `version`
always filled in, `kind` one of the issue template's three options, and
whatever the student actually typed under "What happened." This is the
procedure for turning that into either a merged fix, a redirected report,
or a clear reason nothing changes yet — never a silently closed issue.

Paired with the same skill in `deweydex/dewlab`; the two repos share the
report-doors design (`report_doors_links()`, `planning/feedback.yaml`) but
this file is dewstack's own, since dewstack's content, cell types, and
"what a fix looks like" differ from dewlab's.

## First: read before acting

1. **The issue itself, in full.**
2. **The page it names, at the version it names** —
   `tutorials/<module>/<slug>/<slug>.md`. A slug is a contract once a
   class has seen the page (`CLAUDE.md`) — never rename one as part of a
   fix, even a fix that also renames the page's title.
3. **Open issues carrying the same page** (search issues for the page
   string). Two open issues naming the same page are very likely the
   same thing — say so on the newer one and close it as a duplicate of
   the older, rather than fixing the same thing twice.

## Deciding the kind — the student's guess is a starting point, not a verdict

- **"A question, an idea, or something else" reaching you as an issue**
  (it should have gone to Discussions, but a hand-filed report or an old
  link can still land here) — answer briefly if the answer is short, or
  say you're moving it, then convert the issue to a discussion. This is
  not fixing code; do not open a PR for it.
- **"It gives an error"** — for a site-editor block (HTML/CSS/JS) or a SQL
  cell, this is usually the student's own edit doing something the page
  never claimed would work, or a genuine gap in what the page explained.
  [Troubleshooting](tutorials/reference/troubleshooting/troubleshooting.md)
  already covers the common shapes of "it does not work" for both cell
  types — check whether the report is one of those before assuming it is
  new.
- **"The page is wrong, or I could not follow it"** — a factual mistake
  (a wrong query result, a broken link, a stale reference to the old
  `sources/` material) or a plain-language problem. These need different
  tools: a factual fix is usually one line; a "could not follow it"
  report means running `PEDAGOGICAL_STYLE_GUIDE.md` §4's nine checks
  (from `deweydex/dewlab`, referenced in this repo's own `CLAUDE.md`)
  over the passage before touching it, not guessing at a rewrite.

## Fixing it

- One pull request per issue, mentioning the issue number.
- `PEDAGOGICAL_STYLE_GUIDE.md`'s plain-language rules govern the fix
  exactly as they would any other tutorial edit — a report does not
  relax them. Run `python3 tools/measure_sentences.py` over anything you
  rewrite if the sentence looks long.
- Never touch `site/` — it is rebuilt, not edited.
- Never move content out of `sources/` by deleting it — that material
  stays until the plan's ledger says its replacement has been in front
  of a class (`CLAUDE.md`'s second trap).

## What escalates instead of getting fixed on the spot

**A database or web-standards question** — whether an explanation is
*correct*, not just whether it is clear — is confirmed by Josh, not
decided by an agent working through the inbox.

**Anything bigger than the one page reported** — a pattern across
several tutorials, a change to `build.py` itself, a new module — is
bigger than this issue. Comment what you found and open it as its own
piece of work rather than expanding this PR to cover it.

**Nothing closes without a person having seen it.** A fix merged is not
the same as an issue closed — leave it open until whoever is running
triage has actually looked, unless you are that person and are looking
right now.

## Working a `pattern` issue

A `pattern` issue (opened by the weekly job in `.github/workflows/`)
gathers several reports rather than describing one directly. Read every
issue it links before deciding anything — whether a later fix already
covers some of them, whether they share a root cause, and whether the
right response is a wording fix or a bigger design change. Say which, on
the pattern issue itself, before doing the work.

## Two things never to do

Never mark a report resolved because it looks like a duplicate of
something already fixed — confirm the fix actually covers the reported
case first. Never disable the report doors themselves
(`planning/feedback.yaml`) as a way of handling a flood of reports —
that is Josh's call, not a triage step.
