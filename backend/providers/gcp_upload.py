from fastapi import HTTPException, UploadFile
from google.cloud import storage
from google.oauth2 import service_account
from backend.constants import settings


async def upload_to_gcp(file: UploadFile):
    credentials = service_account.Credentials.from_service_account_info(settings.google_cloud_credentials)
    client = storage.Client(credentials=credentials)
    bucket = client.get_bucket("images-bucket-memory-lane")
    blob = bucket.blob(file.filename)
    try:
        blob.upload_from_file(file.file, content_type=file.content_type)
        access_url = f"https://storage.googleapis.com/{bucket.name}/{blob.name}"
        return access_url
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")


 
