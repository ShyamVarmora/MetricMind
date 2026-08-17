"""MetricMind semantic contract.

The agent selects only metrics and dimensions from this catalog. SQL templates
remain in the backend data layer; user text is never executed as SQL.
"""

SEMANTIC_MAP = {
    "revenue": "totalRevenue", "sales": "totalRevenue", "income": "totalRevenue", "turnover": "totalRevenue",
    "cost": "totalCost", "costs": "totalCost", "total cost": "totalCost",
    "material cost": "materialCost", "material costs": "materialCost",
    "shipping": "shippingCost", "shipping cost": "shippingCost", "shipping costs": "shippingCost", "freight": "shippingCost",
    "margin": "marginPercent", "margin percent": "marginPercent", "margin percentage": "marginPercent", "profit margin": "marginPercent",
    "profit": "profit", "profits": "profit", "earnings": "profit",
    "transaction": "transactionCount", "transactions": "transactionCount", "orders": "transactionCount", "order": "transactionCount",
    "customer": "customers", "customers": "customers", "client": "customers", "clients": "customers",
    "product": "products", "products": "products", "item": "products", "items": "products",
    "quantity": "quantity", "units": "quantity", "average order value": "averageOrderValue", "aov": "averageOrderValue",
}

GOVERNED_METRICS = {
    "totalRevenue", "totalCost", "materialCost", "shippingCost", "marginPercent", "profit",
    "transactionCount", "customers", "products", "quantity", "averageOrderValue",
}

GOVERNED_DIMENSIONS = {
    "time", "month", "quarter", "year", "geography", "region", "country", "product", "productName",
    "productLine", "color", "customer", "gender", "occupation", "education", "maritalStatus", "income",
}

QUERY_LIMITS = {"max_queries_per_turn": 5, "max_rows_per_query": 1000}

CHART_TYPES = {
    "totalRevenue": "bar", "totalCost": "bar", "materialCost": "bar", "shippingCost": "bar",
    "marginPercent": "line", "profit": "bar", "transactionCount": "bar", "customers": "bar",
    "products": "bar", "quantity": "bar", "averageOrderValue": "bar",
}


def get_metric(question: str):
    if not question:
        return None
    q = question.lower()
    for keyword in sorted(SEMANTIC_MAP, key=len, reverse=True):
        if keyword in q:
            return SEMANTIC_MAP[keyword]
    return None


def get_metrics(question: str):
    if not question:
        return []
    q = question.lower()
    result = []
    for keyword in sorted(SEMANTIC_MAP, key=len, reverse=True):
        metric = SEMANTIC_MAP[keyword]
        if keyword in q and metric not in result:
            result.append(metric)
    return result


def is_allowed_metric(metric: str) -> bool:
    return metric in GOVERNED_METRICS


def is_allowed_dimension(dimension: str) -> bool:
    return dimension in GOVERNED_DIMENSIONS


def get_allowed_metrics():
    return sorted(GOVERNED_METRICS)


def get_allowed_dimensions():
    return sorted(GOVERNED_DIMENSIONS)


def get_chart_type(metric: str):
    return CHART_TYPES.get(metric, "bar")
