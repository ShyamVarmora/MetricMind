# MetricMind — Final Project Report

## Project 1: Agentic Semantic BI Engine

**Organization:** Axlero Solutions  
**Domain:** Enterprise Analytics & Agentic AI  
**Project:** MetricMind  
**Implementation:** React + Vite, FastAPI + Python, MySQL

---

## 1. Executive Summary

MetricMind is a business intelligence application that combines a dashboard, reports, filtered analytics and a governed natural-language analytics assistant.

The central engineering principle is that business questions are interpreted through a controlled metric/dimension layer instead of accepting unrestricted SQL directly from the user. The assistant supports deterministic business queries and multi-step `why` analysis with traceable reasoning.

The current implementation includes:

- authentication and profile management
- dashboard KPIs and monthly sales visualization
- sales, revenue, customer and monthly reports
- date/category analytics filters
- conversational business queries
- sales increase period comparison and geography/product drill-down
- European margin root-cause analysis with secondary cost breakdown
- dynamic chat charts
- API/SQL transparency
- query and row governance
- responsive light/dark UI

---

## 2. Problem Statement

Unrestricted text-to-SQL can create incorrect joins, inconsistent business definitions and numbers that do not match official reporting. MetricMind addresses this by placing a governed analytics boundary between the natural-language question and database execution.

---

## 3. Source Requirements Alignment

The Axlero source document defines Project 1 as an Agentic Semantic BI Engine. Its key requirements are:

1. governed semantic metrics and dimensions
2. an agentic orchestrator that translates natural language into governed analytic calls
3. controlled analytical data access
4. conversational BI with structured visualizations
5. multi-step root-cause reasoning
6. query-cost governance
7. API/SQL transparency

The source acceptance examples include repeated `Q3 Revenue`, `Show me European sales`, and `Why did our European margins drop last quarter?`.

---

## 4. Implemented Architecture

```text
React + Vite
Dashboard / Reports / Analytics / Chat / Profile / Settings
                         |
                         v
                  FastAPI REST API
                         |
                         v
                 Agent Orchestrator
                         |
          +--------------+--------------+
          |                             |
          v                             v
 Governed metric/dimension       Multi-step analysis
 selection + filters             country/product/cost drill-down
          |                             |
          +--------------+--------------+
                         |
                         v
                    MySQL data
                         |
                         v
               Business answer + chart
                         |
                         v
                  API / SQL trace
```

---

## 5. Semantic/Governance Layer

The current repository implements a Python governed semantic layer around business metrics such as:

- sales/revenue
- cost
- shipping cost
- profit
- margin percentage
- orders
- customers
- products
- quantity
- average order value

Supported dimensions include time, geography, product, customer, gender, occupation, color, product line, marital status, education and income.

User-entered SQL is rejected. Database-backed turns are bounded to a maximum of five governed operations and a maximum of 1,000 returned rows.

---

## 6. Agentic Workflow

### Standard question

```text
Question
  ↓
Metric / dimension / filter selection
  ↓
Parameterized database query
  ↓
Controlled result
  ↓
Business answer + chart/trace
```

### Sales increase question

```text
Why did European sales increase in Q3?
        ↓
Compare Q3 with comparison period
        ↓
Measure sales change
        ↓
Country breakdown
        ↓
Product breakdown
        ↓
Business explanation
```

### European margin root cause

```text
Why did our European margins drop last quarter?
        ↓
Compare latest two European quarters
        ↓
Calculate margin change
        ↓
Secondary cost breakdown
        ↓
Compare product cost + shipping
        ↓
Root-cause explanation
```

The system does not invent an unavailable `other cost` field; it explicitly states when the database only exposes product cost and freight.

---

## 7. Dynamic Visualization

The Chat interface chooses:

- line chart for month/quarter/year time-series results
- bar chart for categorical results
- table output for structured non-chart result sets

The answer card also shows the reasoning path and governance/API trace.

---

## 8. Dashboard and KPI Logic

Dashboard KPIs are calculated from the database. Percentage indicators compare the latest available month with the immediately previous month instead of using static placeholder values.

The dashboard also provides:

- total sales
- orders
- customers
- profit
- monthly sales trend
- recent transactions

---

## 9. Analytics

The Analytics page supports:

- date range filtering
- Sales, Revenue, Customers and Products categories
- KPI summaries
- monthly series
- top products
- country/product/customer breakdowns

Independent database reads are executed concurrently and result sets are bounded to reduce the previous request-timeout problem.

---

## 10. Reports

Implemented report views:

- Sales Report
- Revenue Report
- Customer Report
- Monthly Report

Reports use the same real MySQL business data used by the dashboard/analytics workflow.

---

## 11. UI and Theme Quality

The application supports light and dark themes. Theme variables are applied to shared cards, forms, tables, analytics surfaces, reports, profile, chat and error states.

The dark-theme regression that previously produced white/unreadable report rows and profile/analytics surfaces has been addressed in the current CSS.

---

## 12. Testing and Verification

Automated verification:

- backend Python compilation: PASS
- frontend production build: PASS

Manual acceptance checklist:

- authentication
- dashboard KPI/chart/transactions
- four reports
- analytics filters and breakdowns
- conversational AI
- repeated `Q3 Revenue`
- European sales
- sales-increase why analysis
- European margin root cause
- View API Call / View SQL
- light/dark theme regression

Database runtime verification must be performed against the configured MySQL instance because CI does not contain the project database.

---

## 13. Technology Substitution Disclosure

The Axlero source specification names Cube.dev/dbt, LangChain/Llama 3, Snowflake/Databricks and Next.js/Tremor. The current repository uses a custom Python governed semantic layer, FastAPI, MySQL and React/Vite.

This report treats the implemented behavioral controls as the evidence for the current repository and does not falsely claim that the exact source stack is installed.

---

## 14. Conclusion

The current MetricMind repository provides a working Project 1 application architecture with governed natural-language analytics, multi-step analysis, visual results, transparency controls, dashboard/report/analytics surfaces, authentication and theme support.

Before submission, execute the short runtime smoke test against the configured MySQL database and capture final screenshots of the working build. Do not submit screenshots showing an error state or stale dark-mode rendering.
