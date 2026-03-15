import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def test_get_api_projects_unauthorized_access():
    url = f"{BASE_URL}/api/projects"
    try:
        response = requests.get(url, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 401, f"Expected 401 Unauthorized, got {response.status_code}"
    try:
        json_resp = response.json()
    except Exception:
        assert False, "Response is not valid JSON"

    assert "error" in json_resp, "Expected error key in response"
    assert json_resp["error"].lower() == "unauthorized", f"Expected error message 'Unauthorized', got '{json_resp['error']}'"

test_get_api_projects_unauthorized_access()