def test_login_json_success(client):
    payload = {
        "email": "collector.koraput@odisha.gov.in",
        "password": "GovOfficialPass123!"
    }
    response = client.post("/api/v1/auth/login/json", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["role"] == "government_official"


def test_login_invalid_password(client):
    payload = {
        "email": "collector.koraput@odisha.gov.in",
        "password": "WrongPassword!"
    }
    response = client.post("/api/v1/auth/login/json", json=payload)
    assert response.status_code == 401


def test_register_citizen_allowed(client):
    payload = {
        "email": "new.citizen@koraput.in",
        "full_name": "Amiya Nayak",
        "password": "SecurePassword123!",
        "role": "citizen",
        "department_or_org": "Semiliguda Farmers Association"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == payload["email"]
    assert data["role"] == "citizen"


def test_register_prevent_self_assign_admin_role(client):
    # Security requirement: Never allow a user to assign themselves privileged roles
    payload = {
        "email": "hacker@domain.com",
        "full_name": "Bad Actor",
        "password": "SecurePassword123!",
        "role": "system_admin"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 422  # Pydantic validation error


def test_register_prevent_self_assign_government_role(client):
    # Security requirement: Cannot self-assign government_official role
    payload = {
        "email": "fake.official@domain.com",
        "full_name": "Fake Official",
        "password": "SecurePassword123!",
        "role": "government_official"
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 422  # Pydantic validation error


def test_read_me_profile(client, citizen_headers):
    response = client.get("/api/v1/auth/me", headers=citizen_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "citizen"
    assert "id" in data
