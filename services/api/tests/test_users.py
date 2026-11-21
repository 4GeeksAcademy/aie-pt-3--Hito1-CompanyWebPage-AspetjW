"""Tests for user management endpoints."""

import pytest


class TestUsersCRUD:
    """User CRUD operations with role-based access control"""
    
    def test_get_users_as_admin(self, client, sample_admin, admin_token, sample_user):
        """Admin lists all users"""
        response = client.get(
            "/api/users",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert response.status_code == 200
        users = response.json()
        assert isinstance(users, list)
        # At least sample_admin and sample_user should be present
        assert len(users) >= 1
    
    def test_get_users_as_user_denied(self, client, valid_token):
        """Regular user cannot list all users"""
        response = client.get(
            "/api/users",
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        
        assert response.status_code == 403
        assert "permisos" in response.json()["detail"].lower()
    
    def test_get_user_by_id_as_admin(self, client, sample_admin, admin_token, sample_user):
        """Admin views any user"""
        response = client.get(
            f"/api/users/{sample_user['id']}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == sample_user["email"]
    
    def test_get_user_by_id_as_owner(self, client, valid_token, sample_user):
        """User views own profile"""
        response = client.get(
            f"/api/users/{sample_user['id']}",
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == sample_user["id"]
    
    def test_get_user_nonexistent(self, client, admin_token):
        """Non-existent user → 404 not found"""
        response = client.get(
            "/api/users/nonexistent-id",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert response.status_code == 404
    
    def test_create_user_as_admin(self, client, admin_token):
        """Admin creates new user"""
        response = client.post(
            "/api/users",
            json={
                "email": "newuser@example.com",
                "password": "securepass123",
                "role": "user",
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == "newuser@example.com"
        assert data["role"] == "user"
    
    def test_create_user_as_regular_user_denied(self, client, valid_token):
        """Regular user cannot create users"""
        response = client.post(
            "/api/users",
            json={
                "email": "newuser@example.com",
                "password": "securepass123",
                "role": "user",
            },
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        
        assert response.status_code == 403
    
    def test_create_user_duplicate_email(self, client, admin_token, sample_user):
        """Duplicate email → 422 validation error"""
        response = client.post(
            "/api/users",
            json={
                "email": sample_user["email"],  # Already exists
                "password": "securepass123",
                "role": "user",
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert response.status_code == 422
    
    def test_create_user_invalid_role(self, client, admin_token):
        """Invalid role → 422 validation error"""
        response = client.post(
            "/api/users",
            json={
                "email": "newuser@example.com",
                "password": "securepass123",
                "role": "superuser",  # Not in enum
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert response.status_code == 422
    
    def test_create_user_short_password(self, client, admin_token):
        """Password < 8 chars → 422 validation error"""
        response = client.post(
            "/api/users",
            json={
                "email": "newuser@example.com",
                "password": "short",
                "role": "user",
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert response.status_code == 422
    
    def test_update_user_as_admin(self, client, admin_token, sample_user):
        """Admin updates any user"""
        response = client.patch(
            f"/api/users/{sample_user['id']}",
            json={"role": "manager"},
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert response.status_code == 200
        data = response.json()
        assert data["role"] == "manager"
    
    def test_update_user_as_owner(self, client, valid_token, sample_user):
        """User updates own profile (limited fields)"""
        # Can update but not change role to admin
        response = client.patch(
            f"/api/users/{sample_user['id']}",
            json={"role": "admin"},
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        
        # Should deny elevation to admin
        assert response.status_code == 403
    
    def test_delete_user_as_admin(self, client, admin_token, sample_user):
        """Admin deletes user"""
        response = client.delete(
            f"/api/users/{sample_user['id']}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        # Soft delete
        assert response.status_code == 200
    
    def test_delete_user_self_denied(self, client, valid_token, sample_user):
        """User cannot delete own account"""
        response = client.delete(
            f"/api/users/{sample_user['id']}",
            headers={"Authorization": f"Bearer {valid_token}"}
        )
        
        assert response.status_code == 403


class TestUserValidation:
    """Edge cases and validation rules for users"""
    
    def test_create_user_missing_email(self, client, admin_token):
        """Missing email → 422"""
        response = client.post(
            "/api/users",
            json={
                "password": "securepass123",
                "role": "user",
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert response.status_code == 422
    
    def test_create_user_invalid_email_format(self, client, admin_token):
        """Invalid email format → 422"""
        response = client.post(
            "/api/users",
            json={
                "email": "not-an-email",
                "password": "securepass123",
                "role": "user",
            },
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        
        assert response.status_code == 422
