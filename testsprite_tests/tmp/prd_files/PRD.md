# MCPForge — Product Requirements Document

## Product Overview
MCPForge is a full-stack web application that converts OpenAPI specifications into production-ready MCP (Model Context Protocol) server projects through a visual interface. Users register accounts, upload API specs, visually map endpoints to MCP primitives, configure server settings, preview generated code, and download complete project packages.

## Core Goals
1. Allow developers to convert OpenAPI specs to MCP servers without CLI tools
2. Provide visual control over endpoint-to-MCP-type mapping
3. Generate production-ready, downloadable MCP server projects
4. Save and manage multiple conversion projects per user

## Target Users
- Developers building AI agent integrations who have existing REST APIs
- Teams adopting MCP for their API ecosystem

---

## Feature Specifications

### F1: User Authentication

#### F1.1: Registration Page (/auth/signup)
- **Fields:** Name (optional, max 50 chars), Email (required, valid format), Password (required, min 8 chars, must contain 1 uppercase + 1 number), Confirm Password (must match)
- **Validation rules:**
  - Email: reject if empty, reject if invalid format (no @, no domain), reject if already registered
  - Password: reject if less than 8 chars, reject if no uppercase letter, reject if no number
  - Confirm Password: reject if does not match password
- **Success:** Create account, auto-login, redirect to /dashboard
- **Errors:** Display inline error messages below each field. Display toast for server errors.
- **UI:** Form centered on page, "Already have an account? Sign in" link below form

#### F1.2: Login Page (/auth/signin)
- **Fields:** Email (required), Password (required)
- **Validation:** reject empty fields, reject invalid email format
- **Success:** Create session, redirect to /dashboard
- **Errors:** Show "Invalid email or password" for wrong credentials (do not reveal which field is wrong)
- **UI:** Form centered on page, "Don't have an account? Sign up" link below form

#### F1.3: Logout
- Logout button in navbar user dropdown menu
- Clears session/cookies
- Redirects to /auth/signin
- After logout, accessing /dashboard should redirect to /auth/signin

#### F1.4: Route Protection
- /dashboard, /projects/* require authentication
- Unauthenticated access redirects to /auth/signin with return URL
- /auth/signin, /auth/signup redirect to /dashboard if already authenticated
- API routes return 401 JSON: { error: "Unauthorized" } for unauthenticated requests

#### F1.5: Session Display
- Navbar shows user name or email when logged in
- Navbar shows "Sign In" / "Sign Up" buttons when logged out

---

### F2: Project Dashboard (/dashboard)

#### F2.1: Project Cards
- Display all user's projects as cards in a grid (3 columns desktop, 2 tablet, 1 mobile)
- Each card shows: project name, API title (from spec), endpoint count badge, created date, last modified date
- Cards are clickable — navigate to /projects/[id]
- Sorted by last modified date (newest first)

#### F2.2: Empty State
- When user has zero projects, show illustration/icon with text: "No projects yet. Create your first MCPForge project to get started."
- Display prominent "Create Project" button

#### F2.3: Search
- Search input at top of dashboard
- Filters projects by name (case-insensitive, substring match)
- Updates results in real-time as user types (debounced 300ms)
- Show "No projects match your search" when no results
- "Clear" button (X icon) resets search and shows all projects

#### F2.4: Delete Project
- Each card has a delete icon button (top-right corner)
- Click opens confirmation dialog: title "Delete Project", message "Are you sure you want to delete '{project name}'? This action cannot be undone.", buttons "Cancel" and "Delete"
- Cancel: closes dialog, no action
- Delete: removes project and all related data (mappings, config, versions), closes dialog, shows success toast "Project deleted", updates card list
- If deletion fails, show error toast "Failed to delete project"

#### F2.5: Create New Project Button
- "New Project" button in dashboard header (always visible, not affected by search)
- Also show as floating action button on mobile
- Navigates to /projects/new

---

### F3: Create Project (/projects/new)

#### F3.1: Project Name
- Text input with label "Project Name"
- Required, min 1 char, max 100 chars
- Placeholder: "e.g., Petstore MCP Server"
- Validation: show "Project name is required" if empty on submit, show "Project name must be under 100 characters" if too long

#### F3.2: Spec Input — Three Tabs
Tabbed interface with three input methods. Only one active at a time.

**Tab 1: Upload File**
- Drag-and-drop zone with dashed border
- Text: "Drag & drop your OpenAPI spec here, or click to browse"
- Accepts: .json, .yaml, .yml files only
- Max file size: 5MB
- On file select: show filename + file size + remove button
- Reject other file types with error: "Only .json, .yaml, and .yml files are accepted"
- Reject oversized files: "File must be under 5MB"

**Tab 2: Paste Content**
- Large textarea (min-height 300px)
- Placeholder: "Paste your OpenAPI spec (JSON or YAML)..."
- Auto-detects JSON vs YAML format
- Character count display: "{n} characters"

**Tab 3: Fetch from URL**
- Text input with label "OpenAPI Spec URL"
- Placeholder: "https://api.example.com/openapi.json"
- "Fetch" button next to input
- Loading state: button shows spinner, input disabled
- Success: show "Spec fetched successfully" + display first 100 chars as preview
- Errors: "Invalid URL format", "Failed to fetch: {status code}", "URL did not return valid content", "Request timed out after 10 seconds"

#### F3.3: Spec Validation
- On "Create Project" button click, validate spec using swagger-parser
- **Valid spec:** Create project in DB, parse all endpoints, create default mappings, create default config, redirect to /projects/[id]
- **Invalid spec errors (displayed as alert banner):**
  - "No content provided. Please upload a file, paste content, or fetch from a URL."
  - "Invalid JSON syntax: {parse error message}"
  - "Invalid YAML syntax: {parse error message}"
  - "Not a valid OpenAPI specification. Must be OpenAPI 3.0 or higher."
  - "Specification is missing required 'paths' field."
  - "Specification is missing required 'info' field."

#### F3.4: Loading State
- While creating project: button shows "Creating..." with spinner
- Disable all inputs during submission
- On error: re-enable everything

---

### F4: Project Detail Page (/projects/[id])

#### F4.1: Page Layout
- Header: project name (editable inline — click to edit, enter to save, escape to cancel), back arrow to dashboard
- Two-column layout on desktop: left 70% = endpoint table, right 30% = config panel
- Single column on mobile: config panel as collapsible section above table
- Tabs below header: "Endpoints" (default), "Preview", "History"

#### F4.2: Project Not Found
- If project ID doesn't exist or belongs to another user: show 404 page with "Project not found" message and "Back to Dashboard" link

---

### F5: Endpoint Explorer (Endpoints Tab)

#### F5.1: Summary Bar
- Shows: "X endpoints" total, "Y tools" / "Z resources" / "W templates" / "V excluded"
- Each count is a clickable filter (clicking "Y tools" filters table to show only tools)

#### F5.2: Endpoint Table
- Columns: Checkbox, Method, Path, Operation ID, Summary, Params, MCP Type
- **Method column:** Color-coded badge — GET=green (#22c55e), POST=blue (#3b82f6), PUT=amber (#f59e0b), PATCH=purple (#a855f7), DELETE=red (#ef4444)
- **Path column:** Monospace font, full path displayed
- **Operation ID:** If available from spec, else show "-" in muted text
- **Summary:** Truncated to 50 chars, full text on hover tooltip
- **Params:** Badge showing count (e.g., "3 params")
- **MCP Type:** Dropdown select with options: Tool, Resource, Resource Template, Exclude
  - Dropdown changes are saved immediately (auto-save with debounce 500ms)
  - Show brief green checkmark animation on save
  - On save failure: show red error indicator, revert dropdown, show toast "Failed to save"

#### F5.3: Default Mapping Rules (applied on project creation)
- GET without path parameters (e.g., /pets) → Resource
- GET with path parameters (e.g., /pets/{id}) → Resource Template
- POST, PUT, PATCH, DELETE → Tool
- Users can override any mapping via dropdown

#### F5.4: Bulk Actions
- "Select All" checkbox in header row (toggles all visible rows)
- Individual row checkboxes
- When 1+ rows selected, show bulk action bar: "Set as Tool" | "Set as Resource" | "Set as Template" | "Exclude" | "Reset to Default"
- Bulk actions affect only selected rows
- Show toast: "Updated X endpoints"
- Disable bulk buttons when 0 rows selected

#### F5.5: Search and Filter
- Search input: filters by path OR operation ID (substring, case-insensitive)
- Method filter dropdown: All, GET, POST, PUT, PATCH, DELETE
- MCP Type filter dropdown: All, Tool, Resource, Resource Template, Excluded
- Filters combine with AND logic
- Show "No endpoints match filters" when no results
- Show active filter count badge on filter icon

#### F5.6: Table Sorting
- Clickable column headers for: Method, Path, Operation ID, MCP Type
- Toggle between ascending, descending, no sort
- Show sort indicator arrow

#### F5.7: Pagination
- If more than 20 endpoints, paginate with 20 per page
- Page selector at bottom: "Page 1 of 3" with prev/next buttons
- Show "Showing 1-20 of 45 endpoints"

---

### F6: Server Configuration (Side Panel)

#### F6.1: Transport Type
- Radio group: "stdio" (default), "SSE (Hono)", "StreamableHTTP"
- When SSE or StreamableHTTP selected, show Port input field

#### F6.2: Port
- Number input, visible only for SSE/StreamableHTTP
- Default: 3001
- Validation: must be integer between 1024 and 65535
- Error: "Port must be between 1024 and 65535"

#### F6.3: Authentication Method
- Select dropdown: "None" (default), "API Key", "Bearer Token", "Basic Auth"
- When auth is selected (not None), show info text:
  - API Key: "Your generated .env will include API_KEY variable"
  - Bearer Token: "Your generated .env will include BEARER_TOKEN variable"
  - Basic Auth: "Your generated .env will include USERNAME and PASSWORD variables"

#### F6.4: Server Metadata
- Server Name: text input, pre-filled from spec info.title (kebab-cased), editable. Max 50 chars.
- Server Version: text input, pre-filled from spec info.version, editable. Must match semver (x.y.z).
- Base URL: text input, pre-filled from spec servers[0].url, editable. Must be valid URL or empty.

#### F6.5: Auto-Save
- All config changes auto-save with 500ms debounce
- Show "Saving..." indicator, then "Saved" with checkmark
- On failure: show "Failed to save" in red

---

### F7: Code Preview (Preview Tab)

#### F7.1: Tabbed File View
- Tabs: "index.ts", "package.json", "tsconfig.json", ".env.example", "README.md"
- Default selected: index.ts
- Each tab shows syntax-highlighted code (TypeScript, JSON, Markdown respectively)
- Code area is scrollable with line numbers

#### F7.2: Copy Button
- Copy icon button in each tab header
- On click: copy file contents to clipboard
- Show toast: "Copied to clipboard"
- Button changes to checkmark for 2 seconds after copy

#### F7.3: Live Regeneration
- Code updates automatically when mappings or config change
- Show brief "Regenerating..." overlay during update

#### F7.4: File Size Indicator
- Show approximate file size next to each tab name (e.g., "index.ts (2.4 KB)")

---

### F8: Download

#### F8.1: Download Button
- "Download Project" prominent button on project detail page header
- On click: generate zip file in browser, trigger download
- Filename: `mcpforge-{project-name-kebab}.zip`
- Show loading spinner while generating: "Generating project..."

#### F8.2: Zip Contents
- `src/index.ts` — MCP server with all tools/resources/templates
- `package.json` — with correct dependencies for selected transport
- `tsconfig.json` — TypeScript config
- `.env.example` — with auth variable placeholders (if auth selected)
- `README.md` — auto-generated usage instructions

#### F8.3: Empty State
- If all endpoints are "Excluded": show warning "All endpoints are excluded. Your generated server will have no tools or resources. Are you sure?" with "Download Anyway" and "Cancel" buttons

---

### F9: Version History (History Tab)

#### F9.1: Version List
- Each download creates a version snapshot
- List shows: version number (v1, v2, v3...), timestamp, summary (e.g., "5 tools, 3 resources, stdio")
- Most recent version at top
- If no versions: show "No versions yet. Download your project to create the first version."

#### F9.2: View Version
- Click on a version to see its config snapshot (read-only)
- Shows: endpoint mapping summary, server config at that point in time

---

### F10: Navigation & Layout

#### F10.1: Navbar
- Logo "MCPForge" (left) — links to /dashboard
- Nav links: "Dashboard" (only when logged in)
- Right side: 
  - Logged out: "Sign In" and "Sign Up" buttons
  - Logged in: User avatar/icon + name dropdown with "Settings" (disabled/placeholder) and "Logout"

#### F10.2: Loading States
- Page-level: show skeleton components matching page layout during data fetch
- Button-level: show spinner icon and disable button during async actions
- Table-level: show row skeletons while loading

#### F10.3: Error Pages
- 404: "Page not found" with link to dashboard
- 500: "Something went wrong" with retry button

#### F10.4: Toast Notifications
- Success: green toast (auto-dismiss after 4 seconds)
- Error: red toast (persist until dismissed)
- Position: bottom-right

#### F10.5: Responsive Behavior
- Desktop (1024px+): full two-column layout
- Tablet (768px-1023px): single column, config panel collapsible
- Mobile (below 768px): hamburger nav, stacked cards, horizontal-scroll table

---

## API Specifications

### Authentication API
```
POST /api/auth/signup
  Body: { name?: string, email: string, password: string }
  Success 201: { user: { id, email, name } }
  Error 400: { error: "Validation failed", details: { field: "message" } }
  Error 409: { error: "Email already registered" }

POST /api/auth/[...nextauth]
  NextAuth handlers (signin, signout, session, csrf)
```

### Projects API
```
GET /api/projects
  Auth: Required
  Success 200: { projects: [{ id, name, specTitle, pathCount, createdAt, updatedAt }] }
  Error 401: { error: "Unauthorized" }

POST /api/projects
  Auth: Required
  Body: { name: string, specContent: string, specFormat: "json"|"yaml" }
  Success 201: { project: { id, name, pathCount, ... } }
  Error 400: { error: "Invalid OpenAPI specification", details: "..." }
  Error 400: { error: "Validation failed", details: { field: "message" } }

GET /api/projects/[id]
  Auth: Required (owner only)
  Success 200: { project: { id, name, specContent, mappings, config, ... } }
  Error 404: { error: "Project not found" }
  Error 403: { error: "Access denied" }

DELETE /api/projects/[id]
  Auth: Required (owner only)
  Success 200: { message: "Project deleted" }
  Error 404: { error: "Project not found" }
  Error 403: { error: "Access denied" }

PATCH /api/projects/[id]
  Auth: Required (owner only)
  Body: { name: string }
  Success 200: { project: { id, name, updatedAt } }
  Error 400: { error: "Validation failed" }
```

### Endpoint Mappings API
```
GET /api/projects/[id]/mappings
  Auth: Required (owner only)
  Query: ?search=string&method=GET&mcpType=tool&page=1&limit=20
  Success 200: { mappings: [...], total: number, page: number, totalPages: number }

PATCH /api/projects/[id]/mappings/[mappingId]
  Auth: Required (owner only)
  Body: { mcpType: "tool"|"resource"|"resource_template"|"exclude" }
  Success 200: { mapping: { id, mcpType, ... } }
  Error 400: { error: "Invalid MCP type" }

PATCH /api/projects/[id]/mappings/bulk
  Auth: Required (owner only)
  Body: { mappingIds: string[], mcpType: string }
  Success 200: { updated: number }
  Error 400: { error: "No mappings selected" }
```

### Server Config API
```
GET /api/projects/[id]/config
  Auth: Required (owner only)
  Success 200: { config: { transport, authMethod, serverName, serverVersion, baseUrl, port } }

PUT /api/projects/[id]/config
  Auth: Required (owner only)
  Body: { transport: string, authMethod: string, serverName: string, serverVersion: string, baseUrl: string, port: number }
  Success 200: { config: { ... } }
  Error 400: { error: "Validation failed", details: { port: "Must be between 1024 and 65535" } }
```

### Download API
```
POST /api/projects/[id]/generate
  Auth: Required (owner only)
  Success 200: { version: { id, versionNumber, createdAt } }
  — Also creates ProjectVersion snapshot

GET /api/projects/[id]/download
  Auth: Required (owner only)
  Success 200: application/zip binary
  Error 404: { error: "Project not found" }
```

### Version History API
```
GET /api/projects/[id]/versions
  Auth: Required (owner only)
  Success 200: { versions: [{ id, versionNumber, configSnapshot, createdAt }] }
```

---

## Non-Functional Requirements

### Security
- Passwords hashed with bcrypt (12 rounds)
- Session tokens are HTTP-only cookies
- CSRF protection via NextAuth
- All API routes validate authentication and ownership
- User A cannot access User B's projects (test with two different accounts)
- SQL injection prevention via Prisma parameterized queries
- XSS prevention: all user content rendered with proper escaping

### Input Validation (applies to all forms)
- Trim whitespace from all text inputs before processing
- Reject empty required fields
- Enforce maximum lengths on all text inputs
- Validate email format with regex
- Validate URL format for fetch input
- Sanitize file uploads (accept only allowed extensions)
- Validate JSON/YAML before parsing
- Validate port numbers are within valid range

### Error Handling
- All API routes wrapped in try/catch
- Unexpected errors return 500: { error: "Internal server error" }
- Database connection errors show user-friendly message
- Network timeout errors (URL fetch) show retry option
- File read errors show clear message

### Performance
- Spec parsing completes within 3 seconds for specs up to 500 endpoints
- Page load under 2 seconds on desktop
- Debounced auto-save (500ms) prevents excessive API calls
- Paginated endpoints table (20 per page) for large specs

### Accessibility
- All form inputs have associated <label> elements
- Color-coded badges also have text labels (not color-only information)
- Tab navigation works for all interactive elements (inputs, buttons, dropdowns, links)
- Focus indicators visible on all focusable elements
- Error messages associated with form fields via aria-describedby
- Dialog modals trap focus and close with Escape key
- Toast notifications are aria-live="polite"

### Responsive Design
- Desktop (1024px+): Two-column layout, full table
- Tablet (768-1023px): Single column, collapsible config, full table
- Mobile (below 768px): Hamburger menu, stacked cards, horizontal-scroll table

---

## User Journeys

### Journey 1: New User Registration and First Project
1. Visit / → see landing page → click "Get Started"
2. On /auth/signup → fill name, email, password, confirm password → click "Create Account"
3. Redirected to /dashboard → see empty state → click "Create Project"
4. On /projects/new → enter project name "Petstore API" → upload petstore.json → click "Create Project"
5. Redirected to /projects/[id] → see endpoint table with 10 endpoints auto-mapped
6. Review mappings → change one endpoint from Tool to Resource
7. Adjust config → change transport to SSE, set port to 4000
8. Switch to Preview tab → verify index.ts shows correct tools/resources
9. Click "Download Project" → zip downloads to computer
10. Open zip → verify contains src/index.ts, package.json, .env.example, etc.

### Journey 2: Returning User Managing Projects
1. Visit / → redirected to /dashboard (already logged in)
2. See existing projects → search for "pet" → find Petstore project
3. Click on Petstore project → make changes → download new version
4. Go back to dashboard → delete an old project → confirm deletion
5. Logout → verify redirected to signin → try accessing /dashboard → redirected to signin

### Journey 3: Error Recovery
1. On /projects/new → try creating with empty name → see validation error
2. Upload invalid file (.txt) → see file type error
3. Paste invalid JSON → click create → see parsing error
4. Fix JSON → click create → project created successfully
5. On project detail → change port to 999 → see validation error → fix to 3001

### Journey 4: Multi-User Isolation  
1. User A creates a project "Secret API"
2. User B logs in → cannot see User A's project on dashboard
3. User B tries to access /projects/{userA-project-id} → sees 404
4. User B's API call to /api/projects/{userA-project-id} → gets 403
