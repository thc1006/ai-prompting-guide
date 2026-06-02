# AI 提示詞寶典 · AI Prompting Guide

A bilingual (Traditional Chinese · English) handbook for getting real work done with large language models — from prompt fundamentals to 2026 **agentic coding** with tools like Claude Code and OpenAI Codex.

- 🌐 **Live site:** https://thc1006.github.io/ai-prompting-guide/
- ✍️ **Author:** 蔡秀吉 (Hsiu-Chi Tsai)
- 🛠️ Built with [Docusaurus 3](https://docusaurus.io/). Default language is 繁體中文 (Taiwan); English is available via the locale switcher.

## What's inside

- **Fundamentals** — what prompting is, prompt structure, common patterns, and a quick-start.
- **Vibe Coding & AI Agents** *(new in v2.0)* — the 2025–2026 shift from prompt engineering to **context engineering** and **agentic, spec-driven** workflows: field guides for Claude Code and OpenAI Codex, project context files (CLAUDE.md / AGENTS.md), agentic workflows, spec-driven development, and verification/safety/engineering discipline (TDD, Small CLs, the Boy Scout Rule).
- **Practical Tutorials** — content creation, code generation, data analysis.
- **Advanced Techniques** — chain-of-thought, prompt chaining, multi-modal.
- **Best Practices** — testing & optimization, production deployment, security & ethics, team collaboration.
- **Applications & Case Studies** — business intelligence, an enterprise deployment case study.
- **Blog** — notes on prompt-engineering education and related topics.

## Local development

```bash
npm install      # install dependencies
npm start        # dev server at http://localhost:3000
npm run build    # production build into ./build (builds both locales)
npm run serve    # serve the production build locally
```

Requires Node.js >= 18.

## Project structure

```
docs/                  # documentation chapters (English source)
i18n/zh-TW/            # Traditional Chinese (Taiwan) translations + theme strings
blog/                  # blog posts
src/                   # homepage, React components, custom CSS
static/                # images and static assets
docusaurus.config.js   # site configuration
sidebars.js            # docs sidebar structure
```

## Contributing

Issues and pull requests are welcome at
[github.com/thc1006/ai-prompting-guide](https://github.com/thc1006/ai-prompting-guide).
Documentation lives under `docs/` (English source) with mirrored Traditional
Chinese translations under `i18n/zh-TW/…` — please keep both in sync.

## License

Licensed under the [Apache License 2.0](./LICENSE).
