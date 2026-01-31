import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import katex from './katex-plugin'

export default withMermaid(defineConfig({
  title: 'The Book of Robocode',
  description: 'Documentation for Robocode & Robocode Tank Royale - Build the best, destroy the rest!',
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.16.25/dist/katex.min.css' }]
  ],

  markdown: {
    config(md) {
      md.use(katex);
    }
  },

  themeConfig: {
    appearance: 'dark',
    logo: '/robocode-logo.svg',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/robocode-dev/book-of-robocode', ariaLabel: 'Book of Robocode on GitHub' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
        },
        link: 'https://robocode.dev',
        ariaLabel: 'Robocode Tank Royale Documentation'
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>'
        },
        link: 'https://robowiki.net',
        ariaLabel: 'RoboWiki - Classic Robocode Community'
      }
    ],

    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Core Guides',
        items: [
          { text: 'Introduction', link: '/introduction/foreword' },
          { text: 'Getting Started', link: '/getting-started/your-first-bot' },
          { text: 'Battlefield Physics', link: '/physics/coordinates-and-angles' }
        ]
      },
      {
        text: 'Combat Systems',
        items: [
          { text: 'Radar & Scanning', link: '/radar/radar-basics' },
          { text: 'Targeting Systems', link: '/targeting/simple-targeting/head-on-targeting' },
          { text: 'Movement & Evasion', link: '/movement/basic/movement-fundamentals-goto' },
          { text: 'Energy & Scoring', link: '/energy-and-scoring/energy-as-a-resource' }
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'Glossary', link: '/appendices/glossary' },
          { text: 'Quick Reference (Formulas)', link: '/appendices/quick-reference' },
          { text: 'Wall of Fame', link: '/appendices/wall-of-fame' }
        ]
      }
    ],
    sidebar: {
      '/introduction/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Author\'s Foreword', link: '/introduction/foreword' },
            { text: 'What is Robocode?', link: '/introduction/what-is-robocode' },
            { text: 'History', link: '/introduction/history' },
            { text: 'What\'s Coming Next', link: '/introduction/whats-coming-next' }
          ]
        }
      ],
      '/getting-started/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Your First Bot', link: '/getting-started/your-first-bot' },
            { text: 'Bot Anatomy', link: '/getting-started/bot-anatomy' },
            { text: 'The Bot API', link: '/getting-started/the-bot-api' },
            { text: 'Blocking vs Non-Blocking Movement (Setters)', link: '/getting-started/blocking-vs-non-blocking-movement-setters' },
            { text: 'Robot Properties File', link: '/getting-started/robot-properties-file' },
            { text: 'Your First Battle', link: '/getting-started/your-first-battle' }
          ]
        }
      ],
      '/physics/': [
        {
          text: 'Battlefield Physics',
          items: [
            { text: 'Coordinates and Angles', link: '/physics/coordinates-and-angles' },
            { text: 'Movement Constraints', link: '/physics/movement-constraints' },
            { text: 'Bullet Physics', link: '/physics/bullet-physics' },
            { text: 'Gun Heat & Cooling', link: '/physics/gun-heat-and-cooling' },
            { text: 'Wall Collisions', link: '/physics/wall-collisions' },
            { text: 'Scoring Basics', link: '/physics/scoring-basics' }
          ]
        }
      ],
      '/radar/': [
        {
          text: 'Radar & Scanning',
          items: [
            { text: 'Radar Basics', link: '/radar/radar-basics' },
            {
              text: 'One-on-One Radar',
              items: [
                { text: 'Spinning Radar', link: '/radar/one-on-one-radar/spinning-radar' },
                { text: 'Perfect Locks', link: '/radar/one-on-one-radar/perfect-locks' }
              ]
            },
            {
              text: 'Melee Radar',
              items: [
                { text: 'Spinning & Corner Arc', link: '/radar/melee-radar/spinning-and-corner-arc' },
                { text: 'Oldest Scanned', link: '/radar/melee-radar/oldest-scanned' },
                { text: 'Gun Heat Lock', link: '/radar/melee-radar/gun-heat-lock' }
              ]
            }
          ]
        }
      ],
      '/targeting/': [
        {
          text: 'Targeting Systems',
          items: [
            { text: 'Simple Targeting', items: [
              { text: 'Head-On Targeting', link: '/targeting/simple-targeting/head-on-targeting' },
              { text: 'Linear Targeting', link: '/targeting/simple-targeting/linear-targeting' },
              { text: 'Circular Targeting', link: '/targeting/simple-targeting/circular-targeting' },
              { text: 'Random Area Targeting', link: '/targeting/simple-targeting/random-area-targeting' },
              { text: 'Virtual Guns & Mean Targeting', link: '/targeting/simple-targeting/virtual-guns-mean-targeting' }
            ]},
            { text: 'The Targeting Problem', items: [
              { text: 'Understanding the Challenge', link: '/targeting/the-targeting-problem/understanding-the-challenge' },
              { text: 'Introducing Waves', link: '/targeting/the-targeting-problem/introducing-waves' }
            ]},
            { text: 'Statistical Targeting', items: [
              { text: 'GuessFactor Targeting', link: '/targeting/statistical-targeting/guessfactor-targeting' },
              { text: 'Segmentation Visit Count Stats', link: '/targeting/statistical-targeting/segmentation-visit-count-stats' }
            ]},
            { text: 'Targeting Tactics', items: [
              { text: 'Fire Power & Timing Decisions', link: '/targeting/targeting-tactics/fire-power-timing-decisions' },
              { text: 'Saving Gun Data', link: '/targeting/targeting-tactics/saving-gun-data' }
            ]}
          ]
        }
      ],
      '/movement/': [
        {
          text: 'Movement & Evasion',
          items: [
            { text: 'Basic Movement', items: [
              { text: 'Movement Fundamentals & GoTo', link: '/movement/basic/movement-fundamentals-goto' },
              { text: 'Wall Avoidance & Wall Smoothing', link: '/movement/basic/wall-avoidance-wall-smoothing' },
              { text: 'Distancing', link: '/movement/basic/distancing' }
            ]},
            { text: 'Simple Evasion', items: [
              { text: 'Random Movement', link: '/movement/simple-evasion/random-movement' },
              { text: 'Stop and Go', link: '/movement/simple-evasion/stop-and-go' },
              { text: 'Oscillator Movement', link: '/movement/simple-evasion/oscillator-movement' }
            ]},
            { text: 'Strategic Movement', items: [
              { text: 'Anti-Gravity Movement', link: '/movement/strategic-movement/anti-gravity-movement' }
            ]},
            { text: 'Advanced Evasion', items: [
              { text: 'Gun Heat Waves & Bullet Shadows', link: '/movement/advanced-evasion/gun-heat-waves-bullet-shadows' },
              { text: 'Wave Surfing Introduction', link: '/movement/advanced-evasion/wave-surfing-introduction' }
            ]}
          ]
        }
      ],
      '/energy-and-scoring/': [
        {
          text: 'Energy & Scoring',
          items: [
            { text: 'Energy as a Resource', link: '/energy-and-scoring/energy-as-a-resource' },
            { text: 'Bullet Power Selection Strategy', link: '/energy-and-scoring/bullet-power-selection-strategy' },
            { text: 'Scoring Systems & Battle Types', link: '/energy-and-scoring/scoring-systems-battle-types' },
            { text: 'Competition Formats & Rankings', link: '/energy-and-scoring/competition-formats-rankings' }
          ]
        }
      ],
      '/appendices/': [
        {
          text: 'Appendices',
          items: [
            { text: 'Glossary', link: '/appendices/glossary' },
            { text: 'Quick Reference', link: '/appendices/quick-reference' },
            { text: 'Wall of Fame', link: '/appendices/wall-of-fame' }
          ]
        }
      ]
    },
    editLink: {
      pattern: 'https://github.com/robocode-dev/robocoding/edit/main/book/:path',
      text: 'Help improve this page!'
    },
    lastUpdated: true,
    footer: {
      message: 'Based on RoboWiki content (CC BY-SA 3.0) for classic Robocode and the official Robocode Tank Royale documentation.',
      copyright: 'Rewritten and structured for The Book of Robocode.'
    }
  },
  vite: {
    server: {
      fs: {
        allow: ['..']
      }
    }
  }
}))
