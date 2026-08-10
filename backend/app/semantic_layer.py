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

    # Orders
    "order": "orders",
    "orders": "orders",
    "purchase": "orders",
    "purchases": "orders",

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
    "orders": "/dashboard",
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
    "orders": "bar",
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
# Allowed Metric Catalog
# --------------------------------

ALLOWED_METRICS = set(API_ROUTES.keys())


def get_allowed_metrics():
    """
    Return the metrics that the agent is allowed to request.
    The agent must not invent metrics outside this catalog.
    """
    return sorted(ALLOWED_METRICS)


def is_allowed_metric(metric: str) -> bool:
    """
    Check whether a metric exists in the governed metric catalog.
    """
    return metric in ALLOWED_METRICS


# --------------------------------
# Metric Detection
# --------------------------------

def get_metric(question: str):
    """
    Detect the most specific metric from a question.

    Specific phrases are checked before generic keywords
    such as 'sales'.
    """

    question = question.lower().strip()

    # Specific time-based phrases first
    if "monthly sales" in question or "monthly revenue" in question:
        return "monthlySales"

    if "quarterly sales" in question or "quarterly revenue" in question:
        return "quarterlySales"

    if "yearly sales" in question or "yearly revenue" in question:
        return "yearlySales"

    # Then check normal semantic mappings
    for keyword, metric in SEMANTIC_MAP.items():
        if keyword in question:
            return metric

    return None


# --------------------------------
# Multiple Metric Detection
# --------------------------------

def get_metrics(question: str):
    """
    Detect all relevant metrics from a question
    while avoiding generic matches when a more
    specific metric is already detected.
    """

    question = question.lower().strip()

    metrics = []

    # Specific time-based phrases
    if "monthly sales" in question or "monthly revenue" in question:
        metrics.append("monthlySales")

    if "quarterly sales" in question or "quarterly revenue" in question:
        metrics.append("quarterlySales")

    if "yearly sales" in question or "yearly revenue" in question:
        metrics.append("yearlySales")

    # Check remaining semantic mappings
    for keyword, metric in SEMANTIC_MAP.items():

        # Avoid adding totalSales when a time-based
        # sales metric was already detected.
        if metric == "totalSales" and any(
            time_metric in metrics
            for time_metric in [
                "monthlySales",
                "quarterlySales",
                "yearlySales"
            ]
        ):
            continue

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