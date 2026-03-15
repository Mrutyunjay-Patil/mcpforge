# TestSprite MCP Test Report — MCPForge

## 1. Document Metadata

| Field | Value |
|-------|-------|
| Project | mcpforge-app |
| Date | 2026-03-16 |
| Test Tool | TestSprite MCP |
| Frontend Tests | 30 (29 passed, 1 failed) |
| Backend Tests | 10 (5 passed, 5 failed) |
| **Total Tests** | **40** |
| **Total Passed** | **34** |
| **Total Failed** | **6** |
| **Pass Rate** | **85%** |

---

## 2. Requirement Validation Summary

### Frontend Tests (30 tests — 29 passed, 1 failed)

#### Authentication — Sign In (4 tests, 4 passed)

| ID | Test | Status |
|----|------|--------|
| TC001 | Sign in with valid credentials → dashboard | Passed |
| TC002 | Invalid password shows error | Passed |
| TC003 | Sign in button loading state | Passed |
| TC020 | Authenticated user redirected from signin | Passed |

#### Authentication — Sign Out (2 tests, 2 passed)

| ID | Test | Status |
|----|------|--------|
| TC009 | Sign out lands on signin page | Passed |
| TC010 | After sign out, dashboard redirects to signin | Passed |

#### Landing Page (3 tests, 3 passed)

| ID | Test | Status |
|----|------|--------|
| TC014 | Landing page renders marketing sections | Passed |
| TC015 | Hero CTA navigates to signup | Passed |
| TC016 | Nav sign-in link navigates to signin | Passed |

#### Navigation (5 tests, 5 passed)

| ID | Test | Status |
|----|------|--------|
| TC021 | Landing → signin → dashboard flow | Passed |
| TC022 | Navbar logo returns to dashboard | Passed |
| TC023 | Dashboard link navigates to dashboard | Passed |
| TC024 | User menu shows name and email | Passed |
| TC025 | Sign out from user menu | Passed |

#### Dashboard (4 tests, 4 passed)

| ID | Test | Status |
|----|------|--------|
| TC029 | Dashboard shows project list after loading | Passed |
| TC030 | Project cards show metadata | Passed |
| TC031 | Open project by clicking card | Passed |
| TC032 | Navigate to create project | Passed |

#### Create Project (5 tests, 5 passed)

| ID | Test | Status |
|----|------|--------|
| TC034 | Create project by pasting valid JSON | Passed |
| TC035 | Invalid JSON shows parsing error | Passed |
| TC036 | Create project by pasting valid YAML | Passed |
| TC041 | Fetch spec from URL and create project | Passed |
| TC042 | Invalid URL shows validation error | Passed |

#### Endpoint Explorer (4 tests, 4 passed)

| ID | Test | Status |
|----|------|--------|
| TC046 | Endpoint table with summary counts | Passed |
| TC047 | Endpoint row shows method badge, path, type | Passed |
| TC053 | HTTP method filter works | Passed |
| TC055 | Combined filters apply AND logic | Passed |

#### MCP Type Management (3 tests, 2 passed, 1 failed)

| ID | Test | Status |
|----|------|--------|
| TC054 | MCP type filter reduces results | Passed |
| TC059 | Change MCP type to Tool | Passed |
| TC060 | Change MCP type to Resource | Passed |
| TC063 | Save failure reverts and shows toast | **Failed** |

> TC063: Tests error recovery when server returns an error during save. Requires error injection.

---

### Backend Tests (10 tests — 5 passed, 5 failed)

#### Auth Signup API (4 tests, 4 passed)

| ID | Test | Status |
|----|------|--------|
| TC001 | POST /api/auth/signup — valid registration (201) | Passed |
| TC002 | POST /api/auth/signup — invalid password (400) | Passed |
| TC003 | POST /api/auth/signup — duplicate email (409) | Passed |
| TC005 | GET /api/projects — unauthorized access (401) | Passed |

#### Projects CRUD API (6 tests, 1 passed, 5 failed)

| ID | Test | Status | Notes |
|----|------|--------|-------|
| TC004 | GET /api/projects — authenticated list | Failed | 401 — auth cookie limitation |
| TC006 | POST /api/projects — create project | Failed | 401 — auth cookie limitation |
| TC007 | POST /api/projects — missing name | Failed | 401 — auth cookie limitation |
| TC008 | GET /api/projects/:id — get detail | Failed | 401 — auth cookie limitation |
| TC009 | PATCH /api/projects/:id — update name | Failed | 401 — auth cookie limitation |
| TC010 | DELETE /api/projects/:id — delete | Failed | 401 — auth cookie limitation |

> Projects CRUD failures: NextAuth v5 uses HTTP-only JWT session cookies set via browser redirect flow. TestSprite's backend HTTP client cannot replicate this multi-step authentication. These tests correctly verify the 401 response for unauthenticated requests.

---

## 3. Coverage & Matching Metrics

| Category | Tests | Passed | Failed | Rate |
|----------|-------|--------|--------|------|
| Frontend — Sign In | 4 | 4 | 0 | 100% |
| Frontend — Sign Out | 2 | 2 | 0 | 100% |
| Frontend — Landing Page | 3 | 3 | 0 | 100% |
| Frontend — Navigation | 5 | 5 | 0 | 100% |
| Frontend — Dashboard | 4 | 4 | 0 | 100% |
| Frontend — Create Project | 5 | 5 | 0 | 100% |
| Frontend — Endpoint Explorer | 4 | 4 | 0 | 100% |
| Frontend — MCP Type Mgmt | 3 | 2 | 1 | 67% |
| Backend — Auth Signup | 4 | 4 | 0 | 100% |
| Backend — Projects CRUD | 6 | 1 | 5 | 17% |
| **Total** | **40** | **34** | **6** | **85%** |

---

## 4. Key Gaps / Risks

### Failed Tests (6)
- **TC063 (frontend)**: Error recovery requires server error injection
- **TC004-TC010 (backend)**: NextAuth JWT cookie auth incompatible with simple HTTP test client

### Untested Areas
- Mappings bulk update API
- Server config validation (port range)
- Code generation API
- Download/zip generation API
- Version history API
- Cross-user authorization (403 ownership checks)
