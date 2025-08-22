---
sidebar_position: 2
---

# 網站多語系化設定

在台灣的軟體開發環境中，多語系支援是非常重要的功能。讓我們以繁體中文和英文雙語為例，示範如何為您的 Docusaurus 網站建立多語系支援。

## 設定國際化 (i18n)

修改 `docusaurus.config.js` 來新增台灣常用的語言支援。以繁體中文 (`zh-TW`) 為例：

```js title="docusaurus.config.js"
export default {
  i18n: {
    defaultLocale: 'zh-TW',
    locales: ['zh-TW', 'en'],
  },
};
```

## 翻譯文件內容

將原始文件複製到對應的語言資料夾。以英文翻譯為例：

```bash
mkdir -p i18n/en/docusaurus-plugin-content-docs/current/

cp docs/intro.md i18n/en/docusaurus-plugin-content-docs/current/intro.md
```

接著翻譯 `i18n/en/docusaurus-plugin-content-docs/current/intro.md` 為英文內容。

## 啟動本地化網站

以英文語系模式啟動網站：

```bash
npm run start -- --locale en
```

您的英文版網站可以在 [http://localhost:3000/en/](http://localhost:3000/en/) 瀏覽，而繁體中文版（預設語言）則在 [http://localhost:3000/](http://localhost:3000/) 瀏覽。

:::caution 開發模式限制

在開發模式下，一次只能運行一個語言版本。如需測試多語系切換功能，請使用建置模式。

:::

## 新增語言切換器

為了讓使用者能輕鬆在不同語言間切換，我們可以加入語言選擇下拉選單。

修改 `docusaurus.config.js` 設定檔：

```js title="docusaurus.config.js"
export default {
  themeConfig: {
    navbar: {
      items: [
        // highlight-start
        {
          type: 'localeDropdown',
        },
        // highlight-end
      ],
    },
  },
};
```

設定完成後，導覽列會出現語言切換器：

使用者可以透過導覽列的語言選擇器，在繁體中文與英文間自由切換。

## 建置多語系網站

您可以為特定語言建置網站：

```bash
npm run build -- --locale en
```

或是一次建置所有語言版本：

```bash
npm run build
```

:::tip 台灣團隊部署建議
對於台灣的開發團隊，建議在 CI/CD 流程中設定自動建置所有語言版本，確保繁體中文與英文內容同步更新。這樣可以為不同背景的使用者提供最佳的閱讀體驗。
:::