---
title: "Bot Anatomy"
category: "Getting Started"
summary: "Learn the main parts of a Robocode bot: body, gun, radar, energy, and how they move."
tags: [ "bot anatomy", "robocode", "tank-royale", "beginner" ]
difficulty: "beginner"
source: [
  "RoboWiki - Bot Anatomy (classic Robocode)"
]
---

# Bot Anatomy (Beginner Level)

Understanding how a bot is built is the first big step toward writing your own competitive bots. This page walks through
how bots are represented on the battlefield and the main parts you can control: **body**, **gun**, **radar**, and
**energy**.

In this book, **the engine** means the Robocode or Tank Royale **game engine** — the simulation that advances turns,
moves bots and bullets, and delivers events to your bot.

> **Applies to:** Classic Robocode & Robocode Tank Royale  
> **Focus:** Conceptual understanding for new players with basic programming knowledge

---

## 1. Bot shape, size, and hitbox

On screen, you see a small tank-like bot, but the game engine actually cares about a simpler shape: its **hitbox**.
This is what bullets and walls collide with.

- **Classic Robocode**
    - Each bot is a **40×40 unit square** on the battlefield.
    - The square’s orientation does not rotate when the bot turns. The sprite spins, but the underlying hitbox is
      always an axis-aligned 40×40 box.
- **Robocode Tank Royale**
    - Each bot is modeled as a **circle with radius 18 units** (effectively 36×36 units wide and high).
    - The circle is rotation-independent by design: turning the bot does not change the shape.

The **bot center** (its x/y position) and the hitbox around it are used for:

- Detecting **bot vs wall** collisions
- Detecting **bot vs bot** collisions
- Detecting **bullet vs bot** hits

![Classic Robocode bot square hitbox](../images/bot-square-hitbox.svg)<br>
*Square hitbox used in classic Robocode (40×40 units, axis-aligned).*

![Robocode Tank Royale bot circle hitbox](../images/bot-circle-hitbox.svg)<br>
*Circular hitbox used in Robocode Tank Royale (diameter 36 units).*

---

## 2. Core parts of a bot

Every Robocode-style bot is made of three main moving parts plus an energy pool:

- **Body** – the chassis that moves around.
- **Gun / turret** – the rotating part that fires bullets.
- **Radar** – the rotating scanner that detects enemies.
- **Energy** – a number that acts as both health and ammunition.

<img src="../images/bot-parts.svg" alt="Bot parts labeled: Body, Gun, Radar, Energy" width="150"/><br>
*Main parts of a bot: body, gun, radar, and energy pool.*

Each moving part has their own **headings** (angles) and sometimes their own turn rate limits.

### 2.1 Body

The **body** is the main bot:

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

![Bot with body heading (north) and gun heading (east), showing the separation between body and gun orientation.](../images/body-vs-gun-heading.svg)<br>
*Body and gun can have different headings; bullets fire in the gun direction.*

### 2.3 Radar

The **radar** is a separate rotating part used only for sensing:

- It has its own **heading**.
- It has its own **maximum turn angle per turn**, often the fastest of all parts.
- It does **not** collide with anything – it is purely virtual.

### 2.4 Energy

**Energy** is the bot’s life bar and ammo pool:

- You **lose energy** when:
    - Bullets hit you.
    - You collide with walls.
    - You collide with other bots (depending on direction and speed).
    - You **fire** bullets (energy cost per shot).
- You **gain energy** when your bullets hit an enemy.

---

## 3. Body, gun, and radar movement (chained vs independent)

The engine lets you control **body**, **gun**, and **radar** each turn. These parts are **chained by default**:

- Turning the **body** also turns the gun and radar.
- Turning the **gun** also turns the radar.

The Bot APIs then give you tools to make the gun and radar behave independently when you want more control.

### 3.1 What “independent” means

By default, rotations are **chained**:

- Turning the **body** also turns the gun and radar by the same angle.
- Turning the **gun** also turns the radar.

When parts are **independent**, those automatic rotations are turned off:

- Turning the **body** does **not** drag the gun or radar with it.
- Turning the **gun** does **not** drag the radar.
- The body, gun, and radar can all rotate at their own speeds and even in different directions in the same turn.

![Chained bot parts rotating together](../images/bot-parts-chained.svg)<br>
*Chained movement: body, gun, and radar rotate together.*

![Unchained bot parts rotated independently](../images/bot-parts-unchained.svg)<br>
*Independent movement: body, gun, and radar rotate separately.*

### 3.2 Why independence matters

Independence is mainly a **strategy tool**:

- **Radar:** Spin it almost constantly so you don’t lose track of enemies, even while dodging.
- **Gun:** Keep it aimed at your current target, adjusting its heading based on the latest scan data.
- **Body:** Move in patterns that make you harder to hit without disturbing where the gun and radar are pointing.

---

## 4. Movement, acceleration, and turning limits

### 4.1 Linear movement: speed, acceleration, deceleration

Each turn, the engine updates your **speed** based on the movement commands and physical limits:

- There is a **maximum speed** per bot.
- There is a **maximum acceleration** per turn.
- There is a **maximum deceleration** per turn.

### 4.2 Turn rates: body, gun, radar

Each rotating part has its own **maximum turn angle per turn**:

- The **body** turns relatively slowly.
- The **gun** typically turns faster.
- The **radar** is often the fastest.

---

## 5. Summary and where to go next

On this page you learned:

- How bots are represented on the battlefield (square vs circular hitboxes).
- The roles of the **body**, **gun**, **radar**, and **energy**.
- How **independent movement** lets you rotate body, gun, and radar separately.
- The basic movement constraints: max speed, acceleration/deceleration limits, and separate turn limits for body, gun,
  and radar.

Next, continue with:

- **The Bot API** — how the engine delivers scan/collision/bullet events and how you send commands back.
- **Blocking vs Non-Blocking Movement (Setters)** — why `forward()/ahead()` behaves differently from `setForward()/setAhead()`.

