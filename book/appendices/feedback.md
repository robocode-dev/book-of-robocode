---
title: Feedback & Contributing
tags: [ "feedback", "contributing", "appendices", "community" ]
---

# Feedback & Contributing

The Book of Robocode gathers two decades of community knowledge, and it stays accurate only when readers correct it. Every page is plain text in a public repo, so each one is a file you can edit and each claim is one you can argue with.

There is no separate email or contact form. Feedback runs through GitHub, in the open, where the change and the reason for it stay attached to the page they touch.

## Fix a page directly

Every page has a **Suggest a change to this page** link in its footer. The link opens the GitHub edit view for that exact file under `book/`. Make the change, and GitHub walks you through opening a pull request. This is the short path for a typo, a broken link, or a wrong formula: one edit, one PR, no local checkout.

## File an issue

When a fix needs explanation, open an issue. Blank issues are off, so you land on one of two forms:

- **Report an error or erratum** for something wrong: a factual mistake, a stale reference, a bad code or pseudocode sample, a physics value that does not match the engine.
- **Suggest an improvement** for a concrete change to a page: a clearer explanation, a missing caveat, a sharper example.

Each form asks which page and what should change, so the report arrives actionable instead of vague.

## Start a discussion

Not every idea is a specific edit yet. For open questions, disagreements, and "what about X" threads, use [Discussions](https://github.com/robocode-dev/book-of-robocode/discussions). That is the place to think out loud before anything hardens into an issue or a PR. Corrections belong in issues. Open-ended strategy debate belongs in Discussions.

## If you open a PR

Prose changes follow the writing conventions in the repo, the same ones the book was drafted under. The full guide lives in [`CONTRIBUTING.md`](https://github.com/robocode-dev/book-of-robocode/blob/main/CONTRIBUTING.md). Run `npm run build` before pushing to confirm the site still builds with no broken links.

The book teaches ideas that transfer between classic Robocode and Robocode Tank Royale. Feedback works the same way: edit the file, state the reason, and the next reader inherits both.
