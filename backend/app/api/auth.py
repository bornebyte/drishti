from http import HTTPStatus

from flask import Blueprint, make_response, request
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from ..core.auth import (
    attach_auth_cookies,
    clear_auth_cookies,
    current_user_required,
    ensure_refresh_token_is_valid,
    issue_auth_tokens,
)
from ..core.extensions import limiter
from ..core.responses import api_response
from .helpers import services


auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/auth/login")
@limiter.limit("10 per minute")
def login():
    payload = request.get_json(force=True, silent=True) or {}
    email = payload.get("email", "").strip().lower()
    password = payload.get("password", "")
    store = services()["store"]
    user = next(
        (
            admin
            for admin in store.list("admins")
            if admin["email"].lower() == email and admin["password"] == password
        ),
        None,
    )
    if not user:
        return api_response(success=False, message="Invalid credentials.", status=HTTPStatus.UNAUTHORIZED)

    access_token, refresh_token = issue_auth_tokens(user, services()["redis"])
    response = make_response(
        api_response(
            data={
                "user": {
                    "id": user["id"],
                    "name": user["name"],
                    "email": user["email"],
                    "role": user["role"],
                },
                "access_token": access_token,
            },
            message="Login successful.",
        )[0]
    )
    response.status_code = HTTPStatus.OK
    attach_auth_cookies(response, access_token, refresh_token)
    return response


@auth_bp.post("/auth/refresh")
@limiter.limit("20 per hour")
def refresh():
    store = services()["store"]
    identity, claims = ensure_refresh_token_is_valid(services()["redis"])
    user = store.get("admins", identity)
    access_token, refresh_token = issue_auth_tokens(user, services()["redis"])
    response = make_response(
        api_response(
            data={
                "user": {
                    "id": user["id"],
                    "name": user["name"],
                    "email": user["email"],
                    "role": claims["role"],
                },
                "access_token": access_token,
            },
            message="Token refreshed.",
        )[0]
    )
    response.status_code = HTTPStatus.OK
    attach_auth_cookies(response, access_token, refresh_token)
    return response


@auth_bp.post("/auth/logout")
def logout():
    verify_jwt_in_request(optional=True)
    identity = get_jwt_identity()
    if identity:
        services()["redis"].delete(f"refresh:{identity}")
    response = make_response(api_response(message="Logged out.")[0])
    clear_auth_cookies(response)
    return response


@auth_bp.get("/auth/me")
@current_user_required
def me():
    user = services()["store"].get("admins", request.current_user_id)
    return api_response(
        data={
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
        }
    )
