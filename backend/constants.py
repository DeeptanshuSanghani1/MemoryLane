import json
import os
import logging
from google.cloud import secretmanager

class Settings:
    def __init__(self):
        self.secret_manager_client = secretmanager.SecretManagerServiceClient()
        self.service_account_credentials = self.get_secret("service-account")
        self.db_credentials = self.get_secret("db-credentials")
        self.service_account_credentials_json = json.dumps(self.service_account_credentials)
        self.db_credentials_json = json.dumps(self.db_credentials)

    def get_secret(self, secret_name):
        """Fetch the latest version of a secret from Secret Manager."""
        try:
            project_id = os.getenv("GCP_PROJECT_ID", "your-project-id")  # Replace with your project ID or load from env
            secret_path = f"projects/{project_id}/secrets/{secret_name}/versions/latest"
            response = self.secret_manager_client.access_secret_version(name=secret_path)
            secret_payload = response.payload.data.decode("UTF-8")
            return json.loads(secret_payload)
        except Exception as e:
            logging.error(f"Failed to fetch secret {secret_name}: {str(e)}")
            raise RuntimeError(f"Unable to fetch secret {secret_name}")
        
settings = Settings()
