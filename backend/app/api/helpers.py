from flask import current_app


def services():
    return {
        "store": current_app.extensions["store"],
        "redis": current_app.extensions["redis_service"],
        "media": current_app.extensions["media_service"],
        "alerts": current_app.extensions["alert_service"],
        "camera": current_app.extensions["camera_service"],
        "voice": current_app.extensions["voice_report_service"],
    }
