// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'AI Prompting Guide',
  tagline: 'Master the art of effective AI prompting',
  favicon: 'img/favicon.ico',
  
  // Custom fields for i18n
  customFields: {
    titleZhTW: 'AI 提示詞寶典',
    taglineZhTW: '掌握 AI 提示詞的藝術，讓你成為 AI 溝通大師',
  },

  // Set the production url of your site here
  url: 'https://thc1006.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/ai-prompting-guide/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'thc1006', // Usually your GitHub org/user name.
  projectName: 'ai-prompting-guide', // Usually your repo name.
  
  // For GitHub Pages deployment
  trailingSlash: false,
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW', 'en'],
    localeConfigs: {
      'zh-TW': {
        label: '繁體中文',
        direction: 'ltr',
        htmlLang: 'zh-TW',
        calendar: 'gregory',
        path: 'zh-TW',
      },
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
        calendar: 'gregory',
        path: 'en',
      },
    },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/thc1006/ai-prompting-guide/tree/main/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/thc1006/ai-prompting-guide/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      
      // SEO improvements
      metadata: [
        {name: 'keywords', content: 'AI, artificial intelligence, prompting, prompt engineering, LLM, ChatGPT, machine learning, NLP, O-RAN, 5G, 6G'},
        {name: 'author', content: '蔡秀吉 (Hsiu-Chi Tsai)'},
        {name: 'description', content: 'Comprehensive guide to AI prompting techniques, best practices, and advanced strategies for effective interaction with language models'},
        {property: 'og:type', content: 'website'},
        {property: 'og:image', content: 'https://thc1006.github.io/ai-prompting-guide/img/social-card.png'},
        {name: 'twitter:card', content: 'summary_large_image'},
        {name: 'twitter:image', content: 'https://thc1006.github.io/ai-prompting-guide/img/social-card.png'},
        {name: 'robots', content: 'index, follow'},
        {name: 'googlebot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'},
      ],
      
      // Accessibility
      announcementBar: {
        id: 'support_us',
        content: '⭐ If you find this guide helpful, please star us on <a target="_blank" rel="noopener noreferrer" href="https://github.com/thc1006/ai-prompting-guide">GitHub</a>!',
        backgroundColor: '#fafbfc',
        textColor: '#091E42',
        isCloseable: true,
      },
      
      // Color mode for accessibility
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      
      navbar: {
        title: 'AI Prompting Guide',
        logo: {
          alt: 'AI Prompting Guide Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Tutorial',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/thc1006/ai-prompting-guide',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              },
              {
                label: 'Discord',
                href: 'https://discordapp.com/invite/docusaurus',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/docusaurus',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/thc1006/ai-prompting-guide',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} AI Prompting Guide. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['bash', 'json', 'yaml', 'python', 'javascript', 'typescript', 'jsx', 'tsx'],
      },
      
      // Algolia search configuration (can be enabled later)
      algolia: null, // Will be configured when Algolia DocSearch is set up
      
      // Table of contents
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },
    }),
    
  // Plugins for enhanced functionality
  plugins: [
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/logo.svg',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#25c2a0',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#25c2a0',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: '/img/logo.svg',
          },
          {
            tagName: 'link',
            rel: 'mask-icon',
            href: '/img/logo.svg',
            color: '#25c2a0',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileImage',
            content: '/img/logo.svg',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#25c2a0',
          },
        ],
      },
    ],
  ],
};

export default config;