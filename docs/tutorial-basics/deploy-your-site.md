---
sidebar_position: 5
---

# Deploy your site

Docusaurus is a **static-site-generator** (also called **[Jamstack](https://jamstack.org/)**).

It builds your site as simple **static HTML, JavaScript and CSS files**.

## Build your site

Build your site **for production**:

```bash
npm run build
```

The static files are generated in the `build` folder.

## Deploy your site

Test your production build locally:

```bash
npm run serve
```

The `build` folder is now served at [http://localhost:3000/](http://localhost:3000/).

You can now deploy the `build` folder **almost anywhere** easily, **for free** or very small cost (read the **[Deployment Guide](https://docusaurus.io/docs/deployment)**).

## Popular deployment options

- **[GitHub Pages](https://pages.github.com/)** - Free hosting for public repositories
- **[Netlify](https://www.netlify.com/)** - Automatic deployments from Git repositories
- **[Vercel](https://vercel.com/)** - Optimized for frontend frameworks
- **[AWS Amplify](https://aws.amazon.com/amplify/)** - Full-stack development platform
- **[Firebase Hosting](https://firebase.google.com/products/hosting)** - Fast and secure web hosting

## Continuous Deployment

Set up automatic deployments when you push to your Git repository:

### GitHub Pages with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    name: Deploy to GitHub Pages
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: npm

      - name: Install dependencies
        run: npm ci
      - name: Build website
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```