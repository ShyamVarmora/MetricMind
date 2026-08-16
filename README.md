# MetricMind — Agentic Semantic BI Engine

## Project Overview

MetricMind is a conversational Business Intelligence and Sales Analytics platform designed to help users understand business performance through dashboards, reports, analytics, and natural-language interaction.

The project combines a FastAPI backend, React frontend, MySQL database, analytics services, and an agent/orchestration layer to provide governed business insights.

## Problem Statement

Traditional business analytics often requires users to understand databases, SQL queries, and complex reporting systems.

Direct text-to-SQL approaches can also produce incorrect joins, inconsistent business metrics, and uncontrolled access to data.

MetricMind addresses this problem by introducing a governed analytics workflow where business questions are processed through defined metrics and controlled data access before producing the final result.

## Objective

The main objectives of MetricMind are:

- Provide an interactive business analytics dashboard.
- Display sales, revenue, orders, profit, and related KPIs.
- Provide reports and analytical views.
- Support natural-language business questions through the agent/orchestration layer.
- Use governed business metrics instead of unrestricted SQL access.
- Provide transparent API responses and API traces where applicable.
- Provide responsive and user-friendly UI.
- Maintain controlled query and data access.

## Core Architecture

```text
User Question
      |
      v
Frontend / UI
      |
      v
Agent / Orchestrator
      |
      v
Semantic / Metric Layer
      |
      v
Database
      |
      v
Data Result
      |
      v
Final Answer + Chart + API Trace