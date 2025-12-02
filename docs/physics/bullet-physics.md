---
title: "Bullet Travel & Bullet Physics"
category: "Battlefield Physics"
summary: "How bullets work in Robocode and Tank Royale: firing rules, energy cost, cooldown, speed, travel time, and key safety/strategy tips for new players."
tags: [ "bullet-physics", "battlefield physics", "beginner", "robocode", "tank-royale", "energy", "cooldown", "bullet speed", "travel time", "friendly fire" ]
difficulty: "beginner"
source: [
  "https://robowiki.net/wiki/Bullet",
  "https://robocode.sourceforge.io/docs/robocode/robocode/Bullet.html",
  "https://robocode.dev/articles/physics.html#bullets",
  "https://www.cse.chalmers.se/~bergert/robowiki-mirror/RoboWiki/robowiki.net/wiki/Robocode/FAQ.html"
]
---

# Bullet Travel & Bullet Physics

Bullets are pure energy projectiles fired by your bot's gun. Firing costs energy, your gun must cool down between shots,
and the bullet travels across the battlefield until it hits a bot or a wall (or leaves the arena). Mastering these
basics helps you choose when and how hard to fire.

## Bullet power and cost

- Bullet power is the energy you spend for a shot.
- Typical valid range: 0.1 to 3.0 power.
- You need at least 0.1 energy to fire the gun. If you request more power than your remaining energy, the game clamps to
  your current energy (but never below 0.1 to create a shot).
- Higher power does not make the bullet faster—it makes it slower but potentially more damaging (see bullet damage
  below).

## How bullets are fired

- You aim with the gun, not the bot body; the gun can turn independently of the bot.
- A bullet travels in a straight line along the gun’s heading at the instant you fired.
- Bullet speed is determined only by bullet power and engine rules; it does NOT inherit your bot’s current velocity.
- A shot is created only when your gun is cool, and you have enough energy. On fire(power), energy is deducted
  immediately.
- The bullet then flies until it hits a bot, a wall, leaves the arena, or even collides with another bullet.

## When can you fire? (gun cooldown)

- After you fire, the gun becomes hot and must cool before the next shot.
- Conceptually: each shot adds heat; every turn, some heat is removed. You can only fire when the heat reaches zero.
- Classic Robocode specifics you will see in the docs:
    - Cooling happens at a constant rate per turn.
    - Heat added depends on bullet power, so bigger shots generally mean a longer wait.

Practical takeaway: you cannot fire every turn. Larger bullet power means a longer interval until the next legal shot.

## Timeline of firing and cooldown

```mermaid
timeline
    title Gun Firing & Cooldown Sequence
    fire: Gun fires, heat rises
    cooling: Per-turn cooling
    ready: Gun cool, next legal shot
```

*Timeline diagram: fire → gun heat rises → per-turn cooling → next legal shot*

## Bullet speed and travel time

Classic Robocode bullet speed:

$ \text{speed (units/turn)} = 20 - 3 × \text{bulletPower} $

| Bullet Power | Speed (units/turn) | Example Travel Time (400 units) |
|--------------|--------------------|---------------------------------|
| 3.0          | 11                 | 36                              |
| 2.0          | 14                 | 29                              |
| 1.0          | 17                 | 24                              |
| 0.1          | 19.7               | 20                              |

$ Travel time (turns) ≈ distance / speed $

Example: target at 400 units with power 2.0 → 400 / 14 ≈ 29 turns of flight

Notes:

- Slower (high-power) bullets take longer to arrive, giving moving targets more time to dodge.
- Faster (low-power) bullets arrive sooner, cost less energy, but do less damage.
- Bullet motion is straight-line at constant speed; it is independent of your bot’s movement after the shot.

### Bullet Power vs Bullet Speed

| Bullet Power |  Speed (units/turn) |
|--------------|--------------------:|
| 3.0          |                  11 |
| 2.0          |                  14 |
| 1.0          |                  17 |
| 0.1          |                19.7 |

*A quick visual: higher bullet power reduces speed (see the formula and the table above). Use lower power for faster
bullets when you need shorter travel time, and higher power for more damage when you can accept slower travel.*

## Bullet damage

The table below shows how bullet power translates to damage and energy reward:

| Bullet Power | Damage Formula                      | Example Damage      | Energy Reward   |
|--------------|-------------------------------------|---------------------|-----------------|
| 0.1 - 1.0    | 4 × bulletPower                     | 0.5 → 2             | 3 × bulletPower |
| > 1.0        | 4 × bulletPower + 2 × (power − 1.0) | 2.0 → 8<br>3.0 → 12 | 3 × bulletPower |

**Formula:**

$ \text{damage} = 4 × \text{bullet power} + max(0, 2 × (\text{bullet power} − 1.0)) $

$ \text{energy reward} = 3 × \text{bullet power} $

Notes:

- If a bullet hits a wall, it does **not** deal damage.
- When your bullet hits, you gain back energy as shown above.

## Firing constraints and safety

- You cannot fire when your bot is disabled (energy = 0).
- Firing reduces your energy immediately by the bullet power.
- Be careful not to drop yourself to zero energy (= disabled): a disabled bot becomes an easy target and can be killed
  by a fast small bullet.
- In team battles, bullets can hit allies (friendly fire). Always consider the line of fire.

## How often can I fire a bullet?

- As often as the gun cooldown allows. The sequence is:

  fire → gun heats up → wait while it cools → fire again.
- Bigger shots mean longer waits. If you need a faster cadence, prefer lower-power shots.

## Radar and visibility

- Radar does not detect bullets.
- You can often infer a shot by observing a scanned enemy's energy dropping by the amount they spent to fire.

## Minimal example (pseudocode)

```pseudo
if (gunIsCool() and myEnergy > 0.1) {
  distance = distanceTo(target)
  // Simple distance-based power choice: closer → higher power, farther → lower power
  power = clamp(map(distance, 0..800, 2.5..0.5), 0.1, 3.0)
  turnGunTo(bearingTo(target))
  fire(power)
}
```

<!--
## Illustration suggestions

- Energy bar before and after firing to visualize energy cost and the risk of hitting 0.
- Friendly fire vignette: two allied bots with an unsafe line of fire across one another.
-->