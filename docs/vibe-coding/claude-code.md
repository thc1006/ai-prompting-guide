---
sidebar_position: 2
---

# Claude Code: A Field Guide

Claude Code is Anthropic's agentic coding environment. It ships as a terminal CLI, IDE extensions, and a web surface, and unlike a chatbot it does not just return text you copy and paste. It reads files, runs commands, edits code, and works through multi-step tasks autonomously while you watch and redirect. You give it a goal; it explores the repository, forms a plan, makes changes, and reports back. Your job shifts from typing every line to steering an agent and verifying its output.

This guide is a practical field manual: the workflow, the configuration, and the failure patterns that matter once you move past trivial use.

## The master constraint: the context window

Almost every practice below derives from one fact. Claude Code works inside a finite context window, and that window fills fast — file contents, command output, your instructions, and the model's own reasoning all consume it. As it fills, performance degrades: the model loses track of earlier decisions, repeats work, and drifts off-task.

So the central discipline is **context hygiene**. Keep the window focused on what the current task needs and nothing more. When you internalize this, the session commands (`/clear`, `/compact`, `/rewind`), the subagent pattern, and the writer/reviewer split all stop looking like separate features and start looking like one idea: protect the context.

## Core workflow: explore, plan, code, commit

The reliable loop is four phases:

1. **Explore** — let Claude read the relevant files and understand the current state before proposing anything.
2. **Plan** — have it produce a plan you can review *before* it touches code.
3. **Code** — execute the plan, in steps you can follow.
4. **Commit** — land the change with a clear message once it is verified.

The high-leverage move is using **plan mode** to separate research from execution. Left unconstrained, an agent tends to jump straight to code — and a fast solution to the wrong problem is worse than no solution. Plan mode forces it to investigate and lay out an approach you can correct cheaply, before any edits exist.

Skip planning for trivial changes (a typo, a one-line config tweak). The overhead is not worth it there. Reserve the ceremony for work where getting the approach wrong is expensive.

## CLAUDE.md: persistent project memory

`CLAUDE.md` is a Markdown file Claude Code reads at the start of every session. It is where you put the things you would otherwise repeat constantly: how to run the tests, project conventions, gotchas, what *not* to touch.

Generate a starter with `/init`, which scans the repo and drafts a baseline. Then treat it like code you maintain.

The single most important rule: **keep it short and prune it.** A bloated `CLAUDE.md` is counterproductive — it consumes context every session and, past a certain size, the model effectively ignores it. Favor a tight file of high-signal rules over an exhaustive one.

It supports `@path` imports, so you can pull in shared fragments instead of duplicating them:

```markdown
# Project: Acme API

## Commands
- Test: `npm test`
- Lint: `npm run lint`
- Dev server: `npm run dev`

## Conventions
- TypeScript strict mode; no `any`.
- Co-locate tests as `*.test.ts` next to source.
- Never edit files under `generated/` by hand.

## Imports
@docs/architecture-notes.md
```

Placement controls scope:

| Location | Purpose |
| --- | --- |
| `~/.claude/CLAUDE.md` | Global, applies to every project for you. |
| `./CLAUDE.md` | Project rules — commit it so the team shares them. |
| `./CLAUDE.local.md` | Personal overrides — gitignore it. |
| Parent / child directories | Per-package rules in a monorepo, merged by proximity. |

## Give Claude a way to verify its work

An agent will report success whether or not it succeeded. The defense is to give it a check it can run itself and require it to *show evidence, don't assert success*.

A good check is deterministic and cheap: a test suite, a build that exits non-zero on failure, a linter, a type-checker, or a screenshot compared against a target design. If Claude can run it, it can catch its own mistakes before handing the work back to you.

You also have several ways to gate when it is allowed to stop:

- **In-prompt iteration** — instruct it to run the check and keep fixing until it passes.
- **A `/goal` condition** — define the success condition explicitly so the session has a clear finish line.
- **A deterministic Stop hook** — block the stop programmatically unless the check passes (covered below).
- **An adversarial review subagent** — spin up a reviewer in fresh context to judge the work without the bias of having just written it.

Pair the check with the work, not as an afterthought. "It builds and the tests pass" is evidence; "I made the change" is not.

## Extending Claude Code

Five extension points let you push behavior beyond the defaults. Reach for them when a workflow recurs.

### Skills

A Skill is a reusable capability defined in `.claude/skills/SKILL.md` — a named procedure with instructions Claude can invoke when relevant. Use Skills to capture a repeatable task (e.g. "cut a release") once instead of re-explaining it each time.

### Subagents

Subagents live in `.claude/agents/*.md`. Each runs in **isolated context** with its own **scoped tools**, so it can handle a sub-task without polluting the main session's window — and report back only its conclusion. This is the mechanism behind the fresh-context reviewer and any "go investigate X and summarize" delegation.

### Hooks

Hooks are **deterministic** shell commands the harness runs at defined lifecycle points — not suggestions the model may skip. A common one runs `eslint` after every edit, or blocks a stop until tests pass. Use hooks when "always do X" must be guaranteed rather than hoped for.

### MCP servers

MCP (Model Context Protocol) servers connect Claude Code to external systems — issue trackers, databases, internal APIs — through a standard interface, giving the agent tools beyond the local filesystem and shell.

### Plugins

Plugins package the above — Skills, subagents, hooks, MCP configuration — into installable bundles you can share across a team or projects, so a whole workflow setup travels as one unit.

## Managing the session

Active context management is a skill in itself:

- **`/clear`** — wipe the conversation between unrelated tasks. The cheapest, most underused command. Starting a new task in an old session drags along irrelevant context.
- **`/compact`** — summarize the conversation to reclaim window space. It runs automatically as you approach the limit, and you can trigger it manually at a natural breakpoint.
- **`/rewind`** — restore from a checkpoint, rolling back the conversation, the code, or both when an attempt went sideways.
- **Course-correct early with `Esc`** — interrupt the moment you see Claude heading the wrong way. Redirecting after two wrong steps is far cheaper than after twenty.

## Permissions and autonomy

Claude Code edits files and runs commands, so it gates those actions:

- **Auto mode** — a classifier approves low-risk actions and blocks or escalates risky ones, reducing prompts while keeping a guardrail.
- **Permission allowlists** — pre-approve specific commands or tools you trust (e.g. your test runner) so they run without interruption.
- **Sandboxing** — confine execution so the agent can work more freely without reaching beyond an intended boundary.

Tune autonomy to the stakes. A throwaway prototype tolerates more latitude than a production deployment script.

## Scaling beyond one interactive session

Once the basics are solid, Claude Code scales out:

- **Headless mode** — `claude -p "<prompt>"` runs non-interactively, for CI jobs, pre-commit checks, or fanning the same task across many inputs.
- **Parallel sessions** — run several agents at once on independent tasks.
- **Git worktrees** — give each parallel session its own working tree so they edit without colliding.
- **The writer/reviewer pattern** — one agent writes, a *separate fresh-context* agent reviews. The reviewer hasn't seen the authoring rationale, so it is less biased toward defending code it just produced and more likely to catch real problems.

```bash
# Headless: run a check and let Claude fix failures, no interaction
claude -p "Run the test suite; if anything fails, fix it and re-run until green."
```

See [code generation tutorial](/docs/tutorials/code-generation) for task-level examples.

## Models

Claude Code runs on Anthropic's general-purpose models. As of 2026-06, that is the **Opus / Sonnet / Haiku 4.x family** — Opus for the hardest reasoning, Sonnet as the balanced default, Haiku for speed and cost on lighter work. Model availability changes over time; check the current docs at [code.claude.com/docs](https://code.claude.com/docs) rather than relying on any fixed list here.

## Common failure patterns

| Pattern | Symptom | Fix |
| --- | --- | --- |
| Kitchen-sink session | One session accreting unrelated tasks; quality drops | `/clear` between tasks |
| Over-correcting | Piling fixes onto a confused agent | `/clear` and re-prompt cleanly |
| Over-stuffed `CLAUDE.md` | Rules silently ignored; context wasted | Prune to high-signal essentials |
| Trust-then-verify gap | Accepting "done" without proof | Always require a runnable check |

Every one of these is, at root, a context or verification problem — the two themes this guide keeps returning to.

:::tip
New to agentic coding? Start with the chapter opener at [the overview](/docs/vibe-coding/overview) for the broader workflow and where Claude Code fits among the other tools.
:::
