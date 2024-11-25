import boto3
from botocore.exceptions import ClientError
from passlib.context import CryptContext
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from backend.providers.auth import authenticate_user, create_access_token, hash_password, verify_token

# Setup for DynamoDB
DYNAMODB_TABLE_NAME = "InformationUser"
dynamodb = boto3.resource("dynamodb")
users_table = dynamodb.Table(DYNAMODB_TABLE_NAME)

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()

# Pydantic Models
class CreateUserRequest(BaseModel):
    username: str
    password: str

class User(BaseModel):
    username: str

class LoginResponse(BaseModel):
    user: User
    access_token: str
    token_type: str

# Routes

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(form_data: CreateUserRequest) -> dict:
    # Check if user already exists in DynamoDB
    try:
        response = users_table.scan(
            FilterExpression="username = :username",
            ExpressionAttributeValues={":username": form_data.username}
        )
        if response.get("Items"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered",
            )
    except ClientError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error checking user existence: {e.response['Error']['Message']}",
        )

    # Create user model to insert into DynamoDB
    try:
        create_user_model = {
            "username": form_data.username,
            "password": hash_password(form_data.password),  # Storing hashed password
        }
        
        # Insert user into DynamoDB
        users_table.put_item(Item=create_user_model)
    except ClientError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {e.response['Error']['Message']}",
        )

    return {"message": "User successfully created"}


@router.post("/login", response_model=LoginResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> LoginResponse:
    # Authenticating user by username and password
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    
    # Fetching role from DynamoDB
    token = create_access_token(
        user["username"], timedelta(hours=24)
    )
    user_response = User(username=user["username"])

    return {
        "user": user_response,
        "access_token": token,
        "token_type": "bearer",
    }


@router.get("/logout")
def logout() -> dict:
    """ Placeholder for logout, you can extend this with session management if needed """
    return {"status": "Logged out successfully"}


@router.post("/verify", response_model=dict)
def verify(token_data: LoginResponse) -> dict:
    token_data = token_data.access_token
    user_info = verify_token(token_data)
    if user_info == "":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    return user_info
