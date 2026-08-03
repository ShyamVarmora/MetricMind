# Installation Guide

## Prerequisites

- Python 3.11 or later
- MySQL
- Git
- VS Code

## Installation Steps

### 1. Clone Repository

```bash
git clone <repository-url>
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Import Database

Import the `metricmind.sql` file into MySQL.

### 4. Run Backend

```bash
uvicorn app.main:app --reload
```

### 5. Open Frontend

Open the frontend in your web browser.
