"""Security utilities: password hashing and JWT token generation/validation."""

import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from passlib.hash import bcrypt
from jose import JWTError, jwt
import logging

logger = logging.getLogger(__name__)

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7
RESET_TOKEN_EXPIRE_MINUTES = 60


def hash_password(password: str) -> str:
    """Hash password using bcrypt."""
    return bcrypt.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against bcrypt hash."""
    try:
        return bcrypt.verify(plain_password, hashed_password)
    except Exception as e:
        logger.error(f"Password verification error: {str(e)}")
        return False


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create JWT access token.
    
    Args:
        data: Payload dict (typically {"sub": user_id})
        expires_delta: Optional expiration delta
        
    Returns:
        Encoded JWT string
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: Dict[str, Any]) -> str:
    """Create JWT refresh token (longer expiration)."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_reset_token(user_id: str) -> str:
    """
    Create one-time password reset token.
    
    Args:
        user_id: User ID to encode in token
        
    Returns:
        Encoded JWT string with short expiration
    """
    to_encode = {"sub": user_id, "type": "reset"}
    expire = datetime.utcnow() + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify JWT access token.
    
    Args:
        token: JWT token string
        
    Returns:
        Payload dict if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        logger.error(f"Token verification failed: {str(e)}")
        return None


def verify_reset_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify password reset token.
    
    Args:
        token: JWT reset token string
        
    Returns:
        Payload dict if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Verify token type is reset
        if payload.get("type") != "reset":
            logger.warning("Token is not a reset token")
            return None
            
        return payload
    except JWTError as e:
        logger.error(f"Reset token verification failed: {str(e)}")
        return None
