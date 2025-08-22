# AI Prompting Guide

This website is built using [Docusaurus 3](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
npm install
```

## Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true npm run deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> npm run deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Project Structure

```
ai-prompting-guide/
├── blog/                    # Blog posts
│   ├── 2019-05-28-first-blog-post.md
│   ├── 2019-05-29-long-blog-post.md
│   ├── 2021-08-01-mdx-blog-post.mdx
│   ├── 2021-08-26-welcome/
│   │   └── index.md
│   └── authors.yml          # Blog authors
├── docs/                    # Documentation files
│   ├── intro.md
│   ├── tutorial-basics/     # Basic tutorials
│   │   ├── create-a-document.md
│   │   ├── create-a-page.md
│   │   ├── create-a-blog-post.md
│   │   ├── markdown-features.mdx
│   │   ├── deploy-your-site.md
│   │   └── congratulations.md
│   └── tutorial-extras/     # Advanced tutorials
│       ├── manage-docs-versions.md
│       └── translate-your-site.md
├── src/                     # Source files
│   ├── components/          # React components
│   │   └── HomepageFeatures/
│   ├── css/                 # Custom CSS
│   │   └── custom.css
│   └── pages/               # Custom pages
│       ├── index.js         # Homepage
│       └── markdown-page.md
├── static/                  # Static assets
│   └── img/                 # Images and icons
├── docusaurus.config.js     # Site configuration
├── package.json             # Node.js dependencies
└── sidebars.js             # Sidebar configuration
```

## Configuration

- **Site Configuration**: Edit `docusaurus.config.js` to customize your site settings, navbar, footer, and more
- **Sidebar**: Modify `sidebars.js` to organize your documentation structure
- **Styling**: Update `src/css/custom.css` to customize the site's appearance
- **Homepage**: Customize `src/pages/index.js` and `src/components/HomepageFeatures/` for your homepage

## Writing Content

### Documentation
- Add new docs in the `docs/` folder
- Use frontmatter to set sidebar position and labels
- Support for Markdown and MDX (React components in Markdown)

### Blog Posts
- Add blog posts in the `blog/` folder
- Use the format `YYYY-MM-DD-post-name.md` for file names
- Configure authors in `blog/authors.yml`

## Features

- ⚡️ **Fast**: Built with modern web technologies
- 📱 **Mobile-friendly**: Responsive design that works on all devices
- 🌙 **Dark mode**: Built-in dark/light theme switching
- 🔍 **Search**: Full-text search across all content
- 📊 **Analytics**: Easy integration with Google Analytics, etc.
- 🌐 **i18n**: Multi-language support
- 📖 **Versioning**: Support for multiple documentation versions
- 🎨 **Customizable**: Extensive theming and customization options

## Learn More

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Markdown Features](https://docusaurus.io/docs/markdown-features)
- [Deployment Guide](https://docusaurus.io/docs/deployment)