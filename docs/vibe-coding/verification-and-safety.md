---
sidebar_position: 7
sidebar_label: "Verification & Safety"
---

# Verification, Safety & Engineering Discipline

An agent will report success whether or not it actually succeeded. It will say "Done — all tests pass" with the same confidence whether the tests passed, the tests were never run, or the tests were quietly weakened until they did. Trust in agent output is not a property you assume; it is a property you earn through verification. This doc is the guardrail layer for the whole chapter — the discipline that makes the [agentic loop](/docs/vibe-coding/agentic-workflows) and [spec-driven development](/docs/vibe-coding/spec-driven-development) safe to run at speed.

It deliberately goes deep where the workflow docs deferred. It does not re-explain the agentic loop or what belongs in a context file; it explains how to make agent output *trustworthy* and how to keep AI-assisted change *disciplined*.

## Tests are the verification backbone

The most reliable way to make a claim of success checkable is to make it executable. Test-driven development gives you exactly that.

### Red, Green, Refactor

The canonical TDD cycle, formalized in Kent Beck's *Test-Driven Development: By Example* (2002), has three steps:

- **Red** — write a small test for behavior that does not exist yet, and watch it fail.
- **Green** — write the minimum production code that makes the test pass.
- **Refactor** — clean up the code now that a passing test pins the behavior.

Robert C. Martin ("Uncle Bob") sharpened this into the **Three Laws of TDD**:

1. Write no production code until you have written a failing test.
2. Write no more of a test than is sufficient to fail.
3. Write no more production code than is sufficient to pass the failing test.

The payoff is twofold. A test written *before* the code is an **executable specification**: it states what "correct" means in a form the machine can check. The same test, kept around, is a **regression safety net**: it fails the moment a later change breaks the behavior. That double role is exactly what an agent needs to grade itself.

## Applying TDD to agentic coding

For an autonomous agent, tests, build, and lint are not chores — they are the **verification gate**. They are a machine-checkable pass/fail signal that lets the agent close its own loop without a human in the inner cycle. No gate, no trust.

### Reproduce, then fix

When fixing a bug, instruct the agent to first write a **failing test that reproduces** the bug, then change code until that test passes. This forces the fix to address the root cause rather than suppress the symptom. An agent left to its own devices will often wrap the failing call in a `try`/`except`, swallow the error, and declare victory. A reproduction test makes that shortcut impossible: the test still fails until the underlying behavior is actually correct.

### Tests as a committed spec

Use the test-first cycle as a contract the agent cannot quietly renegotiate:

1. Write the tests first — or have the agent write them — describing the desired behavior.
2. Run them and **confirm they fail** for the right reason.
3. **Commit the tests** as their own change.
4. Implement until they pass, and instruct the agent **not to modify the committed tests**.

If the agent weakens a test to force a green run — loosens an assertion, deletes a case, adds an early `return` — the diff exposes it. A test change that arrives in the same commit as the implementation is a red flag worth reviewing line by line.

### Require evidence, not assertions

"All tests pass" is an assertion. The command and its output are evidence. Require the agent to show the command it ran and the actual result, not a summary of it:

```bash
$ pytest -q tests/test_auth.py
....                                            [100%]
4 passed in 0.62s
```

A claim with no attached output is unverified by definition. Make pasted evidence the norm, and treat its absence as a failing gate.

### Let an independent checker certify

The agent that wrote the change should not be the one that certifies it. Whatever blind spot produced a bug tends to produce the same blind spot when reviewing for it. Route certification through an **independent check**: a fresh-context reviewer with no memory of the implementation rationalizations, or — more reliably — CI that re-runs the gate from a clean checkout. The independent check does not need to be smarter; it needs to be *separate*.

### The gate for docs and static sites

This handbook is a Docusaurus site, not an application, but the principle is identical — only the "tests" change. Define the gate first, then implement to green:

- the **build passes** (`npm run build` with no errors);
- **link checks** find no broken internal or external links;
- **i18n parity** holds — every English doc has its translation counterpart and no orphaned keys;
- **lint and format** pass (Markdown lint, Prettier);
- **performance budgets** are met (for example, a Lighthouse threshold).

Decide which of these must be green *before* writing the doc, and the static site gets the same earned trust as a tested codebase. See [code generation](/docs/tutorials/code-generation) for setting these up in practice.

## Safety for autonomous agents

An agent that can edit files and run commands can also delete files and exfiltrate secrets. Verification proves the work is *correct*; safety controls bound what the agent can *do* while getting there.

### Permissions and sandboxing

Constrain capability to the task:

- **Restrict the filesystem** — scope the agent to the working directory; keep it away from home directories, credentials, and system paths.
- **Restrict the network** — default to no outbound access unless a step genuinely needs it.
- **Use approval modes** — require human confirmation before destructive or irreversible actions; let routine read and edit operations run freely.
- **Reserve full-access, no-approval modes for isolated, throwaway environments** — a disposable container or VM where the blast radius is bounded and nothing of value can leak.

The tool-specific controls live in the [Claude Code](/docs/vibe-coding/claude-code) and [OpenAI Codex](/docs/vibe-coding/openai-codex) guides; apply the same principle of least privilege whichever you use.

### Reviewing AI-generated code for security

Generated code needs a security pass, not just a correctness pass. At minimum check for:

- **no hardcoded secrets** — keys, tokens, and passwords belong in configuration or a secret manager, never in source;
- **input validation** — untrusted input is checked before use, not assumed well-formed;
- **no unsafe handling** — no unsanitized shell or SQL string-building, no unvalidated deserialization, no swallowed errors that hide failures.

This complements the [security and ethics best practices](/docs/best-practices/security-ethics) doc — treat that as the deeper reference and this list as the per-change gate.

## Avoiding over-generation and premature abstraction

Left unguided, LLMs over-engineer. They emit extra files, speculative abstractions, defensive checks for conditions that cannot occur, and configurable flexibility nobody asked for. This is one of the most common failure modes of AI-assisted coding, and it is corrosive precisely because each addition looks reasonable in isolation.

The countering principles are old and well-named:

- **YAGNI** ("You Aren't Gonna Need It", popularized by Martin Fowler and Extreme Programming) — do not build for hypothetical future requirements.
- **The Rule of Three** (Fowler and Don Roberts) — tolerate duplication twice; refactor into an abstraction only on the **third** occurrence, when the shared shape is actually visible.
- **AHA** ("Avoid Hasty Abstractions", Kent C. Dodds) — prefer the duplication you understand to the abstraction you are guessing at.
- Sandi Metz's rule of thumb — **"duplication is far cheaper than the wrong abstraction"**; a wrong abstraction is expensive to unwind, whereas duplication is cheap to consolidate later.

Translate these into guardrails the agent receives up front:

- Ask for the **smallest change** that satisfies the requirement — nothing speculative.
- **Defer abstraction** until duplication is proven by the Rule of Three.
- **State the system's invariants** so the agent stops adding redundant defensive code for cases that cannot arise.
- **Scope reviewers** narrowly: "flag only gaps that affect correctness or stated requirements," so review does not itself become a source of gold-plating.

## Keeping changes small and clean

Small, well-scoped changes are easier to verify, and verifiability is the whole point.

### Small CLs, small PRs

Google's engineering practices argue for **small changelists**: one self-contained change that does a single thing. Small changes are reviewed faster and more thoroughly, are easier to reason about, and are safer to roll back. As a rough guide, a change around a hundred lines is comfortable to review well; one approaching a thousand is usually too large to review carefully. The directional finding is robust even without precise numbers: smaller diffs get better review attention, and large diffs catch fewer bugs per line. When work is genuinely large, split it into **stacked, independently-verifiable changes**, each passing the gate on its own.

### The Boy Scout Rule

Robert C. Martin's **Boy Scout Rule** — "leave the code a little cleaner than you found it" — licenses small, opportunistic cleanups in the files you are already touching: a clearer name, a removed dead branch, a fixed typo. The discipline is in the boundary: cleanups stay **confined to the touched scope** and never spill into unrequested refactors.

### How they compose

These practices reinforce each other:

- TDD's **refactor step** is where Boy-Scout cleanup belongs — the passing tests pin behavior, so cleanup is safe.
- Each unit of work is a **small CL gated by the tests**, verifiable on its own.
- The guardrail is that cleanups and additions **stay inside the touched scope** — they never balloon into unrequested refactors or the over-generated code from the previous section.

The agent moves fast inside a small, gated, scoped box. Speed is fine; an unbounded blast radius is not.

## Verification checklist

Before accepting agent work, confirm all of the following:

- [ ] **Tests pass with evidence** — the command and its real output are shown, not summarized.
- [ ] **The diff is minimal and in-scope** — no new files, abstractions, or defenses beyond the requirement.
- [ ] **No new secrets** — nothing hardcoded; input is validated; no unsafe handling.
- [ ] **An independent check ran** — fresh-context review or CI from a clean checkout, not the implementing agent's own say-so.
- [ ] **The change is one self-contained CL** — single purpose, reviewable, safely revertible.

If any box is unchecked, the work is not done — it is unverified, which is not the same thing.

:::tip Where this fits in the chapter
This doc is the guardrail layer for the rest of the chapter. Pair it with the [Vibe Coding overview](/docs/vibe-coding/overview) for the decision model, [spec-driven development](/docs/vibe-coding/spec-driven-development) for turning intent into a checkable spec, and [agentic workflows](/docs/vibe-coding/agentic-workflows) for the loop these gates protect.
:::
