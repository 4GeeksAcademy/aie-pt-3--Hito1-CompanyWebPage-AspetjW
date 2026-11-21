"""FastAPI dependencies for authentication and authorization."""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional
import logging

from services.api.core.security import verify_token
from services.api.database import get_db
from services.api.models.auth import UserResponse

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserResponse:
    """
    Dependency to validate JWT and return current authenticated user.
    
    Raises:
        HTTPException 401 if token invalid or expired
        HTTPException 404 if user not found in database
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = verify_token(token)
    if not payload:
        raise credentials_exception
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    db = get_db()
    users_table = db.table("users")
    
    users = users_table.search(lambda x: x.get("id") == user_id)
    if not users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    user = users[0]
    return UserResponse(
        id=user["id"],
        email=user["email"],
        role=user.get("role", "user"),
        is_active=user.get("is_active", True),
    )


async def get_current_admin(
    current_user: UserResponse = Depends(get_current_user),
) -> UserResponse:
    """
    Dependency for admin-only routes.
    
    Raises:
        HTTPException 403 if user is not admin
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requieren permisos de administrador"
        )
    return current_user


async def get_current_manager_or_admin(
    current_user: UserResponse = Depends(get_current_user),
) -> UserResponse:
    """
    Dependency for manager+ routes.
    
    Raises:
        HTTPException 403 if user is not manager or admin
    """
    if current_user.role not in ("admin", "manager"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requieren permisos de gestor o administrador"
        )
    return current_user


async def get_current_active_user(
    current_user: UserResponse = Depends(get_current_user),
) -> UserResponse:
    """
    Dependency to verify user is active.
    
    Raises:
        HTTPException 403 if user is inactive
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo"
        )
    return current_user
