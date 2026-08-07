from fastapi import APIRouter
from app.schemas import (
    AskRequest,
    AskResponse,
    ErrorResponse
)
from app.semantic_layer import get_metric, get_api

router = APIRouter(
    prefix="/ask",
    tags=["AI"]
)


@router.post(
    "",
    response_model=AskResponse,
    summary="Ask AI Analytics Assistant",
    description="""
Identify the requested business metric from a natural language question
and return the corresponding backend API along with analysis details.
""",
    responses={
        200: {
            "description": "Metric identified successfully"
        },
        400: {
            "model": ErrorResponse,
            "description": "Unable to identify requested metric"
        }
    }
)
def ask(request: AskRequest):

    metric = get_metric(request.question)

    if metric is None:
        return {
            "success": False,
            "message": "Unable to identify requested metric."
        }

    api_used = get_api(metric)

    analysis_map = {
        "totalSales": "Revenue analysis requested.",
        "profit": "Profit analysis requested.",
        "orders": "Orders analysis requested.",
        "customers": "Customer analysis requested.",
        "products": "Product analysis requested.",
        "monthlySales": "Monthly sales analysis requested."
    }

    chart_map = {
        "totalSales": "bar",
        "profit": "line",
        "orders": "bar",
        "customers": "pie",
        "products": "bar",
        "monthlySales": "line"
    }

    return {
        "success": True,
        "message": "Metric identified successfully",
        "data": {
            "metric": metric,
            "analysis": analysis_map.get(metric, ""),
            "chart": chart_map.get(metric, ""),
            "api_used": api_used
        }
    }