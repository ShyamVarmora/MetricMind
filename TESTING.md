# MetricMind Testing Guide

## Automated verification

GitHub Actions runs:

```bash
python -m compileall -q backend/app
npm ci
npm run build
```

Latest current-branch result: **backend PASS, frontend PASS**.

## Manual functional checklist

### Authentication

- [ ] Register a new user.
- [ ] Log in with valid credentials.
- [ ] Reject invalid credentials.
- [ ] Open Profile while authenticated.
- [ ] Confirm protected endpoints reject missing/invalid tokens.

### Dashboard

- [ ] KPI values load from MySQL.
- [ ] Sales/orders/profit percentage indicators compare the latest two months.
- [ ] Sales chart renders in chronological order.
- [ ] Recent transactions render correctly.
- [ ] Light theme readable.
- [ ] Dark theme readable.

### Reports

- [ ] Sales Report
- [ ] Revenue Report
- [ ] Customer Report
- [ ] Monthly Report
- [ ] Monthly table readable in dark theme.

### Analytics

- [ ] Default Analytics page opens.
- [ ] Date filters work.
- [ ] Category filters work.
- [ ] Clear Filters restores defaults.
- [ ] Summary cards render.
- [ ] Monthly chart renders.
- [ ] Breakdown table renders.
- [ ] Page remains responsive in dark mode.

### AI

Run:

```text
Hello
Q3 Revenue
Show European sales
Why did sales go up?
Why did European sales increase in Q3?
Why did our European margins drop last quarter?
Show sales by country
Top products by sales
What is the average order value?
```

Expected behavior:

- Conversational questions receive a conversational response without a database query.
- Business questions return database-backed results.
- Repeated `Q3 Revenue` requests are deterministic for unchanged data.
- European questions apply the Europe scope.
- Sales `why` questions perform period comparison and country/product drill-down.
- European margin `why` questions perform a secondary cost breakdown.
- Reasoning steps and API trace are visible.
- User-entered SQL is rejected.

### Visualization

- [ ] Time-series result → line chart.
- [ ] Categorical result → bar chart.
- [ ] Empty result does not create a broken chart.
- [ ] Chart containers remain readable in dark mode.

## Regression checks for previous defects

- [ ] No 10-second AI timeout.
- [ ] No 30-second analytics timeout under the configured database.
- [ ] No white report rows in dark mode.
- [ ] No white profile/analytics cards in dark mode.
- [ ] No backend syntax error on startup.

## Evidence rule

Automated CI is verified. Runtime database checks should be marked PASS only after they are actually executed against the configured MySQL instance.
