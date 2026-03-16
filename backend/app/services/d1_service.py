from http import HTTPStatus

import requests

from ..core.exceptions import AppError


class D1Service:
    def __init__(self, config):
        self.account_id = config["D1_ACCOUNT_ID"]
        self.database_id = config["D1_DATABASE_ID"]
        self.api_token = config["D1_API_TOKEN"]
        self.base_url = (
            f"https://api.cloudflare.com/client/v4/accounts/{self.account_id}/d1/database/{self.database_id}"
            if self.account_id and self.database_id
            else ""
        )

    @property
    def is_configured(self) -> bool:
        return bool(self.base_url and self.api_token)

    def execute(self, sql: str, params=None):
        if not self.is_configured:
            return {"stub": True, "message": "D1 is not configured. Falling back to in-memory store."}

        response = requests.post(
            f"{self.base_url}/query",
            headers={
                "Authorization": f"Bearer {self.api_token}",
                "Content-Type": "application/json",
            },
            json={"sql": sql, "params": params or []},
            timeout=15,
        )
        if not response.ok:
            raise AppError(
                "Failed to execute D1 query.",
                HTTPStatus.BAD_GATEWAY,
                details=response.text,
            )
        payload = response.json()
        if not payload.get("success", False):
            raise AppError("D1 query returned an error.", HTTPStatus.BAD_GATEWAY, payload)
        return payload
