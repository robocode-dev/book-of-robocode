---
title: "Distancing"
category: "Movement & Evasion"
summary: "Distancing is the movement skill of choosing and maintaining a useful range to opponents so there is more time and space to dodge. Dynamic distancing adapts that range as the fight changes."
tags: [ "distancing", "movement", "evasion", "melee", "1v1", "classic-robocode", "tank-royale", "intermediate" ]
difficulty: "intermediate"
source: [
  "RoboWiki - Distancing (classic Robocode) https://robowiki.net/wiki/Distancing",
  "RoboWiki - Talk:Dynamic Distancing (classic Robocode) https://robowiki.net/wiki/Talk:Dynamic_Distancing"
]
---

# Distancing

> [!TIP] Origins
> **Distancing** and **Dynamic Distancing** concepts were developed and documented by the RoboWiki community.

Distancing is the movement idea of deliberately choosing a range to opponents instead of letting range happen by
accident. Distance changes bullet flight time, how much room there is to maneuver, and how easy it is for either bot to
aim.

A useful default is: **more opponents usually means a larger preferred distance**. With fewer opponents (or an opponent
that rarely hits), playing closer can be reasonable.

## Why distance matters

Distance is not just a number on the screen. It changes several “physics of decision-making” effects:

- **Time to react:** bullets take longer to arrive at long range, so there is more time to change direction.
- **How crowded the fight feels:** close fights reduce escape options, especially near walls.
- **How much position changes matter:** at close range, small sideways moves change the angle to the enemy more.
- **Wall pressure:** long, sweeping movement arcs need space. Too close to a border makes many movement choices illegal
  or predictable.

Distancing is often easiest to think of as “how much space is available for the next 1–2 seconds of movement.”

## Distancing goals in different situations

### Many bots (melee)

In melee, threats arrive from multiple directions. A common distancing goal is to avoid being in the middle of a local
cluster.

Keeping more distance tends to help because:

- there is more room to route around groups,
- accidental ramming and body-blocking happens less,
- crossfire is easier to escape when bullets have more travel time.

This does not mean staying in a corner. Walls remove escape space, so “far from opponents” must be balanced with “not
pinned against a border.”

### One-on-one (or just a couple of bots)

With fewer opponents, the range can be shorter because:

- there is less risk of being surrounded,
- the movement problem is simpler (one main threat),
- moving closer can increase how much a small lateral move changes the opponent’s aiming angle.

A practical rule of thumb: keep enough distance to avoid getting stuck near walls, but not so much that movement becomes
wide and slow to adjust.

### Against a weaker opponent

If an opponent is consistently missing, reducing distance can be a reasonable choice. The goal is not “get close because
close is better,” but “reduce distance because the risk is low and the round ends sooner.”

## Dynamic distancing (the idea)

Dynamic distancing means the preferred distance is not fixed. Instead, the bot continuously adjusts the desired
distance based on context.

When the situation becomes more dangerous (for example, in a crowded melee), the usual adjustment is to **increase the
preferred distance**. In calmer situations, the preferred distance can be smaller.

Typical inputs for a dynamic distancing rule:

- **Threat level:** if hits are frequent or damage spikes, increase preferred distance.
- **Crowding (melee):** if the nearby area becomes busy, increase preferred distance from the crowd.
- **Wall pressure:** if current movement options are limited by borders, bias toward regaining space.
- **Round tempo:** if the opponent is weak or the field is quiet, the bot can accept slightly shorter distance.

The key is smoothness: dynamic distancing should gently “steer” range over time, not oscillate wildly between too close
and too far.

## A simple control model (pseudocode)

One convenient way to implement distancing is to treat it like a feedback controller:

- `d` is current distance to the main threat.
- `dTarget` is the desired distance right now.
- `error = d - dTarget` is positive if the bot is too far, negative if too close.

```text
// Pick a base distance for the current mode.
dTarget = (mode == MELEE) ? 650 : 450

// Adjust based on context.
dTarget += clamp(threatLevel * 120, 0, 200)
dTarget += clamp(crowding * 80, 0, 200)
dTarget -= clamp(enemyIsWeak * 100, 0, 150)

error = d - dTarget

// Use error to bias the next movement choice.
// Example: pick destinations/headings that decrease |error|
// while still respecting wall-avoidance and your main evasive movement.
moveWithRangeBias(error)
```

> [!NOTE] clamp
> `clamp(x, min, max)` means: if `x` is less than `min`, use `min`; if `x` is more than `max`, use `max`; otherwise use
`x`.

The function `moveWithRangeBias(error)` is a conceptual placeholder: it means to move in a way that reduces the
difference between your current distance and your desired distance, while still prioritizing safety and your main
movement style. For example, if you are too close, bias your movement to increase distance; if too far, bias to decrease
distance. The actual movement method can be circling, waypoint, random, or any style, as long as it steers toward your
target distance.

This approach does not require a specific movement style—the “range bias” concept can be incorporated into random
movement, waypoint navigation, orbiting, or any advanced evasive system.

## Tips and common mistakes

- **Avoid a single magic number.** A fixed distance breaks down near walls and in crowded melees.
- **Do not chase distance at all costs.** If the safest move increases error for a moment, take the safe move.
- **Change distance smoothly.** Abrupt shifts can create predictable patterns (for example, repeated straight-line
  retreats).
- **Remember wall space is part of distance.** “Far away” is not helpful if the bot has no room to turn.

<img src="../../images/dynamic-distancing.svg" alt="Dynamic distancing: preferred distance increases in crowded situations" width="800"><br>
*Illustration: Dynamic distancing. The preferred distance is larger when the area is crowded.*

## Further Reading

- [Distancing](https://robowiki.net/wiki/Distancing) — RoboWiki (classic Robocode)
- [Talk:Dynamic Distancing](https://robowiki.net/wiki/Talk:Dynamic_Distancing) — RoboWiki (classic Robocode)

