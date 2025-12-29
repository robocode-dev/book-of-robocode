---
title: "Movement Constraints & Bot Physics"
category: "Battlefield Physics"
summary: "Reference for movement, turning, and radar physics that define how bots move and rotate in classic Robocode and Robocode Tank Royale."
tags: [ "battlefield-physics", "movement", "turning", "radar", "classic-robocode", "tank-royale", "beginner" ]
difficulty: "beginner"
source: [
  "Robocode Game Physics (RoboWiki)",
  "Robocode Rules API",
  "Robocode Tank Royale Docs - Physics",
  "Robocode Tank Royale Bot API Constants"
]
---

# Movement Constraints & Bot Physics

This page summarizes the movement and turning rules that define how a bot can move, turn, and scan in both classic
Robocode and Robocode Tank Royale. It is meant as a compact reference you can keep open while coding.

It assumes you have already read:

- `Bot Anatomy & The Bot API` (for bot parts, chaining vs. independent movement, and scan concepts)
- `Coordinate Systems & Angles` (for coordinate system, angle conventions, and basic terminology)

Where numbers differ between classic Robocode and Tank Royale, both are listed explicitly.

> Numbers and rules on this page are based on:
> - Classic Robocode: [Game Physics](https://robowiki.net/wiki/Robocode/Game_Physics),
    > [Rules](https://robocode.sourceforge.io/docs/robocode/robocode/Rules.html)
> - Robocode Tank Royale: [Physics](https://robocode.dev/articles/physics.html),
    > [Constants](https://robocode.dev/api/java/dev/robocode/tankroyale/botapi/Constants.html)

## Bot size and basic model

This section is a light reminder, not a full re-explanation. For details and diagrams, see:

- `Bot Anatomy & The Bot API` (bot shape, hitbox, and collisions)
- `Coordinate Systems & Angles` (battlefield coordinates)

Key points:

- Classic Robocode bot hitbox: **40 × 40 units** (axis-aligned square), centered on the bot position.
- Tank Royale bot hitbox: **circle with radius 18 units**.
- Battlefield coordinates on both platforms:
    - Origin `(0, 0)` at bottom-left; `x` to the right, `y` up.
- See `Coordinate Systems & Angles` for:
    - Classic Robocode angle convention (clockwise from North).
    - Tank Royale angle convention (counterclockwise from East).

This page reuses those angle systems in its formulas but does not redefine them; refer back if you need a refresher.

## Linear movement: velocity, acceleration, deceleration

Movement is updated **once per turn** (a "tick"). Velocity can be **positive** (forwards) or **negative** (backwards).
You give a distance or velocity target; the engine applies acceleration and deceleration within limits.

### Classic Robocode

- Max forward speed: **+8 units/turn**
- Max backward speed: **−8 units/turn**
- Max acceleration (speeding up in the current direction): **+1 unit/turn**
- Max deceleration (slowing down / reversing): **−2 units/turn**

Velocity update per turn (conceptual):

```text
let v = current velocity
let t = desired direction (based on setAhead / setBack)
if sign(t) == sign(v):
    # accelerating in same direction
    v' = clamp(v + 1, -8, 8)
else:
    # decelerating / reversing
    v' = clamp(v - 2 * sign(v), -8, 8)
```

Position is then updated using the bot heading and the chosen coordinate/angle convention from
`Coordinate Systems & Angles`. For example, in Tank Royale (math-style angles, 0° = East, CCW positive):

```text
x' = x + v' * cos(heading)
y' = y + v' * sin(heading)
```

Where:

- `heading` is in radians in the formula (convert from degrees first).
- `(x, y)` is the bot position in units.

### Robocode Tank Royale

Tank Royale uses the same style of physics, but the concrete values are exposed as constants in the Bot API, so you do
not need to remember them or hard-code numbers in your own bot:

- Max speed: `MAX_SPEED`
- Acceleration: `ACCELERATION`
- Deceleration: `DECELERATION`

From the API (names, not pasted values):

```text
// dev.robocode.tankroyale.botapi.Constants
MAX_SPEED       // max magnitude of velocity in units/turn
ACCELERATION    // max speed increase per turn (same direction)
DECELERATION    // max speed decrease per turn (slowing / reversing)
```

Always prefer using these constants from the API over literal numbers in your code; they document the rules and keep
your bot compatible if the game engine is ever tuned.

## Body turning and speed–turn tradeoff

Classic Robocode and Tank Royale both limit how much the bot body can turn each tick, and this limit shrinks as speed
increases.

### Classic Robocode body turn rate

- Max body turn rate when standing still: **10°/turn**.
- The faster you move, the less you can turn:

  ```text
  maxTurnRate(speed) = 10° − 0.75° × |speed|
  ```

    - At speed 0: 10°
    - At speed 4: 10 − 0.75 × 4 = 7°
    - At speed 8: 10 − 0.75 × 8 = 4°

- The actual change in heading per turn is clamped to this limit:

```text
let wantedTurn = normalizeBearing(requestedTurn)  # in range (−180, +180]
let limit = 10 − 0.75 × |velocity|
bodyTurn = clamp(wantedTurn, −limit, +limit)
heading' = normalizeAngle(heading + bodyTurn)
```

This speed–turn tradeoff is a core part of movement design in classic Robocode: going faster makes it harder to turn
sharply.

### Tank Royale body turn rate

Tank Royale exposes analogous constants (names only) in its API:

```text
MAX_TURN_RATE       // base max turn rate at speed 0 (degrees/turn)
TURN_RATE_DEC       // how much turn rate decreases per unit of speed
```

The effective maximum per turn is:

```text
maxTurnRate(speed) = MAX_TURN_RATE − TURN_RATE_DEC × |speed|
```

Again, the shape of the rule is the same as in classic Robocode. Use the constants from the Tank Royale Bot API rather
than hard-coding numeric turn rates in your own code.

## Gun and radar turning (constraints only)

The structure and roles of body, gun, and radar are already covered in `Bot Anatomy & The Bot API`, including diagrams
and chained vs independent movement. This section only focuses on **numeric limits and clamping rules**.

### Classic Robocode

Per-turn angular limits:

- Gun: **20°/turn**
- Radar: **45°/turn**

By default, turning the body also rotates the gun and radar, and turning the gun also rotates the radar. The
`setAdjust*`
methods in the classic API control whether those automatic rotations are applied. For a full conceptual explanation and
examples, see `Bot Anatomy & The Bot API`.

From a physics perspective, the engine applies a simple clamp each turn:

```text
gunTurn = clamp(requestedGunTurn, −20, +20)
gunHeading' = normalizeAngle(gunHeading + gunTurn [+ bodyTurn if not adjusted])

radarTurn = clamp(requestedRadarTurn, −45, +45)
radarHeading' = normalizeAngle(radarHeading + radarTurn [+ gunTurn/bodyTurn if not adjusted])
```

### Tank Royale

Tank Royale uses separate headings for the body, gun, and radar. Angular turn limits are exposed as constants in the
Bot API:

```text
MAX_TURN_RATE          // for body
MAX_GUN_TURN_RATE      // for gun
MAX_RADAR_TURN_RATE    // for radar
```

You typically send separate turn commands per turn. The game engine clamps heading changes so that no part turns more
than its maximum per turn. As with speed and acceleration, it is the best practice to use these named constants in your
bot code instead of hard-coded degree values.

![Max turn rates for each bot part](../images/bot-max-rotations.svg)<br>
*Max turn rates for each bot part.*

Legend:

- The <span style="color: orange;">orange</span> arc shows the maximum turn rate for the body, i.e., 10°/turn at zero
  speed.
- The <span style="color: red;">red</span> arc shows the maximum turn rate for the turret/gun, i.e., 20°/turn
- The <span style="color: green;">green</span> scan arc shows the maximum turn rate for the radar, i.e., 45°/turn

**Rotation facts:**

- At zero speed, it takes <span style="color: orange;">36 turns</span> for the body to rotate 360° (360 / 10).
- It takes <span style="color: red;">19 turns</span> for the turret/gun to rotate 360° (360 / 20).
- It takes <span style="color: green;">8 turns</span> for the radar to sweep 360° (360 / 45).
- When bot parts are chained (body, gun, radar), the scanner can move up to <span style="color: green;">75°</span> in
  one turn (10 + 20 + 45).

## Scanning physics: arc and distance (reference view)

The idea of a **scan arc** and the 1200-unit scan range have already been introduced in `Bot Anatomy & The Bot API`.
That page also explains beginner-friendly strategies like wide sweeps and radar locks. Here, the focus is on the
underlying rules the engine uses each tick.

### Classic Robocode

- Radar turn per tick defines the **scan arc width** that turn:
    - Max radar turn: **45°/turn**.
    - If the radar turns by `Δθ` degrees in one tick (after clamping), the engine considers a sector covering all angles
      between the previous and current radar headings.
- Scan range:
    - Up to **1200 units** from your bot center.
    - Walls and bots do not block radar; it is not ray-cast.

Conceptually, per tick the engine:

1. Starts from the previous radar heading.
2. Applies the clamped radar turn to get the new heading.
3. Forms a sector between those two headings out to 1200 units.
4. Reports a scan event for each enemy whose position lies within that sector.

If the radar does not turn, the sector collapses into a thin beam along a single heading.

### Robocode Tank Royale

Tank Royale uses the same radar sweep/scan arc logic as classic Robocode. The game engine checks for bots within the
angular sector swept by the radar each turn, using the same mechanism for both platforms. Only constants—such as maximum
scan distance (`RADAR_RANGE`), maximum radar turn rate (`MAX_RADAR_TURN_RATE`), and angle conventions—may differ between
platforms.

- The radar has a **heading** and an associated **scan arc** around that heading.
- The game engine uses:
    - A **maximum radar turn rate per turn** (`MAX_RADAR_TURN_RATE`).
    - A **maximum scan distance** constant, such as:

      ```text
      RADAR_RANGE   // maximum distance in units that radar can detect bots
      ```

    - An angular window around the radar heading to decide which bots are inside the scan arc.

The scan arc logic is the same for both classic Robocode and Tank Royale. Only constants (such as scan range, hitbox
shape, and angle conventions) may differ between platforms. There are no differences in the underlying scan arc
mechanism or how the game engine processes radar sweeps. Platform-specific technical details (e.g., server-side,
protocol, engine differences) are not relevant to radar sweep logic.

For details, refer to the physics documentation and Bot API reference for each platform.

![Tank Royale radar scan arc with previous and current heading + maximum scan length](../images/radar-sweep-max-length.svg)<br>
*The illustration is not to scale – the scan arc is actually longer than shown. The illustration shows the radar scan
arc with previous and current heading and the maximum scan length*

## Summary of key numeric rules (classic Robocode)

Classic Robocode movement and turning constants you will most often use:

- Max velocity: **8 units/turn**
- Max acceleration: **+1 unit/turn**
- Max deceleration: **−2 units/turn**
- Max body turn (at speed 0): **10°/turn**
- Body turn penalty: **0.75° per unit of speed**
- Max gun turn: **20°/turn**
- Max radar turn: **45°/turn**
- Bot size: **40 × 40 units**

For Robocode Tank Royale, refer to `dev.robocode.tankroyale.botapi.Constants` for the corresponding numbers, and prefer
those constants over hard-coded literals in your own code.

## Simple movement loop example

This pseudocode shows a simple movement loop using the classic Robocode-style constraints above. It deliberately relies
on the coordinate and angle conventions defined in `Coordinate Systems & Angles`.

```text
const MAX_SPEED = 8
const ACCEL = 1
const DECEL = 2
const MAX_TURN_0_SPEED = 10
const TURN_PENALTY = 0.75

while (true):
    # choose a target heading and speed
    desiredGunHeading = angleTo(targetX, targetY)  # uses your chosen angle convention
    desiredSpeed = MAX_SPEED

    # turn body within allowed rate
    maxTurn = MAX_TURN_0_SPEED - TURN_PENALTY * abs(velocity)
    wantedTurn = normalizeBearing(desiredHeading - heading)
    bodyTurn = clamp(wantedTurn, -maxTurn, +maxTurn)
    heading = heading + bodyTurn

    # adjust speed with accel/decel rules
    if sign(desiredSpeed) == sign(velocity):
        velocity = clamp(velocity + ACCEL * sign(desiredSpeed), -MAX_SPEED, +MAX_SPEED)
    else:
        velocity = clamp(velocity - DECEL * sign(velocity), -MAX_SPEED, +MAX_SPEED)

    # move according to your coordinate system
    # (example: Tank Royale math-style angles)
    x = x + velocity * cos(heading)
    y = y + velocity * sin(heading)
```

This logic mirrors how both engines think about movement internally and is a useful mental model when designing your
own movement systems.

---

This page focuses on bot movement, turning, and radar physics. For bullet speed, bullet travel time, and collision
rules, see the **Bullet Physics** page in this section.
