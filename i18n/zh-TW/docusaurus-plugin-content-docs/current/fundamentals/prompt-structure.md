---
sidebar_position: 3
---

# Prompt Structure & Anatomy

Understanding the building blocks of effective prompts is crucial for consistent AI interactions. This guide breaks down prompt anatomy and provides frameworks for structuring your instructions.

## The CLEAR Framework

Use the **CLEAR** framework to structure your prompts:

- **C**ontext - Set the scene and background
- **L**ength - Specify output length requirements  
- **E**xamples - Provide samples when needed
- **A**ction - Define the specific task
- **R**esults - Describe the expected output format

### CLEAR in Practice

```python
# Context
"""You are a senior software architect reviewing system design proposals."""

# Length  
"""Provide a detailed review of 800-1000 words."""

# Examples
"""
Example feedback format:
✅ Strengths: [list key strengths]
⚠️ Concerns: [list potential issues]
💡 Recommendations: [specific suggestions]
"""

# Action
"""Review the attached microservices architecture design focusing on scalability, maintainability, and security."""

# Results
"""Structure your response as a formal architectural review with sections for strengths, concerns, and recommendations."""
```

## Essential Prompt Components

### 1. Role Assignment

Define who the AI should act as to set appropriate context and expertise level.

**Basic Role:**
```python
"You are a data scientist..."
```

**Advanced Role with Context:**
```python
"""You are a senior data scientist at a Fortune 500 retail company with 
10+ years of experience in customer behavior analysis and predictive modeling. 
You specialize in turning complex data insights into actionable business strategies."""
```

**Multiple Roles:**
```python
"""You are wearing two hats:
1. Technical architect - ensuring scalability and performance
2. Business analyst - considering cost and resource implications"""
```

### 2. Task Definition

Be specific about what you want the AI to accomplish.

**Vague Task:**
```python
"Help me with my presentation"
```

**Clear Task:**
```python
"""Create an outline for a 20-minute presentation on AI ethics for 
a non-technical executive audience, including key talking points, 
potential Q&A topics, and suggested visual aids."""
```

**Multi-Step Task:**
```python
"""Please complete these steps in order:
1. Analyze the provided customer feedback data
2. Identify the top 5 recurring issues
3. Categorize issues by severity (High/Medium/Low)
4. Suggest specific action items for each high-severity issue
5. Create a summary report for stakeholder review"""
```

### 3. Context Setting

Provide relevant background information that influences the output.

**Temporal Context:**
```python
"""Context: This is for our Q4 2024 board meeting, following a challenging 
year with supply chain disruptions and market volatility."""
```

**Audience Context:**
```python
"""Target audience: Technical leads who are familiar with cloud architecture 
but new to Kubernetes deployment strategies."""
```

**Situational Context:**
```python
"""Situation: Our startup just raised Series A funding and needs to scale 
from 10 to 50 engineers in 6 months while maintaining code quality."""
```

### 4. Format Specifications

Define exactly how you want the output structured.

**Simple Format:**
```python
"Format your response as a numbered list with brief explanations."
```

**Structured Format:**
```python
"""
Format your response using this structure:

## Executive Summary
[2-3 sentence overview]

## Key Findings
- Finding 1: [description and impact]
- Finding 2: [description and impact]

## Recommendations
1. **Immediate Actions** (0-30 days)
2. **Short-term Goals** (1-3 months)  
3. **Long-term Strategy** (3-12 months)

## Next Steps
[Specific action items with owners]
"""
```

**Template Format:**
```python
"""Use this exact template for each product review:

**Product:** [name]
**Category:** [category]
**Rating:** [1-5 stars]
**Pros:** [3-4 bullet points]
**Cons:** [2-3 bullet points]  
**Best For:** [target user type]
**Price Value:** [justify rating]
"""
```

### 5. Constraints and Parameters

Set clear boundaries and requirements.

**Length Constraints:**
```python
"""
- Executive summary: exactly 100 words
- Main content: 800-1200 words
- Conclusion: 50-75 words
"""
```

**Style Constraints:**
```python
"""
Writing style requirements:
- Professional but conversational tone
- Use active voice
- Avoid jargon unless defined
- Include relevant statistics
- Write for 8th-grade reading level
"""
```

**Content Constraints:**
```python
"""
Constraints:
- Focus only on open-source solutions
- Budget limit: $50,000 annually
- Must integrate with existing Salesforce system
- Compliance with GDPR and CCPA required
"""
```

## Advanced Structural Patterns

### 1. Hierarchical Prompting

Break complex tasks into hierarchical components.

```python
"""
Primary Goal: Create a comprehensive marketing strategy

Level 1: Strategy Framework
- Market analysis
- Competitive positioning
- Target audience segmentation

Level 2: Tactical Plans (for each Level 1 item)
- Specific initiatives
- Resource requirements
- Success metrics

Level 3: Implementation Details (for high-priority tactics)
- Week-by-week action plans
- Responsible parties
- Dependencies and risks
"""
```

### 2. Conditional Logic

Use if-then statements for complex scenarios.

```python
"""
Analyze this code and provide feedback based on these conditions:

IF the code is a beginner's project:
- Focus on fundamental concepts and best practices
- Provide encouraging feedback with learning resources
- Suggest incremental improvements

IF the code is production-level:
- Emphasize security, performance, and maintainability
- Flag potential issues with severity levels
- Recommend architectural improvements

IF the code has security vulnerabilities:
- IMMEDIATELY flag all security issues
- Provide secure alternatives with examples
- Explain the risks in business terms
"""
```

### 3. Multi-Perspective Analysis

Request analysis from different viewpoints.

```python
"""
Evaluate this business proposal from three perspectives:

🏢 Executive Perspective:
- Strategic alignment
- ROI and financial impact
- Risk assessment

👨‍💻 Technical Perspective:
- Implementation complexity
- Resource requirements
- Technical risks and dependencies

👥 User Perspective:
- User experience impact
- Adoption challenges
- Training and support needs

For each perspective, provide specific concerns and recommendations.
"""
```

## Prompt Optimization Techniques

### 1. Specificity Ladder

Start broad, then add specificity in layers.

**Level 1 (Basic):**
```python
"Write about customer service"
```

**Level 2 (Targeted):**
```python
"Write a guide about customer service for SaaS companies"
```

**Level 3 (Specific):**
```python
"Write a customer service playbook for B2B SaaS companies with 100+ enterprise clients, focusing on technical support escalation procedures"
```

**Level 4 (Highly Specific):**
```python
"""Create a customer service playbook for B2B SaaS companies serving 100+ enterprise clients.

Focus Areas:
- Technical support escalation (L1→L2→L3)
- SLA management and communication
- Enterprise client relationship protocols
- Knowledge base optimization

Format: Operations manual with process flows, templates, and metrics
Audience: Customer success managers and support team leads
Length: 3000-4000 words with actionable checklists"""
```

### 2. Progressive Enhancement

Build prompts by adding enhancement layers.

**Base Prompt:**
```python
"Explain machine learning algorithms"
```

**+ Audience:**
```python
"Explain machine learning algorithms for business executives"
```

**+ Context:**
```python
"Explain machine learning algorithms for business executives considering AI implementation"
```

**+ Format:**
```python
"Explain machine learning algorithms for business executives considering AI implementation, structured as a decision-making framework"
```

**+ Examples:**
```python
"""Explain machine learning algorithms for business executives considering AI implementation, structured as a decision-making framework.

Include real-world examples like:
- Netflix recommendation systems
- Fraud detection in banking  
- Predictive maintenance in manufacturing"""
```

## Common Structural Mistakes

### 1. Buried Instructions
**Problem:** Key instructions hidden in long text
**Solution:** Put critical requirements at the beginning or end

### 2. Conflicting Requirements
**Problem:** Asking for "brief but comprehensive" analysis
**Solution:** Prioritize requirements and be specific about trade-offs

### 3. Unclear Success Criteria
**Problem:** No way to evaluate if the output meets expectations
**Solution:** Define specific, measurable success criteria

### 4. Missing Context Hierarchy
**Problem:** All information treated with equal importance
**Solution:** Clearly indicate what's most important

## Testing Prompt Structure

### Quality Checklist
- [ ] Role clearly defined with appropriate expertise level
- [ ] Task broken into specific, actionable components  
- [ ] Context provided without information overload
- [ ] Output format explicitly specified
- [ ] Constraints and requirements clearly stated
- [ ] Success criteria identifiable

### A/B Testing Framework
1. Create two versions with different structures
2. Test with same input data
3. Compare output quality across dimensions
4. Identify which structural elements improve results
5. Iterate and refine

## Next Steps

Now that you understand prompt structure, explore:
- **[Common Patterns](./common-patterns)** - Learn proven prompting techniques
- **[Practical Tutorials](/docs/tutorials/content-creation)** - Apply structures to real scenarios
- **[Advanced Techniques](/docs/advanced/chain-of-thought)** - Complex prompting strategies

:::tip Structure Template
Save this template for quick prompt structuring:
```
Role: [Who should the AI act as]
Context: [Important background information]  
Task: [Specific action to perform]
Format: [How to structure output]
Constraints: [Limitations and requirements]
```
:::