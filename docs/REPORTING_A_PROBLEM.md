# Reporting a mistake or a bug

If you have found something wrong, telling us is a help, and you do not need to
be sure it is wrong before you say so. Half of what turns out to be a real bug
starts as somebody saying "this looked odd to me". That is enough.

---

## The quick way: from the page itself

Most pages carry a line at the foot, "Something wrong on this page? Tell
us." Click it and three doors open.

**I have a question.** Not wrong, just something you want explained. This
one goes to Discussions rather than an issue, so an answer stays where
somebody with the same question can find it later.

**It gives an error.** For a site-editor pane that will not do what the
page says, a SQL cell that will not run, or anything else that misbehaves.
Opens GitHub's own issue form, with the page and its version already
filled in and this kind already picked. See
[Troubleshooting](https://deweydex.github.io/dewstack/tutorials/reference/troubleshooting/)
first — it groups the problems people meet most often, with the checks
that usually find them.

**The page is wrong, or I could not follow it.** For a mistake or
something confusing. Same form, same fields filled in, this kind picked
instead.

Whichever door you take, all you need to add is the one thing that
matters: what happened.

If the doors are missing, or your report has no one page attached to it
(an idea, a suggestion, something about the site as a whole), opening an
issue yourself works the same way — **[the issue tracker on
GitHub](https://github.com/deweydex/dewstack/issues)**. You need a free
GitHub account to post one. Have a quick look at the open issues first
in case somebody has already reported it — if they have, adding what you
saw to that issue is more useful than starting a new one. The rest of
this page covers what is useful to include, either way.

The doors can be turned off for a while if reports need to pause, for
example while something is being fixed. When they are off, this page and
the issue tracker itself still work exactly as before.

---

## An even quicker way: from a SQL or Python cell

Every SQL and Python cell has a small circle among its own buttons, next
to Reset. Click it, and the same three doors open, this time already
knowing which cell you were on. Choose "It gives an error," and your
code exactly as you have it, and whatever the cell last showed, are both
included in the report. You do not need to copy either one yourself.

A very long cell or a very long error is cut short rather than left out,
so the link stays short enough for GitHub's own form to open. Paste the
rest yourself if the missing part matters.

---

## Three kinds of problem

It helps to know which one you are looking at, because what is useful to
include is different for each.

**A mistake in the material.** A wrong answer, a query result that does
not match what the page says, a spelling error, an explanation that
contradicts itself, a link that goes nowhere useful. If you can, say
which page and which section, and quote the line.

**Something on the site not working.** A site-editor pane that will not
update its preview, a SQL cell that will not run, saved work that
vanished, a page that looks wrong on your phone, an error you did not
cause. [Troubleshooting](https://deweydex.github.io/dewstack/tutorials/reference/troubleshooting/)
covers the checks worth trying first.

**Something confusing.** Not wrong exactly, but you had to read it three
times, or it assumed something it never explained, or the order made no
sense. These are worth reporting too. A page that is technically correct
and impossible to follow is still not doing its job.

---

## What is useful to include

For a mistake in the material, the page and the sentence is usually enough.

For something not working, these five things save a lot of back-and-forth:

1. **Which page** — the address in the browser's address bar, copied and pasted.
2. **What you did** — the steps, in order, from opening the page. "I typed this
   into the CSS pane" is enough.
3. **What you expected to happen.**
4. **What happened instead** — including the exact error text, if there was any.
   Copy and paste it rather than describing it, and a screenshot is welcome.
5. **Your browser and device** — Chrome on a school PC, Safari on an iPhone,
   Firefox on a Mac. Some problems only happen in one place, and this is often
   the fastest clue.

If it only happens sometimes, say so, and say what was different the times it
did happen. An intermittent problem is harder to track down, and knowing that it
is intermittent is part of the report.

---

## Suggestions and questions

The same issue tracker takes ideas, requests and questions, not only faults. A
topic you wish had a page, a SQL exercise that needs more practice, an
explanation you think could be clearer — all of that is welcome, and none of it
needs to be phrased as a complaint.

---

## If you want to fix it yourself

You are welcome to. A small correction is often quicker to send as a pull
request than to describe.

[`README.md`](../README.md) has the course map, and [`CLAUDE.md`](../CLAUDE.md)
has what to run before you open the pull request. A slug is a contract once
a class has seen a page — change a page's title freely, but leave its slug
alone.

Mentioning the issue number in the pull request ties the two together. If there
is no issue yet, the pull request on its own is fine.
