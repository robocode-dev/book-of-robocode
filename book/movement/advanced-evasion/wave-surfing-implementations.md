---
title: "Wave Surfing Implementations"
category: "Movement & Evasion"
summary: >-
  How a surfing bot actually reaches the safe spot on a wave: predicting its own movement until the wave arrives,
  then either choosing a direction every turn (True Surfing) or picking a destination and driving there (GoTo
  Surfing).
tags:
  - wave-surfing-implementations
  - movement
  - advanced-evasion
  - wave-surfing
  - precise-prediction
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Wave Surfing (classic Robocode) https://robowiki.net/wiki/Wave_Surfing"
  - "RoboWiki - Wave Surfing/True Surfing (classic Robocode) https://robowiki.net/wiki/Wave_Surfing/True_Surfing"
  - "RoboWiki - Wave Surfing/GoTo Surfing (classic Robocode) https://robowiki.net/wiki/Wave_Surfing/GoTo_Surfing"
  - "RoboWiki - Wave Surfing Tutorial (classic Robocode) https://robowiki.net/wiki/Wave_Surfing_Tutorial"
  - "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html"
---

# Wave Surfing Implementations

> [!TIP] Origins
> **Wave Surfing** was invented by **ABC**, who first added it to Shadow in mid-2004. **True Surfing** became the
> common style, used by Shadow, Diamond, and the tutorial bot BasicSurfer by **Patrick Cupka (Voidious)**.
> **GoTo Surfing** is the style used by DrussGT.

[Wave Surfing Introduction](./wave-surfing-introduction.md) ends with a GuessFactor that the enemy rarely hits. Knowing
where to be is only half the job. The bot cannot jump there: it accelerates by 1 unit per turn, brakes by 2, turns at
most $10 - 0.75\lvert v \rvert$ degrees per turn, and has only until the wave arrives. By April 2010, RoboWiki noted,
the top 40 duelists in the RoboRumble all used some form of surfing. RoboWiki describes two main ways to steer, plus a
melee variant.

## The shared engine: predict the intercept

Every surfing style asks the same question: if the bot follows a given plan, where will it be when the wave reaches
it? The answer comes from [precise prediction](../../targeting/predictive-targeting/precise-prediction.md), stepping
the movement rules forward one turn at a time until the wave's radius catches up.

The predictor below orbits the wave's origin. It aims perpendicular to the line from the origin, reverses instead of
turning more than 90°, and stops when the wave will cover the bot within one more turn. That stopping test and the
500-turn safety cap both come from the Wave Surfing Tutorial.

::: code-group

```java [Classic · Java]
public final class SurfPredictor {
    public static final class State {
        public double x, y, heading, velocity;
        public long turn;

        public State(double x, double y, double heading, double velocity, long turn) {
            this.x = x;
            this.y = y;
            this.heading = heading;
            this.velocity = velocity;
            this.turn = turn;
        }
    }

    public static State predictIntercept(State start, double waveX, double waveY, long fireTurn,
            double bulletSpeed, int orbitDirection, boolean stop) {
        State s = new State(start.x, start.y, start.heading, start.velocity, start.turn);
        for (int i = 0; i < 500; i++) {
            double toBot = Math.atan2(s.y - waveY, s.x - waveX);
            double offset = normalize(toBot + orbitDirection * Math.PI / 2 - s.heading);
            int drive = 1;
            if (Math.abs(offset) > Math.PI / 2) {
                offset = normalize(offset + Math.PI);
                drive = -1;
            }
            double maxTurn = Math.toRadians(10 - 0.75 * Math.abs(s.velocity));
            s.heading += Math.max(-maxTurn, Math.min(maxTurn, offset));
            s.velocity = nextVelocity(s.velocity, stop ? 0 : 8 * drive);
            s.x += s.velocity * Math.cos(s.heading);
            s.y += s.velocity * Math.sin(s.heading);
            s.turn++;
            double radius = bulletSpeed * (s.turn - fireTurn);
            if (radius + bulletSpeed > Math.hypot(s.x - waveX, s.y - waveY)) {
                break;
            }
        }
        return s;
    }

    static double nextVelocity(double v, double target) {
        if (target > v) {
            return v < 0 ? Math.min(v + 2, Math.min(target, 0)) : Math.min(v + 1, target);
        }
        if (target < v) {
            return v > 0 ? Math.max(v - 2, Math.max(target, 0)) : Math.max(v - 1, target);
        }
        return v;
    }

    static double normalize(double angle) {
        while (angle <= -Math.PI) angle += 2 * Math.PI;
        while (angle > Math.PI) angle -= 2 * Math.PI;
        return angle;
    }
}
```

```python [Tank Royale · Python]
from dataclasses import dataclass, replace
from math import atan2, cos, hypot, pi, radians, sin


@dataclass
class State:
    x: float
    y: float
    heading: float
    velocity: float
    turn: int


def predict_intercept(start: State, wave_x: float, wave_y: float, fire_turn: int,
                      bullet_speed: float, orbit_direction: int, stop: bool) -> State:
    s = replace(start)
    for _ in range(500):
        to_bot = atan2(s.y - wave_y, s.x - wave_x)
        offset = normalize(to_bot + orbit_direction * pi / 2 - s.heading)
        drive = 1
        if abs(offset) > pi / 2:
            offset = normalize(offset + pi)
            drive = -1
        max_turn = radians(10 - 0.75 * abs(s.velocity))
        s.heading += max(-max_turn, min(max_turn, offset))
        s.velocity = next_velocity(s.velocity, 0 if stop else 8 * drive)
        s.x += s.velocity * cos(s.heading)
        s.y += s.velocity * sin(s.heading)
        s.turn += 1
        radius = bullet_speed * (s.turn - fire_turn)
        if radius + bullet_speed > hypot(s.x - wave_x, s.y - wave_y):
            break
    return s


def next_velocity(v: float, target: float) -> float:
    if target > v:
        return min(v + 2, min(target, 0)) if v < 0 else min(v + 1, target)
    if target < v:
        return max(v - 2, max(target, 0)) if v > 0 else max(v - 1, target)
    return v


def normalize(angle: float) -> float:
    while angle <= -pi:
        angle += 2 * pi
    while angle > pi:
        angle -= 2 * pi
    return angle
```

```java [Tank Royale · Java]
public final class SurfPredictor {
    public static final class State {
        public double x, y, heading, velocity;
        public long turn;

        public State(double x, double y, double heading, double velocity, long turn) {
            this.x = x;
            this.y = y;
            this.heading = heading;
            this.velocity = velocity;
            this.turn = turn;
        }
    }

    public static State predictIntercept(State start, double waveX, double waveY, long fireTurn,
            double bulletSpeed, int orbitDirection, boolean stop) {
        State s = new State(start.x, start.y, start.heading, start.velocity, start.turn);
        for (int i = 0; i < 500; i++) {
            double toBot = Math.atan2(s.y - waveY, s.x - waveX);
            double offset = normalize(toBot + orbitDirection * Math.PI / 2 - s.heading);
            int drive = 1;
            if (Math.abs(offset) > Math.PI / 2) {
                offset = normalize(offset + Math.PI);
                drive = -1;
            }
            double maxTurn = Math.toRadians(10 - 0.75 * Math.abs(s.velocity));
            s.heading += Math.max(-maxTurn, Math.min(maxTurn, offset));
            s.velocity = nextVelocity(s.velocity, stop ? 0 : 8 * drive);
            s.x += s.velocity * Math.cos(s.heading);
            s.y += s.velocity * Math.sin(s.heading);
            s.turn++;
            double radius = bulletSpeed * (s.turn - fireTurn);
            if (radius + bulletSpeed > Math.hypot(s.x - waveX, s.y - waveY)) {
                break;
            }
        }
        return s;
    }

    static double nextVelocity(double v, double target) {
        if (target > v) {
            return v < 0 ? Math.min(v + 2, Math.min(target, 0)) : Math.min(v + 1, target);
        }
        if (target < v) {
            return v > 0 ? Math.max(v - 2, Math.max(target, 0)) : Math.max(v - 1, target);
        }
        return v;
    }

    static double normalize(double angle) {
        while (angle <= -Math.PI) angle += 2 * Math.PI;
        while (angle > Math.PI) angle -= 2 * Math.PI;
        return angle;
    }
}
```

```csharp [Tank Royale · C#]
using System;

public sealed class SurfState
{
    public double X, Y, Heading, Velocity;
    public long Turn;
}

public static class SurfPredictor
{
    public static SurfState PredictIntercept(SurfState start, double waveX, double waveY, long fireTurn,
        double bulletSpeed, int orbitDirection, bool stop)
    {
        var s = new SurfState
        {
            X = start.X, Y = start.Y, Heading = start.Heading, Velocity = start.Velocity, Turn = start.Turn
        };
        for (int i = 0; i < 500; i++)
        {
            double toBot = Math.Atan2(s.Y - waveY, s.X - waveX);
            double offset = Normalize(toBot + orbitDirection * Math.PI / 2 - s.Heading);
            int drive = 1;
            if (Math.Abs(offset) > Math.PI / 2)
            {
                offset = Normalize(offset + Math.PI);
                drive = -1;
            }
            double maxTurn = (10 - 0.75 * Math.Abs(s.Velocity)) * Math.PI / 180;
            s.Heading += Math.Clamp(offset, -maxTurn, maxTurn);
            s.Velocity = NextVelocity(s.Velocity, stop ? 0 : 8 * drive);
            s.X += s.Velocity * Math.Cos(s.Heading);
            s.Y += s.Velocity * Math.Sin(s.Heading);
            s.Turn++;
            double radius = bulletSpeed * (s.Turn - fireTurn);
            double distance = Math.Sqrt(Math.Pow(s.X - waveX, 2) + Math.Pow(s.Y - waveY, 2));
            if (radius + bulletSpeed > distance)
            {
                break;
            }
        }
        return s;
    }

    private static double NextVelocity(double v, double target)
    {
        if (target > v) return v < 0 ? Math.Min(v + 2, Math.Min(target, 0)) : Math.Min(v + 1, target);
        if (target < v) return v > 0 ? Math.Max(v - 2, Math.Max(target, 0)) : Math.Max(v - 1, target);
        return v;
    }

    private static double Normalize(double angle)
    {
        while (angle <= -Math.PI) angle += 2 * Math.PI;
        while (angle > Math.PI) angle -= 2 * Math.PI;
        return angle;
    }
}
```

```typescript [Tank Royale · TypeScript]
type SurfState = { x: number; y: number; heading: number; velocity: number; turn: number };

function predictIntercept(
    start: SurfState,
    waveX: number,
    waveY: number,
    fireTurn: number,
    bulletSpeed: number,
    orbitDirection: number,
    stop: boolean,
): SurfState {
    const s = { ...start };
    for (let i = 0; i < 500; i += 1) {
        const toBot = Math.atan2(s.y - waveY, s.x - waveX);
        let offset = normalize(toBot + orbitDirection * Math.PI / 2 - s.heading);
        let drive = 1;
        if (Math.abs(offset) > Math.PI / 2) {
            offset = normalize(offset + Math.PI);
            drive = -1;
        }
        const maxTurn = (10 - 0.75 * Math.abs(s.velocity)) * Math.PI / 180;
        s.heading += Math.max(-maxTurn, Math.min(maxTurn, offset));
        s.velocity = nextVelocity(s.velocity, stop ? 0 : 8 * drive);
        s.x += s.velocity * Math.cos(s.heading);
        s.y += s.velocity * Math.sin(s.heading);
        s.turn += 1;
        const radius = bulletSpeed * (s.turn - fireTurn);
        if (radius + bulletSpeed > Math.hypot(s.x - waveX, s.y - waveY)) break;
    }
    return s;
}

function nextVelocity(v: number, target: number) {
    if (target > v) return v < 0 ? Math.min(v + 2, Math.min(target, 0)) : Math.min(v + 1, target);
    if (target < v) return v > 0 ? Math.max(v - 2, Math.max(target, 0)) : Math.max(v - 1, target);
    return v;
}

function normalize(angle: number) {
    while (angle <= -Math.PI) angle += 2 * Math.PI;
    while (angle > Math.PI) angle -= 2 * Math.PI;
    return angle;
}
```

:::

Angles are mathematical radians, so a platform adapter converts headings before and after. Two simplifications keep
the code short. The velocity steps down to zero before reversing, which is slightly more cautious than the real engine.
The loop also ignores walls, while a real surfer applies [wall smoothing](../basic/wall-avoidance-wall-smoothing.md)
inside it, as BasicSurfer does.

## True Surfing: decide every turn

True Surfing runs the predictor once for each option on every turn and commits to the best one for that turn only:

```txt
wave = the enemy wave that will hit first
for option in [forward, reverse, stop]:
    spot = predictIntercept(me, wave, option)
    danger[option] = danger of the GuessFactor at spot
drive this turn with the least dangerous option
```

BasicSurfer compares only the two orbit directions. RoboWiki describes the full style as choosing between forward,
reverse, and stop. Because the choice is remade every turn, the bot drifts toward the safest reachable spot as the
wave closes in, and it reacts at once when a new wave appears.

<!-- TODO: Illustration
**Filename:** wave-surfing-true-surfing-options.svg
**Caption:** "True Surfing predicts where each option meets the wave and takes the least dangerous one this turn."
**Viewport:** 8000x6400
**Battlefield:** true
**Description:** Scale is 8 viewport units per battlefield unit. The enemy fired a power-2 bullet (speed 14) from
(150, 400). On turn 5 the friendly bot sits at (650, 400), heading up at 4 units per turn. The paths are simulated
with the predictor on this page. Forward (up) meets the wave on turn 35 about 27° from head-on. Reverse (down) must
brake first and reaches only about 22°. Stop stays at the head-on spot. Danger values are an example.
**Bots:**
  - type: enemy, position: (960, 2960), body: 0, turret: 90, radar: 90, scale: 0.6
  - type: friendly, position: (4960, 2960), body: 0, turret: 270, radar: 270, scale: 0.6
**Arcs:**
  - center: (1200, 3200), radius: 560, startAngle: 300, endAngle: 60, color: #F59E0B, label: "wave now (turn 5)"
  - center: (1200, 3200), radius: 4008, startAngle: 320, endAngle: 40, color: #F59E0B, dashed: true,
    label: "wave on arrival (turn 35)"
**Lines:**
  - from: (5200, 3200), via: simulated path, to: (4785, 1392), color: #10B981, label: "forward: danger 0.2"
  - from: (5200, 3200), via: simulated path, to: (4915, 4716), color: #EF4444, label: "reverse: danger 0.9"
**Circles:**
  - center: (4785, 1392), radius: 90, color: #10B981, fill: #10B981
  - center: (4915, 4716), radius: 90, color: #EF4444, fill: #EF4444
  - center: (5200, 3200), radius: 330, color: #F59E0B, fill: none, dashed: true, label: "stop: danger 0.5"
**Texts:**
  - text: "brakes first, reaches less far", position: (5250, 4940), color: #EF4444
  - text: "enemy fired here", position: (1200, 3950), color: chocolate
-->

<img src="/images/wave-surfing-true-surfing-options.svg"
alt="True Surfing predicts where each option meets the wave and takes the least dangerous one this turn."
style="max-width:100%;height:auto;"/><br>
*True Surfing predicts where each option meets the wave and takes the least dangerous one this turn.*

The cost is CPU time: two or three predictions every turn, each running tens of turns ahead. The diagram also shows
why prediction matters. The bot was already moving forward, so reversing reaches a smaller angle than the 34.8°
escape limit for a speed-14 bullet would suggest.

## GoTo Surfing: pick a spot and drive there

GoTo Surfing looks for the safest reachable spot on the nearest wave up front, then moves there directly:

```txt
when the first wave to hit changes, or the target is no longer reachable:
    candidates = spots the bot can reach before that wave arrives
    target = the candidate with the least danger
every turn:
    drive toward target and stop on it until the wave passes
```

RoboWiki's GoTo Surfing page is a stub and does not say how DrussGT builds its candidates. One simple option, offered
here as book synthesis, is to record every position along the predicted forward, reverse, and stop paths. The appeal
is that the target can be any reachable point on the arc, not only where a full-speed orbit happens to end. The price
is more bookkeeping, because the plan must be checked and rebuilt whenever the bot or the waves change.

## Upgrades for either style

The Wave Surfing Tutorial lists improvements that work with both styles:

- **Surf the wave that hits first**, not merely the closest one.
- **Add a second wave** to the danger with a smaller weight, so dodging the first wave does not walk into the next.
- **Smooth the danger bins.** BasicSurfer uses 47 bins and adds $1 / ((i - b)^2 + 1)$ to every bin $i$ when a hit
  lands in bin $b$, so near misses count too.
- **Consider stop positions**, since standing still is sometimes the safest spot on the wave.

Melee surfing, as in Neuromancer, applies the same ideas to waves from
several enemies at once. Once a surfer dodges well, a clever gun starts learning its dodges. The
[Flattener](./flattener.md) is the answer to that.

## Platform notes

The acceleration, braking, and turn-rate limits are the same in classic Robocode and Tank Royale, so the predictor is
shared. Only angles differ: classic headings start at north and turn clockwise, while Tank Royale starts at east and
turns counterclockwise. Convert at the boundary and keep the predictor in one convention.

## Further Reading

- [Wave Surfing](https://robowiki.net/wiki/Wave_Surfing) - RoboWiki (classic Robocode)
- [Wave Surfing/True Surfing](https://robowiki.net/wiki/Wave_Surfing/True_Surfing) - RoboWiki (classic Robocode)
- [Wave Surfing/GoTo Surfing](https://robowiki.net/wiki/Wave_Surfing/GoTo_Surfing) - RoboWiki (classic Robocode)
- [Wave Surfing Tutorial](https://robowiki.net/wiki/Wave_Surfing_Tutorial) - RoboWiki (classic Robocode)
- [Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation
