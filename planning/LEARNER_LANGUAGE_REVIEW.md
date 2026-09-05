# Learner language review

## Purpose

This review applies dewlab's pedagogical style guide to dewstack's
student-facing prose: the entry pages, the FAQ, troubleshooting, the
README, and the student guide. The goal is text that is clear for adults
reading at about B1 English level, using invitational language ("we"
for learning, "you" for the reader's own things), accurate technical
claims, and concrete routes to help.

The [pedagogical style guide](https://github.com/deweydex/dewlab/blob/main/planning/PEDAGOGICAL_STYLE_GUIDE.md)
provides the writing principles. This review adds a framework of
questions a learner may have on each page. B1 is the intended audience,
not a rating established by a readability score.

## Questions for each page

| Learner's question | What the page needs |
|---|---|
| Why might I want to learn this? | A concrete purpose or example. |
| Where can I begin? | A starting point and an explanation of any setup or earlier knowledge needed. |
| What does this mean? | Familiar words, connected sentences, and technical terms explained where they appear. |
| What could I try? | A specific invitation with enough information to act. |
| What might happen? | An expected result and a way to notice a change. |
| What can help if I get stuck? | A hint, worked example, earlier explanation, or person to ask. |
| Can I pause or choose another way? | Space to return, repeat, read an answer, or take a break. |
| What happens to my work? | Accurate saving, reset, sharing, and assessment information. |

Short button labels can stay direct. Learning activities invite the
reader to try something and say what they can look for. "You can" is
useful, but repeating it in every sentence is not the goal.

## First batch: entry pages and learner help

Prepared 2026-09-05, merging PR #39's tone review with the existing
text's diagnostic specificity. The merge keeps the PR's invitational
voice, accurate saving information, and question-based framing, and
keeps the existing text's diagnostic code examples, flat claims on
genuine binaries, DOCTYPE check, and "costs nothing" reassurance.

| Page | What changed |
|---|---|
| `tutorials/front.md` | Invitational door text, "we" voice in the orientation bullets, concrete help route in the closing reassurance. |
| `README.md` | Clearer course introduction, separate account requirements for web and data tracks, accurate saving guidance, fixed front-page source (was incorrectly described as the README; is `tutorials/front.md`), cleaner resource descriptions. |
| `docs/FOR_STUDENTS.md` | First-use help before details; hints and answers as choices; explicit Run, Load, Download, and Reset behaviour verified against the runtime. |
| `how-the-pieces-fit.md` | Separate routes for web and data, plain definitions of the website tools, current code-box guidance (runnable boxes exist, not planned for later). |
| `faq.md` | New saving and Reset questions, invitational tone, restored "costs nothing" and "yours, not the college's", accurate saving information. |
| `troubleshooting.md` | Question-based framing alongside restored diagnostic code comparisons, DOCTYPE check, flat claims on binaries, new "My SQL work is missing" section, tutorial links throughout, concrete routes to help. |

Runtime facts were checked in `assets/sql-cell.js`, `assets/sql_tools.py`,
`assets/site-editor.js`, `assets/settings.js`, and `assets/search.js`:

- Persisted SQL cells save text on Run and Load, not on typing. Restore
  loads that text and runs it again.
- Reset clears the named SQL database, output, and persisted text.
- SQL Download writes the current text. Load replaces the box's text.
- Ordinary SQL cells and the website preview editors do not persist edits.
- Settings apply immediately and use browser storage.
- Search uses indexed fields rather than the full tutorial text.

Tutorial slugs, cell identifiers, reading order, and runtime code stay
the same. Tutorial version fields stay the same because the changes are
prose and static examples, not runnable cells or saved-work identities.

## Further batches

1. Review the remaining getting-started tutorials in teaching order.
2. Review the first website and data tutorials, including activities,
   hints, answers, and the transitions between pages.
3. Continue through later tutorials and practice pages in small batches.
4. Review glossary definitions, navigation, and generated interface text.
5. Review teacher and contributor documentation for explicit prerequisites
   and clear procedures.
6. Invite learners to use the drafts. Useful prompts include "Where would
   you begin?" and "What could you do if this did not work?"

For each batch, record the current passage, the difficulty, the proposed
wording, and factual checks. Review the rendered pages as well as the
source.
