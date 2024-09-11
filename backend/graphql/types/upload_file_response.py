from typing import Optional
import strawberry


@strawberry.type
class UploadFileResponse:
    success: bool
    message: str
    url: Optional[str]