import requests
import json
from datetime import datetime
import time

BASE_URL = "http://localhost:3000"
EMAIL = "test@mcpforge.dev"
PASSWORD = "Password1"
TIMEOUT = 30

def authenticate():
    session = requests.Session()
    url = f"{BASE_URL}/api/auth/[...nextauth]"
    payload = {
        "email": EMAIL,
        "password": PASSWORD
    }
    headers = {"Content-Type": "application/json"}
    resp = session.post(url, json=payload, headers=headers, timeout=TIMEOUT, allow_redirects=False)
    # NextAuth may respond with 200 or 302 redirect on success
    assert resp.status_code in (200, 302), f"Authentication failed with status {resp.status_code}"
    # Cookies stored in session automatically
    return session

def create_project(session, name, spec_content):
    url = f"{BASE_URL}/api/projects"
    payload = {
        "name": name,
        "specContent": spec_content
    }
    headers = {"Content-Type": "application/json"}
    resp = session.post(url, data=json.dumps(payload), headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    assert resp.status_code == 201
    data = resp.json()
    project = data.get("project")
    assert project and "id" in project
    return project

def delete_project(session, project_id):
    url = f"{BASE_URL}/api/projects/{project_id}"
    resp = session.delete(url, timeout=TIMEOUT)
    # Accept 200 if success, or 404 if already deleted
    if resp.status_code not in (200, 404):
        resp.raise_for_status()
    else:
        if resp.status_code == 200:
            data = resp.json()
            assert data.get("message") == "Project deleted"

def test_patch_api_projects_id_update_project_name():
    session = authenticate()

    # We will create a new project to test update on it
    # Use a minimal valid OpenAPI spec JSON string for specContent
    spec_content = json.dumps({
        "openapi": "3.0.0",
        "info": {"title": "TestSpec", "version": "1.0.0"},
        "paths": {}
    })
    original_name = f"Test Project {int(time.time())}"
    new_name = f"Updated Project {int(time.time())}"

    project = None
    try:
        project = create_project(session, original_name, spec_content)
        project_id = project["id"]

        url = f"{BASE_URL}/api/projects/{project_id}"
        payload = {"name": new_name}
        headers = {"Content-Type": "application/json"}

        resp = session.patch(url, data=json.dumps(payload), headers=headers, timeout=TIMEOUT)
        assert resp.status_code == 200, f"Expected 200 OK but got {resp.status_code}"
        data = resp.json()
        updated_project = data.get("project")
        assert updated_project, "Response missing 'project' field"
        assert updated_project.get("id") == project_id
        assert updated_project.get("name") == new_name
        updated_at = updated_project.get("updatedAt")
        assert updated_at, "Response missing 'updatedAt' timestamp"
        # Validate updatedAt is a valid ISO8601 datetime string
        try:
            datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
        except Exception:
            assert False, f"updatedAt timestamp is not valid ISO8601: {updated_at}"
    finally:
        if project:
            delete_project(session, project["id"])

test_patch_api_projects_id_update_project_name()
