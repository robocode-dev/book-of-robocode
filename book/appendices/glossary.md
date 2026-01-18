---
title: "Glossary"
category: "Appendices"
summary: "Quick reference definitions for common Robocode terms, battle formats, and concepts used throughout this book."
tags: [ "glossary", "reference", "terminology", "beginner", "robocode", "tank-royale" ]
difficulty: "beginner"
source: [
  "RoboWiki - Robocode/Glossary (classic Robocode) https://robowiki.net/wiki/Robocode/Glossary",
  "Robocode Tank Royale Docs https://robocode.dev/"
]
---

# Glossary

This glossary defines common terms used throughout The Book of Robocode. Terms are grouped by category for easy
reference.

## Battle formats

Robocode supports three primary battle formats. Each format uses the same scoring system but rewards different
strategies.

### 1v1 (One-on-One / Duel)

A battle between exactly **two bots**. The simplest and most popular competitive format. Success depends on targeting
accuracy, movement prediction, and energy management. With only one opponent, bots can dedicate all resources to
tracking and defeating a single target.

**Key characteristics:**

- Predictable opponent behavior (single target)
- No third-party interference
- Emphasis on targeting accuracy and movement prediction
- Damage output matters more than survival

See: [Scoring Systems & Battle Types](../energy-and-scoring/scoring-systems-battle-types.md#1v1-strategy-maximize-damage-efficiency)

### Melee

A battle with **three or more bots** fighting simultaneously until one remains or time expires. Chaos reigns as bots
must track multiple enemies, avoid crossfire, and make tactical decisions about target selection.

> [!TIP] Fun fact
> The name "Tank Royale" is inspired by Melee battles — they resemble the popular "Battle Royale" game genre where
> multiple players fight until only one remains standing!

**Key characteristics:**

- Multiple simultaneous opponents
- Survival often matters more than damage output
- Opportunity for kill stealing and opportunistic attacks
- Positioning and awareness are critical

See: [Scoring Systems & Battle Types](../energy-and-scoring/scoring-systems-battle-types.md#melee-strategy-survive-and-opportunize)

### Team

A battle where **two or more teams** of bots compete. Team members share a collective score, enabling role
specialization and coordinated tactics. Communication between teammates can provide significant advantages.

**Key characteristics:**

- Shared team score across all members
- Role specialization possible (scout, attacker, support)
- Communication and coordination advantages
- Sacrifice plays can benefit the team

See: [Scoring Systems & Battle Types](../energy-and-scoring/scoring-systems-battle-types.md#team-strategy-coordinate-for-collective-score)

---

## General terms

### Bot

The autonomous agent you program to compete in Robocode battles. In this book, "bot" replaces older terms like "robot"
or "tank" for consistency.

### Bullet power

The energy cost of firing a bullet, ranging from 0.1 to 3.0. Higher power means more damage but slower bullets and
greater energy cost.

### Energy

The resource that powers bot actions. Bots start with 100 energy. Firing bullets costs energy, getting hit loses energy,
and hitting enemies regains energy.

### Gun heat

A cooldown mechanic that prevents continuous firing. Firing increases gun heat; the gun can only fire when heat reaches
zero.

### Intent

The set of commands (move, turn, fire, etc.) your bot issues for the current turn. When you commit the turn (using
`go()` or `execute()`), your bot sends this intent to the game engine.

### Radar

The rotating sensor on top of a bot that detects enemies. Scanning an enemy triggers an event with information about
their position, heading, velocity, and energy.

### Round

A single battle instance within a match. Ends when one bot/team remains or time expires.

### Match

A series of rounds (typically 10-35). The winner is determined by the total score across all rounds.

### Turn

A single game tick. Each turn, bots receive events, make decisions, and submit intents. The game engine processes all
intents simultaneously.

### Units

The measurement system for distance, size, and movement in Robocode. Replaces the older term "pixels" for clarity across
both platforms.

### Wave

An imaginary expanding circle used to track when a bullet could potentially reach a target. Essential for advanced
targeting and movement systems.

---

## Platform-specific terms

### Classic Robocode

The original Java-based Robocode created by Mathew A. Nelson, later maintained by Flemming N. Larsen. Bots extend Java
base classes and run inside a desktop application.

### Robocode Tank Royale

The modern multi-language Robocode platform created by Flemming N. Larsen. Bots connect to a game server via network
protocols and can be written in Java, C#, Python, and other languages.

### RoboRumble

The distributed battle client **built into classic Robocode**. Users run RoboRumble to contribute battle results to
community rankings.

### LiteRumble

The external ranking system (hosted at [literumble.appspot.com](https://literumble.appspot.com/)) that collects
RoboRumble battle results and computes official rankings. Created and maintained by Julian Kent ("Skilgannon").

---

## Movement terms

### Wall smoothing

A technique to avoid walls by adjusting the movement direction as the bot approaches battlefield boundaries.

### Wave surfing

An advanced evasion technique where the bot tracks incoming "waves" (potential bullet positions) and moves to minimize
hit probability.

### GuessFactor

A normalized value (-1 to 1) representing where a bot could be when a bullet arrives, used in statistical targeting and
movement systems.

### Ramming

A combat strategy where a bot deliberately collides with opponents to deal damage. Each collision deals damage based on
relative velocity ($\text{damage} = 0.6 \times \text{relativeVelocity}$) and awards double the damage as points. Ramming
is most effective against stationary, disabled, or low-energy bots. When a bot kills an enemy by ramming, it receives a
30% bonus of all ram damage dealt to that enemy.

See: [Scoring Systems & Battle Types](../energy-and-scoring/scoring-systems-battle-types.md#2-ram-damage-points)

---

## Targeting terms

### Head-on targeting

The simplest targeting method: aim directly at the enemy's current position. Only effective against stationary or
slow-moving targets.

### Linear targeting

Targeting that assumes the enemy will continue moving in a straight line at constant velocity.

### Circular targeting

Targeting that assumes the enemy will continue turning at a constant rate, following a circular path.

### Pattern matching

Advanced targeting that records enemy movement history and searches for repeated patterns to predict future positions.

### Virtual guns

A system that runs multiple targeting algorithms simultaneously, tracking which would have hit most often, and uses the
best performer.
