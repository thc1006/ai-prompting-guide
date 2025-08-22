---
sidebar_position: 3
---

# Create a Blog Post

Docusaurus creates a **page for each blog post**, but also a **blog index page**, a **tag system**, an **RSS** feed...

## Create your first Post

Create a file at `blog/2021-02-28-greetings.md`:

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

Congratulations, you have made your first post!

Feel free to play around and edit this post as much you like.
```

A new blog post is now available at [http://localhost:3000/blog/greetings](http://localhost:3000/blog/greetings).

## Blog Post Headers

Blog posts support [Docusaurus Markdown features](https://docusaurus.io/docs/markdown-features), such as [MDX](https://mdxjs.com/).

:::tip

Use the power of React to create interactive blog posts.

```js
<button onClick={() => alert('button clicked!')}>Click me!</button>
```

<button onClick={() => alert('button clicked!')}>Click me!</button>

:::