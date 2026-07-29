# API Documentation

## 1. Health API

### Method
GET

### Endpoint
/health

### Description
Checks whether the backend server is running successfully.

### Request
None

### Response

```json
{
  "status": "OK"
}
```

### Status Codes

- 200 OK – Server is running successfully.
- 500 Internal Server Error – An unexpected server error occurred.

### Example URL

http://localhost:8000/health

### Authentication

None

---

## 2. Sales API

### Method
GET

### Endpoint
/sales

### Description
Retrieves sales records from the MySQL database.

### Request
None

### Response

```json
[
  {
    "id": 1,
    "product": "Laptop",
    "sales": 50000
  }
]
```

### Status Codes

- 200 OK – Sales data retrieved successfully.
- 404 Not Found – No sales data found.
- 500 Internal Server Error – Database or server error.

### Example URL

http://localhost:8000/sales

### Authentication

None

---

## 3. Dashboard API

### Method
GET

### Endpoint
/dashboard

### Description
Returns dashboard analytics and summary information for the frontend.

### Request
None

### Response

```json
{
  "total_sales": 500000,
  "total_orders": 150,
  "top_product": "Laptop"
}
```

### Status Codes

- 200 OK – Dashboard data retrieved successfully.
- 500 Internal Server Error – Server error.

### Example URL

http://localhost:8000/dashboard

### Authentication

None
