# --------------------------------
# Governed Semantic Layer
# --------------------------------

# --------------------------------
# Metric Aliases
# --------------------------------

SEMANTIC_MAP = {

    # Revenue / Sales
    "revenue": "totalRevenue",
    "sales": "totalRevenue",
    "income": "totalRevenue",
    "turnover": "totalRevenue",

    # Cost
    "cost": "totalCost",
    "costs": "totalCost",
    "total cost": "totalCost",

    # Material Cost
    "material cost": "materialCost",
    "material costs": "materialCost",

    # Shipping Cost
    "shipping": "shippingCost",
    "shipping cost": "shippingCost",
    "shipping costs": "shippingCost",
    "freight": "shippingCost",

    # Other Cost
    "other cost": "otherCost",
    "other costs": "otherCost",

    # Margin
    "margin": "marginPercent",
    "margin percent": "marginPercent",
    "margin percentage": "marginPercent",
    "profit margin": "marginPercent",

    # Transactions / Orders
    "transaction": "transactionCount",
    "transactions": "transactionCount",
    "transaction count": "transactionCount",
    "order": "transactionCount",
    "orders": "transactionCount",
    "purchase": "transactionCount",
    "purchases": "transactionCount",

    # Existing business terms
    "profit": "marginPercent",
    "earnings": "marginPercent",

    # Time-based sales
    "monthly": "totalRevenue",
    "monthly sales": "totalRevenue",
    "monthly revenue": "totalRevenue",

    "quarterly": "totalRevenue",
    "quarterly sales": "totalRevenue",
    "quarterly revenue": "totalRevenue",

    "yearly": "totalRevenue",
    "yearly sales": "totalRevenue",
    "yearly revenue": "totalRevenue",

    # Customers / Products
    "customer": "customers",
    "customers": "customers",
    "client": "customers",
    "clients": "customers",

    "product": "products",
    "products": "products",
    "item": "products",
    "items": "products",
}


# --------------------------------
# Governed Metrics
# --------------------------------

GOVERNED_METRICS = {
    "totalRevenue",
    "totalCost",
    "materialCost",
    "shippingCost",
    "otherCost",
    "marginPercent",
    "transactionCount",

    # Existing backend metrics
    "customers",
    "products",
}


# --------------------------------
# Governed Dimensions
# --------------------------------

GOVERNED_DIMENSIONS = {
    "quarter",
    "year",
    "quarterNum",
    "region",
    "country",
    "productName",
    "category",
}


# --------------------------------
# API Routing
# --------------------------------

API_ROUTES = {
    "totalRevenue": "/dashboard",
    "totalCost": "/analytics",
    "materialCost": "/analytics",
    "shippingCost": "/analytics",
    "otherCost": "/analytics",
    "marginPercent": "/dashboard",
    "transactionCount": "/dashboard",

    "customers": "/reports/customer",
    "products": "/analytics/products",
}


# --------------------------------
# Chart Types
# --------------------------------

CHART_TYPES = {
    "totalRevenue": "bar",
    "totalCost": "bar",
    "materialCost": "bar",
    "shippingCost": "bar",
    "otherCost": "bar",
    "marginPercent": "line",
    "transactionCount": "bar",

    "customers": "pie",
    "products": "bar",
}


# --------------------------------
# Metric Detection
# --------------------------------

def get_metric(question: str):
    """
    Detect the first supported metric
    from a natural-language question.
    """

    if not question:
        return None

    question = question.lower().strip()

    # Check longer phrases first
    keywords = sorted(
        SEMANTIC_MAP.keys(),
        key=len,
        reverse=True
    )

    for keyword in keywords:

        if keyword in question:
            return SEMANTIC_MAP[keyword]

    return None


# --------------------------------
# Multiple Metric Detection
# --------------------------------

def get_metrics(question: str):
    """
    Detect all supported metrics.
    """

    if not question:
        return []

    question = question.lower().strip()

    metrics = []

    keywords = sorted(
        SEMANTIC_MAP.keys(),
        key=len,
        reverse=True
    )

    for keyword in keywords:

        metric = SEMANTIC_MAP[keyword]

        if keyword in question and metric not in metrics:
            metrics.append(metric)

    return metrics


# --------------------------------
# Metric Validation
# --------------------------------

def is_allowed_metric(metric: str) -> bool:
    """
    Check whether a metric belongs
    to the governed metric catalog.
    """

    return metric in GOVERNED_METRICS


# --------------------------------
# Dimension Validation
# --------------------------------

def is_allowed_dimension(dimension: str) -> bool:
    """
    Check whether a dimension belongs
    to the governed dimension catalog.
    """

    return dimension in GOVERNED_DIMENSIONS


# --------------------------------
# Get Allowed Metrics
# --------------------------------

def get_allowed_metrics():
    """
    Return all governed metrics.
    """

    return sorted(GOVERNED_METRICS)


# --------------------------------
# Get Allowed Dimensions
# --------------------------------

def get_allowed_dimensions():
    """
    Return all governed dimensions.
    """

    return sorted(GOVERNED_DIMENSIONS)


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