from flask import Flask

from .alerts import alerts_bp
from .audit import audit_bp
from .auth import auth_bp
from .cameras import cameras_bp
from .dashboard import dashboard_bp
from .employees import employees_bp
from .health import health_bp
from .incidents import incidents_bp
from .media import media_bp
from .reports import reports_bp
from .zones import zones_bp


def register_blueprints(app: Flask) -> None:
    for blueprint in (
        health_bp,
        auth_bp,
        dashboard_bp,
        zones_bp,
        cameras_bp,
        employees_bp,
        incidents_bp,
        reports_bp,
        alerts_bp,
        media_bp,
        audit_bp,
    ):
        app.register_blueprint(blueprint, url_prefix=app.config["API_PREFIX"])
