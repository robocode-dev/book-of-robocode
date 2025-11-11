# The Book of Robocoding

[![Deploy Documentation](https://github.com/robocode-dev/robocoding/actions/workflows/deploy.yml/badge.svg)](https://github.com/robocode-dev/robocoding/actions/workflows/deploy.yml)

**Build the best - destroy the rest!**

Comprehensive documentation for Robocode and Robocode Tank Royale - the programming game where you code robot battle tanks to compete autonomously.

🔗 **Live Site**: [robocode-dev.github.io/robocoding](https://robocode-dev.github.io/robocoding/)

## 📚 About

This documentation site provides:

- **Clear explanations** of Robocode concepts and gameplay
- **Physics & formulas** with KaTeX mathematical rendering
- **Step-by-step tutorials** for beginners
- **Advanced techniques** with pseudocode examples
- **Multi-language code examples** (Python, Java, C#, JavaScript)
- **Mobile-friendly** dark mode interface
- **Search functionality** to find what you need

## 🎯 What's Inside

### Articles
- **What is Robocode?** - Introduction to the programming game
- **Physics** - Game mechanics with mathematical formulas
- **Scoring** - How points are awarded in battles
- **Coordinates and Angles** - Understanding the arena coordinate system
- **History** - From the original Robocode to Tank Royale

### Tutorials
- **Getting Started** - Installation and setup for multiple languages
- **My First Bot** - Create your first working bot
- **Beyond the Basics** - Advanced strategies and techniques

## 🚀 Quick Start

### Prerequisites

- Node.js 14+ (for building the site)
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/robocode-dev/robocoding.git
   cd robocoding
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The site will be available at `http://localhost:8081/robocoding/`

4. **Build for production**
   ```bash
   npm run build
   ```
   
   Generated files will be in `docs/.vuepress/dist/`

## 🛠️ Technology Stack

- **[VuePress 1.x](https://v1.vuepress.vuejs.org/)** - Static site generator
- **[Vue 2](https://v2.vuejs.org/)** - Progressive JavaScript framework
- **[KaTeX](https://katex.org/)** - Fast math rendering
- **[markdown-it](https://markdown-it.github.io/)** - Markdown parser
- **GitHub Pages** - Hosting and deployment

## 📝 Project Structure

```
robocoding/
├── docs/
│   ├── .vuepress/
│   │   ├── config.js          # VuePress configuration
│   │   ├── styles/
│   │   │   ├── index.styl     # Custom styles (dark mode)
│   │   │   └── palette.styl   # Color palette
│   │   └── public/
│   │       ├── robocode-logo.svg
│   │       └── favicon.ico
│   ├── articles/              # Article pages
│   │   ├── what-is-robocode.md
│   │   ├── physics.md
│   │   ├── scoring.md
│   │   ├── coordinates-and-angles.md
│   │   └── history.md
│   ├── tutorial/              # Tutorial pages
│   │   ├── getting-started.md
│   │   ├── my-first-bot.md
│   │   └── beyond-basics.md
│   └── README.md              # Home page
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions deployment
├── package.json
├── LICENSE-CODE               # MIT License for code
├── LICENSE-DOCS               # CC BY-SA 4.0 for documentation
└── README.md                  # This file
```

## 🎨 Features

### Dark Mode UI
Clean, modern dark theme optimized for readability and reduced eye strain.

### Mathematical Formulas
KaTeX rendering for physics equations and game mechanics:

$$
v = a \times t
$$

### Code Examples
Multi-language code examples with syntax highlighting for Python, Java, C#, JavaScript, and more.

### Mobile-Friendly
Responsive design that works beautifully on phones, tablets, and desktops.

### Search
Built-in search functionality to quickly find articles and tutorials.

### Sidebar Navigation
Organized sidebar with collapsible sections for easy navigation.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Issues**: Found a bug or error? [Open an issue](https://github.com/robocode-dev/robocoding/issues)

2. **Suggest Improvements**: Have ideas for new content? Let us know!

3. **Submit Pull Requests**: 
   - Fork the repository
   - Create a feature branch (`git checkout -b feature/amazing-content`)
   - Commit your changes (`git commit -m 'Add amazing content'`)
   - Push to the branch (`git push origin feature/amazing-content`)
   - Open a Pull Request

### Writing Guidelines

- Keep articles **clear and concise**
- Use **headings** to organize content
- Include **code examples** where appropriate
- Add **formulas** using KaTeX syntax: `$inline$` or `$$display$$`
- Test locally before submitting

## 📜 License

This project uses dual licensing:

### Documentation Content
Licensed under **[Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/)**

You are free to:
- **Share** - copy and redistribute the material
- **Adapt** - remix, transform, and build upon the material

Under the terms:
- **Attribution** - Give appropriate credit
- **ShareAlike** - Distribute derivatives under the same license

### Code Examples
Licensed under **[MIT License](https://opensource.org/licenses/MIT)**

Free to use, modify, and distribute with attribution.

## 🙏 Credits and Acknowledgments

This documentation draws upon the collective knowledge of the Robocode community:

### Special Thanks
- **[RoboWiki](http://robowiki.net/)** contributors for extensive research and documentation
- **Mathew Nelson** - Original Robocode creator
- **Flemming Nørnberg Larsen** - Robocode Tank Royale creator and maintainer
- All **bot developers** and **tournament organizers** who have contributed to the community

### Reference Materials
The content in this book is based on and inspired by:
- Official Robocode documentation
- RoboWiki community research
- Tank Royale documentation
- Years of collective community knowledge

## 🔗 Related Projects

- **[Robocode Tank Royale](https://robocode-dev.github.io/tank-royale/)** - Modern multi-language version
- **[Classic Robocode](https://robocode.sourceforge.io/)** - Original Java version
- **[RoboWiki](http://robowiki.net/)** - Community research and strategies

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/robocode-dev/robocoding/issues)
- **Discussions**: Join the Robocode community forums
- **Documentation**: You're reading it!

## 🌟 Star History

If you find this documentation helpful, please consider giving it a star ⭐ on GitHub!

---

**Built with ❤️ by the Robocode community**

*Content licensed under CC BY-SA 4.0 | Code licensed under MIT | Built with VuePress*
