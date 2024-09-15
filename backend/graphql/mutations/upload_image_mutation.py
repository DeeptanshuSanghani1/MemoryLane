from fastapi import HTTPException, UploadFile
import strawberry

from backend.graphql.types.upload_file_response import UploadFileResponse
from backend.providers.gcp_upload import upload_to_gcp


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def read_file(self, file: UploadFile) -> UploadFileResponse:
        if(file.content_type not in ['image/jpeg', 'image/jpg', 'image/png']):
            raise HTTPException(status_code=400, detail="Invalid file type")
        access_url = await upload_to_gcp(file)
        return UploadFileResponse(success= True, message="File Uploaded Successfully", url=access_url)