from fastapi import HTTPException, UploadFile
import strawberry

from backend.graphql.types.upload_file_response import SignUpResponse, UploadFileResponse
from backend.providers.gcp_upload import upload_to_gcp
from backend.graphql.types.upload_file_response import AuthUser, LoginResponse, User
from backend.providers.auth_provider import signup_user, authenticate_user
from backend.providers.image_delete import delete_image


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def read_file(self, file: UploadFile, username:str) -> UploadFileResponse:
        if(file.content_type not in ['image/jpeg', 'image/jpg', 'image/png']):
            raise HTTPException(status_code=400, detail="Invalid file type")
        access_url = await upload_to_gcp(file, username)
        return UploadFileResponse(success= True, message="File Uploaded Successfully", url=access_url)
    

    @strawberry.mutation
    async def delete_photo(self, file_key: str, username:str) -> UploadFileResponse:
        try:
            delete_success = await delete_image(file_key, username)

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

    @strawberry.mutation
    def signup(self, input: AuthUser) -> SignUpResponse:
        return signup_user(input.username, input.password)

    @strawberry.mutation
    def login(self, input: AuthUser) -> LoginResponse:
        login_result = authenticate_user(input.username, input.password)
        print("Login result: ", login_result)
        return LoginResponse(
        user=User(username=login_result["username"]),
        access_token=login_result["access_token"],
        token_type=login_result["token_type"],
    )
    