---
sidebar_position: 4
---

# Team Collaboration

Prompting used to be a solo craft: one person, one chat window, one clever string. That is no longer how serious AI work happens. By 2026, building and operating AI-assisted software is a team sport — and the team includes AI coding agents as working participants, not just tools. Agents read your repository, follow your conventions, open changes, and review each other's output. That changes what "collaboration" has to mean.

The central design principle of this doc: **your shared conventions must serve humans and agents at the same time.** A new engineer and a fresh agent session both arrive with zero context about how your team works. The same artifacts that onboard the human — a conventions file, a prompt library, a set of examples and failures — are exactly what the agent reads to behave like a member of the team. Build those artifacts once, version them like code, and both audiences benefit.

This doc covers how teams structure roles, shared context, libraries, review, onboarding, and scaling. It defers the deep treatments to siblings: testing and eval mechanics live in [Testing & Optimization](/docs/best-practices/testing-prompts), governance and accountability in [Security & Ethics](/docs/best-practices/security-ethics), deployment and rollout mechanics in [Production Deployment](/docs/best-practices/production-deployment), and the agentic workflow layer — delegation, parallelism, verification — in [Agentic Workflows](/docs/vibe-coding/agentic-workflows).

## Roles & responsibilities

Small teams collapse several of these into one person; large teams split them further. The point is not an org chart — it is that for every responsibility below, *someone is named*. An unowned responsibility is an incident waiting to happen.

**Prompt / AI Engineer.** Owns the prompts, system messages, and context files that drive model behavior. Designs templates, tunes them against evals, and decides how context is scoped for a given task. In practice this person spends as much time deciding *what enters the context window* as wording the request — the shift from prompt engineering to context engineering described in the [Vibe Coding overview](/docs/vibe-coding/overview). Decision authority: how a prompt or template is structured, when it changes, and what its acceptance criteria are.

**Domain Expert.** Supplies the subject-matter judgment the model lacks and the engineer cannot fake — what a correct answer looks like in this domain, which edge cases matter, where a fluent-but-wrong output would do real harm. They curate few-shot examples, review consequential outputs, and define what "good" means for an eval set. Decision authority: whether an output is *correct for the domain*, which often overrides what looks plausible to an engineer.

**QA / Eval owner.** Owns the evaluation sets and the quality bar. Builds and maintains the test cases a prompt must pass, runs them on every change, and watches for regressions and drift in production. This role is the gatekeeper between "it works on my one example" and "it works across the cases we actually serve." The mechanics of building these suites — baselines, A/B tests, robustness, failure-pattern analysis — are owned by [Testing & Optimization](/docs/best-practices/testing-prompts); the collaboration point is that **every prompt template has an eval set, and a named person owns it.** Decision authority: whether a change has passed its gate.

**Platform / DevOps.** Owns the infrastructure prompts run on: version control, CI pipelines, deployment, monitoring, secrets, and the access controls around the prompt library. They make the review-and-rollout workflow real — the staged rollouts, canaries, and rollback paths in [Production Deployment](/docs/best-practices/production-deployment) — and they configure the guardrails for headless and CI agent runs (scoped permissions, bounded turns, sandboxing). Decision authority: how and when a change reaches production, and what an automated agent is allowed to touch.

**Governance / accountability owner.** Owns the answer to "who is responsible when the model is wrong?" Not the model — a named person or team. This role decides what data may be sent, what disclosure users get, where a human must stay in the loop, and where the escalation path leads. It is described in depth, including the "name an owner" discipline, in [Security & Ethics](/docs/best-practices/security-ethics); the collaboration takeaway is that this owner signs off on consequential AI-assisted features and is reachable when one misfires. Decision authority: whether a use is permitted at all.

:::note Agents fill roles too, partially
A reviewer subagent can do first-pass review; a test-writer subagent can draft an eval set; a researcher subagent can gather domain facts. None of them *own* the responsibility — a human still does. Treat agent contributions as work that lands in a named human's queue, never as a role that signs off on itself.
:::

## Shared context for humans and agents

This is the 2026 modernization, and it is where most teams get the largest, cheapest leverage. Two artifacts carry your team's working knowledge, and both live under version control:

1. **A shared conventions file** — `CLAUDE.md` for Claude Code, `AGENTS.md` for Codex and a growing set of cross-vendor tools (see the [overview](/docs/vibe-coding/overview) on `AGENTS.md` as an emerging standard). This is the file the agent reads at the start of every session and the file a new human reads on day one. Same content, two audiences.
2. **A prompt and eval library** — the tested templates and the cases they must pass (next section).

### What goes in the shared conventions file

Put the things you would otherwise repeat to every new teammate and every fresh agent session: how to run the tests, the project's conventions, the gotchas, and what *not* to touch. The [Claude Code guide](/docs/vibe-coding/claude-code) and [OpenAI Codex guide](/docs/vibe-coding/openai-codex) cover the per-tool mechanics — file placement, scope, and imports — so this doc focuses on the *team* discipline around the file.

```text
# Project: Acme API   (CLAUDE.md / AGENTS.md)

## Commands
- Test:  run the test suite with the project's test command
- Lint:  run the project linter
- Dev:   start the local dev server

## Conventions
- Strict typing; no escape hatches.
- Co-locate tests next to source.
- Never edit generated files by hand.

## Prompt & eval library
- Templates live under prompts/templates/, each with an owner and an eval set.
- Change templates via small, focused changes; see CODEOWNERS for reviewers.

## Out of bounds
- Do not send customer PII to a model; redact first (see security-ethics).
```

Three rules make this file a team asset rather than a stale README:

- **Keep it short and prune it.** A bloated conventions file costs context on every agent session and, past a size, the model effectively ignores it. The same applies to humans skimming it. High-signal rules beat exhaustive ones — the [Claude Code guide](/docs/vibe-coding/claude-code) makes this the single most important rule for the file.
- **Own it with `CODEOWNERS`.** Assign a reviewer (or small group) to the conventions file so changes get eyes. When a convention changes — a new test command, a renamed module, a new "do not touch" — the file is updated in the *same* change, not weeks later from memory.
- **Treat drift as a bug.** When an agent or teammate trips over something the file should have warned them about, the fix is a one-line addition to the file, captured in that moment. The conventions file is the team's accumulated "things we wish we'd known."

## Prompt & eval library management

The library is the team's shared inventory of tested prompts and the cases that prove they work. Adapt the existing `/prompts` tree into something structured, owned, and discoverable.

```text
prompts/
├── templates/
│   ├── customer-support.md
│   ├── content-generation.md
│   └── data-analysis.md
├── evals/
│   ├── customer-support.cases        # the test set this template must pass
│   ├── content-generation.cases
│   └── data-analysis.cases
├── examples/
│   ├── successful-cases.md
│   └── failure-analysis.md           # what went wrong and why
└── CODEOWNERS                        # an owner per template / directory
```

A few practices keep a shared library from rotting:

- **Pair every template with an eval set.** A template without cases is folklore. The eval set is what a reviewer runs before approving a change and what catches a regression later. The structure of those sets — baselines, edge cases, robustness, bias checks — belongs to [Testing & Optimization](/docs/best-practices/testing-prompts); the library just keeps the cases next to the template they test, so neither drifts from the other.
- **Version everything in Git.** Templates, eval cases, examples, and conventions are all text under version control, with change history and a record of *why* each change was made in the change description. This is how a teammate (or an agent) understands how a template reached its current shape.
- **Review via small, focused changes.** Prefer many small changes over occasional large ones — the Small-CL discipline. A change that edits one template and its eval set is reviewable in minutes; a change that rewrites the whole library is not, and it will be rubber-stamped. Small changes also make rollback and bisection trivial when something regresses.
- **Make it discoverable.** A template no one can find gets re-invented in a chat window, and the duplicate skips your evals entirely. Flat, predictable paths, descriptive names, and a short index in the conventions file beat a clever taxonomy. If your repo supports it, a quick search across `prompts/` is the discovery tool; the failure mode to avoid is a deep folder hierarchy no one remembers.
- **Name an owner per template.** Each template (or directory) has an owner in `CODEOWNERS` who reviews its changes and answers questions about it. This is the antidote to the "ask the one prompt expert" bottleneck — ownership is distributed and written down, not held in one person's head.
- **Scope access deliberately.** Read access to the library should be broad — that is the point — but write access flows through review. Platform/DevOps configures the access controls; the governance owner decides whether any template is sensitive enough to restrict.

## Review & change workflow

Every change to a prompt, eval, or conventions file moves through the same path, whether a human or an agent authored it:

1. **Requirements** — what problem this change solves and what success looks like. For anything larger than a tweak, this is where a spec earns its keep (see [Agentic Workflows](/docs/vibe-coding/agentic-workflows) on specs as the handoff for larger work).
2. **Design** — the proposed template or context change. Reviewing a *plan* is cheap; reviewing a hundred lines of wrong diff is not — the same separate-plan-from-execution discipline that governs agent sessions.
3. **Test / eval** — run the template's eval set. A change does not advance until its set passes. This gate is the QA owner's, and its mechanics are in [Testing & Optimization](/docs/best-practices/testing-prompts).
4. **Peer review** — the `CODEOWNERS` reviewer reads the change on its own terms. Keep it small (Small-CL) so review is real, not a rubber stamp.
5. **Staged rollout** — ship gradually with monitoring and a rollback path, per [Production Deployment](/docs/best-practices/production-deployment). New prompt behavior reaches a slice of traffic before all of it.
6. **Feedback** — production signals and user feedback flow back into the eval set and the next change. A regression caught in production becomes a new test case so it cannot recur silently.

### Reviewing AI-generated changes

Agents now author a large share of changes, and the temptation is to wave them through because the diff looks clean and the agent claims it works. Resist it. The discipline from [Verification & Safety](/docs/vibe-coding/verification-and-safety) and [Agentic Workflows](/docs/vibe-coding/agentic-workflows) applies directly:

- **Require evidence, not assertions.** "I fixed it" is not a passing review. Ask for the command the agent ran and the output it saw — a passing eval run, a clean build, a diff of behavior.
- **Use an independent reviewer in fresh context.** An agent reviewing its own work has already talked itself past the gaps. A separate reviewer (human, or an agent in a clean session that never saw the writer's reasoning) catches more. Scope it to correctness and stated requirements so it does not manufacture speculative polish.
- **The author's identity does not change the bar.** Human-authored and agent-authored changes pass the same gates. Lowering the bar for agent output because it is fast is exactly the failure mode of confusing vibe-coding speed with production stakes.

## Knowledge sharing & onboarding

The cheapest onboarding is the one your shared artifacts do for you. When the conventions file and library are healthy, a new member — human *or* agent — gets productive by reading them, not by interrupting a senior engineer.

- **Documentation standards.** Conventions, templates, and examples are kept current in the *same* change that alters behavior, not as a separate "update the docs" task that never happens. Stale documentation is worse than none because it actively misleads both humans and agents.
- **Onboarding a new human.** Point them at the conventions file first, then the prompt library and its examples. A good conventions file plus a self-contained spec lets a new teammate execute real work without the original design conversation — the same self-containment that lets a fresh agent session do it.
- **Onboarding a new agent.** A fresh agent session *is* a new team member with amnesia. It onboards by reading the conventions file at session start. If the agent keeps getting something wrong, the fix is usually a missing line in that file — onboarding the agent and onboarding the next human are the same edit.
- **Internal examples, including failures.** Keep a `failure-analysis` record: prompts that went wrong, what the symptom was, and the root cause. Failure analysis teaches faster than success galleries because it names the traps. Tie this to the failure-pattern catalog in [Testing & Optimization](/docs/best-practices/testing-prompts).
- **Post-incident learning.** When an AI-assisted feature misfires in production, the learning becomes durable artifacts: a new eval case so the failure cannot recur silently, and a conventions-file note so the next session avoids the trap. An incident that produces no artifact will repeat.
- **Lightweight workshops.** Short, regular sessions where people share what worked, walk through a tricky template, or review a notable failure. Keep them lightweight — the goal is circulating tacit knowledge, not building a certification program.

## Scaling without bottlenecks

Scaling a team's AI work in 2026 means parallelizing across both people *and* agents, while keeping a human accountable for each stream. The mechanisms come straight from [Agentic Workflows](/docs/vibe-coding/agentic-workflows).

- **Modular, reusable prompts.** Compose from shared, tested building blocks rather than re-authoring a monolith per task. A reusable template that already passes its evals is faster and safer than a fresh prompt in a chat window that skips every gate.
- **Parallelize across people and agents.** Independent tasks run concurrently. The enabling mechanism for agents is **git worktrees** — a separate working directory and branch per agent, so concurrent agents edit different checkouts and never collide on disk. Decompose along feature or domain boundaries: split work that touches *different* files; do **not** split work on the *same* files, which only produces merge conflicts.
- **Delegate expensive reading to subagents.** A subagent runs in its own context window and reports back only a summary — research, a survey of how a subsystem works, a first-pass review. The noise stays in the subagent; the main session and the human stay focused. This is how one person supervises several streams without drowning.
- **Avoid the single-prompt-expert bottleneck.** If only one person can change the prompts, that person is your ceiling and your single point of failure. Distributed `CODEOWNERS`, a discoverable library, and a healthy conventions file spread the capability so the team scales past any one expert.
- **Conflict resolution & escalation.** When two changes disagree about a template's direction, the template's owner decides; when a domain judgment conflicts with an engineering preference, the domain expert's call governs correctness. When the model refuses, produces something out-of-policy, or the right answer is unclear, the case follows the escalation path defined by the governance owner (see [Security & Ethics](/docs/best-practices/security-ethics)) — a dead end is a hidden failure mode.
- **Ownership when something breaks.** Every template, eval set, and AI-assisted feature has a named owner who responds when it misfires. "The agent did it" is not an owner. Tracing a production failure back to a *person* — not a model — is what makes the system improvable rather than mysterious.

:::tip Next Steps
- **[Testing & Optimization](/docs/best-practices/testing-prompts)** — build the eval sets every template and review gate depends on.
- **[Security & Ethics](/docs/best-practices/security-ethics)** — governance, the named-owner discipline, and escalation paths.
- **[Production Deployment](/docs/best-practices/production-deployment)** — staged rollout, monitoring, and rollback for prompt changes.
- **[Agentic Workflows](/docs/vibe-coding/agentic-workflows)** — worktrees, subagents, and delegation for parallel work across agents.
- **[Verification & Safety](/docs/vibe-coding/verification-and-safety)** — how to review agent-authored changes without rubber-stamping them.
- **[Vibe Coding overview](/docs/vibe-coding/overview)** · **[Claude Code](/docs/vibe-coding/claude-code)** · **[OpenAI Codex](/docs/vibe-coding/openai-codex)** — the shared `CLAUDE.md` / `AGENTS.md` conventions your team and its agents both read.
:::
