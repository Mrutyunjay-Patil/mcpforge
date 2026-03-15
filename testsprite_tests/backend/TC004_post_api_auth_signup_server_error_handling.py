import requests

def test_post_api_auth_signup_server_error_handling():
    url = "http://localhost:3000/api/auth/signup"
    # Payload with valid email and strong password
    payload = {
        "email": "simulate_server_error@mcpforge.dev",
        "password": "Password1",
        "name": "Simulate Server Error"
    }
    headers = {
        "Content-Type": "application/json"
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed with exception: {e}"

    # We expect a 500 status code with a generic server error message in the body
    assert response.status_code == 500, f"Expected status code 500 but got {response.status_code}"
    try:
        json_resp = response.json()
    except Exception:
        assert False, "Response is not JSON as expected"

    assert "errors" in json_resp, "Response JSON does not contain 'errors' key"
    assert "server" in json_resp["errors"], "Response JSON 'errors' does not contain 'server' key"
    assert json_resp["errors"]["server"] == "An unexpected error occurred", \
        f"Unexpected server error message: {json_resp['errors']['server']}"

test_post_api_auth_signup_server_error_handling()