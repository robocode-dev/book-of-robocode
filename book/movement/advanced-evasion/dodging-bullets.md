---
title: "Dodging Bullets"
category: "Movement & Evasion"
summary: >-
  How a bot notices an invisible enemy shot from the enemy's energy drop, corrects that drop for other energy
  changes, and chooses between random, predictive, and wave-based ways to get out of the way.
tags:
  - dodging-bullets
  - movement
  - advanced-evasion
  - energy-drop
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Dodging Bullets (classic Robocode) https://robowiki.net/wiki/Dodging_Bullets"
  - "RoboWiki - Wave Surfing Tutorial (classic Robocode) https://robowiki.net/wiki/Wave_Surfing_Tutorial"
  - "RoboWiki - Robocode/Game Physics (classic Robocode) https://robowiki.net/wiki/Robocode/Game_Physics"
  - "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html"
---

# Dodging Bullets

> [!TIP] Origins
> **Bullet dodging** was developed and documented by the RoboWiki community. The biggest step forward, Wave Surfing,
> was invented by **ABC**, and the fire-timing details below come from the Wave Surfing Tutorial by
> **Patrick Cupka (Voidious)**.

A bot cannot see bullets in flight. The radar reports enemy bots, never projectiles, so a bot that wants to dodge has
to work out that a shot happened from indirect evidence, then guess where that shot is heading. Both steps are easy to
get subtly wrong, and a dodge built on a false alarm can steer a bot straight into a real bullet.

## Hearing the shot: the energy drop

Firing costs energy equal to the bullet power, and bullet power ranges from 0.1 to 3.0. So when an enemy's energy
falls by an amount in that range between two scans, it probably fired.

The catch is that energy moves for other reasons too:

| Event since the last scan    | Effect on enemy energy                   |
|------------------------------|------------------------------------------|
| Your bullet hit the enemy    | Loses $4p$, plus $2(p - 1)$ when $p > 1$ |
| The enemy's bullet hit you   | Gains $3p$                               |
| The two bots collided        | Loses 0.6                                |
| The enemy drove into a wall  | Loses $\max(0, \lvert v \rvert / 2 - 1)$ |

Here $p$ is the power of the bullet involved and $v$ is the enemy's speed at impact. A power-2 hit on the enemy, for
example, removes 10 energy and hides any shot fired on the same turn. The fix is bookkeeping: record the energy
changes the bot already knows about, and remove them from the observed drop before testing it.

::: code-group

```java [Classic · Java]
public final class FireDetector {
    private double previousEnergy = Double.NaN;
    private double knownChange;

    public void onMyBulletHitEnemy(double power) {
        knownChange -= 4 * power + 2 * Math.max(power - 1, 0);
    }

    public void onEnemyBulletHitMe(double power) {
        knownChange += 3 * power;
    }

    public void onCollision() {
        knownChange -= 0.6;
    }

    public double firedPower(double enemyEnergy) {
        double drop = previousEnergy - enemyEnergy + knownChange;
        previousEnergy = enemyEnergy;
        knownChange = 0;
        return drop > 0.09 && drop < 3.01 ? drop : 0;
    }
}
```

```python [Tank Royale · Python]
class FireDetector:
    def __init__(self) -> None:
        self.previous_energy = float("nan")
        self.known_change = 0.0

    def on_my_bullet_hit_enemy(self, power: float) -> None:
        self.known_change -= 4 * power + 2 * max(power - 1, 0)

    def on_enemy_bullet_hit_me(self, power: float) -> None:
        self.known_change += 3 * power

    def on_collision(self) -> None:
        self.known_change -= 0.6

    def fired_power(self, enemy_energy: float) -> float:
        drop = self.previous_energy - enemy_energy + self.known_change
        self.previous_energy = enemy_energy
        self.known_change = 0.0
        return drop if 0.09 < drop < 3.01 else 0.0
```

```java [Tank Royale · Java]
public final class FireDetector {
    private double previousEnergy = Double.NaN;
    private double knownChange;

    public void onMyBulletHitEnemy(double power) {
        knownChange -= 4 * power + 2 * Math.max(power - 1, 0);
    }

    public void onEnemyBulletHitMe(double power) {
        knownChange += 3 * power;
    }

    public void onCollision() {
        knownChange -= 0.6;
    }

    public double firedPower(double enemyEnergy) {
        double drop = previousEnergy - enemyEnergy + knownChange;
        previousEnergy = enemyEnergy;
        knownChange = 0;
        return drop > 0.09 && drop < 3.01 ? drop : 0;
    }
}
```

```csharp [Tank Royale · C#]
using System;

public sealed class FireDetector
{
    private double previousEnergy = double.NaN;
    private double knownChange;

    public void OnMyBulletHitEnemy(double power) =>
        knownChange -= 4 * power + 2 * Math.Max(power - 1, 0);

    public void OnEnemyBulletHitMe(double power) => knownChange += 3 * power;

    public void OnCollision() => knownChange -= 0.6;

    public double FiredPower(double enemyEnergy)
    {
        double drop = previousEnergy - enemyEnergy + knownChange;
        previousEnergy = enemyEnergy;
        knownChange = 0;
        return drop > 0.09 && drop < 3.01 ? drop : 0;
    }
}
```

```typescript [Tank Royale · TypeScript]
class FireDetector {
    private previousEnergy = Number.NaN;
    private knownChange = 0;

    onMyBulletHitEnemy(power: number) {
        this.knownChange -= 4 * power + 2 * Math.max(power - 1, 0);
    }

    onEnemyBulletHitMe(power: number) {
        this.knownChange += 3 * power;
    }

    onCollision() {
        this.knownChange -= 0.6;
    }

    firedPower(enemyEnergy: number) {
        const drop = this.previousEnergy - enemyEnergy + this.knownChange;
        this.previousEnergy = enemyEnergy;
        this.knownChange = 0;
        return drop > 0.09 && drop < 3.01 ? drop : 0;
    }
}
```

:::

Call the event methods from the bot's hit and collision handlers, then call `firedPower` on every scan of that enemy.
The first scan returns 0, because there is no earlier energy to compare. The slightly widened limits, 0.09 and 3.01,
follow the Wave Surfing Tutorial and absorb floating-point noise. Wall hits are missing from the class on purpose.
A bot is only told about its own wall collisions, so an enemy's wall hit has to be inferred from a sudden stop next
to a wall.
[Gun Heat Waves](./gun-heat-waves-bullet-shadows.md) add a second filter: a drop cannot be a shot while the enemy's
gun is still hot.

## The shot is already a turn old

In classic Robocode, a bot notices the drop on the turn after the shot. The Wave Surfing Tutorial spells out what
that means: the bullet left from the enemy's position on the previous turn, has already traveled one turn at
$20 - 3p$ units per turn, and was aimed using what the enemy saw two turns ago. A dodge computed from the enemy's
current position starts from the wrong spot.

## Getting out of the way

A bullet flies in a straight line, so only one thing decides a hit: the angle from the shooter to the bot when the
bullet arrives. Moving toward or away from the enemy barely changes that angle. Moving **perpendicular** to the line
between the bots changes it fastest.

The widest angle a bot can reach is the maximum escape angle, $\arcsin(8 / s)$, where 8 is the top bot speed and $s$
is the bullet speed. A power-3 bullet ($s = 11$) gives the target up to about 46.7°, while a power-0.1 bullet
($s = 19.7$) leaves only about 24.0°.

<!-- TODO: Illustration
**Filename:** dodging-bullets-escape-angle.svg
**Caption:** "Moving perpendicular to the shooter changes the bullet's required angle fastest, up to the escape angle."
**Viewport:** 8000x5000
**Battlefield:** true
**Description:** The enemy fires a power-1 bullet (speed 17) at a friendly bot 4000 units away. The friendly bot's
reachable area before impact is a circle of radius 4000 × 8 / 17 ≈ 1882. Two orange lines from the enemy touch that
circle at the maximum escape angle, asin(8 / 17) ≈ 28.1°. The bullet's position on its wave is unknown.
**Bots:**
  - type: enemy, position: (1300, 2200), body: 0, turret: 90, radar: 90
  - type: friendly, position: (5300, 2200), body: 0, turret: 270, radar: 270
**Arcs:**
  - center: (1600, 2500), radius: 2000, startAngle: 325, endAngle: 35, color: #F59E0B, arrow: false, dashed: false,
    label: "bullet wave"
  - center: (1600, 2500), radius: 700, startAngle: 331.9, endAngle: 0, color: chocolate, arrow: false,
    dashed: false, label: "28°"
**Lines:**
  - from: (1600, 2500), to: (5600, 2500), color: #9CA3AF, arrow: false, dashed: true, label: "head-on aim"
  - from: (1600, 2500), to: (4714, 839), color: #F59E0B, arrow: false, dashed: false, label: "max escape angle"
  - from: (1600, 2500), to: (4714, 4161), color: #F59E0B, arrow: false, dashed: false
  - from: (5600, 2150), to: (5600, 1450), color: #10B981, arrow: true, dashed: false, label: "move perpendicular"
  - from: (5600, 2850), to: (5600, 3550), color: #10B981, arrow: true, dashed: false
**Circles:**
  - center: (5600, 2500), radius: 1882, color: #10B981, fill: #10B981 at 8% opacity, dashed: true,
    label: "reachable before impact"
**Texts:**
  - text: "fired: power 1", position: (1600, 3000), color: chocolate
  - text: "bullet is somewhere on it", position: (2500, 4010), color: #F59E0B
-->

<img src="/images/dodging-bullets-escape-angle.svg"
alt="Moving perpendicular to the shooter changes the bullet's required angle fastest, up to the escape angle."
style="max-width:100%;height:auto;"/><br>
*Moving perpendicular to the shooter changes the bullet's required angle fastest, up to the escape angle.*

Where inside that range to go is the real question, and RoboWiki describes three answers:

- **Randomize.** Early dodgers changed direction and speed at random, as in
  [Random Movement](../simple-evasion/random-movement.md). That works against simple guns and spreads the bot's
  positions fairly evenly, but it never adapts to the gun it faces.
- **Predict the gun.** Bots such as TheArtOfWar computed where
  [head-on](../../targeting/simple-targeting/head-on-targeting.md),
  [linear](../../targeting/simple-targeting/linear-targeting.md), and
  [circular](../../targeting/simple-targeting/circular-targeting.md) targeting would aim, and avoided all three.
  This is cheap and strong against those guns, but it has no answer to a gun that aims anywhere else, such as a
  statistical one.
- **Surf the wave.** Record where the enemy's bullets actually hit, then move to the angle the enemy fires at least.
  This is [Wave Surfing](./wave-surfing-introduction.md), and it costs far more code and CPU time than the other two.

Surfing raises a new question: how should the bot actually steer to the safe angle?
[Wave Surfing Implementations](./wave-surfing-implementations.md) compares driving toward a chosen destination with
simulating every turn of the dodge.

## Platform notes

The energy rules above are the same on both platforms, with one exception. In classic Robocode, a bot extending the
basic `Robot` class takes no wall damage, so only `AdvancedRobot` wall hits change energy. The one-turn detection
delay is documented for classic Robocode. A Tank Royale bot should confirm it by drawing its waves and checking where
real bullets appear.

## Further Reading

- [Dodging Bullets](https://robowiki.net/wiki/Dodging_Bullets) - RoboWiki (classic Robocode)
- [Wave Surfing Tutorial](https://robowiki.net/wiki/Wave_Surfing_Tutorial) - RoboWiki (classic Robocode)
- [Robocode/Game Physics](https://robowiki.net/wiki/Robocode/Game_Physics) - RoboWiki (classic Robocode)
- [Bullet Shadow](https://robowiki.net/wiki/Bullet_Shadow) - RoboWiki (classic Robocode)
- [Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation
