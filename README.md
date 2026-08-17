# MetricMind

MetricMind is a Business Intelligence application for Project 1: **Agentic Semantic BI**. It combines a sales dashboard, reports, filtered analytics, authentication/profile management, and a governed natural-language analytics assistant.

## Current implementation

- React + Vite frontend
- FastAPI + Python backend
- MySQL analytics database
- JWT authentication and profile
- Dashboard KPIs, month-over-month change indicators, sales chart and recent transactions
- Sales, revenue, customer and monthly reports
- Analytics date/category filters with country/product breakdowns
- Light and dark theme across application pages
- Natural-language business questions without user-supplied SQL
- Deterministic `Q3 Revenue` and European sales handling
- Sales increase analysis with period comparison plus country/product drill-down
- European margin root-cause workflow with secondary cost analysis
- Dynamic line charts for time-series results and bar charts for categorical results
- View API Call / View SQL transparency
- Persistent chat history and draft
- Query governance: maximum 5 governed steps per turn and maximum 1,000 returned rows

## Example questions

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
Q3 Revenue
```

The assistant answers from the available database. If the database does not contain enough evidence for a causal claim, the answer explicitly says so instead of inventing a reason.

## Agent workflow

```text
Natural-language question
        |
        v
Agent Orchestrator
        |
        v
Governed metric / dimension / filter selection
        |
        v
Parameterized database analysis
        |
        +---- secondary breakdown when a "why" analysis needs it
        |
        v
Business answer + reasoning path + chart/trace
```

For a European margin question, the workflow compares the latest two European quarters and automatically performs a secondary cost breakdown. For a sales-increase question, it compares the relevant periods and drills down by geography and product.

## Governance

The user cannot submit raw SQL through the AI interface. Direct SQL/database commands are rejected. Database-backed turns are counted against the five-step governance limit, and returned rows are bounded to 1,000.

The implementation uses a Python governed semantic layer rather than the exact Cube.dev/dbt + LangChain/Llama 3 + Snowflake/Databricks + Next.js/Tremor stack named in the source assignment. The behavioral boundary is implemented in the current React/FastAPI/MySQL architecture; the stack substitution should be disclosed in the submission rather than hidden.

## Repository structure

```text
MetricMind/
├── backend/
│   └── app/
│       ├── agent/              # governed business-query orchestration
│       ├── routes/             # API endpoints
│       ├── semantic_layer.py   # metric/dimension definitions
│       └── main.py
├── frontend/
│   └── src/
│       ├── pages/              # Dashboard, Reports, Chat, Analytics, Profile, Settings
│       └── components/
├── mysql/metricmind.sql
├── docs/
└── *.md                       # setup, testing, API and user documentation
```

## Local setup

See [INSTALLATION.md](INSTALLATION.md).

### Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

Configure the MySQL connection in `backend/.env` using the fields documented in [INSTALLATION.md](INSTALLATION.md).

## Verification

GitHub Actions currently verifies:

- Python backend compilation
- React production build

The latest verification run for the current `devops` branch completed successfully for both backend and frontend. Database-backed runtime checks still depend on the local MySQL environment.

See:

- [API.md](API.md)
- [API_TESTING.md](API_TESTING.md)
- [TESTING.md](TESTING.md)
- [USER_GUIDE.md](USER_GUIDE.md)
- [BUG_REPORT.md](BUG_REPORT.md)
- [INSTALLATION.md](INSTALLATION.md)
- [docs/FINAL_REPORT.md](docs/FINAL_REPORT.md)
