---
sidebar_position: 8
sidebar_label: Harness Engineering
---

# Harness Engineering

A language model, on its own, produces text. To make it an *agent* that reads a codebase, runs a test, reads the failure, and tries again, you wrap it in scaffolding: a control loop, a set of tools, some memory, and a policy that decides what happens next. Practitioners have started calling that scaffolding the **harness**, and the craft of designing it **harness engineering**. This doc is the capstone of the chapter. It steps back from any one tool and asks what the wrapper around the model actually is, why it matters as much as the model, and what the research literature does and does not establish about building it well.

One caveat up front, because it governs everything below. "Harness engineering" and "agent harness" are **industry terms, not established academic ones**. You will not find a field by that name in the literature. The *concept* it points at, though, is well grounded: the academic work on agent architectures frames an agent as an **LLM controller plus modular components** for memory, planning, and action. We use the industry word because it is what people say, and we anchor every claim to the peer-reviewed work on those components.

## What a harness is (and what it isn't)

The cleanest academic framing comes from CoALA (Cognitive Architectures for Language Agents, Sumers et al., TMLR 2024), which describes a language agent as a controller (the LLM) coordinating **modular components**: memory, a set of actions, and a decision procedure that loops. The agent surveys reach the same decomposition from a different angle. Wang et al.'s *Survey on Large Language Model based Autonomous Agents* (Frontiers of Computer Science, 2024) organizes the design space into **profile, memory, planning, and action** modules. Whatever vocabulary you prefer, a harness is the assembly of four things around the model:

- a **control loop** that repeatedly calls the model and acts on its output;
- a set of **tools** the model can invoke (functions, a shell, a browser, a retriever);
- **memory** that carries state across steps and across sessions;
- a **control policy** that decides when to plan, when to act, when to stop, and what to put in front of the model next.

The model supplies reasoning. The harness supplies everything else: what the model can see, what it can do, and what counts as progress. ReAct (Yao et al., ICLR 2023) is the minimal instance of the loop. The model interleaves a reasoning trace with actions, and observations from those actions feed back into the next step. SWE-agent (Yang et al., 2024) is a richer instance specialized for software: it shows that the **agent-computer interface**, the exact shape of the commands and feedback the model is given, is itself a design surface, not an afterthought.

A harness is therefore *not* a prompt, and *not* the model. It is the engineered system in between. For the practitioner's view of running this loop day to day (plan, delegate, verify), see [Agentic Workflows](/docs/vibe-coding/agentic-workflows). This doc is the conceptual layer underneath it.

## Why the harness is a first-order variable

The central claim of harness engineering is that **the scaffold is a first-order variable, not a wrapper detail**. Hold the base model fixed and change the harness, and you change both what the agent can do and what it costs. SWE-agent makes this concrete: the same underlying model, given a purpose-built agent-computer interface, solves substantially more real software issues than the same model driven naively. The harness, not a model swap, produced the gain.

We state that finding **directionally and qualitatively**, and deliberately stop there. Vendor blog posts circulate dramatic before-and-after percentages for "same model, different scaffold." Those specific swing figures are **not academically corroborated**, so this doc does not quote any of them. What *is* corroborated is the shape of the claim: scaffolding meaningfully moves capability, and it does so at a cost that has to be counted.

Counting that cost flips a naive intuition. *AI Agents That Matter* (Kapoor et al., 2024) shows that when you plot accuracy against dollars, **simple baselines can Pareto-dominate elaborate agent architectures**: the fancy scaffold is sometimes both more expensive and no more accurate. The Holistic Agent Leaderboard (HAL, Kapoor et al., 2025) generalizes this into a cost-controlled, multi-benchmark evaluation, and tau-bench (Yao et al., 2024) reinforces it for tool-using agents in realistic settings. The lesson is not "scaffolding doesn't matter." It is that scaffolding is a real engineering lever whose benefit must be measured against its price, not assumed.

## The control loop

The beating heart of any harness is the reason-act-observe loop.

```text
        +-----------------------------+
        v                             |
   [ Reason ] --> [ Act (tool) ] --> [ Observe ]
        ^                             |
        |        (stop?) <-----------+
        |           |
     (continue)   [ Done ]
```

ReAct names this pattern: the model produces a thought, chooses an action, and the action's result becomes the next observation, repeating until the task is done. The action vocabulary is where harnesses diverge. **Tool and function calling** lets the model reach outside its own weights. Toolformer (Schick et al., 2023) showed a model can learn when and how to call external tools (a calculator, a search API) and benefit from doing so. HuggingGPT (Shen et al., NeurIPS 2023) pushes the idea further, using the LLM as a controller that **plans, dispatches subtasks to specialist models, and composes their outputs**.

Plain reaction is the simplest control policy, but not the only one. Treat the loop as **deliberate search** and richer policies open up. Tree of Thoughts (Yao et al., NeurIPS 2023) generalizes the single reasoning chain into a tree the agent can explore, branch, evaluate, and backtrack over, trading more computation for better solutions on problems where one greedy pass fails. The control policy, in other words, ranges from "react once per step" to "search a space of plans," and choosing where on that spectrum to sit is a core harness decision.

## Verification and reflection loops, and their limits

If the loop can act, it can also check itself. A family of techniques closes a feedback loop *inside* the harness. Self-Consistency (Wang et al., ICLR 2023) samples multiple reasoning paths and takes a majority vote, trading compute for reliability. Self-Refine (Madaan et al., NeurIPS 2023) has the model critique and revise its own output across iterations. Reflexion (Shinn et al., NeurIPS 2023) adds verbal self-reflection on feedback signals, keeping the reflection in memory so later attempts improve. Used well, these measurably help.

There is a crucial caveat, and it is the most important sentence in this section. Huang et al. (*Large Language Models Cannot Self-Correct Reasoning Yet*, ICLR 2024) find that **intrinsic self-correction, revising reasoning with no external or grounded feedback, often fails and can even degrade results**. The model lacks a reliable internal signal for *whether its own reasoning is wrong*, so asking it to "check your work" in a vacuum can make things worse, not better. The reflection loops that hold up are the ones grounded in **external signal**: a test result, a compiler error, a tool's actual output. Reflexion's gains lean on real feedback, not introspection alone.

The design takeaway is sharp. A verification loop is only as good as the **grounded signal** it consumes. Build the loop around something the world can falsify, not around the model's confidence in itself. That is exactly the discipline the [Verification and Safety](/docs/vibe-coding/verification-and-safety) doc develops for practice: require machine-checkable evidence, not the agent's own say-so.

## Context and memory management

The model's context window is the harness's working memory, and it does not behave like a uniform buffer. Liu et al. (*Lost in the Middle*, TACL 2024) document that **performance degrades when relevant information sits in the middle of a long context**: models attend best to the beginning and end, and utilization of the middle drops. So a long context is not automatically a well-used one. Simply stuffing more in can hurt.

Two responses follow, and they are complementary. The first is **retrieval**: rather than holding everything, fetch the relevant slice on demand. Retrieval-Augmented Generation (Lewis et al., NeurIPS 2020) established the pattern of grounding generation in retrieved documents, and it remains the backbone of giving an agent access to more knowledge than fits in the window. The second is **structured, OS-style memory**. MemGPT (Packer et al., 2023) treats the context window like RAM and pages information in and out of larger external stores, so the agent manages its own memory hierarchy. A-MEM (Xu et al., NeurIPS 2025) explores agentic memory that organizes and links what the agent has learned over time. CoALA ties this together by treating memory as a first-class module of the architecture rather than an accident of the prompt.

The unifying principle is **minimal sufficient context**: put in front of the model the smallest set of information that is genuinely necessary for the current step, and no more. That is a harness-design goal, realized through retrieval and memory management, and it is the conceptual root of the practical advice in [Context Engineering](/docs/vibe-coding/context-engineering) about curating what fills the window.

## Evaluation harnesses

Agents are judged by **execution-grounded benchmarks**: not "did the answer look right" but "did running it actually work." An evaluation harness sets up an environment, lets the agent act in it, and grades the result against ground truth. The headline finding across these benchmarks is sobering. **Frontier agents remain far below human or ceiling performance on realistic tasks.** The verified numbers:

- **SWE-bench** (Jimenez et al., ICLR 2024) tasks agents with resolving real GitHub issues. In the original paper, the best **bare model resolved about 1.96%** of issues, a vivid illustration of how far an unscaffolded model is from doing real software work.
- **WebArena** (Zhou et al., 2024) puts agents in realistic web environments. The best **GPT-4 agent reached 14.41%** end-to-end task success, against a **human rate of 78.24%**.
- **GAIA** (Mialon et al., 2023) poses assistant questions that are easy for people and hard for systems. **Humans scored about 92%**; **GPT-4 with plugins scored roughly 15%**.
- **tau-bench** (Yao et al., 2024) evaluates tool-using agents in dynamic customer-service settings. **State-of-the-art function-calling agents scored under 50%**, and reliability under repetition is worse still: **pass^8 fell below 25% on the retail domain** (see the next sections on `pass^k` and long-horizon decay).

AgentBench (Liu et al., ICLR 2024) corroborates the pattern across a broad multi-environment suite, and HAL (Kapoor et al., 2025) aggregates many such benchmarks under cost control. The consistent message: the gap between demo and dependable is large, and the evaluation harness is how you keep yourself honest about it.

## Reliability, reproducibility, and a skeptic's checklist

Benchmark numbers are only as trustworthy as the methodology that produced them, and a growing line of work argues that agent evaluation has been **systematically too generous**. *AI Agents That Matter* (Kapoor et al., 2024) identifies recurring problems: **cost-blind comparisons** that report accuracy while ignoring dollars and tokens, and a focus on a single best run rather than reliability. *Establishing Best Practices for Rigorous Agentic Benchmarks* (Zhu et al., 2025) catalogs **validity flaws** in widely-used benchmarks, from task construction to grading. SWE-rebench (2025) tackles **data contamination**: when evaluation tasks predate the model's training cut-off, the model may have seen the answer, so scores are inflated by leakage rather than capability.

Distilled into a checklist you can apply to any agent claim:

- **Was cost controlled?** An accuracy number without its dollar and token cost is half a result; demand the Pareto view (Kapoor et al., 2024; HAL, 2025).
- **Could the data have leaked?** Check whether tasks postdate the training cut-off; prefer continuously refreshed sets (SWE-rebench, 2025).
- **Is the result reproducible despite non-determinism?** Sampling makes a single run a coin flip; a claim that rests on one lucky pass is not a finding.
- **Is the benchmark valid?** Confirm the tasks measure what they claim and the grader is sound (Zhu et al., 2025).
- **Reliability over peak.** Prefer **`pass^k`** (succeeds on all `k` independent attempts) over **`pass@1`** (succeeds at least once). tau-bench's collapsing `pass^8` shows why: a number that looks fine once can be unreliable under repetition.

The throughline is that a harness is not "good" because it topped a leaderboard once. It is good when its results survive cost accounting, contamination checks, and repeated runs.

## Failure modes over long horizons

The benchmark gaps above have a structural cause: **errors compound over a long horizon**. Each step in the loop carries some probability of going wrong, and across many steps those probabilities cascade, so end-to-end reliability decays as tasks get longer. tau-bench makes this measurable through the `pass^k` collapse: an agent that usually succeeds on a single attempt becomes unreliable when it must succeed repeatedly, because independent chances to err accumulate. *Lost in the Middle* contributes a related decay: as the running context grows across a long task, the agent's ability to use the middle of it degrades, so later steps reason over a context it is using poorly.

Multi-agent systems do not escape this; they add new ways to fail. MAST (*Why Do Multi-Agent LLM Systems Fail?*, Cemri et al., 2025) builds a **taxonomy of multi-agent failure modes**, spanning specification and coordination problems, inter-agent misalignment, and verification gaps. More agents means more handoffs, and each handoff is another surface where context is dropped or misread. And underlying all of it is the Huang et al. (2024) result: because the agents cannot reliably self-correct from introspection alone, an early error is not automatically caught later in the chain. It propagates.

The practical implication is to treat **horizon length as a risk axis**. The longer and more multi-agent the workflow, the more it needs grounded checkpoints, bounded scope, and external verification, precisely because reliability does not hold up on its own.

## Design principles

The literature points to a consistent set of harness-design principles. None is exotic; together they describe a scaffold that works *with* the model's limits instead of against them.

- **Decompose explicitly.** Break a task into stated subgoals rather than asking for one giant leap. Plan-and-Solve (Wang et al., ACL 2023), Least-to-Most (Zhou et al., ICLR 2023), and Decomposed Prompting (Khot et al., ICLR 2023) all show structured decomposition outperforming an undifferentiated single pass.
- **Ground every verification loop.** Build self-checking around external signal (a test, a compiler, a tool result), never introspection alone, per Huang et al. (2024). Reflexion-style loops earn their gains from real feedback.
- **Bound autonomy and use deliberate search where it pays.** Tree of Thoughts (2023) shows search beats greedy reaction on hard problems, but search costs compute, so spend it deliberately and cap how far the agent runs unattended.
- **Engineer the tool and agent interface.** SWE-agent (2024) and HuggingGPT (2023) demonstrate that the shape of the commands and feedback, the agent-computer interface, is a primary lever, not packaging.
- **Keep context minimal and sufficient.** Following *Lost in the Middle* (2024), supply the smallest necessary slice; more context is not more capability.
- **Prefer cost-bounded simplicity.** Reach for the simplest scaffold that meets the bar, and add complexity only when it pays for itself under cost accounting (*AI Agents That Matter*, 2024). Simple baselines often win.

## What is NOT established

:::warning Don't over-claim
Be precise about what this doc does and does not assert.

- **"Harness engineering" is an industry term, not an academic field.** There is no peer-reviewed discipline by that name. The grounded concept is the **LLM-controller-plus-modular-components** architecture (CoALA; the agent surveys). Use the word freely, but do not present it as established terminology.
- **The viral "scaffold swing" percentages are excluded.** Specific same-model, different-scaffold percentage jumps circulate in **vendor blogs only** and are not academically corroborated. This doc makes the **directional** claim (scaffolding is a first-order variable) and quotes no swing figure.
- **No single mechanistic cause of "lost in the middle" is asserted here.** *Lost in the Middle* documents the **positional degradation effect**; this doc reports that effect, not a definitive mechanism behind it.
- **Benchmark numbers are point-in-time.** The figures cited (SWE-bench, WebArena, GAIA, tau-bench) come from the cited papers and reflect their snapshots; treat them as illustrative of the gap, not as today's frontier.
:::

:::tip Next steps
This doc is the conceptual capstone of the chapter. To put it into practice:

- [Agentic Workflows](/docs/vibe-coding/agentic-workflows) — running the loop day to day: plan, delegate, verify, parallelize.
- [Context Engineering](/docs/vibe-coding/context-engineering) — curating what fills the window, the practical face of minimal-sufficient context.
- [Verification and Safety](/docs/vibe-coding/verification-and-safety) — grounded verification gates and the discipline that makes autonomy safe.
:::

## Key references

- **CoALA** — Sumers, Yao, Narasimhan, Griffiths. "Cognitive Architectures for Language Agents." TMLR, 2024. arXiv:2309.02427
- **ReAct** — Yao et al. "ReAct: Synergizing Reasoning and Acting in Language Models." ICLR, 2023. arXiv:2210.03629
- **Agent survey** — Wang et al. "A Survey on Large Language Model based Autonomous Agents." Frontiers of Computer Science, 2024. arXiv:2308.11432
- **SWE-agent** — Yang et al. "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering." 2024. arXiv:2405.15793
- **Toolformer** — Schick et al. "Toolformer: Language Models Can Teach Themselves to Use Tools." 2023. arXiv:2302.04761
- **HuggingGPT** — Shen et al. "HuggingGPT: Solving AI Tasks with ChatGPT and its Friends in Hugging Face." NeurIPS, 2023. arXiv:2303.17580
- **Tree of Thoughts** — Yao et al. "Tree of Thoughts: Deliberate Problem Solving with Large Language Models." NeurIPS, 2023. arXiv:2305.10601
- **Plan-and-Solve** — Wang et al. "Plan-and-Solve Prompting." ACL, 2023. arXiv:2305.04091
- **Least-to-Most** — Zhou et al. "Least-to-Most Prompting Enables Complex Reasoning in Large Language Models." ICLR, 2023. arXiv:2205.10625
- **Decomposed Prompting** — Khot et al. "Decomposed Prompting: A Modular Approach for Solving Complex Tasks." ICLR, 2023. arXiv:2210.02406
- **Reflexion** — Shinn et al. "Reflexion: Language Agents with Verbal Reinforcement Learning." NeurIPS, 2023. arXiv:2303.11366
- **Self-Refine** — Madaan et al. "Self-Refine: Iterative Refinement with Self-Feedback." NeurIPS, 2023. arXiv:2303.17651
- **Self-Consistency** — Wang et al. "Self-Consistency Improves Chain of Thought Reasoning in Language Models." ICLR, 2023. arXiv:2203.11171
- **LLMs Cannot Self-Correct Reasoning Yet** — Huang et al. ICLR, 2024. arXiv:2310.01798
- **Lost in the Middle** — Liu et al. "Lost in the Middle: How Language Models Use Long Contexts." TACL, 2024. arXiv:2307.03172
- **RAG** — Lewis et al. "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." NeurIPS, 2020. arXiv:2005.11401
- **MemGPT** — Packer et al. "MemGPT: Towards LLMs as Operating Systems." 2023. arXiv:2310.08560
- **A-MEM** — Xu et al. "A-MEM: Agentic Memory for LLM Agents." NeurIPS, 2025. arXiv:2502.12110
- **Voyager** — Wang et al. "Voyager: An Open-Ended Embodied Agent with Large Language Models." 2023. arXiv:2305.16291
- **SWE-bench** — Jimenez et al. "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" ICLR, 2024. arXiv:2310.06770
- **AgentBench** — Liu et al. "AgentBench: Evaluating LLMs as Agents." ICLR, 2024. arXiv:2308.03688
- **WebArena** — Zhou et al. "WebArena: A Realistic Web Environment for Building Autonomous Agents." 2024. arXiv:2307.13854
- **GAIA** — Mialon et al. "GAIA: A Benchmark for General AI Assistants." 2023. arXiv:2311.12983
- **tau-bench** — Yao et al. "tau-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains." 2024. arXiv:2406.12045
- **AI Agents That Matter** — Kapoor et al. 2024. arXiv:2407.01502
- **Rigorous Agentic Benchmarks** — Zhu et al. "Establishing Best Practices for Building Rigorous Agentic Benchmarks." 2025. arXiv:2507.02825
- **Holistic Agent Leaderboard (HAL)** — Kapoor et al. 2025. arXiv:2510.11977
- **MAST** — Cemri et al. "Why Do Multi-Agent LLM Systems Fail?" 2025. arXiv:2503.13657
- **SWE-rebench** — "SWE-rebench: An Automated Pipeline for Task Collection and Decontaminated Evaluation of Software Engineering Agents." 2025. arXiv:2505.20411
