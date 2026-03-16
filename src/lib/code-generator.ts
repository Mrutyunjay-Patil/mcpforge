// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface ParsedParameter {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  type: string;
  required: boolean;
  description: string | null;
  schema: Record<string, unknown> | null;
}

export interface ParsedRequestBody {
  contentType: string;
  required: boolean;
  description: string | null;
  schema: Record<string, unknown> | null;
}

export interface MappingData {
  method: string;
  path: string;
  operationId: string | null;
  summary: string | null;
  description: string | null;
  paramsCount: number;
  hasBody: boolean;
  mcpType: string; // "tool" | "resource" | "resource_template" | "exclude"
  parameters: ParsedParameter[];
  requestBody: ParsedRequestBody | null;
  securityRequirements: Array<Record<string, string[]>> | null;
}

export interface ConfigData {
  transport: string; // "stdio" | "sse" | "streamable-http"
  authMethod: string; // "none" | "api-key" | "bearer" | "basic"
  serverName: string;
  serverVersion: string;
  baseUrl: string;
  port: number;
  securitySchemes: Record<string, unknown>; // From OpenAPI spec
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
 * Derive a safe tool name from a mapping.
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
 * Build the description string for a tool.
 */
function descriptionFor(mapping: MappingData): string {
  if (mapping.summary) return mapping.summary;
  if (mapping.description) {
    return mapping.description.length > 120
      ? mapping.description.slice(0, 117) + "..."
      : mapping.description;
  }
  return `${mapping.method} ${mapping.path}`;
}

/**
 * Escape a string for safe embedding inside a JS double-quoted string literal.
 */
function escStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

// ---------------------------------------------------------------------------
// Build JSON Schema inputSchema for a tool from its parameters + requestBody
// ---------------------------------------------------------------------------

interface ToolSchemaResult {
  inputSchema: Record<string, unknown>;
  executionParameters: Array<{ name: string; in: string }>;
  requestBodyContentType: string | undefined;
}

function buildToolSchema(mapping: MappingData): ToolSchemaResult {
  const properties: Record<string, Record<string, unknown>> = {};
  const required: string[] = [];
  const executionParameters: Array<{ name: string; in: string }> = [];

  for (const param of mapping.parameters) {
    const prop: Record<string, unknown> = {};

    if (param.schema && Object.keys(param.schema).length > 0) {
      // Use the raw schema but ensure it has a type
      Object.assign(prop, param.schema);
    } else {
      // Infer from type field
      prop.type = param.type === "integer" ? "number" : param.type || "string";
    }

    if (param.description) {
      prop.description = param.description;
    }

    properties[param.name] = prop;
    executionParameters.push({ name: param.name, in: param.in });

    if (param.required) {
      required.push(param.name);
    }
  }

  // Add request body as a "requestBody" property
  let requestBodyContentType: string | undefined;
  if (mapping.requestBody) {
    requestBodyContentType = mapping.requestBody.contentType;
    const bodyProp: Record<string, unknown> = {};

    if (mapping.requestBody.schema && Object.keys(mapping.requestBody.schema).length > 0) {
      Object.assign(bodyProp, mapping.requestBody.schema);
    } else {
      bodyProp.type = "object";
    }

    if (mapping.requestBody.description) {
      bodyProp.description = mapping.requestBody.description;
    }

    properties["requestBody"] = bodyProp;

    if (mapping.requestBody.required) {
      required.push("requestBody");
    }
  }

  const inputSchema: Record<string, unknown> = {
    type: "object",
    properties,
  };

  if (required.length > 0) {
    inputSchema.required = required;
  }

  return { inputSchema, executionParameters, requestBodyContentType };
}

// ---------------------------------------------------------------------------
// Generate toolDefinitionMap entries
// ---------------------------------------------------------------------------

function generateToolMapEntries(mappings: MappingData[]): string {
  const entries: string[] = [];

  for (const mapping of mappings) {
    const name = toIdentifier(mapping);
    const desc = descriptionFor(mapping);
    const { inputSchema, executionParameters, requestBodyContentType } =
      buildToolSchema(mapping);

    const secReqs = mapping.securityRequirements
      ? JSON.stringify(mapping.securityRequirements)
      : "[]";

    entries.push(
      `  ["${escStr(name)}", {
    name: "${escStr(name)}",
    description: "${escStr(desc)}",
    inputSchema: ${JSON.stringify(inputSchema)},
    method: "${mapping.method.toLowerCase()}",
    pathTemplate: "${escStr(mapping.path)}",
    executionParameters: ${JSON.stringify(executionParameters)},
    requestBodyContentType: ${requestBodyContentType ? `"${escStr(requestBodyContentType)}"` : "undefined"},
    securityRequirements: ${secReqs},
  }]`
    );
  }

  return entries.join(",\n");
}

// ---------------------------------------------------------------------------
// Transport code generation
// ---------------------------------------------------------------------------

interface TransportCode {
  imports: string;
  setup: string;
}

function generateTransportCode(config: ConfigData): TransportCode {
  switch (config.transport) {
    case "sse":
      return {
        imports: `import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createServer, type IncomingMessage, type ServerResponse } from "http";`,
        setup: `  const PORT = parseInt(process.env.PORT || "${config.port}");
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
  });`,
      };

    case "streamable-http":
      return {
        imports: `import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer, type IncomingMessage, type ServerResponse } from "http";
import { randomUUID } from "crypto";`,
        setup: `  const PORT = parseInt(process.env.PORT || "${config.port}");
  const transports: Record<string, StreamableHTTPServerTransport> = {};

  const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "POST" && req.url === "/mcp") {
      const chunks: Buffer[] = [];
      for await (const chunk of req) { chunks.push(chunk as Buffer); }
      const body = JSON.parse(Buffer.concat(chunks).toString());

      const sessionId = req.headers["mcp-session-id"] as string | undefined;

      if (sessionId && transports[sessionId]) {
        await transports[sessionId].handleRequest(req, res, body);
        return;
      }

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
  });`,
      };

    default: // stdio
      return {
        imports: `import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";`,
        setup: `  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server running on stdio");`,
      };
  }
}

// ---------------------------------------------------------------------------
// Index.ts generation (low-level Server API)
// ---------------------------------------------------------------------------

function generateIndexTs(
  mappings: MappingData[],
  config: ConfigData
): string {
  // Convert everything to tools (resources and resource_templates become tools too)
  const activeMappings = mappings.filter((m) => m.mcpType !== "exclude");
  const transport = generateTransportCode(config);

  const toolMapEntries = generateToolMapEntries(activeMappings);
  const securitySchemesJson = JSON.stringify(config.securitySchemes || {});

  return `#!/usr/bin/env node
import dotenv from 'dotenv';
dotenv.config();

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
${transport.imports}
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
  type CallToolResult,
  type CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";

import { z, ZodError } from 'zod';
import { jsonSchemaToZod } from 'json-schema-to-zod';
import axios, { type AxiosRequestConfig, type AxiosError } from 'axios';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type JsonObject = Record<string, any>;

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: any;
  method: string;
  pathTemplate: string;
  executionParameters: { name: string; in: string }[];
  requestBodyContentType?: string;
  securityRequirements: any[];
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const SERVER_NAME = "${escStr(config.serverName)}";
const SERVER_VERSION = "${escStr(config.serverVersion)}";
const API_BASE_URL = process.env.API_BASE_URL || "${escStr(config.baseUrl)}";

// ---------------------------------------------------------------------------
// Server instance
// ---------------------------------------------------------------------------

const server = new Server(
  { name: SERVER_NAME, version: SERVER_VERSION },
  { capabilities: { tools: {} } }
);

// ---------------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------------

const toolDefinitionMap: Map<string, McpToolDefinition> = new Map([
${toolMapEntries}
]);

// ---------------------------------------------------------------------------
// Security schemes (from OpenAPI spec)
// ---------------------------------------------------------------------------

const securitySchemes: Record<string, any> = ${securitySchemesJson};

// ---------------------------------------------------------------------------
// Request handlers
// ---------------------------------------------------------------------------

server.setRequestHandler(ListToolsRequestSchema, async () => {
  const toolsForClient: Tool[] = Array.from(toolDefinitionMap.values()).map(def => ({
    name: def.name,
    description: def.description,
    inputSchema: def.inputSchema,
  }));
  return { tools: toolsForClient };
});

server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest): Promise<CallToolResult> => {
  const { name: toolName, arguments: toolArgs } = request.params;
  const toolDefinition = toolDefinitionMap.get(toolName);
  if (!toolDefinition) {
    return { content: [{ type: "text", text: \`Error: Unknown tool: \${toolName}\` }] };
  }
  return await executeApiTool(toolName, toolDefinition, toolArgs ?? {}, securitySchemes);
});

// ---------------------------------------------------------------------------
// Zod schema helper
// ---------------------------------------------------------------------------

function getZodSchemaFromJsonSchema(jsonSchema: any): z.ZodTypeAny | null {
  try {
    if (!jsonSchema || typeof jsonSchema !== 'object') return null;
    const zodSchemaCode = jsonSchemaToZod(jsonSchema, { module: "none" });
    // jsonSchemaToZod returns code like: z.object({...})
    // We evaluate it with z in scope
    const fn = new Function('z', \`return \${zodSchemaCode}\`);
    return fn(z) as z.ZodTypeAny;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Core execution function
// ---------------------------------------------------------------------------

async function executeApiTool(
  toolName: string,
  toolDef: McpToolDefinition,
  args: JsonObject,
  schemes: Record<string, any>,
): Promise<CallToolResult> {
  try {
    // 1. Validate arguments with json-schema-to-zod
    const zodSchema = getZodSchemaFromJsonSchema(toolDef.inputSchema);
    if (zodSchema) {
      try {
        zodSchema.parse(args);
      } catch (e) {
        if (e instanceof ZodError) {
          const issues = e.issues.map(i => \`  - \${i.path.join('.')}: \${i.message}\`).join('\\n');
          return {
            content: [{ type: "text", text: \`Validation error for tool "\${toolName}":\\n\${issues}\` }],
            isError: true,
          };
        }
      }
    }

    // 2. Build URL by replacing path parameters
    let urlPath = toolDef.pathTemplate;
    const queryParams: Record<string, string> = {};
    const headerParams: Record<string, string> = {};

    for (const param of toolDef.executionParameters) {
      const value = args[param.name];
      if (value === undefined || value === null) continue;

      switch (param.in) {
        case "path":
          urlPath = urlPath.replace(\`{\${param.name}}\`, encodeURIComponent(String(value)));
          break;
        case "query":
          queryParams[param.name] = String(value);
          break;
        case "header":
          headerParams[param.name] = String(value);
          break;
        case "cookie":
          // Cookies are handled via the Cookie header
          headerParams["Cookie"] = (headerParams["Cookie"] ? headerParams["Cookie"] + "; " : "") +
            \`\${param.name}=\${encodeURIComponent(String(value))}\`;
          break;
      }
    }

    const fullUrl = \`\${API_BASE_URL}\${urlPath}\`;

    // 3. Build request config
    const axiosConfig: AxiosRequestConfig = {
      method: toolDef.method as any,
      url: fullUrl,
      headers: { ...headerParams },
      params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
      validateStatus: () => true, // Don't throw on non-2xx
    };

    // 4. Handle request body
    if (args.requestBody !== undefined) {
      axiosConfig.data = args.requestBody;
      if (toolDef.requestBodyContentType) {
        axiosConfig.headers = axiosConfig.headers || {};
        (axiosConfig.headers as Record<string, string>)["Content-Type"] = toolDef.requestBodyContentType;
      } else {
        axiosConfig.headers = axiosConfig.headers || {};
        (axiosConfig.headers as Record<string, string>)["Content-Type"] = "application/json";
      }
    }

    // 5. Apply security
    applySecurity(axiosConfig, toolDef.securityRequirements, schemes);

    // 6. Make request
    const response = await axios(axiosConfig);

    // 7. Format response
    const status = response.status;
    let responseText: string;
    if (typeof response.data === "string") {
      responseText = response.data;
    } else {
      responseText = JSON.stringify(response.data, null, 2);
    }

    if (status >= 200 && status < 300) {
      return { content: [{ type: "text", text: responseText }] };
    } else {
      return {
        content: [{ type: "text", text: \`API Error (HTTP \${status}):\\n\${responseText}\` }],
        isError: true,
      };
    }
  } catch (error: unknown) {
    return {
      content: [{ type: "text", text: formatApiError(error) }],
      isError: true,
    };
  }
}

// ---------------------------------------------------------------------------
// Security application
// ---------------------------------------------------------------------------

function applySecurity(
  config: AxiosRequestConfig,
  securityRequirements: any[],
  schemes: Record<string, any>,
): void {
  if (!securityRequirements || securityRequirements.length === 0) return;

  // Security requirements array uses OR logic between items.
  // Each item object uses AND logic between its keys.
  // Try each requirement until one can be satisfied.
  for (const requirement of securityRequirements) {
    if (!requirement || typeof requirement !== 'object') continue;
    const schemeNames = Object.keys(requirement);
    if (schemeNames.length === 0) continue; // Empty object = no auth needed

    let allSatisfied = true;
    const pendingHeaders: Record<string, string> = {};
    const pendingParams: Record<string, string> = {};

    for (const schemeName of schemeNames) {
      const scheme = schemes[schemeName];
      if (!scheme) { allSatisfied = false; break; }

      const envSuffix = schemeName.toUpperCase().replace(/[^A-Z0-9]/g, '_');
      const schemeType = (scheme.type || '').toLowerCase();

      if (schemeType === 'apikey') {
        const apiKey = process.env[\`API_KEY_\${envSuffix}\`];
        if (!apiKey) { allSatisfied = false; break; }
        const inLocation = (scheme.in || 'header').toLowerCase();
        const paramName = scheme.name || 'X-API-Key';
        if (inLocation === 'header') {
          pendingHeaders[paramName] = apiKey;
        } else if (inLocation === 'query') {
          pendingParams[paramName] = apiKey;
        } else if (inLocation === 'cookie') {
          pendingHeaders["Cookie"] = (pendingHeaders["Cookie"] ? pendingHeaders["Cookie"] + "; " : "") +
            \`\${paramName}=\${apiKey}\`;
        }
      } else if (schemeType === 'http') {
        const httpScheme = (scheme.scheme || '').toLowerCase();
        if (httpScheme === 'bearer') {
          const token = process.env[\`BEARER_TOKEN_\${envSuffix}\`];
          if (!token) { allSatisfied = false; break; }
          pendingHeaders["Authorization"] = \`Bearer \${token}\`;
        } else if (httpScheme === 'basic') {
          const username = process.env[\`BASIC_USERNAME_\${envSuffix}\`];
          const password = process.env[\`BASIC_PASSWORD_\${envSuffix}\`];
          if (!username || !password) { allSatisfied = false; break; }
          const encoded = Buffer.from(\`\${username}:\${password}\`).toString("base64");
          pendingHeaders["Authorization"] = \`Basic \${encoded}\`;
        } else {
          allSatisfied = false; break;
        }
      } else if (schemeType === 'oauth2') {
        const token = process.env[\`OAUTH_TOKEN_\${envSuffix}\`];
        if (!token) { allSatisfied = false; break; }
        pendingHeaders["Authorization"] = \`Bearer \${token}\`;
      } else if (schemeType === 'openidconnect') {
        const token = process.env[\`OIDC_TOKEN_\${envSuffix}\`];
        if (!token) { allSatisfied = false; break; }
        pendingHeaders["Authorization"] = \`Bearer \${token}\`;
      } else {
        allSatisfied = false; break;
      }
    }

    if (allSatisfied) {
      config.headers = { ...(config.headers as Record<string, string> || {}), ...pendingHeaders };
      if (Object.keys(pendingParams).length > 0) {
        config.params = { ...(config.params || {}), ...pendingParams };
      }
      return; // First satisfied requirement wins (OR logic)
    }
  }
  // No security requirement could be satisfied — proceed without auth
}

// ---------------------------------------------------------------------------
// Error formatting
// ---------------------------------------------------------------------------

function formatApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axErr = error as AxiosError;
    const status = axErr.response?.status;
    const data = axErr.response?.data;
    const dataStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    if (status) {
      return \`API Error (HTTP \${status}):\\n\${dataStr || axErr.message}\`;
    }
    return \`Network error: \${axErr.message}\`;
  }
  if (error instanceof Error) {
    return \`Error: \${error.message}\`;
  }
  return \`Error: \${String(error)}\`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
${transport.setup}
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
    axios: "^1.7.9",
    dotenv: "^16.4.7",
    "json-schema-to-zod": "^2.6.0",
    zod: "^3.24.2",
  };

  const scripts: Record<string, string> = {
    build: "tsc",
    start: "node dist/index.js",
    dev: "npx tsx src/index.ts",
  };

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
// .env.example generation (per-scheme env vars)
// ---------------------------------------------------------------------------

function generateEnvExample(config: ConfigData): string {
  const lines: string[] = [
    "# Base URL of the upstream API",
    `API_BASE_URL=${config.baseUrl}`,
    "",
  ];

  if (config.transport !== "stdio") {
    lines.push("# Server port");
    lines.push(`PORT=${config.port}`);
    lines.push("");
  }

  const schemes = config.securitySchemes || {};
  const schemeEntries = Object.entries(schemes);

  if (schemeEntries.length > 0) {
    lines.push("# --- Security credentials ---");
    lines.push("# Set the env vars for the security schemes your API requires.");
    lines.push("");

    for (const [schemeName, schemeValue] of schemeEntries) {
      const scheme = schemeValue as Record<string, unknown>;
      const envSuffix = schemeName.toUpperCase().replace(/[^A-Z0-9]/g, "_");
      const schemeType = ((scheme.type as string) || "").toLowerCase();

      lines.push(`# Security scheme: ${schemeName} (${schemeType})`);

      if (schemeType === "apikey") {
        lines.push(`API_KEY_${envSuffix}=your-api-key-here`);
      } else if (schemeType === "http") {
        const httpScheme = ((scheme.scheme as string) || "").toLowerCase();
        if (httpScheme === "bearer") {
          lines.push(`BEARER_TOKEN_${envSuffix}=your-bearer-token-here`);
        } else if (httpScheme === "basic") {
          lines.push(`BASIC_USERNAME_${envSuffix}=your-username`);
          lines.push(`BASIC_PASSWORD_${envSuffix}=your-password`);
        }
      } else if (schemeType === "oauth2") {
        lines.push(`OAUTH_TOKEN_${envSuffix}=your-oauth-token-here`);
      } else if (schemeType === "openidconnect") {
        lines.push(`OIDC_TOKEN_${envSuffix}=your-oidc-token-here`);
      }

      lines.push("");
    }
  } else {
    // Fall back to legacy single-auth env vars for backward compat
    switch (config.authMethod) {
      case "api-key":
        lines.push("# API Key for upstream API");
        lines.push("API_KEY_DEFAULT=your-api-key-here");
        break;
      case "bearer":
        lines.push("# Bearer token for upstream API");
        lines.push("BEARER_TOKEN_DEFAULT=your-token-here");
        break;
      case "basic":
        lines.push("# Basic auth credentials for upstream API");
        lines.push("BASIC_USERNAME_DEFAULT=your-username");
        lines.push("BASIC_PASSWORD_DEFAULT=your-password");
        break;
    }
    lines.push("");
  }

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
        "API_BASE_URL": "${config.baseUrl}"
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
    activeMappings.length > 0
      ? activeMappings
          .map((t) => `- \`${toIdentifier(t)}\` — ${descriptionFor(t)}`)
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

## Tools (${activeMappings.length})

All API endpoints are exposed as MCP tools. The server uses the low-level Server API with \`setRequestHandler\` for ListTools and CallTool.

${toolList}

## Transport

**${config.transport}**${config.transport !== "stdio" ? ` on port ${config.port}` : ""}

## Authentication

${Object.keys(config.securitySchemes || {}).length > 0 ? `This server supports per-endpoint security based on the OpenAPI security schemes. Set the appropriate environment variables in \`.env\`.` : config.authMethod === "none" ? "No authentication configured." : `Using **${config.authMethod}** authentication. Set the appropriate environment variables in \`.env\`.`}
`;
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
