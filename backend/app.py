from typing import Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import strawberry
from backend.providers import gcp_upload
from backend.routers import gcp_upload_router
from strawberry.fastapi import GraphQLRouter
from backend.graphql.schema import schema

app = FastAPI()

app.title = "memory-lane"

graphql_app = GraphQLRouter(schema= schema)
app.include_router(graphql_app, prefix="/graphql")


# api = FastAPI(root_path="/api")
# api.title = "memory-lane api"
# app.mount("/api", api, name="api")



# Allow Front-end Origin in local development
origins = ["http://localhost:3000",
           "http://192.168.2.72:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @api.get("/healthcheck")
# async def healthcheck():
#     """
#     Endpoint to verify that the service is up Zand running
#     """
#     return {"status": "backen is running"}



