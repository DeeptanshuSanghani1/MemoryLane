from fastapi import HTTPException, UploadFile
from google.cloud import storage
from google.oauth2 import service_account
from backend.constants import settings
from backend.providers.gcp_image_fetch import image_urls
from backend.global_constants import set_image_urls,image_urls,get_image_url


async def upload_to_gcp(file: UploadFile):
    global image_urls
    credentials = service_account.Credentials.from_service_account_info(settings.google_cloud_credentials)
    client = storage.Client(credentials=credentials)
    bucket = client.get_bucket("images-bucket-memory-lane")
    blob = bucket.blob(file.filename)
    try:
        blob.upload_from_file(file.file, content_type=file.content_type)
        print("Before Upload: ", image_urls)
        access_url = f"https://storage.googleapis.com/{bucket.name}/{blob.name}"
        set_image_urls(access_url)
        print("From upload file: ", image_urls)
        return get_image_url()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")


 
