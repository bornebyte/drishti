from functools import wraps
from http import HTTPStatus

from flask_jwt_extended import get_jwt, verify_jwt_in_request

from .exceptions import AppError


ROLE_PERMISSIONS = {
    "super_admin": {"*"},
    "admin": {
        "dashboard.read",
        "zone.read",
        "zone.manage",
        "camera.read",
        "camera.manage",
        "employee.read",
        "employee.manage",
        "incident.manage",
        "report.read",
        "alert.read",
        "alert.manage",
        "media.read",
        "audit.read",
    },
    "manager": {
        "dashboard.read",
        "incident.manage",
        "report.read",
        "alert.read",
        "employee.read",
        "camera.read",
        "zone.read",
        "media.read",
    },
    "safety_officer": {
        "dashboard.read",
        "incident.manage",
        "report.manage",
        "alert.manage",
        "employee.read",
        "camera.read",
        "zone.read",
        "media.read",
    },
}


def permission_required(permission: str):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request(optional=False)
            claims = get_jwt()
            role = claims.get("role", "")
            permissions = ROLE_PERMISSIONS.get(role, set())
            if "*" not in permissions and permission not in permissions:
                raise AppError(
                    "You do not have permission to perform this action.",
                    HTTPStatus.FORBIDDEN,
                )
            return fn(*args, **kwargs)

        return wrapper

    return decorator
