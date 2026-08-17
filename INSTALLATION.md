# MetricMind Installation Guide

## Requirements

- Windows/macOS/Linux
- Python 3.12 recommended
- Node.js 22 recommended
- npm
- MySQL 8.x
- Git

## 1. Clone the repository

```powershell
git clone <repository-url>
cd MetricMind
git checkout devops
```

## 2. Configure MySQL

Create the database and import the project SQL/data required by the repository.

```sql
SOURCE mysql/metricmind.sql;
```

The analytics application expects these tables to exist:

- `factinternetsales`
- `dimdate`
- `dimcustomer`
- `dimgeography`
- `dimproduct`

## 3. Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=metricmind
DB_USER=root
DB_PASSWORD=your_mysql_password
```

Start FastAPI:

```powershell
uvicorn app.main:app --reload
```

Verify:

- `http://localhost:8000/`
- `http://localhost:8000/health`
- `http://localhost:8000/docs`

## 4. Frontend

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open:

`http://localhost:5173`

## 5. Login flow

Register an account from the application, then log in. The frontend stores the bearer token in local storage and sends it on protected API calls.

## 6. Verify the database before AI testing

The Dashboard and Analytics pages depend on real MySQL data. If they show an error, check:

1. MySQL service is running.
2. `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` and `DB_PASSWORD` are correct.
3. The required dimension/fact tables exist.
4. The database user has SELECT permissions.

## 7. Production build check

Frontend:

```powershell
cd frontend
npm run build
```

Backend:

```powershell
python -m compileall -q backend/app
```

Both checks are also run by GitHub Actions.

## 8. Project 1 runtime smoke test

After both services are running, test:

```text
Dashboard
Reports → Monthly Report
Analytics → All Categories
Chat → Hello
Chat → Q3 Revenue
Chat → Show European sales
Chat → Why did sales go up?
Chat → Why did European sales increase in Q3?
Chat → Why did our European margins drop last quarter?
Settings → Dark theme
```

Verify that every page remains readable after switching between light and dark mode.
