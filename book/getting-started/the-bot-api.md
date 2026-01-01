---
title: "The Bot API"
category: "Getting Started"
summary: "Learn how the Robocode engine and your bot communicate: turns, commands, scanning, events, and timeouts."
tags: [ "api", "events", "turns", "robocode", "tank-royale", "beginner" ]
difficulty: "beginner"
source: [
  "Robocode Tank Royale Docs - Bot API"
]
---

# The Bot API (Beginner Level)

This page explains how the game engine and your bot communicate:

- The game is a **turn-based simulation**.
- Each turn your bot reads the current state and **issues commands**.
- The engine performs the simulation step and then sends your bot **events** (scan, hits, collisions, etc.).

We intentionally stay language-agnostic. Examples talk in terms of “API methods”, “events”, and “properties”, not
specific classes.

> **Applies to:** Classic Robocode & Robocode Tank Royale

---

## 1. Scanning and the 1200-unit scan arc

The radar’s job is to answer one question: **Where are the enemy bots?** It does this by sweeping a **scan arc** over
the battlefield.

Only bots that are both:

- Within **1200 units** distance, and
- Inside the swept sector formed by the radar’s movement this turn

will be detected during that scan.

![Radar scanning enemies — shaded wedge shows the 1200-unit scan arc; enemies inside the sector are detected](../images/scanning-enemies.svg)<br>
*Radar sweep showing the scan arc (up to 1200 units) and detected enemies within the sector.*

If you don’t turn the radar at all in a turn:

- Sweep = 0, so the arc collapses into a thin beam.
- Only bots exactly along that beam direction will be detected.

![Bot with a large shaded radar sweep showing the previous and current radar heading](../images/radar-sweep.svg)<br>
*Wide radar sweep: covers a large arc to detect enemies*

![Bot where the radar sweep is a beam with the previous and current heading lying on top of each other](../images/radar-beam.svg)<br>
*Narrow radar sweep: a thin beam for precise tracking*

### 1.1 Scanning each turn

On every turn, the scanning process conceptually is:

1. Take the radar’s **previous heading** (from the end of the last turn).
2. Apply your radar turn command to get the **current heading**.
3. Compute the **radar sweep** (the angle between previous and current heading, along the turned path).
4. Form the **scan arc**: a sector covering every angle between the previous and current radar headings, out to 1200
   units.
5. Any enemy whose position lies inside this swept sector is **scanned**, and the engine sends your bot a scan event.

The engine does **not** remember enemies for you. Your code should:

- Store the latest scan data you care about.
- Use it to aim the gun and decide movement.
- Adjust radar turns: use **wide sweeps** while searching and **narrow sweeps** when you want a lock.

---

## 2. Collisions, bullets, and energy changes

### 2.1 Bullet power, speed, and energy

When you fire the gun, you choose a **bullet power**. The Bot API then:

- **Subtracts energy** from your bot based on the power.
- Launches a bullet in the direction of the gun heading if the gun is cooled down enough.
- Sets the bullet’s **speed** and **damage** based on its power.

When your bullet hits an enemy:

- The enemy **loses energy**.
- Your bot **regains some energy** as a reward.

### 2.2 Collision types

Common collision types include:

- Bot vs wall
- Bot vs bot
- Bullet vs bot
- Bullet vs bullet

(Exact event names differ between classic Robocode and Tank Royale, but the concepts are the same.)

---

## 3. Rounds, turns, and time limits

### 3.1 Rounds vs turns

Robocode-style games are **turn-based simulations**.

- A **turn** (also called a tick) is one discrete step.
    - Your bot’s code runs once per turn.
    - You read state and issue commands.
- A **round** is a complete battle from start to finish.

### 3.2 Turn timeouts and skipped turns

Each turn, your bot is given a **time budget** to run its code. If your code does not finish in time:

- The turn can be **skipped** for your bot.
- Movement and fire commands might be delayed or ignored.
- The API may trigger a skipped turn event or warning.

Good practice:

- Keep per-turn logic fast and predictable.
- Spread heavy computations over multiple turns if needed.

---

## 4. Events in the Bot APIs

Robocode uses an **event-driven** model: the engine calls your bot with events describing what just happened.

### 4.1 Common event types

Exact names differ by API, but conceptually:

- Round / game lifecycle (round started/ended, bot death)
- Per-turn / tick callback
- Scanning (enemy scanned)
- Bullet events (hit, missed, hit bullet)
- Collision events (hit wall/bot, got hit)
- Error / timeout (skipped turn)

### 4.2 Connecting it all

- The **bot anatomy** (body, gun, radar, energy) defines what you *can* control.
- The **Bot API** gives you:
    - Commands to move/turn/fire
    - Controls for chaining vs independence
    - Events to react to

---

## 5. Where to go next

If you haven’t yet, read:

- [Bot Anatomy](./bot-anatomy)

Next, learn one of the most important “tick model” details:

- **Blocking vs Non-Blocking Movement (Setters)** — why blocking movement methods can prevent you from issuing radar/gun
  commands every turn.

