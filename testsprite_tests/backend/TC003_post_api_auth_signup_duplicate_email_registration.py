import requests

BASE_URL = "http://localhost:3000"
TEST_EMAIL = "test@mcpforge.dev"
TEST_PASSWORD = "Password1"
TIMEOUT = 30


def test_post_api_auth_signup_duplicate_email_registration():
    session = requests.Session()
    try:
        # Step 1: Get CSRF token
        csrf_response = session.get(f"{BASE_URL}/api/auth/csrf", timeout=TIMEOUT)
        assert csrf_response.status_code == 200, f"Failed to get CSRF token, status: {csrf_response.status_code}"
        csrf_data = csrf_response.json()
        csrf_token = csrf_data.get("csrfToken")
        assert csrf_token, "CSRF token not found in response"

        # Step 2: Authenticate to get session cookie (though not required for signup, but per instructions)
        auth_payload = {
            "csrfToken": csrf_token,
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
        }
        auth_headers = {"Content-Type": "application/json"}
        auth_response = session.post(f"{BASE_URL}/api/auth/callback/credentials", json=auth_payload, headers=auth_headers, timeout=TIMEOUT)
        assert auth_response.status_code == 200, f"Authentication failed with status: {auth_response.status_code}"

        # Step 3: Attempt to register with duplicate email
        signup_payload = {
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD,
        }
        signup_headers = {"Content-Type": "application/json"}
        signup_response = session.post(f"{BASE_URL}/api/auth/signup", json=signup_payload, headers=signup_headers, timeout=TIMEOUT)

        # Validate response is 409 Duplicate email error
        assert signup_response.status_code == 409, f"Expected 409 Conflict, got {signup_response.status_code}"
        resp_json = signup_response.json()
        assert "errors" in resp_json, "Response missing 'errors' key"
        errors = resp_json["errors"]
        assert "email" in errors, "Errors missing 'email' key"
        assert errors["email"] == "An account with this email already exists", f"Unexpected email error message: {errors['email']}"

    finally:
        session.close()


test_post_api_auth_signup_duplicate_email_registration()