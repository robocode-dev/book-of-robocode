---
title: "Robot Rules and Sandbox (Classic Robocode)"
category: "Getting Started"
summary: "Learn what a classic Robocode bot may and may not do, why a bot is rejected or stopped, and how to save data."
tags: [ "robot-rules-and-sandbox", "getting-started", "sandbox", "security", "intermediate", "classic-robocode" ]
difficulty: "intermediate"
source:
  - "Robocode source code (classic Robocode) https://github.com/robo-code/robocode"
  - "Robocode 1.12.0 release notes (classic Robocode) https://github.com/robo-code/robocode/releases/tag/v1.12.0"
  - "Robocode API AdvancedRobot https://robocode.sourceforge.io/docs/robocode/robocode/AdvancedRobot.html"
---

# Robot Rules and Sandbox (Classic Robocode)

> [!TIP] Origins
> The classic Robocode engine itself enforces these rules.

A bot can win every test battle and still never load, because one forgotten line mentions a class that Robocode does
not allow. Another bot runs well until the first time it opens a file in the wrong place, and then it dies on the spot.

This page covers classic Robocode only.

## Why the rules exist

Every bot in a classic battle runs as a thread inside the same Java Virtual Machine (JVM). Nothing separates a bot
from the engine or from the other bots except the rules on this page. A bot that could take unlimited memory, files,
or processing time would starve its opponents. A bot that could start programs or open network connections could harm
the machine that runs the battle.

The rules also keep the competition fair. In ranked play, such as RoboRumble and LiteRumble, bots from many authors
run on many computers, and the results only mean something if every bot plays under the same terms.

## Rejected before it starts

Since version 1.11.2, Robocode reads every class of a bot when it loads the bot. If any class mentions something that
is not allowed, the bot is rejected before a single line of its code runs. It does not matter whether that line would
ever execute. The check runs on all Java versions. On Java 24 and newer, where the Java `SecurityManager` no longer
exists, this check is the sandbox.

The rule is an allowlist. Anything that is not listed as allowed is denied.

| Allowed                                                          | Used for                          |
|------------------------------------------------------------------|-----------------------------------|
| `java.lang`, `java.util`, `java.math`, `java.text`, `java.time`  | Everyday code, collections, math  |
| `java.util.concurrent`, `java.util.stream`, `java.util.regex`    | Threads of your own, streams      |
| `java.io`, `java.nio`, `java.util.zip`                           | Files, under the rules below      |
| `java.awt` painting classes, such as `Color` and `Graphics2D`    | Painting on the battlefield       |
| The Kotlin standard library                                      | Bots written in Kotlin            |

Networking, starting processes, ending the Java program, changing system properties, class loaders, windows, and
`setAccessible` are all denied. Looking up members with reflection is allowed, but calls made through reflection are
checked against the same rules.

## Files

A bot reads files from its own directory, the one holding its class files or its jar. It writes only to its data
directory, a folder named after the bot with the extension `.data`. A bot cannot read the data directory of another bot.

`getDataFile()` of `AdvancedRobot` returns a file inside the data directory. Write it with `RobocodeFileWriter` or
`RobocodeFileOutputStream`:

```java
File file = getDataFile("enemies.dat");

try (RobocodeFileWriter writer = new RobocodeFileWriter(file)) {
    writer.write("some data");
} catch (IOException e) {
    out.println(e);
}
```

Four limits apply to this:

- **Location.** A file name that leaves the data directory, such as one containing `..`, is refused.
- **Quota.** All files of a bot together may hold 200000 bytes (about 195 KB) by default.
- **Streams.** At most 5 streams may be open at the same time, so call `close()` when a stream is done. Since
  version 1.12.0, streams still open when the battle ends are closed, with a warning in the console.
- **Writing.** `FileWriter` and `FileOutputStream` are refused when the bot runs. A bot must use the two Robocode
  classes.

## Threads and time

A bot may start threads of its own. They end when the round ends. On Java 23 and older, Robocode refuses more than 5
threads per bot.

Every bot gets a fixed amount of processing time per turn. Robocode measures it when it starts and prints the
result as "Each robot will be allowed a maximum of N nanoseconds per turn on this system". A bot that is too slow
skips turns and receives a `SkippedTurnEvent` for each one. A bot that skips more than 30 turns in a row is stopped
and gets no score.

## When a rule is broken

When a bot breaks a security rule while it runs, the engine throws a `SecurityException` in the bot's code and prints
the message in the bot's console, starting with `SYSTEM:`. The first violation drains the bot's energy to 0 and stops
the bot. A bot that is rejected at load never enters the battle, and Robocode reports an error for it in the
console.

Older bots often mention something forbidden in code that never runs, so Robocode accepts the common cases from the
classic rumble bots, such as `Logger`, `Scanner` on the bot's own file, and `Thread.stop()` on its own threads. Bots
that are still updated should follow the rules above anyway. Bots that still fail are collected in
[issue #127](https://github.com/robo-code/robocode/issues/127), and the console names the class or method that was
refused.

Saved data is only as good as the idea behind it. [Saving Gun Data](../targeting/targeting-tactics/saving-gun-data.md)
shows what is worth keeping between battles.

## Further Reading

- [Robocode source code](https://github.com/robo-code/robocode) - Robocode GitHub repository (classic Robocode)
- [Robocode 1.12.0 release notes](https://github.com/robo-code/robocode/releases/tag/v1.12.0) - (classic Robocode)
- [AdvancedRobot](https://robocode.sourceforge.io/docs/robocode/robocode/AdvancedRobot.html) - Robocode API (classic
  Robocode)
- [Robot Properties File](robot-properties-file.md) - another file every classic bot needs
