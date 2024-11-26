from fastapi import HTTPException, UploadFile
from google.cloud import storage
from google.oauth2 import service_account
from backend.constants import settings
from backend.providers.gcp_image_fetch import image_urls
from backend.global_constants import set_image_urls,image_urls,get_image_url
import os



async def upload_to_gcp(file: UploadFile):
    image_urls
    credentials = service_account.Credentials.from_service_account_info(settings.google_cloud_credentials)
    client = storage.Client(credentials=credentials)
    bucket_name = os.getenv("BUCKET_NAME")
    bucket = client.get_bucket(bucket_name)
    blob = bucket.blob(file.filename)
    try:
        blob.upload_from_file(file.file, content_type=file.content_type)

        access_url = f"https://storage.googleapis.com/{bucket.name}/{blob.name}"
        set_image_urls(access_url)
        return access_url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")


 
