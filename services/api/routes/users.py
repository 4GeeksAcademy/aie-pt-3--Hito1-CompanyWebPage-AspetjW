"""
FastAPI routes for user management (CRUD with role-based access).
"""

from datetime import datetime
from typing import Optional
from fastapi import APIRouter, HTTPException, status, Depends
from tinydb import Query

from database import get_db
from models.auth import (
    UserCreate,
    UserUpdate,
    UserResponse,
    ProfileCreate,
    UserRole,
)
from core.security import hash_password
from core.dependencies import get_current_user, get_current_admin

router = APIRouter(prefix="/users", tags=["users"])


@router.post("", response_model=UserResponse, status_code=201)
def create_user(
    user_data: UserCreate,
    current_user: UserResponse = Depends(get_current_admin),
) -> UserResponse:
    """
    Create a new user (admin only).
    Returns 201 on success, 403 if not admin, 422 if validation fails.
    """
    db = get_db()
    users_table = db.table("users")
    profiles_table = db.table("profiles")
    
    # Check if email already exists
    User = Query()
    existing = users_table.search(User.email == user_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Email already registered",
        )
    
    # Create user document
    user_doc = {
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "role": user_data.role.value,
        "is_active": True,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }
    
    user_id = users_table.insert(user_doc)
    
    # Create default empty profile
    profile_doc = {
        "user_id": user_id,
        "full_name": "",
        "phone": None,
        "address": None,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }
    profiles_table.insert(profile_doc)
    
    return UserResponse(id=user_id, **user_doc)


@router.get("", response_model=list[UserResponse])
def list_users(
    current_user: UserResponse = Depends(get_current_admin),
) -> list[UserResponse]:
    """
    List all users (admin only).
    """
    db = get_db()
    users_table = db.table("users")
    all_users = users_table.all()
    
    return [UserResponse(id=doc.doc_id, **doc) for doc in all_users]


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    current_user: UserResponse = Depends(get_current_user),
) -> UserResponse:
    """
    Get user by ID (admin can view any user, others can only view themselves).
    """
    db = get_db()
    users_table = db.table("users")
    
    # Role-based access control
    if current_user.role != UserRole.ADMIN and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot view other users",
        )
    
    user = users_table.get(doc_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    return UserResponse(id=user_id, **user)


@router.patch("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    update_data: UserUpdate,
    current_user: UserResponse = Depends(get_current_user),
) -> UserResponse:
    """
    Update user (admin can update any user, others can only update themselves).
    """
    db = get_db()
    users_table = db.table("users")
    
    # Role-based access control
    if current_user.role != UserRole.ADMIN and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot modify other users",
        )
    
    user = users_table.get(doc_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Build update dict
    update_dict = {}
    if update_data.email and update_data.email != user["email"]:
        # Check if new email is already taken
        User = Query()
        existing = users_table.search(User.email == update_data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Email already registered",
            )
        update_dict["email"] = update_data.email
    
    if update_data.role:
        # Only admins can change roles
        if current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can change user roles",
            )
        update_dict["role"] = update_data.role.value
    
    update_dict["updated_at"] = datetime.now().isoformat()
    
    users_table.update(update_dict, doc_ids=[user_id])
    updated = users_table.get(doc_id=user_id)
    
    return UserResponse(id=user_id, **updated)


@router.delete("/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    current_user: UserResponse = Depends(get_current_admin),
) -> None:
    """
    Delete user (admin only).
    """
    db = get_db()
    users_table = db.table("users")
    profiles_table = db.table("profiles")
    
    user = users_table.get(doc_id=user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Delete user and profile
    users_table.remove(doc_ids=[user_id])
    
    # Delete associated profile
    Profile = Query()
    profiles_table.remove(Profile.user_id == user_id)
