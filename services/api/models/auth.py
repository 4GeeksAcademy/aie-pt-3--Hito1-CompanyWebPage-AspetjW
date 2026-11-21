"""
Pydantic models for authentication and user management.
Decouples User (credentials) from Profile (personal data).
"""

from enum import Enum
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, validator, EmailStr


class UserRole(str, Enum):
    """User role enumeration."""
    ADMIN = "admin"
    MANAGER = "manager"
    USER = "user"


# ============================================================================
# USER MODELS
# ============================================================================

class UserCreate(BaseModel):
    """Schema for creating a new user."""
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    role: UserRole = UserRole.USER

    @validator("password")
    def validate_password(cls, v):
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """Schema for updating user fields."""
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None


class UserResponse(BaseModel):
    """Schema for user response (excludes password hash)."""
    id: int
    email: str
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "email": "user@example.com",
                "role": "user",
                "is_active": True,
                "created_at": "2024-11-21T10:00:00",
                "updated_at": "2024-11-21T10:00:00"
            }
        }


# ============================================================================
# PROFILE MODELS
# ============================================================================

class ProfileCreate(BaseModel):
    """Schema for creating a user profile."""
    full_name: str = Field(..., min_length=1, max_length=200)
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = Field(None, max_length=500)


class ProfileUpdate(BaseModel):
    """Schema for updating profile fields."""
    full_name: Optional[str] = Field(None, min_length=1, max_length=200)
    phone: Optional[str] = Field(None, max_length=20)
    address: Optional[str] = Field(None, max_length=500)


class ProfileResponse(BaseModel):
    """Schema for profile response."""
    id: int
    user_id: int
    full_name: str
    phone: Optional[str]
    address: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": 1,
                "full_name": "John Doe",
                "phone": "+1234567890",
                "address": "123 Main St, City, Country",
                "created_at": "2024-11-21T10:00:00",
                "updated_at": "2024-11-21T10:00:00"
            }
        }


# ============================================================================
# TOKEN MODELS
# ============================================================================

class TokenResponse(BaseModel):
    """Schema for token response."""
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in: int = Field(..., description="Expiration time in seconds")


class TokenPayload(BaseModel):
    """Schema for JWT token payload."""
    sub: int  # user_id
    email: str
    role: UserRole
    exp: int


# ============================================================================
# USER WITH PROFILE
# ============================================================================

class UserWithProfile(BaseModel):
    """Schema combining User and Profile for authentication response."""
    user: UserResponse
    profile: Optional[ProfileResponse] = None

    class Config:
        json_schema_extra = {
            "example": {
                "user": {
                    "id": 1,
                    "email": "user@example.com",
                    "role": "user",
                    "is_active": True,
                    "created_at": "2024-11-21T10:00:00",
                    "updated_at": "2024-11-21T10:00:00"
                },
                "profile": {
                    "id": 1,
                    "user_id": 1,
                    "full_name": "John Doe",
                    "phone": "+1234567890",
                    "address": "123 Main St, City, Country",
                    "created_at": "2024-11-21T10:00:00",
                    "updated_at": "2024-11-21T10:00:00"
                }
            }
        }
