# MetricMind — Agentic Semantic BI Engine

## Final Project Report

**Project:** MetricMind — Agentic Semantic BI Engine  
**Project Type:** Business Intelligence and Sales Analytics Platform  
**Testing & Documentation:** Prashant Bhavimani  
**Date:** August 2026  
**Organization:** Axlero Solutions

---

# 1. Project Overview

MetricMind is a conversational Business Intelligence and Sales Analytics platform designed to help users understand business performance through dashboards, reports, analytics, charts, and natural-language interaction.

The system combines a FastAPI backend, React frontend, MySQL database, analytics services, and an agent/orchestration layer to provide business-oriented insights.

The platform is designed to make sales information easier to understand while providing controlled access to business data and transparent API-based interactions.

---

# 2. Problem Statement

Traditional business analytics often requires users to understand database structures, SQL queries, and complex reporting systems.

Direct text-to-SQL approaches can create several problems, including:

- Incorrect joins between datasets
- Inconsistent business metrics
- Uncontrolled access to data
- Difficulty maintaining common business definitions
- Limited transparency in how analytical results are produced

MetricMind addresses these challenges through a governed analytics workflow where business questions are processed through defined business metrics and controlled data-access mechanisms before producing the final result.

---

# 3. Objectives

The main objectives of MetricMind are:

- Provide an interactive business analytics dashboard.
- Display sales, revenue, orders, profit, and related KPIs.
- Provide reports and analytical views.
- Support natural-language business interaction.
- Use governed business metrics instead of unrestricted SQL access.
- Provide transparent API responses and API traces where applicable.
- Provide interactive charts and visualizations.
- Provide a responsive and user-friendly interface.
- Maintain controlled query and data access.
- Provide authentication and protected user functionality.

---

# 4. System Architecture

The overall conceptual workflow of MetricMind is:

User Question  
↓  
Frontend / User Interface  
↓  
Agent / Orchestration Layer  
↓  
Semantic / Business Metric Layer  
↓  
Backend APIs  
↓  
Database  
↓  
Data Result  
↓  
Final Answer + Chart + API Trace

The architecture separates the user interface, application logic, business metrics, and database access.

This separation helps maintain consistency and makes the system easier to test, maintain, and extend.

---

# 5. Implemented Technology Stack

The implemented project uses the following technologies:

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | FastAPI |
| Programming Language | Python |
| Database | MySQL |
| Data Processing | Pandas |
| API Documentation | Swagger / OpenAPI |
| Version Control | Git / GitHub |
| Browser Testing | Google Chrome |

The frontend communicates with the FastAPI backend through REST APIs.

The backend handles authentication, business logic, data retrieval, and analytical operations.

---

# 6. Frontend

The MetricMind frontend provides a dashboard-based user experience.

Major frontend components include:

- Dashboard
- KPI Cards
- Sales Charts
- Reports
- Analytics
- Chat / natural-language interaction
- Profile
- Settings
- Sidebar Navigation
- Responsive User Interface

The dashboard provides a central view of important business information.

The tested dashboard displayed the following sample project data:

- Total Sales: ₹1,20,000
- Orders: 150
- Profit: ₹25,000

These values are based on the tested application interface and are not invented for the final report.

---

# 7. Backend

The backend is implemented using FastAPI.

The backend provides REST APIs for:

- User registration
- User login
- Authentication
- User profile management
- Home/dashboard functionality
- Reports
- Analytics
- Sales data
- Health checks

FastAPI also provides Swagger/OpenAPI documentation for interactive API testing.

Swagger UI was used during manual API testing to execute endpoints and verify their responses.

---

# 8. Database

MetricMind uses MySQL as its database layer.

The database is responsible for storing and providing business information required by the application.

The backend communicates with the database and exposes controlled API responses to the frontend.

This approach prevents the frontend from directly accessing database tables.

---

# 9. Agent / Orchestration Layer

The agent/orchestration layer is intended to process natural-language business questions and coordinate analytical operations.

A typical workflow is:

1. Receive the user's business question.
2. Understand the requested business metric.
3. Identify the appropriate analytical operation.
4. Use governed business definitions.
5. Retrieve the required data through the application layer.
6. Process the result.
7. Return a business-friendly answer.
8. Display supporting charts or API trace information where available.

The orchestration approach allows users to interact with business information without needing to write SQL queries manually.

---

# 10. Semantic Layer

The semantic layer represents business concepts using defined metrics and dimensions.

Typical business concepts include:

- Revenue
- Sales
- Margin
- Cost
- Orders
- Time
- Geography
- Products
- Customers

A semantic layer provides a consistent definition of business metrics.

For example, instead of allowing different users or agents to calculate revenue differently, the application can use a defined business metric and its associated calculation rules.

This improves consistency and reduces the risk of incorrect business calculations.

---

# 11. Why Use a Semantic Layer Instead of Raw SQL?

The semantic layer is a core architectural requirement of MetricMind.

A raw text-to-SQL approach allows an AI system to generate SQL directly against the database. This can result in:

- Incorrect joins
- Incorrect aggregation
- Duplicate records
- Inconsistent metric calculations
- Access to unintended data
- Difficult-to-audit queries

With a semantic-layer approach, the agent interacts with governed business concepts instead of directly controlling unrestricted database SQL.

Conceptually:

User Question  
↓  
Agent  
↓  
Defined Metric / Semantic Query  
↓  
Controlled Data Access  
↓  
Result

This provides better governance, consistency, maintainability, and transparency than unrestricted raw SQL generation.

---

# 12. Database and Semantic Access

The intended design is that analytical requests are represented through governed business metrics and structured query definitions.

The agent should not have unrestricted access to arbitrary database SQL.

This separation allows business rules to remain centralized and reduces the possibility of inconsistent calculations.

---

# 13. How MetricMind Works

A typical analytical interaction follows this workflow:

### Step 1 — User Question

The user asks a business question using natural language.

Example:

> Why did our European margins drop last quarter?

### Step 2 — Agent

The agent interprets the question and identifies the required business metric and dimensions.

### Step 3 — Metric Catalog

The system identifies relevant metrics such as:

- Margin
- Revenue
- Cost
- Region
- Time period

### Step 4 — Semantic Query

The analytical request is represented using governed business metrics rather than unrestricted raw SQL.

### Step 5 — Data Result

The backend and database provide the required analytical result.

### Step 6 — Final Answer

The system converts the result into a business-friendly explanation.

### Step 7 — Visualization and Trace

Where supported, the result can be represented using charts and API trace information.

---
# 14. Governance and Query Controls

MetricMind follows a governed approach for analytical data access.

The key governance principles are:

- The agent should not generate unrestricted raw SQL.
- Analytical requests should use governed business metrics.
- Access to business data should be controlled through the application layer.
- Query execution should be limited to the required analytical information.
- API traces provide transparency into supported backend operations.

## Query Governance Limits

The project specification defines the following guardrails:

| Governance Rule | Limit |
|---|---|
| Maximum queries per turn | 5 |
| Maximum rows per query | 1,000 |
| Unrestricted SQL from agent | Not allowed |
| Semantic-layer access | Required |
| API trace | Supported where applicable |

These controls are intended to reduce unnecessary database access and improve analytical reliability.

---

# 15. Root-Cause Analysis

MetricMind is designed to support multi-step analytical reasoning for business questions.

## Example Business Question

> Why did our European margins drop last quarter?

A root-cause workflow can be represented as:

User Question  
↓  
Margin Query  
↓  
Detect Significant Margin Change  
↓  
Cost Breakdown Query  
↓  
Shipping Cost  
↓  
Material Cost  
↓  
Other Costs  
↓  
Root Cause  
↓  
Natural-Language Explanation

## European Margin Example

The analytical process starts by examining the margin for the European region during the requested period.

If a significant margin decline is detected, the system can perform a follow-up analysis of relevant cost categories.

Potential categories include:

- Shipping cost
- Material cost
- Other operating costs

The final response should explain the observed change using the available data rather than providing an unsupported assumption.

> Note: No specific European margin values are included in this report unless they were actually produced and verified by the final application.

---

# 16. Charts and User Interface

MetricMind provides a dashboard-oriented interface for business analytics.

The tested UI includes:

- Dashboard
- KPI cards
- Sales chart
- Recent transactions
- Sidebar navigation
- Reports
- Analytics
- Profile
- Settings

## Dashboard

The dashboard provides a summary of important business KPIs.

The tested dashboard displayed:

- Total Sales: ₹1,20,000
- Orders: 150
- Profit: ₹25,000

## Sales Visualization

The sales chart provides a visual representation of sales performance.

Charts help users identify trends and understand business performance more easily than raw tabular data.

## API Trace

Where supported, API trace information can be used to understand the backend request and response flow.

Sensitive information such as authentication tokens should never be included in final screenshots or documentation.

---

# 17. Authentication

MetricMind provides authentication functionality through the FastAPI backend.

The authentication workflow includes:

1. User Registration
2. User Login
3. Access Token Generation
4. Authorization
5. Protected API Access
6. Profile Retrieval

## Registration Test

The registration API was successfully tested using Swagger UI.

Result:

**HTTP 201 Created**

Response confirmed successful user registration.

## Login Test

The login API was successfully tested.

Result:

**HTTP 200 OK**

An access token was generated successfully.

## Profile Test

The protected profile API was tested after authorization.

Result:

**HTTP 200 OK**

The API successfully returned the authenticated user's profile information.

Authentication screenshots are included in the project documentation.

---

# 18. Protected Pages

Protected functionality requires successful authentication before access.

The tested authentication flow demonstrates that:

- Users can register.
- Registered users can log in.
- Login generates an access token.
- Protected APIs require authentication.
- Authorized users can access profile information.

This provides a basic authentication and authorization layer for the application.

---

# 19. Reports and Analytics

MetricMind includes Reports and Analytics modules intended to provide deeper business insights.

The following areas were tested:

- Sales Reports
- Revenue Reports
- Customer Reports
- Monthly Reports
- Sales Analytics
- Product Analytics
- Dashboard Analytics

During the documented testing session, several of these endpoints returned HTTP 500 Internal Server Error responses.

These failures have been documented in `BUG_REPORT.md`.

The failures should be resolved and regression-tested before production deployment.

---

# 20. Testing

Manual testing was performed using the FastAPI Swagger/OpenAPI interface and the frontend application.

## Testing Scope

The testing covered:

- Backend server
- Frontend server
- Authentication
- Registration
- Login
- Profile
- Home APIs
- Dashboard UI
- KPI cards
- Sales chart
- Recent transactions
- Sidebar navigation
- Reports
- Analytics
- API error handling
- Database connectivity

## API Testing Results

| Endpoint / Module | Result |
|---|---|
| Register API | PASS |
| Login API | PASS |
| Profile API | PASS |
| Home API | PASS |
| Home Health API | PASS |
| Home Dashboard API | FAIL |
| Reports APIs | FAIL |
| Analytics APIs | FAIL |

The exact failures are documented in `API_TESTING.md` and `BUG_REPORT.md`.

---

# 21. Error Handling

During testing, the application returned HTTP 500 Internal Server Error responses for several Dashboard, Reports, and Analytics endpoints.

The identified issues were recorded as:

| Bug ID | Module | Priority | Status |
|---|---|---|---|
| BUG-001 | Dashboard | High | Open |
| BUG-002 | Reports | High | Open |
| BUG-003 | Analytics | High | Open |

These errors indicate that the affected backend operations require developer investigation.

The testing report therefore classifies the overall testing result as:

**Partially Passed**

The working modules passed the documented tests, while the identified backend errors remain open.

---

# 22. Responsive Testing

The frontend was checked using the available browser environment to verify the dashboard layout, navigation, KPI cards, charts, and general user interface.

The UI was designed to provide a user-friendly experience across different screen sizes.

Responsive behavior should be regression-tested on additional desktop and mobile screen sizes before final production deployment.

---

# 23. GitHub Repository and Version Control

MetricMind was developed using Git for source-code version control.

The repository contains separate branches and pull requests used during team development.

Documented branch activity included:

- `devops`
- `docs`
- Backend development
- UI development

The documentation work was maintained on the `docs` branch.

Git history was used to track development and integration work.

## Pull Request Evidence

Pull requests were used to review and merge team contributions.

The final repository should be checked to ensure that the relevant documentation and implementation changes have been merged into the appropriate final branch.

Repository:

`https://github.com/ShyamVarmora/MetricMind`

---

# 24. Documentation

The project documentation includes:

- `README.md`
- `API.md`
- `API_TESTING.md`
- `BUG_REPORT.md`
- `INSTALLATION.md`
- `TESTING.md`
- `USER_GUIDE.md`
- `FINAL_REPORT.md`

The documentation describes project installation, APIs, testing, known bugs, usage, and final project information.

---

# 25. Screenshots

Testing and UI evidence is stored under:

```text
docs/
└── screenshots/