---
sidebar_position: 6
---

# 規格驅動開發：當規格成為真相來源

規格驅動開發（spec-driven development，SDD）翻轉了一個長久以來的預設立場。它不再把原始碼當成系統的權威描述、把文字說明當成可丟棄的文件，而是讓一份結構化的自然語言規格成為主要產物：程式碼是從規格*生成*出來的，而且可以反覆重新生成。GitHub 對這個轉變的說法很直白，就是從「code as the source of truth（程式碼是真相來源）」走向「intent as the source of truth（意圖是真相來源）」。這篇文章談的是規格這個產物，以及圍繞它的方法論。至於把規格交給 agent 的工作階段操作細節，請看 [Agentic Workflows](/docs/vibe-coding/agentic-workflows)；想了解把測試當成關卡的機制，請看 [驗證與安全](/docs/vibe-coding/verification-and-safety)。

## SDD 為什麼在 2025 年崛起

SDD 很大程度上是對 [vibe coding](/docs/vibe-coding/overview) 侷限的一種回應。對話式、即興式的寫程式很適合探索，但拿來做正式產品就不太可靠：那份「規格」只活在一段聊天記錄裡，意圖會慢慢飄移，沒有人能重建出*為什麼*程式碼長成這個樣子。2025 年有兩項關鍵變化，讓一套更有紀律的做法變得可行：

- **更大的 context window（脈絡視窗）**，讓一份完整的規格再加上相關程式碼能塞進同一個工作階段。
- **能把規劃和實作分開的 agent**，讓計畫可以先被審查、定案，再讓任何修改落地。

把這件事放到 overview 那條光譜上來看：**用 vibe coding 來探索，用 spec-driven 來交付。**這兩者與其說是對手，不如說是「一項任務該有多少結構」這條連續光譜上的不同位置。

## 什麼時候用 SDD、什麼時候用 vibe coding

這個決定主要看的是壽命與利害關係，而不是難度。

- **選 SDD**：當系統要上正式產品、需要長期**維護**、牽涉到必須對行為達成共識的**多個利害關係人**，或是受**法規約束**、需要一份可稽核的意圖記錄時。
- **選 vibe coding**：當這個產物本來就是用完即丟的東西，例如原型、探路用的 spike、一次性的腳本，或是你預期之後會刪掉的實驗。

一個好用的判斷法則：如果你會擔心半年後得在沒有原始聊天記錄的情況下，向別人解釋這段程式碼的行為，那你當初大概就需要一份規格。

## 各種工具組（截至 2026-06）

這些工具還很年輕、變動很快。底下的內容請一律當成某個時間點的快照看待；它們的功能與包裝方式經常改變。

| 工具 | 它是什麼 | 工作流程形狀 | 備註（截至 2026-06） |
| --- | --- | --- | --- |
| **GitHub Spec Kit** | 開源工具組，於 2025-09-02 開源 | `Specify` -> `Plan` -> `Tasks` -> `Implement` | 設計上能搭配多種 coding agent，而非綁定單一 IDE。 |
| **AWS Kiro** | Agentic IDE；約在 2025 年年中進入公開預覽 | `spec` -> `design` -> `tasks` | 採用 EARS 風格的需求標記法來撰寫驗收標準。 |
| **Tessl** | 主打「spec-as-source」 | 由規格驅動產生程式碼 | 當時處於私有測試（private beta）階段。 |

這裡刻意省略確切的版本號；請直接查看各專案本身，因為這些資訊會隨版本更動。

## 嚴謹程度：規格管轄得有多嚴

Martin Fowler 的團隊寫過，SDD 是一條光譜，而不是單一一種做法。要解讀這條光譜，有個實用的角度，就是看規格握有多大的權威：

- **Spec-first（規格先行）** — 規格用來啟動工作，之後就交棒給程式碼，由程式碼成為你維護的對象。規格是一份啟動文件。
- **Spec-anchored（規格錨定）** — 規格被當成一份活的參考資料，與程式碼保持同步、會被查閱與更新，但程式碼仍然是直接編輯的對象。
- **Spec-as-source（規格即來源）** — 規格是唯一的真相來源；程式碼是重新生成出來的產物，你不會手動去改它。

2026 年大多數團隊都落在前兩段的某個位置；第三段最有野心，也最尚未塵埃落定。

## 爭論不休的問題：規格還是程式碼？

最核心、而且真的還沒定論的爭論是：到底哪一個產物才是*真正的*真相來源。

**激進派的觀點：**規格是唯一的真相來源，程式碼則是可丟棄的。你只要改規格、重新生成就好；用手去改生成出來的程式碼是一種反模式，就像手動去改編譯器輸出一樣。這就是 spec-as-source 的立場，它的承諾是：因為只有一份是人撰寫的產物，意圖永遠不會和實作脫節。

**溫和派的觀點：**可執行的程式碼仍然是那個可維護的真相來源。規格對於*驅動*生成、以及捕捉驗收標準（TDD 風格）來說，價值極大；但真正在跑的、被審查的、團隊最終要承擔的，是程式碼。在這個觀點下，要把整個系統從一段文字裡重新生成出來，失真太多、太難預測，不值得信任成唯一的產物。

這兩種立場都有不少認真的支持者，而截至 2026 年，這個問題仍懸而未決。對一個要採用 SDD 的團隊來說，誠實的態度是：*針對某個特定專案*去決定要在嚴謹光譜上走多遠，而不是假設整個產業已經有了共識。本指南不替任何一方背書。

## 怎麼寫出一份好規格

這才是實務上的核心，而且大致上跟你用哪一套工具組無關。一份好規格，是能讓一個**全新的 agent 直接執行**的——就算它完全沒看過你先前的對話也行。要把它寫得很具體：

- **指名要建立或修改的檔案與介面。**「加上驗證」是一個願望；「在 `src/auth/schema.ts` 加上一個 `validate(payload)` 函式」才是規格。
- **用可檢核的方式陳述驗收標準**——輸入、預期輸出、錯誤行為。
- **明確寫出哪些東西不在範圍內**，這樣 agent 才不會晃進旁邊的重構裡。
- **放進一個端到端的驗證步驟**，讓 agent 能跑來證明工作完成（一道指令、一個測試、一個可觀察的結果）。
- **讓它能自給自足。**假設讀者手上只有這個 repository、其他什麼都沒有——沒有聊天記錄，也沒有口耳相傳的內隱知識。

一份最精簡的骨架：

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

注意到了嗎：**Acceptance criteria（驗收標準）**裡的每一條，都可以原封不動地橫向讀成一個個測試案例。

## 跟 TDD 的關係

這種重疊並非偶然。一份規格的驗收標準，天生就適合用測試來表達：每一條可檢核的主張變成一個斷言，而「驗證通過」就變成那道判定實作是否符合意圖的關卡。這就是 SDD 與測試驅動開發（TDD）交會的地方——規格撰寫了測試的*意圖*，而測試讓規格變得*可執行*。想知道怎麼把測試接成 agent 在變更被接受前必須通過的那道關卡，以及有哪些失敗模式要小心，請看 [驗證與安全](/docs/vibe-coding/verification-and-safety)。

:::tip 接下來看這裡
先從 [Vibe Coding 總覽](/docs/vibe-coding/overview) 開始，把 SDD 放到「探索到交付」這條光譜上定位。要了解從訪談到交接的工作階段操作細節，請用 [Agentic Workflows](/docs/vibe-coding/agentic-workflows)；想把驗收標準轉成可強制執行的測試關卡，請看 [驗證與安全](/docs/vibe-coding/verification-and-safety)。
:::
