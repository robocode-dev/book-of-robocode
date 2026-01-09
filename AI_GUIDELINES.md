# 🤖 AI Collaboration Guidelines for The Book of Robocode

Transform knowledge from [RoboWiki.net](https://robowiki.net/) and
[Robocode Tank Royale docs](https://robocode-dev.github.io/tank-royale/) into clear, engaging educational material.

## 🎯 Core Principles

**Platform Support:**
- Java, .NET, Python 3.10+ (implicitly includes Kotlin/Scala on JVM, F# on .NET)
- Sample bots exist for C#, Java, Python — prefer these for examples
- WASM support coming later

**Source Distinction (Critical):**
- **RoboWiki.net** → classic **Robocode** only
- **robocode-dev.github.io/tank-royale** + GitHub → **Robocode Tank Royale** only
- When adapting content, identify which platform it documents and explain how concepts map between both

**Every Page Must Be:**
- Accurate, factually grounded, reflecting community consensus
- Concise (300–800 words unless specified), fun, and educational
- UTF-8 encoded with lines ≤120 characters
- Properly attributed to original sources
- Visual hints included where illustrations would help clarify concepts

---

## 🧠 Page Generation Contract

### Reference Documents

- `BOOK_STRATEGY.md` – audience, tone, page structure, math/pseudocode rules
- `BOOK_STRUCTURE.md` – complete table of contents
- `AI_GUIDELINES.md` (this file) – writing rules and terminology
- `/specs` folder – page request interpretation and mapping

### Audience & Tone

**Target:** curious teenagers, students (technical schools, universities), new programmers seeking fun projects,
live-programming game fans, hobby programmers, educators.

**Style:**
- Neutral, friendly, encouraging, clear — no sarcasm, memes, or slang
- Third person only (no "I" or "we")
- Start with intuition and simple examples, then add depth
- Short paragraphs (2–4 sentences max)
- Positive tone: "A science teacher with a smile, not a stand-up comedian"
- Occasional light humor (✅ "gravity always wins — unless you code around it!" ❌ pop-culture refs)

### Content Guidelines

- Focus on **concepts and intuition**, not large code dumps
- Prefer **pseudocode** (short, readable); limit to 1–2 formula/pseudocode blocks per page
- Always define symbols in formulas
- Use Markdown: headings, lists, callouts (tip/warning), tables
- Emoji allowed when supportive

### Platform & Sources

- "Robocode" = **both** classic and Tank Royale (be explicit when concept applies to only one)
- When adapting: RoboWiki → classic; robocode-dev/GitHub → Tank Royale
- Explain how concepts map between platforms when applicable
- Follow licensing/attribution rules from `BOOK_STRATEGY.md` and `ATTRIBUTION.md`

### Page Structure & Frontmatter

Every page must begin with VitePress-compatible frontmatter:

```yaml
---
title: "<Title>"
category: "<Top-level section>"
summary: "<1–2 sentence summary for sidebar/SEO>"
tags: ["<topic>", "robocode", "tank-royale", "beginner|intermediate|advanced"]
difficulty: "beginner|intermediate|advanced"
source: ["RoboWiki - <Article Name> (classic Robocode)", "Robocode Tank Royale Docs - <page or section>"]
---
```

**After frontmatter:**
- 2–3 line overview matching/expanding the summary
- 3–6 sections with headings like: "Why This Matters", "Core Ideas", "Math/Pseudocode", 
  "Platform Notes", "Tips & Common Mistakes"

> **Note:** Attribution footer handled globally by VitePress — do not add manually.

### Output Contract

When given a **page request** (from `specs/page-request-template.md`), output a single, complete Markdown page ready
to save. No extra explanation unless explicitly requested.

---

## 📝 Terminology & Formatting

**"Bot" vs "Robot":**
Always use **"bot"** (except when quoting original titles, API names, or external docs).

**"Units" vs "Pixels":**
Always use **"units"** for measurements (e.g., 40×40 units, 1200 units, 8 units/turn).

**Header Numbering:**
Use numbered headers (e.g., `## 1. ...`) only for step-by-step or procedural pages. Use unnumbered headers for
narrative/conceptual content.

---

## 🏁 Final Note

AI contributors are **assistants**, not authors.  
All content should be verified and attributed properly before publishing.  
Humans make the final call on tone, accuracy, and inclusion.

> “If it’s fun to read and true to the math — it’s Robocoding material.”
