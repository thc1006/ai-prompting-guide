# RFC-001：AI 編碼代理（vibe coding）章節大版本更新 — 最小變更計畫

| 欄位 | 內容 |
|---|---|
| 狀態 | **Draft / 待核准**（規劃階段，尚未動任何手冊內容） |
| 日期 | 2026-06-02 |
| 作者 | thc1006（蔡秀吉） |
| 影響範圍 | `ai-prompting-guide` Docusaurus 手冊（en + zh-TW），目標版本 **v2.0.0** |
| 工程紀律 | TDD Rule、Boy Scout Rule、Small CLs、YAGNI / Rule of Three / AHA |
| 反模式紅線 | 過度生成（over-generation）、過早抽象（premature abstraction） |

> 本文件是**計畫**，不是實作。撰寫本 RFC 期間**未修改任何手冊檔案**（`docs/`、`i18n/`、`src/`、`blog/`、設定檔皆原封不動）。唯一新增的檔案就是這份 RFC 本身（置於 repo 根目錄，不會被 Docusaurus build 進站台）。

---

## 1. 動機（Motivation）

手冊目前對 2025–2026 年 AI 輔助開發的**典範轉移完全沒有著墨**（掃描 24 篇英文 + 24 篇 zh-TW 文件，0 處提到 Claude Code、Codex、vibe coding、agentic、spec-driven、context engineering）。這在 2026 年中是明顯缺口：

- 「prompt engineering」對「寫程式」這件事，已被重新框定為 **context engineering（情境工程）+ spec-driven development（規格驅動開發）**；單發、聰明的一句 prompt 不再是槓桿，**持久情境檔、驗證迴圈、規格**才是。
- **vibe coding** 從 2025 年初的迷因，到 2026 年已收斂成一條光譜：**探索用 vibe、上線用 spec、agentic engineering 當專業傘**。
- **Claude Code 與 OpenAI Codex** 兩大 agentic CLI 在 2025 下半年到 2026 上半年有大量更新（見 §6 事實帳本）。

手冊既有的 `docs/tutorials/code-generation.md`（538 行）是「一次性 prompt 範本庫」，正好可作為橋接點，引導讀者進入新的 agentic 工作流。

## 2. 目標與非目標

### 2.1 目標（Goals）
1. 新增一個聚焦章節，教 2026 年的 AI 編碼代理實務（vibe coding 光譜、Claude Code、Codex、情境工程、驗證）。
2. 中英雙語**完整鏡像**（zh-TW 為預設語系，台灣在地化語氣）。
3. 既有 `code-generation.md`、`intro.md` 接上新章節（不打掉重練）。
4. 首頁微調 + 版本升 **2.0.0** + 一篇發布 blog（中英）。
5. 全程以**最小變更**落地：每個 PR 都是一個 self-contained 的 Small CL，獨立 `npm run build` 綠燈。

### 2.2 非目標（Non-Goals）— 用來擋過度生成
- **不**預先建立一堆空殼文件（過早抽象）。文件只在「內容量真的撐得起一篇」時才獨立成檔（Rule of Three 套用在文件粒度上）。
- **不**新建 CI 工具鏈（link checker、prose linter、i18n parity script）— 改用 repo **既有**的 build 閘門（見 §5）。這些是 §9 的「延後 / 不做」。
- **不**順手重寫 README、不清掉 orphaned 的 `tutorial-basics/**`、不動 footer 佔位連結、不碰根目錄雜散檔（`OPTIMIZATION_REPORT.md` 等）。這些是真實 tech debt，但**不屬於本次範圍**，混進來就是 scope creep（違反 Small CLs）。
- **不**把版本號寫死在內文當賣點（易過期）；volatile 事實一律標註「截至 2026-06」與日期（見 §8 風險）。

## 3. 指導原則（如何把軟體工程紀律套到文件站台）

> 研究結論：TDD、Boy Scout、Small CLs 可以乾淨地組合，但有一條明確護欄 —— **Boy Scout 清理必須留在你已經動到的檔案內，不得擴張成 scope creep / 新功能 / 過度生成**（Google「one self-contained change」+ Fowler YAGNI）。

### 3.1 TDD Rule（Red → Green → Refactor）套到 docs
文件站台沒有 unit test，但有等價的「可機器判定的 pass/fail 閘門」。**先定義閘門，再寫內容**：
- **Red**：先確立驗收條件會「失敗」——例如新章節的 sidebar 條目指向尚未存在的檔案會讓 `npm run build` 失敗；新文件的 `/docs/...` 內部連結在 twin 還沒建立前會 throw。
- **Green**：補內容直到 `npm run build` 全綠（兩個 locale 都建得起來、無 broken link）。
- **Refactor**：在閘門保持綠燈下，整理結構 / 用語一致性。
- **拿證據，不要宣稱**：每個 PR 附上 `npm run build` 實際輸出，而非「應該會過」。

### 3.2 Boy Scout Rule（留下比你來的時候更乾淨）
只對**你這個 PR 已經動到的檔案**做微小、就地的清理（例如：你已經在改 `code-generation.md` 的 Next Steps，就順手修掉那幾行的尾隨空白）。明確**不**做的：把 Boy Scout 當藉口去重寫整份 README 或刪 orphaned 文件（§9）。

### 3.3 Small CLs（小變更）
- 每個 PR 是「一個 self-contained 的變更，只做一件事」。
- 目標體量：可審查的內容增量，盡量讓單一 reviewer 在一次專注（< 60 分鐘）內看完。Google 指引：~100 行合理、1000 行過大；研究顯示 review 有效性在 ~200–400 LOC 後快速下滑。文件 PR 行數天然較高（散文），所以改用「**一篇文件 = 一個 CL**」當切割單位，而非硬湊行數。
- 寧可切太小：每個 PR 都能獨立 build 綠燈、獨立 rollback。

### 3.4 反過度生成 / 反過早抽象（紅線）
研究證實：LLM **預設就會過度生成**（Anthropic 自承 Opus「傾向 over-engineer，亂建檔案、加不必要的抽象與沒人要的彈性」；ezyang 觀察到亂灑 try/catch）。本計畫的對策直接寫進每個 PR 的執行指令：
- 「做**滿足需求的最小變更**；非為正確性所需，不重構、不加抽象、不新增檔案。」
- 文件層級套 **Rule of Three**：同一概念出現第三次、且份量足夠，才獨立成新文件；否則折進既有文件的章節。
- reviewer/critic 指令限縮：「**只標出影響正確性或既定需求的缺口**」，避免 AI 自己生出一堆 speculative 建議。

## 4. 內容設計（**D1 決議：7 篇**；採「無空殼／不重複」護欄）

新增 sidebar category（英文 label **"Vibe Coding & AI Agents"**，zh-TW **「Vibe Coding 與 AI 編碼代理」** —— D2 決議），置於 `Fundamentals` 之後、`Practical Tutorials` 之前。資料夾 `docs/vibe-coding/`。

> **D1 決議與護欄**：原建議 4 篇以反過度生成；你選擇 **7 篇**（追求完整涵蓋）。為兼顧反過度生成，紅線改為「**7 篇，但每篇須有實質且互不重複的內容（下方 content contract），絕不出空殼**」。各篇邊界已劃清，避免兩篇講同一件事（重複本身就是過度生成）。

| # | 檔名（`docs/vibe-coding/…`） | content contract：須有的實質內容 | 與他篇的邊界 |
|---|---|---|---|
| 1 | `overview.md` | 典範轉移：vibe coding 起源（Karpathy 2025-02）、嚴格定義（Willison）、光譜（vibe↔spec↔agentic）、prompt→context engineering、何時用哪個；**工具全景比較表**（Claude Code / Codex / Cursor / Gemini CLI / Aider / Copilot） | 只給「地圖與選擇」，實作細節留給後續各篇 |
| 2 | `claude-code.md` | Claude Code 實戰：explore→plan→code→commit、CLAUDE.md、plan mode、skills、subagents、hooks、MCP、`/clear`·`/compact`·`/rewind`、驗證閘門、auto mode、worktrees、headless。模型 Opus/Sonnet/Haiku 4.x（⚠️標日期） | 單一工具操作面（雙主角之一）|
| 3 | `openai-codex.md` | Codex 實戰：CLI（Rust/開源）、cloud/App Server、GPT‑5 系列模型（⚠️標日期表）、AGENTS.md、sandbox/approval、`/review`、skills、MCP | 單一工具操作面（雙主角之二）|
| 4 | `context-engineering.md` | 情境工程：為何 context > prompt；**CLAUDE.md vs AGENTS.md 寫作指南**（include/exclude、size、precedence）；AGENTS.md 跨廠商標準（AAIF，⚠️標日期） | 聚焦「指令／記憶**檔案**」本身 |
| 5 | `agentic-workflows.md` | Agentic 工作流：explore/plan/implement/verify/commit 迴圈、subagent 委派、writer–reviewer、平行 worktrees、headless/CI、interview-then-spec | 聚焦「**會話流程**與平行化」 |
| 6 | `spec-driven-development.md` | 規格驅動開發：spec as source of truth、Spec Kit / Kiro / Tessl（⚠️標日期）、何時 vibe vs spec、SPEC.md 寫法、與 TDD 的關係 | 聚焦「**規格產物**與方法論」 |
| 7 | `verification-and-safety.md` | 驗證、安全與信任邊界：TDD 當驗證閘門、reproduce-then-fix、tests-as-spec、show-evidence、permissions/sandbox、AI 生成碼安全審查、**反過度生成／過早抽象實務守則**、Small CLs/Boy Scout 在 AI 協作下的應用 | 聚焦「**閘門、安全與工程紀律**」 |

> **避免重複的關鍵切線**：#4＝指令檔（CLAUDE.md/AGENTS.md），#5＝會話流程，#6＝規格產物，#7＝閘門與紀律。起草時若兩篇開始講同一件事，即為過度生成訊號，須回此表重劃邊界。

> **註（對抗式審查 + D1 決議）**：7 篇是你的編輯選擇；反過度生成的紅線改為**「無空殼、不重複」** —— 每篇都要過 content contract。任何一篇若起草後份量單薄、或與鄰篇重疊，就應**合併**回去（與「過早抽象」對稱的反向修正）。

**既有文件的最小改動**（不重寫）：
- `code-generation.md`：頂部加一段「2026 更新」短框，說明一次性範本如何融入 agentic 迴圈；底部 Next Steps 加一條連到新章節。
- `intro.md`：學習路徑加一條指向新章節 + 一句典範轉移。

## 5. 驗收閘門（先定義，後實作 —— TDD 的「test」）

**用 repo 既有能力，不新增工具**：

1. `npm run build` 必須綠燈。`onBrokenLinks: 'throw'`（站內死連結會讓 build 失敗）—— 這就是最強的連結閘門。
2. build 會建**所有 locale**；因此每篇新英文文件**必須**有 zh-TW twin，否則 zh-TW（預設語系）會 fallback 成英文 = 視為缺陷。
3. sidebar ↔ 檔案耦合：`sidebars.js` 的 doc id 必須對應實際存在的檔案，否則 build fail。
4. blog 的 `authors: [thc1006]` 必須在 `blog/authors.yml` 與 `i18n/zh-TW/.../authors.yml` 都解析得到（兩邊都已有 thc1006）。
5. **MDX 地雷**（`.md` 在 Docusaurus 3 以 MDX 解析）：程式碼圍欄外不可出現裸 `<` `>` `{` `}`（例如 `<FUNCTION>`、`List<T>`、JSX 樣的 tag），佔位符一律放進 backtick / fenced block；散文中的 `$` 會被當數學，需跳脫。
6. 既有 `.lighthouserc.js`（Lighthouse CI）與 GitHub Actions 維持不變即為效能閘門。

> 每個 PR 的「Green 證據」= 該 PR 分支上的 `npm run build` 成功輸出 + 受影響頁面在 en/zh-TW 皆可達。

## 6. 事實帳本（只收「≥5 份權威來源一致」的 certified 事實）

> 規則：唯有 ≥5 份獨立權威來源一致的觀點，才可寫進手冊當資料來源。以下為 certified；§7 列出**不可採用**的未達標主張。完整來源見 §11。
>
> **兩種層級（經對抗式審查補強，避免誤稱證據強度）**：(A)「**≥5 來源 certified**」＝原則性 / 跨廠商一致的觀點（典範、工程紀律、跨工具實務）；(B)「**一手＋標日期**」＝單一廠商 / 單一公告的事實（各模型版本日期、AGENTS.md「60,000+ repos」）—— 這些**未達 ≥5**，事實雖經查證為真，但屬單一來源，內文必須 **inline 註明出處＋標「截至 2026-06」**，且只放進可更新的表格、不寫進常青散文。下列以 ⚠️ 標出屬於 (B) 者。

### 6.1 典範（CERTIFIED）
- **vibe coding** 由 Andrej Karpathy 於 **2025-02-02** 提出；嚴格定義（Simon Willison）＝「用 LLM 建軟體但**不審查**它寫的程式碼」。適合拋棄式原型，不適合正式上線 / 維護 / 安全關鍵系統。
- **spec-driven development**：規格＝source of truth（GitHub：「intent is the source of truth」）。代表工具：**GitHub Spec Kit**（2025-09-02 開源）、**AWS Kiro**（2025 年中 preview）、**Tessl**。
- **context engineering** 於 **2025 年中**取代 prompt engineering 成為偏好用語：Tobi Lütke（2025-06-18）提出、Karpathy（約 2025-06-25）背書；Anthropic 於 2025-09-29 將其定調為「prompt engineering 的自然演進」。
- **2026 走向**（趨勢，**非**「≥5 來源共識」）：三者互補的光譜 —— 探索用 vibe、上線用 spec；Karpathy 於 2026-02（vibe coding 滿一年）提出以 **agentic engineering** 為框架（開發者轉為 steering / reviewing / 架構決策 / 寫測試）。正獲關注，但屬近期單一發起者之重新框定，內文**勿稱「共識」**，須標日期。

### 6.2 OpenAI Codex（CERTIFIED；快速變動，務必標日期）
- 模型線：**GPT‑5‑Codex**（2025-09-15 發表，「GPT‑5 為 agentic coding 進一步優化的版本」，雲端任務與 code review 的預設）→ **GPT‑5.2‑Codex**（2025-12-18）→ **GPT‑5.3‑Codex**（2026-02-05）。 ⚠️ **(B) 層級**：此模型版本鏈為**單一廠商一手來源**（OpenAI 官方自報），未達 ≥5；日期經查證皆正確，但屬最易過期的事實，內文僅放進清楚標「截至 2026-06」的表格，勿寫進常青散文。
- 截至 2026 年中，**GPT‑5.5**（2026-04-23 發表）為當前 frontier，Codex 文件建議「start with `gpt‑5.5`」。
- **Codex CLI**：開源、Rust、Apache‑2.0；`codex exec` 為非互動模式；同時是 **MCP client 與 server**。
- **Sandbox**：read‑only / workspace‑write / danger‑full‑access；**approval**：untrusted / on‑request / never。
- **App Server**（2026-02 發表）：bidirectional **JSON‑RPC 2.0**，統一 CLI / IDE / web / desktop 各端。
- **AGENTS.md**：有明確 lookup/precedence（root→cwd、近者覆蓋遠者）；預設大小上限 **32 KiB**（`project_doc_max_bytes`）；與 `config.toml`（操作設定）分工不同。
- **code review**：CLI `/review`、PR 留言 `@codex review`、可開自動審查，聚焦 P0/P1。
- **Agent Skills**：`SKILL.md`，基於 open agent skills 標準。

### 6.3 AGENTS.md 標準（CERTIFIED）
- **開放、廠商中立**標準，現由 **Linux Foundation 的 Agentic AI Foundation（AAIF）** 治理（2025-12-09 宣布，與 MCP、goose 並列）；最初由 OpenAI 於 ~2025-08 釋出。
- 跨工具廣泛採用（⚠️ **(B) 層級**：**60,000+** repos 為 AAIF 2025-12 公告之**單一一手數字**，非 ≥5 來源，內文須註明出處與日期）；root + 巢狀、近者優先；純 Markdown、無強制 schema。
- 內容原則：**寫 agent 無法自行推得的 intent / constraints**（build/test/lint 指令、慣例、邊界、領域詞彙），**排除**可從程式碼推得或與 README 重複者；**保持精簡**（實務指引 ~100–150 行）。

### 6.4 Claude Code（CERTIFIED；採官方 best practices）
- agentic 編碼環境；**context window 是首要限制**，會隨填滿而退化。
- 工作流 **explore → plan → code → commit**；plan mode 分離研究與實作。
- **CLAUDE.md** 持久記憶（`/init` 生成；保持精簡、定期修剪，過長會被忽略）；可 `@import`。
- **Skills**（`.claude/skills/SKILL.md`）、**subagents**（`.claude/agents/`，獨立 context）、**hooks**（決定性閘門，如 Stop hook）、**MCP**、**plugins**。
- 情境管理 `/clear`·`/compact`·`/rewind`（checkpoint）；驗證閘門 `/goal`、Stop hook、對抗式 review subagent（fresh context 由「不是寫的人」來評）。
- auto mode / permissions / sandbox；平行 sessions / worktrees / headless `claude -p`；writer–reviewer 模式。模型：Opus / Sonnet / Haiku 4.x 系列（⚠️ 截至 2026-06；模型命名易變，內文須標日期）。

### 6.5 跨工具 vendor-neutral 實務（CERTIFIED，來源橫跨多家）
explore→plan→implement→verify→commit；context 為核心限制（clear/compact/scope）；subagent 委派；git worktrees 平行；**機器可判定的驗證迴圈**（tests/build/lint/screenshot）；fresh-context 獨立 reviewer；具體、指名檔案的 prompt/spec、interview-then-spec；把慣例放進 checked-in 情境檔（CLAUDE.md / AGENTS.md / GEMINI.md / `.cursor/rules`）且保持短；headless/CI 要 scoped 權限 + 上限。

### 6.6 工程紀律（CERTIFIED）
- **TDD**：Red‑Green‑Refactor（Kent Beck《TDD By Example》2002；Uncle Bob 三法則）；test-first ＝ executable spec + regression net。agentic 對應：tests/build/lint 當驗證閘門、reproduce-then-fix、tests-as-spec、拿證據而非宣稱、獨立驗證。
- **Boy Scout Rule**：留下比你來時更乾淨（Uncle Bob，《Clean Code》/《97 Things》）；＝小而就地的 opportunistic refactoring（Fowler），**非**大重構。
- **Small CLs**（Google eng-practices）：one self-contained change；~100 行合理、1000 行過大；小 CL review 更快更徹底、更易 rollback。SmartBear/Cisco：review 有效性在 ~200–400 LOC 後下滑、單次 < 60 分鐘。Google ICSE‑2018：中位變更僅 24 行、~90% 動 < 10 檔。
- **反過度生成**：duplication 比錯誤的抽象便宜（Sandi Metz）；YAGNI（Fowler）；Rule of Three（Fowler/Roberts，第三次才重構）；AHA（Kent C. Dodds）。LLM 預設過度生成已被 vendor 與獨立工程師雙重證實；「AI slop / PR slop」推升 reviewer 負擔。

## 7. **不可採用**（未達 ≥5 來源 / contested，明確排除）
- Codex **各端（cloud vs CLI vs review）截至 2026-06 的精確預設模型路由** —— 未證實，內文勿斷言；只說「建議 start with gpt‑5.5、雲端歷史上預設 Codex 系列」。
- 是否存在名為 **「GPT‑5.5‑Codex」的 SKU** —— 未證實，勿寫。
- **Claude Code 是否原生讀 AGENTS.md** —— 來源分歧、版本相依。內文採安全說法：Claude Code 用 **CLAUDE.md**；AGENTS.md 為跨廠商標準。
- vibe coding 的**量化風險數字**（如 19% 變慢、2.74× 漏洞）—— 單一研究來源，勿當定論。
- **PR 體量的廠商百分比**（如「大 1000 行降 70% 缺陷偵測」「快 3×」）—— 多為 vendor blog；另有大型研究指出 PR 大小與 merge 速度**無**直接關係。只用 Google/SmartBear/學術的**方向性**結論。
- 「Gartner 宣稱 context engineering 取代 prompt engineering」的 Gartner 出處 —— 未取得一手，勿引用。
- AGENTS.md「等同模型升級」的量化幅度（Haiku→Opus）—— 單一 Augment 研究，當趨勢、不當數據。

## 8. 風險與緩解
| 風險 | 緩解 |
|---|---|
| **事實老化**（模型版本、CLI flag 變動極快） | 內文**以概念為主、版本為輔**；所有 volatile 事實標「截至 2026-06」+ 日期；避免把版本號寫進標題 / 賣點 |
| **過度生成**（最大紅線） | 每個 PR 指令明寫「最小變更」；4 篇而非 7 篇；reviewer 限縮在正確性/需求 |
| **zh-TW 漏鏡像** → 預設語系 fallback 成英文 | 把「en + zh-TW twin 同時落地」設為每個內容 PR 的 build 閘門驗收項 |
| **MDX 編譯炸裂**（裸 `<>{}` / `$`） | 佔位符一律進 code fence；沿用既有檔案寫法；PR build 即可攔截 |
| **Small CL 失血**（散文天然偏長） | 切割單位改為「一篇文件 = 一個 CL」，每篇獨立綠燈、獨立 rollback |
| **Boy Scout 變 scope creep** | 護欄：清理只限本 PR 已動到的檔案；§9 清單明確標「不要碰」 |

## 9. 範圍外 / 延後（明確不做，避免 scope creep）
真實存在但**不屬於本次**的 tech debt（單獨開 PR 再說）：
- `README.md` 仍是 Docusaurus 樣板說明；`docs/tutorial-basics/**`、`docs/tutorial-extras/**` 是未列入 sidebar 的 orphaned 樣板教學；footer 仍有 Docusaurus 佔位社群連結；根目錄 `OPTIMIZATION_REPORT.md`、`部署指南.md`、`merged_transcript.txt` 等雜散檔。
- 把 `onBrokenMarkdownLinks` 由 `warn` 改 `throw`（會讓既有 doc 的潛在警告變成 build 失敗，風險外溢）。
- **唯一允許的就地 Boy Scout**：升 v2.0 的那個 PR 內，順手把 `docusaurus.config.js` 過時的 `metadata` keywords（仍寫 O‑RAN/5G/6G、無 agents/Codex）補上新主題 —— 因為那個 PR 本來就在動這支檔案。

## 10. PR 分解（Small CLs，每個獨立 build 綠燈）

> 規則（沿用）：`onBrokenLinks: 'throw'` → **連結與其目標必須同一個 PR 落地**；後段 PR 對前段為硬相依（依賴前者已 merge，rollback 須反序）。7 篇文件按主題分組落地，每組是一個 self-contained 變更、可獨立 `npm run build` 綠燈。

| PR | 範圍（self-contained） | 檔案（皆 en + zh‑TW twin） | Gate | 相依 |
|---|---|---|---|---|
| **PR1 — 章節骨架** | `overview.md`（典範＋工具全景表，**先不含**前向 hub 連結）+ category + label | `docs/vibe-coding/overview.md`、`sidebars.js`（category + overview id）、`i18n/zh-TW/.../current.json`（label `sidebar.tutorialSidebar.category.Vibe Coding & AI Agents`） | build 綠燈、雙 locale 可達 | — |
| **PR2 — 雙主角工具** | `claude-code.md` + `openai-codex.md`，同 PR 補 overview→兩篇 hub 連結 | 兩檔×twin、`sidebars.js`（2 ids）、`overview.md`(+twin 補連結) | build；連結解析 | PR1 |
| **PR3 — 指令檔與工作流** | `context-engineering.md` + `agentic-workflows.md` + overview 連結 | 兩檔×twin、`sidebars.js`（2 ids）、`overview.md`(+twin) | build；連結解析 | PR1 |
| **PR4 — 規格與驗證** | `spec-driven-development.md` + `verification-and-safety.md` + overview 連結 | 兩檔×twin、`sidebars.js`（2 ids）、`overview.md`(+twin) | build；連結解析 | PR1 |
| **PR5 — 接線既有文件** | intro 與 code-generation 連入新章節 | `docs/intro.md`+twin、`docs/tutorials/code-generation.md`+twin | build（連結解析） | PR1（連到哪篇再依該 PR）|
| **PR6 — 發布** | 版本 v2.0 + 首頁微調 + 雙語 blog + config keywords | `package.json`(1.0.0→2.0.0)、首頁（見下註）、`blog/2026-06-02-…md`+twin、`docusaurus.config.js` keywords | build（+`typecheck`/`lint` if HomepageFeatures；blog author、`<!--truncate-->`、連結） | PR1 |

**首頁範圍特別註（M3）**：英文 `src/pages/index.js` hero 走 `translate()`/`code.json`；zh-TW `i18n/zh-TW/docusaurus-plugin-content-pages/index.js` 是硬編碼字串，兩邊不對稱。改 feature 卡片需一併動 `src/components/HomepageFeatures/index.js` 與 `i18n/zh-TW/code.json`。config keywords 更新為**刻意範圍內項目**（非 Boy Scout 順手）。

**部署觸發註（m4）**：`deploy.yml` 的 `paths-ignore` 含 `docs/**/*.md`；PR5 只改 docs `.md`，推 main 不觸發部署，需搭非 ignore 變更或 `workflow_dispatch`。PR1–PR4（動 `sidebars.js`/`i18n/`）與 PR6（動 `src/`、`package.json`、blog）會正常觸發。

**更小切割選項**：PR2–PR4 各組還可再拆成「一篇 deep-dive＋其 inbound 連結」的 stacked CL（仍 build-safe），若偏好更小 review（SmartBear/Cisco：~200–400 LOC 後審查有效性下滑）。commit message 允許出現 Claude/Anthropic 字樣。

## 11. 執行模型（核准後 —— 回應你「平行 subagent」要求，但 right-sized）

> 對抗式審查提醒：**平行編排不該比工作本身還重**。只把確實可平行的部分平行化，不為平行而平行。

- **各內容 PR 內**：同組文件彼此無相依，可由多個 writer subagent **平行起草**，各自吃 §6 事實帳本 + §7 黑名單 + content contract（§4）+ 房屋風格（台灣在地化、保留英文技術詞＋括號中文）以防事實漂移與重複；zh-TW twin 由翻譯 subagent 平行產出（餵已定稿英文＋既有翻譯樣本）。
- **共用檔協調**：多篇都要改 `sidebars.js`（同一檔），故 sidebar/label 與 overview 的 hub 連結由**主流程最後統一寫入**，避免平行寫同檔衝突 —— 單一 PR 內整併即可，**現階段不需 git worktrees**。
- **驗證**：一個 fresh-context 對抗式 review subagent 只看 diff＋「正確性/需求」準則（明令「只標影響正確性或既定需求的缺口」以防過度生成），再以 `npm run build` 為決定性閘門、附實際輸出為證據。
- 僅當未來文件數或檔案爭用上升，才引入 worktrees 平行多 PR。

## 12. 決策（已拍板 2026-06-02）
- **D1（範圍粒度）→ 7 篇**（你的選擇；以 §4 的「無空殼／不重複」content contract 護欄落實）。
- **D2（命名/位置）→ 「Vibe Coding 與 AI 編碼代理」/ `Vibe Coding & AI Agents`**，資料夾 `docs/vibe-coding/`，置於 Fundamentals 之後。
- **D3（CI 閘門）→ 只用既有 `npm run build`**（不加新工具，反過度生成）。
- **D4（事實老化）→ 概念為主、volatile 事實標「截至 2026-06」＋放可更新表格**，不寫進常青散文。
- **D5 → v2.0 bump + 雙語 blog**（yes）。

✅ 開放決策已全部拍板，**計畫定案**。下一步需你明確下令才開始實作（你先前指示「先規劃、勿執行」）。

---

### 附錄：代表性權威來源（每群 ≥5，僅列主要一手 / 權威）
- **典範**：Karpathy 原推文；en.wikipedia.org/wiki/Vibe_coding；simonwillison.net/2025/May/1/not-vibe-coding/；thoughtworks.com（spec-driven development）；github.blog（Spec Kit）；martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html；anthropic.com/engineering/effective-context-engineering-for-ai-agents；x.com/tobi（context engineering）。
- **Codex**：developers.openai.com/codex/*（models、cli、guides/agents-md、app-server、integrations/github、skills）；github.com/openai/codex；openai.com/index/introducing-upgrades-to-codex；en.wikipedia.org/wiki/Codex_(AI_agent)；infoq.com/news/2026/02/opanai-codex-app-server；help.openai.com（model release notes）。
- **AGENTS.md**：agents.md；linuxfoundation.org（AAIF 公告）；openai.com/index/agentic-ai-foundation；anthropic.com（捐贈 MCP / AAIF）；github.blog（2,500-repo AGENTS.md 研究）；docs.factory.ai。
- **Claude Code**：code.claude.com/docs/en/best-practices（官方）；platform.claude.com/docs（prompting best practices）；anthropic.com/engineering/effective-context-engineering-for-ai-agents；DataCamp / 多家獨立實務文。
- **跨工具實務**：code.claude.com、developers.openai.com/codex/learn/best-practices、cursor.com/blog/agent-best-practices、geminicli.com/docs、aider.chat/docs、github.blog（Copilot CLI）。
- **TDD**：martinfowler.com/bliki/TestDrivenDevelopment.html；tidyfirst.substack.com（Kent Beck, Canon TDD）；butunclebob.com（Three Rules of TDD）；blog.cleancoder.com；en.wikipedia.org/wiki/Test-driven_development；agentic-coding TDD（Tweag、Augment、Codex/Copilot docs）。
- **Boy Scout / Small CLs**：oreilly.com/library/view/97-things（Martin, ch.8）；martinfowler.com/bliki/OpportunisticRefactoring.html；google.github.io/eng-practices/review/developer/small-cls.html；SmartBear/Cisco study；Sadowski et al. ICSE-SEIP 2018；martinfowler.com/bliki/Yagni.html。
- **反過度生成**：kentcdodds.com/blog/aha-programming；sandimetz.com/blog/2016/1/20/the-wrong-abstraction；martinfowler.com/bliki/Yagni.html；en.wikipedia.org/wiki/Rule_of_three_(computer_programming)；platform.claude.com（Opus over-engineer 自承）；blog.ezyang.com（2025-12，over-defensive code）；arxiv.org/abs/2603.27249（AI slop）。

> 完整、逐條附 ≥5 來源的研究筆記（8 份 subagent 報告）可另存附件；本 RFC 已將其蒸餾為 §6 / §7。
