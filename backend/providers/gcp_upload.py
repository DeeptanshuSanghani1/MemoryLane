import json
import logging
from fastapi import HTTPException, UploadFile
from google.cloud import storage
from google.oauth2 import service_account
from backend.providers.gcp_image_fetch import image_urls
from backend.global_constants import set_image_urls,image_urls,get_image_url
import os
from google.auth.exceptions import RefreshError


async def upload_to_gcp(file: UploadFile, username: str):
    image_urls
    try:
        service_account_json = os.getenv("TERRAFORM_ACCOUNT_JSON")
        if not service_account_json:
            raise ValueError("SERVICE_ACCOUNT_JSON environment variable is not set.")
        credentials_info = json.loads(service_account_json)
        credentials = service_account.Credentials.from_service_account_info(credentials_info)
    
        client = storage.Client(credentials=credentials)
        bucket_name = os.getenv("BUCKET_NAME")
        bucket = client.get_bucket(bucket_name)
        blob = bucket.blob(f"{username}/{file.filename}")
    except json.JSONDecodeError as e:
        logging.error(f"Failed to parse SERVICE_ACCOUNT_JSON: {e}")
        return []

    except RefreshError as e:
        logging.error(f"Failed to refresh Google Cloud credentials: {e}")
        return []

    except ValueError as e:
        logging.error(f"Configuration error: {e}")
        return []

    except storage.exceptions.GoogleCloudError as e:
        logging.error(f"Google Cloud Storage error: {e}")
        return []

    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")
        return []

    try:
        blob.upload_from_file(file.file, content_type=file.content_type)

        access_url = f"https://storage.googleapis.com/{bucket.name}/{blob.name}"
        set_image_urls(access_url)
        return access_url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")


 