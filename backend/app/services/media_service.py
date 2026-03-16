from http import HTTPStatus
from uuid import uuid4

from ..core.exceptions import AppError


class MediaService:
    ALLOWED_TYPES = {
        "image/jpeg": "image",
        "image/png": "image",
        "video/mp4": "video",
        "audio/mpeg": "audio",
        "audio/mp4": "audio",
        "audio/webm": "audio",
        "audio/wav": "audio",
    }

    def __init__(self, config, store, r2_service):
        self.max_upload_bytes = config["MAX_UPLOAD_MB"] * 1024 * 1024
        self.store = store
        self.r2_service = r2_service

    def create_upload(self, *, filename: str, content_type: str, size_bytes: int, zone_id=None, camera_id=None):
        if content_type not in self.ALLOWED_TYPES:
            raise AppError("Unsupported file type.", HTTPStatus.BAD_REQUEST)
        if size_bytes > self.max_upload_bytes:
            raise AppError("File exceeds upload size limit.", HTTPStatus.BAD_REQUEST)

        media_id = f"media_{uuid4().hex[:10]}"
        key = f"{self.ALLOWED_TYPES[content_type]}/{media_id}/{filename}"
        presigned = self.r2_service.presign_upload(key, content_type)
        media = self.store.create(
            "media",
            {
                "id": media_id,
                "filename": filename,
                "content_type": content_type,
                "size_bytes": size_bytes,
                "media_type": self.ALLOWED_TYPES[content_type],
                "zone_id": zone_id,
                "camera_id": camera_id,
                "storage_key": key,
                "tags": [],
                "uploaded": False,
            },
        )
        return {**media, **presigned}

    def mark_uploaded(self, media_id: str):
        media = self.store.update("media", media_id, {"uploaded": True})
        if not media:
            raise AppError("Media record not found.", HTTPStatus.NOT_FOUND)
        media["url"] = self.r2_service.presign_download(media["storage_key"])
        return media

    def list_media(self, *, page: int, per_page: int, filters=None, search=None):
        records = self.store.list(
            "media",
            filters=filters,
            search=search,
            search_fields=["filename", "media_type"],
        )
        page_items, pagination = self.store.paginate(records, page, per_page)
        for item in page_items:
            item["url"] = self.r2_service.presign_download(item["storage_key"])
        return page_items, pagination
