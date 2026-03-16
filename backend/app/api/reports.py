from http import HTTPStatus

from flask import Blueprint, request

from ..core.auth import current_user_required
from ..core.extensions import limiter
from ..core.pagination import get_pagination
from ..core.rbac import permission_required
from ..core.responses import api_response
from ..tasks.jobs import process_audio_job
from .helpers import services


reports_bp = Blueprint("reports", __name__)


@reports_bp.get("/reports")
@current_user_required
@permission_required("report.read")
def list_reports():
    page, per_page, search = get_pagination()
    zone_id = request.args.get("zone_id")
    items = services()["store"].list(
        "reports",
        filters={"zone_id": zone_id},
        search=search,
        search_fields=["language", "status"],
    )
    page_items, pagination = services()["store"].paginate(items, page, per_page)
    return api_response(data=page_items, pagination=pagination)


@reports_bp.post("/reports")
@limiter.limit("20 per hour")
def create_report():
    payload = request.get_json(force=True, silent=True) or {}
    store = services()["store"]
    report = store.create(
        "reports",
        {
            "employee_id": payload.get("employee_id"),
            "zone_id": payload.get("zone_id"),
            "language": payload.get("language", "हिन्दी"),
            "audio_media_id": payload.get("audio_media_id"),
            "transcript": "Processing...",
            "translation": "Processing...",
            "structured_report": "Processing...",
            "status": "processing",
            "celery_job_id": None,
        },
    )
    job = process_audio_job.delay({"report_id": report["id"]})
    report = store.update("reports", report["id"], {"celery_job_id": job.id})
    return api_response(
        data=report,
        message="Voice complaint saved and queued for processing.",
        status=HTTPStatus.CREATED,
    )


@reports_bp.get("/reports/<report_id>")
@current_user_required
@permission_required("report.read")
def report_detail(report_id: str):
    report = services()["store"].get("reports", report_id)
    if not report:
        return api_response(success=False, message="Report not found.", status=HTTPStatus.NOT_FOUND)
    return api_response(data=report)
