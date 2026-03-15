import requests

BASE_URL = "http://localhost:3000"
EMAIL = "test@mcpforge.dev"
PASSWORD = "Password1"
TIMEOUT = 30

def test_get_api_projects_authenticated_user_projects_list():
    session = requests.Session()
    try:
        # Step 1: Authenticate with credentials to get session cookie
        auth_payload = {
            "email": EMAIL,
            "password": PASSWORD
        }
        headers = {"Content-Type": "application/json"}
        auth_resp = session.post(f"{BASE_URL}/api/auth/signin", json=auth_payload, headers=headers, timeout=TIMEOUT, allow_redirects=False)
        assert auth_resp.status_code == 200, f"Authentication failed with status {auth_resp.status_code}"

        # Step 2: Get projects list with authenticated session
        projects_resp = session.get(f"{BASE_URL}/api/projects", timeout=TIMEOUT)
        assert projects_resp.status_code == 200, f"Failed to get projects list, status {projects_resp.status_code}"
        projects_json = projects_resp.json()
        assert "projects" in projects_json, "'projects' key missing in response"
        projects = projects_json["projects"]
        assert isinstance(projects, list), "'projects' should be a list"

        # Assert projects array ordered by most recently updated (descending)
        updated_dates = []
        for project in projects:
            assert "updatedAt" in project, "Project missing 'updatedAt' field"
            updated_dates.append(project["updatedAt"])

        # Check descending order by updatedAt
        sorted_dates = sorted(updated_dates, reverse=True)
        assert updated_dates == sorted_dates, "Projects are not ordered by most recently updated"

    finally:
        session.close()

test_get_api_projects_authenticated_user_projects_list()
