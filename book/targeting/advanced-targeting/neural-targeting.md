---
title: "Neural Targeting"
category: "Targeting Systems"
summary: >-
  How a neural network can take the place of a GuessFactor histogram, why the first neural guns fell behind, and how
  a modern neural gun trains on waves.
tags:
  - neural-targeting
  - targeting
  - advanced-targeting
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Neural Targeting (classic Robocode) https://robowiki.net/wiki/Neural_Targeting"
  - "RoboWiki - Gaff/Targeting (classic Robocode) https://robowiki.net/wiki/Gaff/Targeting"
  - "RoboWiki - Engineer (classic Robocode) https://robowiki.net/wiki/Engineer"
  - "RoboWiki - Waves (classic Robocode) https://robowiki.net/wiki/Waves"
---

# Neural Targeting

> [!TIP] Origins
> **Neural Targeting** traces back to **Qohnil**'s XBot (2002) and gained real traction through **Albert**'s
> ScruchiPu. **Wcsv** made it competitive with Engineer, and **Darkcanuck** refined it in Gaff into what RoboWiki
> calls probably the strongest Anti-Surfer gun.

A [GuessFactor](/appendices/glossary#guessfactor) gun learns by counting. Every wave that reaches the enemy adds a
visit to one bin, in one segment, and the gun fires at the busiest bin. A situation that falls into a thin segment
gets aimed from a handful of visits. A neural gun replaces the counting with a trained network, so that every shot
nudges the same set of weights and similar situations can share what they learned.

## What the network replaces

The question stays the same: where will the enemy be, as a GuessFactor, when the bullet arrives? A neural gun feeds
the current situation in as numbers and reads a score for each GuessFactor out. Training moves those scores toward
the GuessFactors that waves actually recorded.

The earliest known example, Qohnil's XBot (2002), left few details behind. Albert's ScruchiPu, about a year later,
took a different route. It fed the enemy's speed and turn rate into a network, predicted them for the next turn, and
iterated one turn at a time, much like [pattern matching](/appendices/glossary#pattern-matching) with a learned step
function instead of a replayed one. A wave of neural bots followed, and RoboWiki records that most of them
underperformed other targeting methods.

## Waves as training data

The turn came when neural guns stopped predicting movement turn by turn and took over the job a GuessFactor gun
already does. Wcsv's Engineer used [waves](/appendices/glossary#wave) and GuessFactors as its training data:
situational attributes went in, and the resulting GuessFactors came out. In May 2006 it reached a 2030
[RoboRumble](/appendices/glossary#roborumble) rating, the first neural targeting bot past 2000. Its network was a
self-organizing map, which it also used for movement.

## Inside Gaff's gun

Darkcanuck documented Gaff's gun in detail, which makes it a good model of a modern neural gun. It uses two
multi-layer perceptrons trained by back-propagation, with no hidden layers, because the author found that hidden
layers only slowed down learning.

**Inputs.** Ten situational attributes, including bullet flight time, lateral velocity, lateral acceleration,
approach velocity, time since the last velocity and direction change, room to the wall ahead and behind in radians,
and the current GuessFactor. Radial basis functions spread each attribute over several inputs, about 84 in total, so
a value lights up the inputs near it instead of a single one.

**Outputs.** 61 sigmoid outputs, one per GuessFactor bin from −1 to +1.

**Training.** When a wave reaches the enemy, the network trains on the situation stored with that wave. The target
is not a single bin set to 1. A radial basis function shapes a bump around the hit, as wide as the enemy's effective
bot width at that distance.

The two networks differ in what they remember. One is built to forget: it favors the newest waves so that it
can follow a surfer that has just changed its path. The other keeps a 200-wave buffer and replays a few old waves
each time a wave arrives, which keeps its view of the enemy stable.

```txt
on wave reaching the enemy:
    x = rbfEncode(wave.situation)                      # about 84 inputs
    target = rbfBump(center: hitGF, width: botWidthGF) # 61 values between 0 and 1
    recentNet.train(x, target)                         # high weight on the newest waves
    buffer.add(wave), replacing a random old wave when full (200 waves)
    for wave w in latest firing wave plus 4 random waves from buffer:
        stableNet.train(rbfEncode(w.situation), w.target)

on aim:
    scores = recentNet(rbfEncode(now)) + stableNet(rbfEncode(now))
    fire at the reachable GuessFactor with the highest score
```

"Reachable" matters: Gaff only searches the GuessFactors the enemy can actually reach before a wall stops it.

> [!WARNING] The cost
> Training data is scarce inside a single battle. A network with too many inputs overfits the handful of shots a
> bot gets to fire, and tuning it takes far more trial and error than adding a segmentation axis to a GuessFactor
> gun. Gaff's author adds that neural networks are hard to debug, because it is not obvious what they are doing, so
> a bug can hide for a long time. Reach for neural targeting only after wave-based methods stop improving.

The platforms do not differ here. The inputs are the same wave measurements any GuessFactor gun uses, so only the
bearing conversion at the API boundary changes between classic Robocode and Tank Royale.

## Where it goes next

Gaff's forgetful network answers the same problem as [Anti-Surfer Targeting](./anti-surfer-targeting.md): a surfer
reacts to the gun, so old data turns stale. A gun that weights data by age, or trusts real waves above virtual ones,
can apply the same idea without a network. The experimental
[Retroactive Hit Analysis](./retroactive-hit-analysis.md) changes a different part of the pipeline: not the model
that turns data into an aim, but the way the gun collects that data.

## Further Reading

- [Neural Targeting](https://robowiki.net/wiki/Neural_Targeting) - RoboWiki (classic Robocode)
- [Gaff/Targeting](https://robowiki.net/wiki/Gaff/Targeting) - RoboWiki (classic Robocode)
- [Engineer](https://robowiki.net/wiki/Engineer) - RoboWiki (classic Robocode)
- [Waves](https://robowiki.net/wiki/Waves) - RoboWiki (classic Robocode)
