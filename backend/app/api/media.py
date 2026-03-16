from http import HTTPStatus

from flask import Blueprint, request

from ..core.auth import current_user_required
from ..core.extensions import limiter
from ..core.pagination import get_pagination
from ..core.rbac import permission_required
from ..core.responses import api_response
from .helpers import services


media_bp = Blueprint("media", __name__)


@media_bp.get("/media")
@current_user_required
@permission_required("media.read")
def list_media():
    page, per_page, search = get_pagination()
    filters = {
        "media_type": request.args.get("media_type"),
        "zone_id": request.args.get("zone_id"),
        "camera_id": request.args.get("camera_id"),
    }
    items, pagination = services()["media"].list_media(
        page=page,
        per_page=per_page,
        filters=filters,
        search=search,
    )
    return api_response(data=items, pagination=pagination)


@media_bp.post("/media/presign")
@limiter.limit("30 per minute")
def presign_media():
    payload = request.get_json(force=True, silent=True) or {}
    media = services()["media"].create_upload(
        filename=payload.get("filename", "upload.bin"),
        content_type=payload.get("content_type", "application/octet-stream"),
        size_bytes=int(payload.get("size_bytes", 0)),
        zone_id=payload.get("zone_id"),
        camera_id=payload.get("camera_id"),
    )
    return api_response(data=media, message="Presigned upload generated.", status=HTTPStatus.CREATED)


@media_bp.post("/media/<media_id>/complete")
def complete_media(media_id: str):
    media = services()["media"].mark_uploaded(media_id)
    return api_response(data=media, message="Media upload marked complete.")
