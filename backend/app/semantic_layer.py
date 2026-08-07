# Maps all possible user words to one backend metric

SEMANTIC_MAP = {
    # Revenue
    "sales": "totalSales",
    "revenue": "totalSales",
    "income": "totalSales",
    "turnover": "totalSales",

    # Profit
    "profit": "profit",
    "margin": "profit",
    "earnings": "profit",

    # Orders
    "orders": "orders",
    "purchases": "orders",

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

    # Monthly Sales
    "monthly": "monthlySales",
    "trend": "monthlySales",
    "growth": "monthlySales"
}

API_ROUTES = {
    "totalSales": "/dashboard",
    "profit": "/dashboard",
    "orders": "/dashboard",
    "customers": "/reports/customer",
    "products": "/analytics/products",
    "monthlySales": "/dashboard"
}


def get_metric(question: str):
    """
    Finds the metric mentioned in the user's question.
    """

    question = question.lower()

    for keyword, metric in SEMANTIC_MAP.items():
        if keyword in question:
            return metric

    return None

def get_api(metric: str):
    return API_ROUTES.get(metric)