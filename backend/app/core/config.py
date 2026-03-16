import os
from dataclasses import dataclass
from datetime import timedelta

from dotenv import load_dotenv


load_dotenv()


@dataclass
class Config:
    DEBUG: bool = os.getenv("FLASK_ENV", "development") == "development"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "development-secret")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "jwt-development-secret")
    JWT_TOKEN_LOCATION = ["headers", "cookies"]
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_ACCESS_COOKIE_NAME = "access_token_cookie"
    JWT_REFRESH_COOKIE_NAME = "refresh_token_cookie"
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    API_PREFIX: str = os.getenv("API_PREFIX", "/api/v1")
    RATE_LIMIT_DEFAULT: str = os.getenv("RATE_LIMIT_DEFAULT", "120 per hour")
    RATELIMIT_STORAGE_URI: str = os.getenv("REDIS_URL", "memory://") or "memory://"
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    UPSTASH_REDIS_REST_URL: str = os.getenv("UPSTASH_REDIS_REST_URL", "")
    UPSTASH_REDIS_REST_TOKEN: str = os.getenv("UPSTASH_REDIS_REST_TOKEN", "")
    D1_ACCOUNT_ID: str = os.getenv("D1_ACCOUNT_ID", "")
    D1_DATABASE_ID: str = os.getenv("D1_DATABASE_ID", "")
    D1_API_TOKEN: str = os.getenv("D1_API_TOKEN", "")
    R2_ACCOUNT_ID: str = os.getenv("R2_ACCOUNT_ID", "")
    R2_ACCESS_KEY_ID: str = os.getenv("R2_ACCESS_KEY_ID", "")
    R2_SECRET_ACCESS_KEY: str = os.getenv("R2_SECRET_ACCESS_KEY", "")
    R2_BUCKET: str = os.getenv("R2_BUCKET", "factory-safety")
    R2_ENDPOINT_URL: str = os.getenv("R2_ENDPOINT_URL", "")
    R2_PUBLIC_BASE_URL: str = os.getenv("R2_PUBLIC_BASE_URL", "")
    MAX_UPLOAD_MB: int = int(os.getenv("MAX_UPLOAD_MB", "50"))
    CAMERA_OFFLINE_SECONDS: int = int(os.getenv("CAMERA_OFFLINE_SECONDS", "30"))
    CELERY_BROKER_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CELERY_RESULT_BACKEND: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        minutes=int(os.getenv("ACCESS_TOKEN_EXPIRES_MINUTES", "60"))
    )
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(
        days=int(os.getenv("REFRESH_TOKEN_EXPIRES_DAYS", "30"))
    )
