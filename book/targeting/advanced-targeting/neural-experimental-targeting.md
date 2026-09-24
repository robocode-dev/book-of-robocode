---
title: "Neural & Experimental Targeting"
category: "Targeting Systems"
summary: >-
  Two ways of stepping outside the usual wave-gun machinery: training a neural network to predict enemy movement,
  and keeping one history of both bots' positions so the gun can ask later how any bullet speed would have done.
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
instead of waves fixed to one bullet speed each, it keeps one history of both bots' positions, so the gun can ask
afterwards how any bullet speed would have done.

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

The first term needs the right turn count, because an off-by-one shifts every recorded GuessFactor the same way. In
Tank Royale, a bot that decides to fire after seeing turn `tᵢ` gets its bullet on the next turn, starting at `pᵢ`,
and the bullet moves `v` units within that same turn. So on turn `now`, the bullet is `v · (now − tᵢ)` units out,
which is the first term of `f`. The hit test on that turn sweeps the bullet's next step as well, from
`v · (now − tᵢ)` to `v · (now − tᵢ + 1)`, against where the enemy stands after moving.

So a bullet reaches the front of the enemy's 18-unit hit margin once `f + v ≥ −18`, one step earlier than `f` alone
suggests. It has passed the back of the margin once `f > 18`.

Here is the trick. Moving from one entry to the next newer one, the first term shrinks by `v`, which is at least 11
units per turn, because bullet speed is `20 − 3 × firepower`. The second term changes by at most the bot's own
movement, which is at most 8 units per turn. So `f` drops by at least 3 units at every step. The same argument holds
over time: for a fixed entry, the bullet gains at least 11 units per turn while the enemy moves at most 8, so `f`
rises by at least 3 units per turn.

Those two facts turn wave checking into bookkeeping on two indices. The entries whose bullet has reached the front of
the enemy (`f + v ≥ −18`) form a run at the old end of the buffer, and that run only grows, since adding the
constant `v` keeps `f` in order. The same holds for the entries whose bullet has already passed the back of the
enemy (`f > 18`). For each speed, the bot remembers where
each run ended on the previous scan and binary-searches where it ends now. Every entry in between crossed since the
last scan, and each one is handled exactly once:

```txt
# enterEnd[s], leaveEnd[s]: where each run ended the last time speed s was advanced
gfSpan(e, s, enemyNow):             # GuessFactors covered by the enemy's width, not its center
    b = bearing(e.myPosition, enemyNow)
    w = atan(18 / distance(e.myPosition, enemyNow))
    g1 = guessFactor(e.enemyState, b - w, s)
    g2 = guessFactor(e.enemyState, b + w, s)
    return (lo: min(g1, g2), hi: max(g1, g2))

advance(s, now, enemyNow):          # f uses now and enemyNow, entries up to turn now
    newEnter = binarySearch(buffer, last entry with f + s >= -18)   # hit test sweeps one step ahead
    newLeave = binarySearch(buffer, last entry with f > 18)
    for each entry e after enterEnd[s] up to newEnter:      # bullet reaches the enemy
        e.startSpan[s] = gfSpan(e, s, enemyNow)
    for each entry e after leaveEnd[s] up to newLeave:      # bullet leaves the enemy
        endSpan = gfSpan(e, s, enemyNow)
        lo = min(e.startSpan[s].lo, endSpan.lo)             # hull, not union: the enemy
        hi = max(e.startSpan[s].hi, endSpan.hi)             # crossed every angle in between
        record(range(lo, hi), segmentsOf(e.enemyState))
    enterEnd[s] = newEnter
    leaveEnd[s] = newLeave

on each scan:
    for each tracked bulletSpeed s:
        advance(s, currentTurn, scannedEnemyPosition)
```

The same loop copes with skipped scans, which are common in melee when the radar is busy elsewhere. If three turns
pass between scans, more entries fall between the old and new ends, and every one of them is still recorded once.

An entry can also enter and leave within one gap. The first loop then sets its start just before the second loop
reads it, and both ends use the same enemy position. With center bearings that range would have zero width. With
`gfSpan`, it still covers the enemy's width, `±atan(18 / d)` around the center, where `d` is the distance from the
entry's firing position. What it misses is the enemy's movement during the turns the bullet spent crossing it.

Asking about a new bullet speed later uses the same function. The bot starts both runs before the oldest entry and
replays the buffer, oldest turn first, treating each stored enemy position as if it were the scan of that turn:

```txt
track a new bulletSpeed s:
    enterEnd[s] = leaveEnd[s] = before the oldest entry
    for each buffered turn T where the enemy was scanned, oldest first:
        advance(s, T, buffer[T].enemyState.position)
    add s to the tracked speeds
```

When the replay reaches the newest turn, speed `s` has the same statistics it would have had if the bot had tracked it
from the start of the buffer, and the ordinary scan loop carries on from there.

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
crossings above cover the enemy's width at each end, through `gfSpan`, but they only look at the ends: when the
bullet reaches the 18-unit margin and when it leaves it, and only on turns the bot actually scanned. An 18-unit
circle also stands in for classic Robocode's square hitbox. That is an approximation of precise intersection, not a
match for it.

The biggest limit hits the headline feature. The enemy's recorded path is its reaction to the bullets the bot
actually fired. A [wave surfer](/appendices/glossary#wave-surfing) sees the energy drop of each real shot, works out
that bullet's speed, and moves to dodge that one wave. Replaying a different speed asks how a bullet the surfer never
saw would have done against movement that was dodging something else. A surfer that had seen that bullet would have
moved differently, so the replayed record is a counterfactual that the buffer cannot correct, and nothing in it shows
how far off it is. This is not unique to the method: waves started on turns without a real shot have the same
problem, which is why anti-surfer guns weight real waves above virtual ones. Against a surfer, only the speeds the
bot really fired give trustworthy statistics. Against
movement that ignores bullets, such as an oscillator or a random mover, the path would have been the same whatever
the bot fired, and comparing bullet powers after the fact holds up.

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
| Strongest when       | Paired with waves and GuessFactors         | Comparing powers when movement ignores bullets |
| Weakest when         | Data is scarce, network overfits           | Replaying unfired speeds against wave surfers |

Neither method replaces wave-based targeting. Neural targeting earns its keep as an addition to a wave gun, not a
substitute. Retroactive hit analysis feeds the same kind of gun from a history that any bullet speed can query later.
That flexibility only tells the truth against enemies that do not react to the bullets the bot fired, and it still
has to show that it wins battles.

## Platform notes

Both ideas depend only on shared rules: bullet speed of `20 - 3 × firepower` units per turn, and an 18-unit hit
margin that stands in for Tank Royale's circular hitbox and approximates classic Robocode's 36×36 square. Convert
bearings at the API boundary, since the two platforms define 0° differently.

The firing-turn timing in the retroactive hit analysis section follows the Tank Royale server's turn order. Classic
Robocode updates bullets in its own order, so a classic bot should check the turn count before trusting the `f + v`
test.

## Further Reading

- [Neural Targeting](https://robowiki.net/wiki/Neural_Targeting) - RoboWiki (classic Robocode)
- [Waves](https://robowiki.net/wiki/Waves) - RoboWiki (classic Robocode)
- [Physics](https://robocode.dev/articles/physics.html) - Tank Royale documentation
