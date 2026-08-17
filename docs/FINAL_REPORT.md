# MetricMind — Agentic Semantic BI Engine

## Final Project Report

**Project:** MetricMind — Agentic Semantic BI Engine  
**Project Type:** Business Intelligence and Sales Analytics Platform  
**Testing & Documentation:** Prashant Bhavimani  
**Date:** August 2026  
**Organization:** Axlero Solutions

---

# 1. Executive Summary

MetricMind is an Agentic Semantic Business Intelligence and Sales Analytics platform designed to help users understand business performance through dashboards, reports, analytics, charts, and natural-language interaction.

The system combines a React + Vite frontend, FastAPI + Python backend, MySQL database, JWT authentication, analytics functionality, and a Python-based governed semantic layer.

MetricMind is designed to solve the trust problem associated with unrestricted Text-to-SQL by controlling analytical meaning before database execution.

The platform provides:

- Business dashboards
- KPI cards
- Sales visualizations
- Reports
- Analytics
- Conversational AI
- Multi-step business reasoning
- API/query traceability
- Authentication and profile management
- Responsive UI
- Light and dark themes
- Governed query controls

The latest project build was functionally verified and the final QA status was confirmed as **PASS**.

---

# 2. Problem Statement

Traditional business analytics often requires users to understand database structures, SQL queries, and complex reporting systems.

Unrestricted Text-to-SQL can create several trust and governance problems:

- Incorrect joins
- Inconsistent metric definitions
- Incorrect aggregations
- Uncontrolled data access
- Difficulty maintaining common business definitions
- Limited transparency into analytical operations

MetricMind addresses this problem by introducing a governed analytics workflow between the business question and database execution.

Instead of allowing users or an AI system to directly control unrestricted SQL, business questions are interpreted using governed metrics, dimensions, filters, and controlled analytical operations.

---

# 3. Project Objectives

The main objectives of MetricMind are:

- Provide an interactive business analytics dashboard.
- Display sales, revenue, orders, profit, and related KPIs.
- Provide reports and analytical views.
- Support natural-language business questions.
- Use governed business metrics instead of unrestricted SQL access.
- Provide transparent API and query information.
- Provide interactive charts and visualizations.
- Support multi-step analytical reasoning.
- Provide authentication and protected user functionality.
- Provide a responsive and user-friendly interface.
- Support light and dark themes.
- Maintain controlled query and data access.

---

# 4. Source Requirements

The source project requirement defines MetricMind as an Agentic Semantic BI Engine.

The major source requirements include:

- Governed semantic business metrics.
- Natural-language business interaction.
- Multi-step analytical reasoning.
- Q3 revenue analysis.
- European sales analysis.
- European margin root-cause analysis.
- Query governance.
- API and SQL traceability.
- Dashboard and analytics functionality.
- Responsive UI.
- Testing and documentation evidence.

The implementation satisfies these requirements using the technology stack available in the current repository.

---

# 5. System Architecture

The overall MetricMind workflow is:

```text
User Question
      ↓
React + Vite Frontend
      ↓
FastAPI REST API
      ↓
Agent Orchestrator
      ↓
Python Governed Semantic Layer
      ↓
Parameterized MySQL Queries
      ↓
Business Data
      ↓
Result + Explanation + Chart + Trace
