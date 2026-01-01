---
title: "Spinning Radar"
category: "Radar & Scanning"
summary: "A simple radar pattern that keeps turning forever to find enemies quickly, then switches to a tighter lock in 1v1."
tags: [ "spinning-radar", "radar", "scanning", "setters", "one-on-one", "robocode", "tank-royale", "intermediate" ]
difficulty: "intermediate"
source: [
  "RoboWiki – One on One Radar (classic Robocode) https://robowiki.net/wiki/One_on_One_Radar"
]
---

# Spinning Radar

A spinning radar is the simplest radar strategy: keep the radar turning all the time so it eventually sweeps over every
enemy bot.

It is especially useful at the start of a round (or after losing contact) because it is a reliable way to *discover*
opponents.

## Why spin the radar?

A stationary radar goes blind quickly. A spinning radar fixes that by ensuring the radar beam keeps covering the whole
battlefield.

Spinning radar is most valuable for:

- **Discovery:** getting the first scan as fast as possible.
- **Reacquire:** finding an enemy again after it has not been scanned for a while.
- **Simple melee awareness:** steadily collecting scan data on multiple enemies.

In 1v1, spinning forever is usually not optimal. Once the enemy is found, frequent re-scans of *that one bot* are more
important than sweeping empty space.

<!-- TODO: Illustration -->
<!-- Show a top-down arena with a bot and a radar beam spinning 360° and intersecting an enemy. -->

<img src="../../images/spinning-radar.svg" alt="Spinning Radar Illustration" width="600"><br>
*Top-down arena view: a bot with a radar beam spinning 360°, sweeping the battlefield and intersecting an enemy.*

## The one-liner: use a setter with an “infinite” turn

Most APIs offer a setter-style radar turn method. The classic spinning radar pattern is set up once, before the main loop:

Conceptual pseudocode:

```text
// Before the main loop (e.g., in run()):
turnRadarLeft(INFINITY)

// Main loop:
while (true) {
    // If an enemy is found, break the infinite spin by setting a specific radar turn
    if (enemyFound) {
        setTurnRadarRight(targetBearing - currentRadarHeading)
    }
    // Commit the turn (Classic: execute(); Tank Royale: go())
    commitTurn()
}
```

- `turnRadarLeft(INFINITY)` (or `turnRadarRight(INFINITY)`) is called once to start spinning the radar and searching for enemies.
- Once an enemy is found, use `setTurnRadarRight()` or `setTurnRadarLeft()` to lock onto the target or adjust the sweep.
- Each turn, commit your intent with `execute()` (Classic) or `go()` (Tank Royale).

Notes:

- It does not matter if you turn left or right for the initial spin.
- What “INFINITY” means depends on language:
    - a huge number (e.g., 1e9 degrees), or
    - a symbolic constant (like positive infinity) if the language supports it.
- The key is to set the infinite spin only once, not every turn.

## Setters overwrite: last command wins

Setter-style calls update intent for the current turn. If the same setter is called multiple times in a single turn, the
**last call wins**.

That can be handy when radar logic is refined step-by-step:

- start with `setTurnRadarLeft(INFINITY)` while searching,
- later in the same turn, once an enemy is found, update the intent to a tighter turn,
- then commit the turn.

This “overwrite” behavior also makes recursion or multi-pass calculations practical: the final decision is simply the
last intent set before `execute()` / `go()`.

## When to stop spinning in 1v1

In a one-on-one battle, once the opponent is found, the radar should usually switch to a **lock** pattern:

- Turn the radar toward the enemy’s last known bearing.
- Overshoot a bit so the beam crosses the enemy even if both bots turn.
- If scans stop arriving, fall back to a wide spin again.

A simple state-machine mindset works well:

- **Searching:** spin radar.
- **Tracking:** lock radar.
- **Lost contact:** spin again.

## Platform notes (Classic vs Tank Royale)

The idea is the same on both platforms: keep the radar moving so scans keep happening.

The main practical difference is how turns are “committed” when using setters:

- **Classic Robocode:** setters queue intent, and `execute()` ends the turn.
- **Robocode Tank Royale:** setters queue intent, and `go()` ends the turn.

If a bot only calls setters but never commits the turn, it will look stuck because the engine is never asked to advance.

## Tips and common mistakes

- **Forgetting to commit the turn:** setter-only bots must call `execute()` / `go()` every turn.
- **Spinning forever in 1v1:** it works, but locking usually gives more frequent scans.
- **Coupled radar:** if the radar is dragged around by body/gun turns, the “spin” might not behave as expected.
  (See [Radar Basics](../radar-basics).)

## Related pages

- [Radar Basics](../radar-basics) — scan geometry, events, and lock vs sweep
- One-on-One Radar — spinning radar, infinity lock, and “perfect lock” patterns (planned)
