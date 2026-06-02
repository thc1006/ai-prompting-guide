---
sidebar_position: 4
---

# Context Engineering: CLAUDE.md, AGENTS.md & Project Memory

Context engineering is the practice of curating everything that fills a model's context window for a given turn: standing instructions, project conventions, retrieved files, tool outputs, and conversation history. Prompt engineering — wording a single request well — is one subset of that larger discipline. The [overview](/docs/vibe-coding/overview) traces how the term emerged; this doc is about the most durable lever you have over context: the persistent instruction file your agent reads at the start of every session.

## Why a project context file is the highest-leverage artifact

A good prompt helps one conversation. A project context file helps every conversation. You write it once, the agent loads it automatically each session, and it keeps paying off as you switch models or upgrade them — durable, version-controlled intent outlasts the per-session prompt tricks people accumulate and forget.

That durability is the whole point. Model upgrades change behavior; a committed file encoding "how this repo works" stays valid across them. When the agent gets something wrong in a way you'll hit again, the fix belongs in the file, not in a one-off correction you retype next week. This is why the instruction file, not any single clever prompt, is where serious context-engineering effort should go.

## The landscape of context files

Each major coding agent looks for its own instruction file by convention. The mechanics of how each tool consumes these files live in the tool-specific guides; the table below is the map.

| Tool | Context file |
| --- | --- |
| Claude Code | `CLAUDE.md` |
| OpenAI Codex | `AGENTS.md` |
| Gemini CLI | `GEMINI.md` |
| Cursor | `.cursor/rules` |
| Aider | `CONVENTIONS.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |

`AGENTS.md` is the convergence point: several tools read it as their native format, and it is the emerging cross-vendor standard. Whether Claude Code reads `AGENTS.md` natively is version-dependent, so for Claude Code use `CLAUDE.md` and don't rely on `AGENTS.md` being picked up. See [Claude Code](/docs/vibe-coding/claude-code) and [OpenAI Codex](/docs/vibe-coding/openai-codex) for each tool's exact loading rules.

## AGENTS.md as an open standard

`AGENTS.md` is stewarded by the Linux Foundation's Agentic AI Foundation, announced in December 2025 alongside MCP. It is deliberately minimal: plain Markdown with no required schema, so any agent that can read text can use it and you are never fighting a format. Per the Agentic AI Foundation's December 2025 announcement, the convention is in use across 60,000+ repositories — a single-source figure from that announcement.

Placement follows a simple rule:

- Put the primary file at the repository root.
- In a monorepo, add nested `AGENTS.md` files inside subdirectories for package-specific guidance.
- The file nearest the working directory takes precedence, so local instructions override the root.

Codex caps the combined instruction size at 32 KiB by default, controlled by the `project_doc_max_bytes` setting; content beyond that limit is dropped. Treat this as a Codex-specific default rather than a universal rule — other tools size and merge these files differently.

## What to put in it (and what to leave out)

The governing principle: include what the agent cannot infer from the code, and exclude everything it can. Anything discoverable by reading the repository is wasted space, and a file padded with it trains the agent to skim past the parts that matter.

| Include (agent can't infer it) | Exclude (wastes context or gets ignored) |
| --- | --- |
| Exact build, test, and lint commands | Anything discoverable by reading the code |
| Code-style deviations from the language defaults | Generic language conventions the model already knows |
| Repo etiquette: branch and PR conventions | Long API docs — link to them instead |
| Architectural decisions specific to this project | Content already in the `README` |
| Environment quirks and required setup | File-by-file descriptions of the tree |
| Hard boundaries — "never do X" | "Write clean code" platitudes |
| Domain vocabulary the model won't know | Restated language tutorials |

The "include" column shares a property: each item is a fact the model has no way to recover on its own. The "exclude" column shares the opposite property — it either duplicates the codebase or restates what the model already knows.

## Keep it concise

Practitioner guidance puts a healthy instruction file at roughly 100–150 lines. A short, accurate file outperforms a long, vague one: every line you add competes for the agent's attention, and a bloated file gets skimmed and effectively ignored. This is the same failure mode as a bloated `CLAUDE.md` — covered in more depth in the [Claude Code](/docs/vibe-coding/claude-code) guide. When the file grows past what you can read in one sitting, that is the signal to cut, not to keep appending.

## A realistic sample

```markdown
# AGENTS.md

## Commands
- Install: `pnpm install`
- Test (single file): `pnpm vitest run path/to/file.test.ts`
- Lint + typecheck before every PR: `pnpm check`

## Conventions
- Use the `Result` type for fallible calls; never throw across module boundaries.
- Imports are sorted by the lint rule — don't hand-reorder.

## Boundaries
- Never edit files under `generated/` — they are produced by `pnpm codegen`.
- Never commit directly to `main`; open a PR from a `feat/` or `fix/` branch.

## Domain
- "Tenant" means a billing account, not a DB schema.
```

Every line above is something the agent cannot deduce by reading the source: the exact commands, the project-specific `Result` rule, the generated-file boundary, and the domain meaning of "tenant." Notice what is absent — no file listing, no language tutorial, no aspiration to "write clean code."

## Treat it like code

The context file is a source artifact, so manage it like one:

- **Commit it.** It belongs in version control next to the code it describes, reviewed in the same pull requests.
- **Review it when the agent misbehaves.** Repeated wrong behavior usually traces to a missing or stale instruction; fix the file rather than re-correcting the agent each turn.
- **Prune regularly.** Delete instructions for code that no longer exists and conventions you've abandoned. A stale line is worse than a missing one, because the agent will follow it.

See also [code generation](/docs/tutorials/code-generation) for how these conventions shape the output you actually get.

:::tip
For the bigger picture of how instructions, retrieval, and history combine into a working context window, see the [vibe-coding overview](/docs/vibe-coding/overview). For exactly how each tool discovers and merges these files — including precedence and size handling — see the [Claude Code](/docs/vibe-coding/claude-code) and [OpenAI Codex](/docs/vibe-coding/openai-codex) guides.
:::
