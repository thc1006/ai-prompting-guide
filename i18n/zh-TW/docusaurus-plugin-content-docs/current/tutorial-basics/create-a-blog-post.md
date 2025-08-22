---
sidebar_position: 3
---

# 建立部落格文章

Docusaurus 會為每篇部落格文章建立**獨立頁面**，同時也會自動產生**部落格首頁**、**標籤系統**、**RSS** 資訊流等等...

## 建立你的第一篇文章

在 `blog/2021-02-28-greetings.md` 建立檔案：

```md title="blog/2021-02-28-greetings.md"
---
slug: greetings
title: Greetings!
authors:
  - name: Joel Marcey
    title: Co-creator of Docusaurus 1
    url: https://github.com/JoelMarcey
    image_url: https://github.com/JoelMarcey.png
tags: [greetings]
---

恭喜，你已經完成第一篇文章了！

歡迎盡情地編輯和調整這篇文章。
```

現在你可以在 [http://localhost:3000/blog/greetings](http://localhost:3000/blog/greetings) 看到新的部落格文章。

## 部落格文章標頭

部落格文章支援 [Docusaurus Markdown 功能](https://docusaurus.io/docs/markdown-features)，例如 [MDX](https://mdxjs.com/)。

:::tip

運用 React 的強大功能來打造互動式部落格文章。

```js
<button onClick={() => alert('button clicked!')}>點我！</button>
```

<button onClick={() => alert('button clicked!')}>點我！</button>

:::