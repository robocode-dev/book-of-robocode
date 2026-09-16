---
title: "Pattern Matching"
category: "Targeting Systems"
summary: >-
  Pattern matching searches an enemy movement log for a recent sequence seen before, then replays what followed it.
tags: ["pattern-matching", "targeting", "predictive-targeting", "advanced", "robocode", "tank-royale"]
difficulty: "advanced"
source:
  - "RoboWiki - Pattern Matching (classic Robocode) https://robowiki.net/wiki/Pattern_Matching"
  - "RoboWiki - Symbolic Pattern Matching (classic Robocode) https://robowiki.net/wiki/Symbolic_Pattern_Matching"
  - "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html"
---

# Pattern Matching

> [!TIP] Origins
> **Pattern Matching** was pioneered in classic Robocode by early log-based bots, including David Mold's MogBot, and
> was explored further by **David Alves** and the RoboWiki community.

An enemy that repeats a turn-and-speed sequence can defeat a linear gun without becoming unpredictable. Pattern
matching notices the sequence instead of assuming constant velocity. It looks for the enemy's recent movement in its
own history, then plays forward the movements that followed the best earlier match.

This is **log-based targeting**. Its prediction comes from a past trace, not from a GuessFactor histogram.

## What belongs in the log?

Record one compact movement frame after each scan: velocity and heading change are a useful start. Absolute headings
are usually less useful because the same orbit can occur on another side of the battlefield. A log may also note wall
contacts or a symbolic state such as accelerating, braking, or turning left.

Compare the newest $m$ frames with every older candidate sequence. One simple match score is
$S = \sum_{i=0}^{m-1}(\alpha|v_i-v'_i| + \beta|r_i-r'_i|)$. Here $v$ is velocity, $r$ is heading change, and
$\alpha$ and $\beta$ set their relative importance. The smallest score is the closest historical match.

<!-- TODO: Illustration
**Filename:** pattern-matching-log-replay.svg
**Caption:** "A recent movement sequence finds a similar sequence in the log, whose following frames predict a path."
**Viewport:** 8000x5000
**Battlefield:** false
**Description:** Top panel: the movement log as one bar per frame of heading change. The newest blue frames match an
earlier blue sequence, and a chocolate arrow labeled "search the log" links them. The orange frames that followed the
match are copied past a dashed "now" line as dashed replay bars. Bottom panel: a small battlefield where the replay
becomes an orange dotted path from the enemy to a crosshair, and the friendly bot aims a dashed blue line at it.
**Bots:**
  - type: enemy, position: (1160, 3960), body: 85, turret: 70, radar: 70, scale: 0.6
  - type: friendly, position: (6360, 4060), body: 300, turret: 289, radar: 289, scale: 0.6
**Texts:**
  - text: "best match in log", position: (2442, 2080), color: #60A5FA
  - text: "what followed", position: (3447, 2080), color: #F59E0B
  - text: "recent frames", position: (5926, 2080), color: #60A5FA
  - text: "search the log", position: (4184, 600), color: chocolate
  - text: "replay after match", position: (2700, 3950), color: #F59E0B
  - text: "predicted position", position: (3468, 3663), color: #F59E0B
-->

<img src="/images/pattern-matching-log-replay.svg"
alt="A recent movement sequence finds a similar sequence in the log, whose following frames predict a path."
style="max-width:100%;height:auto;"/><br>
*A recent movement sequence finds a similar sequence in the log, whose following frames predict a path.*

## Replay until the bullet can arrive

Start at the enemy's current location and heading, not at the old location. Apply the stored velocity and turn change
that came after the matching sequence. Continue until the bullet distance, using $20 - 3P$ units per turn for firepower
$P$, reaches the replayed position. The final point supplies the gun bearing.

```txt
pattern = newest frames in log
match = earlier log position with the lowest sequenceScore(pattern)
prediction = enemy's current position and heading

for each frame after match while bullet has not caught prediction:
    prediction.heading += frame.headingChange
    prediction.position = advanceWithPhysics(prediction, frame.velocity)
aim at prediction.position
```

Apply wall and turn constraints during replay. A historical trace that ran near a different wall may otherwise predict a
path that leaves the battlefield. If no convincing match exists, fall back to a simpler gun rather than trusting a
weak coincidence.

## Strengths, limits, and compact variants

Pattern matching shines against repeatable movement and is especially attractive in NanoBots and MicroBots, where a
small log can use less code than a broad statistical gun. Symbolic pattern matching trades exact numerical frames for
characters, allowing efficient string searches after movement has been classified into a few states.

It struggles against random motion, frequent reversals, and movement that changes after the gun fires. An anti-pattern
matcher can intentionally alter a sequence just enough to destroy the match. Short patterns find more candidates but
are vague. Long patterns are specific but often have no useful earlier occurrence.

## Platform notes

The log, matching score, replay, and bullet-speed rule carry directly between classic Robocode and Tank Royale. Store
relative heading changes in a consistent internal angle unit. Only the conversion between platform headings and that
internal representation differs.

## Further Reading

- [Pattern Matching](https://robowiki.net/wiki/Pattern_Matching) (RoboWiki, classic Robocode)
- [Symbolic Pattern Matching](https://robowiki.net/wiki/Symbolic_Pattern_Matching) (RoboWiki, classic Robocode)
- [Physics](https://robocode.dev/articles/physics.html) (Tank Royale documentation)
