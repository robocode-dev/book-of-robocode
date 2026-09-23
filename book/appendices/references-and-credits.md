---
title: "References & Credits"
category: "Appendices"
summary: "Find where a page's facts come from, what license covers the book's text and code, and how to trace a
  claim back to its source."
tags: ["references-and-credits", "appendices", "beginner", "robocode", "tank-royale", "sources", "licensing"]
difficulty: "beginner"
source:
  - "RoboWiki https://robowiki.net/"
  - "Robocode Tank Royale Docs https://robocode.dev/"
---

# References & Credits

> [!TIP] Origins
> This page explains where the book's facts come from and how they are licensed. For the people who did the work,
> see the [Wall of Fame](./wall-of-fame.md).

A claim in this book is only as good as the page it came from. Every page names its sources in two places, the
frontmatter at the top of the file and the **Further Reading** list at the bottom, so a reader who doubts a number
can go check it against the same source this book used.

## Two source families, kept apart

The book draws from exactly two kinds of source, and it never mixes them for a single claim:

- **[RoboWiki](https://robowiki.net/)** documents **classic Robocode only**. It is the community wiki behind two
  decades of targeting, movement, and radar research, founded in 2003 by Peter Strömberg (PEZ) and Crippa.
- **[robocode.dev](https://robocode.dev/)** and the Tank Royale GitHub repositories document **Robocode Tank
  Royale only**: its APIs, physics, game rules, and official sample bots.

A page that covers both platforms cites both, and marks anything that only applies to one of them in a Platform
Notes section or a callout, rather than presenting a classic-only fact as if it also held for Tank Royale.

## How to trace a claim

1. Open the page's frontmatter. The `source` list names every RoboWiki article or Tank Royale doc page the article
   draws from.
2. Scroll to **Further Reading** at the bottom. It repeats those sources as links, plus any earlier book pages the
   article builds on.
3. Follow the link. If a number in the book doesn't match what the source says, that's a bug in the book, not the
   source.

A claim with no traceable source, an invented benchmark, a guessed constant, a hypothetical dressed up as fact, is
a defect. Report it the way [Feedback & Contributing](./feedback.md) describes, through a GitHub issue or a direct
edit.

## Licensing

The book's text and its code carry different licenses, matching how each is meant to be reused:

| Content                         | License      |
|----------------------------------|----------------|
| Book text (prose, explanations)  | CC BY-SA 4.0   |
| Code examples                    | MIT License    |

CC BY-SA 4.0 lets a reader copy, adapt, and republish the prose, including for teaching material of their own, as
long as they credit the book and share their version under the same license. MIT lets a reader drop a code sample
straight into their own bot without that copyleft requirement, since a bot's source usually needs to stay under
whatever license its own project uses.

## Full attribution

The book's `ATTRIBUTION.md` file, in the project's root, lists every named contributor whose work this book draws
on, alongside the technique or bot they're credited for. The [Wall of Fame](./wall-of-fame.md) covers the same
ground as a readable page inside the book itself, organized by the role each person played rather than as a flat
list.

## Further Reading

- [RoboWiki](https://robowiki.net/) - community documentation for classic Robocode
- [Robocode Tank Royale Docs](https://robocode.dev/) - official documentation for Tank Royale
- [Wall of Fame](./wall-of-fame.md) - the people credited throughout the book
- [Feedback & Contributing](./feedback.md) - how to report or fix an inaccurate claim
