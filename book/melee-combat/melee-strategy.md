---
title: "Melee Strategy"
category: "Melee Combat"
summary: >-
  A ten-bot melee is not one battle, it is four battles back to back, and the tactics that keep a bot alive in
  the opening chaos are often the ones that get it killed once only three bots remain.
tags:
  - melee-strategy
  - melee-combat
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Melee Strategy (classic Robocode) https://robowiki.net/wiki/Melee_Strategy"
  - "RoboWiki - Melee (classic Robocode) https://robowiki.net/wiki/Melee"
---

# Melee Strategy

> [!TIP] Origins
> **Melee strategy** was developed and documented by the RoboWiki community, distilled from years of
> [RoboRumble](/appendices/glossary#roborumble)
> melee results into a single strategy guide.

In a [1v1](/appendices/glossary#_1v1-one-on-one-duel) duel a bot always knows exactly one thing: who is shooting
at it. Drop that same bot into a [melee](/appendices/glossary#melee) with
nine enemies, and the question changes to which one is shooting at it, a question that gets harder or easier to
answer as bots die and the field shrinks.
[Scoring Systems & Battle Types](/energy-and-scoring/scoring-systems-battle-types) already covers why survival
dominates that scoring. This page covers how the goal itself changes as the bot count drops.

## Four battles in one

A ten-bot melee is not one battle, it is four, and each one rewards different behavior:

- **Around 10 bots**: bots in poor starting positions die fast, so even basic targeting scores kills. The chaos
  is too thick for careful play to matter yet.
- **6 to 7 bots**: the fight settles into corners and crossfires. A hit rate below 25-30% starts to lose fights
  outright, and the goal sharpens: be targeting one bot while no bot targets back.
- **3 to 4 bots**: survivors camp corners and snipe across the arena. Watch who dies next. If it is the bot
  across from a bot instead of the one it was aiming at, that bot is probably next.
- **The final duel**: once it is down to two, the format has quietly become 1v1. Targeting decides it now, a
  bot's gun against the other's movement, and
  [Energy Management in 1v1 and Melee](/energy-and-scoring/energy-management-1v1-melee) covers that fight
  directly.

Treating every phase like the first one is the most common melee mistake: a bot that still fights like it has
nine buffers left, once only two remain, has already lost the fight it does not know it is in.

## Guess who is aiming back

A bot cannot see every enemy's gun, but it can estimate who is likely aiming at it with a count instead of a
guess. For each enemy still alive, count how many other bots are closer to that enemy than this bot is. If the
count comes back 0 or 1, that enemy is probably choosing this bot as its target, since most targeting logic
defaults to the closest available enemy.

<!-- TODO: Illustration
**Filename:** melee-closest-target-heuristic.svg
**Caption:** "A bot with 0 or 1 rivals closer to an enemy than itself is probably that enemy's target."
**Viewport:** 8000x5000
**Battlefield:** true
**Bots:**
  - type: friendly, position: (2600, 3100), body: 60, turret: 60, radar: 60
  - type: friendly, position: (6000, 3400), body: 320, turret: 320, radar: 320
  - type: friendly, position: (900, 900), body: 210, turret: 210, radar: 210
  - type: enemy, position: (3760, 1360), body: 180, turret: 180, radar: 180, scale: 0.6
**Lines:**
  - from: (3067, 3127), to: (3765, 1984), color: "#EF4444", arrow: true, dashed: false,
    label: "closest to the enemy"
  - from: (6064, 3484), to: (4332, 1903), color: "#6B7280", arrow: false, dashed: true,
    label: "farther from the enemy"
  - from: (1517, 1245), to: (3554, 1536), color: "#6B7280", arrow: false, dashed: true,
    label: "farther from the enemy"
**Texts:**
  - text: "0 bots closer to it: probably its target", position: (2900, 3800), color: "#EF4444", anchor: middle
-->

<img src="/images/melee-closest-target-heuristic.svg"
alt="A bot with 0 or 1 rivals closer to an enemy than itself is probably that enemy's target."
style="max-width:100%;height:auto;"/><br>
*A bot with 0 or 1 rivals closer to an enemy than itself is probably that enemy's target.*

## Pick a target, not just the closest one

The closest enemy is the default target for good reason: it is the easiest to hit, and short range hides a lot
of targeting mistakes. Two situations are worth breaking that default for. An enemy already firing at this bot is
worth taking out even if it is not the nearest, since removing it stops the energy drain directly. An enemy at
low energy is worth finishing over a healthier, closer one, since the kill bonus and the survival points both
favor whoever lands that last hit.

Switching targets on every scan wastes more than it gains. The classic guideline is concrete: only switch when
the new target is meaningfully closer, on the order of 100 units or 10% of the current distance, not on every
tick a slightly closer bot wanders past.

## Spend bullets like the phase demands

Early in a melee, close range makes even a weak, semi-linear shot land, so firing a strong bullet close in is
rarely wasted the way it would be in a 1v1 opening. Late in a melee, mercy is not a strategy: a low-energy enemy
left alive just gets to fire again next turn, so finish it. The one universal mistake worth guarding against at
any phase is firing at an angle that clears the arena entirely. A shot into open wall space is a wasted turn of
gun heat no matter which phase of the fight it happens in.

## Further Reading

- [Melee Strategy](https://robowiki.net/wiki/Melee_Strategy) - RoboWiki (classic Robocode)
- [Melee](https://robowiki.net/wiki/Melee) - RoboWiki (classic Robocode)
