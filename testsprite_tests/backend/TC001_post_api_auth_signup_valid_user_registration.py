import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def test_post_api_auth_signup_valid_user_registration():
    url = f"{BASE_URL}/api/auth/signup"
    payload = {
        "email": "newuser@example.com",
        "password": "StrongPass1",
        "name": "New User"
    }
    headers = {
        "Content-Type": "application/json"
    }
    response = None
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
        assert response.status_code == 201, f"Expected status code 201, got {response.status_code}"
        data = response.json()
        assert "user" in data, "Response JSON missing 'user' key"
        user = data["user"]
        assert "id" in user and isinstance(user["id"], str) and user["id"], "User id missing or invalid"
        assert user["email"] == payload["email"], f"User email mismatch: expected {payload['email']}, got {user['email']}"
        # Name is optional and can be null, but we sent a name so expect it to match trimmed string
        expected_name = payload["name"].strip() if payload.get("name") else None
        assert user.get("name") == expected_name, f"User name mismatch: expected {expected_name}, got {user.get('name')}"
    finally:
        # Cleanup: attempt to delete the created user if delete API existed - no delete API provided in PRD.
        # Since no delete user endpoint provided in PRD, cannot cleanup created user.
        # In a real scenario, user cleanup might be done via DB directly or a dedicated endpoint.
        pass

test_post_api_auth_signup_valid_user_registration()