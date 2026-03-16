from flask import Flask

from .api import register_blueprints
from .core.config import Config
from .core.exceptions import register_error_handlers
from .core.extensions import cors, jwt, limiter, socketio
from .services.bootstrap import bootstrap_services


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config())

    cors.init_app(
        app,
        resources={r"/*": {"origins": app.config["FRONTEND_URL"]}},
        supports_credentials=True,
    )
    jwt.init_app(app)
    limiter.init_app(app)
    socketio.init_app(
        app,
        cors_allowed_origins=app.config["FRONTEND_URL"],
        async_mode="eventlet",
    )

    bootstrap_services(app)
    register_blueprints(app)
    register_error_handlers(app)
    return app


__all__ = ["create_app", "socketio"]
