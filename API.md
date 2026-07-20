# MetricMind API Documentation

## Overview

This document provides the API reference for the MetricMind Sales Analytics Dashboard. It includes available endpoints, response formats, HTTP status codes, and example responses.

---

## GET /health

### Description
Checks whether the backend service is running.

### Response

```json
{
  "status": "healthy"
}
```

### Status Codes

- 200 OK

---

## GET /sales

### Description
Retrieves sales records from the database.

### Response

```json
[
  {
    "id": 1,
    "product": "Laptop",
    "sales": 120
  }
]
```

### Status Codes

- 200 OK
- 404 Not Found

---

## GET /dashboard

### Description
Returns dashboard summary and analytics.

### Response

```json
{
  "total_sales": 50000,
  "total_orders": 200,
  "regions": 5
}
```

### Status Codes

- 200 OK
- 500 Internal Server Error
