from http import HTTPStatus

from flask import Blueprint, request

from ..core.auth import current_user_required
from ..core.pagination import get_pagination
from ..core.rbac import permission_required
from ..core.responses import api_response
from .helpers import services


alerts_bp = Blueprint("alerts", __name__)


@alerts_bp.get("/alerts")
@current_user_required
@permission_required("alert.read")
def list_alerts():
    page, per_page, search = get_pagination()
    severity = request.args.get("severity")
    read_value = request.args.get("read")
    filters = {"severity": severity}
    items = services()["store"].list(
        "alerts",
        filters=filters,
        search=search,
        search_fields=["title", "message"],
    )
    if read_value in {"true", "false"}:
        items = [item for item in items if item["read"] is (read_value == "true")]
    page_items, pagination = services()["store"].paginate(items, page, per_page)
    return api_response(data=page_items, pagination=pagination)


@alerts_bp.patch("/alerts/<alert_id>/read")
@current_user_required
@permission_required("alert.manage")
def mark_alert_read(alert_id: str):
    alert = services()["store"].update("alerts", alert_id, {"read": True})
    if not alert:
        return api_response(success=False, message="Alert not found.", status=HTTPStatus.NOT_FOUND)
    return api_response(data=alert, message="Alert marked as read.")


@alerts_bp.get("/alerts/preferences")
@current_user_required
@permission_required("alert.manage")
def get_preferences():
    preferences = services()["store"].tables["notification_preferences"].get(request.current_user_id)
    return api_response(data=preferences)


@alerts_bp.patch("/alerts/preferences")
@current_user_required
@permission_required("alert.manage")
def update_preferences():
    payload = request.get_json(force=True, silent=True) or {}
    services()["store"].tables["notification_preferences"][request.current_user_id] = {
        "id": f"pref_{request.current_user_id}",
        "admin_id": request.current_user_id,
        "email_enabled": bool(payload.get("email_enabled", True)),
        "sms_enabled": bool(payload.get("sms_enabled", False)),
        "push_enabled": bool(payload.get("push_enabled", True)),
        "minimum_severity": payload.get("minimum_severity", "medium"),
    }
    return api_response(
        data=services()["store"].tables["notification_preferences"][request.current_user_id],
        message="Alert preferences updated.",
    )
