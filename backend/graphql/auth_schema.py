import strawberry
from backend.graphql.mutations.auth.auth_users import Mutation

auth_schema = strawberry.Schema(mutation=Mutation)