import json
import os
from pathlib import Path

from dotenv import load_dotenv

env_path = Path('../env')
load_dotenv(dotenv_path=env_path)
class Settings:
    credentials_file_path = os.path.join(os.path.dirname(__file__), 'credentials.json')
    
    try:
        with open(credentials_file_path, 'r') as f:
            google_cloud_credentials = json.load(f)
    except Exception as e:
        raise ValueError(f"Error loading credentials from {credentials_file_path}: {e}")

    
settings=Settings()