# Level 6 coverage: Web Development 6N1277

Written 2026-09-04, after Josh attached the module descriptor and asked for a
coverage plan "for later" — not new pages now. Section 8, question 14 of
`CONSOLIDATION_PLAN.md` deferred this question until pages existed; this is
that assessment, done against the two web arcs as they now stand plus the
enrichment idea in `PAGE_BY_PAGE.md` section 6. The source is
`sources/teaching-materials/WebDevelopment6N1277.pdf`, Dublin and Dún
Laoghaire ETB's descriptor, version 3. Josh's own read of it: out of date,
especially the learning outcomes.

## Why it doesn't just slot in

dewstack has no backend and no database server; `build.py` writes static
files and GitHub Pages serves them. The descriptor assumes the opposite for
a third of its learning outcomes: a multi-tier architecture with a database
server (LO2), server-side scripts that connect to one (LO9's server half),
installing a CMS on a server (LO6), and FTP, webmail and domain purchase for
hosting it (LO16). None of that has anywhere to run in this course's model.
Where the descriptor's intent survives without a server — a page that reads
and writes data, a page that persists something between visits — dewstack
already has an answer: Pyodide's `sqlite3` standing in for "a database
server" (the full-stack arc, `CONSOLIDATION_PLAN.md` section 12), and
`localStorage` or a downloaded file standing in for persistence. Below,
"fits" means the outcome's intent survives that substitution; "adapt" means
part of it does; "drop" means the outcome is specific to a technology this
course doesn't teach (a named CMS, FTP) and dewstack should not pretend to
cover it by teaching something else under its name.

## The seventeen outcomes

| LO | What it asks | Verdict | Where it lands |
|---|---|---|---|
| 1 | CSS, and the differences between CSS versions | fits | Already covered, Web Arc 1's C-series pages (`CONSOLIDATION_PLAN.md` section 14). "CSS versions" is dated framing; a rewrite would ask what CSS can do now, not version history. |
| 2 | Multi-tier architecture, client/server/middleware, a database server | drop, mostly | No server in this course. The concept survives as one paragraph in the full-stack arc's opening ("a page, a database, and the code between them" — section 12), not as its own outcome. |
| 3 | Web 1.0, Web 2.0 and beyond | drop | Web history for its own sake isn't in either arc and isn't worth adding; the descriptor itself calls this dated. |
| 4 | Responsive versus non-responsive design | fits | Web Arc 1, C11 (media queries) and C12 (flexible images); Arc 2 requires it outright. |
| 5 | HTML's recent evolution; current HTML tags | adapt | The tags themselves are covered throughout Web Arc 1. "Evolution of HTML" as a topic is the kind of history-for-its-own-sake question 3 also asks; drop the framing, keep the tags. |
| 6 | An industry CMS (WordPress, Joomla) | drop | Outside this course's from-scratch teaching model entirely. If a Level 6 award built on this repository still needs to demonstrate LO6 as written, that is a gap dewstack cannot silently absorb — it needs a real CMS unit, which is Josh's call, not a page to write. |
| 7 | Security: SQL injection, XSS, encrypting stored data | adapt | No live server to attack, so the practical half (a vulnerability scanner) doesn't fit. The concept does: dewstack's own SQL reference already says "use `?` placeholders, never build a query string" (`sources/teaching-materials/Databases/Database_Practice_Exam/uu_reference.md`). One short page or a paragraph in the data track's SQL page, not a security unit. |
| 8 | Usability and accessibility assessment | fits | dewstack already holds itself to this bar (`CONSOLIDATION_PLAN.md` section 3); turning "the bar this course meets" into "an exercise the student runs" (axe, keyboard nav, contrast, on their own site) is a short, genuine page. |
| 9 | Secure scripting, server-side and client-side | adapt, split | Server-side (connect to a database server, build a page from the results) has no server; the full-stack arc's Pyodide pattern is dewstack's version of this. Client-side (DOM manipulation, form validation, calculations) fits directly and is the Break and Make a Website candidate from `PAGE_BY_PAGE.md` section 6. |
| 10 | Standards conformance: W3C, Universal Design, accessibility | fits | Already the accessibility bar every page meets; same page as LO8 could ask the student to validate their own HTML/CSS. |
| 11 | Cross-platform, cross-browser testing | fits | A short addition to whichever page covers LO8: test at two widths, in two browsers, is already the site's own practice. |
| 12 | An interactive website with multimedia | fits | Arc 2 already requires forms, images and at least one interactive element; the Break and Make artefact (Irish Tax Simulator) is exactly this shape as a worked example. |
| 13 | The format of web pages, HTML up to the latest version | drop | Duplicate of LO5; same call. |
| 14 | JSON and persistent data (cookies, HTML5 storage) | fits | `localStorage` is already the mechanism dewstack uses for reading settings and the Break and Make artefact's dark-mode toggle; a page on "keeping something between visits without a server" is a natural client-side-scripting companion to LO9. |
| 15 | Wireframing for conceptual layouts | fits | Already required in both the starter's brief and the second starter's planning template (`sources/teaching-materials/Web Authoring Briefs/`); no new page needed, just a pointer from the planning template's wireframe section to whatever wireframing-tools page exists. |
| 16 | Hosting: servers, domains, FTP, webmail, password-protecting directories | drop | GitHub Pages replaces all of it, and getting-started page A4 (`NEXT_STEPS.md` section 3) already covers "publish it, and why the address looks like that." Teaching FTP and domain purchase would contradict the course's own no-install, nothing-hosted-by-the-student model. |
| 17 | Search engine optimisation | adapt | Everything about SEO that doesn't need a live, indexed, ranked site (semantic HTML, meta tags, alt text, page titles) is already taught for other reasons across Web Arc 1. A short reference-shelf page collecting "what you already did that also happens to be SEO" is plausible; a page that needs Search Console or real ranking data is not. |

## What this suggests, without committing to it

Eleven of seventeen outcomes fit or adapt onto material that already exists
or is already planned (Arc 1, Arc 2, the accessibility bar, the reference
shelf). What's left over — client-side scripting with the DOM, a short
security-awareness note, JSON/`localStorage` persistence, and the
accessibility/standards/cross-browser outcomes reframed as a student
exercise rather than a bar the site meets — is coherent enough to be one
extra step in the web track rather than scattered enrichment: provisionally,
**a site that responds**, sitting after Arc 2 and before the full-stack arc
(so it does not collide with that arc's existing number), built around the
Break and Make technique (give the student a working site, break one thing
at a time, have them find and fix it, introducing DOM manipulation, form
validation and `localStorage` as the fixes require it). Three outcomes (2, 6, 16) do not fit this course's
architecture at all and would need a decision from Josh — a real CMS and
hosting unit alongside dewstack, or accepting that this repository does not
by itself satisfy 6N1277 — rather than a page that pretends to cover them.
Two (3, 13) are redundant with outcomes already covered elsewhere in the
descriptor and need nothing.

Nothing here is scheduled. `CONSOLIDATION_PLAN.md` section 15's order of
writing stays as it is; this document exists so that when a Level 6 arc's
turn comes, the question "do we have coverage" has already been answered
once.
