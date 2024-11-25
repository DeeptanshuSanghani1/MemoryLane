import boto3
from botocore.exceptions import ClientError
from passlib.context import CryptContext
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from fastapi import Depends
from datetime import timedelta, datetime, timezone
from jwt import encode, decode, PyJWTError

# Constants and Setup
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/token")

# DynamoDB setup
DYNAMODB_TABLE_NAME = "InformationUser"
dynamodb = boto3.resource("dynamodb")
users_table = dynamodb.Table(DYNAMODB_TABLE_NAME)
SECRET_KEY = "8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmpgXwovR9fp6ryDIoGRM8EPHAB6iHsc0fb"
JWT_ALGORITHM = "HS256"

def authenticate_user(username: str, password: str):
    try:
        # Fetch user by username to find the corresponding "id"
        response = users_table.scan(
            FilterExpression="username = :username",
            ExpressionAttributeValues={":username": username}
        )
        items = response.get("Items")
        if not items or len(items) == 0:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
            )

        user = items[0]  # Assuming username is unique, there should be one result

        # Verify the password using bcrypt
        if not verify_password(password, user.get("password")):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
            )
        return user
    except ClientError as e:
        print(f"Error querying DynamoDB: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error",
        )


def hash_password(password: str):
    """Hashes the password with bcrypt."""
    return bcrypt_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    """Verifies the provided password against the stored hashed password."""
    return bcrypt_context.verify(plain_password, hashed_password)


# No token verification needed as we are not using JWT

async def get_current_user(username: Annotated[str, Depends(oauth2_bearer)]):
    """You can customize this function to check the logged-in user from the session or request."""
    # For simplicity, just return username or user info if logged in via the session
    return {"username": username}  # You would normally check session or another state


def create_access_token(
     username: str, expires_delta: timedelta
):
    expire = datetime.utcnow() + expires_delta
    exp = int((expire - datetime(1970, 1, 1)).total_seconds())
    to_encode = {"username": username, "exp": exp}
    encoded_jwt = encode(to_encode, SECRET_KEY, JWT_ALGORITHM)
    return encoded_jwt


def verify_token(token: str):
    try:
        print(type(token))
        # token_bytes = token.encode('utf-8')

        payload = decode(token, SECRET_KEY, JWT_ALGORITHM)
        username: str = payload.get("username")
        print(username)
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
            )
        return {"username": username}
    except PyJWTError as e:
        print(f"Couldnt work: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )