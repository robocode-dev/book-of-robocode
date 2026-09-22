---
title: "Testing & Analysis Tools"
category: "Advanced Topics"
summary: >-
  One battle is not a verdict, it is one noisy sample. This page covers the tools that turn "did my change help"
  into a measurement instead of a guess, by running many battles automatically or replaying recorded ones.
tags:
  - testing-analysis-tools
  - advanced-topics
  - advanced
  - robocode
  - tank-royale
source:
  - "RoboWiki - RoboResearch (classic Robocode) https://robowiki.net/wiki/RoboResearch"
  - "RoboWiki - WaveSim (classic Robocode) https://robowiki.net/wiki/WaveSim"
  - "Robocode Tank Royale Docs - Testing & Debugging Guide https://robocode.dev/articles/testing-guide.html"
---

# Testing & Analysis Tools

> [!TIP] Origins
> **WaveSim** was created by **Patrick Cupka (Voidious)**, first released in March 2010, to replace full battle
> runs with replayed recorded data. **RoboResearch**, the classic batch challenge runner, was developed and
> documented by the RoboWiki community. Robocode Tank Royale, created by **Flemming Nørnberg Larsen (fnl)**,
> documents its own batch-testing convention in its Testing & Debugging Guide.

A single battle result answers almost nothing. It could be a real improvement, or it could be the same random
seed that happened to favor this run.
[Competition Formats & Rankings](/energy-and-scoring/competition-formats-rankings) covers how the community
turns many battles into a public ranking. This page covers the tools a bot author runs locally, before anything
reaches that ranking, to replace a guess with a measurement.

## Benchmark against a fixed roster, not vibes

A bot that beat one rival yesterday and lost to it today has not necessarily changed. Small rule changes, a
different starting position, a slightly different random seed, and the result shifts on its own, no code change
required. The fix both platforms converge on is the same: fight the same fixed set of opponents every time, many
rounds each, and let the numbers settle before reading anything into them.

RoboResearch batch-runs a bot against every reference bot in a challenge automatically, reporting the score after
each battle and splitting the work across multiple cores when the machine has them. Robocode Tank Royale
documents the same idea without a dedicated tool: a scripted loop that launches the server against a fixed
opponent roster and appends each result to a log. Both converge on the same practical rule, since "multiple
rounds reduce variance and provide statistically meaningful results": Tank Royale's own guide sets that at 35
rounds per matchup, and recommends a roster with real range, static targets, reference bots of varying strength,
and specialized opponents like rammers, pattern movers, and strong dodgers.

## Measure the right numbers

A batch run is only useful if it reports more than a final score. Win rate, average score per round, survival
rate, and bullet hit percentage each isolate a different question a single number blurs together: winning a lot
but by a thin margin looks nothing like losing occasionally but by a landslide, even when both average out
similarly. Capturing all four across dozens of rounds turns "it felt better" into a number that survives a
rematch.

## Replay one encounter through every candidate gun

WaveSim skips re-fighting the battle. A modified TripHammer bot records real wave data, velocity, wall distance,
acceleration, and firing angles, into files during actual battles. Later, a gun classifier replays that exact
recorded sequence and is scored against it, so two candidate guns face the identical data instead of two separate
noisy battles. The reported payoff is real: testing that took hours of full battles came down to minutes, with
one benchmark run reported for Diamond's classifier compressing 100 TCRM seasons into about 1,262 seconds,
finishing at an 11.8% hit rate.

<!-- TODO: Illustration
**Filename:** wavesim-classifier-comparison.svg
**Caption:** "WaveSim replays one recorded encounter through every gun classifier, so each is judged against the
same real outcome."
**Viewport:** 8000x6000
**Battlefield:** true
**Bots:**
  - type: friendly, position: (1500, 4700), body: 20, turret: 20, radar: 20
  - type: enemy, position: (5800, 1600), body: 200, turret: 200, radar: 200, scale: 0.6
**Lines:**
  - from: (1830, 4530), to: (5800, 1840), color: "#10B981", arrow: true, dashed: false,
    label: "actual recorded outcome"
  - from: (1830, 4530), to: (5100, 1350), color: "#60A5FA", arrow: false, dashed: true,
    label: "classifier A's guess"
  - from: (1830, 4530), to: (5550, 1980), color: "#F59E0B", arrow: false, dashed: true,
    label: "classifier B's guess"
**Texts:**
  - text: "actual recorded outcome", position: (3500, 2600), color: "#10B981"
  - text: "classifier A's guess", position: (2400, 1900), color: "#60A5FA"
  - text: "classifier B's guess", position: (3300, 3600), color: "#F59E0B"
-->

<img src="/images/wavesim-classifier-comparison.svg"
alt="WaveSim replays one recorded encounter through every gun classifier, so each is judged against the same
real outcome."
style="max-width:100%;height:auto;"/><br>
*WaveSim replays one recorded encounter through every gun classifier, so each is judged against the same real
outcome.*

## Name the cost

A replayed encounter only contains what was recorded. WaveSim scores a gun classifier in isolation, it cannot
catch a problem that only shows up from the full bot's movement, radar, and gun interacting together in a live
battle. It also has no Tank Royale counterpart to date, the platform's own testing guide relies on running full
battles in bulk rather than replaying pre-recorded wave data, trading WaveSim's raw speed for the simplicity of
never needing a separate recording step.

## Further Reading

- [RoboResearch](https://robowiki.net/wiki/RoboResearch) - RoboWiki (classic Robocode)
- [WaveSim](https://robowiki.net/wiki/WaveSim) - RoboWiki (classic Robocode)
- [Testing & Debugging Guide](https://robocode.dev/articles/testing-guide.html) - Tank Royale documentation
