import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "OBJECTS Docs",
  description: "Documentation for OBJECTS Protocol",
  cleanUrls: true,
  appearance: 'dark',
  
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Learn', link: '/learn/' },
      { text: 'Developers', link: '/developers/' }
    ],
    search: {
      provider: 'local'
    },
    sidebar: {
      '/learn/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is OBJECTS?', link: '/learn/' },
            { text: 'Core Concepts', link: '/learn/core-concepts' }
          ]
        }
      ],
      '/developers/': [
        {
          text: 'Development Guide',
          items: [
            { text: 'Overview', link: '/developers/' },
            { text: 'API Reference', link: '/developers/api' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/OBJECTSHQ' },
      { icon: 'farcaster', link: 'https://warpcast.com/objects' },
      { icon: 'instagram', link: 'https://instagram.com/objects.ig' },
      { icon: 'x', link: 'https://x.com/objectsvision' },
    ],

    editLink: {
      pattern: 'https://github.com/YOUR_USERNAME/YOUR_REPO/edit/main/:path',
      text: 'Suggest changes to this page'
    }
  }
})
