# Voice and Craft

This file defines how the prose should sound. `AGENTS.md` covers mechanics: audience, structure, terminology,
frontmatter, and source boundaries. This file covers the craft rules that keep a page from reading like AI-generated
summary text.

## Core philosophy

This book teaches intuition first. A page should read like a knowledgeable, friendly teacher explaining something worth
learning, not like flattened documentation.

The prose must never feel:

- corporate
- generic
- academic
- sterile
- overpolished
- AI-generated

The right test is simple: a reader should feel the technical tension quickly. What goes wrong? What constraint bites?
Why does the technique help?

## Register anchor

The voice is "a science teacher with a smile." Friendly and clear, with real enthusiasm, but no hype. The prose starts
with intuition, shows the failure mode or constraint, and then explains the fix. Third person only.

## Writing characteristics

### Paragraph discipline

Keep paragraphs short, usually 2–4 sentences. Vary the shape aggressively. Three same-sized paragraphs in a row is an
AI tell.

### Open with curiosity, not framing

Do not open sections by announcing that a topic matters. Open with a tension, a surprising constraint, a mistake, or a
question the page answers.

Bad:

"Targeting is an important part of Robocode."

Better:

"A bullet fired at the enemy's current position usually misses, because the enemy keeps moving while the bullet travels."

### Stay on the page's subject

Each section must earn its place by helping with the page's specific promise. Background that does not sharpen the
concept, tradeoff, mistake, or next step is filler.

The focus test: if a paragraph could be dropped into a generic game-programming article unchanged, it probably needs a
more specific Robocode angle or it should be cut.

### Never invent evidence

Do not fabricate precise numbers, war stories, benchmarks, or fake memories. If a page uses a concrete claim, ground it
in RoboWiki, Tank Royale docs, sample bots, or clearly labeled book synthesis. If a scenario is hypothetical, label it
as hypothetical.

### Use engineer language, not marketing language

Prefer terms like turns, gun heat, bullet power, scan arc, lock, wall smoothing, hitbox, cooldown, and escape angle.
Use words that describe what the simulation does, not words that sound promotional.

### No throat-clearing

Cut warm-up lines that only announce importance or set mood. If a paragraph does not introduce a mechanism, constraint,
tradeoff, example, or question, cut it.

### Technical term before literary paraphrase

Use the standard term when one exists. Friendly analogies are allowed when they map tightly to the mechanic, but they
must not replace the actual term.

### Forbidden words and phrases

Avoid these stock phrases and AI-flavored fillers:

- delve
- leverage
- tapestry
- realm
- game-changer
- unlock
- unlock potential
- seamless
- holistic
- comprehensive solution
- cutting-edge
- groundbreaking
- revolutionize
- disruptive
- in a world where
- testament
- navigating the landscape
- in conclusion
- in summary
- furthermore
- moreover
- embark
- illuminate
- unveil
- elucidate
- harness
- skyrocket
- ever-evolving
- transformative
- recipe

Words like `can`, `may`, `just`, `imagine`, `discover`, `however`, `powerful`, `very`, and `really` are allowed when
they do real work.

### Respect reader intelligence

Do not over-explain obvious programming ideas or restate the same point in softer words. This book still teaches
beginners, so genuinely new Robocode terms should be defined once, clearly, then used normally.

### Compression

One sharp example beats three soft restatements. If two paragraphs do the same job, keep the better one.

### Every paragraph earns its place

Keep a paragraph only if it advances the explanation, clarifies a tradeoff, shows a failure mode, adds a concrete
example, or points the reader toward the next useful question.

The deletion test: remove the paragraph and read again. If nothing gets weaker, the paragraph did not earn the page.

### Vary rhythm aggressively

Mix short and long sentences. Mix direct explanation with one clean example. Do not let a section settle into a single
cadence.

### Vary construction, not only length

Watch for repeated sentence shapes:

- Too many copula lines: "X is Y."
- Too many balance pairs: "X does this. Y does that."
- Too many triple parallels in the same rhythm.

These are tools, not defaults. If the next sentence shape feels predictable, rewrite.

## Technical explanation style

### Explain through situations

Show the mechanic in action. A concrete failure mode usually teaches faster than an abstract definition.

Bad:

"Radar control is important."

Better:

"If the radar stops turning while the bot drives forward, the enemy can leave the scan beam and disappear from memory."

### Concrete over abstract

Use named artifacts, formulas, commands, turn limits, headings, or battlefield behavior. Avoid paragraphs built only
from abstract nouns like process, approach, mechanism, or capability.

The referent test: every paragraph should point to something a reader could observe in a battle, a page, or a codebase.

### Name the cost

When a technique helps, also name the tradeoff. Strong pages explain what the reader gains and what the reader gives up.

### Keep analogies honest

Friendly analogies are allowed when they clarify the mechanic exactly. If the analogy drifts away from the real rule,
drop it and use the technical term.

## Structural style

### Page openings

The opening should create curiosity and pull the reader into the next paragraph. Use a constraint, a mistake, a puzzle,
or a concrete observation.

### Section endings

Do not end a section with a bland summary. End by pointing forward, naming a tradeoff, or raising the next question.

### Page endings

The end of a page should keep momentum. It can point to the next technique, the next layer of difficulty, or the limit
of the current method.

## Forbidden punctuation and formatting

### Em dashes

No em dashes anywhere in book content. Zero.

Rewrite rules:

- For an aside: split into two sentences.
- For a definition: use a colon.
- For a short interruption: use a comma or parentheses.

En dashes `–` are fine for ranges like `300–800` or `2–4`.

### Semicolons

Avoid semicolons in prose. Use a period or comma instead.

### Bold and italic

Bold is allowed for terminology when it helps the reader track a concept. Do not use bold or italic as automatic
decoration. Backticks, code fences, Mermaid blocks, tables, and supportive emoji are all fine.

## Preferred techniques

Use occasionally, not constantly:

- A rhetorical question that the section genuinely answers
- Light, technically grounded humor
- A compact analogy that matches the mechanic exactly
- A clear opinion backed by the simulation or the sources

Good example:

"Gravity always wins, unless the bot has code for the wall before the wall has code for the bot."

Bad examples:

- pop-culture jokes
- self-congratulation
- hype language
- dramatic metaphors that hide the real mechanic

## Quality bar

A good page should:

- sound friendly, clear, and technically grounded
- feel specific enough that a reader trusts it
- avoid filler
- include at least one concrete observation worth remembering
