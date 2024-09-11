from google.cloud import storage
from google.oauth2 import service_account
from backend.constants import settings
image_urls = None

def initial_fetch_image():
    global image_urls
    credentials = service_account.Credentials.from_service_account_info(settings.google_cloud_credentials)
    client = storage.Client(credentials=credentials)
    bucket = client.get_bucket("images-bucket-memory-lane")
    blobs = bucket.list_blobs()
    image_urls = (blob.public_url() for blob in blobs)
    return image_urls