from fastapi import APIRouter
from app.schemas import AskRequest
from app.semantic_layer import get_metric
router = APIRouter(
    prefix="/ask",
    tags=["AI"]
)

@router.post("")
def ask(request: AskRequest):

    metric = get_metric(request.question)

    if metric == "totalSales":
        return {
            "analysis": "Revenue analysis requested",
            "chart": "bar",
            "api_used": "/analytics/sales"
        }

    elif metric == "profit":
        return {
            "analysis": "Profit analysis requested",
            "chart": "line",
            "api_used": "/analytics"
        }

    elif metric == "customers":
        return {
            "analysis": "Customer analysis requested",
            "chart": "pie",
            "api_used": "/analytics/customers"
        }

    elif metric == "products":
        return {
            "analysis": "Product analysis requested",
            "chart": "bar",
            "api_used": "/analytics/products"
        }

    elif metric == "monthlySales":
        return {
            "analysis": "Monthly sales analysis requested",
            "chart": "line",
            "api_used": "/analytics/monthly"
        }

    return {
        "analysis": "No matching metric found.",
        "chart": None,
        "api_used": None
    }