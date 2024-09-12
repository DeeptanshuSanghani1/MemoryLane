from google.cloud import storage
from google.oauth2 import service_account
from backend.constants import settings
from backend.global_constants import set_image_urls,image_urls,get_image_url

print("Execeuiting")

def initial_fetch_image():
    '''This function is used to initially fetch the image urls from GC bucket when then 
     application first starts. '''
    print("Executing initial fetch image")
    global image_urls
    credentials = service_account.Credentials.from_service_account_info(settings.google_cloud_credentials)
    client = storage.Client(credentials=credentials)
    bucket = client.get_bucket("images-bucket-memory-lane")
    blobs = bucket.list_blobs()
    for blob in blobs:
        image_string = f"https://storage.googleapis.com/{bucket.name}/{blob.name}"
        set_image_urls(image_string)
        print("After each set: ",get_image_url())
    return image_urls