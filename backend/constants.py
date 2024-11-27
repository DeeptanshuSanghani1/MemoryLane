
# class Settings:
#     def __init__(self):
#         self.secret_manager_client = secretmanager.SecretManagerServiceClient()
#         self.service_account_credentials = self.get_secret("service-account")
#         self.db_credentials = self.get_secret("db-credentials")
#         self.service_account_credentials_json = json.dumps(self.service_account_credentials)
#         self.db_credentials_json = json.dumps(self.db_credentials)
#         self.jwt_token = self.get_secret
#         self.configure_google_cloud(self.service_account_credentials)

#     def get_secret(self, secret_name):
#         """Fetch the latest version of a secret from Secret Manager."""
#         try:
#             project_id = os.getenv("GCP_PROJECT_ID", "keystart-project")  # Replace with your project ID or load from env
#             secret_path = f"projects/{project_id}/secrets/{secret_name}/versions/latest"
#             response = self.secret_manager_client.access_secret_version(name=secret_path)
#             secret_payload = response.payload.data.decode("UTF-8")
#             return json.loads(secret_payload)
#         except Exception as e:
#             logging.error(f"Failed to fetch secret {secret_name}: {str(e)}")
#             raise RuntimeError(f"Unable to fetch secret {secret_name}")
    
#     def get_jwt_secret(self, secret_name):
#         """Fetch a secret from Secret Manager and return as plaintext."""
#         try:
#             project_id = os.getenv("GCP_PROJECT_ID", "keystart-project")  # Replace with your project ID
#             secret_path = f"projects/{project_id}/secrets/{secret_name}/versions/latest"
#             response = self.secret_manager_client.access_secret_version(name=secret_path)
#             return response.payload.data.decode("UTF-8")
#         except Exception as e:
#             logging.error(f"Failed to fetch secret {secret_name}: {str(e)}")
#             raise RuntimeError(f"Unable to fetch secret {secret_name}")
    

#     def configure_google_cloud(self, service_account_credentials):
#         """Configure Google Cloud authentication."""
#         try:
#             # Write the service account credentials to a temporary file
#             temp_cred_path = "/tmp/google_cloud_credentials.json"
#             with open(temp_cred_path, "w") as temp_file:
#                 json.dump(service_account_credentials, temp_file)
            
#             # Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
#             os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = temp_cred_path
#             logging.info("Google Cloud credentials configured successfully.")
#         except Exception as e:
#             logging.error(f"Failed to configure Google Cloud credentials: {str(e)}")
#             raise RuntimeError("Error configuring Google Cloud credentials.")
        
# settings = Settings()
