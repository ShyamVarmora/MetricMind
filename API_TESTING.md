# API Testing

## GET /health

Expected Status: 200 OK

Response

```json
{
  "status":"healthy"
}
```

---

## GET /sales

Expected Status: 200 OK

---

## GET /dashboard

Expected Status: 200 OK

---

# API Testing Report

## Test Summary

The following APIs were tested manually using Swagger UI.

| Endpoint | Method | Expected Result | Actual Result | Status |
|----------|--------|-----------------|---------------|--------|
| /register | POST | User should register successfully | User registered successfully | PASS |
| /login | POST | JWT token should be generated | Access token generated successfully | PASS |
| /profile | GET | User profile should be returned | User profile returned successfully | PASS |
| /profile | PUT | User profile should be updated | User profile updated successfully | PASS |
| /home | GET | Home API should return data | Data returned successfully | PASS |
| /home/health | GET | Health check should return success | Health check returned successfully | PASS |
| /home/dashboard | GET | Dashboard data should be returned | 500 Internal Server Error | FAIL |
| /reports/sales | GET | Sales report should be returned | 500 Internal Server Error | FAIL |
| /reports/revenue | GET | Revenue report should be returned | 500 Internal Server Error | FAIL |
| /reports/customer | GET | Customer report should be returned | 500 Internal Server Error | FAIL |
| /reports/monthly | GET | Monthly report should be returned | 500 Internal Server Error | FAIL |
| /analytics | GET | Analytics data should be returned | 500 Internal Server Error | FAIL |
| /analytics/sales | GET | Sales analytics should be returned | 500 Internal Server Error | FAIL |
| /analytics/products | GET | Product analytics should be returned | 500 Internal Server Error | FAIL |

## Overall Result

- Total APIs Tested: 14
- Passed: 6
- Failed: 8

## Remarks

Authentication APIs and Home APIs are working successfully.

The Dashboard, Reports, and Analytics APIs are returning **500 Internal Server Error** and require developer investigation.