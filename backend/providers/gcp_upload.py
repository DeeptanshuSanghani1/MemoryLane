from fastapi import HTTPException, UploadFile
from google.cloud import storage
from google.oauth2 import service_account
from backend.constants import settings
from backend.providers.gcp_image_fetch import image_urls
from backend.global_constants import set_image_urls,image_urls,get_image_url

import boto3

async def upload_to_gcp(file: UploadFile, username:str):
    image_urls
    print("File d: ", file)
    bucket_name = "images-bucket-memory-lane"
    s3_client = boto3.client('s3')
    file_key = f"{username}/{file.filename}"
    try:
        file.file.seek(0)
        s3_client.upload_fileobj(
            Fileobj=file.file,
            Bucket=bucket_name,
            Key=file_key,
            ExtraArgs={'ContentType': file.content_type}
        )
        access_url = f"https://{bucket_name}.s3.amazonaws.com/{file_key}"
        set_image_urls(access_url)
        return access_url
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


    # credentials = service_account.Credentials.from_service_account_info(settings.google_cloud_credentials)
    # client = storage.Client(credentials=credentials)
    # bucket = client.get_bucket("images-bucket-memory-lane")
    # blob = bucket.blob(file.filename)
    # try:
    #     blob.upload_from_file(file.file, content_type=file.content_type)

    #     access_url = f"https://storage.googleapis.com/{bucket.name}/{blob.name}"
    #     set_image_urls(access_url)
    #     return access_url
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=f"Failed to upload file: {str(e)}")


 
