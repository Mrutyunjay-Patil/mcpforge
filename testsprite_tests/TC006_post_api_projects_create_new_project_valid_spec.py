import requests
import json

BASE_URL = "http://localhost:3000"
EMAIL = "test@mcpforge.dev"
PASSWORD = "Password1"
TIMEOUT = 30

def test_post_api_projects_create_new_project_valid_spec():
    session = requests.Session()

    # Step 1: Get CSRF token
    try:
        csrf_resp = session.get(f"{BASE_URL}/api/auth/csrf", timeout=TIMEOUT)
        csrf_resp.raise_for_status()
        csrf_data = csrf_resp.json()
        csrf_token = csrf_data.get("csrfToken")
        assert csrf_token, "CSRF token missing in response"
    except Exception as e:
        raise AssertionError(f"Failed to obtain CSRF token: {e}")

    # Step 2: Authenticate with credentials to get session cookies
    auth_payload = {
        "csrfToken": csrf_token,
        "email": EMAIL,
        "password": PASSWORD
    }
    headers = {"Content-Type": "application/json"}
    try:
        auth_resp = session.post(f"{BASE_URL}/api/auth/signin", json=auth_payload, headers=headers, timeout=TIMEOUT)
        if auth_resp.status_code != 200:
            raise AssertionError(f"Authentication failed with status code {auth_resp.status_code}: {auth_resp.text}")
    except Exception as e:
        raise AssertionError(f"Authentication request failed: {e}")

    # Step 3: Create a new project with valid name and OpenAPI spec content
    project_name = "Test Project Valid Spec"
    spec_content = json.dumps({
        "openapi": "3.0.0",
        "info": {
            "title": "Test API",
            "version": "1.0.0"
        },
        "paths": {
            "/pets": {
                "get": {
                    "summary": "List all pets",
                    "responses": {
                        "200": {
                            "description": "A list of pets."
                        }
                    }
                }
            }
        }
    })

    project_payload = {
        "name": project_name,
        "specContent": spec_content,
        "specFormat": "json"
    }

    created_project_id = None

    try:
        create_resp = session.post(f"{BASE_URL}/api/projects", json=project_payload, headers=headers, timeout=TIMEOUT)
        assert create_resp.status_code == 201, f"Expected status 201, got {create_resp.status_code}: {create_resp.text}"
        data = create_resp.json()
        project = data.get("project")
        assert project, "Response missing 'project' field"
        assert "id" in project and project["id"], "Project ID missing in response"
        assert "name" in project and project["name"] == project_name, f"Project name mismatch: expected '{project_name}', got '{project.get('name')}'"
        assert "pathCount" in project and isinstance(project["pathCount"], int), "Project pathCount missing or invalid"
        created_project_id = project["id"]
    except Exception as e:
        raise AssertionError(f"Project creation failed: {e}")
    finally:
        # Cleanup: delete the created project if created_project_id is set
        if created_project_id:
            try:
                del_resp = session.delete(f"{BASE_URL}/api/projects/{created_project_id}", timeout=TIMEOUT)
                if del_resp.status_code != 200:
                    print(f"Warning: Failed to delete project {created_project_id} during cleanup. Status: {del_resp.status_code}")
            except Exception as e:
                print(f"Warning: Exception during cleanup deleting project {created_project_id}: {e}")

test_post_api_projects_create_new_project_valid_spec()
