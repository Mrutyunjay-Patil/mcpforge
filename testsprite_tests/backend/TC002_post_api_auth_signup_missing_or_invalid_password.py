import requests

BASE_URL = "http://localhost:3000"
EMAIL = "test@mcpforge.dev"
PASSWORD = "Password1"
TIMEOUT = 30

def get_csrf_token(session):
    url = f"{BASE_URL}/api/auth/csrf"
    resp = session.get(url, timeout=TIMEOUT)
    resp.raise_for_status()
    data = resp.json()
    csrf_token = data.get("csrfToken")
    assert csrf_token, "CSRF token not found"
    return csrf_token

def authenticate(session):
    csrf_token = get_csrf_token(session)
    url = f"{BASE_URL}/api/auth/callback/credentials"
    payload = {
        "csrfToken": csrf_token,
        "email": EMAIL,
        "password": PASSWORD
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    resp = session.post(url, data=payload, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    assert resp.status_code == 200
    # Session cookie is stored in session automatically

def test_post_api_auth_signup_missing_or_invalid_password():
    session = requests.Session()
    try:
        # No auth required for signup
        url = f"{BASE_URL}/api/auth/signup"

        # Test cases with missing or invalid password
        test_payloads = [
            {"email": "newuser1@example.com"},  # missing password
            {"email": "newuser2@example.com", "password": ""},  # empty password
            {"email": "newuser3@example.com", "password": "short"},  # too short
            {"email": "newuser4@example.com", "password": "alllowercase1"},  # no uppercase
            {"email": "newuser5@example.com", "password": "NoNumber"},  # no number
            {"email": "newuser6@example.com", "password": "SHORT1"},  # no lowercase (likely fail, but requirement says at least 1 uppercase and 1 number, no lowercase required, but usually should check invalid)
        ]

        for payload in test_payloads:
            data = payload.copy()
            if "password" not in data:
                # explicitly exclude password key to test missing
                pass
            url_post = url
            headers = {"Content-Type": "application/json"}
            resp = session.post(url_post, json=data, headers=headers, timeout=TIMEOUT)
            assert resp.status_code == 400, f"Expected 400 but got {resp.status_code} for payload: {data}"
            resp_json = resp.json()
            assert "errors" in resp_json, f"errors key missing in response for payload: {data}"
            # password error expected in errors
            errors = resp_json.get("errors", {})
            assert "password" in errors, f"password error expected but not found in errors for payload: {data}"
    finally:
        session.close()

test_post_api_auth_signup_missing_or_invalid_password()