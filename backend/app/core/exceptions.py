from http import HTTPStatus

from flask import Flask
from werkzeug.exceptions import HTTPException

from .responses import api_response


class AppError(Exception):
    def __init__(self, message: str, status_code: int = HTTPStatus.BAD_REQUEST, details=None):
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(message)


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(AppError)
    def handle_app_error(error: AppError):
        return api_response(
            success=False,
            data={"details": error.details} if error.details else None,
            message=error.message,
            status=error.status_code,
        )

    @app.errorhandler(HTTPException)
    def handle_http_error(error: HTTPException):
        return api_response(
            success=False,
            message=error.description,
            status=error.code or HTTPStatus.INTERNAL_SERVER_ERROR,
        )

    @app.errorhandler(Exception)
    def handle_unknown_error(error: Exception):
        return api_response(
            success=False,
            data={"details": str(error)},
            message="An unexpected error occurred.",
            status=HTTPStatus.INTERNAL_SERVER_ERROR,
        )
