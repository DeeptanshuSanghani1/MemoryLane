from fastapi import APIRouter, File, HTTPException
from backend.providers import gcp_upload
from starlette.responses import JSONResponse
from fastapi import status
from starlette.responses import JSONResponse
from typing import List, Annotated
from fastapi import status
from strawberry.file_uploads import Upload

# async def getFiles(file: Upload = File(...)):
#     try:
#         await gcp_upload.upload_image(file)
#         return JSONResponse(content= {"message" : "File Uploaded Successfully"}, status_code=status.HTTP_200_OK)
#     except Exception as e:
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
        