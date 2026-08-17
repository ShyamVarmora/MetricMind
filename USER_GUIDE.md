# MetricMind User Guide

## Dashboard

The Dashboard summarizes the current business data with:

- Total Sales
- Orders
- Profit
- Month-over-month percentage indicators
- Monthly sales chart
- Recent transactions

## Reports

Open **Reports** and select:

- Sales Report
- Revenue Report
- Customer Report
- Monthly Report

The report result area updates after selecting a report.

## Analytics

Open **Analytics** to filter the database by:

- From date
- To date
- Category

Available categories are Sales, Revenue, Customers and Products. The page displays KPI summaries, a monthly chart, top products and a category/country/product breakdown.

Use **Clear Filters** to restore the default view.

## Chat / Ask AI

The Chat page accepts natural-language business questions. Do not type SQL.

### Basic questions

```text
Hello
Q3 Revenue
Show European sales
Show sales by country
Top products by sales
What is the average order value?
```

### Why-analysis questions

```text
Why did sales go up?
Why did European sales increase in Q3?
Why did our European margins drop last quarter?
```

A sales-increase question compares the relevant periods and automatically drills down by geography and product. A European margin-drop question compares quarters and performs a secondary cost breakdown using product cost and shipping data.

The answer card can display:

- Answer
- Reasoning path
- Visual result
- Returned data
- Governance trace
- View API Call
- View SQL when available

## Dark mode

Open **Settings** and switch the theme. Dashboard, Reports, Analytics, Chat, Profile and Settings surfaces are theme-aware.

If a page appears partly white after a cached deployment, hard-refresh the browser (`Ctrl+F5`) once.

## Profile

Open **Profile** to view/edit profile information when authenticated.

## Governance behavior

The AI rejects direct SQL/database commands. The application routes supported business questions through governed metrics, dimensions and filters. Complex `why` questions may perform multiple bounded analysis steps.

## Good questions

Be specific about the business concept when possible:

- `Q3 Revenue`
- `European sales in Q3`
- `sales by country`
- `margin by quarter`
- `top products by sales`
- `why did European margins drop last quarter?`

The assistant will state when the database does not contain enough information to support a causal conclusion.
