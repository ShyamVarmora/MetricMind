# MetricMind — Bug Report

## 1. Project Information

| Item | Details |
|---|---|
| Project | MetricMind — Agentic Semantic BI Engine |
| Testing Type | Manual Testing |
| Tested By | Prashant Bhavimani |
| Testing Date | 03 August 2026 |
| Environment | Windows 11 / Google Chrome |
| API Testing Tool | Swagger / OpenAPI |

---

## 2. Bug Summary

During manual API testing, three functional areas were identified with HTTP 500 Internal Server Error responses.

| Priority | Count |
|---|---:|
| Critical | 0 |
| High | 3 |
| Medium | 0 |
| Low | 0 |
| **Total** | **3** |

---

## 3. Bugs Found

### BUG-001 — Dashboard API Error

**Module:** Dashboard

**Endpoint:** `GET /home/dashboard`

**Description:**

The Home Dashboard API returns an HTTP 500 Internal Server Error when executed through Swagger.

**Steps to Reproduce:**

1. Start the MetricMind backend.
2. Open Swagger UI.
3. Locate `GET /home/dashboard`.
4. Execute the request.
5. Observe the response.

**Expected Result:**

The API should return the dashboard data successfully.

**Actual Result:**

The API returns:

```text
500 Internal Server Error