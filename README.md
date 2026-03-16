MCPForge -- Convert OpenAPI specs into MCP servers with a visual interface

## What It Does

- **Import any OpenAPI spec** -- paste JSON, paste YAML, or fetch from a URL to instantly parse and load your API definition
- **Visual endpoint explorer** -- browse every endpoint with HTTP method badges, paths, and operationIds in a searchable, filterable table
- **Assign MCP types visually** -- classify each endpoint as a Tool, Resource, Resource Template, or Excluded with a single dropdown click
- **Production-grade MCP server generation** -- generates servers using the low-level Server API with full JSON Schema inputSchemas, per-tool security, runtime validation (json-schema-to-zod), axios HTTP, and all 3 transports (stdio/SSE/Streamable HTTP)
- **One-click download** -- export a ready-to-run MCP server package as a downloadable ZIP
- **Multi-project dashboard** -- manage multiple OpenAPI-to-MCP conversion projects from a single authenticated workspace

## The Problem

Converting OpenAPI specifications into MCP (Model Context Protocol) servers today requires manual work with CLI tools and hand-written configuration files. There is no visual tool that lets you import an OpenAPI spec, see all your endpoints at a glance, classify them into MCP types, and generate a working MCP server -- all from the browser. MCPForge fills that gap.

## Tech Stack

| Layer        | Technology                                      |
|--------------|------------------------------------------------|
| Framework    | Next.js 16 (App Router)                        |
| UI           | React 19, Tailwind CSS v4, shadcn/ui           |
| Language     | TypeScript                                      |
| Database     | Prisma ORM + SQLite                             |
| Auth         | Auth.js v5 (next-auth)                          |
| Parsing      | @apidevtools/swagger-parser                     |
| Export       | JSZip (ZIP generation)                          |
| Code Display | react-syntax-highlighter                        |

## How to Run

```bash
# 1. Clone the repository
git clone https://github.com/Mrutyunjay-Patil/mcpforge.git
cd mcpforge-app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your AUTH_SECRET and database URL

# 4. Initialize the database
npx prisma generate
npx prisma db push

# 5. Seed the database (optional -- creates a demo user)
npx prisma db seed

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

All tests were generated and executed by [TestSprite MCP](https://www.testsprite.com), an automated testing tool that creates end-to-end browser and API tests from a product requirements document.

- **Frontend: 25/27 passed (93%)** -- auth flows, landing page, dashboard, project CRUD, endpoint table, filtering, search, delete with confirmation
- **Backend: 4/10 passed (40%)** -- signup validation, unauthorized access (remaining failures are auth cookie issues inherent to NextAuth + raw HTTP tests)
- **69 test files** in the repo across multiple TestSprite runs
- All test scripts in [`testsprite_tests/`](./testsprite_tests/) (frontend) and [`testsprite_tests/backend/`](./testsprite_tests/backend/) (API)

## Project Structure

```
mcpforge-app/
  src/
    app/           # Next.js App Router pages and API routes
    components/    # Reusable React components (shadcn/ui based)
    lib/           # Shared utilities, auth config, Prisma client
    types/         # TypeScript type definitions
  prisma/          # Prisma schema and migrations
  public/          # Static assets
  testsprite_tests/ # TestSprite-generated E2E test scripts and reports
```
