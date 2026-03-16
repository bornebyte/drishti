from flask import Blueprint

from ..core.responses import api_response


health_bp = Blueprint("health", __name__)


@health_bp.get("/health")
def health():
    return api_response(
        data={"status": "ok", "service": "drishti-backend"},
        message="Backend is healthy.",
    )
