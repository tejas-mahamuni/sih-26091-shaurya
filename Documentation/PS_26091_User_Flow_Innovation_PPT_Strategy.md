# SIH 2026 — PS 26091
# Rural Micro-Entrepreneur Loan Assistant
## Hyper-Local Feasibility + Smart Financial Calculator

> **Purpose of this document:** This is the consolidated product, user-flow, innovation, and PPT/pitch blueprint for PS 26091, aligned directly with the team's **Winning Presentation README** and the uploaded **SIH User Flow / Features / Task Division** document.
>
> The presentation philosophy is simple:
>
> **Problem → User → Solution → Demo → Impact → Future**
>
> The pitch should feel **clear, useful, believable, and finished** — not like a long technical explanation.

---

# 1. Product Identity

## Working Product Name

# GramVenture AI

### Tagline

> **Know your business before you borrow.**

### Official PS

**PS 26091 — AI-Driven Hyper-Local Business Advisory and Financial Structuring Assistant for Rural Micro-Entrepreneurs**

### Product Positioning

Do **not** position this as:

> "An AI chatbot for rural businesses."

Position it as:

> **An AI-powered decision-support system that helps rural entrepreneurs evaluate a business opportunity and structure financing before taking a loan.**

The chatbot/voice interface is only one part of the product.

The actual product is:

```text
Local Data
    +
Market Analysis
    +
Competition
    +
Risk
    +
Financial Structuring
    +
Scheme Routing
    +
AI Explanation
    =
Better Business + Borrowing Decision
```

---

# 2. The Winning Product Thesis

The entire product should answer one question:

> # "Should I start this business with the money I have?"

A rural entrepreneur should not have to separately understand:

- market demand,
- competition,
- pricing,
- SWOT,
- threats,
- loan eligibility,
- scheme selection,
- EMI,
- moratorium,
- and working capital.

GramVenture AI combines them into one decision.

```text
                    ENTREPRENEUR
                         │
                         ▼
              "Should I start this?"
                         │
                         ▼
              ┌─────────────────────┐
              │   GRAMVENTURE AI    │
              │  Decision Engine    │
              └──────────┬──────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       MARKET         FINANCE          RISK
          │              │              │
          └──────────────┼──────────────┘
                         ▼
                FEASIBILITY RESULT
                         │
                         ▼
              BUSINESS RECOMMENDATION
                         │
                         ▼
               BETTER BORROWING PLAN
```

---

# 3. User Persona

## Primary User

### First-time rural / semi-urban micro-entrepreneur

The user may:

- have limited business experience,
- have limited financial literacy,
- have limited digital literacy,
- know the amount of margin capital available,
- want to start a small business,
- be considering a government-backed concessional loan,
- not know which business is viable locally.

## Example Persona

```text
Name: Ravi
Location: Rural village
Available Margin: ₹1,00,000
Business Knowledge: Basic
Digital Literacy: Low / Moderate

Goal:
Start a sustainable business using
government-supported financing.

Problem:
"I don't know which business is
actually viable in my village."
```

---

# 4. The Core Problem Story

## Current Situation

```text
Entrepreneur
     │
     ▼
"I have ₹1 lakh."
     │
     ▼
"What business should I start?"
     │
     ▼
Family / friends / anecdotal advice
     │
     ▼
Choose a business
     │
     ▼
Take loan
     │
     ▼
Discover competition / demand / cost issues
     │
     ▼
Cash-flow pressure
     │
     ▼
Business stagnation / repayment risk
```

## Our Intervention

```text
Entrepreneur
     │
     ▼
Location + Margin + Business
     │
     ▼
GRAMVENTURE AI
     │
     ├── Financial Structuring
     │
     ├── Market Reach
     ├── Opportunity Analysis
     ├── SWOT
     ├── Threats
     ├── Competition
     └── Pricing
     │
     ▼
Combined Recommendation
     │
     ▼
Compare / Modify / Re-run
     │
     ▼
Better-informed loan decision
```

---

# 5. Complete User Flow

The uploaded solution brief defines a **six-step end-to-end flow**. This should become the actual product journey and the core of the live demo.

---

## STEP 1 — Minimal Onboarding

### Goal

Collect only the information required to begin.

### Inputs

```text
1. Location
   Village / Block / District
   OR GPS-assisted selection

2. Available Margin Capital
   Example: ₹1,00,000

3. Proposed Business Category
   Example:
   - Dairy
   - Retail
   - Textiles
   - Food Processing
   - etc.
```

### UX Principle

The uploaded user-flow document explicitly emphasizes:

- no long forms,
- no unnecessary jargon,
- suitability for low digital literacy.

Therefore the onboarding screen should be extremely simple.

### UI Concept

```text
┌──────────────────────────────────────┐
│        GramVenture AI                │
│  Know your business before you borrow│
│                                      │
│  📍 Where are you?                   │
│  [ Village / Block / District ]      │
│                                      │
│  💰 Available capital                │
│  [ ₹ 1,00,000 ]                      │
│                                      │
│  🏪 Business                         │
│  [ Dairy ▼ ]                         │
│                                      │
│        [ Analyze My Business ]       │
└──────────────────────────────────────┘
```

### Optional UX Innovations

- GPS auto-detection
- Regional language
- Voice input
- Large touch targets

---

# 6. STEP 2 — Instant Financial Structuring

## Important Product Decision

### Module 2 should fire first.

This is explicitly defined in the uploaded user-flow document.

Why?

Because financial calculations are deterministic and should return almost instantly.

The user should immediately understand:

> "Given my available margin, what financing structure am I looking at?"

---

## Financial Pipeline

```text
Available Margin
       ↓
Project Cost
       ↓
Maximum Loan
       ↓
Scheme Selection
       ↓
Interest + Tenure
       ↓
Moratorium
       ↓
Repayment Schedule
```

## Required calculations

### Project Cost

```text
Project Cost = Margin ÷ 10%
```

### Maximum Loan

```text
Maximum Loan = 90% of Project Cost
```

Example:

```text
Margin:
₹1,00,000

Project Cost:
₹10,00,000

Maximum Loan:
₹9,00,000
```

---

## Scheme Router

The system automatically routes according to the PS rules.

### Micro Finance Scheme

For project cost up to ₹1.40 lakh:

```text
Interest: 6.5% p.a.
Tenure: 3 years
Moratorium: 3 months
```

### Term Loan Scheme

For project cost above ₹1.40 lakh and up to ₹50 lakh:

```text
Interest: 8% p.a.
Tenure: 7 years
Moratorium: 6 months
```

### UI Result

```text
┌──────────────────────────────────────┐
│ FINANCIAL STRUCTURE                  │
│                                      │
│ Your Margin          ₹1,00,000       │
│ Project Cost         ₹10,00,000      │
│ Maximum Loan         ₹9,00,000       │
│                                      │
│ Recommended Scheme                  │
│ TERM LOAN SCHEME                    │
│                                      │
│ Interest             8% p.a.        │
│ Tenure               7 years        │
│ Moratorium           6 months       │
│                                      │
│ [ View Repayment Schedule ]         │
└──────────────────────────────────────┘
```

---

# 7. STEP 3 — Hyper-Local Feasibility Engine

After the deterministic financial result is available, Module 1 starts.

The uploaded solution brief defines six mandatory sections.

```text
                    LOCATION
                        +
                    BUSINESS
                        │
                        ▼
              HYPER-LOCAL ENGINE
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   Market Reach    Opportunity       SWOT
        │           Analysis            │
        ├───────────────┼───────────────┤
        ▼               ▼               ▼
     Threats       Competition       Pricing
        │               │               │
        └───────────────┼───────────────┘
                        ▼
                FEASIBILITY REPORT
```

---

# 8. Module 1 — Feature-by-Feature Design

## 8.1 Market Reach

### Question

> "How large is the potential customer base around this entrepreneur?"

### Required scope

Estimate the customer base within a **5–10 km radius** and identify realistic distribution/reach channels.

### Output

```text
Estimated Market Reach
     HIGH

Approx. reachable population
     XXXX

Primary channels:
• Local market
• Door-to-door
• Retail partnerships
• Nearby villages
```

### Important

The map and numbers must be grounded in actual data where possible.

Do not simply generate a generic paragraph and attach a village name.

---

# 9. Opportunity Analysis

## Question

> "What is missing or underserved in this local economy?"

Example output:

```text
OPPORTUNITY

Local demand appears stronger for:
• Processed dairy products
• Packaged local food
• Doorstep delivery

Observed opportunity:
LOW local availability +
REASONABLE purchasing demand
```

The goal is to identify:

- underserved niches,
- gaps,
- opportunities created by local conditions.

---

# 10. SWOT Analysis

The SWOT should NOT be a generic AI-generated template.

It should be scaled to:

- location,
- business category,
- available capital,
- local market conditions.

### Example

```text
STRENGTHS
✓ Existing local demand
✓ Moderate startup requirement

WEAKNESSES
• Limited initial working capital

OPPORTUNITIES
✓ Nearby villages underserved

THREATS
• Seasonal demand
• Existing established seller
```

---

# 11. Threat Identification

The system should identify **local-specific risks**.

Mandatory examples from the solution brief:

- Supply chain bottlenecks
- Seasonal demand fluctuations
- Dependency on a single buyer

Additional business-specific risks can be modeled if supported by data.

### UI

```text
LOCAL RISKS

🔴 High
Single-buyer dependency

🟠 Medium
Seasonal demand

🟡 Medium
Raw material transportation
```

---

# 12. Competitor Mapping

## Goal

Answer:

> "Who is already serving this market?"

The system should estimate:

- density of similar businesses,
- geographic distribution,
- nearby competitors.

### Map concept

```text
               🏪
          Competitor

                   🏪


       📍 YOU


   🏪

              🏪
```

### Critical judging point

The uploaded brief specifically warns that Module 1 will be judged on whether it is **genuinely hyper-local** rather than generic AI text with a village name inserted.

Therefore:

> **Data grounding is a core winning factor.**

---

# 13. Pricing / Market Value

## Goal

Suggest realistic pricing based on:

- regional purchasing power,
- local market conditions,
- business category,
- comparable offerings where available.

### Example

```text
Recommended Price Range

₹90 – ₹110 / unit

Suggested starting price:
₹99

Reason:
Competitive with nearby alternatives
while preserving estimated margin.
```

Again, clearly distinguish sourced data from estimates.

---

# 14. STEP 4 — Combined Recommendation Screen

## This is the MOST IMPORTANT PRODUCT SCREEN.

The uploaded user-flow document explicitly states that the financial and feasibility answers must be **fused into one recommendation**, rather than appearing as disconnected reports.

This fusion is the actual product.

---

## Example

```text
┌────────────────────────────────────────────┐
│        YOUR BUSINESS DECISION              │
├────────────────────────────────────────────┤
│                                            │
│ Business: Dairy                            │
│ Location: XYZ Village                      │
│                                            │
│ Financial                                  │
│ Project Cost:       ₹10,00,000             │
│ Maximum Loan:        ₹9,00,000             │
│ Scheme:             Term Loan              │
│                                            │
│ Market                                   │
│ Demand:             HIGH                   │
│ Competition:        HIGH                   │
│                                            │
│ Risk                                      │
│ Overall Risk:       MEDIUM                 │
│                                            │
│ Recommendation                            │
│                                            │
│ ⚠ PROCEED WITH CAUTION                    │
│                                            │
│ Dairy has strong demand, but 4 similar     │
│ sellers are estimated within 6 km.         │
│ Consider comparing Food Processing         │
│ before borrowing.                          │
│                                            │
│ [ Compare Businesses ]                    │
└────────────────────────────────────────────┘
```

---

# 15. Why This Screen Wins

A generic project might produce:

```text
Market Report
+
Loan Calculator
```

Our project should produce:

```text
Market Report
+
Financial Structure
+
Risk
+
Competition
        ↓
ONE DECISION
```

That is the central product insight.

---

# 16. STEP 5 — Iterate and Compare

The user should NOT be trapped in a one-shot report.

The uploaded flow explicitly requires the ability to change:

- business category,
- margin amount,

and rerun the analysis.

---

## Example

Initial:

```text
Capital: ₹1,00,000
Business: Dairy

Result:
72/100
```

User changes:

```text
Business: Food Processing
```

System recalculates:

```text
86/100
```

Then:

```text
Compare

Dairy          72
Food Processing 86
Retail         69
```

---

# 17. Innovation — What Should Actually Be Built?

The uploaded solution brief lists several recommended innovations.

The key rule from the research document is:

> **Do not attempt all innovative features. Select a realistic subset.**

For SIH, the team should prototype **1–2 strong innovations deeply** rather than adding ten shallow features.

---

# 18. Innovation Priority Matrix

| Innovation | Value | Build Risk | Priority |
|---|---:|---:|---|
| What-if business comparator | ⭐⭐⭐⭐⭐ | Low | **P0** |
| Multilingual + voice | ⭐⭐⭐⭐⭐ | Medium | **P0** |
| Confidence / data-quality indicator | ⭐⭐⭐⭐⭐ | Low | **P0/P1** |
| Offline / low-bandwidth mode | ⭐⭐⭐⭐ | Medium | P1 |
| Financial-literacy micro-content | ⭐⭐⭐⭐ | Low | P1 |
| Document checklist | ⭐⭐⭐ | Low | P1 |
| WhatsApp bot | ⭐⭐⭐⭐ | Medium | P2 |
| Peer benchmarking | ⭐⭐⭐⭐ | High | P2 |
| SCA / officer dashboard | ⭐⭐⭐ | Medium | P2 |
| Repayment reminders | ⭐⭐⭐ | Low | P2 |

---

# 19. Recommended Killer Innovation #1
# What-If Business Comparator

This should be one of the main innovations.

Instead of asking:

> "Is Dairy viable?"

the user can ask:

> "Which business is better for my money?"

---

## Flow

```text
Capital:
₹1,00,000

Location:
XYZ Village

Compare:
Dairy
Food Processing
Retail
```

### Result

| Metric | Dairy | Food Processing | Retail |
|---|---:|---:|---:|
| Viability | 72 | **86** | 69 |
| Competition | High | Low | Medium |
| Investment | ₹X | ₹X | ₹X |
| Risk | Medium | Low | Medium |
| Demand | High | High | Medium |

### Final AI explanation

> **Food Processing is currently the strongest option because the estimated local competition is lower while projected market opportunity remains strong.**

This creates a memorable demo.

---

# 20. Recommended Killer Innovation #2
# Confidence / Data Quality Indicator

This directly solves one of the biggest weaknesses of AI-generated feasibility reports.

Instead of pretending every number is exact:

```text
Data Confidence

Market Reach       91%
Competition        74%
Pricing            82%
Risk               68%

Overall Confidence
        79%
```

### If data is sparse

```text
⚠ LOW DATA CONFIDENCE

Reliable local competitor data
was unavailable.

Recommendation:
Treat this result as preliminary
and validate locally before borrowing.
```

This makes the system more trustworthy.

---

# 21. Recommended UX Innovation
# Multilingual + Voice

The solution brief specifically recommends:

- regional language support,
- voice input/output,
- suitability for low-literacy users.

### Example

User speaks:

> "माझ्याकडे एक लाख रुपये आहेत. माझ्या गावात कोणता व्यवसाय सुरू करणे योग्य आहे?"

System:

```text
तुमच्या उपलब्ध भांडवल आणि स्थानिक
बाजाराच्या आधारे:

🥇 Food Processing
Viability: 86/100

🥈 Dairy
Viability: 72/100
```

### Important

Do not make this only a language switch.

The user should be able to complete the **core decision flow** in the chosen language.

---

# 22. Optional Innovation
# Low-Bandwidth / Offline-First

For rural users:

```text
No / weak internet
       ↓
Core calculator still works
       ↓
Local cached data used
       ↓
Pending AI request
       ↓
Sync when connection returns
```

This is a strong future/deployment feature, but should only be implemented if the core flow is already stable.

---

# 23. Optional Innovation
# Financial Literacy Layer

Instead of exposing financial jargon:

```text
Moratorium
```

show:

> **"You don't have to start regular repayment immediately. The scheme provides a 6-month moratorium."**

Similarly:

```text
Margin Money
```

can be explained as:

> **"Your contribution toward the total project cost."**

This directly supports low financial literacy.

---

# 24. Optional Innovation
# Document Checklist

After selecting a scheme:

```text
YOUR APPLICATION CHECKLIST

☐ Identity proof
☐ Address proof
☐ Business/project details
☐ Required scheme documents
☐ Financial documents
```

The solution brief specifically lists an auto-generated document checklist as a recommended feature.

---

# 25. STEP 6 — Export / Use for Application

The final report should be:

- downloadable,
- shareable,
- optionally converted into an application-preparation checklist.

### Final report

```text
GRAMVENTURE FEASIBILITY REPORT

Entrepreneur
Location
Business

1. Financial Structure
2. Scheme
3. Market Reach
4. Opportunity
5. SWOT
6. Threats
7. Competition
8. Pricing
9. Recommendation
10. Data Confidence
11. Application Checklist
```

---

# 26. End-to-End Product Flow

```text
                    START
                      │
                      ▼
              MINIMAL ONBOARDING
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
     Location      Capital       Business
        │             │             │
        └─────────────┼─────────────┘
                      ▼
             FINANCIAL ENGINE
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
      Project       Loan        Scheme
       Cost         Amount       Router
          │           │           │
          └───────────┼───────────┘
                      ▼
            IMMEDIATE FINANCE RESULT
                      │
                      │
                      ▼
            HYPER-LOCAL ENGINE
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
      Market       Opportunity     SWOT
        │             │             │
        ▼             ▼             ▼
      Threats      Competition    Pricing
        │             │             │
        └─────────────┼─────────────┘
                      ▼
            COMBINED RECOMMENDATION
                      │
             ┌────────┴────────┐
             ▼                 ▼
          PROCEED            MODIFY
                               │
                               ▼
                       CHANGE BUSINESS /
                       CHANGE CAPITAL
                               │
                               ▼
                          RE-CALCULATE
                               │
                               ▼
                            COMPARE
                               │
                               ▼
                             EXPORT
```

---

# 27. Architecture Supporting the Flow

The solution brief recommends separating the fast deterministic module from the slower AI/data-dependent module.

## Core architecture

```text
                    React / TypeScript
                           │
                           ▼
                       FastAPI
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
      Financial Engine            Feasibility Engine
       Deterministic              AI + Data Driven
             │                           │
             │                  ┌────────┼────────┐
             │                  ▼        ▼        ▼
             │               Market   Risk   Competition
             │
             └─────────────┬─────────────┘
                           ▼
                      Recommendation
                           │
                           ▼
                       PostgreSQL
```

---

# 28. Parallel / Non-Blocking Experience

The architecture should allow:

```text
User clicks Analyze
        │
        ├──────────────► Financial Engine
        │                    │
        │                    ▼
        │              Instant result
        │
        └──────────────► Feasibility Engine
                             │
                             ▼
                       Local data lookup
                             │
                             ▼
                        AI reasoning
                             │
                             ▼
                       Feasibility result
```

The user sees the financial result immediately while the hyper-local analysis loads.

This makes the product feel fast and intentional.

---

# 29. Data Grounding Strategy

## This is one of the most important technical parts.

The solution brief assigns data sourcing to a dedicated research track.

Potential data categories mentioned in the uploaded document include:

- Census / economic survey data
- GST / Udyam business registry data
- Geospatial population layers
- Open rural-economy datasets

The team must determine:

```text
Dataset
   ↓
Access method
   ↓
Geographic coverage
   ↓
Update frequency
   ↓
Limitations
   ↓
Can it realistically be integrated?
```

---

# 30. Data Confidence Model

Every generated insight should ideally have a provenance class:

### VERIFIED

Directly supported by an available dataset.

### ESTIMATED

Derived from documented assumptions or statistical methods.

### USER PROVIDED

Entered by the entrepreneur.

### AI INFERRED

Generated interpretation based on available inputs/data.

This prevents the dangerous design pattern:

```text
AI hallucination
      ↓
Presented as official data
```

---

# 31. Team Division — Six Members

The uploaded solution brief divides research and ownership across six members.

---

## Member 1 — Financial Calculator Engine

### Owns

Module 2.

### Research

- Project cost
- Maximum loan
- ₹1.40 lakh boundary
- Interest rates
- Tenure
- Moratorium
- EMI
- Working capital
- Edge cases

### Deliverable

> Verified, testable financial formula sheet + worked examples.

### Build responsibility

Financial calculation API/service.

---

# 32. Member 2 — Feasibility: Demand & Competition

### Owns

- Market Reach
- Competitor Mapping
- Pricing

### Research

- Customer base estimation
- 5–10 km reach
- Rural distribution channels
- Competitor density
- Regional purchasing power
- Pricing methodology

### Deliverable

> Method + data plan for Market Reach, Competitor Mapping and Pricing.

---

# 33. Member 3 — Feasibility: Opportunity & Risk

### Owns

- Opportunity Analysis
- SWOT
- Threats

### Research

- Local underserved niches
- Micro-enterprise SWOT
- Supply chain gaps
- Seasonality
- Single-buyer dependency

### Deliverable

> Method + framework for Opportunity Analysis, SWOT and Threats.

---

# 34. Member 4 — Data Sourcing & Geospatial Layer

### Owns

The data foundation for Module 1.

### Research

- Census
- Economic survey data
- GST / Udyam
- Population layers
- Rural economy datasets
- GIS sources

### Deliverable

> Data-source map containing dataset, access method, coverage and limitations.

---

# 35. Member 5 — System Architecture & Backend

### Owns

- API architecture
- Database schema
- Module integration
- Caching
- Parallel execution
- Generated report storage

### Important architecture goal

Module 2 should not wait for Module 1.

### Deliverable

> System architecture diagram + API/data schema.

---

# 36. Member 6 — Frontend / UX / Innovation / Pitch

### Owns

- Minimal onboarding
- Combined recommendation screen
- Low-literacy UX
- Multilingual/voice feasibility
- 1–2 innovation prototypes
- Impact narrative
- Pitch structure

### Deliverable

> UX flow + innovation shortlist + pitch narrative outline.

---

# 37. Build Order

The uploaded document gives a very important build sequence.

## Phase 1 — Lock Finance

Member 1:

```text
Financial formulas
      ↓
Unit tests
      ↓
Boundary tests
      ↓
Worked examples
```

Why first?

Because it is:

- deterministic,
- small,
- testable,
- easy to demo.

---

## Phase 2 — End-to-End Module 1

Members 2, 3 and 4:

```text
Basic data
    ↓
Market
    ↓
Competition
    ↓
Opportunity
    ↓
Risk
    ↓
Pricing
```

Do not wait for perfect data before making the entire flow work.

Start with documented approximations if necessary.

---

## Phase 3 — Architecture

Member 5 works from day one.

Do not leave integration until the end.

---

## Phase 4 — UX + Innovation

Member 6 adds:

- polished onboarding,
- recommendation screen,
- one or two strong innovations.

Only after the core flow works.

---

# 38. What NOT to Build First

Do not start with:

- chatbot styling,
- fancy animations,
- admin dashboard,
- WhatsApp bot,
- huge analytics dashboard,
- ten AI agents,
- complex authentication,
- dozens of pages.

First make this work:

```text
Input
 ↓
Financial Result
 ↓
Feasibility Result
 ↓
Combined Recommendation
```

That is the MVP.

---

# 39. MVP Definition

The MVP is complete when:

### Input

```text
Location
+
Margin
+
Business
```

### Output

```text
Project Cost
+
Maximum Loan
+
Scheme
+
EMI
+
Market Reach
+
Opportunity
+
SWOT
+
Threats
+
Competition
+
Pricing
+
Combined Recommendation
```

### Plus

```text
Change Business
Change Capital
Re-run
Compare
```

Everything else is secondary.

---

# 40. Winning Innovation Stack

The recommended final innovation stack is:

## P0 — Must Have

### 1. What-if Business Comparator

```text
Dairy vs Food Processing vs Retail
```

### 2. Confidence / Data Quality

```text
Recommendation:
86/100

Data confidence:
79%
```

## P1 — If time permits

### 3. Regional language + voice

### 4. Financial-literacy explanations

### 5. Document checklist

Do not attempt all recommended innovations.

---

# 41. PPT Strategy — Based on Winning README

The uploaded Winning Presentation README defines the pitch as:

```text
Problem
   ↓
User
   ↓
Solution
   ↓
Demo
   ↓
Impact
   ↓
Future
```

It also explicitly recommends:

- clarity,
- confidence,
- visible progress,
- believable usefulness.

And warns against:

- overexplaining,
- vague AI claims,
- broken demos,
- giant scopes.

Therefore the PPT should follow the same narrative.

---

# 42. Recommended PPT Structure

## Slide 1 — Title

### Goal

**Make the project memorable.**

Content:

```text
GRAMVENTURE AI

Know your business before you borrow.

AI-Driven Hyper-Local Business Advisory
& Financial Structuring Assistant

SIH 2026
PS 26091
Team Name
```

Visual:

- One rural entrepreneur
- Simple location/map visual
- Strong product identity

Do NOT fill the title slide with technology logos.

---

# 43. Slide 2 — Problem

### Goal

**Create urgency.**

Headline:

> **Access to credit does not guarantee a viable business.**

Show:

```text
Available Capital
       ↓
Loan
       ↓
Business Choice
       ↓
???
       ↓
Competition / Demand / Cost Risk
       ↓
Repayment Pressure
```

Keep text minimal.

### Speaker message

> Rural entrepreneurs may have access to concessional credit, but many lack localized market and financial intelligence before deciding what business to fund.

---

# 44. Slide 3 — User

### Goal

Make the target person obvious.

Show:

```text
RURAL ENTREPRENEUR

📍 Village
💰 ₹1,00,000 margin
🏪 Wants to start a business
📊 Limited market information
💳 Limited financial literacy
```

Headline:

> **“I have the capital. But which business should I choose?”**

This makes the problem human.

---

# 45. Slide 4 — Current Pain / Existing Gap

### Goal

Show why current decision-making is weak.

```text
TODAY

Anecdotal advice
      +
Generic business information
      +
Manual loan calculations
      +
No local competition visibility
      ↓
Poorly informed decision
```

Then contrast:

```text
WHAT IS NEEDED

Local market intelligence
+
Financial structuring
+
Risk analysis
+
Scheme routing
      ↓
One informed decision
```

---

# 46. Slide 5 — Solution

### Goal

**Show clarity.**

Headline:

> **One assistant. Two engines. One decision.**

Show:

```text
             GRAMVENTURE AI
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
  MODULE 2                  MODULE 1
  Financial                 Hyper-Local
  Engine                    Feasibility
        │                       │
        ├── Project Cost        ├── Market
        ├── Loan                ├── Opportunity
        ├── Scheme              ├── SWOT
        ├── EMI                 ├── Threats
        └── Moratorium          ├── Competition
                                └── Pricing
        └───────────┬───────────┘
                    ▼
          COMBINED RECOMMENDATION
```

This slide should communicate the architecture at a product level, not as a complex engineering diagram.

---

# 47. Slide 6 — User Flow

### Goal

Show how simple the product is.

Use:

```text
1
ONBOARD
Location + Capital + Business

        ↓

2
FINANCIAL STRUCTURE
Project Cost + Loan + Scheme

        ↓

3
LOCAL FEASIBILITY
Market + Competition + Risk

        ↓

4
DECISION
Proceed / Modify / Compare

        ↓

5
ITERATE
Change Business / Capital

        ↓

6
EXPORT
Report + Application Checklist
```

This slide is extremely important because it demonstrates product completeness.

---

# 48. Slide 7 — Innovation

### Goal

Answer:

> "Why is this more than a generic AI wrapper?"

Headline:

# **From AI answers → AI-assisted decisions**

Show three innovations:

### 1. What-if Comparator

```text
Dairy       72
Retail      69
Food Proc.  86  ← Recommended
```

### 2. Data Confidence

```text
Recommendation: 86/100
Data Confidence: 79%
```

### 3. Multilingual / Voice

```text
"माझ्याकडे एक लाख रुपये आहेत..."
               ↓
Localized recommendation
```

If only two innovations are actually prototyped, show only those two prominently.

---

# 49. Slide 8 — Hyper-Local Intelligence

### Goal

Prove that "hyper-local" is real.

Show a map:

```text
           🏪
       Competitor

  🏪              🏪

          📍
         USER

      🏪
```

Alongside:

```text
5–10 km Market
Competitor Density
Demand Indicators
Pricing Signals
```

### Critical message

> **We don't insert a village name into generic AI text. We ground the recommendation in local data.**

This should become one of the strongest technical credibility slides.

---

# 50. Slide 9 — Financial Intelligence

### Goal

Show deterministic correctness.

Example:

```text
₹1,00,000 Margin
       ↓
₹10,00,000 Project Cost
       ↓
₹9,00,000 Maximum Loan
       ↓
TERM LOAN
8% | 7 Years | 6-Month Moratorium
```

Then:

```text
Repayment Schedule
+
Working Capital
+
Cash Flow
```

Important:

> Module 2 must be exact because judges may stress-test it with real numbers.

---

# 51. Slide 10 — The Decision Screen

### Goal

Show the most important product output.

Use a screenshot of the actual combined recommendation screen.

Example:

```text
BUSINESS: DAIRY

Viability
72 / 100

Market Demand      HIGH
Competition        HIGH
Financial Fit      GOOD
Risk               MEDIUM

RECOMMENDATION

⚠ PROCEED WITH CAUTION

Consider comparing Food Processing
before taking the full loan.
```

This slide should visually demonstrate that the product produces a decision, not a pile of reports.

---

# 52. Slide 11 — Live Demo

### Goal

**Prove it works.**

The README says the demo should be:

- smooth,
- short,
- live,
- easy to follow.

## Demo sequence

```text
Input
 ↓
Financial result
 ↓
Feasibility
 ↓
Map
 ↓
Recommendation
 ↓
Change business
 ↓
Comparison
```

Target:

# Under 2 minutes

Do not demonstrate every feature.

---

# 53. Exact Live Demo Script

## 0:00–0:15

> "Let's take a rural entrepreneur with ₹1 lakh of available margin capital."

Enter:

```text
Location
Capital = ₹1,00,000
Business = Dairy
```

---

## 0:15–0:30

Show financial result.

Say:

> "The financial engine immediately calculates the feasible project cost, maximum loan and applicable scheme."

---

## 0:30–0:55

Show feasibility.

Say:

> "Now the hyper-local engine evaluates demand, competition, opportunity, threats and pricing for this location."

---

## 0:55–1:15

Show map and recommendation.

Say:

> "The important part is that these two modules are not separate reports. They are fused into one borrowing decision."

---

## 1:15–1:35

Change business:

```text
Dairy
→
Food Processing
```

Show comparison.

Say:

> "Instead of blindly accepting the first idea, the entrepreneur can compare alternatives."

---

## 1:35–1:50

Show confidence / multilingual feature if implemented.

---

## 1:50–2:00

Close:

> **"We don't tell rural entrepreneurs how to spend their loan. We help them decide whether they should take the loan in the first place."**

---

# 54. Slide 12 — Impact

### Goal

**Show why it matters.**

Do not make unsupported claims such as:

> "We will reduce loan defaults by 50%."

Instead show the intended impact chain:

```text
Better local information
        ↓
Better business selection
        ↓
Better borrowing decisions
        ↓
Lower exposure to unsuitable loans
        ↓
More sustainable micro-enterprises
```

Potential measurable future KPIs:

- recommendation acceptance,
- business-plan completion,
- application completion,
- risk warnings detected,
- user decision time,
- business survival after deployment,
- unsuitable borrowing avoided.

---

# 55. Slide 13 — Technical Architecture

### Goal

Only after the product story is understood should implementation be shown.

```text
React / TypeScript
        │
        ▼
     FastAPI
        │
   ┌────┴────┐
   ▼         ▼
Finance    Feasibility
Engine       Engine
   │         │
   │      Data + AI
   │         │
   └────┬────┘
        ▼
 PostgreSQL
```

Mention:

- deterministic financial engine,
- AI/data feasibility engine,
- API layer,
- database,
- caching,
- geospatial data.

Do not make this the first technical slide.

---

# 56. Slide 14 — Future

### Goal

**Show ambition without overpromising.**

The README explicitly recommends that the future section should show ambition without overpromising.

Potential roadmap:

```text
MVP
 │
 ├── Core feasibility
 ├── Financial calculator
 ├── Scheme routing
 └── Recommendation
       │
       ▼
Phase 2
 ├── Voice
 ├── Regional languages
 ├── Offline-first
 └── WhatsApp
       │
       ▼
Phase 3
 ├── SCA dashboard
 ├── Peer benchmarking
 ├── Post-loan reminders
 └── Deployment analytics
```

---

# 57. Slide 15 — Closing

### Goal

Make the project memorable.

Large text:

# **Know your business before you borrow.**

Then:

> **"We don't tell rural entrepreneurs how to spend their loan. We help them decide whether they should take the loan in the first place."**

Then:

```text
GRAMVENTURE AI
PS 26091
```

Stop.

Do not add another wall of text.

---

# 58. PPT Slide Summary

| Slide | Purpose | Judge Thought |
|---|---|---|
| 1. Title | Memorability | "Interesting." |
| 2. Problem | Urgency | "This is real." |
| 3. User | Human context | "I understand who needs it." |
| 4. Current Gap | Need | "Current approach is weak." |
| 5. Solution | Clarity | "I understand the product." |
| 6. User Flow | Simplicity | "This is complete." |
| 7. Innovation | Differentiation | "This isn't just a chatbot." |
| 8. Hyper-Local | Technical credibility | "The AI is grounded." |
| 9. Finance | Correctness | "The numbers are serious." |
| 10. Decision | Product value | "This actually helps decide." |
| 11. Demo | Proof | "It works." |
| 12. Impact | Importance | "This can matter." |
| 13. Architecture | Feasibility | "They can build this." |
| 14. Future | Ambition | "There is a path forward." |
| 15. Closing | Memorability | "I remember this." |

---

# 59. Presentation Design Rules

From the Winning Presentation README:

## Rule 1 — One idea per slide

Do not put:

```text
Problem + Architecture + Impact + Features
```

on one slide.

---

## Rule 2 — Large text

The judge should understand the slide from a distance.

---

## Rule 3 — Avoid walls of text

Use:

```text
Headline
+
3–5 key points
+
visual
```

---

## Rule 4 — Use real screenshots

Once the product is built, replace conceptual mockups with actual screenshots.

---

## Rule 5 — Keep the flow simple

The judge should be able to reconstruct:

```text
User
 ↓
Input
 ↓
Analysis
 ↓
Recommendation
```

without your explanation.

---

## Rule 6 — Highlight the result first

Do not lead with:

> "We used React, FastAPI, LangChain..."

Lead with:

> **"The system tells the entrepreneur which business is safer to pursue before taking the loan."**

Then explain technology.

---

# 60. Judge Psychology

The Winning Presentation README says judges respond well to:

- clarity,
- confidence,
- visible progress,
- believable usefulness.

Therefore every slide should answer one of these questions:

```text
What problem?
Who has it?
Why does it matter?
What did you build?
Does it work?
Why is it different?
What impact can it create?
Can it become real?
```

---

# 61. What Judges Will Dislike

Avoid:

## ❌ Vague AI claims

Bad:

> "Our advanced AI intelligently analyzes everything."

Better:

> "The financial engine uses deterministic scheme rules, while the feasibility engine combines local data and AI reasoning."

---

## ❌ Giant architecture diagrams

Do not show 25 boxes if the judge cannot understand them.

---

## ❌ Feature dumping

Do not say:

> "We have chatbot, maps, dashboard, voice, WhatsApp, ML, blockchain..."

Show the 1–2 features that make the product better.

---

## ❌ Fake precision

Never claim:

```text
Demand = 82.73%
```

unless you can defend how that number was calculated.

---

## ❌ Generic AI reports

The biggest risk for this PS is:

```text
Village Name
     ↓
LLM
     ↓
Generic Business Advice
```

That will be easy for judges to challenge.

---

# 62. Demo Failure Recovery

The README provides a specific recovery plan.

If the live demo breaks:

### 1. Stay calm.

Do not waste 90 seconds debugging.

### 2. Show screenshots.

Have the important screens ready.

### 3. Show deployed URL.

Demonstrate that the system exists.

### 4. Explain expected behavior.

Continue the story.

### 5. Keep the pitch moving.

The judge should never feel that the entire project depends on one browser interaction.

---

# 63. Demo Backup Package

Prepare:

```text
backup/
├── 01_onboarding.png
├── 02_financial_result.png
├── 03_feasibility.png
├── 04_map.png
├── 05_recommendation.png
├── 06_comparison.png
└── demo_video.mp4
```

Also prepare:

```text
deployed URL
GitHub repository
sample dataset
sample user scenario
```

---

# 64. Pitch — 30 Seconds

Use the README's structure:

> **"We built GramVenture AI for rural entrepreneurs who have access to financing but lack reliable local information to decide which business to start. The system combines hyper-local feasibility analysis with deterministic financial and scheme calculations. It shows the entrepreneur not only how much they can borrow, but whether the proposed business is actually viable in their locality."**

---

# 65. Pitch — 60 Seconds

> **"A rural entrepreneur may know they can access a government-backed loan, but they may not know which business is actually viable in their village. Existing advice is often anecdotal or too generic. We built GramVenture AI — a hyper-local business decision assistant that takes only location, available margin capital and business category. Its financial engine instantly calculates project cost, loan structure and applicable scheme, while the feasibility engine analyzes market reach, opportunity, competition, threats, SWOT and pricing. The key is that these outputs are fused into one recommendation. The entrepreneur can then compare businesses and change their capital assumptions before borrowing. Our goal is simple: help people know their business before they borrow."**

---

# 66. Opening Line

Recommended opening:

> # "What if a rural entrepreneur could test a business idea before taking the loan to start it?"

Pause.

Then:

> "That's what we built."

This immediately establishes the product thesis.

---

# 67. Closing Line

Recommended closing:

> # **"We don't tell rural entrepreneurs how to spend their loan. We help them decide whether they should take the loan in the first place."**

This should be the final sentence.

---

# 68. Team Presentation Roles

The six-member research division can also map naturally to the presentation.

| Member | Presentation Responsibility |
|---|---|
| Member 1 | Financial engine + calculator correctness |
| Member 2 | Market + competition |
| Member 3 | Opportunity + risk |
| Member 4 | Data + geospatial grounding |
| Member 5 | Architecture + backend |
| Member 6 | UX + innovation + pitch |

Do not make every member explain every feature.

Each person should have a clear 20–40 second section if the format requires multiple speakers.

---

# 69. Technical Questions Preparation

## Q: Why does Module 2 run first?

> Because it is deterministic and fast. The user gets an immediate financial structure while the data-dependent feasibility engine continues processing.

---

## Q: Why is the financial engine deterministic?

> Financial rules, scheme thresholds, interest rates and repayment calculations should be predictable and testable. AI should not invent loan calculations.

---

## Q: Why use AI?

> AI helps combine heterogeneous market, risk and business information into an understandable, personalized recommendation and supports multilingual interaction. Deterministic financial calculations remain rule-based.

---

## Q: What makes it hyper-local?

> The recommendation is grounded in location-specific data such as population, nearby business density, market indicators and geographic context rather than only generating generic advice from the business category.

---

## Q: What if data is missing?

> The system should expose lower confidence, clearly identify estimated information, request additional inputs where necessary, and avoid presenting unsupported estimates as official facts.

---

## Q: Why compare businesses?

> The entrepreneur's real decision is not only "Is this business viable?" but often "Which business is the best use of my available capital?" The comparator converts the system from a report generator into a decision-support tool.

---

# 70. The Winning Product Story

The entire pitch should follow this emotional and logical sequence:

```text
PROBLEM

"I have money / access to a loan,
but I don't know what business to choose."

        ↓

USER

Rural first-time entrepreneur

        ↓

PAIN

No reliable local market information
+
financial confusion

        ↓

SOLUTION

GramVenture AI

        ↓

INPUT

Location + Capital + Business

        ↓

INTELLIGENCE

Financial + Market + Risk + Competition

        ↓

DECISION

Proceed / Modify / Compare

        ↓

DEMO

Real working workflow

        ↓

IMPACT

Better-informed borrowing decisions

        ↓

FUTURE

Regional languages + voice + offline +
institutional deployment
```

---

# 71. Final Product Architecture

```text
                         USER
                          │
                          ▼
                ┌──────────────────┐
                │  Minimal UX      │
                │ Location         │
                │ Capital          │
                │ Business         │
                └────────┬─────────┘
                         │
                         ▼
                ┌──────────────────┐
                │  API / Backend   │
                └────────┬─────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
      ┌────────────────┐    ┌─────────────────┐
      │ Financial      │    │ Hyper-Local     │
      │ Engine         │    │ Feasibility     │
      │                │    │ Engine           │
      │ Project Cost   │    │ Market           │
      │ Loan           │    │ Opportunity      │
      │ Scheme         │    │ SWOT             │
      │ EMI            │    │ Threats          │
      │ Moratorium     │    │ Competition      │
      └───────┬────────┘    │ Pricing          │
              │             └────────┬────────┘
              │                      │
              │               Data + AI
              │                      │
              └──────────┬───────────┘
                         ▼
                ┌──────────────────┐
                │ Recommendation   │
                │ Engine           │
                └────────┬─────────┘
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
           Score       Compare     Risk
              │          │          │
              └──────────┼──────────┘
                         ▼
                ┌──────────────────┐
                │ Final Report     │
                │ + Checklist      │
                └──────────────────┘
```

---

# 72. Final MVP Screen Map

```text
01 Landing / Language
        ↓
02 Minimal Onboarding
        ↓
03 Financial Result
        ↓
04 Feasibility Loading / Progress
        ↓
05 Combined Recommendation
        ↓
06 Hyper-Local Map
        ↓
07 Detailed Feasibility
        ↓
08 Business Comparator
        ↓
09 Financial Simulation
        ↓
10 Export Report
```

If time is limited, screens 03–09 can be consolidated.

---

# 73. Final Winning Feature Set

## Mandatory

### Module 1

- Market Reach
- Opportunity Analysis
- SWOT
- Threats
- Competitor Mapping
- Pricing / Market Value

### Module 2

- Financial Structuring
- Scheme Auto-Selection
- EMI / Moratorium
- Working Capital / Operating Cost Estimate

## Winning additions

- What-if Business Comparator
- Confidence / Data Quality
- Multilingual UX
- Voice input/output

## Optional

- Offline-first
- WhatsApp
- Document checklist
- Peer benchmarking
- SCA dashboard
- Repayment reminders
- Financial literacy content

---

# 74. Final SIH Strategy

The project should be judged as:

> **A decision-support system for rural entrepreneurship, not a chatbot.**

The three pillars are:

# 1. DATA

Make it genuinely hyper-local.

# 2. FINANCE

Make the numbers exact.

# 3. DECISION

Fuse everything into one recommendation.

```text
          DATA
           +
        FINANCE
           +
          AI
           ↓
      DECISION
```

---

# 75. Final Pre-Presentation Checklist

## Product

- [ ] Minimal onboarding works
- [ ] Location selection works
- [ ] Margin input works
- [ ] Business selection works
- [ ] Financial calculation tested
- [ ] Scheme boundary tested
- [ ] EMI tested
- [ ] Feasibility report generated
- [ ] Combined recommendation works
- [ ] Business comparison works
- [ ] Data confidence shown
- [ ] Export works

## Data

- [ ] Every important dataset identified
- [ ] Source and coverage documented
- [ ] Estimated data clearly labeled
- [ ] No unsupported claims
- [ ] Hyper-local results can be demonstrated

## Demo

- [ ] Demo under 2 minutes
- [ ] Live URL tested
- [ ] Backup screenshots ready
- [ ] Backup video ready
- [ ] Sample scenario ready
- [ ] Internet failure plan ready

## PPT

- [ ] One idea per slide
- [ ] Large text
- [ ] No walls of text
- [ ] Real screenshots
- [ ] Problem before technology
- [ ] Demo clearly visible
- [ ] Impact measurable
- [ ] Future not overpromised

## Team

- [ ] Team roles clear
- [ ] Each member knows their section
- [ ] Opening line memorized
- [ ] Closing line memorized
- [ ] Technical questions assigned

---

# 76. Final Pitch Principle

The uploaded Winning Presentation README gives the central rule:

> **The pitch should make the judge think: "This is clear, useful, and finished."**

Therefore:

```text
DO NOT TRY TO IMPRESS THE JUDGE
WITH THE NUMBER OF FEATURES.

IMPRESS THE JUDGE WITH
THE QUALITY OF THE DECISION
YOUR PRODUCT ENABLES.
```

---

# 77. Final One-Sentence Pitch

> **GramVenture AI helps rural entrepreneurs decide which business is viable in their locality and how much they should safely borrow — before they take the loan.**

---

# 78. Final Closing

# GRAMVENTURE AI

## **Know your business before you borrow.**

```text
Problem
   ↓
User
   ↓
Local Intelligence
   ↓
Financial Intelligence
   ↓
Business Decision
   ↓
Better Borrowing
   ↓
Sustainable Entrepreneurship
```

**PS 26091 — SIH 2026**
