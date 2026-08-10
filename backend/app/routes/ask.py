from fastapi import APIRouter

from app.schemas import (
    AskRequest,
    AskResponse,
    ErrorResponse
)

from app.agent.orchestrator import AgentOrchestrator
from app.agent.governance import GovernanceError


router = APIRouter(
    prefix="/ask",
    tags=["AI"]
)




@router.post(
    "",
    response_model=AskResponse,
    responses={
        400: {
            "model": ErrorResponse,
            "description": "Invalid or unsupported question"
        }
    }
)
def ask(request: AskRequest):

    try:

        orchestrator = AgentOrchestrator()

        result = orchestrator.execute(
            request.question
        )
        return {
            "success": True,
            "message": "Question processed successfully",
            "data": {
                "answer": result["answer"],
                "data": result["data"],
                "api_trace": result["api_trace"]
            }
        }

    except ValueError as e:

        return {
            "success": False,
            "message": str(e)
        }

    except GovernanceError as e:

        return {
            "success": False,
            "message": str(e)
        }

    except Exception:

        return {
            "success": False,
            "message": "Unable to process the request."
        }