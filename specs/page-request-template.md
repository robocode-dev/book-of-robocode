# page request template – human-facing

Fill this in (or a copy of it) when you want an AI agent to create a new
page for *The Book of Robocode*.

You only need to provide what you know; leave fields blank if you are
unsure and the AI will infer them from `BOOK_STRATEGY.md`,
`BOOK_STRUCTURE.md`, and `AI_GUIDELINES.md` (including the page
generation contract and `/specs` workflow).

---

## 1. Identity

- **Slug / file id**  
  Short, URL-friendly id for the page, usually matching the VitePress
  sidebar entry. Example: `coordinates-and-angles`.

- **Book section (top-level)**  
  One of the main sections from `BOOK_STRUCTURE.md`, for example:  
  `Introduction`, `Getting Started`, `Battlefield Physics`,
  `Radar & Scanning`, `Targeting Systems`, `Movement & Evasion`,
  `Energy & Scoring`, `Team Strategies`, `Melee Combat`,
  `Advanced Topics`, `Robocode Tank Royale Differences`, `Appendices`.

- **Planned title** (optional)  
  Leave empty to let the AI choose a clear title.

- **Difficulty**  
  `beginner` | `intermediate` | `advanced`.

- **Output path** (optional)  
  Default is `book/introduction/<slug>.md`. Override only if needed.

---

## 2. Sources

List the main references so the AI can attribute them correctly.

- **RoboWiki (classic Robocode)**  
  - `http://robowiki.net/wiki/...`
  - `https://robocode.sourceforge.io/developerWorks.php/...`

- **Robocode Tank Royale docs / GitHub**  
  - `https://robocode.dev/...`
  - `https://github.com/robocode-dev/tank-royale/...`

- **Robocode Home Page / official resources**  
  - `https://robocode.sourceforge.io/...`
  - `https://robocode.sourceforge.io/developerWorks.php`

- **Other notes or drafts** (optional)  
  Links to diagrams, internal notes, or prior drafts you want reflected.

---

## 3. Purpose & scope

Write a few short bullet points in your own words.

- **Goal of the page**  
  What should a reader understand or be able to do after reading?

- **Must include** (bullet list)  
  Key ideas, explanations, or comparisons that absolutely must appear.

- **Avoid or keep minimal**  
  Topics that belong on other pages or would distract beginners.

- **Suggested illustrations** (optional)  
  Describe any images that would help, and where they might go. Use: <!-- TODO: Illustration -->

---

## 4. Audience & emphasis (optional but helpful)

- **Primary audience** (pick one or describe):  
  - New players with basic programming knowledge  
  - Intermediate Robocode players  
  - Advanced or competitive players

- **Emphasis** (pick a few):  
  - Conceptual understanding  
  - Practical how-to  
  - Tutorial / step-by-step  
  - Historical or background context

Add a short note if needed, for example:  
“Mostly conceptual with one practical example using pseudocode.”

---

## 5. Platform notes

- **Applies to** (tick or describe):  
  - classic Robocode  
  - Robocode Tank Royale

- **Important platform differences to highlight**  
  Any specific differences the AI should call out between the two
  platforms.

---

## 6. Constraints & preferences (optional)

- **Approximate word limit**  
  Default: 500–700 (max 800).

- **Preferred examples**  
  For example, preferred language (Java / .NET / Python), simple scenario
  to use, or a particular bot behavior to illustrate.

- **Links to related pages**  
  Other book pages this one should refer to, if any.
