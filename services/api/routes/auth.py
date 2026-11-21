"""
FastAPI routes for authentication (login, me).
"""

from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from tinydb import Query

from database import get_db
from models.auth import (
    UserLogin,
    UserResponse,
    TokenResponse,
    UserWithProfile,
)
from core.security import verify_password, create_access_token
from core.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse, status_code=200)
def login(credentials: UserLogin) -> TokenResponse:
    """
    User login endpoint.
    Returns access token + expires_in.
    Returns 401 if credentials are invalid.
    """
    db = get_db()
    users_table = db.table("users")
    
    # Find user by email
    User = Query()
    users = users_table.search(User.email == credentials.email)
    
    if not users:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    user = users[0]
    user_id = user.doc_id
    
    # Verify password
    if not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    # Check if user is active
    if not user.get("is_active", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not active",
        )
    
    # Create access token
    access_token, expires_in = create_access_token(
        user_id=user_id,
        email=user["email"],
        role=user["role"],
    )
    
    return TokenResponse(
        access_token=access_token,
        expires_in=expires_in,
    )


@router.get("/me", response_model=UserWithProfile, status_code=200)
def get_current_user_profile(
    current_user: UserResponse = Depends(get_current_user),
) -> UserWithProfile:
    """
    Get current authenticated user with their profile.
    Returns 401 if not authenticated.
    """
    db = get_db()
    profiles_table = db.table("profiles")
    
    # Find user's profile
    Profile = Query()
    profiles = profiles_table.search(Profile.user_id == current_user.id)
    
    profile_response = None
    if profiles:
        profile = profiles[0]
        profile_response = {
            "id": profile.doc_id,
            "user_id": profile["user_id"],
            "full_name": profile["full_name"],
            "phone": profile.get("phone"),
            "address": profile.get("address"),
            "created_at": profile["created_at"],
            "updated_at": profile["updated_at"],
        }
    
    return UserWithProfile(
        user=current_user,
        profile=profile_response,
    )
