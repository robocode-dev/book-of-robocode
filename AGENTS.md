# 🤖 Agent Guide for The Book of Robocode

The book turns knowledge from [RoboWiki](https://robowiki.net/) (classic Robocode) and the
[Robocode Tank Royale docs](https://robocode.dev/) into short, accurate, fun teaching pages. Agents assist. People make
the final call on tone, accuracy, and inclusion.

## Where the rules live

Each rule lives in exactly one place. Read the files the task needs, and do not copy their rules elsewhere.

| Topic                                           | File                                          |
|-------------------------------------------------|-----------------------------------------------|
| Global rules and article craft                  | this file                                     |
| Prose voice, openings, forbidden words          | `.agents/instructions/writing-voice.md`       |
| File path, frontmatter, page structure, sidebar | `.agents/instructions/page-format.md`         |
| Sources, platform notes, Origins credits        | `.agents/instructions/sources-and-credits.md` |
| Illustration markers, SVG drawing, palette      | `.agents/instructions/illustrations.md`       |
| Table of contents, difficulty, and page status  | `BOOK_STRUCTURE.md`                           |
| RoboWiki article index                          | `specs/robowiki-links.md`                     |
| Mission, audience, and licensing                | `BOOK_STRATEGY.md`                            |

## Workflow

A new article goes through three skills in `.agents/skills/`:

1. **`create-page <title>`**: researches the sources, writes the page, adds it to the sidebar, and updates the
   roadmap.
2. **`create-illustration`**: draws an SVG for every `<!-- TODO: Illustration -->` marker and checks the rendering.
3. **`review-page`**: reviews the page. Fix every blocking finding, then review again.

Finish with `npm run build`. For an edit to an existing page, skip step 1 but still end with `review-page`. Never
commit or push unless asked.

## Global rules

- **Sources:** RoboWiki documents classic Robocode only. robocode.dev and the Tank Royale GitHub repositories document
  Tank Royale only.
- **Platforms:** "Robocode" means both classic Robocode and Tank Royale. Say so explicitly when something applies to
  only one of them.
- **Languages:** Java, .NET, Python 3.10+, and TypeScript. Prefer the official sample bots (Java, C#, Python) for
  examples.
- **Terminology:** write "bot", not "robot" (except in titles, API names, and quotes), and "units", not "pixels".
- **Truth:** never invent facts, numbers, benchmarks, quotes, or real names. Every claim traces to a source.
- **Voice:** third person, friendly and clear, "a science teacher with a smile". No sarcasm, memes, slang, or
  pop-culture jokes.
- **Punctuation:** no em dashes and no semicolons in book prose. En dashes for ranges are fine.
- **Files:** UTF-8, and lines of 120 characters or fewer.
- **No attribution footer:** VitePress adds it globally.
- **Themes:** every image and diagram must read well in both the light and the dark theme.

## What makes a strong article

- **Start with the problem.** Open with the failure, constraint, or puzzle the technique solves, such as a bullet
  missing because the enemy keeps moving. Never open by saying a topic is important.
- **Keep one promise.** The summary states what the reader will be able to do. Cut any section that does not serve it.
- **Build intuition before math.** Describe a concrete battle situation, then give one formula or one code block, and
  define every symbol.
- **Verify every number.** Check speeds, turn rates, gun heat, and damage against the Tank Royale physics page or
  RoboWiki.
- **Name the cost.** Say what the technique gives up (CPU time, data, noise, weakness against certain movement) and
  when a simpler method wins.
- **Show the geometry.** Anything with angles, paths, or waves gets an illustration.
- **End with momentum.** Close by pointing to the limit of the method or the next technique, not with a summary.
- **Write with craft.** Before drafting, read `writing-voice.md`. Its deletion and focus tests catch most filler.

## Done means

- `review-page` reports no blocking findings.
- Every illustration renders with its bots visible in both themes.
- The sidebar, `BOOK_STRUCTURE.md` status, and `book/introduction/whats-coming-next.md` are updated.
- `npm run build` passes.

> "If it's fun to read and true to the math, it's Robocoding material."
