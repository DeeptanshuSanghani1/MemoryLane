from typing import List, Optional
import strawberry


@strawberry.type
class UploadFileResponse:
    success: bool
    message: str
    url: Optional[str]

@strawberry.type
class User:
    username : str

@strawberry.type
class LoginResponse:
    user: User
    access_token : str
    token_type : str

@strawberry.input
class AuthUser:
    username: str
    password: str

