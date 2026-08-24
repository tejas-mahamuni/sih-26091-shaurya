# SIH 2026 Problem Selection Analysis — PS 26091

## AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant for Rural Micro-Entrepreneurs

> **Selection basis:** This analysis aligns PS 26091 with our team's **Problem Selection Engine** from `README.md`.
>
> Core principle:
>
> **“A great hackathon idea is usually not the most advanced. It is the most believable one with the strongest demo.”**

---

# 1. Executive Summary

## Final Verdict: 🟢 STRONG GREEN

PS 26091 is a **strong #1 candidate for our team**.

The problem combines:

- AI / NLP
- Hyper-local market intelligence
- Financial planning
- Government scheme matching
- Risk analysis
- Competitor analysis
- GIS / maps
- Multilingual interaction
- Business simulation

The strongest positioning is **not** to build a generic AI chatbot.

Instead, build:

# GramVenture AI

### “Know your business before you borrow.”

### One-line pitch

> GramVenture AI helps rural entrepreneurs decide what business to start, how much to invest, and how much they can safely borrow using hyper-local market intelligence, financial simulation and explainable AI.

---

# 2. What Is the Actual Problem?

Do not frame the problem as:

> ❌ “Build an AI business advisory chatbot.”

That describes the solution, not the problem.

## Actual problem

> A rural first-time entrepreneur may have access to concessional credit but lacks reliable, hyper-local information to decide what business to start, how much to borrow, and whether the business can realistically repay the loan.

### Primary User

**Rural / semi-urban first-time entrepreneur seeking government-backed financing.**

### Core Pain

The entrepreneur may not know:

- Which business is viable locally
- Whether sufficient demand exists
- How much capital is actually required
- How much loan can be taken
- Which government scheme applies
- Whether repayment is affordable
- What local risks exist
- How much competition exists
- What pricing is appropriate

### Current Decision Pattern

```text
Family / friends
      ↓
“Everyone is doing dairy”
      ↓
Take loan
      ↓
Start business
      ↓
Unexpected competition / costs
      ↓
Cash-flow problem
      ↓
Business stagnates
```

### Proposed Intervention

```text
Before loan
    ↓
GramVenture AI
    ↓
Market + Competition + Finance + Risk
    ↓
Business Viability
    ↓
Recommended Business Plan
    ↓
Better Borrowing Decision
```

---

# 3. Painkiller vs Vitamin

## Score: 5/5

This is a **painkiller**, not merely a vitamin.

The pain is significant because entrepreneurs may make financial decisions involving several lakhs of rupees without adequate feasibility analysis.

### Before

```text
“I have ₹1 lakh.”

“What business should I start?”

“I heard dairy is profitable.”

“How much loan can I get?”

“I don't know.”
```

### After

```text
“I have ₹1 lakh.”

AI:
Dairy → 72/100
Food Processing → 86/100
Tailoring → 68/100

Recommended:
Food Processing

Project Cost:
₹7.4 lakh

Potential Loan:
₹6.4 lakh

Expected Monthly Surplus:
₹31,000

Risk:
Medium

Break-even:
18 months
```

This provides a clear **before → after transformation**.

---

# 4. User Clarity

## Score: 5/5

### Primary user

**First-time rural / semi-urban entrepreneur.**

### Secondary users

Potential future users include:

- State Channelizing Agencies
- Government officers
- NGOs
- Financial institutions
- Entrepreneurship support organizations

However, the MVP should focus on:

> **One entrepreneur → one business decision.**

Do not attempt to build the product for everyone initially.

---

# 5. Problem Clarity

## Score: 5/5

The problem can be explained in one sentence:

> **“We help rural entrepreneurs determine which business is actually viable in their locality before they take a government-backed loan.”**

This is short, clear and easy for a judge to understand.

---

# 6. Buildability

## Score: 5/5

PS 26091 has a relatively manageable implementation path compared with problems requiring heavy computer vision, robotics, quantum computing, large-scale web scraping, or specialized hardware.

## Suggested Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Recharts
- Leaflet / Mapbox

### Backend

- Python
- FastAPI

### AI

- LLM
- Structured prompting
- Agentic workflow where useful
- Explainable recommendation layer

### Database

- PostgreSQL

### ML / Analytics

- Scikit-learn
- Statistical / rule-based models where appropriate

### Data

Potential sources should be selected based on availability and verified before implementation, such as:

- Government/open datasets
- Geospatial data
- Census/demographic data
- Business/location datasets
- Commodity/price datasets
- Weather/seasonality data
- User-provided information

> **Important:** Do not claim precise village-level data unless the source and methodology actually support it. Clearly distinguish measured data, estimated data and user-provided data.

---

# 7. High-Level Architecture

```text
React / TypeScript
        ↓
      FastAPI
        ↓
┌─────────────────────────────┐
│ Business Intelligence Layer │
│                             │
│ Market Engine               │
│ Financial Engine            │
│ Risk Engine                 │
│ Scheme Engine               │
│ AI Advisory Engine          │
└──────────────┬──────────────┘
               ↓
          PostgreSQL
```

A more advanced agentic architecture can be:

```text
                    USER
                      ↓
              AI Orchestrator
                      ↓
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
 Market Agent    Finance Agent    Risk Agent
       ↓              ↓              ↓
       └──────────────┼──────────────┘
                      ↓
              Viability Engine
                      ↓
              Recommendation
```

---

# 8. Demo Power

## Score: 5/5

The project can be demonstrated in approximately **90 seconds**.

## Suggested Demo Flow

### 0–15 seconds

Enter:

```text
Location: Shirur
District: Pune

Available Capital: ₹1,00,000
```

Click:

**Analyze My Opportunities**

### 15–30 seconds

```text
TOP OPPORTUNITIES

🥇 Food Processing       86/100
🥈 Dairy                 79/100
🥉 Retail                71/100
```

### 30–45 seconds

Select Food Processing:

```text
Market Demand       HIGH
Competition         LOW
Local Opportunity   HIGH

Recommended Project Cost: ₹7.4L
Potential Loan: ₹6.4L
```

### 45–60 seconds

Show the hyper-local map:

```text
        Competitor
            🏪

   YOU 📍

                 🏪

        🏪
```

Explain:

> “The system identifies comparable businesses within the selected market radius.”

### 60–75 seconds

```text
Expected Revenue       ₹1.05L/month
Operating Costs          ₹74K/month
Expected Surplus         ₹31K/month

Break-even:
18 months
```

### 75–90 seconds

Click:

**Stress Test — Demand -20%**

```text
Viability:
86 → 69

Cash Surplus:
₹31K → ₹14K

Risk:
MEDIUM → HIGH
```

Then AI recommends:

> **“Reduce initial investment by ₹1.1 lakh and retain working capital to reduce repayment risk.”**

This is the key demo moment.

---

# 9. Judge Appeal

## Score: 5/5

### Problem

Rural entrepreneurs may receive financing but lack decision intelligence.

### Solution

AI-powered hyper-local feasibility and financial planning.

### Impact

Better business selection → better borrowing decisions → potentially lower business failure risk.

### Technology

AI + NLP + GIS + financial simulation + multilingual interaction.

---

# 10. Sponsor / Government Fit

## Score: 5/5

The problem aligns with:

- Entrepreneurship
- Financial inclusion
- Marginalized communities
- Government schemes
- Rural development
- Data-driven decision-making

Potential deployment:

```text
Ministry
   ↓
State Channelizing Agency
   ↓
District / Local Implementation
   ↓
Entrepreneur
```

---

# 11. Monetization / Sustainability

## Score: 3/5

This is naturally a **B2G / B2B2C** platform.

Potential models:

### Government Licensing

State agencies license the platform.

### Institutional Dashboard

Government officers can monitor:

- Applicants
- Recommended businesses
- Risk scores
- Loan amounts
- Regional trends
- Business feasibility results

### NGO Deployment

NGOs and entrepreneurship organizations can use the platform to assist beneficiaries.

---

# 12. Differentiation

## Score: 4/5

The biggest area requiring deliberate work is differentiation.

A generic competitor may build:

```text
Input
 ↓
LLM
 ↓
Advice
```

We should build:

# AI Business Decision Engine

```text
Location
   ↓
Local Data
   ↓
Market Model
   ↓
Competitor Model
   ↓
Financial Model
   ↓
Risk Simulation
   ↓
AI Reasoning
   ↓
Business Viability Score
   ↓
Actionable Recommendation
```

The system should explain **why** it reached the recommendation.

---

# 13. Killer Feature — Business Viability Score

The product should not simply generate a report.

It should calculate:

# Business Viability Score

Example:

```text
Business Viability
      82 / 100

Market Demand       ████████░░ 82
Competition         ██████░░░░ 61
Capital Adequacy    █████████░ 91
Profit Potential    ████████░░ 79
Supply Risk         ██████░░░░ 64
Seasonality         ███████░░░ 72
Loan Affordability  █████████░ 88
```

Then:

> **Recommendation: PROCEED WITH CONDITIONS**

The score must be explainable.

---

# 14. Proposed Viability Methodology

The PS does not prescribe a specific mathematical scoring methodology.

Therefore, the team can define and document one.

Example:

```text
Viability Score =
25% Market Demand
20% Competition
20% Profit Potential
15% Capital Adequacy
10% Risk
10% Loan Affordability
```

The final implementation should validate and justify these weights.

This makes the recommendation:

- Explainable
- Defensible
- Measurable
- Easier to demonstrate

---

# 15. Business Recommendation Engine

A major differentiator should be allowing:

> **“What business should I start?”**

Example:

```text
Available Capital:
₹1,00,000

Location:
XYZ Village
```

System:

```text
TOP BUSINESS OPPORTUNITIES

1. Dairy Products
   Viability: 84/100
   Estimated Investment: ₹8.5L
   Competition: Medium
   Expected Break-even: 19 months

2. Food Processing
   Viability: 81/100
   Estimated Investment: ₹6.2L
   Competition: Low
   Expected Break-even: 15 months

3. Tailoring Unit
   Viability: 74/100
   Estimated Investment: ₹3.1L
   Competition: Medium
```

Then explain:

> **Why this business?**

This turns the product into a **business discovery + feasibility engine**, not only a financial calculator.

---

# 16. Financial Digital Twin

Build scenario simulation.

## Scenario A — Conservative

Revenue decreases by 20%.

## Scenario B — Expected

Normal demand.

## Scenario C — Optimistic

Revenue increases by 20%.

Example:

| Scenario | Revenue | Profit | EMI | Risk |
|---|---:|---:|---:|---|
| Conservative | ₹X | ₹X | ₹X | HIGH |
| Expected | ₹X | ₹X | ₹X | MEDIUM |
| Optimistic | ₹X | ₹X | ₹X | LOW |

This answers:

> **“Can this business survive if things don't go according to plan?”**

---

# 17. Financial Engine

The PS gives a margin-to-project-cost structure.

Example:

```text
Available Margin
       ↓
₹1,00,000
       ↓
Project Cost
       ↓
₹10,00,000
       ↓
Potential Loan
       ↓
₹9,00,000
```

The system should calculate:

- Applicable scheme
- Loan amount
- Interest
- Tenure
- Moratorium
- EMI / repayment schedule
- Working capital
- Operating costs
- Cash-flow scenarios

## Important Principle

Do not equate:

> **Maximum borrowing capacity**

with:

> **Recommended borrowing amount**

The AI should be able to say:

> “You are eligible to borrow ₹9 lakh, but based on projected cash flow, borrowing ₹7.2 lakh is safer.”

---

# 18. Hyper-Local Map

Use a map to visualize:

- User location
- Similar businesses
- Competitors
- Markets
- Transport access
- Population / demographic indicators
- Relevant infrastructure
- Potential customer clusters

The map should support the AI's reasoning rather than being decorative.

---

# 19. Multilingual AI

This should be a major differentiator.

At minimum, consider:

- English
- Hindi
- Marathi

Example:

> “माझ्याकडे एक लाख रुपये आहेत. माझ्या गावात कोणता व्यवसाय सुरू करणे फायदेशीर ठरेल?”

The system should return a structured answer in Marathi.

The goal is:

> **A rural user should be able to complete the entire core workflow in their preferred language.**

---

# 20. Agentic AI Architecture

If using agentic AI, divide responsibilities.

### Market Agent

Analyzes:

- Population
- Demand indicators
- Nearby businesses
- Market opportunities

### Finance Agent

Calculates:

- Project cost
- Loan
- EMI
- Working capital
- Cash flow

### Risk Agent

Analyzes:

- Seasonality
- Supply risks
- Competition
- Price volatility

### Scheme Agent

Maps:

- Project size
- Entrepreneur profile
- Applicable financing scheme

### Report Agent

Combines outputs into:

- Recommendation
- Explanation
- Business plan
- Risk summary

### Orchestrator

Controls the overall workflow.

---

# 21. Common Mistake to Avoid

Do not build every PS requirement as an independent screen.

## Bad approach

```text
Dashboard
├── SWOT
├── Competitors
├── Pricing
├── Loan Calculator
├── Scheme
├── Risk
├── Market
├── Report
└── Chatbot
```

This becomes a feature collection.

## Better approach

```text
User
 ↓
“What business should I start?”
 ↓
AI Business Decision Engine
 ↓
Market
Finance
Risk
Competition
Scheme
 ↓
One Final Recommendation
```

Everything contributes to answering the main question.

---

# 22. 20-Minute Validation

Problem Selection Engine:

```text
Find pain
   ↓
Identify user
   ↓
Check frequency
   ↓
Check urgency
   ↓
Can we demo quickly?
   ↓
Can a judge understand it fast?
   ↓
Build
```

## Validation

| Test | Result |
|---|---|
| Is the pain real? | ✅ |
| Is the user obvious? | ✅ |
| Does the problem happen repeatedly? | 🟡 |
| Is it urgent? | ✅ |
| Can a demo show the fix instantly? | ✅ |
| Can a judge understand it quickly? | ✅ |
| Can the project stay manageable? | ✅ |
| Could a sponsor support it? | ✅ |
| Would a judge remember it? | ✅ |
| Is improvement measurable? | ✅ |

### Overall validation

# 9/10

---

# 23. Problem Selection Engine Scorecard

| Factor | Score |
|---|---:|
| Pain | **5/5** |
| Clarity | **5/5** |
| Buildability | **5/5** |
| Demo Power | **5/5** |
| Judge Appeal | **5/5** |
| Sponsor Fit | **5/5** |
| Monetization | **3/5** |
| Differentiation | **4/5** |
| **TOTAL** | **37/40** |

---

# 24. SWOT

## Strengths

- Genuine modern-tech core
- Strong social impact
- Clear target user
- Strong before/after story
- Highly demoable
- Multiple AI opportunities
- Government alignment
- Manageable full-stack architecture
- Multilingual capability
- Financial simulation can provide a strong differentiator

## Weaknesses

- Hyper-local data availability can be difficult
- Expected Solution leaves room for interpretation
- Business viability estimates must be defensible
- Similar entrepreneurship-oriented solutions may exist
- Monetization is primarily institutional

## Opportunities

- Build a genuine Business Viability Engine
- Add explainable scoring
- Add scenario simulation
- Add multilingual end-to-end workflow
- Use GIS for hyper-local intelligence
- Recommend businesses rather than only evaluating user-selected businesses
- Provide institutional dashboards later
- Add human-in-the-loop review for government deployment

## Threats

- Teams may build generic AI chatbots
- Competitors may have stronger datasets
- Judges may challenge the validity of estimated local demand
- AI-generated financial projections may be questioned
- Data quality may vary across districts
- Over-scoping can turn the project into a generic government portal

---

# 25. Biggest Risk — Data Credibility

A judge may ask:

> “Where exactly is your input or training data coming from?”

The answer must be precise.

Separate data into:

### Verified data

Directly sourced from a recognized dataset.

### Estimated data

Derived using a documented methodology.

### User-provided data

Information entered by the entrepreneur.

### AI-generated recommendation

The model's interpretation of the above.

**Never present an AI estimate as official government data.**

---

# 26. Evaluator Questions We Should Prepare For

### Q1. Where does your data come from?

Prepare a source-by-source answer.

Explain:

- Dataset
- Update frequency
- Geographic granularity
- Data limitations
- Estimation methodology

### Q2. How do you calculate the viability score?

Show the mathematical model.

Example:

```text
Market Demand       25%
Competition         20%
Profit Potential    20%
Capital Adequacy    15%
Risk                10%
Loan Affordability  10%
```

Explain why these weights were selected.

### Q3. Why use AI here?

Suggested answer:

> The system combines heterogeneous information — market conditions, business characteristics, financial constraints and risk factors — and converts them into a personalized, explainable recommendation in the user's language.

AI should support decision-making; deterministic financial calculations should remain deterministic.

### Q4. What happens when data is missing?

The system should degrade gracefully.

```text
Complete data
     ↓
Full recommendation

Partial data
     ↓
Lower confidence
     ↓
Request additional information

Insufficient data
     ↓
“No reliable recommendation”
```

Never fabricate missing information.

### Q5. How does this scale?

Suggested architecture:

```text
Frontend
   ↓
Stateless API
   ↓
Data / AI Services
   ↓
PostgreSQL
   ↓
Cached regional datasets
```

Separate AI requests from deterministic calculations.

### Q6. How will you measure real-world success?

Potential KPIs:

- Recommendation acceptance rate
- Loan application completion
- Reduction in unsuitable borrowing
- Business survival rate
- Recommendation accuracy
- User completion rate
- Time to generate feasibility analysis
- Financial-risk detection rate

For the hackathon, present these as **future deployment KPIs**, not fabricated results.

---

# 27. Product Positioning

Do not position it as:

> “Another AI chatbot.”

Position it as:

# **AI-powered business decision intelligence for rural entrepreneurs.**

The chatbot is only the interface.

The real product is:

```text
DATA
 +
ANALYTICS
 +
FINANCE
 +
RISK
 +
AI
 =
BUSINESS DECISION
```

---

# 28. Product Thesis

## One question

> **“Should I start this business?”**

Everything should help answer that question.

```text
                    USER
                      │
                      ▼
          “Should I start this business?”
                      │
                      ▼
             ┌─────────────────┐
             │ BUSINESS AI     │
             │ DECISION ENGINE │
             └────────┬────────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
       MARKET       FINANCE      RISK
          │           │           │
          └───────────┼───────────┘
                      ▼
              VIABILITY SCORE
                      │
             ┌────────┴────────┐
             ▼                 ▼
          PROCEED            MODIFY
                                │
                                ▼
                        RECOMMENDED PLAN
```

---

# 29. Final Product Concept

# GramVenture AI

### Tagline

> **Know your business before you borrow.**

### Core workflow

```text
1. Enter location
2. Enter available capital
3. Select / discover business
4. Analyze local market
5. Map competition
6. Estimate financial feasibility
7. Select applicable scheme
8. Simulate repayment scenarios
9. Calculate viability score
10. Receive explainable recommendation
```

---

# 30. Final Recommendation

## Should we select PS 26091?

# YES — SHORTLIST / SERIOUSLY CONSIDER

Based on the Problem Selection Engine:

- 🟢 Pain
- 🟢 Buildability
- 🟢 Demo
- 🟢 Judge clarity
- 🟢 Government fit
- 🟢 AI potential
- 🟡 Differentiation
- 🟡 Data credibility
- 🟢 Overall

### Final Score

# **37 / 40**

---

# 31. What Makes It Winning

The project will **not** win because it contains:

- ChatGPT
- A chatbot
- A map
- An EMI calculator
- A dashboard

It can win if it convincingly demonstrates:

> **“Given a real entrepreneur, a real location and a real amount of capital, our system can explain which business is likely to be viable, how much the entrepreneur should invest, how much they should borrow, what risks they face, and what happens if market conditions worsen.”**

That is the core.

---

# 32. The 2-Minute Winning Demo

```text
Entrepreneur
    ↓
“I have ₹1 lakh.”
    ↓
“I live in XYZ village.”
    ↓
“What business should I start?”
    ↓
────────────────────────────
      GRAMVENTURE AI
────────────────────────────
    ↓
Top Opportunities
    ↓
🥇 Food Processing — 86/100
🥈 Dairy — 79/100
🥉 Retail — 71/100
    ↓
Market + Competition Map
    ↓
Financial Plan
    ↓
₹7.4L recommended investment
₹6.4L potential loan
    ↓
Risk Simulation
    ↓
Demand -20%
    ↓
Viability 86 → 69
    ↓
AI Recommendation
    ↓
“Reduce initial investment
and retain working capital.”
```

## Final message to the judge

> **“We don't tell rural entrepreneurs how to spend their loan. We help them decide whether they should take the loan in the first place.”**

---

# 33. Decision

## 🥇 PS 26091 — SELECT

**Product:** GramVenture AI  
**Tagline:** Know your business before you borrow.  
**Positioning:** Rural Business Decision Intelligence  
**Primary user:** First-time rural entrepreneur  
**Core differentiator:** Explainable Business Viability Engine  
**Killer feature:** Financial + market stress simulation  
**Demo:** 90–120 seconds  
**Overall selection score:** **37/40**

---

# 34. Immediate Next Steps

Before implementation, validate three things:

1. **Data sources** — what reliable local/geographic/business datasets can actually be obtained.
2. **Viability methodology** — how the score and recommendations will be calculated.
3. **MVP scope** — which features must be functional in the first 36-hour build and which can be simulated or shown as future extensions.

These three decisions will determine whether PS 26091 becomes a strong real-world SIH submission rather than only a strong idea on paper.
