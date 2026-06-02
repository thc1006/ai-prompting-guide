---
sidebar_position: 8
sidebar_label: 框架工程
---

# Harness Engineering 框架工程

語言模型本身只會產生文字。要把它變成一個會讀程式碼庫、跑測試、讀失敗訊息、再重試的 *agent*，你得用一層 scaffolding 把它包起來：一個控制迴圈、一組工具、一些記憶體，再加上一套決定「接下來該怎麼辦」的策略。實務工作者開始把這層 scaffolding 叫做 **harness**，而設計它的這門手藝就叫 **harness engineering（框架工程）**。這篇文件是本章的總綱。它從任何單一工具往後退一步，問的是：包在模型外面的那層包裝究竟是什麼、它為什麼跟模型本身一樣重要，以及研究文獻對「怎麼把它做好」到底證實了什麼、又沒證實什麼。

先講一個前提，因為它管著底下所有內容。「Harness engineering」與「agent harness」是**業界用語，不是已確立的學術術語**。你在文獻裡找不到一個叫這個名字的領域。不過，它所指向的那個 *概念* 是站得住腳的：關於 agent 架構的學術工作，把一個 agent 框定為**一個 LLM 控制器加上負責記憶、規劃與行動的模組化元件**。我們之所以採用這個業界詞彙，是因為大家就是這樣講；而我們把每一項主張都錨定回那些元件上經同儕審查的研究。

## harness 是什麼（以及不是什麼）

最乾淨的學術框定來自 CoALA（Cognitive Architectures for Language Agents, Sumers et al., TMLR 2024），它把一個 language agent 描述成一個控制器（也就是 LLM）協調**一組模組化元件**：記憶、一組行動，以及一個會循環運作的決策程序。各篇 agent 綜述則從不同角度得到相同的拆解。Wang et al. 的 *Survey on Large Language Model based Autonomous Agents*（Frontiers of Computer Science, 2024）把設計空間整理成 **profile、memory、planning 與 action** 四個模組。不管你偏好哪一套詞彙，一個 harness 就是圍著模型組裝起來的四樣東西：

- 一個**控制迴圈**，反覆呼叫模型並依其輸出採取行動；
- 一組模型可以叫用的**工具**（函式、shell、瀏覽器、retriever）；
- 跨步驟、跨工作階段攜帶狀態的**記憶**；
- 一套**控制策略**，決定何時規劃、何時行動、何時停止，以及接下來該把什麼放到模型面前。

模型負責提供推理。harness 負責提供其餘的一切：模型能看到什麼、能做什麼，以及什麼才算是進展。ReAct（Yao et al., ICLR 2023）是這個迴圈最精簡的實例。模型把推理軌跡與行動交織在一起，而這些行動產生的觀察結果又回饋到下一步。SWE-agent（Yang et al., 2024）則是一個更豐富、為軟體量身打造的實例：它顯示 **agent-computer interface**，也就是交給模型的指令與回饋確切長成什麼樣子，本身就是一個設計面，而不是事後才補的東西。

因此，一個 harness *既不是* 一則 prompt，*也不是* 模型本身。它是夾在兩者中間、被工程化打造出來的系統。若想看實務工作者每天怎麼跑這個迴圈（規劃、委派、驗證），請見[代理式工作流程](/docs/vibe-coding/agentic-workflows)。這篇文件則是墊在它底下的那層概念。

## 為什麼 harness 是第一級變數

harness engineering 的核心主張是：**scaffold 是一個第一級變數，而不是一個包裝細節**。把底層模型固定住、改動 harness，你就同時改變了 agent 能做什麼、以及它要花多少成本。SWE-agent 把這點講得很具體：同一個底層模型，配上一個專門打造的 agent-computer interface，能解掉的真實軟體問題就明顯比同一個模型被天真地驅動時多得多。帶來這份增益的，是 harness，而不是換模型。

我們把這項發現**以方向性、定性的方式**陳述，並刻意在此打住。各家廠商的部落格文章流傳著「同一個模型、不同 scaffold」的戲劇化前後對比百分比。那些特定的擺盪數字**並未獲得學術佐證**，所以這篇文件一個都不引用。真正獲得佐證的，是這項主張的形狀：scaffolding 確實會有意義地撼動能力，而它是在一個必須被計入的成本下做到這件事。

把那份成本算進去，會推翻一個天真的直覺。*AI Agents That Matter*（Kapoor et al., 2024）顯示，當你把準確率對著金錢成本畫出來時，**簡單的 baseline 有可能在 Pareto 意義上輾壓精巧的 agent 架構**：那個花俏的 scaffold，有時候既更貴、又沒有比較準。Holistic Agent Leaderboard（HAL, Kapoor et al., 2025）把這件事推廣成一套受成本控制、跨多個基準的評估，而 tau-bench（Yao et al., 2024）則在貼近真實的設定下，為使用工具的 agent 補強了同樣的結論。這裡的教訓不是「scaffolding 不重要」，而是：scaffolding 是一根真實的工程槓桿，它帶來的好處必須拿來跟它的代價對照衡量，而不是憑空假設。

## 控制迴圈

任何 harness 都有一顆跳動的心臟，那就是 reason-act-observe 迴圈。

```text
        +-----------------------------+
        v                             |
   [ Reason ] --> [ Act (tool) ] --> [ Observe ]
        ^                             |
        |        (stop?) <-----------+
        |           |
     (continue)   [ Done ]
```

ReAct 替這個模式命了名：模型產生一個想法、選一個行動，而這個行動的結果就成了下一個觀察，如此反覆直到任務完成。各 harness 分道揚鑣的地方，在於行動的詞彙表。**工具與函式呼叫（tool and function calling）**讓模型能伸到自己權重之外去。Toolformer（Schick et al., 2023）顯示模型可以學會何時、以及如何去呼叫外部工具（一台計算機、一個搜尋 API），並從中受益。HuggingGPT（Shen et al., NeurIPS 2023）把這個想法再往前推：它把 LLM 當成一個控制器，由它來**規劃、把子任務派發給專家模型，再把它們的輸出組合起來**。

單純的反應（plain reaction）是最簡單的控制策略，但不是唯一一種。把這個迴圈看成一場**刻意的搜尋**，更豐富的策略就打開了。Tree of Thoughts（Yao et al., NeurIPS 2023）把單一一條推理鏈推廣成一棵 agent 可以探索、分支、評估與回溯的樹，用更多計算量去換取在「一次貪婪推進就會失敗」的問題上更好的解。換句話說，控制策略的範圍可以從「每一步反應一次」一直到「在一個計畫空間裡搜尋」，而要把自己擺在這條光譜的哪個位置，是 harness 設計的一個核心決定。

## 驗證與反思迴圈，以及它們的極限

如果這個迴圈能行動，那它也能檢查自己。有一整族技術，會在 harness *內部* 閉合一條回饋迴圈。Self-Consistency（Wang et al., ICLR 2023）取樣多條推理路徑再取多數決，用計算量換取可靠度。Self-Refine（Madaan et al., NeurIPS 2023）讓模型在多次迭代中批判並修訂自己的輸出。Reflexion（Shinn et al., NeurIPS 2023）則加上對回饋訊號的口語化自我反思，並把這份反思留在記憶裡，讓後續的嘗試能更好。用得好，這些技術確實有可量測的幫助。

有一個關鍵的但書，而它是本節最重要的一句話。Huang et al.（*Large Language Models Cannot Self-Correct Reasoning Yet*, ICLR 2024）發現，**內生的自我修正，也就是在沒有外部或有依據的回饋下去修訂推理，常常會失敗，甚至可能讓結果變糟**。模型缺乏一個可靠的內部訊號去判斷 *自己的推理到底是不是錯的*，所以在真空中要求它「檢查你的成果」，可能會把事情弄得更糟、而不是更好。真正撐得住的反思迴圈，是那些以**外部訊號**為依據的：一個測試結果、一則編譯器錯誤、一個工具實際的輸出。Reflexion 的增益靠的是真實的回饋，而不是單憑內省。

設計上的收穫很鮮明。一個驗證迴圈的好壞，只取決於它所消化的那個**有依據的訊號**。把迴圈建立在某個世界可以證偽的東西上，而不是建立在模型對自己的信心上。這正是[驗證與安全](/docs/vibe-coding/verification-and-safety)文件為實務所發展出的那套紀律：要求機器可檢查的證據，而不是 agent 自己的一面之詞。

## 脈絡與記憶管理

模型的 context window 就是 harness 的工作記憶，而它的行為並不像一塊均勻的緩衝區。Liu et al.（*Lost in the Middle*, TACL 2024）記錄到，**當相關資訊落在一段長脈絡的中間時，效能會下滑**：模型對開頭與結尾最為留意，對中段的利用率則掉下來。所以一段長脈絡，並不會自動就是一段被好好利用的脈絡。光是塞進更多東西，反而可能有害。

由此延伸出兩種回應，而且它們互補。第一種是**檢索（retrieval）**：與其把所有東西都握在手裡，不如按需去撈取相關的那一片。Retrieval-Augmented Generation（Lewis et al., NeurIPS 2020）確立了「把生成錨定在被撈取出來的文件上」這個模式，而要讓一個 agent 取用到比 window 裝得下還多的知識，它至今仍是骨幹。第二種是**結構化、OS 風格的記憶**。MemGPT（Packer et al., 2023）把 context window 當成 RAM，在它與更大的外部儲存之間把資訊換進換出，於是 agent 自己管理起自己的記憶階層。A-MEM（Xu et al., NeurIPS 2025）探索一種代理式記憶，會把 agent 長時間學到的東西加以組織與連結。CoALA 把這一切綰結起來，方法是把記憶當成架構裡的一級模組，而不是 prompt 偶然帶出來的副產物。

把這些統一起來的原則，是**最小充分脈絡（minimal sufficient context）**：在模型面前只放下對當前這一步而言真正必要的那一最小組資訊，不多放。這是一個 harness 設計目標，透過檢索與記憶管理來實現，而它也正是[脈絡工程](/docs/vibe-coding/context-engineering)裡那些關於「該怎麼挑選填進 window 的內容」的實務建議的概念根源。

## 評估用的 harness

agent 是被**以執行為依據的基準（execution-grounded benchmarks）**所評斷的：問的不是「答案看起來對不對」，而是「實際跑起來行不行」。一個評估用的 harness 會佈置出一個環境、讓 agent 在裡頭行動，再拿結果去對著 ground truth 評分。橫跨這些基準的頭條發現，令人清醒。**在貼近真實的任務上，前沿 agent 仍遠低於人類或天花板水準。**經查證的數字如下：

- **SWE-bench**（Jimenez et al., ICLR 2024）要求 agent 去解掉真實的 GitHub issue。在原始論文裡，表現最好的**裸模型解掉了約 1.96%** 的 issue，生動地說明了一個沒有 scaffold 的模型，離真正做得了軟體工作有多遠。
- **WebArena**（Zhou et al., 2024）把 agent 放進貼近真實的網頁環境裡。表現最好的 **GPT-4 agent 達到 14.41%** 的端到端任務成功率，對照之下**人類的成功率是 78.24%**。
- **GAIA**（Mialon et al., 2023）提出一些對人來說容易、對系統來說困難的助理型問題。**人類拿到約 92%**；**搭配外掛的 GPT-4 大約只拿到 15%**。
- **tau-bench**（Yao et al., 2024）在動態的客服情境下評估使用工具的 agent。**最先進的函式呼叫 agent 拿到不到 50%**，而在重複下的可靠度更糟：**在零售領域，pass^8 掉到 25% 以下**（關於 `pass^k` 與長程衰退，請見後面幾節）。

AgentBench（Liu et al., ICLR 2024）在一套廣泛的多環境組合裡佐證了同一個模式，而 HAL（Kapoor et al., 2025）則在成本控制下把許多這類基準彙整起來。一致的訊息是：示範與可靠之間的落差很大，而評估用的 harness 就是你用來對這件事保持誠實的方式。

## 可靠度、可重現性，以及一份懷疑者的檢查清單

基準數字的可信度，只跟產生它的方法學一樣高，而一條日益壯大的研究脈絡主張：agent 評估一直**系統性地過於寬鬆**。*AI Agents That Matter*（Kapoor et al., 2024）點出幾個反覆出現的問題：**對成本視而不見的比較**，只報準確率卻無視金錢與 token；以及只盯著單一一次最佳執行、而不看可靠度。*Establishing Best Practices for Rigorous Agentic Benchmarks*（Zhu et al., 2025）盤點了被廣泛使用的基準裡的**效度缺陷（validity flaws）**，從任務建構一路到評分。SWE-rebench（2025）對付的則是**資料污染**：當評估任務早於模型的訓練截止時間，模型可能已經看過答案，於是分數是被資料外洩、而不是被能力給灌出來的。

把這些蒸餾成一份你可以套用到任何 agent 主張上的檢查清單：

- **成本有被控制嗎？**一個沒有附上金錢與 token 成本的準確率數字，只是半個結果；要求拿出 Pareto 視角（Kapoor et al., 2024；HAL, 2025）。
- **資料有可能外洩嗎？**檢查任務是否晚於訓練截止時間；偏好持續更新的資料集（SWE-rebench, 2025）。
- **在非決定性下，結果可重現嗎？**取樣讓單一一次執行變成擲銅板；一個靠單一一次幸運推進撐起來的主張，不算是一項發現。
- **基準本身有效嗎？**確認任務量到的就是它宣稱要量的，而且評分器是健全的（Zhu et al., 2025）。
- **可靠度勝過巔峰值。**偏好 **`pass^k`**（在全部 `k` 次獨立嘗試上都成功）勝過 **`pass@1`**（至少成功一次）。tau-bench 崩塌的 `pass^8` 說明了原因：一個看一次還好的數字，在重複下可能其實不可靠。

貫穿全文的主軸是：一個 harness 不會因為曾經登頂某張排行榜一次就算「好」。它要好，得是它的結果能撐過成本核算、污染檢查與重複執行。

## 長程下的失效模式

上面那些基準落差，有一個結構性的成因：**錯誤會在長程中累積複利**。迴圈裡的每一步都帶著某種出錯的機率，而橫跨許多步，那些機率就層層串聯起來，於是隨著任務變長，端到端的可靠度就衰退。tau-bench 透過 `pass^k` 的崩塌把這件事變得可量測：一個在單次嘗試上通常會成功的 agent，當它必須一再成功時就變得不可靠，因為各個獨立的出錯機會會累積起來。*Lost in the Middle* 貢獻了一種相關的衰退：隨著運行中的脈絡在一個長任務裡愈長愈大，agent 利用其中段的能力就退化，於是後面的步驟是在一段它用得很差的脈絡上推理。

多 agent 系統並不能逃過這一點；它們反而新增了一些失效的方式。MAST（*Why Do Multi-Agent LLM Systems Fail?*, Cemri et al., 2025）建立了一套**多 agent 失效模式的分類學**，橫跨規格與協調問題、agent 之間的失準，以及驗證上的缺口。agent 愈多就意味著愈多次交接，而每一次交接都是另一個讓脈絡被丟掉或讀錯的面。而墊在這一切底下的，是 Huang et al.（2024）那項結果：正因為 agent 無法單憑內省可靠地自我修正，一個早期的錯誤並不會自動在鏈條後段被攔下來。它會擴散下去。

實務上的含義，是把**長程的長度當成一條風險軸**。一個工作流程愈長、愈多 agent，它就愈需要有依據的查核點、被限定的範圍，以及外部的驗證，正是因為可靠度沒辦法靠它自己撐住。

## 設計原則

文獻指向一組一致的 harness 設計原則。沒有一條是稀奇古怪的；它們合起來描繪出的，是一個 *順著* 模型的極限、而不是跟它對著幹的 scaffold。

- **明確拆解。**把一個任務拆成被明說出來的子目標，而不是要求它一步登天。Plan-and-Solve（Wang et al., ACL 2023）、Least-to-Most（Zhou et al., ICLR 2023）與 Decomposed Prompting（Khot et al., ICLR 2023）全都顯示，有結構的拆解勝過一次不分化的整體推進。
- **替每一條驗證迴圈找依據。**圍繞著外部訊號（一個測試、一個編譯器、一個工具的結果）去建立自我檢查，絕不單憑內省，依 Huang et al.（2024）。Reflexion 風格的迴圈，是靠真實回饋掙來它的增益。
- **限定自主程度，並在划算的地方使用刻意的搜尋。**Tree of Thoughts（2023）顯示，在困難的問題上，搜尋勝過貪婪的反應，但搜尋要花計算量，所以要刻意地花，並對 agent 無人看管能跑多遠設個上限。
- **把工具與 agent 介面工程化。**SWE-agent（2024）與 HuggingGPT（2023）證明，指令與回饋的形狀，也就是 agent-computer interface，是一根主要的槓桿，而不是包裝。
- **讓脈絡保持最小且充分。**依循 *Lost in the Middle*（2024），只供給最小必要的那一片；更多脈絡並不等於更多能力。
- **偏好受成本約束的簡單。**伸手去拿能達標的最簡單 scaffold，只有在複雜度於成本核算下能自償時，才把它加上去（*AI Agents That Matter*, 2024）。簡單的 baseline 常常會贏。

## 哪些尚未被確立

:::warning 不要過度宣稱
要精準地分清楚這篇文件主張了什麼、又沒主張什麼。

- **「Harness engineering」是業界用語，不是一個學術領域。**沒有一門以這個名字命名、經同儕審查的學科。有依據的概念，是**LLM 控制器加上模組化元件**的架構（CoALA；各篇 agent 綜述）。這個詞你可以自在地用，但不要把它當成已確立的術語呈現。
- **那些瘋傳的「scaffold 擺盪」百分比被排除在外。**特定的「同模型、不同 scaffold」百分比跳升，只在**廠商部落格**裡流傳，並未獲得學術佐證。這篇文件只做**方向性**的主張（scaffolding 是一個第一級變數），不引用任何擺盪數字。
- **這裡不主張「lost in the middle」有任何單一的機制成因。***Lost in the Middle* 記錄的是**位置上的退化效應**；這篇文件回報的是那個效應，而不是它背後某個確定的機制。
- **基準數字是某個時間點的快照。**所引用的數字（SWE-bench、WebArena、GAIA、tau-bench）來自被引用的論文，反映的是它們當時的快照；請把它們當成那道落差的示意，而不是當成今天的前沿。
:::

:::tip 下一步
這篇文件是本章的概念總綱。要把它付諸實踐：

- [代理式工作流程](/docs/vibe-coding/agentic-workflows)：每天怎麼跑這個迴圈，規劃、委派、驗證、平行化。
- [脈絡工程](/docs/vibe-coding/context-engineering)：挑選填進 window 的內容，也就是最小充分脈絡的實務面貌。
- [驗證與安全](/docs/vibe-coding/verification-and-safety)：有依據的驗證關卡，以及讓自主變得安全的那套紀律。
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
