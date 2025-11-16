---
title: "Bot Anatomy & The Bot API"
category: "Getting Started"
summary: "Learn the main parts of a Robocode bot and how the game engine interacts with your code."
tags: ["bot anatomy", "api", "robocode", "tank-royale", "beginner"]
difficulty: "beginner"
source: [
  "RoboWiki - Bot Anatomy (classic Robocode)",
  "Robocode Tank Royale Docs - Bot API"
]
---

# Bot Anatomy & The Bot API (Beginner Level)

Understanding how a bot is built and how the game engine talks to your code is the first big step toward writing your
own competitive robots. This chapter walks through the main parts of a bot (body, gun, radar, energy) and explains how
the Bot APIs for classic Robocode and Robocode Tank Royale let you control them.

In this book, **the engine** means the Robocode or Tank Royale **game engine** — the simulation that advances turns,
moves bots and bullets, and delivers events to your bot.

We intentionally stay language-agnostic here. Examples talk in terms of “API methods”, “events”, or “properties”, not
specific class or function names.

> **Applies to:** Classic Robocode & Robocode Tank Royale  
> **Focus:** Conceptual understanding for new players with basic programming knowledge

---

## 1. Bot shape, size, and hitbox

On screen, you see a small tank-like robot, but the game engine actually cares about a simpler shape: its **hitbox**.
This is what bullets and walls collide with.

- **Classic Robocode**
    - Each bot is a **40×40 pixel square** on the battlefield.
    - The square’s *orientation does not rotate* when the bot turns. The sprite spins, but the underlying hitbox is
      always an axis-aligned 40×40 box.
- **Robocode Tank Royale**
    - Each bot is modeled as a **circle with radius 18 pixels** (effectively 36×36 pixels wide and high).
    - The circle is rotation-independent by design: turning the bot does not change the shape.

The **bot center** (its x/y position) and the hitbox around it are used for:

- Detecting **bot vs wall** collisions
- Detecting **bot vs bot** collisions
- Detecting **bullet vs bot** hits

> **Image suggestion (reused SVG):** A top-down bot with its hitbox highlighted.
> - Classic: a 40×40 axis-aligned square around the bot sprite.
> - Tank Royale: a circle with radius 36 around the bot.  
    > Put the SVG in `docs/images/bot-hitboxes.svg`.

---

## 2. Core parts of a bot

Every Robocode-style bot is made of three main moving parts plus an energy pool:

- **Body** – the chassis that moves around.
- **Gun / turret** – the rotating part that fires bullets.
- **Radar** – the rotating scanner that detects enemies.
- **Energy** – a number that acts as both health and ammunition.

Each moving part has their own **headings** (angles) and sometimes their own turn rate limits.

### 2.1 Body

The **body** is the main robot:

- It has a **position** (x, y) on the battlefield.
- It has a **heading** (direction it faces).
- It has a **velocity / speed** along its heading (positive forward, negative backward).

Movement commands in the API (such as “move ahead N units” or “set forward velocity”) affect the body. The body:

- **Accelerates** and **decelerates** within fixed limits per turn.
- Has a **maximum speed** it cannot exceed.
- Has a **maximum turn angle per turn** – it can only rotate so far each tick.

You cannot instantly jump from standing still to max speed, or from full speed forward to full speed backward. The
engine applies realistic-ish constraints: each turn it adjusts your speed by at most the allowed acceleration or
deceleration.

We’ll go deeper into numbers and formulas in *Movement Constraints & Bot Physics* later in the book. Here, just
remember:

- Speed changes gradually (accel/decel limits).
- Direction changes gradually (max turn per turn).

### 2.2 Turret and gun

The **gun** is mounted on a **turret** that can rotate separately from the body. In most docs, “gun” refers to this
entire rotating assembly.

Important points:

- The gun has its own **heading**.
- **Bullets travel in the direction of the gun heading**, not the body heading.
- The gun has a **maximum turn angle per turn**, usually faster than the body.
- The gun does not collide with anything; only the body and bullets do.

Because the gun can be rotated independently of the body, you can:

- Drive one way with the body.
- Aim somewhere else with the gun.
- Keep shooting at a target while dodging in another direction.

> **Image suggestion (reused SVG):** A bot whose body is facing north while the gun is rotated east, with angles
> labeled.  
> File: `docs/images/body-vs-gun-heading.svg`.

### 2.3 Radar

The **radar** is a separate rotating part used only for sensing:

- It has its own **heading**.
- It has its own **maximum turn angle per turn**, often the fastest of all parts.
- It does **not** collide with anything – it is purely virtual.

The radar defines a **scan arc**, which we’ll cover in detail later:

- It has a **range** (up to 1200 virtual pixels).
- It has a **width** (angle of the arc, narrow or wide).

The radar heading plus arc width determines where your bot is “looking” that turn.

### 2.4 Energy

**Energy** is the bot’s life bar and ammo pool:

- You **lose energy** when:
    - Bullets hit you.
    - You collide with walls.
    - You collide with other bots (depending on direction and speed).
    - You **fire** bullets (energy cost per shot).
- You **gain energy** when your bullets hit an enemy.

If your energy reaches **0**, your bot becomes **disabled**: it cannot move, turn, fire, or react to events. If a bullet
you fired earlier later hits an enemy and returns energy, your bot can **become active again**. Your bot is only
destroyed when its energy falls **below 0**.

Energy management is a central part of the strategy:

- Firing high‑power bullets can finish opponents faster but burns energy quickly.
- Missing too many shots leaves you weak, even if you are never hit.

Exact formulas (damage, returned energy, bullet speed vs. power) are discussed later in *Bullet Travel & Bullet Physics*
and *Gun Heat, Cooling & Scoring Basics*.

---

## 3. Body, gun, and radar movement (chained vs independent)

The engine lets you control **body**, **gun**, and **radar** each turn. In both classic Robocode and Tank Royale, these
parts are **chained by default**:

- Turning the **body** also turns the gun and radar.
- Turning the **gun** also turns the radar.

Both engines then give you tools in their APIs to make the gun and radar behave more independently when you want.

### 3.1 What “independent” means

When parts are independent:

- Turning the **body** does **not** automatically drag the gun or radar with it.
- Turning the **gun** does **not** automatically drag the radar.
- You can rotate all three at different speeds and directions in the same turn.

When parts are **not** independent, rotations are “chained”:

- Turning the body also turns the gun and radar.
- Turning the gun also turns the radar.

### 3.2 Achieving independence

Both classic Robocode and Tank Royale work the same way: parts are chained by default, and each engine's Bot API gives
you the tools to make them behave independently when you want.

In practice, you'll typically:

- Spin the **radar** almost constantly to search for enemies.
- Keep the **gun** locked on your main target.
- Move the **body** in a pattern that makes you hard to hit.

---

## 4. Movement, acceleration, and turning limits

### 4.1 Linear movement: speed, acceleration, deceleration

Each turn, the engine updates your **speed** based on the movement commands and physical limits:

- There is a **maximum speed** per bot.
- There is a **maximum acceleration** per turn (how much you can speed up).
- There is a **maximum deceleration** per turn (how much you can slow down).

As a result:

- You cannot go from standstill to max speed in one turn.
- You cannot instantly reverse from full speed forward to full speed backward.
- Stopping in front of a wall usually takes more than one turn.

We’ll derive exact numbers in later physics chapters; for now, you should:

- Think in terms of **planned movement** over several turns.
- Remember that your bot’s last speed and heading always influence the next turn.

### 4.2 Turn rates: body, gun, radar

Each rotating part has its own **maximum turn angle per turn**:

- The **body** turns relatively slowly.
- The **gun** typically turns faster.
- The **radar** is often the fastest, allowing wide sweeps.

Turning is limited per turn, so if you command a large angle:

- The part will rotate at most its max angle that turns.
- Additional turns are needed to complete large rotations.

This matters for strategy:

- A slow‑turning body cannot instantly face any direction; you must expect where you want to go.
- A fast‑turning gun can keep up with dodging targets.
- A rapid radar can sweep the entire battlefield regularly to avoid “losing” enemies.

Exact numbers, angle conventions, and formulas are covered in *Coordinate Systems & Angles* and *Movement Constraints &
Bot Physics*.

---

## 5. Scanning and the 1200‑pixel scan arc

The radar’s job is to answer one question: **Where are the enemy bots?** It does this by sweeping a **scan arc** over
the battlefield.

### 5.1 Scan range and arc width

Conceptually, a scan is a **circular sector**:

- **Length (range):** up to **1200 virtual pixels** from your bot’s center.
- **Width (angle):** configurable in the API; you choose narrow or wide.
- **Direction:** centered on the radar heading.

Only bots that are both:

- Within **1200 units** distance, and
- Inside the **angular width** of the radar arc

will be detected by that scan during that turn.

**Trade‑offs:**

- **Wide arc**
    - Easier to find enemies.
    - Less precise; you may have fewer details or lose track between turns.
- **Narrow arc**
    - Great for tracking a known target.
    - Easier to “miss” enemies if your aim drifts.

> **Image (reused SVG):** Radar scan arc with 1200‑pixel range circle and a visible narrow and wide arc variant, plus an
> enemy bot inside.  
> File: `docs/images/radar-scan-arc.svg`.  
> If no suitable SVG exists, we need a new one illustrating: bot at center, circle with radius 1200, wedge showing the
> current scan arc.

### 5.2 Scanning each turn

On every turn:

1. The engine takes your **radar heading** and **arc width**.
2. It checks which enemy bots fall inside that sector (up to 1200 pixels away).
3. For each detected enemy, it triggers a **scan event** for your bot.

A typical scan event includes information such as:

- Enemy **distance** from you.
- Enemy **bearing** (angle relative to your bot or radar heading).
- Enemy **heading** and **speed**.
- Enemy **energy**.

The engine does **not** remember enemies for you. Your code should:

- Store the latest scan data you care about.
- Use it to aim the gun and to decide movement.
- Optionally, adjust radar turn speed and width to keep enemies in view.

Common strategies:

- **Continuous sweep:** spin the radar 360° to discover all bots regularly.
- **Radar lock:** when you find a target, keep turning the radar just enough to keep that bot within a narrow arc.

---

## 6. Collisions, bullets, and energy changes

### 6.1 Bullet power, speed, and energy

When you fire the gun, you choose a **bullet power**. The Bot API then:

- **Subtracts energy** from your bot based on the power.
- Launches a bullet in the direction of the gun heading.
- Sets the bullet’s **speed** and **damage** based on its power.

In both classic Robocode and Tank Royale:

- Higher power → **more damage** and often **faster bullets**.
- Firing consumes more energy at higher powers.

When your bullet hits an enemy:

- The enemy **loses energy** based on bullet power.
- Your bot **regains some energy** as a reward.

When your bullet **misses** (e.g., hits a wall or flies off the field):

- You do **not** get that energy back.

We’ll cover exact formulas in the later chapters on bullet physics and scoring.

### 6.2 Collision types

There are several key collision types:

1. **Bot vs wall**
    - Happens when your body’s hitbox intersects the battlefield boundary.
    - Typically:
        - Your bot may stop or “slide” along the wall.
        - You **lose a small amount of energy**.
    - The API triggers a **wall collision event**.

2. **Bot vs bot**
    - Happens when two bots’ hitboxes overlap.
    - Typically:
        - Both bots are pushed apart or blocked.
        - Both may lose a small amount of energy, depending on speed and direction.
    - The API triggers **bot collision events** for one or both bots.

3. **Bullet vs bot**
    - Occurs when a bullet’s position intersects a bot’s hitbox.
    - The bullet disappears; the target loses energy.
    - The shooter may gain energy.
    - The API triggers events for the shooter (bullet hit) and sometimes for the target (got hit).

4. **Bullet vs bullet** (classic Robocode & Robocode Tank Royale)
    - Two bullets can collide and destroy each other in both engines.
    - Both shooters may receive bullet-related events when this happens (for example, Tank Royale has a *
      *BulletHitBulletEvent**).

### 6.3 Disabled bots vs destroyed bots

Energy acts as both health and ammunition. When a bot’s energy hits **0**, it becomes **disabled**: it stays on the
battlefield but cannot move, turn, fire, or react to events.

However, bullets that were fired earlier keep flying. If one of those bullets hits an enemy and returns some energy, the
disabled bot can **wake back up** and start acting again.

A bot is considered **destroyed** only when its energy goes **below 0**. At that point it is removed from the round and
cannot come back.

> **Image suggestion:** A small diagram showing a bot colliding with a wall and a bullet hitting a bot.  
> File: `docs/images/collisions.svg`.

---

## 7. Rounds, turns, and time limits

### 7.1 Rounds vs turns

Robocode-style games are **turn‑based simulations** under the hood.

- A **turn** (also called a tick) is one discrete step of the simulation.
    - Your bot’s code runs once per turn.
    - You read events and update your commands for body, gun, radar, and firing.
- A **round** is a complete battle from start to finish on a single battlefield.
    - A match often consists of multiple rounds.
    - Scores are typically aggregated over all rounds.

Over many turns, the engine:

- Applies your commands (subject to speed and turn limits).
- Moves bots and bullets.
- Resolves collisions.
- Generates events for your bot to handle.

### 7.2 Turn timeouts and skipped turns

Each turn, your bot is given a **time budget** to run its code. If your code does not finish in time:

- The turn can be **skipped** for your bot.
- Movement and fire commands might be delayed or ignored that turn.
- The API may trigger a **skipped turn event** or similar warning.

Skipping turns is dangerous:

- Your bot may stand still and become easy to hit.
- You may miss important events like enemy scans or bullet hits.

Good practice:

- Keep per‑turn logic fast and predictable.
- Spread heavy computations over multiple turns if needed.

---

## 8. Events in the Bot APIs

Both classic Robocode and Tank Royale use an **event‑driven** model: the engine calls your bot with events describing
what just happened.

### 8.1 Common event types

Exact names differ by API, but conceptually you’ll see events like:

- **Round / game lifecycle**
    - Round started
    - Round ended
    - Bot death
- **Per‑turn / tick**
    - A main “tick” or “turn” callback where you read state and issue commands.
- **Scanning**
    - Enemy scanned (includes enemy bearing, distance, heading, speed, energy).
- **Bullet events**
    - Bullet fired (sometimes implicit, based on your command).
    - Bullet hit enemy.
    - Bullet was hit by another bullet (classic only).
    - Bullet missed or hit a wall.
    - In both engines, bullet events can include bullet–bullet collisions (for example, Tank Royale has a *
      *BulletHitBulletEvent** when bullets collide).
- **Collision events**
    - Hit wall.
    - Hit another bot.
    - Got hit by another bot.
- **Error / timeout**
    - Skipped turn or similar warnings.

Your bot typically defines **handlers** (methods or callbacks) for these. The engine calls them at the appropriate time
each turn.

### 8.2 Connecting anatomy to events

Putting it all together:

- The **anatomy** (body, gun, radar, energy) defines what you *can* control.
- The **Bot API** gives you:
    - Commands to move the body, turn gun and radar, and fire bullets.
    - Flags or separate controls to keep these parts independent.
    - Events that tell you what happened (scans, hits, collisions, timeouts).

By reacting to events and using the commands each turn, you build a complete bot behavior.

---

## 9. Summary and where to go next

On this page you learned:

- How bots are represented on the battlefield (square vs circular hitboxes).
- The roles of the **body**, **gun**, **radar**, and **energy**.
- How **independent movement** lets you rotate body, gun, and radar separately.
- The basic movement constraints: max speed, acceleration/deceleration limits, and separate turn limits for body, gun,
  and radar.
- How the radar’s **1200‑pixel scan arc** and adjustable width control what you can see.
- How bullets, collisions, and energy gains/losses shape gameplay.
- How the turn‑based engine, **turn timeouts**, and **events** connect your code to the game.

Next chapters dive deeper into:

- **Battlefield Physics** – coordinates, precise movement constraints, and bullet travel.
- **Radar & Scanning** – advanced radar patterns and enemy tracking.
- **Targeting Systems** – how to aim and choose bullet power effectively.

You now have the mental map of a Robocode/Tank Royale bot. The next step is to put that knowledge into practice and
start driving your first bot around the arena.
