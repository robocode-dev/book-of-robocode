---
title: "Team Roles & Formations"
category: "Team Strategies"
summary: >-
  A wire to talk over is wasted if every bot on the roster does the same job with it. This page covers assigning
  roles to identical bot classes and using formations that make two bots fight as more than one gun each.
tags:
  - team-roles-formations
  - team-strategies
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Teams (classic Robocode) https://robowiki.net/wiki/Teams"
  - "Robocode Tank Royale Docs - Team Strategies https://robocode.dev/articles/team-strategies.html"
---

# Team Roles & Formations

> [!TIP] Origins
> **Team roles** in classic Robocode were worked out by the RoboWiki community through its `TeamRobot`
> documentation and example rosters. Robocode Tank Royale, created by **Flemming Nørnberg Larsen (fnl)**, names
> its roles and formations directly in its own Team Strategies documentation.

[Communication & Coordination](/team-strategies/communication-coordination) gives a team a wire to talk over.
That wire is wasted if every bot on the roster does the same job with it. RoboWiki names the harder problem
directly: assigning the good spots to the bots, since only one bot can stand in each spot, and a team of five
identical duelists collides, duplicates effort, and leaves gaps a coordinated team would have covered.

## Same class, different job

Robocode numbers every bot instance on a team, so five copies of one class can still tell each other apart and
take different jobs without five different source files. Tank Royale's own team documentation puts names on the
typical split: a Leader that carries wide radar coverage and low firepower to gather information, a Soldier that
carries the heavy gun and leans on the Leader's data, and a Droid that trades its radar for extra energy and
depends on a teammate for every target it ever sees, as [Team Basics](/team-strategies/team-basics) covers.

RoboWiki's own example rosters show the same split by proportion rather than name: one leader with radar plus
four droids that take orders from it, five bots of different classes each specialized for a job, or, at the plain
end, five identical bots with no specialization at all.

## One point of failure

Specialization has a cost, and RoboWiki states it without softening: a team built around a radar-carrying leader
and radar-less droids gets more total energy, but it suffers from a lack of information and gets in serious
trouble if the leader gets killed. Every droid on that roster stops seeing the battlefield the instant its one
set of eyes dies. A team of five identical, self-sufficient bots trades that peak efficiency for a roster that
can lose any single member and keep functioning.

## Formations that use two bots as one gun

A crossfire formation puts two bots at different angles on the same enemy, so a dodge that escapes one bot's line
of fire walks straight into the other's. A cover formation keeps one bot engaged while a second, healthier
teammate holds back to support the moment the first bot's energy drops. Corner trapping coordinates both bots to
push an enemy toward a corner, tightening the escape routes a corner already limits on its own, the same
constraint [Corner Movement](/movement/strategic-movement/corner-movement) covers from the other side of the gun.

<!-- TODO: Illustration
**Filename:** team-crossfire-formation.svg
**Caption:** "Two friendly bots hold different angles on one enemy, so no dodge escapes both guns at once."
**Viewport:** 8000x5500
**Battlefield:** true
**Bots:**
  - type: friendly, position: (1500, 3900), body: 320, turret: 320, radar: 320
  - type: friendly, position: (5900, 3900), body: 220, turret: 220, radar: 220
  - type: enemy, position: (3760, 960), body: 180, turret: 180, radar: 180, scale: 0.6
**Lines:**
  - from: (1989, 3942), to: (3734, 1563), color: "#10B981", arrow: true, dashed: false
  - from: (6011, 3942), to: (4266, 1563), color: "#10B981", arrow: true, dashed: false
**Texts:**
  - text: "no dodge angle escapes both guns", position: (4000, 2000), color: "#D2691E", anchor: middle
-->

<img src="/images/team-crossfire-formation.svg"
alt="Two friendly bots hold different angles on one enemy, so no dodge escapes both guns at once."
style="max-width:100%;height:auto;"/><br>
*Two friendly bots hold different angles on one enemy, so no dodge escapes both guns at once.*

## Build the roster before the roles

Tank Royale's own development order is worth following even in classic Robocode: get one bot fighting well
alone first, add the messaging from [Communication & Coordination](/team-strategies/communication-coordination)
second, add target-claim coordination third, and only then layer in formation and role logic. A crossfire
formation coded before either bot can reliably hit a target on its own just turns one bot's missed shots into
two bots' missed shots.

## Platform notes

> [!WARNING] Platform Difference
> Classic Robocode documents team composition by proportion, a leader plus droids, or a specialized five-bot
> roster, without naming formations. Robocode Tank Royale names both roles (Leader, Soldier, Droid) and
> formations (crossfire, cover, corner trapping) directly in its own documentation.

## Further Reading

- [Teams](https://robowiki.net/wiki/Teams) - RoboWiki (classic Robocode)
- [Team Strategies](https://robocode.dev/articles/team-strategies.html) - Tank Royale documentation
