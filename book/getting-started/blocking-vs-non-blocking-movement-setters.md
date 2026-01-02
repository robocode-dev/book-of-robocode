---
title: "Blocking vs Non-Blocking Movement (Setters)"
category: "Getting Started"
summary: "Understand why ahead()/forward() can block your bot, and when to use setAhead()/setForward() to queue actions for the next turn."
tags: [ "movement", "setters", "blocking", "api", "robocode", "tank-royale", "beginner" ]
difficulty: "beginner"
source: [
  "RoboWiki – Robocode/RobocodeAPI (classic Robocode)",
  "Robocode Tank Royale Docs – Introduction / API overview"
]
---

# Blocking vs Non-Blocking Movement (Setters)

One of the first big "aha" moments in Robocode-style bots is understanding that **some API calls block your code** while
others **just set a desired action** that the engine executes over time.

This difference is the reason for many first bots:

- stop scanning while moving,
- point the gun the wrong way while turning, or
- feel "unresponsive".

> **Goal:** Keep issuing movement / gun / radar commands every turn, instead of getting stuck inside a blocking call.

---

## The turn model in one sentence

Each turn:

1. Your bot code runs.
2. You read state + events.
3. You issue commands (move/turn/radar/fire).
4. The engine applies those commands subject to max turn rate, acceleration, gun heat, etc.

So the best bots typically do *a little bit of everything* every turn.

---

## Blocking calls (e.g., `forward()` / `ahead()`)

A **blocking** movement method means:

- you call something like “move ahead 100”, and
- your code does **not continue** until the movement is finished.

Conceptually:

- `forward(100)` (or `ahead(100)`) is like: *"keep moving until you’ve advanced 100 units; don’t run the rest of my
  loop until then"*.

That’s easy to understand, but it has a downside: while your code is blocked, you’re often **not updating**:

- radar turns (so you may stop scanning),
- gun turns (so your aim freezes),
- adaptive movement (so you’re easier to hit).

Blocking calls are fine for:

- the very first tutorial bots,
- scripted movement demonstrations,
- tiny experiments where you don’t care about coordination.

---

## Non-blocking setters (e.g., `setForward()` / `setAhead()`)

A **setter-style** movement call means:

- you tell the engine what you *want* the bot to do,
- and then **your code continues immediately**.

Conceptually:

- `setForward(8)` is like: *"set my desired forward speed; now let me keep thinking"*.
- `setAhead(100)` is like: *"start moving ahead toward this distance; I’ll keep running every turn and can change my
  mind"*.

### One crucial detail: setters describe intent, not completion

Setter calls usually just update your bot’s **intent** for the next tick/turn.
To actually finish the turn and send those intents to the game engine, you must “commit” the turn:

- **Classic Robocode:** call `execute()`
- **Robocode Tank Royale:** call `go()`

If you only call setters but never call `execute()` / `go()`, your bot won’t advance turns, and it will look like it’s
not responding.

### Last setter wins (overwrites earlier intent)

Within a single turn, calling the same setter multiple times typically **overwrites** the previous value.
In other words, the engine will use **the last value you set** before you commit the turn.

This is useful when your logic refines a decision step-by-step:

- you start with a guess (e.g., `setAhead(200)`),
- you run more calculations (maybe even recursive evaluation), and
- you update the intent again (e.g., `setAhead(120)`) before calling `execute()` / `go()`.

---

### Why setters matter

Setters let you coordinate multiple subsystems in the same turn:

- movement (body)
- aiming (gun)
- scanning (radar)

This is the foundation for:

- keeping a radar lock while moving,
- aiming continuously while dodging,
- responsive movement that can reverse when bullets are fired.

---

## Platform notes (Classic vs Tank Royale)

The core idea is the same on both platforms: **setters queue intent**, and a separate call ends your turn.

It can be helpful to think of the common blocking movement calls as “setter + commit”:

- **Classic Robocode:** `ahead(distance)` is roughly `setAhead(distance)` + `execute()`.
- **Robocode Tank Royale:** `forward(distance)` is roughly `setForward(distance)` + `go()`.

(Exact details vary by language binding, but the mental model is what matters: blocking calls do the commit/waiting for
you.)

---

## The practical rule of thumb

- Use **blocking** calls while learning basics.
- Use **setters** as soon as you want to do more than one thing at a time.

If your bot ever needs to:

- move *and* scan effectively, or
- move *and* aim/fire continuously,

you’re usually in setter territory.

---

## A tiny example (conceptual)

A blocking style often looks like:

- move a long distance
- then scan/aim
- then move again

A setter style looks like:

- each turn:
    - adjust radar
    - adjust gun
    - adjust movement
    - commit the turn (`execute()` / `go()`)

Even if you keep moving toward a goal, you can still keep the radar sweeping and the gun tracking.

---

## Related topics

- [Bot Anatomy](./bot-anatomy) — body/gun/radar independence
- [The Bot API](./the-bot-api) — events, turns, and timeouts
- [Movement Fundamentals & GoTo](../movement/basic/movement-fundamentals-goto.md) — building movement that can be updated every tick
