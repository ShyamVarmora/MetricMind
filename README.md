# MetricMind

##  Project Description

MetricMind is a Sales Analytics Dashboard built with FastAPI, React, MySQL, and Python. It helps users analyze sales data through interactive charts and dashboards, providing meaningful insights for better business decisions.

## Technologies

- FastAPI
- React
- MySQL
- Python
- Pandas
- HTML
- CSS
- JavaScript

## Team Members

- Shyam – Team Lead & DevOps
- Chetan – Backend Developer
- Mansi – Data Engineer
- Himesh – Frontend Developer
- Yoshita – UI/UX Developer
- Prashant – QA & Documentation

## Installation Guide

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MetricMind
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

### 3. Activate the Virtual Environment

**Windows**

```bash
venv\Scripts\activate
```

**Linux/macOS**

```bash
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure MySQL Database

- Create a MySQL database named `metricmind`.
- Import the `metricmind.sql` file.
- Update the database username and password in the backend configuration.

### 6. Start the Backend

```bash
uvicorn app.main:app --reload
```

### 7. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

### 8. Open the Application

Frontend:
http://localhost:5173

Backend:
http://localhost:8000


## Project Structure

```text
MetricMind/
├── backend/
├── frontend/
├── mysql/
├── datasets/
├── python/
├── requirements.txt
├── README.md
├── API.md
└── TESTING.md
```
## Features

- Sales Dashboard
- Interactive Charts
- MySQL Database
- FastAPI Backend
- React Frontend
- Responsive UI
- Sales Analysis
## Dashboard Screenshot

(Add a screenshot of the dashboard after the UI is finalized.)





