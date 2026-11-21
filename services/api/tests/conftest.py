"""Test fixtures: database, client, sample data."""

import pytest
from pathlib import Path
from tinydb import TinyDB
from fastapi.testclient import TestClient
import os
import sys

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from services.api.database import get_db
from services.api.core.security import hash_password


@pytest.fixture
def temp_db(tmp_path):
    """
    Temporary TinyDB instance for isolated testing.
    
    Each test gets a fresh database that's deleted after test completion.
    """
    db_path = tmp_path / "test.json"
    db = TinyDB(str(db_path))
    
    # Initialize required tables
    db.table("users")
    db.table("profiles")
    db.table("suppliers")
    db.table("incidents")
    db.table("audit")
    
    yield db
    
    # Cleanup
    db.close()
    if db_path.exists():
        db_path.unlink()


@pytest.fixture
def client(temp_db, monkeypatch):
    """
    FastAPI TestClient with temporary database.
    
    Mocks get_db() to return temp_db for isolation.
    Sets SECRET_KEY for JWT operations.
    """
    # Mock environment
    monkeypatch.setenv("SECRET_KEY", "test-secret-key-12345")
    monkeypatch.setenv("ALGORITHM", "HS256")
    monkeypatch.setenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15")
    
    # Mock database
    monkeypatch.setattr("services.api.database.get_db", lambda: temp_db)
    
    # Import app after mocking (to pick up mocks)
    from services.api.main import app
    
    return TestClient(app)


@pytest.fixture
def sample_user(temp_db):
    """Pre-inserted test user."""
    users = temp_db.table("users")
    user = {
        "id": "user-123",
        "email": "user@example.com",
        "password": hash_password("password123"),
        "role": "user",
        "is_active": True,
        "created_at": "2026-01-01T00:00:00",
        "updated_at": "2026-01-01T00:00:00",
    }
    users.insert(user)
    return user


@pytest.fixture
def sample_admin(temp_db):
    """Pre-inserted test admin."""
    users = temp_db.table("users")
    admin = {
        "id": "admin-123",
        "email": "admin@example.com",
        "password": hash_password("admin123"),
        "role": "admin",
        "is_active": True,
        "created_at": "2026-01-01T00:00:00",
        "updated_at": "2026-01-01T00:00:00",
    }
    users.insert(admin)
    return admin


@pytest.fixture
def sample_supplier(temp_db):
    """Pre-inserted test supplier."""
    suppliers = temp_db.table("suppliers")
    supplier = {
        "id": "supp-001",
        "name": "Medical Supplier Inc",
        "type": "LABORATORIO",
        "country": "CO",
        "category": "Análisis",
        "rate": 95.50,
        "npi": "1234567890",
        "status": "active",
        "created_at": "2026-01-01T00:00:00",
        "updated_at": "2026-01-01T00:00:00",
    }
    suppliers.insert(supplier)
    return supplier


@pytest.fixture
def valid_token(client, sample_user):
    """Generate valid JWT token for sample_user."""
    response = client.post("/api/auth/login", json={
        "email": "user@example.com",
        "password": "password123",
    })
    return response.json()["access_token"]


@pytest.fixture
def admin_token(client, sample_admin):
    """Generate valid JWT token for sample_admin."""
    response = client.post("/api/auth/login", json={
        "email": "admin@example.com",
        "password": "admin123",
    })
    return response.json()["access_token"]
