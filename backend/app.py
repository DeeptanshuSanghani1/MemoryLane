from contextlib import asynccontextmanager
import json
from backend.constants import settings
from dotenv import load_dotenv
load_dotenv()
import os
from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import strawberry
from backend.graphql.queries.fetch_image_query import FetchImageQuery
from backend.providers import gcp_upload
from backend.routers import gcp_upload_router
from strawberry.fastapi import GraphQLRouter
from backend.graphql.schema import schema
import uvicorn

import logging


logging.basicConfig(level=logging.INFO)

def load_origins():
    origins_file = '/app/origins-url.json'
    try:
        with open(origins_file, 'r') as f:
            origins_data = json.load(f)
            # Access the 'web_url' key explicitly
            origins = [origins_data.get('web_url')]
            logging.info(f"origins: {origins}")
            return origins
    except FileNotFoundError:
        logging.error(f"{origins_file} not found.")
        return []
    except json.JSONDecodeError:
        logging.error(f"Error decoding JSON from {origins_file}.")
        return []

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info(f"TYPE: {os.getenv('TYPE')}")
    logging.info(f"PROJECT_ID: {os.getenv('PROJECT_ID')}")
    logging.info(f"CLIENT_EMAIL: {os.getenv('CLIENT_EMAIL')}")
    logging.info(f"WEB_URL: {os.getenv('WEB_URL')}")
    logging.info(f"WEB_URL: {os.getenv('PRIVATE_KEY')}")
    fetch_image = FetchImageQuery()
    fetch_image.all_images()
    yield

app = FastAPI(lifespan=lifespan)


app.title = "memory-lane"

graphql_app = GraphQLRouter(schema= schema)
app.include_router(graphql_app, prefix="/graphql")

origins = load_origins()
logging.info(f"origins2: {origins}")

# api = FastAPI(root_path="/api")
# api.title = "memory-lane api"
# app.mount("/api", api, name="api")


# Allow Front-end Origin in local development
origins.extend([
    "http://localhost:3000",
    "http://192.168.2.72:3000"
])


logging.info(f"origins3: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthcheck")
async def healthcheck():
    return {"status": "Backend is running"}


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)



