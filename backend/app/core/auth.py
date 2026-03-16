from functools import wraps
from http import HTTPStatus

from flask import current_app, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
    verify_jwt_in_request,
)

from .exceptions import AppError


def issue_auth_tokens(user: dict, redis_service):
    additional_claims = {"role": user["role"], "name": user["name"]}
    access_token = create_access_token(identity=user["id"], additional_claims=additional_claims)
    refresh_token = create_refresh_token(identity=user["id"], additional_claims=additional_claims)
    ttl = int(current_app.config["JWT_REFRESH_TOKEN_EXPIRES"].total_seconds())
    redis_service.set(f"refresh:{user['id']}", refresh_token, ex=ttl)
    return access_token, refresh_token


def attach_auth_cookies(response, access_token: str, refresh_token: str):
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    return response


def clear_auth_cookies(response):
    unset_jwt_cookies(response)
    return response


def current_user_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request(optional=False)
        request.current_user_id = get_jwt_identity()
        request.current_claims = get_jwt()
        return fn(*args, **kwargs)

    return wrapper


def ensure_refresh_token_is_valid(redis_service):
    verify_jwt_in_request(refresh=True)
    identity = get_jwt_identity()
    token = request.cookies.get("refresh_token_cookie")
    cached = redis_service.get(f"refresh:{identity}")
    if not cached or cached != token:
        raise AppError("Refresh session has expired. Please log in again.", HTTPStatus.UNAUTHORIZED)
    return identity, get_jwt()
