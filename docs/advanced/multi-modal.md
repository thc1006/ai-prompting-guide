---
sidebar_position: 3
---

# Multi-Modal Prompting

Multi-modal prompting means prompting a model with more than plain text — images, audio, video, or documents — and getting back text or structured output. The same prompting discipline you learned for text still applies: be specific, give context, and ask for a defined output format. The new variable is that part of your input is now a picture, a sound, or a page scan.

This matters in 2026 because most real work is not text-only. A bug shows up as a screenshot. A spec arrives as a PDF. A design lands as a Figma export. A receipt needs to become a row in a spreadsheet. Multi-modal models let you point at the artifact directly instead of transcribing it by hand first.

:::note Capabilities change fast
As of 2026-06, the major frontier models (Anthropic Claude, OpenAI GPT, Google Gemini) all accept image input, and several accept audio and video as well. Exact limits — file sizes, resolution caps, supported formats, how many images per request — vary by model and change over time. Check the current model documentation before you rely on a specific limit. This page focuses on prompting technique, which is durable, rather than on numbers, which are not.
:::

## Image Input: The Workhorse

Image understanding is the most mature and widely available multi-modal capability, so it deserves the most attention. The pattern across every task below is the same: **say what you want, point at the region that matters, and request a structured output format**. Vague image prompts produce vague answers, exactly as they do with text.

### Describe and Caption

The simplest task. Useful for alt text, content moderation triage, and cataloging.

```text
Write a one-sentence alt-text caption for this image, suitable for a
screen reader. Be factual and concise. Do not speculate about anything
not visibly present.
```

For richer descriptions, ask for structure instead of a paragraph:

```text
Describe this image as JSON with these fields:
- "subject": the main subject in 3-6 words
- "setting": where the scene takes place
- "objects": array of notable objects
- "mood": one of ["neutral", "positive", "negative"]
Return only valid JSON.
```

### Visual Question Answering

Ask a single, concrete question about the image rather than "tell me about this."

```text
Looking only at this photo of a parking sign: on which days and times
is parking NOT permitted? If the sign is partially obscured or ambiguous,
say so explicitly rather than guessing.
```

:::tip One clear question beats five vague ones
Models answer focused questions far more reliably than open-ended ones. If you have several questions, either ask them as a numbered list with a clear output slot for each, or send separate requests.
:::

### Extract Structured Data from Charts, Tables, and Receipts

This is one of the highest-value image tasks. Always specify the exact schema you want so the output is machine-usable.

```text
This image is a receipt. Extract the line items into JSON:
{
  "merchant": string,
  "date": "YYYY-MM-DD" or null if not visible,
  "items": [{ "name": string, "qty": number, "unit_price": number }],
  "subtotal": number,
  "tax": number,
  "total": number
}
Use null for any field you cannot read. Do not invent values.
Return only the JSON object.
```

For a chart, name the axes and the unit so the model reads the right numbers:

```text
This is a bar chart of monthly revenue. The x-axis is month (Jan-Dec)
and the y-axis is revenue in thousands. Return a JSON array of
{ "month": string, "revenue_k": number } for every bar you can read.
If a bar's value sits between gridlines, estimate and add
"approx": true for that entry.
```

### OCR: Read Text from an Image

When you need the literal text rather than an interpretation, ask for transcription explicitly and tell the model how to handle uncertainty.

```text
Transcribe all visible text in this image exactly as written, preserving
line breaks and original spelling. Mark any word you cannot read
confidently as [illegible]. Do not correct grammar or translate.
```

### Understand a Diagram or UI Screenshot

Diagrams and screenshots carry structure — boxes, arrows, layout — not just pixels. Tell the model what kind of artifact it is so it reads the relationships.

```text
This is an architecture diagram. List each component (box) and, for every
arrow, state the direction and what it represents (e.g. "API Gateway ->
Auth Service: validates token"). Then flag any component that has no
incoming or outgoing connections.
```

For a UI screenshot, anchor the model to a region:

```text
This is a screenshot of a web form. Focus on the section under the
heading "Billing Address". List every input field there, its label, and
whether it appears required (marked with an asterisk) or optional.
```

### Compare Two Images

When sending more than one image, label them in the prompt so you can refer to each unambiguously.

```text
I am sending two screenshots: the first is the design mockup, the second
is the implemented page. List every visual difference between them,
grouped by: layout/spacing, color, typography, and missing or extra
elements. Order the differences by how noticeable they are.
```

This compare pattern is the foundation of the agentic verification loop covered below.

## Audio and Video

Audio and video understanding are more capability-variable than image input — support, quality, and length limits differ a lot between models and change frequently, so verify before building on them.

**Transcription (speech-to-text)** is the most common audio task. As with OCR, be explicit about format and how to handle uncertainty:

```text
Transcribe this audio. Label each speaker as "Speaker 1", "Speaker 2",
etc. Add a timestamp [mm:ss] at the start of each speaker turn. Mark
unclear passages as [inaudible].
```

**Audio understanding** goes beyond the words — tone, summarization, intent. For example: "Summarize the key decisions and action items from this meeting recording as a bulleted list, and note who is responsible for each."

**Video** typically combines visual understanding (sampled frames) with audio. Common uses include summarizing a screen recording, describing what happens in a clip, or locating the moment an event occurs. Because frame sampling and length limits vary widely, keep clips short and state what you care about: "In this 30-second screen recording, identify the exact step where the error dialog first appears and quote its text."

## Documents

A PDF or a screenshot of a document is a multi-modal input, and treating it that way is often better than running plain-text extraction first. Layout carries meaning — columns, tables, headers, checkboxes, signatures, and figures are all lost or scrambled by naive text extraction, but a multi-modal model can read them in place.

```text
This is a 3-page scanned contract. Extract as JSON:
{
  "parties": [string],
  "effective_date": "YYYY-MM-DD" or null,
  "term_months": number or null,
  "termination_notice_days": number or null,
  "signed": boolean
}
Quote the exact clause text you used for "termination_notice_days" in a
separate "evidence" field. Return null for anything not stated.
```

Asking for an `evidence` field that quotes the source clause makes the extraction auditable — you can check the model's reading without re-reading the whole document.

## The Agentic Connection

Modern coding agents are multi-modal in practice, and this is where multi-modal prompting becomes a daily workflow rather than a party trick. You paste a screenshot of a broken UI, and the agent reads the error and fixes the code. You drop in a design mockup, and the agent implements it.

The most powerful pattern is the **screenshot verification loop**:

```text
1. Implement the attached mockup [image] as a React component.
2. Run the app and take a screenshot of the result.
3. Compare your screenshot to the original mockup and list the
   differences (spacing, color, missing elements).
4. Fix the differences and repeat until they match.
```

Here the agent uses image *output* (its own screenshot) as image *input* for the next comparison — closing the loop between intent and result the same way a human would by glancing at the screen. This is far more reliable than asking the agent to build a UI blind and hoping it looks right.

The [Vibe Coding overview](/docs/vibe-coding/overview) introduces this style of agent-driven development, and the [Claude Code field guide](/docs/vibe-coding/claude-code) covers screenshot-based verification in concrete detail.

## Best Practices

- **Send high-quality, legible images.** Crop to the relevant region, ensure text is in focus, and avoid heavy compression. A model cannot read what a human cannot read.
- **Ask one clear question per request.** Focused prompts beat open-ended ones, especially on images dense with detail.
- **Request a structured output format.** JSON with a named schema turns a description into data you can use directly.
- **Verify extracted data — do not assume the model reads tiny text perfectly.** Small fonts, low contrast, handwriting, and dense tables are error-prone. Ask for an `evidence` or `approx` field, and spot-check numbers that matter. See [Data Analysis](/docs/tutorials/data-analysis) for downstream validation.
- **Mind privacy.** Do not upload images, documents, or recordings containing sensitive personal, medical, or proprietary information to a model unless you have confirmed it is permitted and handled appropriately. Redact before sending when in doubt.
- **Watch the cost.** Image, audio, and video inputs consume substantially more tokens than equivalent text. High-resolution images and long clips add up quickly — downscale or trim to what the task actually needs.

:::tip Next Steps
Multi-modal prompting builds on the same fundamentals as text prompting — start with [What Is Prompting](/docs/fundamentals/what-is-prompting) if you want to revisit them. To go deeper:

- **[Chain-of-Thought Reasoning](/docs/advanced/chain-of-thought)** — combine step-by-step reasoning with image analysis for harder visual tasks.
- **[Prompt Chaining](/docs/advanced/prompt-chaining)** — wire multi-modal steps into a larger workflow.
- **[Vibe Coding Overview](/docs/vibe-coding/overview)** — see how agents use screenshots and mockups in real development loops.
- **[Code Generation](/docs/tutorials/code-generation)** — turn a mockup or diagram into working code.

Practice on artifacts from your own work: a chart you need as data, a screenshot you need explained, a PDF you need to parse. Multi-modal prompting pays off fastest on the manual transcription tasks you already do by hand.
:::
