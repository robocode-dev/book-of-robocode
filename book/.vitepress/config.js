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

    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Core Guides',
        items: [
          { text: 'Introduction', link: '/introduction/what-is-robocode' },
          { text: 'Getting Started', link: '/getting-started/your-first-bot' },
          { text: 'Battlefield Physics', link: '/physics/coordinates-and-angles' }
        ]
      },
      {
        text: 'Combat Systems',
        items: [
          { text: 'Targeting Systems', link: '/targeting/' },
          { text: 'Movement & Evasion', link: '/movement/' },
          { text: 'Energy Management', link: '/energy-management' }
        ]
      },
      {
        text: 'Advanced Play',
        items: [
          { text: 'Team Strategies', link: '/team-strategies' },
          { text: 'Melee Combat', link: '/melee-combat' },
          { text: 'Advanced Topics', link: '/advanced-topics' }
        ]
      },
      { text: 'Tank Royale Differences', link: '/tank-royale' },
      {
        text: 'Reference',
        items: [
          { text: 'Appendices', link: '/appendices' }
        ]
      }
    ],
    sidebar: {
      '/introduction/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Robocode?', link: '/introduction/what-is-robocode' },
            { text: 'History', link: '/introduction/history' }
          ]
        }
      ],
      '/getting-started/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Your First Bot', link: '/getting-started/your-first-bot' },
            { text: 'Bot Anatomy and API', link: '/getting-started/bot-anatomy-and-bot-api' },
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
            { text: 'Wall Collisions', link: '/physics/wall-collisions' },
            { text: 'Gun Heat & Cooling', link: '/physics/gun-heat-cooling' }
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
                { text: 'Infinity Lock', link: '/radar/one-on-one-radar/infinity-lock' },
                {
                  text: 'Perfect Locks',
                  items: [
                    { text: 'Turn Multiplier', link: '/radar/one-on-one-radar/perfect-locks/turn-multiplier' },
                    { text: 'Width Lock', link: '/radar/one-on-one-radar/perfect-locks/width-lock' }
                  ]
                }
              ]
            },
            {
              text: 'Melee Radar',
              items: [
                { text: 'Melee Radar', link: '/radar/melee-radar/melee-radar' }
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
              { text: 'Head-On Targeting', link: '/targeting/head-on-targeting' },
              { text: 'Linear Targeting', link: '/targeting/linear-targeting' },
              { text: 'Circular Targeting', link: '/targeting/circular-targeting' },
              { text: 'Random Area Targeting', link: '/targeting/random-area-targeting' },
              { text: 'Virtual Guns Mean Targeting', link: '/targeting/virtual-guns-mean-targeting' }
            ]},
            { text: 'The Targeting Problem', items: [
              { text: 'Understanding the Challenge', link: '/targeting/understanding-the-challenge' },
              { text: 'Introducing Waves', link: '/targeting/introducing-waves' }
            ]},
            { text: 'Statistical Targeting', items: [
              { text: 'GuessFactor Targeting', link: '/targeting/guessfactor-targeting' },
              { text: 'Segmentation Visit Count Stats', link: '/targeting/segmentation-visit-count-stats' },
              { text: 'Dynamic Clustering', link: '/targeting/dynamic-clustering' },
              { text: 'Advanced Statistical Methods', link: '/targeting/advanced-statistical-methods' }
            ]},
            { text: 'Predictive Targeting', items: [
              { text: 'Precise Prediction', link: '/targeting/precise-prediction' },
              { text: 'Pattern Matching', link: '/targeting/pattern-matching' },
              { text: 'Play It Forward Sequential Prediction', link: '/targeting/play-it-forward-sequential-prediction' }
            ]},
            { text: 'Advanced Targeting', items: [
              { text: 'Angular Targeting', link: '/targeting/angular-targeting' },
              { text: 'Anti-Surfer Targeting', link: '/targeting/anti-surfer-targeting' },
              { text: 'Neural Experimental Targeting', link: '/targeting/neural-experimental-targeting' }
            ]},
            { text: 'Targeting Tactics', items: [
              { text: 'Fire Power Timing Decisions', link: '/targeting/fire-power-timing-decisions' },
              { text: 'Saving Gun Data', link: '/targeting/saving-gun-data' }
            ]}
          ]
        }
      ],
      '/movement/': [
        {
          text: 'Movement & Evasion',
          items: [
            { text: 'Basic Movement', items: [
              { text: 'Movement Fundamentals Goto', link: '/movement/movement-fundamentals-goto' },
              { text: 'Wall Avoidance Wall Smoothing', link: '/movement/wall-avoidance-wall-smoothing' },
              { text: 'Distancing', link: '/movement/distancing' }
            ]},
            { text: 'Simple Evasion', items: [
              { text: 'Random Movement', link: '/movement/random-movement' },
              { text: 'Stop and Go', link: '/movement/stop-and-go' },
              { text: 'Oscillator Movement', link: '/movement/oscillator-movement' }
            ]},
            { text: 'Strategic Movement', items: [
              { text: 'Anti-Gravity Movement', link: '/movement/anti-gravity-movement' },
              { text: 'Minimum Risk Movement', link: '/movement/minimum-risk-movement' },
              { text: 'Corner Movement', link: '/movement/corner-movement' }
            ]},
            { text: 'Advanced Evasion', items: [
              { text: 'Gun Heat Waves Bullet Shadows', link: '/movement/gun-heat-waves-bullet-shadows' },
              { text: 'Dodging Bullets', link: '/movement/dodging-bullets' },
              { text: 'Wave Surfing Introduction', link: '/movement/wave-surfing-introduction' },
              { text: 'Wave Surfing Implementations', link: '/movement/wave-surfing-implementations' },
              { text: 'Flattener', link: '/movement/flattener' }
            ]},
            { text: 'Offensive Movement', items: [
              { text: 'Pattern Enemy Dodging Movement', link: '/movement/pattern-enemy-dodging-movement' },
              { text: 'Ramming Mirror Movement', link: '/movement/ramming-mirror-movement' },
              { text: 'Movement Analysis', link: '/movement/movement-analysis' }
            ]}
          ]
        }
      ],
      '/energy-and-scoring/': [
        {
          text: 'Energy Management',
          items: [
            { text: 'Energy Resource', link: '/energy-and-scoring/energy-resource' },
            { text: 'Bullet Power Selection', link: '/energy-and-scoring/bullet-power-selection' },
            { text: 'Energy Management 1v1', link: '/energy-and-scoring/energy-management-1v1' },
            { text: 'Energy Management Melee', link: '/energy-and-scoring/energy-management-melee' }
          ]
        }
      ],
      '/team-strategies/': [
        {
          text: 'Team Strategies',
          items: [
            { text: 'Team Basics', link: '/team-strategies/team-basics' },
            { text: 'Twin Duel Strategy', link: '/team-strategies/twin-duel-strategy' },
            { text: 'Communication Coordination', link: '/team-strategies/communication-coordination' },
            { text: 'Team Roles Formations', link: '/team-strategies/team-roles-formations' }
          ]
        }
      ],
      '/melee-combat/': [
        {
          text: 'Melee Combat',
          items: [
            { text: 'Melee Strategy', link: '/melee-combat/melee-strategy' },
            { text: 'Melee Targeting', link: '/melee-combat/melee-targeting' },
            { text: 'Melee Movement', link: '/melee-combat/melee-movement' },
            { text: 'Melee Survival', link: '/melee-combat/melee-survival' }
          ]
        }
      ],
      '/advanced/': [
        {
          text: 'Advanced Topics',
          items: [
            { text: 'Multiple Choice Bestpspace', link: '/advanced/multiple-choice-bestpspace' },
            { text: 'Targeting Matrix', link: '/advanced/targeting-matrix' },
            { text: 'Testing Analysis Tools', link: '/advanced/testing-analysis-tools' },
            { text: 'Optimization Techniques', link: '/advanced/optimization-techniques' }
          ]
        }
      ],
      '/tank-royale/': [
        {
          text: 'Robocode Tank Royale Differences',
          items: [
            { text: 'API Changes', link: '/tank-royale/api-changes' },
            { text: 'Physics Differences', link: '/tank-royale/physics-differences' },
            { text: 'Migration Guide', link: '/tank-royale/migration-guide' }
          ]
        }
      ],
      '/appendices/': [
        {
          text: 'Appendices',
          items: [
            { text: 'Glossary', link: '/appendices/glossary' },
            { text: 'Quick Reference', link: '/appendices/quick-reference' },
            { text: 'Debugging Tips', link: '/appendices/debugging-tips' },
            { text: 'References Credits', link: '/appendices/references-credits' }
          ]
        }
      ]
    },
    editLink: {
      pattern: 'https://github.com/robocode-dev/robocoding/edit/main/book/:path',
      text: 'Help improve this page!'
    },
    lastUpdated: true,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/robocode-dev/robocode' }
    ],
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
