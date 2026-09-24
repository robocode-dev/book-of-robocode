# TODO: Team Messages Across All Bot APIs

Working notes for a future book update on Tank Royale team messages in Java, C#, Python, and TypeScript.
Not a book page. Do not publish until the change below is final.

## Status

- Source of truth: branch `ch-047-team-message-limits` in `C:\Code\tank-royale`, change `CH-047`
  (`changes/CH-047-team-message-limits/`), article `web/docs/articles/team-messages.md`, and
  `bot-api/dotnet/TEAM_MESSAGES_GUIDE.md`.
- CH-047 is a **draft**. The stress acceptance gate is unresolved (one failed run out of eleven on 2026-09-24), so
  the limits below are a candidate, not a published policy.
- This file used to be a copy of the older .NET guide. Its "10 messages per turn" and "32,768 bytes" figures are the
  old Tank Royale limits and must not be used.

## Book fixes waiting on CH-047

- `book/team-strategies/communication-coordination.md` already states the new limits (lines 38 and 113) before
  CH-047 is published. Re-check them against the final numbers.
- The same page still says "the 10-message budget" (line 56). Rewrite it against the final per-turn limits.
- Add ordered batches (`sendTeamMessageBatch`) to the page. They are the main reason for CH-047.
- Show send and receive code for all four languages, based on the `MyFirstTeam` sample (`MyFirstLeader`,
  `MyFirstDroid`).
- Consider a short cross-link or platform note in `book/tank-royale/api-changes.md` and `migration-guide.md`.
- Delete this file once the book pages are updated.

## API summary

Names seen in the branch article. Verify the rest (for example Python `send_team_message`, and whether a broadcast
batch method exists) against the Bot API sources before writing.

| Language   | Broadcast                   | Batch to one teammate               | Receive           |
|------------|-----------------------------|-------------------------------------|-------------------|
| Java       | `broadcastTeamMessage`      | `sendTeamMessageBatch(id, list)`    | `onTeamMessage`   |
| C#         | `BroadcastTeamMessage`      | `SendTeamMessageBatch(id, array)`   | `OnTeamMessage`   |
| Python     | `broadcast_team_message`    | `send_team_message_batch(id, list)` | `on_team_message` |
| TypeScript | `broadcastTeamMessage`      | `sendTeamMessageBatch(id, array)`   | `onTeamMessage`   |

Directed single messages use `sendTeamMessage(teammateId, message)` in Java and TypeScript (`SendTeamMessage` in C#).
Teammate checks use `isTeammate` / `IsTeammate` / `is_teammate`.

## How each language finds the message type

The same feature adapts to four different type systems. This is the most interesting teaching angle.

- **Java:** message classes are matched by class name. The receiver checks with `instanceof`.
- **C#:** message classes (plain classes with public properties) are matched by type name. The receiver uses
  pattern matching, such as `if (evt.Message is Point target)`. `Color` properties serialize as hex strings.
- **Python:** each message class needs the `@team_message_type` decorator (usually on a `@dataclass`) to be
  registered for serialization. The receiver uses `isinstance`.
- **TypeScript:** no runtime classes. Messages are plain JSON strings: `JSON.stringify()` to send, `JSON.parse()` to
  receive, and a discriminated union with a `type` field (`type TeamMessage = Point | RobotColors`) to tell them
  apart. Colors travel as hex strings via `ColorUtil.toHex()` and `ColorUtil.fromHexColor()`.

In Java, C#, and Python, sender and receiver each define their own message classes with the same name and compatible
fields.

## Receiving: MyFirstDroid

```java
@Override
public void onTeamMessage(TeamMessageEvent e) {
    if (e.getMessage() instanceof Point target) {
        turnRight(bearingTo(target.x, target.y));
        fire(3);
    }
}
```

```csharp
public override void OnTeamMessage(TeamMessageEvent evt)
{
    if (evt.Message is Point target)
    {
        TurnRight(BearingTo(target.X, target.Y));
        Fire(3);
    }
}
```

```python
@team_message_type
@dataclass
class Point:
    x: float
    y: float

async def on_team_message(self, e: TeamMessageEvent) -> None:
    if isinstance(e.message, Point):
        await self.turn_right(self.bearing_to(e.message.x, e.message.y))
        await self.fire(3)
```

```typescript
interface Point { type: "Point"; x: number; y: number; }
type TeamMessage = Point | RobotColors;

override onTeamMessage(e: TeamMessageEvent) {
    const message = JSON.parse(e.message) as TeamMessage;
    if (message.type === "Point") {
        this.turnRight(this.bearingTo(message.x, message.y));
        this.fire(3);
    }
}
```

## Ordered batches (new in CH-047)

A batch carries several entries in one packet and one `TeamMessageEvent`. The event's message is a
`TeamMessageBatch`, and its entries keep their send order. Batching cuts per-message framing and callback work. It
does not compress the JSON. Every recipient must advertise batch version 1, or the server rejects the sender's intent.

```java
sendTeamMessageBatch(teammateId, List.of(new Point(250, 300), new Point(400, 180)));

@Override
public void onTeamMessage(TeamMessageEvent event) {
    if (event.getMessage() instanceof TeamMessageBatch batch) {
        for (Object message : batch.getMessages()) { /* in send order */ }
    }
}
```

The C#, Python, and TypeScript versions follow the same shape (`batch.Messages`, `event.message.messages`,
`event.message.messages`). See the code group in the Tank Royale article.

## Candidate limits (per bot, per turn)

| Limit                                                | Value                          |
|------------------------------------------------------|--------------------------------|
| Team-message packets, including batches              | 64                             |
| Logical payloads, counting every batch entry         | 128                            |
| One encoded packet                                   | 49,152 UTF-8 bytes (48 KiB)    |
| Compact `teamMessages` array                         | 262,144 UTF-8 bytes (256 KiB)  |
| Incoming WebSocket text frame (checked before parse) | 1 MiB                          |

- Each Bot API checks a call before enqueueing it and throws if a limit would be exceeded. Empty batches and null
  entries are rejected.
- The server rejects an invalid intent in full, so none of its messages are delivered.
- Accepted messages arrive on the next turn.
- Messages must serialize to JSON (no circular references).

Classic Robocode is different: `TeamRobot` sends one `Serializable` object with `broadcastMessage` or `sendMessage`,
limited to 32,768 bytes after Java serialization. A classic bot can put a collection in one message and iterate it
from one `MessageEvent`.

## Also fixed in CH-047

Private bot events were stored in a `HashSet` on the server and in the Java and .NET Bot APIs. That made team-message
order non-deterministic and dropped identical messages. CH-047 keeps them in ordered lists. Worth a sentence in the
book only if older bots relied on that behavior.
