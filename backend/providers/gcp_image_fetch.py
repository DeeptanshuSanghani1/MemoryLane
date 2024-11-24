import json
import logging
import os
from google.cloud import storage
from google.oauth2 import service_account
from backend.constants import settings
from backend.global_constants import set_image_urls,image_urls,get_image_url


def initial_fetch_image(refresh_cache = True):
    '''This function is used to initially fetch the image urls from GC bucket when then 
     application first starts. '''
    global image_urls
    #credential_info = json.loads(SECRET_JSON)
    logging.info(f"WEB_URL: {os.getenv('PRIVATE_KEY')}")
    credentials = service_account.Credentials.from_service_account_info(settings.google_cloud_credentials)
    client = storage.Client(credentials=credentials)
    bucket = client.get_bucket("images-bucket-memory-lane")
    blobs = bucket.list_blobs()
    fresh_image_urls = [
        f"https://storage.googleapis.com/{bucket.name}/{blob.name}" for blob in blobs
    ]
    if refresh_cache:
        image_urls = fresh_image_urls  # Update the global cache
    
    return fresh_image_urls
    # for blob in blobs:
    #     image_string = f"https://storage.googleapis.com/{bucket.name}/{blob.name}"
    #     set_image_urls(image_string)
    # return image_urls