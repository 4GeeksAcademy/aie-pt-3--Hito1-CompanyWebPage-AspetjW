"""
Security utilities: bcrypt hashing and JWT token management.
"""

import os
from datetime import datetime, timedelta
from typing import Optional
from passlib.context import CryptContext
from jose import JWTError, jwt
from pydantic import EmailStr

from models.auth import UserRole

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: int, email: str, role: UserRole) -> tuple[str, int]:
    """
    Create JWT access token.
    Returns: (token_string, expires_in_seconds)
    """
    expires_in = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.utcnow() + expires_in
    
    payload = {
        "sub": user_id,
        "email": email,
        "role": role.value,
        "exp": expire,
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token, int(expires_in.total_seconds())


def create_refresh_token(user_id: int, email: str) -> str:
    """Create JWT refresh token."""
    expires_in = timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    expire = datetime.utcnow() + expires_in
    
    payload = {
        "sub": user_id,
        "email": email,
        "type": "refresh",
        "exp": expire,
    }
    
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token


def verify_token(token: str) -> Optional[dict]:
    """
    Verify JWT token and return payload.
    Returns None if token is invalid or expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def decode_token_payload(token: str) -> Optional[dict]:
    """
    Decode token without verifying expiration (for password reset, etc.).
    Use with caution!
    """
    try:
        # Decode without verification of expiration
        payload = jwt.decode(
            token, 
            SECRET_KEY, 
            algorithms=[ALGORITHM],
            options={"verify_exp": False}
        )
        return payload
    except JWTError:
        return None
