---
title: "Twin Duel Strategy Guide"
category: "Team Strategies"
summary: >-
  Twin Duel squeezes a 2-bot team into 800x800 units and under 2000 code bytes, so a strong 1v1 bot copied twice
  is rarely enough. This page covers the radar, targeting, and movement adjustments that make two bots fight
  as a team instead of two duelists that happen to share a battlefield.
tags:
  - twin-duel-strategy-guide
  - team-strategies
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Twin Duel (classic Robocode) https://robowiki.net/wiki/Twin_Duel"
  - "RoboWiki - Twin Duel/Strategy Guide (classic Robocode) https://robowiki.net/wiki/Twin_Duel/Strategy_Guide"
---

# Twin Duel Strategy Guide

> [!TIP] Origins
> **Twin Duel** was proposed and organized by **Patrick Cupka (Voidious)** in 2006, with the name suggested by
> **GrubbmGait**, and refined into its current strategy through years of weekly competition by the RoboWiki
> community.

Take a bot tuned for 1v1 duels, run two copies of it in the same battle, and something odd happens: it starts
losing to teams that are individually weaker. [Team Basics](/team-strategies/team-basics) covers the first fix,
knowing who not to shoot, but Twin Duel adds a second constraint no 1v1 bot has ever faced: a hard code budget
and an opponent that can gang up two-on-one.

## A field built to punish sloppy code

Twin Duel runs on an 800x800 unit field for 75 rounds, two bots per team against two bots per team, scored by
average points per second like the [Scoring Systems](/energy-and-scoring/scoring-systems-battle-types) page
describes. The catch is the code size cap: the whole team's `.jar`, shared code included, must measure under
2000 bytes, and reading or writing files is not allowed. Since 2009 the competition runs inside RoboRumble under
an honor system rather than a technical check, but the budget still shapes every design choice.

That budget rules out running full melee logic on both bots. A 2000-byte team has room for a competent 1v1-style
gun and movement, plus a little team glue, not a second complete strategy system. The strategy guide's own
conclusion is blunt: Twin Duel sits between 1v1 and melee, and the winning teams borrow just enough melee thinking
to stop wasting shots and stop dying to two guns at once.

## Give the radar something to do

A spinning or infinity-lock radar built for one enemy already works for two, provided it reverses on the right
trigger: turn the radar back once it has swept less than 180 degrees since the last scan, or once four ticks pass
without a new one. From there, point the radar at whichever enemy has gone longest without a scan, and drop that
enemy from consideration if it leaves 1200 units of range or its last known position turns out to be dead.

Locking onto the current target for a few consecutive scans before firing raises gun accuracy more than firing on
the first look. Splitting scanning duties across the two bots and sharing the results by message is possible, but
it costs a tick of latency and, in a 2000-byte team, more code space than it is usually worth.

## Pick a target, not a coin flip

Two bots against two enemies gives three honest ways to split fire, and each one trades accuracy for tempo:

| Approach | Strength | Weakness |
|---|---|---|
| Both bots hit the leader | Removes the 200-energy bot first (GrauwuarG) | Higher energy demands aggressive aim |
| Both bots hit the non-leader | 100-energy bot dies fast, opening a 2v1 | May be out of position or hard to reach |
| Each bot hits its closest enemy | Best hit rate, easiest to aim | Splits damage, risks a 1v2 if one bot dies |

Whichever approach a team picks, switching targets on a small targetability difference wastes more shots than it
saves. Commit to a target and only re-evaluate when the numbers change by a wide margin.

## Move like it's melee, not a duel

A 1v1-style aggressive movement, close range, perpendicular to the one bot shooting at you, still works when only
one enemy is targeting a bot. It falls apart the moment both enemies fire at the same bot at once, because
perpendicular to one threat can be dead center of the other's aim.

The strategy guide treats a melee-flavored Minimum Risk Movement as the stronger fit for Twin Duel, tuned for
exactly three other bots on the field:

- Move perpendicular only to whichever enemy is actually targeting this bot, not both by default.
- Keep extra distance from the stronger of the two enemies.
- Separate from the teammate bot, so one stray bullet cannot catch both of you and neither of you blocks the
  other's shot.
- Stay out of corners, where minimum-risk movement turns predictable.
- Reverse direction periodically so the movement does not flatten into a pattern an enemy gun can read.
- Stand between the two enemies when it is safe to, so a missed shot from one risks hitting the other.

KomariousTeam tried carrying wave surfing into Twin Duel and ran into the format's core problem directly: surfing
tracks the wave from one gun, but the third enemy bot on the field never stops being a threat while that happens.

<!-- TODO: Illustration
**Filename:** twin-duel-crossfire-position.svg
**Caption:** "A non-leader bot stands between both enemies so a stray shot risks their own teammate instead."
**Viewport:** 8000x8000
**Battlefield:** true
**Bots:**
  - type: friendly, position: (1200, 6200), body: 340, turret: 320, radar: 320
  - type: friendly, position: (4200, 3800), body: 90, turret: 45, radar: 45
  - type: enemy, position: (6600, 1200), body: 200, turret: 220, radar: 220, scale: 0.6
  - type: enemy, position: (2600, 1200), body: 160, turret: 140, radar: 140, scale: 0.6
**Lines:**
  - from: (6840, 1440), via: (4500, 4100), to: (3052, 1779), color: "#F59E0B", arrow: true, dashed: true,
    label: "a miss can hit their own teammate"
  - from: (1600, 6000), to: (2735, 1826), color: "#10B981", arrow: true, dashed: false,
    label: "leader finishes the weakened target"
**Circles:**
  - center: (4500, 4100), radius: 300, color: "#10B981", fill: none, dashed: false, paintOrder: after bots
**Texts:**
  - text: "leader stays at range", position: (1200, 6800), color: "#D2691E"
  - text: "positioned between enemies", position: (4800, 4700), color: "#10B981"
-->

<img src="/images/twin-duel-crossfire-position.svg"
alt="A non-leader bot stands between both enemies so a stray shot risks their own teammate instead."
style="max-width:100%;height:auto;"/><br>
*A non-leader bot stands between both enemies so a stray shot risks their own teammate instead.*

## Platform notes

> [!WARNING] Platform Difference
> Twin Duel is a classic-Robocode-only RoboRumble competition, defined by an 800x800 field and a shared 2000-byte
> code cap. Robocode Tank Royale has no matching ranked ladder or code-size rule.

Tank Royale's [Team Strategies](https://robocode.dev/articles/team-strategies.html) article documents the same
underlying ideas for its own team battles: distributed targeting, focus fire, and crossfire positioning. Without
Twin Duel's byte cap, a Tank Royale team can afford to implement more of that in full rather than borrowing just
enough of it to fit.

## Further Reading

- [Twin Duel](https://robowiki.net/wiki/Twin_Duel) - RoboWiki (classic Robocode)
- [Twin Duel/Strategy Guide](https://robowiki.net/wiki/Twin_Duel/Strategy_Guide) - RoboWiki (classic Robocode)
- [Team Strategies](https://robocode.dev/articles/team-strategies.html) - Tank Royale documentation
