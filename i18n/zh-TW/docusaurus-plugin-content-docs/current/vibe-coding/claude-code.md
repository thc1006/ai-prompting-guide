---
sidebar_position: 2
sidebar_label: "Claude Code"
---

# Claude Code 實戰指南

Claude Code 是 Anthropic 的代理式（agentic）程式開發環境。它以終端機 CLI、IDE 擴充套件，還有網頁版的形式推出，而且跟聊天機器人不一樣，它不只是回給你一段文字讓你複製貼上而已。它會讀檔案、跑指令、改程式碼，自己一步步把多步驟的任務做完，你在旁邊看著、適時把方向拉回來就好。你給它一個目標，它會去探索整個 repo、擬出一份計畫、動手修改，然後回報結果。你的角色也跟著變了，從每一行都要自己打，變成引導一個代理、然後驗證它的產出。

這份指南是一本實戰手冊：一旦你跨過那些瑣碎的小用法，真正重要的工作流程、設定，還有各種失敗模式，都在這裡。

## 最關鍵的限制：context window（上下文視窗）

下面幾乎所有的做法，都是從這一個事實衍生出來的。Claude Code 是在一個有限的 context window 裡運作，而這個視窗會很快被塞滿——檔案內容、指令輸出、你的指示，還有模型自己的推理，全部都在消耗它。隨著它越來越滿，效能就會下滑：模型會忘掉先前的決定、重複做過的工，然後偏離任務。

所以核心的紀律就是 **context 衛生（context hygiene）**。讓視窗只專注在當前任務需要的東西上，多餘的都不要。當你把這件事內化之後，那些 session 指令（`/clear`、`/compact`、`/rewind`）、subagent 模式，還有 writer/reviewer 的分工，就不再像是各自獨立的功能，而是同一個概念的不同面向：保護 context。

## 核心工作流程：探索、計畫、寫碼、提交

可靠的循環有四個階段：

1. **探索（Explore）**——在提任何方案之前，先讓 Claude 讀過相關檔案、搞懂目前的狀態。
2. **計畫（Plan）**——讓它先產出一份計畫，讓你*在它動程式碼之前*就能審查。
3. **寫碼（Code）**——照著計畫執行，而且是用你跟得上的步驟一步步來。
4. **提交（Commit）**——驗證過之後，用一段清楚的訊息把這次變更落地。

最能發揮槓桿效果的一招，就是用 **plan mode（計畫模式）** 把研究跟執行拆開。如果不加限制，代理往往會直接跳去寫程式碼——而針對錯誤問題給出的快速解法，比完全沒有解法還糟。plan mode 會逼它先去調查、把做法攤開來給你看，讓你在任何修改還沒成形之前，就能用很低的成本糾正它。

瑣碎的變更（改個錯字、調一行設定）就跳過計畫吧，在那種地方花這個功夫不划算。把這套儀式留給那種「做法搞錯代價很高」的工作。

## CLAUDE.md：長存的專案記憶

`CLAUDE.md` 是一個 Markdown 檔案，Claude Code 會在每次 session 開始時讀它。你平常會一直重複講的那些事——測試怎麼跑、專案慣例、地雷在哪、哪些東西*不要*碰——都放在這裡。

用 `/init` 產生一個起手式，它會掃過 repo 然後幫你草擬一份基礎版本。接著就把它當成你要維護的程式碼來對待。

最重要的一條規則：**保持精簡，而且要常常修剪。** 一個肥到不行的 `CLAUDE.md` 會適得其反——它每次 session 都在消耗 context，而且超過某個大小之後，模型基本上就會直接忽略它。寧可要一份緊湊、條條都是高訊號量規則的檔案，也不要那種包山包海的。

它支援 `@path` 匯入，所以你可以拉進共用的片段，而不用一直複製貼上：

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

放在哪裡，就決定了它的作用範圍：

| 位置 | 用途 |
| --- | --- |
| `~/.claude/CLAUDE.md` | 全域，對你個人的每一個專案都生效。 |
| `./CLAUDE.md` | 專案規則——把它 commit 進去，讓整個團隊共用。 |
| `./CLAUDE.local.md` | 個人覆寫——記得 gitignore 掉。 |
| 上層 / 下層目錄 | monorepo 裡各個 package 自己的規則，會依照遠近合併。 |

## 給 Claude 一個能驗證自己成果的方法

不管成功了沒，代理都會回報它成功了。對策就是給它一個它自己能跑的檢查，並且要求它*拿出證據，而不是宣稱成功*。

一個好的檢查要是確定性的、而且成本要低：一套測試、一個失敗時會回傳非零退出碼的 build、一個 linter、一個型別檢查器，或是拿一張截圖去跟目標設計稿做比對。只要 Claude 能自己跑，它就能在把成果交回給你之前，先抓出自己的錯誤。

你也有好幾種方法可以管控它什麼時候才被允許停下來：

- **在 prompt 裡迭代**——指示它跑檢查，然後一直修到通過為止。
- **一個 `/goal` 條件**——把成功條件明確定義出來，讓這個 session 有一條清楚的終點線。
- **一個確定性的 Stop hook**——除非檢查通過，否則用程式的方式擋住停止動作（下面會講到）。
- **一個對抗式的 review subagent**——在全新的 context 裡開一個 reviewer，讓它在沒有「剛寫完這段所以想護航」這種偏誤的情況下評斷成果。

把檢查跟工作綁在一起，而不是事後才補上。想把這些檢查變成可強制執行的關卡——已提交的測試、要證據而不要嘴上講講、由獨立的對象來認證——請看 [驗證、安全與工程紀律](/docs/vibe-coding/verification-and-safety)。

## 擴充 Claude Code

有五個擴充點，能讓你把行為推到超出預設值的程度。當某個工作流程一再重複出現時，就把它們拿出來用。

### Skills

一個 Skill 就是定義在 `.claude/skills/SKILL.md` 裡、可重複使用的能力——一段有名字的程序，附上指示，Claude 在相關時機就能呼叫它。用 Skills 把一個會重複做的任務（例如「發一個 release」）一次記下來，而不用每次都重新解釋一遍。

### Subagents

Subagents 放在 `.claude/agents/*.md`。每一個都跑在**隔離的 context** 裡、有自己**限定範圍的工具**，所以它能處理一個子任務而不會污染主 session 的視窗——而且只把結論回報回來。這就是「全新 context 的 reviewer」背後的機制，也是任何「去調查 X 然後做個總結」這類委派背後的機制。

### Hooks

Hooks 是**確定性的** shell 指令，由 harness 在指定的生命週期節點上執行——不是那種模型可能會跳過的建議。常見的一個是在每次編輯後跑 `eslint`，或是擋住停止動作直到測試通過。當「永遠都要做 X」這件事必須被保證、而不是用「希望」的時候，就用 hooks。

### MCP servers

MCP（Model Context Protocol）servers 透過一個標準介面，把 Claude Code 連到外部系統——issue 追蹤器、資料庫、內部 API——讓代理擁有本機檔案系統跟 shell 之外的工具。

### Plugins

Plugins 把上面這些——Skills、subagents、hooks、MCP 設定——打包成可安裝的套件包，讓你能跨團隊或跨專案分享，這樣一整套工作流程的設定就能當成一個單位帶著走。

## 管理 session

主動管理 context 本身就是一門功夫：

- **`/clear`**——在不相關的任務之間把對話清掉。這是成本最低、卻最被低估的指令。在舊的 session 裡開始一個新任務，會把一堆不相干的 context 一路拖著走。
- **`/compact`**——把對話做個總結來騰出視窗空間。當你快接近上限時它會自動執行，你也可以在一個自然的段落點手動觸發它。
- **`/rewind`**——從一個 checkpoint 還原，當某次嘗試走歪了，就把對話、程式碼，或兩者一起往回滾。
- **用 `Esc` 早一點修正方向**——一看到 Claude 走錯方向，當下就打斷它。走錯兩步就拉回來，遠比走錯二十步才拉便宜得多。

## 權限與自主性

Claude Code 會改檔案、跑指令，所以它對這些動作設了關卡：

- **Auto mode（自動模式）**——一個分類器會核准低風險的動作、擋下或升級高風險的動作，在保留一道護欄的同時減少詢問次數。
- **Permission allowlists（權限白名單）**——預先核准你信任的特定指令或工具（例如你的測試執行器），讓它們跑的時候不會被打斷。
- **Sandboxing（沙箱）**——把執行限制在一定範圍內，讓代理能更自由地做事，又不會伸手越過你預期的邊界。

依照賭注大小來調整自主性。一個用完就丟的原型，能容忍的彈性，比一支正式環境的部署腳本大多了。

## 規模化：超越單一互動式 session

一旦基本功扎實了，Claude Code 就能往外擴展：

- **Headless mode（無頭模式）**——`claude -p "<prompt>"` 以非互動方式執行，適合 CI 工作、pre-commit 檢查，或是把同一個任務攤開來跑在很多組輸入上。
- **平行 session**——同時跑好幾個代理，各自處理獨立的任務。
- **Git worktrees**——給每個平行 session 自己的 working tree，讓它們改東西時不會互相撞車。
- **writer/reviewer 模式**——一個代理負責寫，另一個獨立、全新 context 的代理負責審。這個模式的細節請看 [Agentic 工作流程](/docs/vibe-coding/agentic-workflows)，把它當成認證關卡來用則請看 [驗證、安全與工程紀律](/docs/vibe-coding/verification-and-safety)。

```bash
# Headless: run a check and let Claude fix failures, no interaction
claude -p "Run the test suite; if anything fails, fix it and re-run until green."
```

任務層級的範例可以看 [程式碼生成教學](/docs/tutorials/code-generation)。

## 模型

Claude Code 跑在 Anthropic 的通用型模型上。截至 2026-06，那就是 **Opus / Sonnet / Haiku 4.x 系列**——Opus 負責最難的推理，Sonnet 是兼顧各方面的預設選擇，Haiku 則在較輕量的工作上拚速度跟成本。模型的供應狀況會隨時間變動，請去查當前的官方文件 [code.claude.com/docs](https://code.claude.com/docs)，而不要依賴這裡寫死的任何清單。

## 常見的失敗模式

| 模式 | 症狀 | 解法 |
| --- | --- | --- |
| 大雜燴 session | 一個 session 不斷累積不相關的任務；品質下滑 | 在任務之間 `/clear` |
| 過度修正 | 把一堆修補往一個已經被搞糊塗的代理身上堆 | `/clear` 然後乾乾淨淨地重新下 prompt |
| 塞太滿的 `CLAUDE.md` | 規則被默默忽略；context 被浪費掉 | 修剪到只剩高訊號量的精華 |
| 信了卻沒驗證的落差 | 沒有證據就接受「做好了」 | 永遠要求一個能跑的檢查 |

這幾項追根究柢，全都是 context 問題或驗證問題——也就是這份指南一再回頭強調的那兩個主題。

:::tip
第一次接觸代理式開發嗎？先從 [總覽](/docs/vibe-coding/overview) 的章節開頭看起，了解更宏觀的工作流程，以及 Claude Code 在其他工具之中的定位。
:::
