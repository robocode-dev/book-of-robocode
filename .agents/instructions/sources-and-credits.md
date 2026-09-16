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

Known originators:

- **Mathew A. Nelson (Mat Nelson)**: original creator of Robocode. Linear and Circular Targeting (original IBM samples).
- **Flemming Nørnberg Larsen (fnl)**: long-time maintainer of classic Robocode. Creator of Robocode Tank Royale.
- **David Alves**: invented the wave concept. Co-pioneered GuessFactor Targeting. Pioneered Pattern Matching (Phoenix)
  and Random Orbital Movement.
- **Paul Evans**: co-pioneered GuessFactor Targeting (discovered "bins"). Popularized segmentation.
- **ABC**: invented Wave Surfing. Pioneered Dynamic Clustering. Co-pioneered Minimum Risk Movement with Aelryen.
- **Patrick Cupka (Voidious)**: refined Wave Surfing and movement flattening. Former RoboWiki manager.
- **Kev (kc)**: current 1-vs-1 champion and author of GresSuffurd. Pushed statistical targeting and movement further.
- **Albert Perez**: creator of RoboRumble. Pioneered Precise Prediction.
- **Julian Kent (Skilgannon)**: perfected Dynamic Clustering and built the Bucket PR k-d tree. LiteRumble maintainer
  and current RoboWiki host.
- **Kyle Huntington (Kawigi)**: popularized GuessFactor Targeting through tutorials and FloodMini.
- **Peter Strömberg (PEZ)**: founded RoboWiki (2003). Popularized techniques through CassiusClay.
- **Crippa**: co-founded RoboWiki (2003).
- **Corbos**: first to mention k-d trees on RoboWiki.
- **Chase-san**: early explorer of k-d trees in Robocode.
- **Nathaniel Simonton (Simonton)**: built the first k-d tree in a bot (Diamond). Pushed Dynamic Clustering further.
- **Rednaxela**: optimized Java k-d trees with advanced pruning. Creator of RougeDC and PolishedRuby.
- **Aelryen**: co-pioneered Minimum Risk Movement with ABC.
- **MultiplyByZer0**: documented complex wave mechanics with code samples.

## Licensing

Licensing (text CC BY-SA 4.0, code MIT) is defined in `BOOK_STRATEGY.md`.
