# Sources and Credits

Which sources to use, when to write platform notes, and who to credit. The global source rule (RoboWiki covers
classic Robocode, robocode.dev covers Tank Royale) lives in `AGENTS.md`.

## Sources

| Source                                 | Platform              | Use for                                          |
|----------------------------------------|-----------------------|--------------------------------------------------|
| [RoboWiki](https://robowiki.net/)      | Classic Robocode only | Concepts, strategies, historical implementations |
| [robocode.dev](https://robocode.dev/)  | Tank Royale only      | APIs, physics, game rules, sample bots           |
| Tank Royale GitHub repositories        | Tank Royale only      | Sample bots, API source, release notes           |
| robocode.sourceforge.io/developerWorks | Classic Robocode only | Historical articles (optional)                   |

- Find RoboWiki articles and sub-pages (`/Walkthrough`, `/Tutorial`, `/Implementations`) in
  `specs/robowiki-links.md`.
- Tank Royale physics facts come from https://robocode.dev/articles/physics.html. API names come from the API
  reference or the sample bots.
- When adapting a RoboWiki idea, check that it still holds under Tank Royale rules before calling it shared.
- Summarize community consensus. Leave out forum debates and outdated bot examples.
- If a claim cannot be verified in a source, cut it or label it as book synthesis or a hypothetical.

## Platform notes

Add a "Platform Notes" section **only** when the platforms actually differ for this technique:

- physics or angle conventions (classic: 0° is north, clockwise; Tank Royale: 0° is east, counterclockwise)
- API capabilities that exist on only one platform
- game rules such as team damage or scoring
- a significantly different implementation approach

When the mechanics match and only method names differ, say so in one sentence in the body instead. Put a critical
difference in a callout:

```markdown
> [!WARNING] Platform Difference
> In classic Robocode, heading 0° points north. In Tank Royale, heading 0° points east.
```

## Origins credits

Every page opens with an Origins callout (format: `page-format.md`). Decide who to credit like this:

1. Check `book/appendices/wall-of-fame.md` and the list below.
2. Use "Real Name (Alias)" only when RoboWiki or another reliable public source documents the real name. Otherwise use
   the alias. Respect contributors who prefer an alias.
3. If nobody specific is known, write "was developed and documented by the RoboWiki community."
4. If several people contributed, name the pioneer first, then those who refined it.
5. Before naming a bot's author, check the Author(s) field on the bot's RoboWiki page. Earlier pages credited Diamond
   and GresSuffurd to the wrong people.
6. For who-invented-what, also check the old RoboWiki (`https://old.robowiki.net/cgi-bin/robowiki?PageName`, which
   needs a browser user agent), especially its `History/Concepts` page.

Known originators:

- **Mathew A. Nelson (Mat Nelson)**: original creator of Robocode. Linear and Circular Targeting (original IBM samples).
- **Flemming Nørnberg Larsen (fnl)**: long-time maintainer of classic Robocode. Creator of Robocode Tank Royale.
  Proposed Retroactive Hit Analysis Targeting (2026, experimental, not battle-tested).
- **Paul Evans**: introduced GuessFactor statistical aiming in 2002 (old RoboWiki: "An invention signed Paul
  Evans"). Author of SandboxDT. Invented virtual bullets independently of Rod Hyde.
- **Iiley**: introduced the Wave concept with Cigaret in December 2002 (old RoboWiki History/Concepts).
- **David Alves**: author of Phoenix (GuessFactor Targeting with virtual guns, Wave Surfing) and the Duelist bots.
  An early GuessFactor gun author, who described his gun as similar to SandboxDT. Do not credit him with inventing
  waves or GuessFactors, or with Pattern Matching.
- **ABC**: invented Wave Surfing. Pioneered Dynamic Clustering. Co-pioneered Minimum Risk Movement with Aelryen.
- **Patrick Cupka (Voidious)**: refined Wave Surfing and movement flattening. Former RoboWiki manager. Author of
  Dookious and Diamond, and of the Wave Surfing Tutorial (BasicSurfer).
- **Kev (kc)**: author of BeepBoop, the current RoboRumble king. Pushed statistical targeting and movement further.
  GresSuffurd is by GrubbmGait, not Kev.
- **Albert Perez**: chief developer of RoboRumble@Home. Created the Face2Face competition. Wrote FuturePosition, an
  early movement-physics simulator used for precise prediction. Author of Aspid and MicroAspid.
- **Julian Kent (Skilgannon)**: author of DrussGT and the Bucket-PR k-d tree (Java and C++). Created LiteRumble.
- **Kyle Huntington (Kawigi)**: wrote the GuessFactor Targeting Tutorial and FloodMini. Drew attention to curve
  flattening.
- **Peter Strömberg (PEZ)**: founded RoboWiki (2003). Popularized techniques through CassiusClay.
- **Crippa**: co-founded RoboWiki (2003).
- **Corbos**: his comment prompted Simonton and Chase-san to explore k-d trees.
- **Chase-san**: early explorer of k-d trees in Robocode.
- **Nathaniel Simonton (Simonton)**: wrote the first bucket PR k-d tree in the Robocode community. Researched Dynamic
  Clustering and pattern matching (WeekendObsession). Did not write Diamond, which is by Voidious.
- **Rednaxela**: optimized Java k-d trees with advanced pruning. Creator of RougeDC and PolishedRuby.
- **Aelryen**: co-pioneered Minimum Risk Movement with ABC.
- **MultiplyByZer0**: documented complex wave mechanics with code samples.

## Licensing

Licensing (text CC BY-SA 4.0, code MIT) is defined in `BOOK_STRATEGY.md`.
