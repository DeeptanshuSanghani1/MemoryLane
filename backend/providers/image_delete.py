from fastapi import HTTPException
from google.cloud import storage
from urllib.parse import unquote, urlparse

async def delete_image(file_key):
    bucket_name = "images-bucket-memory-lane"
    print("Attempting to delete file with key: ", file_key)
    file_key = unquote(file_key)

    try:
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)

        if file_key.startswith("http"):
            parsed_url = urlparse(file_key)
            file_key = parsed_url.path.lstrip("/")

        blob = bucket.blob(file_key)

        if not blob.exists():
            print(f"File with key '{file_key}' not found in bucket.")
            raise HTTPException(status_code=404, detail=f"File with key '{file_key}' not found.")

        blob.delete()
        print(f"File with key '{file_key}' successfully deleted.")
        return True

    except Exception as e:
        print(f"Error deleting file: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
