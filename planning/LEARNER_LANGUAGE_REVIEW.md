# Learner language review

## Purpose

This review aims to make dewstack clear for adults reading at about B1
English level. It treats learning as a process of trying, noticing,
asking, and returning. Invitations need concrete actions. Reassurance
needs a useful route to help.

The existing [pedagogical style guide](https://github.com/deweydex/dewlab/blob/main/planning/PEDAGOGICAL_STYLE_GUIDE.md)
provides the writing principles. This review adds a way to apply them
through questions a learner may have. B1 is the intended audience, not a
rating established by a readability score.

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

We use common words and explicit steps without removing necessary
technical ideas. Short button labels can stay direct. Learning activities
invite the reader to try something and say what they can look for.
"You can" is useful, but repeating it in every sentence is not the goal.

## First batch: entry pages and learner help

Prepared 2026-09-05 for upstream review. This is one coordinated batch
because the entry pages previously gave conflicting setup and saving
information. It does not claim that all tutorials have been reviewed.

| Page | Difficulty found | Change |
|---|---|---|
| `tutorials/front.md` | Commands, broad reassurance, and unclear account and saving claims. | Two invitations, concrete help, separate account requirements, and a brief saving explanation. |
| `README.md` | Course setup mixed with internal planning terms; it still called itself the built front page. | Clearer course introduction, simpler resource descriptions, accurate saving guidance, and the actual front-page source. |
| `docs/FOR_STUDENTS.md` | Dense feature explanations and outdated SQL saving instructions. | First-use help before details; hints and answers as choices; explicit Run, Load, Download, and Reset behaviour. |
| `how-the-pieces-fit.md` | The data path appeared to need GitHub; runnable examples were described as future work. | Separate routes, plain definitions of the website tools, and current code-box guidance. |
| `faq.md` | Promises about recovery time, commands, and conflicting saving claims. | Flexible routes back into learning and consistent account, assessment, and saving answers. |
| `troubleshooting.md` | Commands and overly certain diagnoses, including incorrect HTML and CSS claims. | Questions and examples, qualified explanations, and concrete routes to help. |

Runtime facts were checked in `assets/sql-cell.js`, `assets/sql_tools.py`,
`assets/site-editor.js`, `assets/settings.js`, and `assets/search.js`:

- Persisted SQL cells save text on Run and Load, not on typing. Restore
  loads that text and runs it again. This is not a saved database file or
  a complete history of all queries.
- Reset clears the named SQL database, output, and persisted text.
- SQL Download writes the current text. Load replaces the box's text.
- Ordinary SQL cells and the website preview editors do not persist edits.
- Settings apply immediately and use browser storage.
- Search uses indexed fields rather than the full tutorial text.

Tutorial slugs, cell identifiers, reading order, and runtime code stay the
same. Tutorial version fields stay the same because the changes are prose
and static examples, not runnable cells or saved-work identities.

## Further batches

1. Review the remaining getting-started tutorials in teaching order.
2. Review the first website and data tutorials, including activities,
   hints, answers, and the transitions between pages.
3. Continue through later tutorials and practice pages in small batches.
4. Review glossary definitions, navigation, and generated interface text.
5. Review teacher and contributor documentation for explicit prerequisites
   and clear procedures. Keep necessary technical detail.
6. Invite learners to use the drafts. Useful prompts include "Where would
   you begin?" and "What could you do if this did not work?"

For each batch, record the current passage, possible learner difficulty,
proposed wording, and factual checks. Review the rendered pages as well
as the source. Sentence measurements flag passages to read again; they
are not a pass/fail test of learning or English level.

## Validation

- `python3 build.py --clean`: 50 pages built; tutorial links resolved.
- `python3 -m pytest -q`: 86 tests passed.
- `tools/measure_sentences.py` on the six edited reader-facing files:
  mean sentence lengths about 11–12 words; longest sentence 23 words.
  The script excludes frontmatter and code, so the front-page cards and
  static examples were also read manually.
- Chromium and axe-core 4.10.3 on the front page, introduction, FAQ, and
  troubleshooting at 1200 and 390 pixels, using the default light theme:
  no axe violations or horizontal overflow; one main landmark and one
  h1 per page; navigation landmarks have labels.
- Settings opened from the keyboard, received focus, closed on Escape,
  and returned focus to its button at both widths on all four pages.
- Desktop and phone screenshots were captured for these four pages.
- `git diff --check`: no whitespace errors.

The checks used a temporary Python environment, Chromium, shared
libraries, and fonts outside the repository. No dependencies were added
to the project. These checks do not establish comprehension with learners;
that remains a review step.
