import boto3
from fastapi import HTTPException
from backend.global_constants import set_image_urls,image_urls,get_image_url
from backend.providers.gcp_image_fetch import initial_fetch_image
from urllib.parse import unquote, urlparse

async def delete_image(file_key):
    s3_client = boto3.client('s3')
    bucket_name = "images-bucket-memory-lane"
    print("Attempting to delete file with key: ", file_key)
    file_key = unquote(file_key)
    try:
        if file_key.startswith("http"):
            parsed_url = urlparse(file_key)
            file_key = parsed_url.path.lstrip("/")
        response = s3_client.delete_object(Bucket=bucket_name, Key=file_key)
        print("Response: ", response)
        return True
    except s3_client.exceptions.NoSuchKey:
        print(f"File with key '{file_key}' not found in bucket.")
        raise HTTPException(status_code=404, detail=f"File with key '{file_key}' not found.")
    except Exception as e:
        print(f"Error deleting file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")