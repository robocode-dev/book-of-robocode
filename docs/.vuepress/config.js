import { defaultTheme } from '@vuepress/theme-default'
import { viteBundler } from '@vuepress/bundler-vite'
import { searchPlugin } from '@vuepress/plugin-search'

export default {
  title: 'The Book of Robocode',
  description: 'Documentation for Robocode & Robocode Tank Royale - Build the best, destroy the rest!',

  bundler: viteBundler(),

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.css' }]
  ],

  plugins: [
    searchPlugin({
      locales: {
        '/': {
          placeholder: 'Search'
        }
      }
    }),
    '@vuepress/plugin-nprogress'
  ],

  theme: defaultTheme({
    logo: '/robocode-logo.svg',

    navbar: [
      { text: 'Home', link: '/' },
      { text: 'Introduction', link: '/introduction/what-is-robocode' },
      { text: 'Getting Started', link: '/getting-started/your-first-bot' },
      { text: 'Battlefield Physics', link: '/physics' },
      { text: 'Targeting Systems', link: '/targeting/' },
      { text: 'Movement & Evasion', link: '/movement/' },
      { text: 'Energy Management', link: '/energy-management' },
      { text: 'Team Strategies', link: '/team-strategies' },
      { text: 'Melee Combat', link: '/melee-combat' },
      { text: 'Advanced Topics', link: '/advanced-topics' },
      { text: 'Tank Royale Differences', link: '/tank-royale' },
      { text: 'Appendices', link: '/appendices' }
    ],

    sidebar: {
      '/introduction/': [
        {
          text: 'Introduction',
          children: [
            'what-is-robocode',
            'history'
          ]
        }
      ],
      '/getting-started/': [
        {
          text: 'Getting Started',
          children: [
            'your-first-bot',
            'bot-anatomy-and-bot-api'
          ]
        }
      ],
      '/physics/': [
        {
          text: 'Battlefield Physics',
          children: [
            'coordinates-and-angles',
            'movement-constraints',
            'bullet-physics',
            'wall-collisions',
            'gun-heat-cooling'
          ]
        }
      ],
      '/radar/': [
        {
          text: 'Radar & Scanning',
          children: [
            'radar-basics',
            {
              text: 'One-on-One Radar',
              children: [
                'one-on-one-radar',
                'spinning-radar',
                'infinity-lock',
                {
                  text: 'Perfect Locks',
                  children: ['turn-multiplier', 'width-lock']
                }
              ]
            },
            {
              text: 'Melee Radar',
              children: [
                'melee-radar',
                'spinning-corner-arc',
                'oldest-scanned',
                'gun-heat-lock'
              ]
            }
          ]
        }
      ],
      '/targeting/': [
        {
          text: 'Targeting Systems',
          children: [
            {
              text: 'Simple Targeting',
              children: [
                'head-on-targeting',
                'linear-targeting',
                'circular-targeting',
                'random-area-targeting',
                'virtual-guns-mean-targeting'
              ]
            },
            {
              text: 'The Targeting Problem',
              children: [
                'understanding-the-challenge',
                'introducing-waves'
              ]
            },
            {
              text: 'Statistical Targeting',
              children: [
                'guessfactor-targeting',
                'segmentation-visit-count-stats',
                'dynamic-clustering',
                'advanced-statistical-methods'
              ]
            },
            {
              text: 'Predictive Targeting',
              children: [
                'precise-prediction',
                'pattern-matching',
                'play-it-forward-sequential-prediction'
              ]
            },
            {
              text: 'Advanced Targeting',
              children: [
                'angular-targeting',
                'anti-surfer-targeting',
                'neural-experimental-targeting'
              ]
            },
            {
              text: 'Targeting Tactics',
              children: [
                'fire-power-timing-decisions',
                'saving-gun-data'
              ]
            }
          ]
        }
      ],
      '/movement/': [
        {
          text: 'Movement & Evasion',
          children: [
            {
              text: 'Basic Movement',
              children: [
                'movement-fundamentals-goto',
                'wall-avoidance-wall-smoothing',
                'distancing'
              ]
            },
            {
              text: 'Simple Evasion',
              children: [
                'random-movement',
                'stop-and-go',
                'oscillator-movement'
              ]
            },
            {
              text: 'Strategic Movement',
              children: [
                'anti-gravity-movement',
                'minimum-risk-movement',
                'corner-movement'
              ]
            },
            {
              text: 'Advanced Evasion',
              children: [
                'gun-heat-waves-bullet-shadows',
                'dodging-bullets',
                'wave-surfing-introduction',
                'wave-surfing-implementations',
                'flattener'
              ]
            },
            {
              text: 'Offensive Movement',
              children: [
                'pattern-enemy-dodging-movement',
                'ramming-mirror-movement',
                'movement-analysis'
              ]
            }
          ]
        }
      ],
      '/energy-and-scoring/': [
        {
          text: 'Energy Management',
          children: [
            'energy-resource',
            'bullet-power-selection',
            'energy-management-1v1',
            'energy-management-melee'
          ]
        }
      ],
      '/team-strategies/': [
        {
          text: 'Team Strategies',
          children: [
            'team-basics',
            'twin-duel-strategy',
            'communication-coordination',
            'team-roles-formations'
          ]
        }
      ],
      '/melee-combat/': [
        {
          text: 'Melee Combat',
          children: [
            'melee-strategy',
            'melee-targeting',
            'melee-movement',
            'melee-survival'
          ]
        }
      ],
      '/advanced/': [
        {
          text: 'Advanced Topics',
          children: [
            'multiple-choice-bestpspace',
            'targeting-matrix',
            'testing-analysis-tools',
            'optimization-techniques'
          ]
        }
      ],
      '/tank-royale/': [
        {
          text: 'Robocode Tank Royale Differences',
          children: [
            'api-changes',
            'physics-differences',
            'migration-guide'
          ]
        }
      ],
      '/appendices/': [
        {
          text: 'Appendices',
          children: [
            'glossary',
            'quick-reference',
            'debugging-tips',
            'references-credits'
          ]
        }
      ]
    },
    repo: 'robocode-dev/robocoding',
    docsDir: 'docs',
    lastUpdated: true,
    editLink: true,
    editLinkText: 'Help improve this page!',
    smoothScroll: true
  }),

  markdown: {
    code: { lineNumbers: true }
  }
}
