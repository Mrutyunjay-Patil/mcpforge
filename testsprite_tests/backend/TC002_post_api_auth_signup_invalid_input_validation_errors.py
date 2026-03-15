import requests

BASE_URL = "http://localhost:3000"
SIGNUP_ENDPOINT = "/api/auth/signup"
TIMEOUT = 30
HEADERS = {"Content-Type": "application/json"}

def test_post_api_auth_signup_invalid_input_validation_errors():
    url = BASE_URL + SIGNUP_ENDPOINT

    # Test cases with invalid/missing email and password inputs
    test_payloads = [
        # Missing email and password
        ({}, ['email', 'password']),
        # Missing password
        ({"email": "invalidemail@example.com"}, ['password']),
        # Missing email
        ({"password": "Password1"}, ['email']),
        # Invalid email format, valid password
        ({"email": "invalid-email-format", "password": "Password1"}, ['email']),
        # Valid email, password too short
        ({"email": "user@example.com", "password": "P1"}, ['password']),
        # Valid email, password missing uppercase
        ({"email": "user@example.com", "password": "password1"}, ['password']),
        # Valid email, password missing number
        ({"email": "user@example.com", "password": "Password"}, ['password']),
        # Empty strings for email and password
        ({"email": "", "password": ""}, ['email', 'password']),
        # Email as None, password valid
        ({"email": None, "password": "Password1"}, ['email']),
        # Email valid, password as None
        ({"email": "user@example.com", "password": None}, ['password']),
    ]

    for payload, expected_error_fields in test_payloads:
        try:
            response = requests.post(url, json=payload, headers=HEADERS, timeout=TIMEOUT)
        except requests.RequestException as e:
            assert False, f"Request failed: {e}"

        assert response.status_code == 400, f"Expected status code 400, got {response.status_code} for payload {payload}"
        try:
            data = response.json()
        except Exception:
            assert False, f"Response is not valid JSON for payload {payload}"

        assert "errors" in data, f"Response JSON missing 'errors' key for payload {payload}"
        errors = data["errors"]
        assert isinstance(errors, dict), f"'errors' field is not a dict for payload {payload}"

        # Check the presence of expected error fields in response
        for field in expected_error_fields:
            assert field in errors, f"Expected error for field '{field}' missing for payload {payload}"
            assert isinstance(errors[field], str) or errors[field] is not None, f"Error message for '{field}' should be string/non-null for payload {payload}"

        # No unexpected error fields
        for err_field in errors:
            assert err_field in ['email', 'password'], f"Unexpected error field '{err_field}' in response for payload {payload}"

test_post_api_auth_signup_invalid_input_validation_errors()