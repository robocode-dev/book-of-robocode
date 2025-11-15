# Getting Started

This guide will help you set up Robocode and prepare to create your first bot.

## Choose Your Version

### Option 1: Robocode Tank Royale (Recommended for New Users)

**Best for**: Multi-language support, modern development, easier setup

**Supported Languages**:
- Java
- Python 3.10+
- C# (.NET)
- Kotlin
- Scala

:::: tip Note
JavaScript/TypeScript support is coming soon through a coming WebAssembly Bot API.
Scala and Kotlin are supported via the Java Bot API.
::::

#### Installation

1. **Install Java Runtime** (if not already installed)
   ```bash
   # Check if Java is installed
   java -version
   ```
   Download from [adoptium.net](https://adoptium.net/) if needed.

2. **Download Tank Royale**
   - Visit [Tank Royale Releases](https://github.com/robocode-dev/tank-royale/releases)
   - Download the latest GUI application for your OS
   - Extract and run the GUI

3. **Install Bot API for Your Language**

   **For Python**:
   ```bash
   pip install robocode-tankroyale
   ```

   **For Java**:
   Add Maven dependency:
   ```xml
   <dependency>
     <groupId>dev.robocode.tankroyale</groupId>
     <artifactId>robocode-tankroyale-bot-api</artifactId>
     <version>0.20.1</version>
   </dependency>
   ```

   **For C#**:
   ```bash
   dotnet add package Robocode.TankRoyale.BotApi
   ```

   **For JavaScript/TypeScript**:
   ```bash
   npm install robocode-tankroyale
   ```

### Option 2: Classic Robocode (Java Only)

**Best for**: Established community, existing tutorials, competitive scene

#### Installation

1. **Install Java JDK** (version 8 or higher)
   ```bash
   java -version
   javac -version
   ```

2. **Download Robocode**
   - Visit [robocode.sourceforge.io](https://robocode.sourceforge.io/)
   - Download the installer
   - Run the installer and follow instructions

3. **Launch Robocode**
   ```bash
   # On Windows
   robocode.bat

   # On Linux/Mac
   ./robocode.sh
   ```

## Development Environment Setup

### For Java Development

**IDE Options**:
- **IntelliJ IDEA** (recommended): [jetbrains.com/idea](https://www.jetbrains.com/idea/)
- **Eclipse**: [eclipse.org](https://www.eclipse.org/)
- **VS Code** with Java extensions

### For Python Development

**IDE Options**:
- **PyCharm**: [jetbrains.com/pycharm](https://www.jetbrains.com/pycharm/)
- **VS Code** with Python extension
- **Jupyter** for experimentation

### For C# Development

**IDE Options**:
- **Visual Studio**: [visualstudio.microsoft.com](https://visualstudio.microsoft.com/)
- **Rider**: [jetbrains.com/rider](https://www.jetbrains.com/rider/)

### For JavaScript/TypeScript

**IDE Options**:
- **VS Code**: [code.visualstudio.com](https://code.visualstudio.com/)
- **WebStorm**: [jetbrains.com/webstorm](https://www.jetbrains.com/webstorm/)

## Verify Installation

### Tank Royale

1. Launch the Tank Royale GUI
2. You should see the game window
3. Try running a sample battle with included bots

### Classic Robocode

1. Launch Robocode
2. Go to **Battle** → **New**
3. Select sample robots
4. Click **Start Battle**

If you can see robots fighting, you're ready to go!

## Project Structure

### Tank Royale Project Structure

```
my-bot/
├── bot.json           # Bot metadata
├── MyBot.py           # Your bot code (Python example)
└── README.md          # Documentation
```

### Classic Robocode Structure

```
robocode/
└── robots/
    └── mypackage/
        └── MyBot.java  # Your bot code
```

## Understanding the API

### Core Concepts

Every bot needs to:
1. **Extend/inherit** from a base bot class
2. **Implement the run() method** - main bot loop
3. **Handle events** - respond to scanned robots, bullet hits, etc.
4. **Issue commands** - move, turn, fire

### Basic Bot Lifecycle

```
Initialization
    ↓
Enter run() loop
    ↓
    ├─→ Scan for enemies
    ├─→ Calculate movement
    ├─→ Aim gun
    ├─→ Fire if ready
    └─→ Repeat each turn
```

## Next Steps

Now that you have Robocode installed, you're ready to create your first bot!

Continue to [My First Bot](/tutorial/my-first-bot) →

## Troubleshooting

### Common Issues

**Java not found**:
- Install Java JDK/JRE
- Set JAVA_HOME environment variable
- Add Java to PATH

**Port already in use** (Tank Royale):
- Another instance may be running
- Check for processes on port 7654
- Close and restart

**Bot not appearing** in list:
- Check bot.json configuration (Tank Royale)
- Verify package structure (Classic)
- Check for compilation errors

**Graphics issues**:
- Update graphics drivers
- Try different Java version
- Disable hardware acceleration if needed

## Resources

- **Tank Royale Documentation**: [robocode-dev.github.io/tank-royale](https://robocode-dev.github.io/tank-royale/)
- **Classic Robocode Wiki**: [robowiki.net](http://robowiki.net/)
- **Community Forums**: Join discussions and ask questions
- **GitHub Issues**: Report bugs and request features

---

*This tutorial incorporates setup guidance from both the Tank Royale documentation and the [RoboWiki](http://robowiki.net/) community.*
