export interface MappingData {
  method: string;
  path: string;
  operationId: string | null;
  summary: string | null;
  description: string | null;
  paramsCount: number;
  hasBody: boolean;
  mcpType: string; // "tool" | "resource" | "resource_template" | "exclude"
}

export interface ConfigData {
  transport: string; // "stdio" | "sse" | "streamable-http"
  authMethod: string; // "none" | "api-key" | "bearer" | "basic"
  serverName: string;
  serverVersion: string;
  baseUrl: string;
  port: number;
}

export interface GeneratedFiles {
  "src/index.ts": string;
  "package.json": string;
  "tsconfig.json": string;
  ".env.example": string;
  "README.md": string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Derive a safe function/tool name from a mapping.
 * Prefer operationId; fall back to method_path slug.
 */
function toIdentifier(mapping: MappingData): string {
  if (mapping.operationId) {
    return mapping.operationId.replace(/[^a-zA-Z0-9_]/g, "_");
  }
  const slug = mapping.path
    .replace(/[{}]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  return `${mapping.method.toLowerCase()}_${slug}`;
}

/**
 * Convert an OpenAPI path like /pets/{petId} to a URL-building expression.
 */
function buildUrlExpression(path: string, baseUrlVar: string): string {
  // Replace {param} with ${encodeURIComponent(param)} for safe URL building
  const templated = path.replace(/\{([^}]+)\}/g, "${encodeURIComponent($1)}");
  return "`${" + baseUrlVar + "}" + templated + "`";
}

/**
 * Extract path parameter names from an OpenAPI path.
 */
function extractPathParams(path: string): string[] {
  const matches = path.match(/\{([^}]+)\}/g);
  if (!matches) return [];
  return matches.map((m) => m.slice(1, -1));
}

/**
 * Build the description string for a tool/resource.
 */
function descriptionFor(mapping: MappingData): string {
  if (mapping.summary) return mapping.summary;
  if (mapping.description) {
    // Truncate long descriptions
    return mapping.description.length > 120
      ? mapping.description.slice(0, 117) + "..."
      : mapping.description;
  }
  return `${mapping.method} ${mapping.path}`;
}

// ---------------------------------------------------------------------------
// Auth helpers generation
// ---------------------------------------------------------------------------

function generateAuthHeaders(authMethod: string): string {
  switch (authMethod) {
    case "api-key":
      return `
function getAuthHeaders(): Record<string, string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return {};
  return { "X-API-Key": apiKey };
}`;
    case "bearer":
      return `
function getAuthHeaders(): Record<string, string> {
  const token = process.env.BEARER_TOKEN;
  if (!token) return {};
  return { Authorization: \`Bearer \${token}\` };
}`;
    case "basic":
      return `
function getAuthHeaders(): Record<string, string> {
  const username = process.env.BASIC_USERNAME;
  const password = process.env.BASIC_PASSWORD;
  if (!username || !password) return {};
  const encoded = Buffer.from(\`\${username}:\${password}\`).toString("base64");
  return { Authorization: \`Basic \${encoded}\` };
}`;
    default:
      return `
function getAuthHeaders(): Record<string, string> {
  return {};
}`;
  }
}

// ---------------------------------------------------------------------------
// Tool generation
// ---------------------------------------------------------------------------

function generateToolRegistration(mapping: MappingData): string {
  const name = toIdentifier(mapping);
  const desc = descriptionFor(mapping);
  const pathParams = extractPathParams(mapping.path);

  // Build Zod shape for the tool parameters
  const shapeEntries: string[] = [];
  for (const p of pathParams) {
    shapeEntries.push(`    ${p}: z.string().describe("Path parameter: ${p}")`);
  }
  if (mapping.hasBody) {
    shapeEntries.push(
      `    body: z.record(z.unknown()).describe("Request body")`
    );
  }
  // Add optional query string param bucket
  shapeEntries.push(
    `    queryParams: z.record(z.string()).optional().describe("Optional query parameters")`
  );

  const shapeStr =
    shapeEntries.length > 0
      ? `{\n${shapeEntries.join(",\n")}\n  }`
      : "{}";

  const urlExpr = buildUrlExpression(mapping.path, "BASE_URL");

  const fetchOptions: string[] = [];
  fetchOptions.push(`      method: "${mapping.method}"`);
  fetchOptions.push(
    `      headers: { "Content-Type": "application/json", ...getAuthHeaders() }`
  );
  if (mapping.hasBody) {
    fetchOptions.push(`      body: JSON.stringify(params.body)`);
  }

  const queryBuild = `
      const qs = params.queryParams
        ? "?" + new URLSearchParams(params.queryParams).toString()
        : "";`;

  // Destructure path params if any
  const destructure =
    pathParams.length > 0
      ? `      const { ${pathParams.join(", ")} } = params;\n`
      : "";

  return `
  server.tool(
    "${name}",
    "${escStr(desc)}",
    ${shapeStr},
    async (params) => {
      try {
${destructure}${queryBuild}
        const url = ${urlExpr} + qs;
        const res = await fetch(url, {
${fetchOptions.join(",\n")}
        });
        const data = await res.text();
        if (!res.ok) {
          return { content: [{ type: "text", text: \`API Error (HTTP \${res.status}): \${data}\` }], isError: true };
        }
        return { content: [{ type: "text", text: data }] };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        return { content: [{ type: "text", text: \`Network error: \${message}\` }], isError: true };
      }
    }
  );`;
}

// ---------------------------------------------------------------------------
// Resource generation
// ---------------------------------------------------------------------------

function generateResourceRegistration(mapping: MappingData): string {
  const name = toIdentifier(mapping);
  const desc = descriptionFor(mapping);
  const uri = `${mapping.method.toLowerCase()}:/${name}`;

  return `
  server.resource(
    "${name}",
    "${uri}",
    { description: "${escStr(desc)}" },
    async (uri) => {
      const url = \`\${BASE_URL}${mapping.path}\`;
      const res = await fetch(url, {
        method: "${mapping.method}",
        headers: { ...getAuthHeaders() },
      });
      const data = await res.text();
      return { contents: [{ uri: uri.href, text: data }] };
    }
  );`;
}

// ---------------------------------------------------------------------------
// Resource template generation
// ---------------------------------------------------------------------------

function generateResourceTemplateRegistration(mapping: MappingData): string {
  const name = toIdentifier(mapping);
  const desc = descriptionFor(mapping);
  const pathParams = extractPathParams(mapping.path);

  // Build URI template: /pets/{petId} -> get-pets:/pets/{petId}
  const uriTemplate = `${mapping.method.toLowerCase()}:/${name}/${pathParams.map((p) => `{${p}}`).join("/")}`;
  const urlExpr = buildUrlExpression(mapping.path, "BASE_URL");

  const destructure =
    pathParams.length > 0
      ? `      const { ${pathParams.join(", ")} } = params;\n`
      : "";

  return `
  server.resource(
    "${name}",
    new ResourceTemplate("${uriTemplate}", { list: undefined }),
    { description: "${escStr(desc)}" },
    async (uri, params) => {
${destructure}      const url = ${urlExpr};
      const res = await fetch(url, {
        method: "${mapping.method}",
        headers: { ...getAuthHeaders() },
      });
      const data = await res.text();
      return { contents: [{ uri: uri.href, text: data }] };
    }
  );`;
}

// ---------------------------------------------------------------------------
// Index.ts generation
// ---------------------------------------------------------------------------

function generateIndexTs(
  mappings: MappingData[],
  config: ConfigData
): string {
  const activeMappings = mappings.filter((m) => m.mcpType !== "exclude");
  const tools = activeMappings.filter((m) => m.mcpType === "tool");
  const resources = activeMappings.filter((m) => m.mcpType === "resource");
  const resourceTemplates = activeMappings.filter(
    (m) => m.mcpType === "resource_template"
  );

  const needsResourceTemplate = resourceTemplates.length > 0;

  // Determine transport imports
  let transportImport: string;
  let transportSetup: string;

  switch (config.transport) {
    case "sse":
      transportImport = `import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createServer, IncomingMessage, ServerResponse } from "http";`;
      transportSetup = `
  const PORT = parseInt(process.env.PORT || "${config.port}");
  const transports: Record<string, SSEServerTransport> = {};

  const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url || "/", \`http://localhost:\${PORT}\`);

    if (req.method === "GET" && url.pathname === "/sse") {
      console.error("New SSE connection");
      const transport = new SSEServerTransport("/messages", res);
      transports[transport.sessionId] = transport;
      res.on("close", () => { delete transports[transport.sessionId]; });
      await server.connect(transport);
    } else if (req.method === "POST" && url.pathname === "/messages") {
      const sessionId = url.searchParams.get("sessionId");
      if (sessionId && transports[sessionId]) {
        await transports[sessionId].handlePostMessage(req, res);
      } else {
        res.writeHead(400);
        res.end("Invalid session");
      }
    } else if (req.method === "GET" && url.pathname === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  httpServer.listen(PORT, () => {
    console.log(\`MCP server (SSE) listening on http://localhost:\${PORT}/sse\`);
  });`;
      break;

    case "streamable-http":
      transportImport = `import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { randomUUID } from "crypto";`;
      transportSetup = `
  const PORT = parseInt(process.env.PORT || "${config.port}");
  const transports: Record<string, StreamableHTTPServerTransport> = {};

  const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "POST" && req.url === "/mcp") {
      // Read request body
      const chunks: Buffer[] = [];
      for await (const chunk of req) { chunks.push(chunk as Buffer); }
      const body = JSON.parse(Buffer.concat(chunks).toString());

      const sessionId = req.headers["mcp-session-id"] as string | undefined;

      // Existing session
      if (sessionId && transports[sessionId]) {
        await transports[sessionId].handleRequest(req, res, body);
        return;
      }

      // New session (initialize request)
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
      });
      transport.onclose = () => {
        if (transport.sessionId) delete transports[transport.sessionId];
      };
      await server.connect(transport);
      await transport.handleRequest(req, res, body);
      if (transport.sessionId) {
        transports[transport.sessionId] = transport;
      }
    } else if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok" }));
    } else {
      res.writeHead(405);
      res.end("Method Not Allowed");
    }
  });

  httpServer.listen(PORT, () => {
    console.log(\`MCP server (Streamable HTTP) listening on http://localhost:\${PORT}/mcp\`);
  });`;
      break;

    default: // stdio
      transportImport = `import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";`;
      transportSetup = `
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server running on stdio");`;
      break;
  }

  const resourceTemplateImport = needsResourceTemplate
    ? `\nimport { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";`
    : "";

  const sections: string[] = [];

  if (tools.length > 0) {
    sections.push(`  // --- Tools ---`);
    for (const t of tools) {
      sections.push(generateToolRegistration(t));
    }
  }

  if (resources.length > 0) {
    sections.push(`\n  // --- Resources ---`);
    for (const r of resources) {
      sections.push(generateResourceRegistration(r));
    }
  }

  if (resourceTemplates.length > 0) {
    sections.push(`\n  // --- Resource Templates ---`);
    for (const rt of resourceTemplates) {
      sections.push(generateResourceTemplateRegistration(rt));
    }
  }

  return `import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";${resourceTemplateImport}
${transportImport}
import { z } from "zod";

const BASE_URL = process.env.BASE_URL || "${escStr(config.baseUrl)}";
${generateAuthHeaders(config.authMethod)}

async function main() {
  const server = new McpServer({
    name: "${escStr(config.serverName)}",
    version: "${escStr(config.serverVersion)}",
  });

${sections.join("\n")}

  // --- Connect Transport ---
${transportSetup}
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
`;
}

// ---------------------------------------------------------------------------
// package.json generation
// ---------------------------------------------------------------------------

function generatePackageJson(config: ConfigData): string {
  const deps: Record<string, string> = {
    "@modelcontextprotocol/sdk": "^1.12.1",
    dotenv: "^16.4.7",
    zod: "^3.24.2",
  };

  const scripts: Record<string, string> = {
    build: "tsc",
    start: "node dist/index.js",
    dev: "npx tsx src/index.ts",
  };

  if (config.transport === "sse" || config.transport === "streamable-http") {
    // Node http module is built-in, no extra dep needed
  }

  const pkg = {
    name: config.serverName,
    version: config.serverVersion,
    type: "module",
    description: `MCP server generated by MCPForge for ${config.serverName}`,
    main: "dist/index.js",
    scripts,
    dependencies: deps,
    devDependencies: {
      "@types/node": "^22.15.0",
      typescript: "^5.8.3",
      tsx: "^4.19.4",
    },
  };

  return JSON.stringify(pkg, null, 2) + "\n";
}

// ---------------------------------------------------------------------------
// tsconfig.json generation
// ---------------------------------------------------------------------------

function generateTsConfig(): string {
  const config = {
    compilerOptions: {
      target: "ES2022",
      module: "Node16",
      moduleResolution: "Node16",
      outDir: "./dist",
      rootDir: "./src",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist"],
  };

  return JSON.stringify(config, null, 2) + "\n";
}

// ---------------------------------------------------------------------------
// .env.example generation
// ---------------------------------------------------------------------------

function generateEnvExample(config: ConfigData): string {
  const lines: string[] = [
    "# Base URL of the upstream API",
    `BASE_URL=${config.baseUrl}`,
    "",
  ];

  if (config.transport !== "stdio") {
    lines.push("# Server port");
    lines.push(`PORT=${config.port}`);
    lines.push("");
  }

  switch (config.authMethod) {
    case "api-key":
      lines.push("# API Key for upstream API");
      lines.push("API_KEY=your-api-key-here");
      break;
    case "bearer":
      lines.push("# Bearer token for upstream API");
      lines.push("BEARER_TOKEN=your-token-here");
      break;
    case "basic":
      lines.push("# Basic auth credentials for upstream API");
      lines.push("BASIC_USERNAME=your-username");
      lines.push("BASIC_PASSWORD=your-password");
      break;
  }

  lines.push("");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// README.md generation
// ---------------------------------------------------------------------------

function generateReadme(
  mappings: MappingData[],
  config: ConfigData
): string {
  const activeMappings = mappings.filter((m) => m.mcpType !== "exclude");
  const tools = activeMappings.filter((m) => m.mcpType === "tool");
  const resources = activeMappings.filter((m) => m.mcpType === "resource");
  const resourceTemplates = activeMappings.filter(
    (m) => m.mcpType === "resource_template"
  );

  let connectInstructions = "";
  switch (config.transport) {
    case "stdio":
      connectInstructions = `### Claude Desktop Configuration

Add this to your Claude Desktop config file:

\`\`\`json
{
  "mcpServers": {
    "${config.serverName}": {
      "command": "node",
      "args": ["${config.serverName}/dist/index.js"],
      "env": {
        "BASE_URL": "${config.baseUrl}"
      }
    }
  }
}
\`\`\``;
      break;
    case "sse":
      connectInstructions = `### Connecting

Start the server and connect your MCP client to:

\`\`\`
http://localhost:${config.port}/sse
\`\`\``;
      break;
    case "streamable-http":
      connectInstructions = `### Connecting

Start the server and connect your MCP client to:

\`\`\`
http://localhost:${config.port}/mcp
\`\`\``;
      break;
  }

  const toolList =
    tools.length > 0
      ? tools.map((t) => `- \`${toIdentifier(t)}\` — ${descriptionFor(t)}`).join("\n")
      : "_None_";

  const resourceList =
    resources.length > 0
      ? resources.map((r) => `- \`${toIdentifier(r)}\` — ${descriptionFor(r)}`).join("\n")
      : "_None_";

  const templateList =
    resourceTemplates.length > 0
      ? resourceTemplates
          .map((rt) => `- \`${toIdentifier(rt)}\` — ${descriptionFor(rt)}`)
          .join("\n")
      : "_None_";

  return `# ${config.serverName}

> Auto-generated MCP server by [MCPForge](https://mcpforge.app)

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Copy and edit environment variables
cp .env.example .env

# Build
npm run build

# Run
npm start
\`\`\`

For development with auto-reload:

\`\`\`bash
npm run dev
\`\`\`

${connectInstructions}

## Capabilities

### Tools (${tools.length})
${toolList}

### Resources (${resources.length})
${resourceList}

### Resource Templates (${resourceTemplates.length})
${templateList}

## Transport

**${config.transport}**${config.transport !== "stdio" ? ` on port ${config.port}` : ""}

## Authentication

${config.authMethod === "none" ? "No authentication configured." : `Using **${config.authMethod}** authentication. Set the appropriate environment variables in \`.env\`.`}
`;
}

// ---------------------------------------------------------------------------
// Escape helper
// ---------------------------------------------------------------------------

function escStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function generateMcpServer(
  mappings: MappingData[],
  config: ConfigData
): GeneratedFiles {
  return {
    "src/index.ts": generateIndexTs(mappings, config),
    "package.json": generatePackageJson(config),
    "tsconfig.json": generateTsConfig(),
    ".env.example": generateEnvExample(config),
    "README.md": generateReadme(mappings, config),
  };
}
