import os
import json
import logging
from google.cloud import storage
from google.oauth2 import service_account
from google.auth.exceptions import RefreshError
from backend.global_constants import image_urls

def initial_fetch_image(username: str, refresh_cache: bool = True):
    global image_urls

    try:
        # Load service account credentials
        service_account_json = os.getenv("TERRAFORM_ACCOUNT_JSON")
        if not service_account_json:
            raise ValueError("SERVICE_ACCOUNT_JSON environment variable is not set.")

        logging.info("Loading service account credentials...")
        credentials_info = json.loads(service_account_json)

        credentials = service_account.Credentials.from_service_account_info(credentials_info)

        # Initialize GCS client
        logging.info("Initializing Google Cloud Storage client...")
        client = storage.Client(credentials=credentials)

        # Get bucket name
        bucket_name = os.getenv("BUCKET_NAME")
        if not bucket_name:
            raise ValueError("BUCKET_NAME environment variable is not set.")

        logging.info(f"Accessing bucket: {bucket_name}")
        bucket = client.get_bucket(bucket_name)

        # List blobs with the given prefix
        logging.info(f"Fetching blobs with prefix: {username}/")
        blobs = bucket.list_blobs(prefix=f"{username}/")

        # Generate URLs for the images
        fresh_image_urls = [
            f"https://storage.googleapis.com/{bucket.name}/{blob.name}" for blob in blobs
            if not blob.name.endswith("/")
        ]

        if refresh_cache:
            logging.info("Updating global image_urls cache...")
            image_urls = fresh_image_urls

        return fresh_image_urls

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
