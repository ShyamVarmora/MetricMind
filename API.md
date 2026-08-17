# MetricMind API

Base URL: `http://localhost:8000`

## Authentication

### `POST /register`

Creates a user.

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password"
}
```

### `POST /login`

OAuth2 form login. Send `username=<email>` and `password=<password>`. Returns a bearer token.

### `GET /profile`

Protected endpoint. Requires `Authorization: Bearer <token>`.

## Dashboard

### `GET /dashboard`

Protected. Returns total sales, orders, customers, profit, month-over-month KPI changes, monthly chart data and recent transactions.

## Analytics

### `GET /analytics/overview`

Query parameters:

- `category`: `All Categories`, `Sales`, `Revenue`, `Customers`, or `Products`
- `start_date`: optional `YYYY-MM-DD`
- `end_date`: optional `YYYY-MM-DD`

Returns summary KPIs, monthly series, top products, breakdown data and active filters.

The endpoint validates date ranges, bounds returned series/breakdown sizes, and executes independent read aggregations concurrently to reduce request latency.

### `GET /analytics/sales`

Returns the top 10 products by sales.

### `GET /analytics/products`

Returns the distinct product count.

### `GET /analytics/customers`

Returns the distinct customer count.

### `GET /analytics/monthly`

Returns monthly sales data, bounded to the available reporting range.

## Reports

The reports router provides sales, revenue, customer and monthly report endpoints under `/api/reports/...`.

## AI

### `POST /ask`

Body:

```json
{
  "question": "Why did our European margins drop last quarter?"
}
```

The response includes:

- `answer`
- `data`
- `query`
- `api_trace`
- `sql` where a database SQL statement is available for transparency
- `params`
- `reasoning_steps`

### Supported example questions

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

### Governance

- User-supplied SQL/database commands are rejected.
- AI database work is routed through the governed business-query layer.
- Maximum 5 governed query operations are recorded per turn.
- Maximum 1,000 returned rows are accepted per turn.
- Multi-step `why` analyses expose their reasoning path and API trace.

## Health

### `GET /`

Returns a simple API status response.

### `GET /health`

Returns `{ "success": true, "status": "healthy" }`.

## OpenAPI

With the backend running, open:

`http://localhost:8000/docs`

This is the authoritative interactive API schema for the running build.
