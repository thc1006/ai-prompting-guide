---
sidebar_position: 3
---

# OpenAI Codex: A Field Guide

OpenAI Codex is two distinct things that share a name, and keeping them separate avoids most confusion. It is a **product surface** — a CLI, an IDE extension, a cloud/web experience, and a desktop app — and it is a **family of GPT-5-series models** tuned for agentic coding. The surface and the models evolve on separate tracks and ship on separate schedules, so a sentence like "Codex shipped today" is ambiguous until you know whether it refers to a tool release or a model release.

This guide focuses on the practical mechanics: how to run the CLI, how sandboxing and approvals interact, how the agent reads project instructions, and how code review fits in.

## The Codex models

The models in the Codex family are GPT-5-series variants optimized for long-running, tool-using coding work. Model availability and per-surface defaults move quickly, so treat the table below as a dated snapshot rather than settled fact.

### Codex models — as of 2026-06; these change fast

| Model | First available | Notes |
| --- | --- | --- |
| GPT-5-Codex | 2025-09-15 | Was the default for cloud tasks and code review |
| GPT-5.2-Codex | 2025-12-18 | Iteration in the Codex-tuned line |
| GPT-5.3-Codex | 2026-02-05 | Iteration in the Codex-tuned line |
| GPT-5.5 | 2026-04-23 | Current frontier; Codex docs say "start with gpt-5.5" |

Exact per-surface defaults (cloud vs. CLI vs. review) drift independently and are not worth memorizing. For ChatGPT-authenticated sessions, leaving the model unspecified tracks whatever the current default is, which is usually the right choice. If you need a specific model, set it explicitly with `/model` or in configuration.

:::note
There is no separate "start here" rule beyond the docs' own guidance to begin with the current frontier model and only pin an older Codex-tuned model when you have a concrete reason.
:::

## Codex CLI

The Codex CLI is open source, written in Rust, and licensed under Apache-2.0. After installing it, you start an interactive session by running:

```bash
codex
```

For scripting and CI, the CLI offers a non-interactive mode that runs a single task and exits:

```bash
codex exec "run the test suite and summarize failures"
```

The CLI is both an **MCP client** and an **MCP server**. As a client it can connect to external Model Context Protocol servers you configure; as a server it exposes Codex itself to other MCP-aware tools:

```bash
# Manage / connect to MCP servers as a client
codex mcp

# Expose Codex as an MCP server to other tools
codex mcp-server
```

### Sandboxing and approvals

Two independent controls govern what the agent may do: a filesystem/network **sandbox** and an **approval** policy for actions that need escalation. They combine, and choosing the pair deliberately matters more than either setting alone.

The sandbox is set with `--sandbox`:

| `--sandbox` value | Effect |
| --- | --- |
| `read-only` | Agent may read the workspace but not write |
| `workspace-write` | Agent may read and write within the workspace |
| `danger-full-access` | No sandbox restrictions |

The approval policy is set with `--ask-for-approval`:

| `--ask-for-approval` value | Effect |
| --- | --- |
| `untrusted` | Prompt for anything not explicitly trusted |
| `on-request` | Agent asks when it needs to escalate beyond its sandbox |
| `never` | Agent never pauses to ask |

A sensible default for local interactive work is `workspace-write` paired with `on-request`: the agent can edit files in your project freely, but it pauses and asks before doing anything that reaches outside the sandbox.

```bash
codex --sandbox workspace-write --ask-for-approval on-request
```

Reserve `danger-full-access` and `never` for trusted, isolated environments such as a throwaway container, never on a machine where an unexpected command could do harm.

## The App Server architecture

Published in 2026-02, the unified **App Server** is the backbone that keeps the four surfaces consistent. It is a single bidirectional process speaking **JSON-RPC 2.0**, and the CLI, IDE extension, web, and desktop app all drive Codex through it. Because the clients share one server contract, behavior and capabilities stay aligned across surfaces instead of drifting per-client.

The practical upshot: a feature added at the App Server layer becomes available to every front end, and integrators targeting the JSON-RPC interface get the same agent regardless of which surface a user prefers.

## AGENTS.md: instructions for the agent

`AGENTS.md` is where you put task and context instructions for the agent — build commands, conventions, things to avoid, how the project is laid out. It is distinct from configuration: see the comparison below.

Lookup walks from the **git root down to the current working directory**, and files nearer to the working directory override those higher up. The default combined size cap across the discovered files is **32 KiB**, controlled by `project_doc_max_bytes`.

`AGENTS.md` is an **open, cross-vendor standard**, stewarded by the Linux Foundation's Agentic AI Foundation (December 2025), so the same file format works across multiple agent tools rather than being Codex-specific.

A minimal `AGENTS.md` might look like:

```markdown
# Project: billing-service

## Build & test
- Install: `npm ci`
- Test: `npm test`
- Lint before committing: `npm run lint`

## Conventions
- TypeScript strict mode; no `any`.
- Keep functions small; prefer pure helpers.

## Do not
- Do not edit files under `generated/`.
- Do not commit secrets or `.env` files.
```

### AGENTS.md vs. config.toml

| Concern | File | Holds |
| --- | --- | --- |
| What the agent should know/do | `AGENTS.md` | Task and project context, conventions |
| How the agent operates | `~/.codex/config.toml` | Operational settings: MCP servers, model and sandbox defaults |

Keep prompt-style guidance in `AGENTS.md` and operational knobs in `config.toml`. Mixing them makes both harder to reason about.

## Code review

Codex can review diffs in two places.

In the **CLI**, the `/review` slash command reviews a selected diff and returns prioritized findings, so you see the most serious issues first rather than a flat list.

On **GitHub**, you can trigger a review by commenting `@codex review` on a pull request, or configure automatic PR reviews so Codex weighs in without a manual trigger.

In both cases the review focuses on **serious (P0/P1) issues** rather than stylistic nitpicks, which keeps the signal high on changes that actually matter.

## Slash commands and Agent Skills

Interactive sessions support slash commands for common operations. A few worth knowing:

| Command | Purpose |
| --- | --- |
| `/model` | Switch the active model |
| `/review` | Review the selected diff |
| `/plan` | Have the agent plan before acting |
| `/compact` | Compact the conversation to reclaim context |
| `/diff` | Show the current diff |

**Agent Skills** package reusable agent capabilities. A skill is defined in a `SKILL.md` file following the open Agent Skills standard, and `/skills` manages the skills available in your session. Skills let you encapsulate a repeatable workflow once and invoke it by name instead of re-explaining it each time.

## Further reading

- [Codex documentation](https://developers.openai.com/codex)
- [Codex on GitHub](https://github.com/openai/codex)
- For end-to-end workflows, see [Code Generation](/docs/tutorials/code-generation).

:::tip
New to agent-assisted development? Start with the [Vibe Coding overview](/docs/vibe-coding/overview) for the conceptual foundation, then return here for the Codex specifics.
:::
