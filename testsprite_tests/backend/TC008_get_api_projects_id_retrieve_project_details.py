import requests

BASE_URL = "http://localhost:3000"
EMAIL = "test@mcpforge.dev"
PASSWORD = "Password1"
TIMEOUT = 30

def test_get_api_projects_id_retrieve_project_details():
    session = requests.Session()
    try:
        # Authenticate and get session cookies
        auth_payload = {
            "email": EMAIL,
            "password": PASSWORD
        }
        auth_headers = {"Content-Type": "application/json"}
        auth_resp = session.post(f"{BASE_URL}/api/auth/credentials", json=auth_payload, headers=auth_headers, timeout=TIMEOUT)
        assert auth_resp.status_code == 200, f"Authentication failed, status: {auth_resp.status_code}"

        # Get list of projects to find existing project id
        projects_resp = session.get(f"{BASE_URL}/api/projects", timeout=TIMEOUT)
        assert projects_resp.status_code == 200, f"Failed to list projects, status: {projects_resp.status_code}"
        projects_json = projects_resp.json()
        projects = projects_json.get("projects")
        assert isinstance(projects, list), "Projects response invalid format"
        # Find the 'Petstore MCP Server' project to use its id
        project = next((p for p in projects if p.get("name") == "Petstore MCP Server"), None)
        assert project is not None, "Known project 'Petstore MCP Server' not found"
        project_id = project.get("id")
        assert project_id, "Project ID not found"

        # Retrieve project details by id
        detail_resp = session.get(f"{BASE_URL}/api/projects/{project_id}", timeout=TIMEOUT)
        assert detail_resp.status_code == 200, f"Failed to get project details, status: {detail_resp.status_code}"
        detail_json = detail_resp.json()
        project_detail = detail_json.get("project")
        assert project_detail, "Project details not found in response"
        # Validate essential fields in project detail
        assert project_detail["id"] == project_id, "Project ID mismatch in details"
        assert isinstance(project_detail.get("mappings"), list), "Project 'mappings' missing or not list"
        assert isinstance(project_detail.get("config"), dict), "Project 'config' missing or not dict"
        # Additional optional validation: check name matches
        assert project_detail.get("name") == "Petstore MCP Server", "Project name mismatch in details"

    finally:
        session.close()

test_get_api_projects_id_retrieve_project_details()
