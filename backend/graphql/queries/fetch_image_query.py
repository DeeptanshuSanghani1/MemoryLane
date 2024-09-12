import strawberry
from backend.providers.gcp_image_fetch import initial_fetch_image
@strawberry.type
class FetchImageQuery:
    @strawberry.field
    def all_images(self) -> list[str]:
        """Fetch all previously uploaded image URLs from the cache."""
        print("Executing")
        return initial_fetch_image()