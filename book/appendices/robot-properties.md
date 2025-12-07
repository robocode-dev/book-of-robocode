---
title: "Robot Properties File (Classic Robocode)"
category: "Getting Started"
summary: "Learn what a robot properties file is, what it contains, and how to name it correctly for classic Robocode bots."
tags: [ "classic robocode", "bot properties", "configuration", "beginner" ]
difficulty: "beginner"
source: [
  "Classic Robocode Sample Bots"
]
---

# Robot Properties File (Classic Robocode)

In classic Robocode, every bot needs a properties file to define its metadata and configuration. This file tells
Robocode important details about your bot, such as its name, author, description, and more. The properties file is a
simple text file with key-value pairs.

## What is a robot properties file?

A robot properties file is a plain text file (with the `.properties` extension) that describes your bot for the Robocode
engine. It includes information like the bot's name, author, description, and technical details. Robocode uses this file
to display information in the bot selection menu and to load your bot correctly.

<!-- TODO illustration: Show the relationship between a bot and its properties file. -->
<!-- - Draw a bot on the left and a document icon labeled .properties on the right. -->
<!-- - Connect them with an arrow labeled "Metadata and settings". -->
<!-- - Include small icons on the document for name, author, and description fields. -->
<!-- - Show the document plugged into a simple "Robocode" box representing the engine. -->
<!-- - Keep the shapes large and simple so labels are easy to read. -->

## Example: My First Robot properties file

Here is an example properties file for the classic "MyFirstRobot":

```
#Robot Properties
robot.description=A sample bot\nMoves in a seesaw motion, and spins the gun around at each end\nTurns perpendicular to the direction of a bullet that hits it
robot.webpage=https://robowiki.net/w/index.php?title=Robocode/My_First_Robot
robocode.version=1.0
robot.java.source.included=true
robot.author.name=Mathew Nelson
robot.classname=sample.MyFirstRobot
robot.name=MyFirstRobot
```

<!-- TODO illustration: Visualize the example properties file as a filled-in form. -->
<!-- - Draw a page with labeled lines for robot.name, robot.classname, and robot.author.name. -->
<!-- - Fill the lines with simplified versions of the MyFirstRobot example values. -->
<!-- - Highlight the robot.description line with a small note "can use \n for new lines". -->
<!-- - Add a small icon of the MyFirstRobot bot next to the form. -->
<!-- - Use a clean, notebook-like style that feels familiar to students. -->

## Naming convention: Match the class name

The filename of your properties file (excluding the `.properties` extension) **must match the class name of your bot**.
For example, if your bot class is `MyFirstRobot`, the properties file should be named `MyFirstRobot.properties`. This is
required for Robocode to recognize and load your bot correctly.

<!-- TODO illustration: Clarify the filename and class name matching rule. -->
<!-- - Show two side-by-side labels: Class name: MyFirstRobot and File: MyFirstRobot.properties. -->
<!-- - Draw a bold checkmark connecting the matching pair. -->
<!-- - Below, show a crossed-out example where the filename does not match the class name. -->
<!-- - Add a small warning icon with text "Must match exactly, including capitals". -->
<!-- - Use clear typography so students can see the difference at a glance. -->

## What does a properties file contain?

Typical fields include:

- `robot.name`: The name of your bot (must match the class name)
- `robot.classname`: The full Java class name (including package)
- `robot.author.name`: Your name as the bot author
- `robot.description`: A short description of what your bot does
- `robot.webpage`: (Optional) A link to your bot's webpage
- `robocode.version`: The Robocode version your bot was built for
- `robot.java.source.included`: Whether the Java source code is included

Other fields may be present for advanced bots, but these are the most common for beginners.

Note that the `robot.description` can be multi-line by using `\n` to indicate line breaks, and contain up to 3 lines.

## Where to find examples

You can find many example properties files in the `robots` folder of classic Robocode. Each sample bot comes with its
own properties file, which you can use as a reference when creating your own.

---

**Tip:** Always double-check that your properties filename matches your bot's class name exactly (including
capitalization). This avoids loading errors in Robocode.
