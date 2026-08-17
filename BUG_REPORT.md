# MetricMind Bug Report — Current Status

## Resolved in the current Project 1 build

| Issue | Status | Resolution |
|---|---|---|
| Backend syntax error introduced during earlier edits | Resolved | Backend files were restored/reworked; CI compilation now passes. |
| AI request timing out after 10 seconds | Resolved in code | Frontend API timeout increased and the agent workflow was made explicit/multi-step. |
| Analytics request timing out after 30 seconds | Mitigated in code | Independent analytics aggregations now run concurrently and result sets are bounded. |
| Dark theme shows white/unreadable surfaces | Resolved in CSS | Analytics, Reports, Profile, Chat and shared surfaces use theme variables. |
| Report table zebra rows become white in dark mode | Resolved | Table cells/backgrounds now use theme variables. |
| AI only handled a narrow set of questions | Improved | Conversational requests, business metrics, dimensions, sales-increase analysis and margin root-cause analysis are routed through the governed agent. |
| “Why did sales increase?” returned a non-causal trend answer | Resolved in workflow | Sales why-questions trigger period comparison plus country/product secondary breakdowns. |
| KPI percentage indicators were static/inaccurate | Resolved in backend | Dashboard calculates latest-vs-previous-month percentage changes from database data. |

## Known submission constraints

### 1. Database runtime verification

CI verifies Python compilation and the React production build, but it does not contain the local MySQL dataset. Analytics/report/AI runtime results must therefore be checked once against the configured database.

### 2. Source-stack substitution

The Axlero source specification names Cube.dev/dbt, LangChain/Llama 3, Snowflake/Databricks and Next.js/Tremor. The current repository uses a custom Python governed semantic layer, FastAPI, MySQL and React/Vite. The behavioral controls are implemented in the current architecture, but the exact named stack is not present and must not be falsely claimed as present.

### 3. Causal language

The database contains measured sales, cost, freight, product and geography fields. The assistant reports measured contributors and explicitly avoids claiming causal factors that are not represented in the data.

## Verification evidence

Latest GitHub Actions verification for the current `devops` branch:

- Backend compile: PASS
- Frontend production build: PASS

## Severity

No known source-code blocker remains for the implemented repository workflow. The remaining items are runtime database verification and disclosure of the source-stack substitution.
