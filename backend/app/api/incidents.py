from http import HTTPStatus

from flask import Blueprint, request

from ..core.auth import current_user_required
from ..core.pagination import get_pagination
from ..core.rbac import permission_required
from ..core.responses import api_response
from .helpers import services


incidents_bp = Blueprint("incidents", __name__)


@incidents_bp.get("/incidents")
@current_user_required
@permission_required("incident.manage")
def list_incidents():
    page, per_page, search = get_pagination()
    filters = {
        "status": request.args.get("status"),
        "severity": request.args.get("severity"),
        "zone_id": request.args.get("zone_id"),
        "type": request.args.get("type"),
    }
    items = services()["store"].list(
        "incidents",
        filters=filters,
        search=search,
        search_fields=["title", "description", "type", "severity"],
    )
    page_items, pagination = services()["store"].paginate(items, page, per_page)
    return api_response(data=page_items, pagination=pagination)


@incidents_bp.get("/incidents/<incident_id>")
@current_user_required
@permission_required("incident.manage")
def incident_detail(incident_id: str):
    incident = services()["store"].get("incidents", incident_id)
    if not incident:
        return api_response(success=False, message="Incident not found.", status=HTTPStatus.NOT_FOUND)
    return api_response(
        data={
            **incident,
            "ai_analysis_placeholder": "AI analysis pending — will be available after Phase 2 integration.",
        }
    )


@incidents_bp.post("/incidents")
@current_user_required
@permission_required("incident.manage")
def create_incident():
    payload = request.get_json(force=True, silent=True) or {}
    incident = services()["store"].create(
        "incidents",
        {
            "type": payload.get("type", "manual_flag"),
            "severity": payload.get("severity", "medium"),
            "status": payload.get("status", "open"),
            "zone_id": payload.get("zone_id"),
            "camera_id": payload.get("camera_id"),
            "employee_id": payload.get("employee_id"),
            "snapshot_media_id": payload.get("snapshot_media_id"),
            "source": payload.get("source", "manual_flag"),
            "title": payload.get("title", "").strip(),
            "description": payload.get("description", "").strip(),
            "ai_description": "AI analysis pending — will be available after Phase 2 integration.",
            "resolution_notes": payload.get("resolution_notes", ""),
        },
    )
    services()["store"].add_audit_log(request.current_user_id, "create", "incident", incident["id"], incident)
    if incident["severity"] in {"high", "critical"}:
        services()["alerts"].create_alert(
            incident,
            title=f"{incident['severity'].title()} incident",
            message=incident["title"] or "New high severity incident detected.",
        )
    return api_response(data=incident, message="Incident created.", status=HTTPStatus.CREATED)


@incidents_bp.patch("/incidents/<incident_id>")
@current_user_required
@permission_required("incident.manage")
def update_incident(incident_id: str):
    payload = request.get_json(force=True, silent=True) or {}
    incident = services()["store"].update("incidents", incident_id, payload)
    if not incident:
        return api_response(success=False, message="Incident not found.", status=HTTPStatus.NOT_FOUND)
    services()["store"].add_audit_log(request.current_user_id, "update", "incident", incident_id, payload)
    return api_response(data=incident, message="Incident updated.")
