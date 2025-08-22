---
sidebar_position: 5
---

# 部署你的網站

Docusaurus 是一個**靜態網站產生器**（也被稱為 **[Jamstack](https://jamstack.org/)**）。

它會將你的網站建置成簡單的**靜態 HTML、JavaScript 和 CSS 檔案**。

## 建置你的網站

建置網站以**上線為目標**：

```bash
npm run build
```

靜態檔案會產生在 `build` 資料夾中。

## 部署你的網站

在本機測試你的正式版本：

```bash
npm run serve
```

現在 `build` 資料夾會在 [http://localhost:3000/](http://localhost:3000/) 提供服務。

你可以輕鬆地將 `build` 資料夾部署到**任何地方**，通常是**免費**或成本極低（閱讀**[部署指南](https://docusaurus.io/docs/deployment)**）。

## 熱門部署選擇

- **[GitHub Pages](https://pages.github.com/)** - 公開儲存庫的免費託管服務
- **[Netlify](https://www.netlify.com/)** - 從 Git 儲存庫自動部署
- **[Vercel](https://vercel.com/)** - 為前端框架最佳化
- **[AWS Amplify](https://aws.amazon.com/amplify/)** - 全端開發平台
- **[Firebase Hosting](https://firebase.google.com/products/hosting)** - 快速且安全的網站託管

## 持續部署

設定當你推送到 Git 儲存庫時的自動部署：

### 使用 GitHub Actions 部署到 GitHub Pages

建立 `.github/workflows/deploy.yml`：

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

      - name: 安裝相關套件
        run: npm ci
      - name: 建置網站
        run: npm run build

      - name: 部署到 GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```