"""Email service for transactional notifications (Resend integration)."""

import os
from typing import Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "noreply@healthcore.app")
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:3000")


def send_reset_password_email(email: str, token: str, name: Optional[str] = None) -> bool:
    """
    Send a password reset email with one-time-use token link.
    
    Args:
        email: Recipient email address
        token: JWT reset token (URL-safe)
        name: Optional recipient name for greeting
        
    Returns:
        True if email sent successfully, False otherwise
    """
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not configured; skipping email send")
        return False
    
    reset_url = f"{FRONTEND_BASE_URL}/reset-password?token={token}"
    recipient_name = name or email.split("@")[0].title()
    
    html_body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Restablecer Contraseña</h2>
          <p>Hola {recipient_name},</p>
          <p>Recibiste esta solicitud porque intentaste restablecer tu contraseña en HealthCore.</p>
          <p style="margin-top: 20px;">
            <a href="{reset_url}" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
              Restablecer Contraseña
            </a>
          </p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            O copia este enlace en tu navegador:<br/>
            {reset_url}
          </p>
          <p style="color: #999; font-size: 11px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
            Este enlace expira en 1 hora. Si no solicitaste un cambio de contraseña, ignora este mensaje.
          </p>
        </div>
      </body>
    </html>
    """
    
    try:
        import httpx
        
        headers = {
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json",
        }
        
        payload = {
            "from": RESEND_FROM_EMAIL,
            "to": email,
            "subject": "Restablecer tu contraseña - HealthCore",
            "html": html_body,
        }
        
        with httpx.Client() as client:
            response = client.post(
                "https://api.resend.com/emails",
                json=payload,
                headers=headers,
                timeout=10.0,
            )
            
            if response.status_code in (200, 201):
                logger.info(f"Password reset email sent to {email}")
                return True
            else:
                logger.error(f"Resend API error: {response.status_code} - {response.text}")
                return False
                
    except Exception as e:
        logger.error(f"Failed to send reset password email: {str(e)}")
        return False


def send_welcome_email(email: str, name: Optional[str] = None) -> bool:
    """
    Send a welcome email to new users.
    
    Args:
        email: Recipient email address
        name: Optional recipient name
        
    Returns:
        True if email sent successfully, False otherwise
    """
    if not RESEND_API_KEY:
        logger.warning("RESEND_API_KEY not configured; skipping email send")
        return False
    
    recipient_name = name or email.split("@")[0].title()
    login_url = f"{FRONTEND_BASE_URL}/login"
    
    html_body = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Bienvenido a HealthCore</h2>
          <p>Hola {recipient_name},</p>
          <p>Tu cuenta ha sido creada exitosamente. Accede a la plataforma con tus credenciales.</p>
          <p style="margin-top: 20px;">
            <a href="{login_url}" style="display: inline-block; padding: 10px 20px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px;">
              Ir a Login
            </a>
          </p>
          <p style="color: #999; font-size: 11px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
            Si no creaste esta cuenta, contáctanos de inmediato.
          </p>
        </div>
      </body>
    </html>
    """
    
    try:
        import httpx
        
        headers = {
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json",
        }
        
        payload = {
            "from": RESEND_FROM_EMAIL,
            "to": email,
            "subject": "Bienvenido a HealthCore",
            "html": html_body,
        }
        
        with httpx.Client() as client:
            response = client.post(
                "https://api.resend.com/emails",
                json=payload,
                headers=headers,
                timeout=10.0,
            )
            
            if response.status_code in (200, 201):
                logger.info(f"Welcome email sent to {email}")
                return True
            else:
                logger.error(f"Resend API error: {response.status_code} - {response.text}")
                return False
                
    except Exception as e:
        logger.error(f"Failed to send welcome email: {str(e)}")
        return False
