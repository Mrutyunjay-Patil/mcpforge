import requests

BASE_URL = "http://localhost:3000"
EMAIL = "test@mcpforge.dev"
PASSWORD = "Password1"
TIMEOUT = 30

def test_post_api_projects_create_project_missing_name():
    with requests.Session() as session:
        # Get CSRF token
        csrf_resp = session.get(f"{BASE_URL}/api/auth/csrf", timeout=TIMEOUT)
        assert csrf_resp.status_code == 200
        csrf_data = csrf_resp.json()
        csrf_token = csrf_data.get("csrfToken")
        assert csrf_token, "CSRF token missing in response"

        # Authenticate and get session cookies
        auth_payload = {
            "csrfToken": csrf_token,
            "email": EMAIL,
            "password": PASSWORD
        }
        auth_headers = {
            "Content-Type": "application/json"
        }
        auth_resp = session.post(f"{BASE_URL}/api/auth/[...nextauth]", json=auth_payload, headers=auth_headers, timeout=TIMEOUT)
        assert auth_resp.status_code == 200, f"Authentication failed with status {auth_resp.status_code}"

        # Attempt to create a project with missing 'name' field
        # Provide valid specContent to isolate the missing name error
        valid_spec_content = """
openapi: 3.0.0
info:
  title: Sample API
  version: "1.0"
paths: {}
        """.strip()

        project_payload = {
            # 'name' is intentionally missing to test validation
            "specContent": valid_spec_content,
            "specFormat": "yaml"
        }
        create_resp = session.post(f"{BASE_URL}/api/projects", json=project_payload, timeout=TIMEOUT)
        assert create_resp.status_code == 400, f"Expected 400 status but got {create_resp.status_code}"
        resp_json = create_resp.json()
        assert "error" in resp_json, "Response JSON missing 'error' key"
        assert resp_json["error"] == "Project name is required", f"Expected error message 'Project name is required' but got '{resp_json['error']}'"

test_post_api_projects_create_project_missing_name()