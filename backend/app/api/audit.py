from flask import Blueprint

from ..core.auth import current_user_required
from ..core.pagination import get_pagination
from ..core.rbac import permission_required
from ..core.responses import api_response
from .helpers import services


audit_bp = Blueprint("audit", __name__)


@audit_bp.get("/audit-logs")
@current_user_required
@permission_required("audit.read")
def list_audit_logs():
    page, per_page, search = get_pagination()
    items = services()["store"].list(
        "audit_logs",
        search=search,
        search_fields=["action", "entity", "entity_id", "actor_id"],
    )
    page_items, pagination = services()["store"].paginate(items, page, per_page)
    return api_response(data=page_items, pagination=pagination)
