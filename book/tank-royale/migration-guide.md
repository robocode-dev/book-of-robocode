---
title: "Migration Guide"
category: "Robocode Tank Royale Differences"
summary: "Port a working classic Robocode bot to Robocode Tank Royale step by step, in the order that catches the
  most bugs first."
tags: ["migration-guide", "tank-royale", "advanced", "robocode", "porting"]
difficulty: "advanced"
source:
  - "RoboWiki - Robocode/RobocodeAPI (classic Robocode) https://robowiki.net/wiki/Robocode/RobocodeAPI"
  - "Robocode Tank Royale Docs - Bot API https://robocode.dev/articles/bot-api.html"
  - "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html"
---

# Migration Guide

> [!TIP] Origins
> **Robocode Tank Royale** was created by **Flemming Nørnberg Larsen (fnl)**, the long-time maintainer of classic
> Robocode, to keep the same competitive game alive on a modern, language-agnostic engine.

A bot that took a season to tune in classic Robocode does not need a rewrite for Tank Royale. It needs a pass through
a checklist, applied in an order that turns compiler errors into logic errors before logic errors turn into silent
losses. Skip the order and a heading-sign bug can hide behind a dozen unrelated compile errors for an afternoon.

This guide assumes the bot already works in classic Robocode, and it does not repeat the individual differences: see
[API Changes](./api-changes.md) for the renamed classes and methods, and [Physics Differences](./physics-differences.md)
for the angle, turn-sign, and hitbox changes.

## 1. Swap the base class first

Replace `Robot`, `AdvancedRobot`, or `TeamRobot` with Tank Royale's `Bot` interface, and fix every compile error that
follows from renamed methods and events before touching any logic. This step alone typically finds most of the
mechanical differences: `execute()` becomes `go()`, `ScannedRobotEvent` becomes `ScannedBotEvent`, and so on.

Do not "fix" a compile error by guessing a plausible Tank Royale name. Check it against the API Changes table, since a
wrong guess that happens to compile is worse than an error that stops the build.

## 2. Fix the run() loop before anything else

Classic Robocode allows `while (true)` because the engine can kill the bot's thread outright. Tank Royale cannot do
that safely, so its clients expose a running flag instead, `isRunning()` in Java and C#, `self.running` in Python.
Change the loop condition immediately after the base class compiles, or the bot never terminates cleanly between
rounds during testing.

## 3. Convert every heading and turn

This is the step most bugs hide in, because a heading-sign error still compiles and still moves the bot, just in the
wrong direction. Search the bot for every angle computation: bearing to target, escape angles, movement headings, and
convert each one using the formula from Physics Differences, $h_{TR} = (90 - h_C) \bmod 360$. Also check the sign on
every relative turn, since turning right decreases the heading in Tank Royale instead of increasing it.

A fast way to catch a leftover sign bug: run the ported bot against a stationary target and watch whether it turns to
face the enemy or away from it. A movement or targeting bot that suddenly can't hit a still target almost always has
one unconverted angle left.

## 4. Re-check hitbox-dependent math

Classic Robocode's 36×36 axis-aligned square and Tank Royale's 18-unit-radius circle agree closely head-on but differ
at the corners. A bot that computes exact bullet shadows or GuessFactor bins against the classic square's corners will
be slightly off in Tank Royale. Widen any hardcoded hit-tolerance margin rather than trying to model the exact
geometry twice.

## 5. Rebuild team messages on the new limits

A ported `TeamRobot` that broadcasts freely can exceed Tank Royale's per-turn packet limits, where classic Robocode
only capped message size. Batch or throttle any message loop that fires every turn, and read
[Team Communication & Coordination](../team-strategies/communication-coordination.md) for the exact numbers before
assuming the old protocol still fits.

## 6. Test in isolation, then in a real battle

Before running full battles, fire the ported bot at a wall-hugging or stationary opponent and confirm three things in
order: the bot moves the direction it intends to, the gun tracks the right target, and it doesn't crash on the first
`onBotDeath` or `onRoundEnded` event. Only then run it in RoboRumble-style battles, where a subtle heading bug shows up
as a mysteriously low win rate rather than a crash.

> [!WARNING] Platform Difference
> Tank Royale bots run as separate processes and can be skipped for a slow turn instead of finishing late like a
> classic Robocode thread. A bot that passes isolated testing but underperforms in full battles may simply be too
> slow per turn, not wrong.

## What does not need porting

The strategy survives the move untouched. A wave surfing movement, a GuessFactor gun, or an anti-gravity swarm
tactic reads the same battlefield and reasons about the same physics on both platforms. Only the vocabulary for
reading that battlefield changes. A bot that wins on classic Robocode's RoboRumble should win on Tank Royale's
leaderboard too, once the checklist above is clean.

## Further Reading

- [Robocode/RobocodeAPI](https://robowiki.net/wiki/Robocode/RobocodeAPI) - RoboWiki (classic Robocode)
- [Bot API](https://robocode.dev/articles/bot-api.html) - Tank Royale documentation
- [Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation
- [API Changes](./api-changes.md) - class, method, and event renames
- [Physics Differences](./physics-differences.md) - angle, turn-sign, and hitbox differences
- [Team Communication & Coordination](../team-strategies/communication-coordination.md) - message limits
