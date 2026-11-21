"""
FastAPI routes for user profile management.
"""

from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends
from tinydb import Query

from database import get_db
from models.auth import (
    ProfileCreate,
    ProfileUpdate,
    ProfileResponse,
    UserResponse,
    UserRole,
)
from core.dependencies import get_current_user

router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.post("/{user_id}", response_model=ProfileResponse, status_code=201)
def create_profile(
    user_id: int,
    profile_data: ProfileCreate,
    current_user: UserResponse = Depends(get_current_user),
) -> ProfileResponse:
    """
    Create a profile for a user (admin or owner only).
    """
    db = get_db()
    profiles_table = db.table("profiles")
    
    # Access control
    if current_user.role != UserRole.ADMIN and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot create profile for other users",
        )
    
    # Check if profile already exists
    Profile = Query()
    existing = profiles_table.search(Profile.user_id == user_id)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Profile already exists for this user",
        )
    
    profile_doc = {
        "user_id": user_id,
        "full_name": profile_data.full_name,
        "phone": profile_data.phone,
        "address": profile_data.address,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }
    
    profile_id = profiles_table.insert(profile_doc)
    return ProfileResponse(id=profile_id, **profile_doc)


@router.get("/{user_id}", response_model=ProfileResponse)
def get_profile(
    user_id: int,
    current_user: UserResponse = Depends(get_current_user),
) -> ProfileResponse:
    """
    Get user profile (admin or owner only).
    """
    db = get_db()
    profiles_table = db.table("profiles")
    
    # Access control
    if current_user.role != UserRole.ADMIN and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot view other users' profiles",
        )
    
    Profile = Query()
    profiles = profiles_table.search(Profile.user_id == user_id)
    
    if not profiles:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )
    
    profile = profiles[0]
    return ProfileResponse(id=profile.doc_id, **profile)


@router.patch("/{user_id}", response_model=ProfileResponse)
def update_profile(
    user_id: int,
    update_data: ProfileUpdate,
    current_user: UserResponse = Depends(get_current_user),
) -> ProfileResponse:
    """
    Update user profile (admin or owner only).
    """
    db = get_db()
    profiles_table = db.table("profiles")
    
    # Access control
    if current_user.role != UserRole.ADMIN and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot modify other users' profiles",
        )
    
    Profile = Query()
    profiles = profiles_table.search(Profile.user_id == user_id)
    
    if not profiles:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )
    
    profile = profiles[0]
    profile_id = profile.doc_id
    
    # Build update dict (only non-None fields)
    update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
    update_dict["updated_at"] = datetime.now().isoformat()
    
    profiles_table.update(update_dict, doc_ids=[profile_id])
    updated = profiles_table.get(doc_id=profile_id)
    
    return ProfileResponse(id=profile_id, **updated)


@router.delete("/{user_id}", status_code=204)
def delete_profile(
    user_id: int,
    current_user: UserResponse = Depends(get_current_user),
) -> None:
    """
    Delete user profile (admin only).
    """
    db = get_db()
    profiles_table = db.table("profiles")
    
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete profiles",
        )
    
    Profile = Query()
    profiles = profiles_table.search(Profile.user_id == user_id)
    
    if not profiles:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )
    
    profile = profiles[0]
    profiles_table.remove(doc_ids=[profile.doc_id])
