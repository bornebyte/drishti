from celery import Celery

from ..core.config import Config


config = Config()
celery_app = Celery(
    "drishti",
    broker=config.CELERY_BROKER_URL,
    backend=config.CELERY_RESULT_BACKEND,
)
celery_app.conf.update(task_serializer="json", result_serializer="json", accept_content=["json"])
