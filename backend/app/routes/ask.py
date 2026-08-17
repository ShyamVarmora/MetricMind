from fastapi import APIRouter

from app.schemas import AskRequest, AskResponse, ErrorResponse
from app.agent.orchestrator import AgentOrchestrator
from app.agent.governance import GovernanceError


router = APIRouter(prefix="/ask", tags=["AI"])


@router.post("", response_model=AskResponse, responses={400: {"model": ErrorResponse}})
def ask(request: AskRequest):
    try:
        result = AgentOrchestrator().execute(request.question)
        return {
            "success": True,
            "message": "Question processed successfully",
            "data": {
                "answer": result["answer"],
                "data": result.get("data", []),
                "api_trace": result.get("api_trace", []),
                "query": result.get("query", {}),
                "sql": result.get("sql"),
                "params": result.get("params", []),
                "reasoning_steps": result.get("reasoning_steps", []),
            },
        }
    except (ValueError, GovernanceError) as exc:
        return {"success": False, "message": str(exc)}
    except Exception as exc:
        print("AI request error:", exc)
        return {"success": False, "message": "Unable to process the request."}
