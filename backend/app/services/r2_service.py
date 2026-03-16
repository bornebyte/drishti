from datetime import datetime, timedelta

import boto3


class R2Service:
    def __init__(self, config):
        self.bucket = config["R2_BUCKET"]
        self.public_base_url = config["R2_PUBLIC_BASE_URL"]
        self.is_configured = all(
            [
                config["R2_ACCESS_KEY_ID"],
                config["R2_SECRET_ACCESS_KEY"],
                config["R2_ENDPOINT_URL"],
            ]
        )
        self.client = None
        if self.is_configured:
            self.client = boto3.client(
                "s3",
                endpoint_url=config["R2_ENDPOINT_URL"],
                aws_access_key_id=config["R2_ACCESS_KEY_ID"],
                aws_secret_access_key=config["R2_SECRET_ACCESS_KEY"],
                region_name="auto",
            )

    def presign_upload(self, key: str, content_type: str, expires_in=900):
        if not self.client:
            return {
                "upload_url": f"/stub-r2-upload/{key}",
                "expires_at": (datetime.utcnow() + timedelta(seconds=expires_in)).isoformat() + "Z",
            }
        url = self.client.generate_presigned_url(
            "put_object",
            Params={"Bucket": self.bucket, "Key": key, "ContentType": content_type},
            ExpiresIn=expires_in,
        )
        return {
            "upload_url": url,
            "expires_at": (datetime.utcnow() + timedelta(seconds=expires_in)).isoformat() + "Z",
        }

    def presign_download(self, key: str, expires_in=3600):
        if not self.client:
            return f"/stub-r2-download/{key}"
        return self.client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": key},
            ExpiresIn=expires_in,
        )
