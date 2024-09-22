import json
import os
import logging
from dotenv import load_dotenv

class Settings:
    def __init__(self):
        # Load environment variables from .env file (for local development)
        load_dotenv()

        # Check if running in Docker (if service-account.json file exists)
        service_account_file = '/app/service-account.json'
        if os.path.exists(service_account_file):
            # Running inside Docker, load credentials from service-account.json
            logging.info("Using service account file for credentials.")
            with open(service_account_file, 'r') as f:
                self.google_cloud_credentials = json.load(f)
        else:
            # Running locally, load credentials from environment variables
            logging.info("Using environment variables for credentials.")
            self.google_cloud_credentials = {
                "type": os.getenv("type"),
                "project_id": os.getenv("project_id"),
                "private_key_id": os.getenv("private_key_id"),
                "private_key": os.getenv("private_key"),
                "client_email": os.getenv("client_email"),
                "client_id": os.getenv("client_id"),
                "auth_uri": os.getenv("auth_uri"),
                "token_uri": os.getenv("token_uri"),
                "auth_provider_x509_cert_url": os.getenv("auth_provider_x509_cert_url"),
                "client_x509_cert_url": os.getenv("client_x509_cert_url"),
                "universe_domain": os.getenv("universe_domain")
            }
        
        # Convert credentials to JSON string (used for Google authentication)
        self.google_cloud_credentials_json = json.dumps(self.google_cloud_credentials)

# Instantiate the settings object
settings = Settings()
