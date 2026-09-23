---
title: "Debugging Tips"
category: "Appendices"
summary: >-
  A bot's bugs rarely show up as exceptions. They show up as a gun that quietly aims at the wrong point or a
  movement that stalls at a wall. This page covers how to see what a bot is actually thinking, not just whether
  it crashed.
tags:
  - debugging-tips
  - appendices
  - beginner
  - robocode
  - tank-royale
source:
  - "RoboWiki - Robocode/RobocodeAPI (classic Robocode) https://robowiki.net/wiki/Robocode/RobocodeAPI"
  - "Robocode Tank Royale Docs - Bot API https://robocode.dev/articles/bot-api.html"
  - "Robocode Tank Royale Docs - Testing & Debugging Guide https://robocode.dev/articles/testing-guide.html"
---

# Debugging Tips

> [!TIP] Origins
> Console and graphical debugging were built into classic Robocode's engine by **Mathew A. Nelson (Mat Nelson)**.
> **Flemming Nørnberg Larsen (fnl)** carried the same graphical debugging model into **Robocode Tank Royale** as
> `getGraphics()`.

A bot that throws an exception is easy to fix, the stack trace points right at the bug. A bot that just fires at
the wrong angle, or stops turning its radar for no visible reason, gives nothing back. The value it computed was
wrong, and by the next turn that value is gone. Debugging a bot means making that value visible before it
disappears.

## Print what the bot is thinking, not just that it ran

A `println` at the point a decision gets made beats a breakpoint that halts a whole battle mid-turn. Print the
values that fed the decision, not just a message that the code was reached:

```java
System.out.println("bearing=" + bearing + " power=" + firePower + " dist=" + distance);
```

Gate this behind a `DEBUG` flag so it can be switched off without deleting it. A gun that logs every candidate
firing angle every turn produces a wall of text that hides the one line that mattered, so log only at the decision
points, not inside every loop iteration.

## Draw it instead of reading numbers

A column of coordinates is hard to picture, a dot on the battlefield is not. Both platforms let a bot paint
directly onto the battlefield during a battle, which turns a targeting bug into something visible instead of
something inferred from a log.

> [!WARNING] Platform Difference
> Classic Robocode overrides `onPaint(Graphics2D g)` and calls `getGraphics()` from inside it. Tank Royale checks
> `isDebuggingEnabled()` and calls `getGraphics()` directly, which returns an `IGraphics` canvas with its own
> drawing methods (`setStrokeColor`, `fillRectangle`, and similar), instead of Java's `Graphics2D`.

A gun that predicts an enemy's future position can draw a small circle at that prediction every turn. If the
circle drifts away from where the enemy actually ends up, the bug is in the prediction math, not somewhere else in
the bot. This narrows a search that could otherwise span the whole gun.

## Isolate the turn that broke

A bot that behaves correctly for 50 rounds and then misfires once is hard to catch live. Record the turn number
and the relevant state the moment something looks wrong, then reproduce that single turn instead of rerunning the
whole battle and hoping to catch it again. [Testing & Analysis Tools](../advanced/testing-analysis-tools.md) covers
tools built for exactly this: replaying one recorded encounter instead of a full battle.

## Suspect the turn budget before the math

A gun that works in isolated testing but goes stale in a full battle is not always wrong, it can be a
[skipped turn](../advanced/optimization-techniques.md). Before debugging the targeting formula itself, confirm the
turn actually ran. A cheap way to check: log the turn number at the top of `run()`'s loop body and look for gaps.

## Name the cost

Debug output and paint calls cost turn time too. A gun that logs every turn while chasing a rare bug can push
itself into the same skipped-turn problem it's trying to diagnose. Turn debug output off once the bug is found,
and prefer painting only the specific values in question over painting the bot's entire internal state every
turn.

## Further Reading

- [Robocode/RobocodeAPI](https://robowiki.net/wiki/Robocode/RobocodeAPI) - RoboWiki (classic Robocode)
- [Bot API](https://robocode.dev/articles/bot-api.html) - Tank Royale documentation
- [Testing & Debugging Guide](https://robocode.dev/articles/testing-guide.html) - Tank Royale documentation
- [Testing & Analysis Tools](../advanced/testing-analysis-tools.md) - replaying one recorded encounter
- [Optimization Techniques](../advanced/optimization-techniques.md) - why a turn gets skipped
