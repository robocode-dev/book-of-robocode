---
title: "API Changes"
category: "Robocode Tank Royale Differences"
summary: "Map classic Robocode class names, methods, and events to their Robocode Tank Royale equivalents, so a
  ported bot compiles against the right API on the first try."
tags: ["api-changes", "tank-royale", "advanced", "robocode", "migration"]
difficulty: "advanced"
source:
  - "RoboWiki - Robocode/RobocodeAPI (classic Robocode) https://robowiki.net/wiki/Robocode/RobocodeAPI"
  - "Robocode Tank Royale Docs - Bot API https://robocode.dev/articles/bot-api.html"
  - "Robocode Tank Royale Docs - Tank Royale https://robocode.dev/articles/tank-royale.html"
---

# API Changes

> [!TIP] Origins
> **Classic Robocode's event-driven API** was designed by **Mathew A. Nelson (Mat Nelson)**. **Flemming Nørnberg
> Larsen (fnl)** kept the same event model for **Robocode Tank Royale** while renaming classes and methods to fit a
> multi-language, multi-language-client design.

A bot ported from classic Robocode almost always fails to compile in Tank Royale, and the errors point at names, not
logic. `Robot` is gone. `ScannedRobotEvent` is gone. The turn-by-turn loop, the events, and the physics survive the
move intact, as the [Physics Differences](./physics-differences.md) page shows. What changes is what to call things.

## One base class becomes one interface

Classic Robocode offers three base classes, each unlocking more control:

- `Robot`: basic movement, firing, and simple events.
- `AdvancedRobot`: adds non-blocking setter calls (`setAhead`, `setTurnGunRight`) and custom events.
- `TeamRobot`: adds team messaging on top of `AdvancedRobot`.

Tank Royale replaces all three with a single `Bot` interface that any bot can implement. There is no beginner tier to
graduate out of: setter calls, custom events, and team messaging are available from the first line of code. A bot
only needs `TeamRobot` in classic Robocode to send messages, but in Tank Royale, any bot on a team can send them.

## Renamed methods

Bearing, movement, and gun methods keep their shape but drop "Robot" from the vocabulary, and a few gain symmetry
they never had in classic Robocode:

| Classic Robocode        | Tank Royale             | Note                                             |
|--------------------------|--------------------------|---------------------------------------------------|
| `ahead(distance)`        | `forward(distance)`      | `ahead()` still exists in Tank Royale as an alias |
| `back(distance)`         | `back(distance)`         | unchanged                                         |
| `turnGunRight(degrees)`  | `turnGunRight(degrees)`  | unchanged                                         |
| `setAhead(distance)`     | `setForward(distance)`   | non-blocking form                                 |
| `setTurnGunRight(deg)`   | `setTurnGunRight(deg)`   | unchanged                                         |
| `fire(power)`            | `fire(power)`            | unchanged                                         |
| `execute()`              | `go()`                   | commits the turn's setter calls                   |
| `isTeammate(name)`       | `isTeammate(id)`         | Tank Royale identifies teammates by numeric ID     |

The rename that trips up the most bots is `execute()` becoming `go()`. Both do the same job: apply every setter call
queued this turn and end it. See
[Blocking vs Non-Blocking Movement](../getting-started/blocking-vs-non-blocking-movement-setters.md) for what
happens if a bot forgets to call it.

## Renamed events

Event names drop "Robot" for "Bot", matching the class rename:

| Classic Robocode         | Tank Royale            |
|---------------------------|-------------------------|
| `ScannedRobotEvent`        | `ScannedBotEvent`        |
| `onScannedRobot(event)`    | `onScannedBot(event)`    |
| `HitRobotEvent`            | `HitBotEvent`            |
| `onHitRobot(event)`        | `onHitBot(event)`        |
| `RobotDeathEvent`          | `BotDeathEvent`          |
| `onRobotDeath(event)`      | `onBotDeath(event)`      |

Bullet, wall, and win events, such as `onBulletHit`, `onHitWall`, and `onWin`, keep the same names on both platforms.

## Graphical debugging moves out of an event

Classic Robocode paints debug graphics inside an overridden `onPaint(Graphics2D g)` method, calling `getGraphics()`
from within it to get the same canvas. Tank Royale drops the dedicated event: check `isDebuggingEnabled()` and call
`getGraphics()` directly, which returns an `IGraphics` canvas with its own drawing methods (`setStrokeColor`,
`fillRectangle`, and similar) instead of `Graphics2D`. See
[Debugging Tips](../appendices/debugging-tips.md) for how to put this to use.

## Team messaging renames

Classic `TeamRobot` sends a `Serializable` payload with `broadcastMessage(message)` for the whole team or
`sendMessage(name, message)` for one teammate. Tank Royale splits the same two operations into
`broadcastTeamMessage(message)` and `sendTeamMessage(teammateId, message)`, and the payload travels as JSON instead of
serialized Java. See [Team Communication & Coordination](../team-strategies/communication-coordination.md) for the
message-size limits on each platform.

## A utility class becomes built-in methods

Classic Robocode's angle math lives outside any bot, in the static `robocode.util.Utils` class. A gun that needs a
bearing to a point has to import it and call it by hand:

```java
// Classic Robocode
import static robocode.util.Utils.normalRelativeAngleDegrees;

double bearing = normalRelativeAngleDegrees(absoluteAngleTo(x, y) - getHeading());
```

Tank Royale drops the standalone class and puts the same math directly on `Bot`, aware of the bot's own position and
each of its three headings:

| Classic Robocode (`robocode.util.Utils`)  | Tank Royale (`Bot` methods)                          |
|---------------------------------------------|---------------------------------------------------------|
| `normalRelativeAngleDegrees(angle)`          | `normalizeRelativeAngle(angle)`                          |
| `normalAbsoluteAngleDegrees(angle)`          | `normalizeAbsoluteAngle(angle)`                          |
| not provided                                 | `directionTo(x, y)`, `bearingTo(x, y)`                   |
| not provided                                 | `gunBearingTo(x, y)`, `radarBearingTo(x, y)`              |
| not provided                                 | `distanceTo(x, y)`                                        |

`bearingTo(x, y)` folds a call to `directionTo` and a normalization into one step, and `gunBearingTo` /
`radarBearingTo` give the gun and radar the same shortcut aimed at their own heading. None of these are new physics,
they are the formulas from [Coordinate Systems & Angles](../physics/coordinates-and-angles.md) written once so every
bot stops reimplementing them by hand.

## What stayed the same

The event-driven shape of the API did not change. A bot still overrides `run()` for its main loop and overrides one
handler per event type it cares about. The minimal bot below fires at anything it scans, using only names verified
against the official sample bots:

::: code-group

```java [Classic Robocode · Java]
import robocode.Robot;
import robocode.ScannedRobotEvent;

public class MyBot extends Robot {
    public void run() {
        while (true) {
            ahead(100);
            turnGunRight(360);
        }
    }

    public void onScannedRobot(ScannedRobotEvent event) {
        fire(1);
    }
}
```

```python [Tank Royale · Python]
from robocode_tank_royale.bot_api import Bot
from robocode_tank_royale.bot_api.events import ScannedBotEvent


class MyBot(Bot):
    def run(self) -> None:
        while self.running:
            self.forward(100)
            self.turn_gun_right(360)

    def on_scanned_bot(self, event: ScannedBotEvent) -> None:
        self.fire(1)
```

```java [Tank Royale · Java]
import dev.robocode.tankroyale.botapi.Bot;
import dev.robocode.tankroyale.botapi.events.ScannedBotEvent;

public class MyBot extends Bot {
    public void run() {
        while (isRunning()) {
            forward(100);
            turnGunRight(360);
        }
    }

    public void onScannedBot(ScannedBotEvent event) {
        fire(1);
    }
}
```

```csharp [Tank Royale · C#]
using Robocode.TankRoyale.BotApi;
using Robocode.TankRoyale.BotApi.Events;

public class MyBot : Bot
{
    public override void Run()
    {
        while (IsRunning)
        {
            Forward(100);
            TurnGunRight(360);
        }
    }

    public override void OnScannedBot(ScannedBotEvent evt)
    {
        Fire(1);
    }
}
```

```typescript [Tank Royale · TypeScript]
import { Bot, ScannedBotEvent } from "@robocode.dev/tank-royale-bot-api";

class MyBot extends Bot {
    override run() {
        while (this.isRunning()) {
            this.forward(100);
            this.turnGunRight(360);
        }
    }

    override onScannedBot(event: ScannedBotEvent) {
        this.fire(1);
    }
}
```

:::

Notice the loop condition itself changed too. Classic Robocode's `run()` can loop `while (true)` forever, because the
engine stops a bot by killing its thread outright. Modern Java no longer allows forcibly killing a thread, and doing
so was always risky, since it can abandon a bot mid-update with inconsistent state. Tank Royale's engine instead sets
a flag when the round or battle ends, and every language's client exposes that flag as `isRunning()` (`self.running`
in Python), so the loop exits on its own instead of being cut off from outside.

Everything past the class and method names, the turn loop, the event dispatch, the physics behind `forward()` and
`fire()`, is the material the rest of this book already covers.

## Porting checklist

- Replace `Robot` / `AdvancedRobot` / `TeamRobot` with `Bot`.
- Rename every `XxxRobotEvent` and `onXxxRobot` handler to its `XxxBotEvent` / `onXxxBot` form.
- Replace `execute()` with `go()`.
- Convert headings and turn signs, see [Physics Differences](./physics-differences.md).
- Re-check hitbox math that assumed a square bot, see the same page.
- Re-check team message sizes against Tank Royale's per-turn packet limits.
- Drop hand-rolled `robocode.util.Utils` calls in favor of `Bot`'s built-in bearing and distance methods.
- Move `onPaint` graphics code to a `getGraphics()` call guarded by `isDebuggingEnabled()`.

None of this changes strategy. A wave surfing gun or a GuessFactor targeting scheme ports over unchanged once the
names and angles line up. The next page, Migration Guide, walks through porting one real bot end to end.

## Further Reading

- [Robocode/RobocodeAPI](https://robowiki.net/wiki/Robocode/RobocodeAPI) - RoboWiki (classic Robocode)
- [Bot API](https://robocode.dev/articles/bot-api.html) - Tank Royale documentation
- [Tank Royale](https://robocode.dev/articles/tank-royale.html) - Tank Royale documentation
- [Physics Differences](./physics-differences.md) - angle, turn-sign, and hitbox differences
- [Blocking vs Non-Blocking Movement (Setters)](../getting-started/blocking-vs-non-blocking-movement-setters.md)
