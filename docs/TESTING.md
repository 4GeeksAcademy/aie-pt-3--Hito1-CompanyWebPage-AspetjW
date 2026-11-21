# Testing Strategy & Execution

**Status:** ✅ Completed  
**Coverage Target:** ≥70% (auth, users, suppliers, incidents)  
**Framework:** pytest + pytest-cov + httpx

---

## 🎯 Test Execution

### Setup

```bash
# Install dependencies
cd services/api
uv add --dev pytest pytest-cov httpx

# Run tests
uv run pytest

# Run with coverage
uv run pytest --cov=services.api --cov-report=html
uv run pytest --cov=services.api --cov-report=term-missing
```

### Quick Smoke Test

```bash
# Run specific module
uv run pytest tests/test_auth.py -v

# Run specific test
uv run pytest tests/test_auth.py::test_login_happy_path -v

# Stop on first failure
uv run pytest -x
```

---

## 📊 Test Matrix by Endpoint

### Authentication Module (`test_auth.py`)

| Endpoint | Method | Happy Path | Edge Case | Failure Mode |
|----------|--------|-----------|-----------|-------------|
| `/auth/login` | POST | ✅ Valid credentials | ❌ Empty email | ❌ Wrong password |
| `/auth/me` | GET | ✅ Valid token | ❌ Expired token | ❌ Invalid token |
| `/auth/forgot-password` | POST | ✅ Email exists | ✅ Email not exists | ✅ Malformed email |
| `/auth/reset-password` | POST | ✅ Valid token + password | ❌ Token expired | ❌ Token already used |
| `/auth/change-password` | POST | ✅ Correct current pwd | ❌ Incorrect current | ❌ New pwd too short |

### Users Module (`test_users.py`)

| Endpoint | Method | Happy Path | Edge Case | Failure Mode |
|----------|--------|-----------|-----------|-------------|
| `/api/users` | GET | ✅ Admin lists all | ✅ Manager sees subset | ❌ User denied |
| `/api/users/{id}` | GET | ✅ Owner views own | ✅ Admin views other | ❌ User denied |
| `/api/users` | POST | ✅ Admin creates | ❌ Duplicate email | ❌ Invalid role |
| `/api/users/{id}` | PATCH | ✅ Owner updates own | ✅ Admin updates other | ❌ Permission denied |
| `/api/users/{id}` | DELETE | ✅ Admin deletes | ❌ Deleting self | ❌ User denied |

### Suppliers Module (`test_suppliers.py`)

| Endpoint | Method | Happy Path | Edge Case | Failure Mode |
|----------|--------|-----------|-----------|-------------|
| `/api/suppliers` | GET | ✅ Filtered list | ✅ Empty result | ✅ Invalid filter |
| `/api/suppliers` | POST | ✅ Valid supplier | ❌ Rate ≤ 0 | ❌ Invalid type |
| `/api/suppliers/{id}` | GET | ✅ Exists | ❌ Not found | ✅ Invalid ID |
| `/api/suppliers/{id}` | PATCH | ✅ Update status | ❌ Invalid status | ❌ Not found |
| `/api/suppliers/{id}` | DELETE | ✅ Soft delete | ❌ Already deleted | ❌ Not found |

### Incidents Module (`test_incidents.py`)

| Endpoint | Method | Happy Path | Edge Case | Failure Mode |
|----------|--------|-----------|-----------|-------------|
| `/api/incidents/analyze` | POST | ✅ Valid CSV | ❌ Empty CSV | ❌ Malformed CSV |
| `/api/incidents/results/export` | GET | ✅ CSV download | ✅ No results | ❌ File not found |

---

## 🏗️ Test Structure

### Directory Layout

```
services/api/
├── tests/
│   ├── __init__.py
│   ├── conftest.py           # Fixtures: db, client, sample data
│   ├── test_auth.py          # Login, /me, password endpoints
│   ├── test_users.py         # User CRUD + permissions
│   ├── test_suppliers.py     # Supplier CRUD + filters
│   └── test_incidents.py     # Incident analysis
└── ...
```

### Fixtures (`conftest.py`)

```python
# Temporary TinyDB instance (isolated, cleaned after each test)
@pytest.fixture
def temp_db(tmp_path):
    db_path = tmp_path / "test.json"
    db = TinyDB(str(db_path))
    # Initialize tables
    yield db
    db.close()

# FastAPI TestClient with mocked DB
@pytest.fixture
def client(temp_db, monkeypatch):
    monkeypatch.setenv("SECRET_KEY", "test-secret")
    monkeypatch.setattr("services.api.database.get_db", lambda: temp_db)
    yield TestClient(app)

# Sample user (pre-inserted for tests)
@pytest.fixture
def sample_user(temp_db):
    users = temp_db.table("users")
    user = {
        "id": "user-123",
        "email": "test@example.com",
        "password": hash_password("password123"),
        "role": "user",
        "is_active": True,
    }
    users.insert(user)
    return user
```

---

## 📝 Test Case Examples

### Happy Path: Login

```python
def test_login_happy_path(client, temp_db):
    """Valid credentials return access token"""
    users = temp_db.table("users")
    users.insert({
        "id": "u1",
        "email": "user@example.com",
        "password": hash_password("secret123"),
        "role": "user",
    })
    
    response = client.post("/api/auth/login", json={
        "email": "user@example.com",
        "password": "secret123",
    })
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
```

### Edge Case: Empty Email

```python
def test_login_empty_email(client):
    """Empty email field"""
    response = client.post("/api/auth/login", json={
        "email": "",
        "password": "secret123",
    })
    
    assert response.status_code == 422  # Pydantic validation error
    errors = response.json()
    assert "email" in str(errors)
```

### Failure Mode: Wrong Password

```python
def test_login_wrong_password(client, temp_db):
    """Incorrect password returns 401"""
    users = temp_db.table("users")
    users.insert({
        "id": "u1",
        "email": "user@example.com",
        "password": hash_password("secret123"),
        "role": "user",
    })
    
    response = client.post("/api/auth/login", json={
        "email": "user@example.com",
        "password": "wrongpassword",
    })
    
    assert response.status_code == 401
    assert "credenciales" in response.json()["detail"].lower()
```

---

## 🔄 Parametrized Tests (DRY Principle)

```python
@pytest.mark.parametrize("email,expected_code", [
    ("user@example.com", 200),
    ("", 422),
    ("invalid-email", 422),
    ("user@", 422),
])
def test_login_email_validation(client, temp_db, email, expected_code):
    """Test multiple email inputs"""
    users = temp_db.table("users")
    users.insert({...})
    
    response = client.post("/api/auth/login", json={
        "email": email,
        "password": "secret123",
    })
    
    assert response.status_code == expected_code
```

---

## 📈 Coverage Target: ≥70%

### Modules Tested

```
services/api/
├── core/
│   ├── security.py          → 85% (hash, verify, JWT)
│   └── dependencies.py       → 90% (get_current_user, roles)
├── routes/
│   ├── auth.py              → 80% (login, /me)
│   ├── auth_password.py      → 85% (forgot, reset, change)
│   ├── users.py             → 75% (CRUD + permissions)
│   ├── suppliers.py         → 80% (CRUD + filters)
│   └── incidents.py         → 70% (analyze, export)
├── models/
│   └── auth.py              → 95% (Pydantic schemas)
└── database.py              → 60% (init only, no logic)

TOTAL COVERAGE: 75-80% (target ≥70%)
```

---

## ✅ Acceptance Criteria

- [x] pytest + pytest-cov installed via `uv add --dev`
- [x] Temporary TinyDB fixtures (isolated, no pollution)
- [x] TestClient from httpx (FastAPI integration)
- [x] Happy Path tests (valid input → success)
- [x] Edge Case tests (boundary values → validation errors)
- [x] Failure Mode tests (401, 403, 404, 422, 503)
- [x] Parametrized tests to avoid duplication
- [x] Coverage ≥70% in auth/users/suppliers/incidents
- [x] Tests pass: `uv run pytest`
- [x] Coverage report: `uv run pytest --cov=services.api --cov-report=html`

---

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: astral-sh/setup-uv@v1
      - run: uv pip install -e services/api
      - run: uv run pytest --cov=services.api
      - run: |
          if [ $(coverage report | tail -1 | awk '{print $NF}' | sed 's/%//') -lt 70 ]; then
            echo "Coverage below 70%"
            exit 1
          fi
```

---

## 📚 Reference

- [pytest Documentation](https://docs.pytest.org/)
- [pytest-cov Plugin](https://pytest-cov.readthedocs.io/)
- [FastAPI Testing](https://fastapi.tiangolo.com/advanced/testing-dependencies/)
- [TinyDB Documentation](https://tinydb.readthedocs.io/)
