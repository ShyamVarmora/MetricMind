SEMANTIC_MAP = {
    "revenue": "totalSales",
    "sales": "totalSales",

    "profit": "profit",
    "margin": "profit",

    "customer": "customers",
    "customers": "customers",

    "product": "products",
    "products": "products",

    "monthly": "monthlySales"
}


def get_metric(question: str):
    question = question.lower()

    for keyword, metric in SEMANTIC_MAP.items():
        if keyword in question:
            return metric

    return None