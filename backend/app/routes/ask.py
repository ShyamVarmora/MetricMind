from datetime import datetime, timezone

from fastapi import APIRouter

from app.schemas import (
    AskRequest,
    AskResponse,
    ErrorResponse
)

from app.semantic_layer import (
    get_metrics,
    get_api,
    get_chart_type
)


router = APIRouter(
    prefix="/ask",
    tags=["AI"]
)


@router.post(
    "",
    response_model=AskResponse,
    summary="Ask AI Analytics Assistant",
    description="""
Ask a natural language business question.

The API detects one or more business metrics,
identifies the user's intent, and returns the
corresponding backend APIs and chart types.
""",
    responses={
        200: {
            "description": "Question processed successfully"
        },
        400: {
            "model": ErrorResponse,
            "description": "Invalid or unsupported question"
        }
    }
)
def ask(request: AskRequest):

    # -----------------------------
    # Validate empty question
    # -----------------------------

    if not request.question:
        return {
            "success": False,
            "message": "Question cannot be empty."
        }

    question = request.question.strip()

    if not question:
        return {
            "success": False,
            "message": "Question cannot be empty."
        }

    # -----------------------------
    # Detect metrics
    # -----------------------------

    metrics = get_metrics(question)

    if not metrics:
        return {
            "success": False,
            "message": "Unable to identify requested metric."
        }

    # -----------------------------
    # Detect intent
    # -----------------------------

    question_lower = question.lower()

    if any(word in question_lower for word in [
        "compare",
        "comparison"
    ]):
        intent = "comparison"

    elif any(word in question_lower for word in [
        "trend",
        "growth",
        "increase",
        "decrease"
    ]):
        intent = "trend"

    elif any(word in question_lower for word in [
        "show",
        "display",
        "give",
        "tell",
        "what",
        "how much",
        "how many"
    ]):
        intent = "analysis"

    else:
        intent = "analysis"

    # -----------------------------
    # Build metric results
    # -----------------------------

    metric_results = []

    for metric in metrics:

        api_used = get_api(metric)
        chart_type = get_chart_type(metric)

        metric_results.append({
            "metric": metric,
            "api_used": api_used,
            "chart_type": chart_type
        })

    # -----------------------------
    # Metadata
    # -----------------------------

    metadata = {
        "endpoint": "/ask",
        "method": "POST",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "metric": metrics,
        "chart_type": [
            get_chart_type(metric)
            for metric in metrics
        ]
    }

    # -----------------------------
    # Success response
    # -----------------------------

    return {
        "success": True,
        "message": "Question processed successfully",
        "data": {
            "question": question,
            "intent": intent,
            "metrics": metric_results,
            "meta": metadata
        }
    }