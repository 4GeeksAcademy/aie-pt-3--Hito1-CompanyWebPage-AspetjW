"""Tests for authentication endpoints."""

import pytest
from datetime import datetime, timedelta


class TestLogin:
    """Happy Path, Edge Case, Failure Mode for /auth/login"""
    
    def test_login_happy_path(self, client, sample_user):
        """Valid credentials return access token"""
        response = client.post("/api/auth/login", json={
            "email": "user@example.com",
            "password": "password123",
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
    
    def test_login_empty_email(self, client):
        """Empty email field → 422 validation error"""
        response = client.post("/api/auth/login", json={
            "email": "",
            "password": "password123",
        })
        
        assert response.status_code == 422
    
    def test_login_missing_password(self, client):
        """Missing password field → 422 validation error"""
        response = client.post("/api/auth/login", json={
            "email": "user@example.com",
        })
        
        assert response.status_code == 422
    
    def test_login_invalid_email_format(self, client):
        """Invalid email format → 422 validation error"""
        response = client.post("/api/auth/login", json={
            "email": "not-an-email",
            "password": "password123",
        })
        
        assert response.status_code == 422
    
    def test_login_wrong_password(self, client, sample_user):
        """Incorrect password → 401 unauthorized"""
        response = client.post("/api/auth/login", json={
            "email": "user@example.com",
            "password": "wrongpassword",
        })
        
        assert response.status_code == 401
        assert "credenciales" in response.json()["detail"].lower()
    
    def test_login_nonexistent_user(self, client):
        """Non-existent email → 401 unauthorized"""
        response = client.post("/api/auth/login", json={
            "email": "nonexistent@example.com",
            "password": "password123",
        })
        
        assert response.status_code == 401
    
    def test_login_inactive_user(self, client, temp_db):
        """Inactive user → 401 unauthorized"""
        from services.api.core.security import hash_password
        
        users = temp_db.table("users")
        users.insert({
            "id": "inactive-user",
            "email": "inactive@example.com",
            "password": hash_password("password123"),
            "role": "user",
            "is_active": False,
        })
        
        response = client.post("/api/auth/login", json={
            "email": "inactive@example.com",
            "password": "password123",
        })
        
        assert response.status_code == 401


class TestMe:
    """Happy Path, Edge Case, Failure Mode for GET /auth/me"""
    
    def test_me_happy_path(self, client, valid_token):
        """Valid token returns user info"""
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "user@example.com"
        assert data["role"] == "user"
    
    def test_me_missing_token(self, client):
        """Missing Authorization header → 403"""
        response = client.get("/api/auth/me")
        
        assert response.status_code == 403
    
    def test_me_invalid_token(self, client):
        """Invalid token → 401"""
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer invalid.token.here"}
        )
        
        assert response.status_code == 401
    
    def test_me_expired_token(self, client, temp_db, monkeypatch):
        """Expired token → 401"""
        from services.api.core.security import create_access_token
        from datetime import timedelta
        
        # Create token that expires immediately
        expired_token = create_access_token(
            {"sub": "user-123"},
            expires_delta=timedelta(seconds=-1)  # Already expired
        )
        
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {expired_token}"}
        )
        
        assert response.status_code == 401
    
    def test_me_malformed_header(self, client):
        """Malformed Authorization header → 403"""
        response = client.get(
            "/api/auth/me",
            headers={"Authorization": "InvalidFormat"}
        )
        
        assert response.status_code == 403


class TestForgotPassword:
    """Happy Path, Edge Case, Failure Mode for /auth/forgot-password"""
    
    def test_forgot_password_existing_email(self, client, sample_user):
        """Existing email → 200 OK (email sent)"""
        response = client.post("/api/auth/forgot-password", json={
            "email": "user@example.com",
        })
        
        assert response.status_code == 200
        assert "Si el correo existe" in response.json()["message"]
    
    def test_forgot_password_nonexistent_email(self, client):
        """Non-existent email → 200 OK (security: no enumeration)"""
        response = client.post("/api/auth/forgot-password", json={
            "email": "nonexistent@example.com",
        })
        
        # Same response as existing email (security best practice)
        assert response.status_code == 200
        assert "Si el correo existe" in response.json()["message"]
    
    def test_forgot_password_invalid_email(self, client):
        """Invalid email format → 422 validation error"""
        response = client.post("/api/auth/forgot-password", json={
            "email": "not-an-email",
        })
        
        assert response.status_code == 422
    
    def test_forgot_password_empty_email(self, client):
        """Empty email → 422 validation error"""
        response = client.post("/api/auth/forgot-password", json={
            "email": "",
        })
        
        assert response.status_code == 422


class TestResetPassword:
    """Happy Path, Edge Case, Failure Mode for /auth/reset-password"""
    
    def test_reset_password_invalid_token(self, client):
        """Invalid token → 400 bad request"""
        response = client.post("/api/auth/reset-password", json={
            "token": "invalid.token.here",
            "new_password": "newpassword123",
        })
        
        assert response.status_code == 400
        assert "inválido" in response.json()["detail"].lower()
    
    def test_reset_password_expired_token(self, client, temp_db):
        """Expired token → 400 bad request"""
        from services.api.core.security import create_reset_token
        from datetime import timedelta
        from jose import jwt
        import os
        
        # Create expired reset token
        secret = os.getenv("SECRET_KEY", "test-secret-key-12345")
        expired_token = jwt.encode(
            {"sub": "user-123", "type": "reset", "exp": 0},
            secret,
            algorithm="HS256"
        )
        
        response = client.post("/api/auth/reset-password", json={
            "token": expired_token,
            "new_password": "newpassword123",
        })
        
        assert response.status_code == 400
    
    def test_reset_password_short_password(self, client, temp_db):
        """Password < 8 chars → 422 validation error"""
        from services.api.core.security import create_reset_token
        
        # Create valid reset token
        reset_token = create_reset_token("user-123")
        
        response = client.post("/api/auth/reset-password", json={
            "token": reset_token,
            "new_password": "short",
        })
        
        assert response.status_code == 422


class TestChangePassword:
    """Happy Path, Edge Case, Failure Mode for /auth/change-password"""
    
    def test_change_password_happy_path(self, client, valid_token, sample_user):
        """Valid current password → 200 OK"""
        response = client.post(
            "/api/auth/change-password",
            json={
                "current_password": "password123",
                "new_password": "newpassword123",
            },
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        
        assert response.status_code == 200
        assert "actualizada" in response.json()["message"].lower()
    
    def test_change_password_wrong_current(self, client, valid_token, sample_user):
        """Wrong current password → 401 unauthorized"""
        response = client.post(
            "/api/auth/change-password",
            json={
                "current_password": "wrongpassword",
                "new_password": "newpassword123",
            },
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        
        assert response.status_code == 401
        assert "incorrecta" in response.json()["detail"].lower()
    
    def test_change_password_short_new_password(self, client, valid_token, sample_user):
        """New password < 8 chars → 422 validation error"""
        response = client.post(
            "/api/auth/change-password",
            json={
                "current_password": "password123",
                "new_password": "short",
            },
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        
        assert response.status_code == 422
    
    def test_change_password_missing_token(self, client):
        """Missing token → 403"""
        response = client.post(
            "/api/auth/change-password",
            json={
                "current_password": "password123",
                "new_password": "newpassword123",
            }
        )
        
        assert response.status_code == 403
    
    def test_change_password_invalid_token(self, client):
        """Invalid token → 401"""
        response = client.post(
            "/api/auth/change-password",
            json={
                "current_password": "password123",
                "new_password": "newpassword123",
            },
            headers={"Authorization": "Bearer invalid.token.here"}
        )
        
        assert response.status_code == 401
