from flask import Blueprint, request

from ..core.auth import current_user_required
from ..core.pagination import get_pagination
from ..core.rbac import permission_required
from ..core.responses import api_response
from .helpers import services


dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.get("/dashboard/summary")
@current_user_required
@permission_required("dashboard.read")
def summary():
    store = services()["store"]
    incidents = store.list("incidents")
    reports = store.list("reports")
    alerts = store.list("alerts")
    cameras = store.list("cameras")
    zones = store.list("zones")
    open_incidents = [incident for incident in incidents if incident["status"] == "open"]
    avg_resolution_hours = 4.6
    return api_response(
        data={
            "stats": {
                "incidents_total": len(incidents),
                "open_incidents": len(open_incidents),
                "reports_total": len(reports),
                "alerts_unread": len([alert for alert in alerts if not alert["read"]]),
                "cameras_online": len([camera for camera in cameras if camera["status"] == "online"]),
                "zones_total": len(zones),
                "avg_resolution_hours": avg_resolution_hours,
            },
            "analytics": {
                "incidents_over_time": [
                    {"label": "Mon", "count": 2},
                    {"label": "Tue", "count": 4},
                    {"label": "Wed", "count": 3},
                    {"label": "Thu", "count": 5},
                    {"label": "Fri", "count": 2},
                ],
                "severity_breakdown": [
                    {"name": "Low", "value": 4},
                    {"name": "Medium", "value": 3},
                    {"name": "High", "value": 2},
                    {"name": "Critical", "value": 1},
                ],
                "language_trends": [
                    {"name": "हिन्दी", "value": 7},
                    {"name": "தமிழ்", "value": 2},
                    {"name": "తెలుగు", "value": 1},
                ],
            },
            "offline_cameras": services()["camera"].offline_cameras(),
        }
    )
