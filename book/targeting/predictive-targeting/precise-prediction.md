---
title: "Precise Prediction"
category: "Targeting Systems"
summary: "Precise prediction simulates turn-by-turn movement rules to calculate a reachable future position accurately."
tags: ["precise-prediction", "targeting", "predictive-targeting", "advanced", "robocode", "tank-royale"]
difficulty: "advanced"
source:
  - "RoboWiki - Precise Prediction (classic Robocode) https://robowiki.net/wiki/Precise_Prediction"
  - "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html"
---

# Precise Prediction

> [!TIP] Origins
> **Albert Perez**'s FuturePosition class was one of the first **Precise Prediction** implementations. The RoboWiki
> community developed the idea further through movement simulators such as Rozu's Apollon code, which the Wave Surfing
> Tutorial uses.

At full speed, a bot cannot turn as sharply as a bot that is stopped. It also brakes twice as quickly as it accelerates.
Any predictor that moves a point in a straight line and fixes it afterward will eventually choose a position the bot
could never reach.

Precise prediction advances a full movement state one turn at a time under the battle rules. Wave surfers use it to
compare reachable paths before a wave arrives. Predictive guns use the same idea when replaying a likely enemy path.

## Simulate the rules, not a sketch

The state usually includes position, heading, velocity, remaining movement, and remaining turn. Each simulated turn
applies the engine's acceleration, braking, turn-rate limit, motion, and wall handling in the same order as the game.
The exact command stream must be known or hypothesized. No predictor can know an enemy's next command by physics alone.

For both platforms, maximum body turn rate in degrees per turn is $10 - 0.75|v|$, where $v$ is velocity in units per
turn. A bot accelerates by at most 1 unit per turn, brakes by up to 2, and its speed is capped at 8 units per turn.
Those limits turn an attractive destination into a reachable trajectory.

<!-- TODO: Illustration
**Filename:** precise-prediction-reachable-paths.svg
**Caption:** "Physics limits make only some paths reachable before a bullet wave arrives."
**Viewport:** 8000x5000
**Battlefield:** true
**Description:** The friendly bot orbits at full speed. A shaded green fan shows positions reachable before impact,
built from 16 simulated turns at every allowed turn rate. The green path has a dot every two turns. The red path needs
a sharp corner, marked with an X, that the turn-rate limit forbids.
**Bots:**
  - type: friendly, position: (3000, 3400), body: 52, turret: 52, radar: 52
  - type: enemy, position: (1000, 800), body: 142, turret: 142, radar: 142
**Circles:**
  - center: (1300, 1100), radius: 1500, color: #F59E0B, fill: none, label: "incoming wave"
  - center: (1300, 1100), radius: 3700, color: #F59E0B, fill: none, dashed: true, label: "wave impact time"
**Lines:**
  - from: (3300, 3700), to: (4383, 1969), color: #10B981, arrow: true, dashed: false, label: "reachable path"
  - from: (3300, 3700), via: (3855, 3273), to: (3813, 4272), color: #EF4444, arrow: true, dashed: true,
    label: "unreachable turn"
**Texts:**
  - text: "too sharp at 8 units/turn", position: (3655, 3233), color: #EF4444
  - text: "reachable at full speed", position: (5390, 3617), color: #10B981
  - text: "turn rate: 10 − 0.75·|v|", position: (2950, 3780), color: #60A5FA
-->

<img src="/images/precise-prediction-reachable-paths.svg"
alt="Physics limits make only some paths reachable before a bullet wave arrives."
style="max-width:100%;height:auto;"/><br>
*Physics limits make only some paths reachable before a bullet wave arrives.*

## The prediction loop

Run the simulation until an event provides the stopping condition. For surfing, it is the turn an enemy wave intersects
the simulated bot. For an intercept calculation, stop when bullet travel has caught up with the predicted enemy
position. Keep the predictor independent of scan and gun code so it can be tested with recorded states.

```txt
state = current movement state
while not stoppingCondition(state, turn):
    allowedTurn = 10 - 0.75 * abs(state.velocity)
    state.heading += clamp(requestedTurn, -allowedTurn, allowedTurn)
    state.velocity = applyAccelerationOrBrake(state.velocity, requestedMove)
    state.position = moveAndResolveWalls(state.position, state.heading, state.velocity)
    turn += 1
return state.position
```

The order is deliberate. A simulator with the right constants but the wrong update order is still not precise. Compare
each predicted next state with a replay or an on-screen trace before building larger surfing or targeting decisions on
top of it.

## Where precision helps and where it cannot

Precision is most valuable near walls, at high speed, and when a wave is only a few turns away. It prevents a surfer
from rating impossible escape paths as safe and prevents a replaying gun from carrying an enemy through a wall.

It cannot repair an incorrect behavior model. A pattern matcher may replay the wrong sequence, and a gun does not know
whether the enemy will reverse next turn. Precise prediction reduces physics error. It does not remove uncertainty about
decisions.

## Platform notes

Tank Royale documents the movement limits used above, including its 8-units-per-turn speed cap and turn-rate formula.
Classic Robocode uses the same familiar constraints, but classic headings are compass-style while Tank Royale headings
are mathematical. Put that conversion at the edge of the predictor, then keep its internal angles consistent.

## Further Reading

- [Precise Prediction](https://robowiki.net/wiki/Precise_Prediction) - RoboWiki (classic Robocode)
- [Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation
- [Wave Surfing](https://robowiki.net/wiki/Wave_Surfing) - RoboWiki (classic Robocode)
