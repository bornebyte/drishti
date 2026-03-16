from copy import deepcopy
from datetime import datetime, timedelta, timezone
from uuid import uuid4


def utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


class InMemoryStore:
    def __init__(self):
        self.tables = {
            "admins": {},
            "zones": {},
            "cameras": {},
            "employees": {},
            "incidents": {},
            "reports": {},
            "alerts": {},
            "media": {},
            "audit_logs": {},
            "notification_preferences": {},
            "camera_registrations": {},
        }
        self.seed()

    def seed(self):
        admin = {
            "id": "admin_1",
            "email": "admin@drishti.local",
            "password": "password123",
            "name": "Priya Sharma",
            "role": "super_admin",
            "created_at": utcnow(),
            "deleted_at": None,
        }
        self.tables["admins"][admin["id"]] = admin

        zone_1 = {
            "id": "zone_1",
            "name": "Assembly Line A",
            "code": "ALA",
            "description": "Primary assembly floor",
            "reference_image_media_id": None,
            "factory_name": "Jaipur Unit",
            "status": "active",
            "created_at": utcnow(),
            "updated_at": utcnow(),
            "deleted_at": None,
        }
        zone_2 = {
            "id": "zone_2",
            "name": "Chemical Storage",
            "code": "CHEM",
            "description": "Restricted hazardous material room",
            "reference_image_media_id": None,
            "factory_name": "Jaipur Unit",
            "status": "active",
            "created_at": utcnow(),
            "updated_at": utcnow(),
            "deleted_at": None,
        }
        self.tables["zones"][zone_1["id"]] = zone_1
        self.tables["zones"][zone_2["id"]] = zone_2

        camera = {
            "id": "camera_1",
            "name": "Line A North CCTV",
            "kind": "rtsp",
            "zone_id": "zone_1",
            "stream_url": "rtsp://example.com/live/1",
            "status": "online",
            "last_heartbeat_at": utcnow(),
            "assigned_worker_id": None,
            "created_at": utcnow(),
            "updated_at": utcnow(),
            "deleted_at": None,
        }
        self.tables["cameras"][camera["id"]] = camera

        employee = {
            "id": "employee_1",
            "employee_code": "EMP-001",
            "name": "Ravi Kumar",
            "department": "Assembly",
            "designation": "Machine Operator",
            "assigned_zone_id": "zone_1",
            "profile_photo_media_id": None,
            "phone": "+919876543210",
            "emergency_contact": "+919812341234",
            "preferred_language": "हिन्दी",
            "join_date": "2024-07-01",
            "active": True,
            "created_at": utcnow(),
            "updated_at": utcnow(),
            "deleted_at": None,
        }
        self.tables["employees"][employee["id"]] = employee

        incident = {
            "id": "incident_1",
            "type": "ppe_violation",
            "severity": "high",
            "status": "open",
            "zone_id": "zone_1",
            "camera_id": "camera_1",
            "employee_id": "employee_1",
            "snapshot_media_id": None,
            "source": "ai_detection",
            "title": "Missing helmet detected",
            "description": "Worker appears without helmet near conveyor belt.",
            "ai_description": "AI analysis pending — will be available after Phase 2 integration.",
            "resolution_notes": "",
            "created_at": utcnow(),
            "updated_at": utcnow(),
            "deleted_at": None,
        }
        self.tables["incidents"][incident["id"]] = incident

        report = {
            "id": "report_1",
            "employee_id": "employee_1",
            "zone_id": "zone_2",
            "language": "हिन्दी",
            "audio_media_id": None,
            "transcript": "Processing...",
            "translation": "Processing...",
            "structured_report": "Processing...",
            "status": "processing",
            "celery_job_id": "stub-job-report-1",
            "created_at": utcnow(),
            "updated_at": utcnow(),
            "deleted_at": None,
        }
        self.tables["reports"][report["id"]] = report

        alert = {
            "id": "alert_1",
            "incident_id": "incident_1",
            "title": "Critical safety alert",
            "message": "Missing helmet detected in Assembly Line A.",
            "severity": "high",
            "read": False,
            "created_at": utcnow(),
            "deleted_at": None,
        }
        self.tables["alerts"][alert["id"]] = alert

        self.tables["notification_preferences"]["admin_1"] = {
            "id": "pref_1",
            "admin_id": "admin_1",
            "email_enabled": True,
            "sms_enabled": False,
            "push_enabled": True,
            "minimum_severity": "medium",
            "updated_at": utcnow(),
        }

    def list(self, table: str, *, filters=None, search=None, search_fields=None):
        records = [
            deepcopy(record)
            for record in self.tables[table].values()
            if record.get("deleted_at") is None
        ]
        filters = filters or {}
        for key, value in filters.items():
            if value in (None, "", []):
                continue
            records = [record for record in records if record.get(key) == value]
        if search and search_fields:
            needle = search.lower()
            records = [
                record
                for record in records
                if any(needle in str(record.get(field, "")).lower() for field in search_fields)
            ]
        records.sort(key=lambda item: item.get("created_at", ""), reverse=True)
        return records

    def paginate(self, records, page: int, per_page: int):
        total = len(records)
        start = (page - 1) * per_page
        end = start + per_page
        return records[start:end], {
            "page": page,
            "per_page": per_page,
            "total": total,
            "total_pages": max((total + per_page - 1) // per_page, 1),
        }

    def get(self, table: str, record_id: str):
        record = self.tables[table].get(record_id)
        if not record or record.get("deleted_at") is not None:
            return None
        return deepcopy(record)

    def create(self, table: str, payload: dict):
        record_id = payload.get("id") or f"{table[:-1]}_{uuid4().hex[:8]}"
        now = utcnow()
        record = {
            "id": record_id,
            **payload,
            "created_at": payload.get("created_at", now),
            "updated_at": payload.get("updated_at", now),
            "deleted_at": None,
        }
        self.tables[table][record_id] = record
        return deepcopy(record)

    def update(self, table: str, record_id: str, payload: dict):
        record = self.tables[table].get(record_id)
        if not record or record.get("deleted_at") is not None:
            return None
        record.update(payload)
        record["updated_at"] = utcnow()
        return deepcopy(record)

    def soft_delete(self, table: str, record_id: str):
        record = self.tables[table].get(record_id)
        if not record or record.get("deleted_at") is not None:
            return None
        record["deleted_at"] = utcnow()
        record["updated_at"] = utcnow()
        return deepcopy(record)

    def add_audit_log(self, actor_id: str, action: str, entity: str, entity_id: str, changes=None):
        return self.create(
            "audit_logs",
            {
                "actor_id": actor_id,
                "action": action,
                "entity": entity,
                "entity_id": entity_id,
                "changes": changes or {},
            },
        )

    def detect_offline_cameras(self, offline_after_seconds: int):
        threshold = datetime.now(timezone.utc) - timedelta(seconds=offline_after_seconds)
        offline = []
        for camera in self.tables["cameras"].values():
            heartbeat = camera.get("last_heartbeat_at")
            if not heartbeat or camera.get("deleted_at") is not None:
                continue
            last_seen = datetime.fromisoformat(heartbeat)
            if last_seen < threshold:
                offline.append(deepcopy(camera))
        return offline
