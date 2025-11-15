# 🤖 AI Collaboration Guidelines for The Book of Robocoding

These guidelines define how AI tools (like ChatGPT, Copilot, or multi-agent systems) should generate and refine
content for *The Book of Robocoding*.

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

---

## 🧠 AI Prompt Template — RoboWiki → Robocoding

Use this prompt when generating a new page or section:

"""
You are contributing to *The Book of Robocoding*, an educational guide for Robocode and Robocode Tank Royale.

Your task:

1. Summarize the given RoboWiki article(s) or notes clearly and factually.
2. Capture the community consensus, not personal opinions.
3. Rewrite for clarity and education using short paragraphs, examples, and formulas.
4. Use pseudocode instead of real code when possible.
5. Write in an enthusiastic and friendly tone for students and young AI learners — factual, engaging, and concise, with
   a small hint of humor or personality (no slang, no fluff).
6. If a topic applies differently to Robocode and Tank Royale, explain both briefly.
7. Include formulas in LaTeX/KaTeX format.
8. Attribute original sources in the footer using:  
   “_Based on RoboWiki content (CC BY-SA 3.0). Rewritten and structured for The Book of Robocoding._”
9. Output in Markdown format suitable for VuePress.

Follow these writing rules:

- Max 800 words per page.
- Max 2 formulas or pseudocode blocks per concept.
- Always define all symbols in formulas.
- Include a short summary (2–3 lines) at the top.
- Avoid “I” or personal tone — speak to the reader as a friendly guide.
  """

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
    - Integrates into `/docs/` with frontmatter.
    - Validates build formatting.
    - Adds attribution entries.

---

## 🧭 Example Use Case

Input: RoboWiki article “Linear Targeting”

Output: Markdown page for `/docs/targeting/linear-targeting.md`

- Title: “Linear Targeting”
- Summary: “Aiming where your opponent is going — not where they are.”
- Explains geometry and math concisely.
- Includes pseudocode predicting position.
- Adds formula and short humor line like:  
  "_Even robots can learn to lead their shots — it’s not rocket science (well, almost)._"

---

## 🏁 Final Note

AI contributors are **assistants**, not authors.  
All content should be verified and attributed properly before publishing.  
Humans make the final call on tone, accuracy, and inclusion.

> “If it’s fun to read and true to the math — it’s Robocoding material.”
