from http import HTTPStatus

from flask import Blueprint, request

from ..core.auth import current_user_required
from ..core.pagination import get_pagination
from ..core.rbac import permission_required
from ..core.extensions import limiter
from ..core.responses import api_response
from ..tasks.jobs import process_frame_job
from .helpers import services


cameras_bp = Blueprint("cameras", __name__)


@cameras_bp.get("/cameras")
@current_user_required
@permission_required("camera.read")
def list_cameras():
    page, per_page, search = get_pagination()
    status = request.args.get("status")
    zone_id = request.args.get("zone_id")
    items = services()["store"].list(
        "cameras",
        filters={"status": status, "zone_id": zone_id},
        search=search,
        search_fields=["name", "kind"],
    )
    page_items, pagination = services()["store"].paginate(items, page, per_page)
    return api_response(data=page_items, pagination=pagination)


@cameras_bp.post("/cameras")
@current_user_required
@permission_required("camera.manage")
def create_camera():
    payload = request.get_json(force=True, silent=True) or {}
    if payload.get("stream_url"):
        existing = [
            camera
            for camera in services()["store"].list("cameras")
            if camera.get("stream_url") == payload.get("stream_url")
        ]
        if existing:
            return api_response(
                success=False,
                message="A camera with this stream URL already exists.",
                status=HTTPStatus.CONFLICT,
            )
    camera = services()["store"].create(
        "cameras",
        {
            "name": payload.get("name", "").strip(),
            "kind": payload.get("kind", "rtsp"),
            "zone_id": payload.get("zone_id"),
            "stream_url": payload.get("stream_url"),
            "status": payload.get("status", "offline"),
            "last_heartbeat_at": payload.get("last_heartbeat_at"),
            "assigned_worker_id": payload.get("assigned_worker_id"),
        },
    )
    services()["store"].add_audit_log(request.current_user_id, "create", "camera", camera["id"], camera)
    return api_response(data=camera, message="Camera created.", status=HTTPStatus.CREATED)


@cameras_bp.post("/cameras/<camera_id>/heartbeat")
@limiter.limit("120 per minute")
def camera_heartbeat(camera_id: str):
    camera = services()["camera"].heartbeat(camera_id)
    return api_response(data=camera, message="Heartbeat received.")


@cameras_bp.post("/cameras/mobile-registration")
@current_user_required
@permission_required("camera.manage")
def mobile_registration():
    payload = request.get_json(force=True, silent=True) or {}
    data = services()["camera"].generate_registration(payload.get("zone_id"), request.current_user_id)
    return api_response(data=data, message="Phone camera registration token created.")


@cameras_bp.post("/cameras/mobile-connect")
@limiter.limit("20 per minute")
def mobile_connect():
    payload = request.get_json(force=True, silent=True) or {}
    camera = services()["camera"].register_phone_camera(
        payload.get("token", ""),
        payload.get("name", "Worker Phone Camera"),
        payload.get("worker_id"),
    )
    return api_response(data=camera, message="Phone camera connected.", status=HTTPStatus.CREATED)


@cameras_bp.post("/cameras/<camera_id>/enqueue-frame")
@current_user_required
@permission_required("camera.manage")
def enqueue_frame(camera_id: str):
    payload = request.get_json(force=True, silent=True) or {}
    job = process_frame_job.delay({"camera_id": camera_id, **payload})
    camera = services()["store"].get("cameras", camera_id)
    return api_response(
        data={"job_id": job.id, "camera": camera},
        message="Frame processing queued. Phase 1 stub task only.",
        status=HTTPStatus.ACCEPTED,
    )
