module.exports = {
  title: 'The Book of Robocoding',
  description: 'Documentation for Robocode & Robocode Tank Royale - Build the best, destroy the rest!',
  base: '/robocoding/',
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.11.1/katex.min.css' }]
  ],

  themeConfig: {
    logo: '/robocode-logo.svg',
    
    nav: [
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
          title: 'Articles',
          collapsable: false,
          children: [
            '/articles/what-is-robocode',
            '/articles/physics',
            '/articles/scoring',
            '/articles/coordinates-and-angles',
            '/articles/history'
          ]
        },
        {
          title: 'Tutorial',
          collapsable: false,
          children: [
            '/tutorial/getting-started',
            '/tutorial/my-first-bot',
            '/tutorial/beyond-basics'
          ]
        }
      ]
    },

    searchPlaceholder: 'Search...',
    lastUpdated: 'Last Updated',
    
    repo: 'robocode-dev/robocoding',
    repoLabel: 'GitHub',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: 'Help improve this page!',

    smoothScroll: true
  },

  markdown: {
    lineNumbers: true,
    extendMarkdown: md => {
      md.use(require('markdown-it-katex'))
    }
  },

  plugins: [
    '@vuepress/back-to-top',
    '@vuepress/medium-zoom',
    '@vuepress/nprogress',
    ['@vuepress/search', {
      searchMaxSuggestions: 10
    }]
  ]
}
