from flask import Flask

from ..core.extensions import limiter
from ..core.store import InMemoryStore
from .alert_service import AlertService
from .camera_service import CameraService
from .d1_service import D1Service
from .media_service import MediaService
from .r2_service import R2Service
from .redis_service import RedisService
from .voice_report_service import VoiceReportService


def bootstrap_services(app: Flask) -> None:
    store = InMemoryStore()
    redis_service = RedisService(app.config)
    d1_service = D1Service(app.config)
    r2_service = R2Service(app.config)
    media_service = MediaService(app.config, store, r2_service)
    alert_service = AlertService(store, redis_service)
    camera_service = CameraService(app.config, store, alert_service)
    voice_report_service = VoiceReportService(store)

    app.extensions["store"] = store
    app.extensions["redis_service"] = redis_service
    app.extensions["d1_service"] = d1_service
    app.extensions["r2_service"] = r2_service
    app.extensions["media_service"] = media_service
    app.extensions["alert_service"] = alert_service
    app.extensions["camera_service"] = camera_service
    app.extensions["voice_report_service"] = voice_report_service
