
from fastapi import APIRouter, Form, HTTPException, Query, UploadFile, status
from backend.graphql.types.upload_file_response import UploadFileResponse
from backend.providers.gcp_image_fetch import initial_fetch_image
from backend.providers.gcp_upload import upload_to_gcp
from backend.providers.image_delete import delete_image

router = APIRouter()

@router.post("/upload_photo", status_code=status.HTTP_201_CREATED)
async def upload_photo(file: UploadFile, username : str = Query(...)) -> UploadFileResponse:
        if not username:
            raise HTTPException(status_code=400, detail="Username is required.")
        if(file.content_type not in ['image/jpeg', 'image/jpg', 'image/png']):
            raise HTTPException(status_code=400, detail="Invalid file type")
        access_url = await upload_to_gcp(file, username= username)
        return UploadFileResponse(success= True, message="File Uploaded Successfully", url=access_url)

@router.get("/get_photos", status_code=status.HTTP_200_OK)
async def fetch_photo(username : str = Query(...)) -> list[str]:
      return initial_fetch_image(username = username, refresh_cache= False)

@router.delete("/delete_photo", status_code=status.HTTP_200_OK)
async def delete_photo(file_key: str = Query(...)) -> UploadFileResponse:
    try:
        delete_success = await delete_image(file_key)

        if delete_success:
            return UploadFileResponse(
                success = True,
                message= f"File with key '{file_key} deleted successfully",
                url = None
            )
        else:
            raise HTTPException(status_code=404, detail=f"File with key '{file_key}' not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete file: {str(e)}")
