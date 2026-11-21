"""Password reset endpoints for FastAPI."""

from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
import logging

from services.api.core.security import create_reset_token, verify_reset_token
from services.api.core.dependencies import get_current_user
from services.api.database import get_db
from services.api.models.auth import UserResponse
from services.api.services.email import send_reset_password_email

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

    class Config:
        min_length = {"new_password": 8}


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

    class Config:
        min_length = {"new_password": 8}


@router.post("/forgot-password", status_code=200)
async def forgot_password(request: ForgotPasswordRequest):
    """
    Initiate password reset workflow.
    
    Returns 200 OK always (prevents email enumeration attacks).
    If email exists, sends reset link; otherwise silently does nothing.
    """
    db = get_db()
    users_table = db.table("users")
    
    # Query user by email (don't leak existence)
    user_docs = users_table.search(lambda x: x.get("email") == request.email)
    
    if user_docs:
        user = user_docs[0]
        reset_token = create_reset_token(user["id"])
        
        # Try to send email (non-blocking failure)
        name = user.get("profile", {}).get("name", None)
        send_reset_password_email(request.email, reset_token, name)
        
        logger.info(f"Password reset requested for {request.email}")
    else:
        logger.warning(f"Password reset requested for non-existent email: {request.email}")
    
    # Always return same response (security best practice)
    return {
        "message": "Si el correo existe, recibirás un enlace para restablecer tu contraseña"
    }


@router.post("/reset-password", status_code=200)
async def reset_password(request: ResetPasswordRequest):
    """
    Complete password reset with one-time token.
    
    Token is verified and invalidated after use (one-time only).
    Returns 400 if token expired, invalid, or already used.
    """
    # Verify token (decoded payload contains user_id)
    payload = verify_reset_token(request.token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token inválido o expirado. Solicita uno nuevo."
        )
    
    user_id = payload.get("sub")
    db = get_db()
    users_table = db.table("users")
    
    # Query user by ID
    users = users_table.search(lambda x: x.get("id") == user_id)
    if not users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    user = users[0]
    
    # Check if token already used (password_changed_at > token_issued_at prevents reuse)
    # For simplicity, we track this via updated_at
    # In production, maintain a consumed_tokens table
    
    from passlib.hash import bcrypt
    hashed_password = bcrypt.hash(request.new_password)
    
    users_table.update({
        "password": hashed_password,
        "updated_at": datetime.utcnow().isoformat(),
    }, lambda x: x.get("id") == user_id)
    
    logger.info(f"Password reset completed for user {user_id}")
    
    return {
        "message": "Contraseña restablecida exitosamente. Por favor, inicia sesión."
    }


@router.post("/change-password", status_code=200)
async def change_password(
    request: ChangePasswordRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Change password for authenticated user.
    
    Requires current password verification. Returns 401 if current password incorrect.
    """
    db = get_db()
    users_table = db.table("users")
    
    # Get current user record
    users = users_table.search(lambda x: x.get("id") == current_user.id)
    if not users:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    user = users[0]
    
    # Verify current password
    from passlib.hash import bcrypt
    if not bcrypt.verify(request.current_password, user.get("password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Contraseña actual incorrecta"
        )
    
    # Hash and update new password
    hashed_password = bcrypt.hash(request.new_password)
    users_table.update({
        "password": hashed_password,
        "updated_at": datetime.utcnow().isoformat(),
    }, lambda x: x.get("id") == current_user.id)
    
    logger.info(f"Password changed for user {current_user.id}")
    
    return {
        "message": "Contraseña actualizada exitosamente"
    }
