from .. import socketio


class AlertService:
    def __init__(self, store, redis_service):
        self.store = store
        self.redis_service = redis_service

    def create_alert(self, incident: dict, title: str, message: str):
        alert = self.store.create(
            "alerts",
            {
                "incident_id": incident["id"],
                "title": title,
                "message": message,
                "severity": incident["severity"],
                "read": False,
            },
        )
        if incident["severity"] in {"high", "critical"}:
            socketio.emit("alert:new", alert)
        return alert
