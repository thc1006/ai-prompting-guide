---
sidebar_position: 1
---

# 建立頁面

在 `src/pages` 新增 **Markdown 或 React** 檔案來建立**獨立頁面**：

- `src/pages/index.js` → `localhost:3000/`
- `src/pages/foo.md` → `localhost:3000/foo`
- `src/pages/foo/bar.js` → `localhost:3000/foo/bar`

## 建立你的第一個 React 頁面

在 `src/pages/my-react-page.js` 建立檔案：

```jsx title="src/pages/my-react-page.js"
import React from 'react';
import Layout from '@theme/Layout';

export default function MyReactPage() {
  return (
    <Layout>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
          fontSize: '20px',
        }}>
        <p>
          編輯 <code>pages/my-react-page.js</code> 並儲存以重新載入。
        </p>
      </div>
    </Layout>
  );
}
```

現在你可以在 [http://localhost:3000/my-react-page](http://localhost:3000/my-react-page) 看到新的頁面。

## 建立你的第一個 Markdown 頁面

在 `src/pages/my-markdown-page.md` 建立檔案：

```mdx title="src/pages/my-markdown-page.md"
# 我的 Markdown 頁面

這是一個 Markdown 頁面
```

現在你可以在 [http://localhost:3000/my-markdown-page](http://localhost:3000/my-markdown-page) 看到新的頁面。