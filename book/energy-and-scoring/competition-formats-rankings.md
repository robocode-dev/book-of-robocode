---
title: "Competition Formats & Rankings"
category: "Energy & Scoring"
summary: "Understanding standardized competition formats, battlefield dimensions, and ranking systems used in the classic Robocode community, including RoboRumble and LiteRumble."
tags: [ "competition", "rankings", "literumble", "roborumble", "1v1", "melee", "teams", "intermediate", "robocode" ]
difficulty: "intermediate"
source: [
  "RoboWiki - RoboRumble/Enter The Competition (classic Robocode) https://robowiki.net/wiki/RoboRumble/Enter_The_Competition",
  "RoboWiki - LiteRumble (classic Robocode) https://robowiki.net/wiki/LiteRumble",
  "RoboWiki - RoboRumble (classic Robocode) https://robowiki.net/wiki/RoboRumble"
]
---

# Competition Formats & Rankings

The community behind classic Robocode has developed standardized competition formats to ensure fair comparisons between
bots. These formats define specific battlefield sizes, round counts, and battle configurations used in official
rankings:

- **RoboRumble** — the distributed battle client built into classic Robocode — runs battles and submits results
  to **LiteRumble**
- **LiteRumble** — the external ranking system that tracks scores and displays rankings.

Understanding these standards is crucial for developing competitive bots and participating in community tournaments. For
details on how scoring works across different battle types, see
**[Scoring Systems & Battle Types](./scoring-systems-battle-types.md)**.

> [!NOTE] Platform availability
> RoboRumble is built into **classic Robocode only**. Tank Royale does not yet have an integrated ranking system, though
> the community competition formats and scoring concepts apply to both platforms.

## Why standardized formats matter

Without consistent battle conditions, comparing bot performance becomes meaningless. A bot that excels on small
battlefields might struggle on larger ones. Similarly, different round counts can favor different strategies — some bots
perform better in short bursts, others need time to adapt.

Standardized formats solve this by creating **controlled environments** where bots compete under identical conditions.
This enables:

- **Fair rankings** — All bots face the same challenges
- **Meaningful comparisons** — Performance differences reflect bot design, not battle setup
- **Community consensus** — Shared standards everyone can use and trust
- **Historical continuity** — Rankings remain comparable over time

## RoboRumble & LiteRumble

**[RoboRumble](https://robowiki.net/wiki/RoboRumble)** is the distributed battle client **built into classic Robocode**.
Users can run RoboRumble from within Robocode to contribute battle results to the community rankings. The client
automatically downloads bots, runs battles using standardized formats, and uploads results to the central ranking
server.

**[LiteRumble](https://literumble.appspot.com/)** is the external ranking system that collects all battle results from
RoboRumble clients worldwide and computes the official rankings. It maintains several competition categories:

- **[1v1](./scoring-systems-battle-types.md#1v1-strategy-maximize-damage-efficiency)** — One-on-one dueling rankings
- **[Melee](./scoring-systems-battle-types.md#melee-strategy-survive-and-opportunize)** — Multi-bot survival rankings
- **[Teams](./scoring-systems-battle-types.md#team-strategy-coordinate-for-collective-score)** — Coordinated team battle
  rankings

Visit the [RoboRumble/Enter The Competition](https://robowiki.net/wiki/RoboRumble/Enter_The_Competition) page to learn
how to submit your bot and participate in the rankings.

> [!NOTE] Tank Royale support
> RoboRumble and LiteRumble are not yet available for Robocode Tank Royale. However, the battle formats and competition
> concepts described here can be applied to Tank Royale bot development. But the LiteRumble cannot be used for
> Tank Royale.

## Community competition categories

The Robocode community recognizes three main competitive categories, each with distinct characteristics and strategies.
These battle types use the same scoring system but reward different tactics. For details on how scoring works in each
format, see **[Scoring Systems & Battle Types](./scoring-systems-battle-types.md)**.

### 1v1 (One-on-One)

Pure dueling format where two bots face off in direct combat. Success requires maximizing damage output while
maintaining energy
efficiency. [Learn about 1v1 scoring strategy →](./scoring-systems-battle-types.md#1v1-strategy-maximize-damage-efficiency)

**Key characteristics:**

- Predictable opponent behavior (single target)
- No third-party interference
- Extended engagement duration
- Emphasis on targeting accuracy and movement prediction

### Melee

Multi-bot chaos where 3+ bots battle simultaneously until only one survives. Survival often matters more than raw damage
output. [Learn about melee scoring strategy →](./scoring-systems-battle-types.md#melee-strategy-survive-and-opportunize)

> [!TIP] Fun fact
> The name "Tank Royale" is inspired by Melee battles — they resemble the popular "Battle Royale" game genre where
> multiple players fight until only one remains standing!

**Key characteristics:**

- Unpredictable multi-target environment
- Opportunity to kill stealing and temporary alliances
- High importance of positioning and target selection
- Emphasis on survival over pure aggression

### Teams

Coordinated team battles where multiple bots work together toward a common goal. Communication and role specialization
become
critical. [Learn about team scoring strategy →](./scoring-systems-battle-types.md#team-strategy-coordinate-for-collective-score)

**Key characteristics:**

- Shared team score across all team members
- Potential for role specialization (scout, attacker, support)
- Communication and coordination advantages
- Sacrifice plays for team benefit

## RoboRumble battle standards

RoboRumble (powered by LiteRumble) uses specific standardized formats that have become the de facto competition
standards in the classic Robocode community.

### 1v1 standard format

**Configuration:**

- **Battlefield size:** 800×600 units
- **Rounds per match:** 35 rounds
- **Battle timeout:** 1000 turns per round
- **Participants:** 2 bots

**Why these dimensions?**

The 800×600 battlefield is the **default battlefield size in both classic Robocode and Tank Royale**. This dimension
comes from the popular Super VGA (SVGA) screen resolution that was common when Robocode was created, making it feel
natural and familiar to early players.

The 800×600 battlefield provides enough space for complex movement patterns while preventing excessive hiding or
avoidance tactics. The rectangular shape (4:3 aspect ratio) creates interesting corner dynamics without being too
elongated.

35 rounds ensure statistical significance while keeping match duration reasonable. This length allows adaptive bots to
learn opponent patterns while preventing lucky streaks from dominating results.

**Strategic implications:**

- Medium-sized battlefield favors balanced bots (neither pure close-combat nor extreme long-range specialists)
- Sufficient rounds for pattern recognition and adaptation
- Rectangular shape creates tactical corner positioning opportunities

### Melee standard format

**Configuration:**

- **Battlefield size:** 1000×1000 units
- **Rounds per match:** 10 rounds
- **Battle timeout:** 1000 turns per round
- **Participants:** 10 bots (typically)

**Why these dimensions?**

The square 1000×1000 battlefield provides ample space for multiple bots without overcrowding. The larger size compared
to 1v1 accommodates more complex multi-bot interactions and reduces the impact of early positioning advantages.

Fewer rounds (10 vs 35) reflect the higher variance in melee battles. With more bots, individual matches have more
randomness, so extended series become less meaningful than in 1v1.

**Strategic implications:**

- A large battlefield rewards mobility and positioning over pure firepower
- A square shape eliminates directional biases present in rectangular battlefields
- Fewer rounds mean each battle carries more weight — consistency matters

### Team standard formats

Team battles use various configurations depending on tournament rules, but common standards include:

**Twin Duel (2v2):**

- **Battlefield size:** 800×600 units
- **Rounds per match:** 10 rounds
- **Participants:** 2 teams of 2 bots each

**Team Melee:**

- **Battlefield size:** 1000×1000 units
- **Rounds per match:** 10 rounds
- **Participants:** Variable team sizes (2-5 bots per team)

## How rankings work

Community rankings through RoboRumble (powered by LiteRumble) use sophisticated rating systems to rank bots fairly
across many battles.

### Elo-style ratings

Most modern rankings use Elo-style rating systems (similar to chess rankings) rather than simple win/loss records.

**Key principles:**

- **Expected performance:** Higher-rated bots are expected to score more points against lower-rated opponents
- **Rating adjustments:** Winning against stronger opponents gains more rating points than beating weaker ones
- **Convergence:** Ratings stabilize as bots play more battles, producing accurate skill assessments

### Pairing systems

Rankings use intelligent pairing to ensure comprehensive testing:

- **Priority battles:** New bots fight established references first
- **Balanced matchmaking:** Avoid clustering battles between similar-skill bots
- **Coverage targets:** Ensure all active bots battle each other regularly
- **Seasonal resets:** Periodic fresh starts to account for bot improvements

### Rating reliability

A bot's ranking becomes reliable after fighting a sufficient number of diverse opponents. RoboRumble typically requires:

- **Minimum battles:** 50+ battles against different opponents
- **Opponent diversity:** Battles across the full skill spectrum
- **Temporal distribution:** Battles spread over time to reduce clustering effects

## Participating in rankings

### Submitting bots

To participate in RoboRumble rankings, visit
the [RoboRumble/Enter The Competition](https://robowiki.net/wiki/RoboRumble/Enter_The_Competition) page for detailed
submission instructions. Key requirements include:

1. **Follow naming conventions** — Use consistent bot names and versions
2. **Meet technical requirements** — Ensure bots run on standard configurations
3. **Package properly** — Submit your bot in the correct format with all dependencies
4. **Test thoroughly** — Verify your bot works in the standard environment before submission

### Bot development considerations

When developing bots for competitive rankings:

**Test against standards:**

- Use official battlefield dimensions during development
- Test performance over 35+ round matches
- Validate behavior in standard timeout conditions

**Design for the format:**

- 1v1 bots need different priorities than melee specialists
- Consider battlefield size in movement and targeting algorithms
- Account for standard opponent diversity in adaptive systems

**Monitor performance:**

- Track rating progression over time
- Identify problematic matchups through battle analysis
- Update strategies based on community meta-game evolution

## Historical context

### RoboRumble legacy

RoboRumble established many standards still used today:

- **Continuous competition** — 24/7 automated battles via distributed clients
- **Comprehensive coverage** — Every bot fights every other bot
- **Public results** — Transparent rankings and battle data
- **Community participation** — Anyone can contribute by running the built-in client

### LiteRumble

LiteRumble is the modern ranking server that replaced older systems, providing:

- **Improved pairing algorithms** — Better opponent selection for faster ranking convergence
- **Enhanced rating systems** — More accurate skill assessment
- **Centralized results** — All battle results collected at [literumble.appspot.com](https://literumble.appspot.com/)
- **Reliable infrastructure** — Stable hosting and data management

## Tips for competitive success

**✅ Do:**

- **Design for the standard formats** — Optimize for 800×600 (1v1) and 1000×1000 (melee) battlefields
- **Test extensively** — Validate performance across diverse opponents and conditions
- **Monitor the meta-game** — Adapt strategies as community bot population evolves
- **Focus on consistency** — Reliable performance beats occasional brilliance

**❌ Don't:**

- **Over-optimize for specific opponents** — Rankings test against diverse competition
- **Ignore standard dimensions** — Bots optimized for non-standard battlefields often struggle
- **Submit untested code** — Buggy bots hurt your rating and waste community resources
- **Abandon bots quickly** — Ratings need time to stabilize and reflect true skill

> [!TIP] Start with references
> Before submitting to rankings, test your bot against well-known reference bots to gauge approximate skill level. This
> helps set realistic expectations and identify major weaknesses.

## Next steps

Understanding competition formats provides the foundation for competitive bot development:

- **Energy Management in 1v1 and Melee** — Optimize energy usage for specific formats
- **Targeting Systems** — Develop targeting appropriate for your chosen competitive category
- **Movement & Evasion** — Create movement systems that excel in standard battlefield dimensions
- **Team Strategies** — Learn coordination techniques for team competitions

Competitive Robocode rewards both technical skill and strategic thinking. Understanding the formats is just the
beginning — mastering them requires dedication, testing, and continuous improvement.

## Credits

The Robocode competition infrastructure exists thanks to dedicated community members:

- **Julian Kent ("Skilgannon")** — Creator and maintainer of [LiteRumble](https://literumble.appspot.com/), the ranking
  system that powers community competition. Also maintains [RoboWiki.net](https://robowiki.net/), the primary knowledge
  base for the Robocode community.

The continuous operation of these systems enables the global Robocode community to compete, learn, and improve together.
