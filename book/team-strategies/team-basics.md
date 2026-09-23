---
title: "Team Basics"
category: "Team Strategies"
summary: >-
  Team battles add a second problem on top of targeting and movement: knowing who not to shoot, and how to pass
  what a bot sees to teammates that cannot see for themselves.
tags:
  - team-basics
  - team-strategies
  - intermediate
  - robocode
  - tank-royale
difficulty: "intermediate"
source:
  - "RoboWiki - Teams (classic Robocode) https://robowiki.net/wiki/Teams"
  - "Robocode Tank Royale Docs - Team Messages https://robocode.dev/articles/team-messages.html"
---

# Team Basics

> [!TIP] Origins
> **Team battles** in classic Robocode were developed and documented by the RoboWiki community around the
> `TeamRobot` class. Robocode Tank Royale ships the same idea as a core platform feature with its own message API.

Drop five copies of a strong duelist into a team battle and the first new bug shows up immediately: the same
targeting logic that never had to think twice in [1v1](/appendices/glossary#_1v1-one-on-one-duel) now puts a bullet
into a teammate. Team battles do not just
add more bots to the arena. They add a second problem that 1v1 and melee never asked: which of the bots on screen
are actually the enemy.

## Know who not to shoot

Both platforms give a bot a direct way to check that before firing. Classic Robocode's `TeamRobot` class adds
`isTeammate(name)`, and Tank Royale's `Bot` interface adds `isTeammate(id)`. Any targeting loop that scans nearby
bots needs this check before anything else, since a targeting system built for 1v1 has no built-in reason to skip
a bot standing right next to the one it wants to hit.

```txt
for scannedBot in allSeenBots:
    if isTeammate(scannedBot):
        continue
    considerAsTarget(scannedBot)
```

<!-- TODO: Illustration
**Filename:** team-basics-friendly-fire.svg
**Caption:** "A targeting loop skips a nearby teammate and locks onto the enemy instead."
**Viewport:** 8000x5000
**Battlefield:** true
**Bots:**
  - type: friendly, position: (1700, 2200), body: 60, turret: 60, radar: 60
  - type: friendly, position: (960, 1260), body: 200, turret: 200, radar: 200, scale: 0.6
  - type: friendly, position: (2960, 3560), body: 300, turret: 300, radar: 300, scale: 0.6
  - type: enemy, position: (5260, 960), body: 160, turret: 160, radar: 160, scale: 0.6
  - type: enemy, position: (5960, 2960), body: 250, turret: 250, radar: 250, scale: 0.6
  - type: enemy, position: (4360, 4060), body: 40, turret: 40, radar: 40, scale: 0.6
**Lines:**
  - from: (2000, 2500), to: (5030, 1374), color: "#10B981", arrow: true, dashed: false
**Circles:**
  - center: (1200, 1500), radius: 260, color: "#9CA3AF", fill: none, dashed: false
  - center: (5500, 1200), radius: 280, color: "#10B981", fill: none, dashed: false
**Texts:**
  - text: "teammate: skip", position: (1200, 1900), color: "#9CA3AF", anchor: middle
  - text: "valid target", position: (5700, 900), color: "#10B981"
**Description:** The teammate-skip circle is centered on the friendly bot at (960, 1260). It has a diagonal
slash through it (a "no" symbol) from (1015, 1315) to (1385, 1685), drawn independently of the structured
fields above.
-->

<img src="/images/team-basics-friendly-fire.svg"
alt="A targeting loop skips a nearby teammate and locks onto the enemy instead."
style="max-width:100%;height:auto;"/><br>
*A targeting loop skips a nearby teammate and locks onto the enemy instead.*

## The leader sees, the droids swing

Classic Robocode lets a team mix a special kind of bot into the roster: a **[Droid](/appendices/glossary#droid)**,
which trades its radar for
20 extra energy. A Droid cannot see the battlefield on its own, so it depends entirely on messages from a
teammate that can. Tank Royale carries the same trade-off forward with its own `Droid` interface: more energy, no
radar, total dependence on teammates for target data.

Classic Robocode adds one more incentive to organize the team around a single set of eyes: the first bot in the
team list becomes the **leader** and gets 100 bonus energy, 200 total, or 220 if that leader is also a Droid. A
team that puts real radar work into one leader and lets that leader's messages steer a pack of Droids is following
an incentive the game itself built in.

Both platforms move that information with a small messaging API. Classic Robocode's `broadcastMessage(message)`
reaches every teammate at once, using `getTeammates()` to see who is on the roster. Tank Royale's equivalent is
`broadcastTeamMessage(message)`, and it also offers `sendTeamMessage(teammateId, message)` for reaching one
teammate directly.

## Name the cost

RoboWiki is candid about what full coordination actually costs: assigning good spots to each bot, keeping
teammates out of each other's line of fire, avoiding collisions, and coordinating who fires at what all take real
design work. Its own observation is that many of the strongest-ranked teams skip most of that. Five instances of
a solid melee bot with basic team awareness, mostly just `isTeammate` checks, already beats most opponents without
any deeper coordination. Flocking and role assignment are real gains, but they are a second project layered on
top of a team that already avoids shooting itself.

## Platform notes

| | Classic Robocode | Tank Royale |
|---|---|---|
| Team-aware base | `TeamRobot` class | `Bot` interface (any bot can join a team) |
| Teammate check | `isTeammate(name)` | `isTeammate(id)` |
| Broadcast to all | `broadcastMessage(message)` | `broadcastTeamMessage(message)` |
| Message one teammate | `sendMessage(name, message)` | `sendTeamMessage(teammateId, message)` |
| Droid trade-off | no radar, +20 energy | no radar, more energy |
| Leader energy bonus | +100 energy (200 total, 220 for a Droid leader) | not documented |

Classic Robocode limits each message to 32,768 bytes after Java serialization. Tank Royale has per-turn limits as
well: 64 packets, up to 128 payloads when batches are counted, 49,152 UTF-8 bytes per packet, and 262,144 UTF-8 bytes
for the compact packet array. Convert bearings into one consistent angle convention before passing position data
between teammates, since classic Robocode headings are compass-style while Tank Royale headings are mathematical.

## Further Reading

- [Teams](https://robowiki.net/wiki/Teams) - RoboWiki (classic Robocode)
- [Team Messages](https://robocode.dev/articles/team-messages.html) - Tank Royale documentation
