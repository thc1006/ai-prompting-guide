---
sidebar_position: 6
---

# Spec-Driven Development: When the Spec Is the Source of Truth

Spec-driven development (SDD) inverts a long-standing default. Instead of treating source code as the authoritative description of a system and prose as disposable documentation, SDD makes a structured natural-language specification the primary artifact: code is *generated* — and regenerated — from it. GitHub frames the shift bluntly as moving from "code as the source of truth" to "intent as the source of truth." This doc is about the spec artifact and the methodology around it. For the session mechanics of handing a spec to an agent, see [Agentic Workflows](/docs/vibe-coding/agentic-workflows); for the test-as-gate machinery, see [Verification and Safety](/docs/vibe-coding/verification-and-safety).

## Why SDD emerged in 2025

SDD is, in large part, a reaction to the limits of [vibe coding](/docs/vibe-coding/overview). Conversational, improvisational coding is excellent for exploration but unreliable for production: the "spec" lives only in a chat transcript, intent drifts, and nobody can reconstruct *why* the code looks the way it does. Two enabling changes made a more disciplined approach practical in 2025:

- **Larger context windows**, so a complete specification plus the relevant code can sit in a single session.
- **Agents that separate planning from implementation**, so a plan can be reviewed and frozen before any edits land.

Place this on the spectrum from the overview: **vibe-code to explore, spec-drive to ship.** The two are not rivals so much as different points on a continuum of how much structure a task warrants.

## When to use SDD vs. vibe coding

The decision is mostly about lifespan and stakes, not difficulty.

- **Reach for SDD** when the system is production-bound, will be **maintained** over time, involves **multiple stakeholders** who must agree on behavior, or is **compliance-bound** and needs an auditable record of intent.
- **Reach for vibe coding** when the artifact is a throwaway: a prototype, a spike, a one-off script, or an experiment you expect to delete.

A useful heuristic: if you would be uncomfortable explaining the code's behavior to someone six months from now without the original chat open, you probably wanted a spec.

## The toolkits (as of 2026-06)

The tooling is young and moving fast. Treat everything below as a point-in-time snapshot; capabilities and packaging change frequently.

| Tool | What it is | Workflow shape | Notes (as of 2026-06) |
| --- | --- | --- | --- |
| **GitHub Spec Kit** | Open-source toolkit, open-sourced 2025-09-02 | `Specify` -> `Plan` -> `Tasks` -> `Implement` | Designed to work across many coding agents rather than one IDE. |
| **AWS Kiro** | Agentic IDE; entered public preview around mid-2025 | `spec` -> `design` -> `tasks` | Uses EARS-style requirements notation for acceptance criteria. |
| **Tessl** | Pursues "spec-as-source" | Spec drives generated code | Was in private beta. |

Exact version numbers are intentionally omitted; check each project directly, since they shift between releases.

## Rigor levels: how strictly the spec governs

Martin Fowler's team has written about SDD as a spectrum rather than a single practice. A practical way to read that spectrum is by how much authority the spec holds:

- **Spec-first** — the spec kicks off the work, then code takes over as the thing you maintain. The spec is a launch document.
- **Spec-anchored** — the spec is kept in sync with the code as a living reference, consulted and updated, but the code is still edited directly.
- **Spec-as-source** — the spec is the sole source of truth; code is a regenerated artifact you do not hand-edit.

Most teams in 2026 operate somewhere in the first two bands; the third is the most ambitious and the least settled.

## The contested question: spec or code?

The central, genuinely unsettled debate is which artifact is the *real* source of truth.

**The radical view:** the spec is the sole source of truth and code is disposable. You change the spec and regenerate; editing generated code by hand is an anti-pattern, the way hand-editing compiler output would be. This is the spec-as-source position, and it promises that intent never drifts from implementation because there is only one authored artifact.

**The moderate view:** executable code remains the maintainable source of truth. A spec is enormously valuable for *driving* generation and for capturing acceptance criteria — TDD-style — but code is what runs, what is reviewed, and what the team ultimately owns. Regenerating an entire system from prose is, on this view, too lossy and too unpredictable to trust as the only artifact.

Both positions have serious proponents, and as of 2026 the question is unresolved. The honest stance for a team adopting SDD is to decide *for a given project* how far up the rigor spectrum to go, rather than assuming the industry has converged. This guide does not pick a winner.

## How to write a good spec

This is the practical core, and it is mostly independent of which toolkit you use. A good spec is **executable by a fresh agent** with no access to your earlier conversation. Make it concrete:

- **Name the files and interfaces** to create or change. "Add validation" is a wish; "add a `validate(payload)` function to `src/auth/schema.ts`" is a spec.
- **State acceptance criteria** in checkable terms — inputs, expected outputs, error behavior.
- **State what is explicitly out of scope**, so the agent does not wander into adjacent refactors.
- **Include an end-to-end verification step** the agent can run to prove the work (a command, a test, an observable outcome).
- **Keep it self-contained.** Assume the reader has the repository and nothing else — no chat history, no tribal knowledge.

A minimal skeleton:

```markdown
# SPEC: Add rate limiting to the login endpoint

## Goal
Reject more than 5 failed login attempts per IP per minute with HTTP 429.

## Files to change
- `src/api/login.ts` — apply the limiter to the POST handler
- `src/middleware/rate-limit.ts` — new sliding-window limiter
- `test/login.rate-limit.test.ts` — new tests

## Acceptance criteria
- 6th failed attempt within 60s from one IP returns 429
- Successful logins are never rate-limited
- Limit state is per-IP, not global

## Out of scope
- Distributed/multi-node limit state (single instance only for now)
- CAPTCHA or account lockout

## Verification
Run `npm test test/login.rate-limit.test.ts`; all cases pass.
```

Notice that everything in **Acceptance criteria** can be read straight across into test cases.

## Relation to TDD

That overlap is not accidental. A spec's acceptance criteria are naturally expressed as tests: each checkable claim becomes an assertion, and "verification passes" becomes the gate that says the implementation matches intent. This is where SDD and test-driven development meet — the spec authors the tests' *intent*, and the tests make the spec *executable*. For how to wire tests as the gate an agent must pass before a change is accepted — and the failure modes to watch for — see [Verification and Safety](/docs/vibe-coding/verification-and-safety).

:::tip Where to go next
Start with the [Vibe Coding overview](/docs/vibe-coding/overview) to place SDD on the explore-to-ship spectrum. Use [Agentic Workflows](/docs/vibe-coding/agentic-workflows) for the interview-to-handoff session mechanics, and [Verification and Safety](/docs/vibe-coding/verification-and-safety) for turning acceptance criteria into enforceable test gates.
:::
