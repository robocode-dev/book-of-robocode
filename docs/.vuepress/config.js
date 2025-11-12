import { defaultTheme } from '@vuepress/theme-default'
import { viteBundler } from '@vuepress/bundler-vite'

export default {
  title: 'The Book of Robocoding',
  description: 'Documentation for Robocode & Robocode Tank Royale - Build the best, destroy the rest!',
  base: '/robocoding/',

  bundler: viteBundler(),

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.css' }]
  ],

  plugins: [
    [
      '@vuepress/plugin-search',
      {
        locales: {
          '/': {
            placeholder: 'Search'
          }
        }
      }
    ],
    '@vuepress/plugin-nprogress'
  ],

  theme: defaultTheme({
    logo: '/robocode-logo.svg',

    navbar: [
      { text: 'Home', link: '/' },
      { text: 'Articles', link: '/articles/' },
      { text: 'Tutorial', link: '/tutorial/' },
      { text: 'GitHub', link: 'https://github.com/robocode-dev/robocoding' }
    ],

    sidebar: {
      '/articles/': [
        '',
        'what-is-robocode',
        'physics',
        'scoring',
        'coordinates-and-angles',
        'history'
      ],
      '/tutorial/': [
        '',
        'getting-started',
        'my-first-bot',
        'beyond-basics'
      ],
      '/': [
        '',
        {
          text: 'Articles',
          collapsible: false,
          children: [
            '/articles/what-is-robocode',
            '/articles/physics',
            '/articles/scoring',
            '/articles/coordinates-and-angles',
            '/articles/history'
          ]
        },
        {
          text: 'Tutorial',
          collapsible: false,
          children: [
            '/tutorial/getting-started',
            '/tutorial/my-first-bot',
            '/tutorial/beyond-basics'
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
