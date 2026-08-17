# MetricMind — Agentic Semantic BI Engine

## Project 1 — Enterprise Analytics & Agentic AI

MetricMind is a governed conversational business intelligence platform that allows users to ask business questions in natural language and receive analytical results, visualizations, and transparent API/query traces.

The system combines a React frontend, FastAPI backend, Python-based governed semantic layer, MySQL database, authentication, analytics, reports, and conversational AI.

---

# 1. Problem Statement

Traditional Text-to-SQL systems allow an LLM to generate SQL directly against raw warehouse tables.

This approach can result in:

- Incorrect joins
- Inconsistent business metrics
- Metric definition drift
- Uncontrolled database queries
- Difficult-to-audit analytical results

MetricMind addresses this problem by introducing a governed semantic layer between the AI agent and the database.

The agent works with governed metrics, dimensions, filters, and query structures instead of allowing unrestricted raw SQL generation.

---

# 2. Project Objectives

The main objectives of MetricMind are:

- Provide natural-language business analytics.
- Provide governed business metrics.
- Prevent unrestricted SQL generation by the agent.
- Support multi-step analytical reasoning.
- Provide transparent API/query traces.
- Provide interactive charts and dashboards.
- Support reports and analytics.
- Provide responsive web interfaces.
- Provide authentication and protected user functionality.

---

# 3. Key Features

- Interactive Sales Dashboard
- KPI Cards
- Sales and Revenue Charts
- Reports
- Analytics
- Conversational AI
- Governed Semantic Layer
- Multi-step Business Analysis
- API Trace
- View SQL
- JWT Authentication
- User Profile
- Responsive UI
- Light/Dark UI support where implemented
- MySQL database integration

---

# 4. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI + Python |
| Database | MySQL |
| Charts | Recharts |
| Authentication | JWT |
| Semantic Layer | Python governed semantic layer |
| API Documentation | Swagger / OpenAPI |
| Styling | HTML / CSS |
| Data Processing | Python / Pandas |

---

# 5. Source-Stack Substitution

The original project specification references technologies such as:

- Next.js
- Tremor
- Cube.dev / dbt
- LangChain / Llama 3
- Snowflake / Databricks

The current repository uses:

- React + Vite instead of Next.js
- Recharts for visualizations
- FastAPI + Python for backend and orchestration
- MySQL as the database
- Python-based governed semantic layer

These substitutions were made while preserving the core architectural requirement: the agent must interact with governed business semantics rather than directly generating unrestricted SQL.

---

# 6. System Architecture

```text
User Question
      ↓
React + Vite Frontend
      ↓
FastAPI REST API
      ↓
Agent Orchestrator
      ↓
Governed Semantic Layer
      ↓
Parameterized MySQL Queries
      ↓
Business Data
      ↓
Result
      ↓
Answer + Chart + API Trace
