# --------------------------------
# Semantic Layer
# --------------------------------

SEMANTIC_MAP = {
    # Sales / Revenue
    "revenue": "totalSales",
    "sales": "totalSales",
    "income": "totalSales",
    "turnover": "totalSales",

    # Profit
    "profit": "profit",
    "margin": "profit",
    "earnings": "profit",

    # Cost
    "cost": "cost",
    "costs": "cost",

    # Expenses
    "expense": "expenses",
    "expenses": "expenses",

    # Customers
    "customer": "customers",
    "customers": "customers",
    "client": "customers",
    "clients": "customers",

    # Products
    "product": "products",
    "products": "products",
    "item": "products",
    "items": "products",

    # Regions
    "region": "regions",
    "regions": "regions",
    "area": "regions",
    "areas": "regions",

    # Categories
    "category": "categories",
    "categories": "categories",
    "type": "categories",

    # Time
    "monthly": "monthlySales",
    "month": "monthlySales",

    "quarterly": "quarterlySales",
    "quarter": "quarterlySales",

    "yearly": "yearlySales",
    "year": "yearlySales",

    # Growth
    "growth": "growth",

    # Average
    "average": "average"
}


# --------------------------------
# API Routing
# --------------------------------

API_ROUTES = {
    "totalSales": "/dashboard",
    "profit": "/dashboard",
    "cost": "/analytics",
    "expenses": "/analytics",
    "customers": "/reports/customer",
    "products": "/analytics/products",
    "regions": "/analytics",
    "categories": "/analytics",
    "monthlySales": "/dashboard",
    "quarterlySales": "/analytics/monthly",
    "yearlySales": "/analytics/monthly",
    "growth": "/analytics/monthly",
    "average": "/analytics"
}


# --------------------------------
# Chart Types
# --------------------------------

CHART_TYPES = {
    "totalSales": "bar",
    "profit": "line",
    "cost": "bar",
    "expenses": "bar",
    "customers": "pie",
    "products": "bar",
    "regions": "bar",
    "categories": "pie",
    "monthlySales": "line",
    "quarterlySales": "line",
    "yearlySales": "line",
    "growth": "line",
    "average": "bar"
}


# --------------------------------
# Metric Detection
# --------------------------------

def get_metric(question: str):
    """
    Detect the first matching metric from a question.
    """

    question = question.lower()

    for keyword, metric in SEMANTIC_MAP.items():
        if keyword in question:
            return metric

    return None


# --------------------------------
# Multiple Metric Detection
# --------------------------------

def get_metrics(question: str):
    """
    Detect all matching metrics from a question.
    """

    question = question.lower()

    metrics = []

    for keyword, metric in SEMANTIC_MAP.items():
        if keyword in question and metric not in metrics:
            metrics.append(metric)

    return metrics


# --------------------------------
# API Lookup
# --------------------------------

def get_api(metric: str):
    return API_ROUTES.get(metric)


# --------------------------------
# Chart Lookup
# --------------------------------

def get_chart_type(metric: str):
    return CHART_TYPES.get(metric)