from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_socketio import SocketIO

from .config import Config


cors = CORS()
jwt = JWTManager()
config = Config()
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[config.RATE_LIMIT_DEFAULT],
    storage_uri=config.RATELIMIT_STORAGE_URI,
)
socketio = SocketIO()
