from http import HTTPStatus

from flask import Blueprint, request

from ..core.auth import current_user_required
from ..core.pagination import get_pagination
from ..core.rbac import permission_required
from ..core.responses import api_response
from .helpers import services


zones_bp = Blueprint("zones", __name__)


@zones_bp.get("/zones")
@current_user_required
@permission_required("zone.read")
def list_zones():
    page, per_page, search = get_pagination()
    store = services()["store"]
    items = store.list("zones", search=search, search_fields=["name", "code", "factory_name"])
    page_items, pagination = store.paginate(items, page, per_page)
    return api_response(data=page_items, pagination=pagination)


@zones_bp.post("/zones")
@current_user_required
@permission_required("zone.manage")
def create_zone():
    payload = request.get_json(force=True, silent=True) or {}
    existing = [
        zone
        for zone in services()["store"].list("zones")
        if zone["code"].lower() == payload.get("code", "").strip().lower()
    ]
    if existing:
        return api_response(success=False, message="A zone with this code already exists.", status=HTTPStatus.CONFLICT)
    zone = services()["store"].create(
        "zones",
        {
            "name": payload.get("name", "").strip(),
            "code": payload.get("code", "").strip().upper(),
            "description": payload.get("description", "").strip(),
            "factory_name": payload.get("factory_name", "").strip(),
            "reference_image_media_id": payload.get("reference_image_media_id"),
            "status": payload.get("status", "active"),
        },
    )
    services()["store"].add_audit_log(request.current_user_id, "create", "zone", zone["id"], zone)
    return api_response(data=zone, message="Zone created.", status=HTTPStatus.CREATED)


@zones_bp.patch("/zones/<zone_id>")
@current_user_required
@permission_required("zone.manage")
def update_zone(zone_id: str):
    payload = request.get_json(force=True, silent=True) or {}
    if payload.get("code"):
        duplicate = [
            zone
            for zone in services()["store"].list("zones")
            if zone["id"] != zone_id and zone["code"].lower() == payload["code"].strip().lower()
        ]
        if duplicate:
            return api_response(success=False, message="A zone with this code already exists.", status=HTTPStatus.CONFLICT)
    zone = services()["store"].update("zones", zone_id, payload)
    if not zone:
        return api_response(success=False, message="Zone not found.", status=HTTPStatus.NOT_FOUND)
    services()["store"].add_audit_log(request.current_user_id, "update", "zone", zone_id, payload)
    return api_response(data=zone, message="Zone updated.")


@zones_bp.delete("/zones/<zone_id>")
@current_user_required
@permission_required("zone.manage")
def delete_zone(zone_id: str):
    zone = services()["store"].soft_delete("zones", zone_id)
    if not zone:
        return api_response(success=False, message="Zone not found.", status=HTTPStatus.NOT_FOUND)
    services()["store"].add_audit_log(request.current_user_id, "delete", "zone", zone_id)
    return api_response(message="Zone deleted.")
