import base64
import io
import secrets
from datetime import datetime, timezone
from http import HTTPStatus

import qrcode

from ..core.exceptions import AppError


class CameraService:
    def __init__(self, config, store, alert_service):
        self.store = store
        self.offline_seconds = config["CAMERA_OFFLINE_SECONDS"]
        self.alert_service = alert_service

    def generate_registration(self, zone_id: str, created_by: str):
        if not self.store.get("zones", zone_id):
            raise AppError("Zone not found.", HTTPStatus.NOT_FOUND)
        token = secrets.token_urlsafe(24)
        registration = self.store.create(
            "camera_registrations",
            {
                "zone_id": zone_id,
                "token": token,
                "created_by": created_by,
                "expires_in_seconds": 600,
                "used": False,
            },
        )
        payload = f"drishti://camera-register?token={token}"
        image = qrcode.make(payload)
        buffer = io.BytesIO()
        image.save(buffer, format="PNG")
        qr_data_url = "data:image/png;base64," + base64.b64encode(buffer.getvalue()).decode("utf-8")
        return {**registration, "qr_code": qr_data_url, "connect_url": payload}

    def register_phone_camera(self, token: str, name: str, worker_id=None):
        registrations = self.store.list(
            "camera_registrations",
            filters={"token": token},
        )
        registration = registrations[0] if registrations else None
        if not registration or registration.get("used"):
            raise AppError("Invalid or expired registration token.", HTTPStatus.BAD_REQUEST)
        self.store.update("camera_registrations", registration["id"], {"used": True})
        return self.store.create(
            "cameras",
            {
                "name": name,
                "kind": "phone",
                "zone_id": registration["zone_id"],
                "stream_url": None,
                "status": "online",
                "last_heartbeat_at": datetime.now(timezone.utc).isoformat(),
                "assigned_worker_id": worker_id,
            },
        )

    def heartbeat(self, camera_id: str):
        camera = self.store.update(
            "cameras",
            camera_id,
            {
                "status": "online",
                "last_heartbeat_at": datetime.now(timezone.utc).isoformat(),
            },
        )
        if not camera:
            raise AppError("Camera not found.", HTTPStatus.NOT_FOUND)
        return camera

    def offline_cameras(self):
        return self.store.detect_offline_cameras(self.offline_seconds)
