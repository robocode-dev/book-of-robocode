---
title: "Anti-Surfer Targeting"
category: "Targeting Systems"
summary: "Anti-surfer targeting adapts a gun's data and selection rules to opponents that react to bullet waves."
tags:
  - anti-surfer-targeting
  - targeting
  - advanced-targeting
  - wave-surfing
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Anti-Surfer Targeting (classic Robocode) https://robowiki.net/wiki/Anti-Surfer_Targeting"
  - "RoboWiki - Wave Surfing (classic Robocode) https://robowiki.net/wiki/Wave_Surfing"
  - "RoboWiki - Pattern Matching (classic Robocode) https://robowiki.net/wiki/Pattern_Matching"
  - "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html"
---

# Anti-Surfer Targeting

> [!TIP] Origins
> **Anti-Surfer Targeting** grew from the RoboWiki community's effort to improve guns against the wave-surfing movement
> pioneered by **ABC**.

A wave surfer does not merely repeat a movement pattern. After detecting a shot, it estimates where that bullet wave is
dangerous and steers toward a safer place. A normal statistical gun can end up learning positions caused by its own
earlier waves, then politely aiming at the route the surfer has already abandoned.

Anti-surfer targeting is a collection of responses to that feedback loop, not one universal gun. A top surfer remains a
hard target, so the goal is a better tested estimate rather than a guaranteed counter.

## Which observations deserve trust?

Many statistical guns create virtual waves every turn. Those non-firing waves are useful samples against ordinary
movement, but they do not trigger the exact reaction a real energy drop triggers. Against a surfer, give the outcome of
an actual shot more influence than an outcome from a virtual wave.

Recent results matter most because a surfer may revise its danger model after being hit. One simple age rule is
$w = w_f e^{-\lambda a}$, where $w_f$ is the base weight for a firing or virtual wave, $a$ is sample age in turns, and
$\lambda$ controls how quickly old evidence fades. Apply this weight when building the
[GuessFactor](/appendices/glossary#guessfactor) density, not by
pretending the old result never happened.

<!-- TODO: Illustration
**Filename:** anti-surfer-data-relevance.svg
**Caption:** "A real bullet wave influences a surfer differently from a virtual wave that was never fired."
**Viewport:** 8000x5000
**Battlefield:** true
**Description:** The friendly bot fires a real bullet. Its solid orange wave is about to reach the enemy surfer, which
reverses along a green path away from the dashed gray spot the old data predicted. A dashed gray virtual wave from a
turn without a shot carries no bullet, so the surfer ignores it.
**Bots:**
  - type: friendly, position: (1300, 3400), body: 40, turret: 60, radar: 60
  - type: enemy, position: (5843, 1564), body: 158, turret: 248, radar: 248
**Arcs:**
  - center: (1600, 3700), radius: 4350, startAngle: 298, endAngle: 12, color: #F59E0B, arrow: false, dashed: false,
    label: "real bullet wave"
  - center: (1600, 3700), radius: 2500, startAngle: 290, endAngle: 10, color: #9CA3AF, arrow: false, dashed: true,
    label: "virtual wave"
**Lines:**
  - from: (6143, 1864), to: (6660, 2800), color: #10B981, arrow: true, dashed: false, label: "dodges the real wave"
  - from: (6143, 1864), to: (5720, 1060), color: #9CA3AF, arrow: true, dashed: true, label: "old data predicted here"
**Bullets:**
  - position: (5367, 1525), radius: 70, color: #F59E0B
**Texts:**
  - text: "surfer reacts here", position: (6950, 3260), color: chocolate
  - text: "bullet fired: high weight", position: (6046, 4447), color: #F59E0B
  - text: "no bullet: low weight", position: (4195, 3355), color: #9CA3AF
  - text: "fires: energy drops", position: (1600, 4220), color: #60A5FA
-->

<img src="/images/anti-surfer-data-relevance.svg"
alt="A real bullet wave influences a surfer differently from a virtual wave that was never fired."
style="max-width:100%;height:auto;"/><br>
*A real bullet wave influences a surfer differently from a virtual wave that was never fired.*

## A practical selection loop

Start with a wave-based gun that records the firing situation and observed GuessFactor. Add the adjustments one at a
time, so their effects remain measurable.

```txt
when a wave reaches the enemy:
    sampleWeight = high if wave fired a bullet else low
    record(stateAtFire, observedGuessFactor, sampleWeight, currentTurn)

when aiming:
    candidates = recent, similar samples for the current state
    score each GuessFactor with weighted density and age decay
    aim at the highest-scoring legal angle
```

Using fewer, more recent nearest neighbors is one possible tuning choice. It reduces stale influence but increases
noise. Multiple virtual guns are also useful: let a regular statistical gun, a recency-focused gun, and a pattern
matcher compete on real bullet results instead of declaring one strategy the winner before the battle.

## A different kind of prediction

[Pattern matching](/appendices/glossary#pattern-matching) does not choose an angle from the same wave statistics that
a surfer expects. It replays a matching
sequence of heading changes and velocities. That difference often makes it a valuable virtual gun against surfers,
though it fails when the enemy deliberately breaks its movement sequence.

Avoid treating every miss as proof that the surfer chose a specific GuessFactor. Walls, overlapping waves, missed scans,
and gun timing all change the path. Draw fired waves and selected angles while debugging, then compare guns over many
rounds against more than one surfer.

## Platform notes

The counterplay depends on shared movement and bullet rules, not on a special platform API. Classic Robocode and Tank
Royale both require the gun to preserve the fire-time state and follow bullet travel. Convert bearings consistently at
the API boundary, because their angle conventions differ.

## Further Reading

- [Anti-Surfer Targeting](https://robowiki.net/wiki/Anti-Surfer_Targeting) - RoboWiki (classic Robocode)
- [Wave Surfing](https://robowiki.net/wiki/Wave_Surfing) - RoboWiki (classic Robocode)
- [Pattern Matching](https://robowiki.net/wiki/Pattern_Matching) - RoboWiki (classic Robocode)
- [Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation
