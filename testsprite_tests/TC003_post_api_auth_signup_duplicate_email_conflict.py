import requests

BASE_URL = "http://localhost:3000"
SIGNUP_URL = f"{BASE_URL}/api/auth/signup"
EXISTING_EMAIL = "test@mcpforge.dev"
TIMEOUT = 30

def test_post_api_auth_signup_duplicate_email_conflict():
    payload = {
        "email": EXISTING_EMAIL,
        "password": "Password1",  # meets strength requirements
        "name": "Duplicate Test User"
    }
    headers = {
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(SIGNUP_URL, json=payload, headers=headers, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to signup endpoint failed: {e}"

    assert response.status_code == 409, f"Expected status code 409, got {response.status_code}"
    try:
        json_resp = response.json()
    except ValueError:
        assert False, "Response is not valid JSON"

    assert "errors" in json_resp, "'errors' key not in response JSON"
    errors = json_resp["errors"]
    assert "email" in errors, "'email' key not in errors"
    assert errors["email"] == "An account with this email already exists", f"Unexpected error message: {errors['email']}"

test_post_api_auth_signup_duplicate_email_conflict()