from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jwt import encode, decode, PyJWTError

from constants import settings
from google.cloud import firestore


db = firestore.Client.from_service_account_info(settings.db_credentials)
users_collection = db.collection("users")


bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")

SECRET_KEY = settings.jwt_token
JWT_ALGORITHM = "HS256"

def hash_password(password: str):
    """Hashes the password with bcrypt."""
    return bcrypt_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    """Verifies the provided password against the stored hashed password."""
    return bcrypt_context.verify(plain_password, hashed_password)


def authenticate_user(username: str, password: str):
    """Authenticate user by username and password."""
    try:
        user_docs = users_collection.where("username", "==", username).get()
        if not user_docs:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
            )

        user = user_docs[0].to_dict()
        if not verify_password(password, user.get("password")):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
            )
        return user
    except Exception as e:
        print(f"Error querying Firestore: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )
    
def signup_user(username: str, password: str):
    try:
        existing_user = users_collection.where("username", "==", username).get()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists",
            )
        hashed_password = hash_password(password)

        users_collection.add({
            "username": username,
            "password": hashed_password,
        })

        return {"message": "User successfully registered"}
    except Exception as e:
        print(f"Error during signup: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


def create_access_token(username: str, expires_delta: timedelta):
    """Create a JWT access token."""
    expire = datetime.utcnow() + expires_delta
    exp = int((expire - datetime(1970, 1, 1)).total_seconds())
    to_encode = {"username": username, "exp": exp}
    encoded_jwt = encode(to_encode, SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def verify_token(token: str):
    """Verify the JWT token and extract user information."""
    try:
        payload = decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
        return {"username": username}
    except PyJWTError as e:
        print(f"Token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )


async def get_current_user(token: str = Depends(oauth2_bearer)):
    """Validate and return the current user based on the JWT token."""
    payload = verify_token(token)
    username = payload.get("username")
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    return {"username": username}
