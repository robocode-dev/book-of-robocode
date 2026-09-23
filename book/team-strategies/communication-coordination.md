---
title: "Communication & Coordination"
category: "Team Strategies"
summary: >-
  Sending a message is easy. Designing what a team sends, how often, and what a teammate does the moment it
  arrives is the part that turns two bots that merely avoid shooting each other into an actual team.
tags:
  - communication-coordination
  - team-strategies
  - advanced
  - robocode
  - tank-royale
difficulty: "advanced"
source:
  - "RoboWiki - Teams (classic Robocode) https://robowiki.net/wiki/Teams"
  - "Robocode Tank Royale Docs - Team Messages https://robocode.dev/articles/team-messages.html"
  - "Robocode Tank Royale Docs - Team Strategies https://robocode.dev/articles/team-strategies.html"
---

# Communication & Coordination

> [!TIP] Origins
> **Team messaging** in classic Robocode grew out of the RoboWiki community's `TeamRobot` examples and
> discussion. Robocode Tank Royale, created by **Flemming Nørnberg Larsen (fnl)**, ships a structured message API
> with its own per-turn and per-message limits.

[Team Basics](/team-strategies/team-basics) teaches a bot not to shoot a teammate. That stops the obvious
disaster, but two bots that merely avoid each other's bullets are still just two duelists who happen to share a
battlefield. Coordination needs an actual design: what to send, how often to send it, and what a teammate does the
moment it arrives.

## A budget before a protocol

Classic Robocode's `TeamRobot` has two ways to send a `Serializable` message: `broadcastMessage(message)` reaches
every teammate, and `sendMessage(name, message)` addresses one teammate by name. Tank Royale offers the same two
choices with `broadcastTeamMessage(message)` and `sendTeamMessage(teammateId, message)`.

Classic Robocode caps each message at 32,768 bytes after Java serialization. Tank Royale limits each bot to 64 packets
per turn, with at most 128 logical payloads across ordinary packets and batches. Each packet may use 49,152 UTF-8
bytes, and the compact packet array may use 262,144 UTF-8 bytes. A batch keeps ordered entries in one packet and one
event, which helps when several updates must arrive together.

## Give every message a shape

A message that is just a raw number or a bare string works fine until two bots disagree about what it means.
Tank Royale's own documentation settles on a plain type-tagged format that keeps that disagreement from
happening:

- `ENEMY|Tracker|x:250,y:300,h:45,e:80,t:150` for a spotted enemy's position, heading, energy, and scan time
- `TARGET|Tracker|MyBot` for which enemy a bot has claimed
- `STATUS|MyBot|x:100,y:100,e:100` for a routine check-in
- `HELP|MyBot|x:100,y:100,e:20` for a bot in real trouble

Every teammate reads the type tag first and only parses the fields that type promises, so adding a new message
type later never breaks an older one. Sending this shape on every tick still burns through the 10-message budget
in three turns, so the discipline is to send on a real change, a newly scanned enemy, a claimed target, a status
swing, not on a clock.

## Claim a target instead of guessing

Left alone, two bots on a team both default to the same instinct: shoot whatever is closest.
[Twin Duel Strategy Guide](/team-strategies/twin-duel-strategy-guide) already shows the cost of that instinct when
both bots pick the same enemy and leave the other untouched. A `TARGET` message fixes it before a shot is even
fired:

```txt
for enemy in scannedEnemies:
    if not claimedByTeammate(enemy):
        myTarget = enemy
        broadcast("TARGET|" + myName + "|" + myTarget)
        break
```

Each bot checks incoming claims before picking its own, so the team spreads its fire across the enemies present
instead of stacking two guns on one and leaving another free to aim back unopposed.

<!-- TODO: Illustration
**Filename:** team-message-target-claim.svg
**Caption:** "A friendly bot claims a target by message, so its teammate holds fire instead of doubling up."
**Viewport:** 8000x6000
**Battlefield:** true
**Bots:**
  - type: friendly, position: (3200, 3200), body: 300, turret: 320, radar: 320
  - type: friendly, position: (1200, 4600), body: 40, turret: 20, radar: 20
  - type: enemy, position: (5800, 1400), body: 200, turret: 220, radar: 220, scale: 0.6
**Lines:**
  - from: (3742, 3323), to: (5677, 1906), color: "#10B981", arrow: true, dashed: false, label: "claims the target"
  - from: (3254, 3672), to: (1910, 4614), color: "#60A5FA", arrow: true, dashed: true, label: "TARGET: EnemyA"
**Circles:**
  - center: (6040, 1640), radius: 280, color: "#10B981", fill: none, dashed: false
**Texts:**
  - text: "claims the target", position: (4600, 2400), color: "#10B981"
  - text: "TARGET: EnemyA", position: (2100, 3950), color: "#60A5FA", anchor: middle
  - text: "already claimed, hold fire", position: (900, 5400), color: "#9CA3AF"
-->

<img src="/images/team-message-target-claim.svg"
alt="A friendly bot claims a target by message, so its teammate holds fire instead of doubling up."
style="max-width:100%;height:auto;"/><br>
*A friendly bot claims a target by message, so its teammate holds fire instead of doubling up.*

## Ask for help before the fight is already lost

A `HELP` message earns its keep exactly once: the moment a bot's energy crosses into real danger. The Tank Royale
example fires it at energy 20, reporting position and energy in the same breath so a teammate can decide whether
to peel off and cover, or let a low-energy bot's ramming sacrifice do the job instead. Firing it earlier just
spends the message budget on noise, and firing it too late spends it on an obituary.

## Platform notes

> [!WARNING] Platform Difference
> Both platforms support broadcast and directed messages. Classic Robocode limits each Java-serialized message to
> 32,768 bytes. Tank Royale also limits per-turn traffic to 64 packets and 128 logical payloads, plus 49,152 UTF-8
> bytes per packet and 262,144 UTF-8 bytes for the compact packet array. A failed Tank Royale intent is rejected in
> full, and accepted messages arrive on the next turn.

## Further Reading

- [Teams](https://robowiki.net/wiki/Teams) - RoboWiki (classic Robocode)
- [Team Messages](https://robocode.dev/articles/team-messages.html) - Tank Royale documentation
- [Team Strategies](https://robocode.dev/articles/team-strategies.html) - Tank Royale documentation
