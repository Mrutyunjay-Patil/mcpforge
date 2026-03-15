import requests

BASE_URL = "http://localhost:3000"
EMAIL = "test@mcpforge.dev"
PASSWORD = "Password1"
TIMEOUT = 30

def test_delete_api_projects_id_delete_project():
    session = requests.Session()
    try:
        # Step 1: Authenticate and obtain session cookies
        auth_payload = {
            "email": EMAIL,
            "password": PASSWORD
        }
        auth_headers = {"Content-Type": "application/json"}
        auth_resp = session.post(f"{BASE_URL}/api/auth/signin", 
                                 json=auth_payload, 
                                 headers=auth_headers, 
                                 timeout=TIMEOUT)
        auth_resp.raise_for_status()
        assert auth_resp.status_code == 200

        # Step 2: Create a new project to delete later
        project_payload = {
            "name": "Temp Project For Deletion",
            "specContent": """
{
  "openapi": "3.0.0",
  "info": {
    "title": "Temp API",
    "version": "1.0.0"
  },
  "paths": {}
}
"""
        }
        project_resp = session.post(f"{BASE_URL}/api/projects", 
                                    json=project_payload, 
                                    timeout=TIMEOUT)
        project_resp.raise_for_status()
        assert project_resp.status_code == 201
        project_data = project_resp.json()
        project = project_data.get("project")
        assert project and "id" in project, "Project creation response missing project id"
        project_id = project["id"]

        try:
            # Step 3: Delete the created project
            delete_resp = session.delete(f"{BASE_URL}/api/projects/{project_id}", timeout=TIMEOUT)
            delete_resp.raise_for_status()
            assert delete_resp.status_code == 200
            delete_json = delete_resp.json()
            assert delete_json.get("message") == "Project deleted"
        finally:
            # Cleanup: Just in case delete above failed, try deleting project again (idempotent)
            session.delete(f"{BASE_URL}/api/projects/{project_id}", timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"HTTP request failed: {e}"


test_delete_api_projects_id_delete_project()