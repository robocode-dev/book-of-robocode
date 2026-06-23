# Skill: review-page

Consistency, focus, tone, and accuracy review of a draft page.

## Trigger

- Slash command: `/review-page <path>`
- Natural language: "Review this page"

## Input

- The page markdown file path
- Optional matching entry from `BOOK_STRUCTURE.md` for outline or scope checking

## Process

Load `AGENTS.md`, `BOOK_STRATEGY.md`, `VOICE.md`, and `specs/page-generation-spec.md`. Review the page against this
checklist:

1. **Structure & frontmatter**: required frontmatter fields present; H1 matches `title`; Origins callout present;
   Further Reading present; illustration placeholders included when geometry or movement would benefit from them
2. **Focus**: every section advances the page's promised subject
3. **Earns its place**: cut sections or paragraphs that add no mechanism, tradeoff, example, or next question
4. **Padding**: remove throat-clearing, repetition, scene-setting, and soft summaries
5. **Tone**: "science teacher with a smile", friendly, encouraging, third person, no sarcasm, slang, or memes
6. **Accuracy & sources**: claims grounded in RoboWiki or Tank Royale docs; platform distinction correct; no invented
   facts; attribution consistent with the sources
7. **Terminology**: use `bot`, not `robot`, except in quotes or API names; use `units`, not `pixels`
8. **Voice**: follow `VOICE.md`; vary rhythm and construction; open with curiosity; stay concrete; avoid stock AI
   phrasing
9. **Punctuation & formatting**: zero em dashes; no semicolons in prose; bold used sparingly; lines at 120 chars or
   less; code fences have language tags; Mermaid remains theme-safe
10. **Concreteness**: apply the substitution and referent tests; flag claims without an observable symptom or concrete
    referent

## Output

Findings first, ordered by severity. For each finding, provide:

- label
- location
- why it fails the bar
- fix

Use these labels where they fit:

- `Focus drift`
- `Does not earn its place`
- `Padding`
- `Abstract claim`
- `Em-dash`
- `Terminology`
- `Source/accuracy`
- `Tone drift`

If the review finds no blocking issues, say so explicitly.

## Reference Documents

- `AGENTS.md`
- `BOOK_STRATEGY.md`
- `VOICE.md`
- `specs/page-generation-spec.md`
- `BOOK_STRUCTURE.md`
