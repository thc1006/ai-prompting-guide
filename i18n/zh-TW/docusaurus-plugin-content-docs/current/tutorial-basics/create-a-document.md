---
sidebar_position: 2
---

# 建立文件

文件是一群透過以下方式連結的**頁面集合**：

- **側邊選單**
- **上一頁/下一頁導覽**
- **版本控制**

## 建立你的第一個文件

在 `docs/hello.md` 建立一個 Markdown 檔案：

```md title="docs/hello.md"
# Hello

這是我的**第一個 Docusaurus 文件**！
```

現在你可以在 [http://localhost:3000/docs/hello](http://localhost:3000/docs/hello) 看到新的文件。

## 設定側邊選單

Docusaurus 會自動從 `docs` 資料夾**建立側邊選單**。

新增 metadata 來自訂側邊選單的標籤和位置：

```md title="docs/hello.md" {1-4}
---
sidebar_label: 'Hi!'
sidebar_position: 3
---

# Hello

這是我的**第一個 Docusaurus 文件**！
```

你也可以在 `sidebars.js` 中明確定義側邊選單：

```js title="sidebars.js"
export default {
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
};
```