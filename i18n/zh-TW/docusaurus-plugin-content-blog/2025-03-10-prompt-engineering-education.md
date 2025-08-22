---
slug: prompt-engineering-education
title: Prompt Engineering 教育實踐：從技術到人文的跨領域思考
authors: [thc1006]
tags: [prompt-engineering, education, AI, interdisciplinary, open-source]
---

# Prompt Engineering 教育實踐：從技術到人文的跨領域思考

作為一個「技能樹亂點」的人——從醫學、電機資訊到戲劇，我發現 Prompt Engineering 正是一門需要跨領域思維的藝術。今天想分享一些關於如何教學和學習 prompt engineering 的思考。

<!--truncate-->

## 為什麼 Prompt Engineering 需要跨領域視角？

在清大電機資訊學院的學習，讓我理解技術的深度；在政大學習捷克語，讓我體會語言的細膩；而對戲劇的興趣，則讓我明白如何「導演」一場人機對話。

Prompt Engineering 恰恰需要這三者的結合：
- **技術理解**：知道 AI 模型的能力邊界
- **語言敏感**：精準表達意圖
- **創意思維**：設計有效的互動模式

## 教學框架：CLEAR 方法論

基於教學經驗，我整理出 CLEAR 框架來教授 prompt engineering：

### C - Context（情境設定）
```python
# 不好的 prompt
"寫一篇文章"

# 好的 prompt - 提供充分情境
"""
你是一位科技記者，正在為《科學人》雜誌撰寫專欄。
讀者群體是對科技有興趣但非專業背景的大眾。
請以淺顯易懂的方式，解釋量子計算的基本概念。
文章長度約 800 字，需要包含一個生活化的比喻。
"""
```

### L - Language（語言精準）
不同語言背景影響 prompt 效果。我的多語言學習經驗讓我發現：

```python
# 英文 prompt（較直接）
"Analyze the data and provide insights"

# 中文 prompt（較婉轉）
"請協助分析這份數據，並提供您的見解"

# 混合使用（技術詞彙保留英文）
"請分析這個 dataset，找出關鍵的 patterns 和 insights"
```

### E - Examples（範例學習）
```python
def create_few_shot_prompt(task, examples):
    """
    透過範例教導 AI 期望的輸出格式
    """
    prompt = f"任務：{task}\n\n"
    prompt += "範例：\n"
    
    for i, example in enumerate(examples, 1):
        prompt += f"輸入 {i}: {example['input']}\n"
        prompt += f"輸出 {i}: {example['output']}\n\n"
    
    return prompt
```

### A - Audience（受眾考量）
根據不同受眾調整 prompt：

```python
audience_prompts = {
    "小學生": "用小朋友能懂的方式，像說故事一樣解釋",
    "專業人士": "使用專業術語，提供技術細節和引用來源",
    "決策者": "重點放在商業影響和 ROI，提供執行摘要"
}
```

### R - Refinement（迭代優化）
```python
class PromptRefiner:
    def __init__(self):
        self.history = []
    
    def refine(self, prompt, feedback):
        """
        基於反饋迭代改進 prompt
        """
        self.history.append({
            'prompt': prompt,
            'feedback': feedback,
            'timestamp': datetime.now()
        })
        
        # 分析哪些部分需要改進
        improvements = self.analyze_feedback(feedback)
        
        # 生成改進版本
        refined_prompt = self.apply_improvements(prompt, improvements)
        
        return refined_prompt
```

## 實踐案例：跨領域應用

### 1. 醫學 + AI：症狀分析助手
結合醫學背景，設計醫療諮詢 prompt：

```python
medical_prompt = """
注意：這只是教育示範，不能替代專業醫療建議。

作為醫學知識助手，請分析以下症狀：
- 症狀描述：{symptoms}
- 持續時間：{duration}
- 年齡性別：{demographics}

請提供：
1. 可能的鑑別診斷（按可能性排序）
2. 建議的檢查項目
3. 何時應該就醫的警訊

輸出格式：使用易懂的語言，避免造成恐慌。
"""
```

### 2. 戲劇 + AI：劇本創作
運用戲劇知識，引導 AI 創作：

```python
drama_prompt = """
你是一位劇作家，請創作一個短劇場景：

【設定】
- 地點：深夜的便利商店
- 角色：店員 A（20歲大學生）、顧客 B（50歲上班族）
- 衝突點：兩人對「成功」的定義完全不同

【要求】
- 對話要展現角色性格
- 包含一個轉折點
- 結尾保持開放性

請用劇本格式撰寫（包含舞台指示）。
"""
```

### 3. 教育 + AI：個人化學習
```python
def create_adaptive_learning_prompt(student_profile):
    """
    根據學生特質生成個人化學習內容
    """
    prompt = f"""
    學生檔案：
    - 學習風格：{student_profile['learning_style']}
    - 先備知識：{student_profile['prior_knowledge']}
    - 興趣領域：{student_profile['interests']}
    
    請為這位學生設計一個關於「{student_profile['topic']}」的學習活動。
    
    要求：
    1. 連結到學生的興趣領域
    2. 符合其學習風格
    3. 從已知概念出發，逐步深入
    4. 包含互動元素
    """
    return prompt
```

## 開源精神：共享與協作

作為開源社群的參與者，我相信知識應該自由流通。以下是一些開源的 prompt engineering 資源：

### 我的開源貢獻
- **GitHub 專案**：各種 prompt 模板和工具
- **HackMD 筆記**：技術文件和教學材料
- **COSCUP 分享**：議程規劃和社群交流

### 推薦的學習資源
```yaml
learning_resources:
  基礎:
    - Prompt Engineering Guide (開源)
    - OpenAI Cookbook
    - Anthropic 的 Prompt 設計文檔
  
  進階:
    - LangChain 文檔
    - Few-shot Learning 論文
    - Chain-of-Thought Prompting 研究
  
  實作:
    - Hugging Face 課程
    - Google Colab 範例
    - Local LLM 實驗（Ollama）
```

## 給初學者的建議

1. **從模仿開始**：收集好的 prompt，理解其結構
2. **大量實驗**：同一個任務嘗試不同表達方式
3. **記錄和反思**：建立自己的 prompt 庫
4. **跨領域思考**：將其他領域的知識帶入
5. **參與社群**：開源協作，互相學習

## 展望未來：AI 時代的必備素養

Prompt Engineering 不該只是程式設計師的專利，而應該變成每個人都要有的基本技能。就像我們以前教小朋友怎麼用 Google 搜尋，現在我們需要教的是：

- **跟 AI 溝通的藝術**：怎麼讓 AI 懂你在說什麼
- **批判思考**：不要全信 AI 的答案，要會判斷對錯
- **負責任使用**：不要什麼都交給 AI，要知道界線在哪裡
- **保護隱私安全**：不要把個資或公司機密交給 AI 處理

## 結語

Prompt Engineering 是技術與人文的交會點。它需要我們既理解機器的語言，也不忘人類溝通的藝術。

正如我的跨領域學習之旅，每個人都可以從自己的背景出發，為這個領域帶來獨特的視角。無論你是工程師、教育者、醫療人員還是藝術家，都能在 prompt engineering 中找到發揮的空間。

期待在 COSCUP 2025 與大家分享更多想法，一起探索 AI 時代的溝通藝術！

---

*作者簡介：蔡秀吉，清大電機資訊學院學生，COSCUP 2025 O-RAN in B5G/6G 議程軌籌辦人。興趣橫跨資訊工程、神經科學、心理學、精神醫學、偏鄉教育、本土語言到戲劇表演。相信跨領域思維是創新的關鍵。*

*聯繫方式：[個人網站](https://www.thc1006.cc) | [GitHub](https://github.com/thc1006) | Email: hctsai1006@cs.nctu.edu.tw*