---
sidebar_position: 4
---

# Common Prompting Patterns

Master these proven prompting patterns to handle a wide variety of AI tasks effectively. Each pattern serves specific use cases and can be combined for more sophisticated interactions.

## Core Patterns

### 1. Few-Shot Learning Pattern

Provide examples to guide the AI's understanding and output format.

**When to use:** New tasks, specific formatting, consistent style requirements

**Structure:**
```python
"""
[Task description]

Examples:
[Example 1: Input → Output]
[Example 2: Input → Output]
[Example 3: Input → Output]

Now apply this pattern to:
[Your specific input]
"""
```

**Real Example:**
```python
"""
Extract key information from customer support tickets:

Examples:

Ticket: "My login isn't working and I have an important presentation tomorrow"
Extraction:
- Issue: Authentication failure
- Urgency: High (time-sensitive business need)
- Category: Technical Support
- Next Action: Priority troubleshooting

Ticket: "Could you add a feature to export data as CSV?"
Extraction:
- Issue: Feature request
- Urgency: Low (enhancement)
- Category: Product Development
- Next Action: Feature evaluation process

Now extract from:
"The app keeps crashing when I try to upload large files over 100MB"
"""
```

### 2. Chain-of-Thought Pattern

Break down complex reasoning into step-by-step thinking.

**When to use:** Complex problem-solving, mathematical calculations, logical reasoning

**Structure:**
```python
"""
[Problem statement]

Let's think through this step by step:
1. [First consideration]
2. [Next logical step]
3. [Building on previous steps]
...
Therefore: [Conclusion]
"""
```

**Real Example:**
```python
"""
Determine the best pricing strategy for our new SaaS product.

Let's think through this step by step:
1. Analyze our target market size and willingness to pay
2. Evaluate competitor pricing models and positioning
3. Calculate our costs (development, hosting, support, sales)
4. Determine required profit margins for sustainability
5. Consider different pricing models (freemium, tiered, usage-based)
6. Test assumptions against customer discovery interviews
7. Model revenue scenarios for each option

Based on this analysis, recommend the optimal pricing structure.
"""
```

### 3. Role-Based Pattern

Assign specific expertise and perspective to the AI.

**When to use:** Domain-specific tasks, expert analysis, specialized knowledge

**Structure:**
```python
"""
You are a [specific role] with [relevant experience/expertise].

[Context about the situation]

As this expert, [specific task with role-appropriate considerations].
"""
```

**Real Example:**
```python
"""
You are a cybersecurity architect with 15 years of experience in enterprise security, specializing in cloud infrastructure and zero-trust implementations.

Our company is migrating from on-premises to AWS cloud infrastructure and needs to design a comprehensive security framework.

As a cybersecurity expert, evaluate our current security posture, identify migration risks, and design a phased security implementation plan that maintains business continuity while achieving zero-trust architecture.
"""
```

### 4. Perspective-Taking Pattern

Analyze from multiple viewpoints or stakeholder perspectives.

**When to use:** Complex decisions, stakeholder analysis, comprehensive evaluation

**Structure:**
```python
"""
Analyze [situation/decision] from these perspectives:

Perspective 1 - [Stakeholder A]:
[Their concerns, priorities, constraints]

Perspective 2 - [Stakeholder B]:
[Their concerns, priorities, constraints]

Perspective 3 - [Stakeholder C]:
[Their concerns, priorities, constraints]

Synthesis: [Balanced recommendation considering all perspectives]
"""
```

**Real Example:**
```python
"""
Analyze the decision to implement AI-powered customer service chatbots from these perspectives:

Perspective 1 - Customer Experience Team:
- Impact on customer satisfaction and resolution times
- Quality of automated responses vs. human interaction
- Handling of complex or emotional customer issues

Perspective 2 - Finance/Operations:
- Implementation costs vs. long-term savings
- ROI timeline and break-even analysis
- Staffing implications and retraining costs

Perspective 3 - Customer Service Representatives:
- Job security and role evolution concerns
- New skills and responsibilities required
- Workload changes and job satisfaction impact

Synthesis: Provide a balanced implementation strategy that addresses each group's concerns.
"""
```

### 5. Template-Based Pattern

Provide specific output templates for consistency.

**When to use:** Standardized outputs, reporting, consistent formatting

**Structure:**
```python
"""
[Task description]

Use this exact template:

## [Section 1]
[Specific requirements for this section]

## [Section 2]  
[Specific requirements for this section]

[Additional formatting requirements]
"""
```

**Real Example:**
```python
"""
Create a competitive analysis report for our project management software.

Use this exact template:

## Executive Summary
[2-3 sentences highlighting key findings]

## Competitive Landscape
- **Primary Competitors:** [List top 3]
- **Emerging Threats:** [List 2-3 up-and-coming players]

## Feature Comparison Matrix
| Feature | Our Product | Competitor A | Competitor B | Competitor C |
|---------|-------------|---------------|---------------|---------------|
[Complete comparison table]

## Pricing Analysis
[Detailed pricing comparison with value proposition analysis]

## Strategic Recommendations
1. **Immediate Actions** (0-3 months)
2. **Medium-term Strategy** (3-12 months)
3. **Long-term Vision** (1-3 years)
"""
```

## Advanced Patterns

### 6. Iterative Refinement Pattern

Build solutions through successive refinement.

**Structure:**
```python
"""
[Initial request]

First, provide a basic [solution/analysis].

Then, refine it by:
- [Refinement criteria 1]
- [Refinement criteria 2]
- [Refinement criteria 3]

Finally, present the polished version.
"""
```

**Example:**
```python
"""
Design a user onboarding flow for our mobile app.

First, provide a basic onboarding sequence covering essential steps.

Then, refine it by:
- Adding personalization based on user goals
- Incorporating progressive disclosure principles
- Optimizing for different user technical skill levels
- Including retention-focused engagement hooks

Finally, present the polished onboarding flow with rationale for each decision.
"""
```

### 7. Constraint-Based Pattern

Define specific limitations that shape the solution.

**Structure:**
```python
"""
[Task description]

Work within these constraints:
- Constraint 1: [Specific limitation]
- Constraint 2: [Specific limitation]
- Constraint 3: [Specific limitation]

Given these limitations, [specific request for optimized solution].
"""
```

**Example:**
```python
"""
Design a marketing campaign for our new productivity app.

Work within these constraints:
- Budget: Maximum $25,000 for 3 months
- Team: 2 part-time marketers, no design resources
- Audience: Small business owners (10-50 employees)
- Timeline: Campaign must launch in 6 weeks
- Channels: Limited to social media and email (no paid advertising)

Given these limitations, create a comprehensive campaign strategy that maximizes reach and conversion potential.
"""
```

### 8. Comparative Analysis Pattern

Structure comparisons systematically.

**Structure:**
```python
"""
Compare [Option A] vs [Option B] across these dimensions:

Dimension 1 - [Criteria]:
- Option A: [Analysis]
- Option B: [Analysis]
- Winner: [Choice with reasoning]

Dimension 2 - [Criteria]:
- Option A: [Analysis]  
- Option B: [Analysis]
- Winner: [Choice with reasoning]

Overall Recommendation: [Final choice with comprehensive reasoning]
"""
```

### 9. Scenario Planning Pattern

Explore multiple future scenarios and responses.

**Structure:**
```python
"""
Develop scenario plans for [situation]:

Scenario 1 - [Optimistic case]:
- Assumptions: [Key assumptions]
- Outcomes: [Expected results]
- Strategy: [Recommended approach]

Scenario 2 - [Realistic case]:
- Assumptions: [Key assumptions]
- Outcomes: [Expected results]  
- Strategy: [Recommended approach]

Scenario 3 - [Pessimistic case]:
- Assumptions: [Key assumptions]
- Outcomes: [Expected results]
- Strategy: [Recommended approach]

Contingency Planning: [Flexible strategies that work across scenarios]
"""
```

## Pattern Combinations

### Combining Role + Chain-of-Thought

```python
"""
You are a financial advisor with expertise in tech startups.

A client asks whether to raise Series A now or bootstrap for another year. Walk through your decision-making process step by step:

1. First, assess the current financial runway and burn rate
2. Then, evaluate market timing and investor climate  
3. Next, analyze competitive positioning and growth trajectory
4. Consider the dilution trade-offs of raising now vs. later
5. Factor in team bandwidth and operational focus
6. Finally, provide your recommendation with clear rationale

Present your analysis as you would to a client meeting.
"""
```

### Combining Few-Shot + Template

```python
"""
Create product requirement documents following this pattern:

Example PRD:
**Feature:** Dark Mode Toggle
**Problem:** Users report eye strain during extended evening usage
**Success Metrics:** 40% adoption rate, 15% increase in evening engagement
**Requirements:**
- System-wide dark theme implementation
- User preference persistence
- Smooth theme transition animations

Now create PRDs for these features:
- Advanced search filters
- Real-time collaboration
- Mobile offline mode

Use the same template structure for each.
"""
```

## Pattern Selection Guide

| Use Case | Recommended Pattern | Why |
|----------|-------------------|-----|
| New task format | Few-Shot Learning | Examples clarify expectations |
| Complex problem | Chain-of-Thought | Breaks down reasoning steps |
| Domain expertise | Role-Based | Leverages specialized knowledge |
| Stakeholder decisions | Perspective-Taking | Considers all viewpoints |
| Consistent outputs | Template-Based | Ensures format standardization |
| Limited resources | Constraint-Based | Optimizes within boundaries |
| Multiple options | Comparative Analysis | Systematic evaluation |
| Future planning | Scenario Planning | Prepares for uncertainty |

## Anti-Patterns to Avoid

### 1. Pattern Overload
**Problem:** Using too many patterns in one prompt
**Solution:** Choose 1-2 complementary patterns maximum

### 2. Mismatched Patterns
**Problem:** Using Few-Shot for creative tasks requiring originality
**Solution:** Match pattern to task requirements

### 3. Generic Role Assignment
**Problem:** "You are an expert" without specific domain
**Solution:** Define specific expertise and experience level

### 4. Incomplete Examples
**Problem:** Few-shot examples that don't cover edge cases
**Solution:** Include diverse, comprehensive examples

## Practice Exercises

1. **Pattern Identification:** Review your recent prompts - which patterns were you unconsciously using?

2. **Pattern Switching:** Take a basic prompt and rewrite it using three different patterns

3. **Combination Testing:** Combine two patterns for a complex task and compare results

## Next Steps

Ready to apply these patterns? Explore:
- **[Practical Tutorials](/docs/tutorials/content-creation)** - Apply patterns to real scenarios
- **[Advanced Techniques](/docs/advanced/chain-of-thought)** - Sophisticated pattern combinations
- **[Best Practices](/docs/best-practices/testing-prompts)** - Optimize pattern effectiveness

:::tip Pattern Library
Create a personal library of proven pattern combinations for your most common use cases. This becomes your prompting toolkit for consistent, high-quality results.
:::