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
            { text: 'Author\'s Foreword', link: '/introduction/foreword' },
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
            { text: 'Bot Anatomy', link: '/getting-started/bot-anatomy' },
            { text: 'The Bot API', link: '/getting-started/the-bot-api' },
            { text: 'Blocking vs Non-Blocking Movement (Setters)', link: '/getting-started/blocking-vs-non-blocking-movement-setters' },
            { text: 'Bot Anatomy and API (Moved)', link: '/getting-started/bot-anatomy-and-bot-api' },
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
            { text: 'Advanced Evasion', items: [
              { text: 'Gun Heat Waves & Bullet Shadows', link: '/movement/advanced-evasion/gun-heat-waves-bullet-shadows' },
              { text: 'Dodging Bullets', link: '/movement/advanced-evasion/dodging-bullets' },
              { text: 'Wave Surfing Introduction', link: '/movement/advanced-evasion/wave-surfing-introduction' },
              { text: 'Wave Surfing Implementations', link: '/movement/advanced-evasion/wave-surfing-implementations' },
              { text: 'Flattener', link: '/movement/advanced-evasion/flattener' }
            ]},
            { text: 'Offensive Movement', items: [
              { text: 'Pattern & Enemy Dodging Movement', link: '/movement/offensive/pattern-enemy-dodging-movement' },
              { text: 'Ramming & Mirror Movement', link: '/movement/offensive/ramming-mirror-movement' },
              { text: 'Movement Analysis', link: '/movement/offensive/movement-analysis' }
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
            { text: 'Competition Formats & Rankings', link: '/energy-and-scoring/competition-formats-rankings' },
            { text: 'Energy Management in 1v1 and Melee', link: '/energy-and-scoring/energy-management-1v1-melee' }
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
            { text: 'References & Credits', link: '/appendices/references-credits' }
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
