# 🤖 AI Collaboration Guidelines for The Book of Robocode

These guidelines define how AI tools (like ChatGPT, Copilot, or multi-agent systems) should generate and refine
content for *The Book of Robocode*.

---

## 🎯 Purpose

AI should help transform the knowledge on [RoboWiki.net](https://robowiki.net/) and the official
[Robocode Tank Royale documentation](https://robocode-dev.github.io/tank-royale/) and its GitHub project pages
into clear, modern, and engaging educational material that matches the style and structure defined in
`BOOK_STRATEGY.md`.

Platform support policy for this book:

- Supported platforms: Java, .NET, and Python 3.10+.
- All languages running on those platforms are implicitly supported (e.g., Kotlin/Scala on JVM, F# on .NET).
- WebAssembly (WASM) support will be added later.
- Sample bots currently exist only for C#/.NET, Java, and Python — examples should prefer these languages for now.

Important source distinction:

- **RoboWiki.net** documents the original, classic **Robocode** platform only.
- **Robocode Tank Royale** is documented on **robocode-dev.github.io/tank-royale** and the corresponding
  GitHub repository pages — not on RoboWiki.

Each AI-generated page must:

- Be **accurate** and **factually grounded**.
- Reflect **community consensus**.
- Stay **concise**, **fun**, and **educational**.
- Attribute **original sources** and **contributors**.
- Respect the difference between classic **Robocode** and **Robocode Tank Royale** sources while aiming to fit both
  perspectives when the concept applies to both.
- Be written using **UTF-8** encoding, where **emoji characters are allowed** when appropriate.
- Keep lines at **120 characters or fewer** to make diffs and reviews easy.
- **Where a concept benefits from a visual illustration, include a hint in the markdown for an image and a short
  description of what the illustration should show.**

---

## 🧠 Page Generation Contract

When generating a **new concept page** (from a page request or spec), AI
agents MUST follow this contract.

### 1. Use core reference documents

Treat these root documents as authoritative context:

- `BOOK_STRATEGY.md` – audience, tone, page structure, and
  math/pseudocode rules.
- `BOOK_STRUCTURE.md` – complete table of contents (sections, planned
  pages, and relationships).
- `AI_GUIDELINES.md` (this file) – detailed AI writing rules and
  terminology consistency ("bot", "units", etc.).

The `/specs` folder (`specs/spec.md`, `specs/page-request-template.md`,
and `specs/page-spec-detailed.md`) defines how to interpret a human page
request and map it into a finished page.

### 2. Audience & tone

Assume:

- Audience: curious teenagers and students (technical schools,
  universities, and similar) plus people learning how to code who want
  **something fun to code for**, fans of live-programming games, hobby
  programmers, and educators.
- Tone: neutral, friendly, encouraging, clear. No sarcasm, memes, or
  slang.
- Voice: no first person ("I", "we"); write as a helpful guide, not as
  yourself.
- Complexity: start with intuition and simple examples, then add math or
  deeper detail.
- Paragraphs: short, 2–4 sentences max.

These rules expand on the general tone guidance in `BOOK_STRATEGY.md`.

### 3. Content style

- Focus on **concepts, intuition, and reasoning**, not large code dumps.
- Prefer **pseudocode** over real code; keep it short and readable.
- Use **1–2 formulas or pseudocode blocks** per page; always define
  symbols.
- Use Markdown features: headings, lists, callouts (tip/warning), and
  tables when helpful.
- Keep each page roughly **300–800 words** unless the spec clearly
  allows more (hard cap 800 words unless explicitly overridden).
- Write all content as **UTF-8** text; emoji characters are allowed when
  they support the explanation or tone.
- Wrap text so that each line stays at **120 characters or fewer**.

### 4. Platform & sources

- In this book, "Robocode" usually means **both classic Robocode and
  Robocode Tank Royale**.
- When a concept applies only to one platform, be explicit: say
  **"Classic Robocode"** or **"Robocode Tank Royale"**.
- **Source separation is critical**:
  - RoboWiki.net documents **classic Robocode only**.
  - `robocode-dev.github.io/tank-royale` and its GitHub project pages
    document **Robocode Tank Royale**.
- When you adapt or summarize content:
  - From RoboWiki → treat it as classic Robocode information.
  - From robocode-dev/GitHub → treat it as Tank Royale information.
- When possible, explain how a concept maps between classic Robocode and
  Tank Royale (similarities and key differences).

Follow all licensing and attribution rules from `BOOK_STRATEGY.md` and
`ATTRIBUTION.md`.

### 5. Page structure, frontmatter, and attribution

Every page is a **self-contained concept** with VuePress-compatible
Markdown and MUST begin with frontmatter:

---
title: "<Title>"
category: "<Top-level section, e.g., Battlefield Physics>"
summary: "<1–2 sentence summary for sidebar/SEO.>"
tags: ["<topic>", "robocode", "tank-royale",
  "beginner|intermediate|advanced"]
difficulty: "beginner|intermediate|advanced"
source: [
  "RoboWiki - <Article Name> (classic Robocode)",
  "Robocode Tank Royale Docs - <page or section>"
]
---

After frontmatter:

- Include a short 2–3 line overview that matches or expands the summary.
- Structure the page with 3–6 sections, using headings such as:
  - "Why This Matters" / "Overview"
  - "Core Ideas" / "Key Concepts"
  - "Math / Pseudocode"
  - "Platform Notes (Classic vs Tank Royale)"
  - "Tips & Common Mistakes"
- End every page with an attribution footer like:

  *Based on RoboWiki content (CC BY-SA 3.0) for classic Robocode and the
  official Robocode Tank Royale documentation. Rewritten and structured
  for The Book of Robocode.*

### 6. Output contract

When you are asked to generate a page, you will typically receive a
**page request** created from `specs/page-request-template.md`.

Using that request, the `/specs` files, `BOOK_STRATEGY.md`,
`BOOK_STRUCTURE.md`, and the rules in this file, you MUST output a
single, complete Markdown page ready to be saved as
`book/articles/<slug>.md` (or another path provided in the request).

Do not include extra explanation outside the Markdown file content,
unless the user explicitly asks for commentary.

---

## ✍️ Tone Calibration

AI outputs must sound:

- **Positive and encouraging** — help readers feel “I can do this!”
- **Clear and professional**, but not dry.
- **Friendly and curious**, like a mentor explaining a cool trick.
- **Educational and engaging**, with occasional light humor:
    - ✅ “Just remember, gravity always wins — unless you code around it!”
    - ✅ “Like dodging a snowball: predicting where it *won’t* hit you matters most.”
- ❌ Avoid sarcasm, memes, or pop-culture references.

Think of the tone as:
> "A science teacher with a smile, not a stand-up comedian."

---

## #️⃣ Header Numbering Consistency

- Use numbered headers (e.g., `## 1. ...`) only for step-by-step, procedural, or specification-style pages where
  sections are referenced by number or explicit order is important.
- For narrative, conceptual, or general informational pages, use unnumbered headers.

---

## 🧩 Multi-Agent Collaboration Workflow

1. **Agent A — Extractor**
    - Scrapes, parses, or summarizes RoboWiki articles.
    - Removes irrelevant chatter or outdated data.
    - Outputs clean concept text.

2. **Agent B — Educator**
    - Rewrites content using the AI Prompt Template.
    - Adds formulas, structure, and examples.
    - Adapts tone and style.

3. **Agent C — Publisher**
    - Integrates into `/book/` with frontmatter.
    - Validates build formatting.
    - Adds attribution entries.

---

# Terminology Consistency: 'Bot' vs 'Robot'

- Always use the term **"bot"** instead of "robot" in all writing, except when quoting original titles, references, or
  links (e.g., RoboWiki page titles, API class names, or external documentation).
- This rule applies to all AI-generated and human-authored content for The Book of Robocode.

# Terminology Consistency: 'Units' vs 'Pixels'

- Always use **"units"** for all measurements of distance, size, and movement in Robocode and Robocode Tank Royale. Do *
  *not** use "pixels". For example, bot size is 40x40 units, scan length is 1200 units, and a bot can move up to 8 units
  per turn. This ensures clarity and consistency for all contributors and readers.

---

## 🏁 Final Note

AI contributors are **assistants**, not authors.  
All content should be verified and attributed properly before publishing.  
Humans make the final call on tone, accuracy, and inclusion.

> “If it’s fun to read and true to the math — it’s Robocoding material.”
