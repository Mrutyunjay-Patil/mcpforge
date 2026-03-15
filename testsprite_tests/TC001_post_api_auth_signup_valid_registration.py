import requests
import uuid

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def test_post_api_auth_signup_valid_registration():
    url = f"{BASE_URL}/api/auth/signup"
    unique_email = f"testuser_{uuid.uuid4().hex[:8]}@mcpforge.dev"
    payload = {
        "email": unique_email,
        "password": "Password1",
        "name": "Test User"
    }
    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    try:
        resp_json = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert "user" in resp_json, "Response JSON missing 'user'"
    user = resp_json["user"]
    assert "id" in user and user["id"], "User ID missing or empty"
    assert "email" in user and user["email"] == unique_email, f"Email mismatch: expected {unique_email}, got {user.get('email')}"
    assert "name" in user and user["name"] == "Test User", f"Name mismatch: expected 'Test User', got {user.get('name')}"

test_post_api_auth_signup_valid_registration()