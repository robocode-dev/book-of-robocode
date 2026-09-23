---
title: "Optimization Techniques"
category: "Advanced Topics"
summary: >-
  A gun that hits more often in a quiet test battle can start missing once the CPU is loaded, because the engine
  cuts off a turn that runs too long. This page covers where the time actually goes and how to buy it back.
tags:
  - optimization-techniques
  - advanced-topics
  - advanced
  - robocode
  - tank-royale
source:
  - "RoboWiki - CPU constant (classic Robocode) https://robowiki.net/wiki/CPU_constant"
  - "RoboWiki - kd-tree (classic Robocode) https://robowiki.net/wiki/Kd-tree"
  - "Robocode Tank Royale Docs - Bot API https://robocode.dev/articles/bot-api.html"
---

# Optimization Techniques

> [!TIP] Origins
> **k-d trees** were first explored in the Robocode community by **Chase-san**, prompted by a comment from
> **Corbos**. **Nathaniel Simonton (Simonton)** wrote the first bucket PR k-d tree, and **Rednaxela** optimized
> Java implementations with advanced pruning. The CPU time limit itself was built into the engine and documented
> by the RoboWiki community.

A gun that scores well in a slow, single-battle test can start missing in a full RoboRumble run, on a busier
machine, or against a bot that spawns extra threads. Nothing about the targeting math changed. The turn simply ran
out of time, the engine skipped it, and the gun fired at a stale target or not at all.

## The turn has a budget, not a suggestion

Classic Robocode calibrates a **CPU constant** against the host machine, typically 4 to 8 milliseconds per turn, and
skips any turn whose bot code runs longer than that. A skipped turn isn't a warning, it's a lost turn: no move, no
aim update, no shot. A gun that recomputes a full statistical scan or rebuilds a data structure every turn can blow
through that budget the moment its dataset grows.

> [!WARNING] Platform Difference
> Tank Royale sets the same kind of budget but lets a bot see it coming. `getTurnTimeout()` returns the per-turn
> limit in microseconds, and `getTimeLeft()` returns how much of it remains, so a bot can check its own margin and
> cut expensive work short instead of guessing. See
> [Physics Differences](../tank-royale/physics-differences.md) for both methods.

## Where the time actually goes

Three costs dominate a slow turn, in the order that usually surprises a first-time optimizer:

1. **Linear scans over growing data.** A gun that stores every past wave and rescans all of them for the nearest
   neighbors pays a cost that grows with every round played. [Dynamic Clustering](
   ../targeting/statistical-targeting/dynamic-clustering.md) covers how a k-d tree turns that linear scan into a
   search that grows with the *logarithm* of the data size instead, so a gun with thousands of recorded waves still
   answers in roughly the same time as one with a few hundred.
2. **Trigonometry called more often than it needs to be.** `sin()`, `cos()`, and `atan2()` are not free, and a
   targeting loop that recomputes the same angle for several candidate firing solutions repeats work it already
   did. Compute an angle once per turn and reuse the value, instead of calling the trig function again each time a
   nearby piece of code needs it.
3. **Work that doesn't depend on the current turn at all.** Battlefield dimensions, a bot's own maximum turn rate,
   and a gun's segmentation table are the same on turn 400 as they were on turn 1. Anything that doesn't change
   between turns belongs in a field set once, not a local variable recomputed every time `run()` loops.

## Spend the budget on what changes, not what doesn't

The general rule behind all three costs is the same: **recompute only what the turn actually changed.** A wave
surfing gun only needs to rescore danger for the enemy positions the radar just confirmed. A statistical gun only
needs to update the bins the last scan actually touched. Reaching for "recompute everything, every turn" is the
easiest way to write a bot, and also the easiest way to make it skip turns once real data piles up.

> [!NOTE] Tip
> Profile before optimizing. A gun that spends its time in one expensive nearest-neighbor scan does not benefit
> from micro-optimizing an unrelated loop nearby. Measure which section of the turn is actually slow, then fix
> that section.

## Name the cost

Caching and precomputed structures trade memory and code complexity for speed. A k-d tree is more code than a flat
list, and a cached trig value is a stale value the moment the input angle changes. Overusing early-exit checks
(bail out once `getTimeLeft()` gets low) can also silently degrade a gun's accuracy under load, trading a skipped
turn for a rushed, lower-quality answer. Optimize the section of the turn that is actually measured to be slow,
not the section that looks slow.

## Further Reading

- [CPU constant](https://robowiki.net/wiki/CPU_constant) - RoboWiki (classic Robocode)
- [kd-tree](https://robowiki.net/wiki/Kd-tree) - RoboWiki (classic Robocode)
- [Bot API](https://robocode.dev/articles/bot-api.html) - Tank Royale documentation
- [Dynamic Clustering](../targeting/statistical-targeting/dynamic-clustering.md) - the k-d tree in targeting
- [Physics Differences](../tank-royale/physics-differences.md) - `getTurnTimeout()` and `getTimeLeft()`
- [Testing & Analysis Tools](./testing-analysis-tools.md) - measuring whether a change actually helped
