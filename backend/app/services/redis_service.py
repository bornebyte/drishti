import time

import redis


class _MemoryRedis:
    def __init__(self):
        self.values = {}

    def set(self, key, value, ex=None):
        expires_at = time.time() + ex if ex else None
        self.values[key] = (value, expires_at)

    def get(self, key):
        item = self.values.get(key)
        if not item:
            return None
        value, expires_at = item
        if expires_at and time.time() > expires_at:
            self.values.pop(key, None)
            return None
        return value

    def delete(self, key):
        self.values.pop(key, None)

    def ping(self):
        return True


class RedisService:
    def __init__(self, config):
        self.client = _MemoryRedis()
        try:
            if config["REDIS_URL"]:
                self.client = redis.from_url(config["REDIS_URL"], decode_responses=True)
                self.client.ping()
        except Exception:
            self.client = _MemoryRedis()

    def set(self, key, value, ex=None):
        return self.client.set(key, value, ex=ex)

    def get(self, key):
        return self.client.get(key)

    def delete(self, key):
        return self.client.delete(key)
