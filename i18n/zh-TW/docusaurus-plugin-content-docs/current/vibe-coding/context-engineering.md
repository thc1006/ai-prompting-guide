---
sidebar_position: 4
sidebar_label: "Context Engineering"
---

# Context Engineering：CLAUDE.md、AGENTS.md 與專案記憶

Context engineering（脈絡工程）就是替每一次對話精心安排塞進模型 context window（脈絡視窗）的所有東西：常駐指令、專案慣例、撈取進來的檔案、工具輸出，還有對話歷史。Prompt engineering（提示詞工程）——也就是把單一一次請求的措辭寫好——只是這門更大學問裡的一個子集。[總覽](/docs/vibe-coding/overview)裡追溯了這個詞是怎麼出現的；而這篇要談的，是你對脈絡握有最持久的那根槓桿：你的 agent 在每次工作階段一開始就會讀進去的那份常駐指令檔。

## 為什麼專案脈絡檔是槓桿最大的那份產物

一則好的提示詞只幫得了一次對話。一份專案脈絡檔卻能幫到每一次對話。你只寫一次，agent 每個工作階段就自動載入它，而且當你換模型、升級模型時，它還會持續發揮效益——這種被版本控制管著、能流傳下來的意圖，活得比大家累積又遺忘的那些單次提示詞小技巧還久。

那份「持久性」正是重點所在。模型升級會改變行為；但一份提交進版控、把「這個 repo 怎麼運作」編碼起來的檔案，跨越這些升級依然有效。當 agent 用某種你日後還會再撞上的方式搞錯了，修正的地方應該落在這份檔案裡，而不是落在你下週又得重打一次的那種一次性糾正上。這正是為什麼真正該下的脈絡工程苦功，應該投在這份指令檔上，而不是任何單一一則巧妙的提示詞。

## 脈絡檔的全貌

每個主流的 coding agent 都會依照慣例去找它自己的指令檔。各工具實際怎麼吃進這些檔案，細節留在工具專屬的指南裡；下表只是一張地圖。

| 工具 | 脈絡檔 |
| --- | --- |
| Claude Code | `CLAUDE.md` |
| OpenAI Codex | `AGENTS.md` |
| Gemini CLI | `GEMINI.md` |
| Cursor | `.cursor/rules` |
| Aider | `CONVENTIONS.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |

`AGENTS.md` 是匯流點：好幾個工具都把它當成原生格式來讀，它正逐漸成為跨廠商的標準。Claude Code 會不會原生讀取 `AGENTS.md` 要看版本，所以用 Claude Code 時請用 `CLAUDE.md`，別指望 `AGENTS.md` 一定會被抓到。每個工具確切的載入規則，請看 [Claude Code](/docs/vibe-coding/claude-code) 與 [OpenAI Codex](/docs/vibe-coding/openai-codex)。

## AGENTS.md 作為開放標準

`AGENTS.md` 由 Linux Foundation 旗下的 Agentic AI Foundation 維護，於 2025 年 12 月隨 MCP 一起公布。它刻意保持極簡：就是純 Markdown，沒有強制的綱要（schema），所以任何讀得了文字的 agent 都能用它，你也永遠不必跟某種格式纏鬥。根據 Agentic AI Foundation 在 2025 年 12 月的公告，這項慣例已被用在 60,000+ repositories 上——這是來自那份公告的單一來源數字。

放置位置遵循一條簡單規則：

- 把主檔放在 repository 根目錄。
- 在 monorepo 裡，於子目錄內加上巢狀的 `AGENTS.md` 檔，提供各套件專屬的指引。
- 離工作目錄最近的那份檔案優先，因此區域性指令會覆蓋根目錄的。

Codex 預設把合併後的指令大小上限訂在 32 KiB，由 `project_doc_max_bytes` 設定控制；超過這個上限的內容會被丟掉。請把這當成 Codex 專屬的預設值，而不是放諸四海皆準的規則——其他工具對這些檔案的大小計算與合併方式都不一樣。

## 該放什麼進去（又該把什麼留在外面）

主導原則是：放進 agent 沒辦法從程式碼推得出來的東西，把它推得出來的全部排除掉。任何讀一遍 repository 就能發現的東西，都是在浪費空間；而塞滿這類內容的檔案，反而會訓練 agent 略過那些真正重要的部分。

| 該放（agent 推不出來） | 該排除（浪費脈絡或被忽略） |
| --- | --- |
| 確切的 build、test、lint 指令 | 任何讀程式碼就能發現的東西 |
| 與語言預設不同的程式碼風格差異 | 模型早就知道的通用語言慣例 |
| Repo 禮儀：branch 與 PR 慣例 | 又臭又長的 API 文件——改用連結指過去就好 |
| 這個專案特有的架構決策 | 已經寫在 `README` 裡的內容 |
| 環境的怪癖與必要的設定步驟 | 把整棵檔案樹逐檔描述一遍 |
| 硬性界線——「絕對不要做 X」 | 「寫出乾淨的程式碼」這種空話 |
| 模型不會懂的領域詞彙 | 把語言教學重講一遍 |

「該放」那一欄有個共通點：每一項都是模型靠自己無從還原的事實。「該排除」那一欄則共有相反的特性——它要嘛是在重複程式碼庫裡已有的東西，要嘛是在重述模型早就知道的事情。

## 保持精簡

實務界的建議是，一份健康的指令檔大約落在 100–150 行。一份簡短而準確的檔案，表現會勝過一份冗長而含糊的檔案：你每多加一行，就多一份在搶 agent 注意力的競爭，而臃腫的檔案會被略讀、形同被忽略。這跟臃腫的 `CLAUDE.md` 是同一種失效模式——[Claude Code](/docs/vibe-coding/claude-code) 指南裡有更深入的探討。當這份檔案長到你沒辦法一口氣讀完時，那就是該砍的信號，而不是該繼續往後加。

## 一份貼近現實的範例

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

上面每一行都是 agent 讀原始碼也推不出來的東西：那些確切的指令、那條專案特有的 `Result` 規則、產生檔（generated file）的界線，以及「tenant」這個詞在領域裡的意思。注意一下哪些東西缺席了——沒有檔案清單、沒有語言教學、也沒有「寫出乾淨的程式碼」這種期許。

## 把它當程式碼來對待

脈絡檔是一份原始碼產物，所以就照管理原始碼的方式來管它：

- **提交它。** 它該跟它所描述的程式碼一起放進版本控制，在同一批 pull request 裡一起被審查。
- **agent 出狀況時就回頭審視它。** 一再出現的錯誤行為，通常都能追溯到某條缺漏或過時的指令；修那份檔案，別每一回合都重新糾正 agent。
- **定期修剪。** 把那些針對早已不存在的程式碼、以及你已經棄用的慣例的指令刪掉。一條過時的指令比一條缺漏的指令還糟，因為 agent 會照著它做。

延伸閱讀也可以看[程式碼生成](/docs/tutorials/code-generation)，了解這些慣例是怎麼形塑你實際拿到的輸出。

:::tip
想看指令、撈取與歷史如何合成一個能運作的 context window 的全貌，請看 [vibe-coding 總覽](/docs/vibe-coding/overview)。想知道每個工具確切是怎麼發現並合併這些檔案的——包含優先順序與大小處理——請看 [Claude Code](/docs/vibe-coding/claude-code) 與 [OpenAI Codex](/docs/vibe-coding/openai-codex) 指南。
:::
