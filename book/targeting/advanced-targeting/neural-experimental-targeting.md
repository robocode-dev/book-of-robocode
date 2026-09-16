---
title: "Neural & Experimental Targeting"
category: "Targeting Systems"
summary: >-
  Two ways of stepping outside the wave-and-GuessFactor mainstream: training a neural network to predict enemy
  movement, and testing bullet speeds retroactively against your own recorded flight path instead of predicting
  forward at all.
tags:
  - neural-experimental-targeting
  - targeting
  - advanced-targeting
  - neural-targeting
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Neural Targeting (classic Robocode) https://robowiki.net/wiki/Neural_Targeting"
  - "RoboWiki - Waves (classic Robocode) https://robowiki.net/wiki/Waves"
  - "Book synthesis - Retroactive Hit Analysis Targeting (original idea, not battle-tested)
    specs/retroactive-hit-analysis.md"
  - "Robocode Tank Royale Docs - Physics https://robocode.dev/articles/physics.html"
---

# Neural & Experimental Targeting

> [!TIP] Origins
> **Neural Targeting** traces back to **Qohnil**'s XBot (2002) and gained real traction through **Albert**'s
> ScruchiPu, later refined into strong Anti-Surfer guns by **Wcsv** (Engineer) and in **Gaff**. **Retroactive Hit
> Analysis**, the second idea on this page, was proposed by **Flemming Nørnberg Larsen (fnl)** in 2026. It has not
> been documented on RoboWiki or tested in a competing bot, so treat it as a hypothesis worth trying, not settled
> doctrine like the rest of this book.

Every targeting method covered so far predicts forward: build a model from past data, then guess where the enemy
will be when the bullet arrives. Two less-traveled ideas turn that model-building step inside out. One replaces the
GuessFactor histogram with a trained neural network. The other skips prediction entirely and asks a simpler
question: given where I already know I stood, which bullet speed would have connected just now?

## Neural targeting

A GuessFactor gun stores hits in bins and looks up the busiest one. A neural targeting gun instead trains a small
network, typically fed the enemy's recent speed, heading, and turn rate, to output a predicted position or
GuessFactor directly. The promise is a model that generalizes between similar situations instead of needing an exact
bin match.

The earliest known example was Qohnil's XBot (2002), though little survives about how it worked. Albert's ScruchiPu,
a year later, is better documented: it fed enemy speed and turn rate into a network and iterated the prediction one
tick at a time, much like pattern matching with a learned step function instead of a replayed one. A wave of neural
bots followed.

Most of them underperformed: a trained network only reflects situations it has already seen, and Robocode battles
rarely repeat a state exactly. The technique only became competitive once bots stopped asking the network to replace
waves and GuessFactors and started pairing it with them. Wcsv's Engineer crossed a 2030 RoboRumble rating in 2006,
the first neural bot past 2000, and the modern Gaff combines waves, GuessFactors, and radial basis functions with its
network to build what many consider the strongest Anti-Surfer gun in the field.

> [!WARNING] The cost
> Training data is scarce inside a single battle. A network with too many inputs overfits the handful of shots a
> bot gets to fire, and tuning it takes far more trial and error than adding a segmentation axis to a GuessFactor
> gun. Reach for neural targeting only after wave-based methods stop improving.

## Retroactive hit analysis: an experimental idea

Wave-based targeting works by predicting forward: fire, then track an expanding circle until it reaches the enemy,
then record the angle. That means every wave needs the enemy's position at some future turn before it teaches the
gun anything.

Retroactive hit analysis flips the order. Keep a short buffer of your own past positions and headings, maybe the last
50 to 100 turns, and every time you scan the enemy, work backward: for each past position and each candidate bullet
speed, would a bullet fired from there have covered the exact distance to where the enemy is right now?

```txt
for each of my past positions p (up to ~100 turns back):
    ticksElapsed = currentTurn - p.turn
    for each candidate bulletSpeed:
        expectedDistance = bulletSpeed * ticksElapsed
        actualDistance = distance(p.position, enemyCurrentPosition)
        if |expectedDistance - actualDistance| < 18:   # bot radius, in units
            angle = bearing(p.position, enemyCurrentPosition)
            record(angle, bulletSpeed, p.turn)
```

A hit found this way is not a prediction, it is a fact about the past: "a bullet fired from that spot, at that
speed, would have landed here." Bin those facts by angle the same way a GuessFactor gun bins live hits, and the
result is a histogram built entirely from ground truth instead of forward simulation.

<!-- TODO: Illustration
**Filename:** retroactive-hit-analysis-geometry.svg
**Caption:** "Testing a past position against the enemy's current spot finds which bullet speed would have connected."
**Viewport:** 5200x4200
**Battlefield:** true
**Bots:**
  - type: friendly, position: (900, 2900), body: 68, turret: 68, radar: 68
  - type: enemy, position: (2662, 2188), body: 200, turret: 30, radar: 30
**Lines:**
  - from: (1200, 3200), to: (2962, 2488), color: #F59E0B, arrow: true, dashed: false,
    label: "1900 units = 19 units/turn x 100 turns"
**Circles:**
  - center: (1200, 3200), radius: 90, color: #6B7280, fill: none, label: "past position, 100 turns ago"
  - center: (1200, 3200), radius: 1900, color: #F59E0B, fill: none, dashed: true, label: "reach at that speed"
  - center: (2962, 2488), radius: 90, color: #10B981, fill: none, label: "enemy now"
**Texts:**
  - text: "within 18 units: a hit", position: (3250, 3600), color: chocolate
-->

<img src="/images/retroactive-hit-analysis-geometry.svg"
alt="Testing a past position against the enemy's current spot finds which bullet speed would have connected."
style="max-width:100%;height:auto;"/><br>
*Testing a past position against the enemy's current spot finds which bullet speed would have connected.*

### What it trades away

The method never predicts what happens next turn, only what would have worked a few turns ago. It leans on the enemy
repeating similar movement over that short window, an assumption that breaks the moment the enemy changes rhythm, and
it runs one distance check per past position per candidate speed every scan, cheap but not free.

The same buffer works in reverse for movement: track the *enemy's* past positions instead of your own, and when one
of their bullets hits or misses, work backward to find which position it was fired from. That builds a danger map of
where the enemy's gun tends to succeed, though it only learns after the fact, so it never dodges anything in real
time the way wave surfing does.

## Choosing between them

| Aspect              | Neural Targeting                          | Retroactive Hit Analysis                    |
|----------------------|--------------------------------------------|----------------------------------------------|
| Status               | Established, RoboWiki-documented           | Experimental, untested in a real bot          |
| Data source          | Trained model over historical states       | Direct geometric test against ground truth    |
| Strongest when       | Paired with waves and GuessFactors         | Enemy movement holds steady for a few turns   |
| Weakest when         | Data is scarce, network overfits           | Enemy changes rhythm between scans            |

Neither method replaces wave-based targeting outright. Neural targeting earns its keep as an addition to a wave gun,
not a substitute, and retroactive hit analysis remains a hypothesis worth testing before trusting it in competition.

## Platform notes

Both ideas depend only on shared rules: bullet speed of `20 - 3 × firepower` units per turn, and an 18-unit hit
margin that stands in for Tank Royale's circular hitbox and approximates classic Robocode's 36×36 square. Convert
bearings at the API boundary, since the two platforms define 0° differently.

## Further Reading

- [Neural Targeting](https://robowiki.net/wiki/Neural_Targeting) - RoboWiki (classic Robocode)
- [Waves](https://robowiki.net/wiki/Waves) - RoboWiki (classic Robocode)
- [Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation
