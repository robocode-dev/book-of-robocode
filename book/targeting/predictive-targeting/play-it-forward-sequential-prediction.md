---
title: "Play It Forward & Sequential Prediction"
category: "Targeting Systems"
summary: >-
  Play It Forward turns a logged movement trail directly into a firing angle without testing a fan of virtual
  bullets, and Sequential Prediction finds the best matching sequence in one linear pass instead of rescanning
  the whole log.
tags:
  - play-it-forward-sequential-prediction
  - targeting
  - predictive-targeting
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Play It Forward (classic Robocode) https://robowiki.net/wiki/Play_It_Forward"
  - "RoboWiki - Sequential Prediction (classic Robocode) https://robowiki.net/wiki/Sequential_Prediction"
  - "RoboWiki - Pattern Matching (classic Robocode) https://robowiki.net/wiki/Pattern_Matching"
  - "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html"
---

# Play It Forward & Sequential Prediction

> [!TIP] Origins
> **Play It Forward** was developed and documented by the RoboWiki community as a faster way to turn a logged
> situation into a firing angle. **Sequential Prediction** comes from outside Robocode: **Fri Mommersteeg** of the
> Eindhoven University of Technology published its linear-time matching algorithm in *Game Programming Wisdom*
> (2002), and the RoboWiki community adapted it for pattern-matching guns.

A [GuessFactor](/appendices/glossary#guessfactor) gun needs an angle for every situation in its log. The direct way
to get one is a virtual bullet: place
a shot at a candidate angle, then check its position against the enemy every turn until it either hits or passes by.
Test a fan of candidate angles and the cost multiplies with each one. These two techniques cut that cost from two
different directions.

## One replay instead of a fan of bullets

Play It Forward stores the same kind of frame as
[Pattern Matching](pattern-matching.md): heading difference and velocity, rather than an absolute heading or a raw
velocity delta, which holds up better across headings and avoids extra bounds-checking. To score a past situation,
start from the enemy's recorded position, heading, and velocity at that tick, then step forward using the frames
that actually followed it in the log, exactly as they happened. Stop once the bullet's travel time for that firing
power runs out, and the endpoint converts directly into the angle that would have hit.

No candidate angle is ever tested. The enemy's own recorded path is the only path replayed, so one pass produces the
exact answer that a fan of virtual bullets could only approximate by trial.

<!-- TODO: Illustration
**Filename:** play-it-forward-replay.svg
**Caption:** "Play It Forward replays the enemy's own logged path once, instead of testing a fan of candidate
angles."
**Viewport:** 8000x5000
**Battlefield:** true
**Description:** From the friendly bot, five thin dashed gray lines fan toward the enemy's old position, each
candidate virtual bullet ending in a small hollow red circle where it missed. A sixth, solid orange line follows
the enemy's actual recorded path and ends exactly on the enemy. A green ring is drawn around the enemy tank,
on top of the bots, so the single correct replay reads clearly against the five near misses.
**Bots:**
  - type: friendly, position: (1300, 3600), body: 40, turret: 66, radar: 66
  - type: enemy, position: (6000, 1500), body: 200, turret: 300, radar: 300
**Lines:**
  - from: (1600, 3900), to: (5400, 2600), color: "#9CA3AF", arrow: false, dashed: true, label: "candidate angle"
  - from: (1600, 3900), to: (5700, 1900), color: "#9CA3AF", arrow: false, dashed: true
  - from: (1600, 3900), to: (5900, 1300), color: "#9CA3AF", arrow: false, dashed: true
  - from: (1600, 3900), to: (5750, 3200), color: "#9CA3AF", arrow: false, dashed: true
  - from: (1600, 3900), to: (6100, 700), color: "#9CA3AF", arrow: false, dashed: true
  - from: (1600, 3900), to: (6300, 1800), color: "#F59E0B", arrow: true, dashed: false, label: "replayed path"
**Circles:**
  - center: (5400, 2600), radius: 90, color: "#EF4444", fill: none
  - center: (5700, 1900), radius: 90, color: "#EF4444", fill: none
  - center: (5900, 1300), radius: 90, color: "#EF4444", fill: none
  - center: (5750, 3200), radius: 90, color: "#EF4444", fill: none
  - center: (6100, 700), radius: 90, color: "#EF4444", fill: none
  - center: (6300, 1800), radius: 330, color: "#10B981", fill: none, label: "drawn on top of the enemy tank"
**Texts:**
  - text: "fan of virtual bullets", position: (2600, 900), color: chocolate
  - text: "one replay of the real path", position: (5100, 4550), color: "#F59E0B"
-->

<img src="/images/play-it-forward-replay.svg"
alt="Play It Forward replays the enemy's own logged path once, instead of testing a fan of candidate angles."
style="max-width:100%;height:auto;"/><br>
*Play It Forward replays the enemy's own logged path once, instead of testing a fan of candidate angles.*

## Fast PIF: a rotation instead of repeated trigonometry

A direct replay still calls sine and cosine once per simulated tick, and that adds up across a long log. Fast PIF
rotates and translates the battlefield so the situation's starting heading lines up with a fixed reference
direction before the replay begins. The stored frames then advance the point using plain addition, with no
per-tick trigonometry, and only the final predicted point needs one rotation and translation back into real
battlefield coordinates. The replay produces the same angle either way. Fast PIF only removes repeated work.

## Sequential Prediction: the best match in one pass

[Pattern matching](/appendices/glossary#pattern-matching) needs the best, usually longest, matching sequence before
it can replay anything, and comparing
the newest frames against every earlier window costs more with each tick added to the log. Sequential Prediction
finds the longest match ending at every position in a single linear pass instead.

The idea rests on one fact: the match ending at the newest frame is one longer than the match that ended the last
time the previous frame's value appeared, provided the same frame followed it. Track, for each frame value, where it
last occurred and how long a match ended there. If the frame now following that repeated value matches the current
one, extend it by one. Otherwise, the match at this tick resets to one.

```txt
lastMatchLength = map from frame value to its match length at its most recent occurrence
lastSeen = map from frame value to the tick it most recently occurred at

for each new frame f at tick t:
    previous = frame at tick t - 1
    if lastSeen[previous] exists and frameAt(lastSeen[previous] + 1) == f:
        matchLength[t] = lastMatchLength[previous] + 1
    else:
        matchLength[t] = 1
    lastMatchLength[f] = matchLength[t]
    lastSeen[f] = t
```

Turn rate tops out at $10 - 0.75|v|$ degrees per turn and speed is capped at 8 units per turn, so each frame
quantizes into a small alphabet of discrete heading-difference and velocity values, exactly what a symbol-matching
algorithm like this one needs. Because it reports every match length it finds in a single pass rather than only the
longest one, a gun can feed several pattern lengths into a virtual-gun array at once instead of committing to one
window size ahead of time.

## Platform notes

The log, the replay, and the matching algorithm depend only on movement rules that classic Robocode and Tank Royale
share. Store heading differences in one consistent internal convention and convert only at the boundary, since
classic Robocode headings are compass-style while Tank Royale headings are mathematical.

## Further Reading

- [Play It Forward](https://robowiki.net/wiki/Play_It_Forward) - RoboWiki (classic Robocode)
- [Sequential Prediction](https://robowiki.net/wiki/Sequential_Prediction) - RoboWiki (classic Robocode)
- [Pattern Matching](https://robowiki.net/wiki/Pattern_Matching) - RoboWiki (classic Robocode)
- [Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation
