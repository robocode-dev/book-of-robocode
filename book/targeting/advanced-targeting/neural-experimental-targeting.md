---
title: "Neural & Experimental Targeting"
category: "Targeting Systems"
summary: >-
  Two ways of stepping outside the usual wave-gun machinery: training a neural network to predict enemy movement,
  and finding which past firing positions a bullet would reach right now with one binary search over a shared
  history buffer.
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

A wave gun learns from what already happened and aims with a model built from those facts. Two less-traveled ideas
change a different part of that process. One replaces the [GuessFactor](/appendices/glossary#guessfactor) histogram
with a trained neural network. The other keeps the GuessFactor model and changes how the gun collects its data:
instead of tracking one wave object per turn, it searches a single history buffer for the past positions a bullet
would be reaching right now.

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
waves and GuessFactors and started pairing it with them. Wcsv's Engineer crossed a 2030
[RoboRumble](/appendices/glossary#roborumble) rating in 2006,
the first neural bot past 2000, and the modern Gaff combines waves, GuessFactors, and radial basis functions with its
network to build what many consider the strongest Anti-Surfer gun in the field.

> [!WARNING] The cost
> Training data is scarce inside a single battle. A network with too many inputs overfits the handful of shots a
> bot gets to fire, and tuning it takes far more trial and error than adding a segmentation axis to a GuessFactor
> gun. Reach for neural targeting only after wave-based methods stop improving.

## Retroactive hit analysis: an experimental idea

A [wave](/appendices/glossary#wave) gun commits to a bullet speed the moment it creates a wave. A wave started at
power 2 only ever answers questions about power-2 bullets. A gun that later wants to know how power 1.5 would have
done against the same enemy has nothing to ask, because that wave never existed.

Retroactive hit analysis keeps the raw history instead. Each turn, the bot stores one entry in a ring buffer: its own
position, plus the enemy's state at that moment (position, lateral direction, and velocity). Any bullet speed can be
asked about later, because the buffer holds both tracks: where a bullet could have started, and where the enemy went
afterwards. The question for each speed is the same: which stored entries is a bullet of that speed reaching right
now?

For entry `i`, stored at turn `tᵢ` from position `pᵢ`, and a bullet speed `v`, the gap between how far the bullet
has flown and how far away the enemy is now is

```txt
f(i) = v · (now − tᵢ) − distance(pᵢ, enemyNow)
```

A value near zero means a bullet fired from that entry is reaching the enemy on this turn. A value between −18 and
18 means the bullet overlaps the enemy's 18-unit hit margin.

Here is the trick. Moving from one entry to the next newer one, the first term shrinks by `v`, which is at least 11
units per turn, because bullet speed is `20 − 3 × firepower`. The second term changes by at most the bot's own
movement, which is at most 8 units per turn. So `f` drops by at least 3 units at every step. The same argument holds
over time: for a fixed entry, the bullet gains at least 11 units per turn while the enemy moves at most 8, so `f`
rises by at least 3 units per turn.

Those two facts turn wave checking into bookkeeping on two indices. The entries whose bullet has reached the front of
the enemy (`f ≥ −18`) form a run at the old end of the buffer, and that run only grows. The same holds for the
entries whose bullet has already passed the back of the enemy (`f > 18`). For each speed, the bot remembers where each run
ended on the previous scan and binary-searches where it ends now. Every entry in between crossed since the last scan,
and each one is handled exactly once:

```txt
for each tracked bulletSpeed s:
    enterEnd[s], leaveEnd[s]     # where each run ended on the previous scan

on each scan:
    for each tracked bulletSpeed s:
        newEnter = binarySearch(buffer, last entry with f >= -18)
        newLeave = binarySearch(buffer, last entry with f > 18)
        for each entry e after enterEnd[s] up to newEnter:      # bullet reaches the enemy
            e.startGf[s] = guessFactor(e.enemyState, bearing(e.myPosition, enemyNow), s)
        for each entry e after leaveEnd[s] up to newLeave:      # bullet leaves the enemy
            endGf = guessFactor(e.enemyState, bearing(e.myPosition, enemyNow), s)
            record(range(e.startGf[s], endGf), segmentsOf(e.enemyState))
        enterEnd[s] = newEnter
        leaveEnd[s] = newLeave
```

The same loop copes with skipped scans, which are common in melee when the radar is busy elsewhere. If three turns
pass between scans, more entries fall between the old and new ends, and every one of them is still recorded once. If
an entry enters and leaves within one gap, the first loop sets its start just before the second loop reads it.

The enemy snapshot is what makes the data useful. A plain bearing from an old position to the enemy's current spot
describes one geometry that never repeats. Measured against the enemy's position and lateral direction at `tᵢ` and
scaled by the maximum escape angle, the same hit becomes a GuessFactor that the gun can reuse from any position,
exactly as it would with a wave.

<!-- TODO: Illustration
**Filename:** retroactive-hit-analysis-geometry.svg
**Caption:** "A bullet fired from this entry 100 turns ago at 19 units per turn is reaching the enemy now."
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
alt="A bullet fired from this entry 100 turns ago at 19 units per turn is reaching the enemy now."
style="max-width:100%;height:auto;"/><br>
*A bullet fired from this entry 100 turns ago at 19 units per turn is reaching the enemy now.*

### What it trades away

The data is only as good as the hit test. Against a gun whose waves use the enemy's center point, the two methods
record the same GuessFactors. Stronger wave guns use precise intersection: they test the bullet's path against the
enemy's hitbox on every turn it overlaps and record the whole range of GuessFactors that would have hit. The two
crossings above only measure that range at its ends, when the bullet reaches the 18-unit margin and when it leaves
it, and only on turns the bot actually scanned. That is an approximation of precise intersection, not a match for it.

The history also has limits. A bullet speed asked about after the fact can only be replayed over turns where the
buffer holds the enemy's position, so gaps in scanning become gaps in the answer. And the buffer must be long enough
to cover the slowest bullet's flight across the battlefield.

The idea still needs a real bot. Until it shows that asking about any bullet speed later improves a gun's firepower
choice, it remains a hypothesis.

## Choosing between them

| Aspect              | Neural Targeting                          | Retroactive Hit Analysis                    |
|----------------------|--------------------------------------------|----------------------------------------------|
| Status               | Established, RoboWiki-documented           | Experimental, untested in a real bot          |
| What it changes      | The model that turns data into an aim      | How the gun collects its GuessFactor data     |
| Strongest when       | Paired with waves and GuessFactors         | Comparing bullet powers after the fact        |
| Weakest when         | Data is scarce, network overfits           | Against precise-intersection wave guns        |

Neither method replaces wave-based targeting. Neural targeting earns its keep as an addition to a wave gun, not a
substitute. Retroactive hit analysis feeds the same kind of gun from a history that any bullet speed can query later,
and it still has to show that this flexibility wins battles.

## Platform notes

Both ideas depend only on shared rules: bullet speed of `20 - 3 × firepower` units per turn, and an 18-unit hit
margin that stands in for Tank Royale's circular hitbox and approximates classic Robocode's 36×36 square. Convert
bearings at the API boundary, since the two platforms define 0° differently.

## Further Reading

- [Neural Targeting](https://robowiki.net/wiki/Neural_Targeting) - RoboWiki (classic Robocode)
- [Waves](https://robowiki.net/wiki/Waves) - RoboWiki (classic Robocode)
- [Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation
