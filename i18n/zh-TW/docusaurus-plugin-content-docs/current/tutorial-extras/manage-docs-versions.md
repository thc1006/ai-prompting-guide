---
sidebar_position: 1
---

# 管理文件版本

Docusaurus 能協助您管理多個版本的技術文件，這對於維護不同版本的產品文件非常實用。

## 建立文件版本

假設您的專案準備發布 1.0 版本，執行以下指令來建立版本快照：

```bash
npm run docusaurus docs:version 1.0
```

執行後，系統會將 `docs` 資料夾複製到 `versioned_docs/version-1.0`，並建立 `versions.json` 版本設定檔。

此時您的文件會有 2 個版本：

- `1.0` 版本：位於 `http://localhost:3000/docs/`，提供 1.0 版本的穩定文件
- `current` 版本：位於 `http://localhost:3000/docs/next/`，用於**開發中的最新文件**

## 新增版本選擇器

為了讓使用者能方便地在不同版本間切換，我們可以加入版本下拉選單。

編輯 `docusaurus.config.js` 設定檔：

```js title="docusaurus.config.js"
export default {
  themeConfig: {
    navbar: {
      items: [
        // highlight-start
        {
          type: 'docsVersionDropdown',
        },
        // highlight-end
      ],
    },
  },
};
```

設定完成後，導覽列會出現版本選擇器：

透過版本下拉選單，使用者可以輕鬆在不同版本的文件間進行切換。

## 更新既有版本

您可以直接編輯對應資料夾中的版本化文件：

- 編輯 `versioned_docs/version-1.0/hello.md` 會更新 `http://localhost:3000/docs/hello` 的內容
- 編輯 `docs/hello.md` 會更新 `http://localhost:3000/docs/next/hello` 的內容

:::tip 台灣開發團隊最佳實務
建議在專案管理中明確區分「穩定版本」和「開發版本」，讓團隊成員清楚了解哪些文件適用於線上環境，哪些是開發階段的參考資料。
:::