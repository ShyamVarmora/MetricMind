# MetricMind API Testing

## 1. Start services

Backend:

```powershell
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

Frontend:

```powershell
cd frontend
npm run dev
```

Open `http://localhost:8000/docs` for Swagger/OpenAPI.

## 2. Authentication checks

| Test | Expected |
|---|---|
| Register valid user | 200 / successful registration |
| Register same email | 400 |
| Login valid credentials | bearer token |
| Login invalid credentials | 401 |
| Protected endpoint without token | rejected |
| Protected endpoint with token | accepted |

## 3. Dashboard

`GET /dashboard`

Verify:

- total sales is numeric
- orders/customers are numeric
- profit is numeric
- KPI percentage fields are calculated from the latest two available months
- monthly chart contains ordered month labels
- recent transactions are returned

## 4. Analytics

`GET /analytics/overview`

Run these cases:

1. No filters
2. `category=Sales`
3. `category=Revenue`
4. `category=Customers`
5. `category=Products`
6. Valid date range
7. Start date after end date → 400
8. Invalid date format → 400
9. Repeated request with the same filters returns consistent values

Verify the frontend opens Analytics without the previous 30-second timeout. The endpoint uses bounded result sets and parallel independent reads.

## 5. Reports

Run each report:

- Sales
- Revenue
- Customer
- Monthly

Verify the returned table/cards contain data and remain readable in both light and dark themes.

## 6. AI acceptance checks

Run the following exact questions:

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

### Governance checks

- Enter `SELECT * FROM factinternetsales` → must be rejected.
- Ask the same `Q3 Revenue` question repeatedly → numerical result must remain deterministic for unchanged data.
- `Show European sales` → response must show Europe-filtered data.
- A European margin `why` question → trace must contain a primary analysis and a secondary cost breakdown.
- A sales-increase `why` question → trace must contain period comparison plus geography/product drill-down.
- `View API Call` and `View SQL` must open without crashing.

## 7. Visualization checks

- Time-series result → line chart.
- Categorical result → bar chart.
- No result → no broken/empty chart container.
- Dark theme → chart card, table, labels and inputs remain readable.

## 8. CI checks

GitHub Actions verifies:

```text
python -m compileall -q backend/app
npm ci
npm run build
```

The latest verification run for the current branch completed successfully for both jobs.

## 9. Runtime limitation

CI does not contain the user's MySQL data. Final runtime API checks must be executed against the configured local MySQL database before submission. Do not record a database result as PASS unless it was actually observed.
