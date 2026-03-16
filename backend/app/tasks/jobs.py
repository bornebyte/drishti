import logging

from .celery_app import celery_app


logger = logging.getLogger(__name__)


@celery_app.task(name="process_frame_job")
def process_frame_job(payload: dict):
    logger.info("Phase 1 stub frame processing task received: %s", payload)
    return {"stub": True, "message": "Frame processing queued for Phase 2 AI integration."}


@celery_app.task(name="process_audio_job")
def process_audio_job(payload: dict):
    logger.info("Phase 1 stub audio processing task received: %s", payload)
    return {"stub": True, "message": "Audio processing queued for Phase 2 AI integration."}
