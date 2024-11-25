import logging
import os
import boto3
from botocore.exceptions import NoCredentialsError
from backend.global_constants import set_image_urls, image_urls, get_image_url


def initial_fetch_image(username : str, refresh_cache=True):
    """
    This function is used to initially fetch the image URLs from an S3 bucket when the
    application first starts.
    """
    global image_urls
    bucket_name = "images-bucket-memory-lane"
    logging.info(f"AWS_BUCKET: {bucket_name}")
    s3_client = boto3.client('s3')

    try:
        response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=f"{username}/")

        if 'Contents' not in response:
            logging.warning(f"No objects found in bucket {bucket_name}.")
            return []

        fresh_image_urls = [
            f"https://{bucket_name}.s3.amazonaws.com/{item['Key']}"
            for item in response['Contents']
            if not item['Key'].endswith("/")
        ]

        if refresh_cache:
            image_urls = fresh_image_urls  # Update the global cache

        return fresh_image_urls

    except NoCredentialsError:
        logging.error("AWS credentials not found. Make sure AWS CLI is configured.")
        return []
    except Exception as e:
        logging.error(f"Error fetching images from S3: {e}")
        return []

# Example usage:
# image_urls = initial_fetch_image()
