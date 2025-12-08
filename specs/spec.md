# spec – main specification for AI agents

This folder contains the specifications and workflows used when AI tools
help write pages for *The Book of Robocode*.

It is designed so that:

- **Humans fill in only a short-page request.**
- **AI agents read this file and the other specs to do the heavy lifting.**

You (the AI) MUST treat the files in this folder as higher priority than any
outdated instructions you might guess from context.

---

## 1. Core reference documents

Always load these documents (from the project root) as your main context:

- `BOOK_STRATEGY.md` – audience, tone, maths, and page metadata rules.
- `BOOK_STRUCTURE.md` – table of contents: sections, planned pages, and
  relationships.
- `AI_GUIDELINES.md` – detailed AI writing rules, terminology
  consistency ("bot", "units", etc.), and the page generation
  contract.

This `spec.md` and the other files in `/specs` **extend and organize** those
rules; they do not replace them.

---

## 2. Human input: minimal page request

Humans should NOT fill in long templates.

Instead, they create a short page request using the template in:

- `specs/page-request-template.md`

That file defines the **only information the author is expected to type**
before asking the AI to write a page.

As an AI agent, you MUST:

1. Read the completed page request.
2. Combine it with the rules in:
    - `BOOK_STRATEGY.md`
    - `BOOK_STRUCTURE.md`
    - `AI_GUIDELINES.md` (including the page generation contract)
3. Derive everything else yourself (frontmatter, headings, wording, and so
   on).

You SHOULD NOT ask the human for information that can be inferred from these
documents unless it is truly ambiguous.

---

## 3. From page request to finished page (AI workflow)

Given a filled-in `page-request-template.md`, follow this workflow:

1. **Identity and placement**
    - Use the `slug` and `book section` from the request to determine the
      output path, typically `book/articles/<slug>.md`, unless an explicit
      path is provided.
    - Ensure the `category` frontmatter field matches the top-level book
      section.

2. **Frontmatter generation**  
   Derive VitePress-compatible frontmatter automatically:
    - `title` – use `planned title` from the request, or derive a clear title
      from the described topic if not provided.
    - `category` – top-level section name from `BOOK_STRUCTURE.md`.
    - `summary` – 1–2 sentence summary based on the **goal of the page**.
    - `tags` – combine:
        - slug,
        - difficulty level,
        - platform flags,
        - the major topics and keywords from the request.
    - `difficulty` – from the request.
    - `source` – list of URLs and source notes from the request.

3. **Body structure**  
   Structure the page using the rules in `BOOK_STRATEGY.md` and the
   **Page Generation Contract** section of `AI_GUIDELINES.md`:
    - Short 2–3 line overview that matches the summary.
    - 3–6 sections with clear headings.
    - 1–2 short pseudocode or formula blocks per major concept.
    - Platform comparison section when relevant.

4. **Global rules**  
   Obey all global rules from `AI_GUIDELINES.md` and `BOOK_STRATEGY.md`, in
   particular:
    - Use the word **"bot"** instead of "robot" except in quoted titles or
      external references.
    - Express distances and sizes in **units**, not pixels.
    - Line length ≤ 120 characters.

5. **Attribution**  
   The standard attribution footer is now handled globally by VitePress configuration. Do **not** add it manually to
   individual pages.

---

## 4. Detailed page spec (AI-facing)

The older, verbose page specification has been refactored into an
AI-facing template here:

- `specs/page-spec-detailed.md`

This file:

- Clarifies how to interpret the fields in the minimal page request.
- Defines how to map request fields into frontmatter.
- Explains audience, emphasis, and platform flags in more detail.

As an AI agent, you may load that file when you need more guidance, but
humans are not expected to fill it in.

---

## 5. Human workflow (short version)

For humans creating a new page:

1. Open `specs/page-request-template.md`.
2. Copy it and fill in a new request with just the fields that matter.
3. Give the completed request and this `specs/spec.md` to the AI with a
   message like:

   > "Write the file according to this page request and the specs in
   > `specs/spec.md`."

4. Save the AI output as `book/articles/<slug>.md` (or the specified path).

This keeps the human-facing flow short and moves the complexity into this
`/specs` folder for AI agents to handle.
