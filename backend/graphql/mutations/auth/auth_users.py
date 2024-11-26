# import strawberry

# from backend.graphql.types.upload_file_response import AuthUser, LoginResponse, User
# from backend.providers.auth_provider import signup_user, authenticate_user, verify_token


# @strawberry.type
# class Mutation:
#     @strawberry.mutation
#     def signup(self, input: AuthUser) -> dict:
#         return signup_user(input.username, input.password)

#     @strawberry.mutation
#     def login(self, input: AuthUser) -> LoginResponse:
#         login_result = authenticate_user(input.username, input.password)
#         return LoginResponse(login_result)

#     @strawberry.mutation
#     def verify(self, access_token: str) -> User:
#         user_info = verify_token(access_token)
#         return User(username=user_info["username"])
    
