---
sidebar_position: 3
---

# OpenAI Codex：實戰指南

OpenAI Codex 其實是兩個共用同一個名字的不同東西，把它們分開來看，就能避開大部分的混淆。它是一個**產品介面**——包含 CLI、IDE 擴充套件、雲端／網頁體驗，以及桌面應用程式——同時也是一個專為 agentic coding（代理式編碼）調校過的 **GPT-5 系列模型家族**。介面跟模型各走各的演進路線，發布時程也不一樣，所以像「Codex 今天發布了」這種句子，在你搞清楚它指的是工具更新還是模型更新之前，其實是模稜兩可的。

這份指南聚焦在實際操作的細節：怎麼跑 CLI、sandbox（沙箱）跟 approval（核准）之間如何互動、agent 怎麼讀取專案指示，以及 code review（程式碼審查）怎麼搭配進來。

## Codex 模型

Codex 家族裡的模型，都是針對長時間執行、需要使用工具的編碼工作所優化的 GPT-5 系列變體。模型的可用性，以及各介面的預設值變動得很快，所以下面這張表請把它當成一份「有標註日期的快照」，而不是已成定局的事實。

### Codex 模型——截至 2026-06；這些變動得很快

| 模型 | 首次推出 | 說明 |
| --- | --- | --- |
| GPT-5-Codex | 2025-09-15 | 曾是雲端任務與程式碼審查的預設模型 |
| GPT-5.2-Codex | 2025-12-18 | Codex 調校系列中的一次迭代 |
| GPT-5.3-Codex | 2026-02-05 | Codex 調校系列中的一次迭代 |
| GPT-5.5 | 2026-04-23 | 目前的前沿模型；Codex 文件建議「start with gpt-5.5」 |

各介面確切的預設值（雲端 vs. CLI vs. review）會各自獨立漂移，不值得去硬記。如果你用的是 ChatGPT 驗證的工作階段，不去指定模型就會跟著當下的預設值走，通常這就是對的選擇。如果你需要特定模型，就用 `/model` 或在設定裡明確指定。

:::note
除了文件本身的建議之外，並沒有另一套「從這裡開始」的規則：先從當下的前沿模型開始，只有在你有具體理由時，才去釘住（pin）某個較舊的 Codex 調校模型。
:::

## Codex CLI

Codex CLI 是開源的，用 Rust 寫成，採用 Apache-2.0 授權。安裝完之後，你只要執行以下指令就能啟動互動式工作階段：

```bash
codex
```

對於指令稿（scripting）跟 CI 的場景，CLI 提供了一個非互動模式，會執行單一任務後就退出：

```bash
codex exec "run the test suite and summarize failures"
```

這個 CLI 同時是 **MCP client** 也是 **MCP server**。當 client 時，它可以連到你設定好的外部 Model Context Protocol 伺服器；當 server 時，它會把 Codex 本身開放給其他支援 MCP 的工具使用：

```bash
# Manage / connect to MCP servers as a client
codex mcp

# Expose Codex as an MCP server to other tools
codex mcp-server
```

### Sandbox 與 approval

有兩個獨立的控制項，決定了 agent 可以做哪些事：一個是檔案系統／網路的 **sandbox（沙箱）**，另一個是針對需要提權的動作所設的 **approval（核准）** 政策。它們會搭配運作，而刻意去挑選這對組合，比單獨設好其中任一項都還重要。

sandbox 用 `--sandbox` 來設定：

| `--sandbox` 值 | 效果 |
| --- | --- |
| `read-only` | agent 可以讀取工作區，但不能寫入 |
| `workspace-write` | agent 可以在工作區內讀取與寫入 |
| `danger-full-access` | 沒有任何 sandbox 限制 |

approval 政策用 `--ask-for-approval` 來設定：

| `--ask-for-approval` 值 | 效果 |
| --- | --- |
| `untrusted` | 只要不是明確受信任的動作，就會詢問你 |
| `on-request` | agent 需要提權、超出 sandbox 範圍時才會詢問 |
| `never` | agent 完全不會暫停詢問 |

本機互動工作一個合理的預設，是把 `workspace-write` 跟 `on-request` 搭在一起：agent 可以自由編輯你專案裡的檔案，但在做任何會碰到 sandbox 以外的事情之前，它會先暫停並詢問你。

```bash
codex --sandbox workspace-write --ask-for-approval on-request
```

`danger-full-access` 跟 `never` 請保留給受信任、且彼此隔離的環境，例如一個用完即丟的容器，千萬別用在那種「一個沒料到的指令就可能造成損害」的機器上。

## App Server 架構

於 2026-02 發布的統一 **App Server**，是讓四個介面保持一致的骨幹。它是一個說 **JSON-RPC 2.0** 的單一雙向程序，CLI、IDE 擴充套件、網頁與桌面應用程式全都是透過它來驅動 Codex。因為這些 client 共用同一份 server 合約，行為與能力就會在各介面之間保持對齊，而不是各個 client 各自漂移。

實際的好處是：在 App Server 層加進來的功能，會自動對每個前端都可用，而針對 JSON-RPC 介面開發的整合者，無論使用者偏好哪一個介面，拿到的都是同一個 agent。

## AGENTS.md：給 agent 的指示

`AGENTS.md` 就是你拿來放任務與情境指示給 agent 的地方——build 指令、慣例、要避開的事項、專案的架構長怎樣。它跟設定（configuration）是兩回事：請看下面的對照。

查找的順序是從 **git 根目錄往下走到目前的工作目錄**，越靠近工作目錄的檔案，會覆蓋掉位階較高的那些。所有找到的檔案合併後的預設大小上限是 **32 KiB**，由 `project_doc_max_bytes` 控制。

`AGENTS.md` 是一套**開放、跨廠商的標準**，由 Linux 基金會的 Agentic AI Foundation 負責維護（2025 年 12 月），所以同一種檔案格式可以在多種 agent 工具之間通用，而不是 Codex 專屬的。

一個最精簡的 `AGENTS.md` 看起來可能像這樣：

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

| 關注點 | 檔案 | 內容 |
| --- | --- | --- |
| agent 該知道／該做什麼 | `AGENTS.md` | 任務與專案情境、慣例 |
| agent 該怎麼運作 | `~/.codex/config.toml` | 操作性設定：MCP 伺服器、模型與 sandbox 預設值 |

把提示詞風格的指引放在 `AGENTS.md`，把操作性的旋鈕放在 `config.toml`。把兩者混在一起，會讓你在思考時兩邊都更難搞懂。

## Code review

Codex 可以在兩個地方審查 diff。

在 **CLI** 裡，`/review` 斜線指令會審查你選定的 diff，並回傳依優先順序排列的發現，讓你先看到最嚴重的問題，而不是一份平鋪直敘的清單。

在 **GitHub** 上，你可以在某個 pull request 上留言 `@codex review` 來觸發審查，或者設定自動 PR 審查，讓 Codex 不必手動觸發就會主動發表意見。

在這兩種情況下，審查都會聚焦在**嚴重的（P0/P1）問題**上，而不是在挑剔風格上的小毛病，這能讓訊號維持高品質，集中在真正重要的變更上。

## 斜線指令與 Agent Skills

互動式工作階段支援用於常見操作的斜線指令。以下幾個值得記一下：

| 指令 | 用途 |
| --- | --- |
| `/model` | 切換目前使用的模型 |
| `/review` | 審查選定的 diff |
| `/plan` | 讓 agent 在行動之前先做規劃 |
| `/compact` | 壓縮對話以騰出情境空間 |
| `/diff` | 顯示目前的 diff |

**Agent Skills** 把可重複使用的 agent 能力打包起來。一個 skill 是定義在一份 `SKILL.md` 檔案裡，遵循開放的 Agent Skills 標準，而 `/skills` 則用來管理你工作階段裡可用的技能。Skills 讓你可以把一個會重複用到的工作流程封裝一次，之後直接用名字呼叫它，而不必每次都重新解釋一遍。

## 延伸閱讀

- [Codex 文件](https://developers.openai.com/codex)
- [Codex 的 GitHub](https://github.com/openai/codex)
- 想看端到端的完整工作流程，請參考 [Code Generation](/docs/tutorials/code-generation)。

:::tip
第一次接觸 agent 輔助開發嗎？先從 [Vibe Coding 總覽](/docs/vibe-coding/overview) 打好觀念基礎，再回來這裡看 Codex 的細節。
:::
