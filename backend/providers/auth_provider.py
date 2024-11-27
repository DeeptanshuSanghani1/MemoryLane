import json
import os
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jwt import encode, decode, PyJWTError

from backend.graphql.types.upload_file_response import SignUpResponse, User
from google.cloud import firestore


db = firestore.Client.from_service_account_info(json.loads(os.getenv("DB_CREDENTIALS")))
collection_name = os.getenv('COLLECTION_NAME')
users_collection = db.collection(collection_name)


bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")

SECRET_KEY = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"

def hash_password(password: str):
    """Hashes the password with bcrypt."""
    return bcrypt_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    print(f"password: {plain_password}, hashedPassowrd: {hashed_password}")
    """Verifies the provided password against the stored hashed password."""
    print(bcrypt_context.verify(plain_password, hashed_password))
    return bcrypt_context.verify(plain_password, hashed_password)


def authenticate_user(username: str, password: str):
    """Authenticate user by username and password."""
    try:
        print(f"Fetching user with username: {username}")
        user_docs = users_collection.where("username", "==", username).get()
        print(f"Query result: {user_docs}")
        if not user_docs:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
            )

        user = user_docs[0].to_dict()
        print(f"Retrieved user: {user}")

        if not verify_password(password, user.get("password")):
            print(f"Password mismatch for username: {username}")
            raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            )

        access_token = create_access_token(username=username, expires_delta=timedelta(hours=1))
        print("access: ", access_token)
        return {
            "username": user.get("username"),
            "access_token": access_token,
            "token_type": "Bearer",
        }
    except Exception as e:
        print(f"Error querying Firestore: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )
    
def signup_user(username: str, password: str) ->SignUpResponse:
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

        return SignUpResponse(success=True, message="User Registered successfully")
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



