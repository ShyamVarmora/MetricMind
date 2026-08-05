from fastapi import Request
from fastapi.responses import JSONResponse
import time

# Store request timestamps for each IP
request_log = {}

RATE_LIMIT = 1000     # requests
TIME_WINDOW = 60       # seconds


async def rate_limit_middleware(request: Request, call_next):
    ip = request.client.host
    current_time = time.time()

    if ip not in request_log:
        request_log[ip] = []

    # Keep only requests from the last 60 seconds
    request_log[ip] = [
        t for t in request_log[ip]
        if current_time - t < TIME_WINDOW
    ]

    # Check limit
    if len(request_log[ip]) >= RATE_LIMIT:
        return JSONResponse(
            status_code=429,
            content={
                "success": False,
                "message": "Rate limit exceeded. Try again later."
            }
        )

    # Record current request
    request_log[ip].append(current_time)

    # Continue processing
    response = await call_next(request)
    return response