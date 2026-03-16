import SwaggerParser from "@apidevtools/swagger-parser";
import yaml from "yaml";

export interface ParsedParameter {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  type: string; // "string" | "number" | "integer" | "boolean" | "array" | "object"
  required: boolean;
  description: string | null;
  schema: Record<string, unknown> | null; // Raw JSON Schema for this parameter
}

export interface ParsedRequestBody {
  contentType: string;
  required: boolean;
  description: string | null;
  schema: Record<string, unknown> | null; // Raw JSON Schema for the body
}

export interface ParsedEndpoint {
  method: string; // GET, POST, PUT, PATCH, DELETE
  path: string; // /pets/{petId}
  operationId: string | null;
  summary: string | null;
  description: string | null;
  paramsCount: number;
  hasBody: boolean;
  defaultMcpType: "tool" | "resource" | "resource_template";
  parameters: ParsedParameter[]; // Full parameter details
  requestBody: ParsedRequestBody | null; // Full request body details
  securityRequirements: Array<Record<string, string[]>> | null; // Per-operation security
}

export interface ParsedSpec {
  title: string;
  version: string;
  baseUrl: string;
  endpoints: ParsedEndpoint[];
  securitySchemes: Record<string, unknown>; // Raw security schemes from spec
  globalSecurity: Array<Record<string, string[]>>; // Global security requirements
}

export function detectFormat(content: string): "json" | "yaml" {
  const trimmed = content.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) return "json";
  return "yaml";
}

export function parseContent(
  content: string,
  format: "json" | "yaml"
): unknown {
  if (format === "json") {
    return JSON.parse(content);
  }
  return yaml.parse(content);
}

function getDefaultMcpType(
  method: string,
  hasPathParams: boolean
): "tool" | "resource" | "resource_template" {
  if (method === "GET") {
    return hasPathParams ? "resource_template" : "resource";
  }
  return "tool";
}

export async function parseOpenApiSpec(content: string): Promise<ParsedSpec> {
  const format = detectFormat(content);

  let parsed: unknown;
  try {
    parsed = parseContent(content, format);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (format === "json") throw new Error(`Invalid JSON syntax: ${msg}`);
    throw new Error(`Invalid YAML syntax: ${msg}`);
  }

  // Validate it's an object
  if (!parsed || typeof parsed !== "object") {
    throw new Error(
      "Not a valid OpenAPI specification. Must be OpenAPI 3.0 or higher."
    );
  }

  const spec = parsed as Record<string, unknown>;

  // Check for required fields
  if (!spec.info) {
    throw new Error("Specification is missing required 'info' field.");
  }
  if (!spec.paths) {
    throw new Error("Specification is missing required 'paths' field.");
  }
  if (!spec.openapi || !String(spec.openapi).startsWith("3")) {
    throw new Error(
      "Not a valid OpenAPI specification. Must be OpenAPI 3.0 or higher."
    );
  }

  // Strip external $ref pointers (e.g., ./docs/file.md) that can't be resolved
  // when the spec is provided as raw content without accompanying files.
  // Internal refs (#/components/...) are preserved for dereference.
  const cleaned = stripExternalRefs(spec);

  // Dereference resolves internal $refs without strict OpenAPI version validation,
  // supporting both 3.0.x and 3.1.x specs.
  let api: Record<string, unknown>;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    api = (await SwaggerParser.dereference(cleaned as any)) as Record<
      string,
      unknown
    >;
  } catch (_err: unknown) {
    throw new Error(
      "Not a valid OpenAPI specification. Must be OpenAPI 3.0 or higher."
    );
  }

  const info = (api.info || {}) as Record<string, unknown>;
  const servers = (api.servers || []) as Array<Record<string, unknown>>;
  const paths = (api.paths || {}) as Record<string, unknown>;

  const endpoints: ParsedEndpoint[] = [];
  const methods = ["get", "post", "put", "patch", "delete"];

  for (const [path, pathItem] of Object.entries(paths)) {
    if (!pathItem || typeof pathItem !== "object") continue;
    const pathObj = pathItem as Record<string, unknown>;

    // Collect path-level parameters that apply to all operations
    const pathLevelParams = (pathObj.parameters as unknown[]) || [];

    for (const method of methods) {
      const operation = pathObj[method] as Record<string, unknown> | undefined;
      if (!operation) continue;

      // Merge path-level params with operation-level params (operation takes precedence)
      const operationParams = (operation.parameters as unknown[]) || [];
      const mergedParams = mergeParameters(pathLevelParams, operationParams);

      const pathParams = mergedParams.filter(
        (p: Record<string, unknown>) => p?.in === "path"
      );
      const hasPathParams = pathParams.length > 0;
      const hasBody = !!operation.requestBody;

      // Extract full parameter details
      const parameters: ParsedParameter[] = mergedParams.map((p) => {
        const paramSchema = p.schema as Record<string, unknown> | undefined;
        const paramType = paramSchema?.type as string | undefined;
        return {
          name: (p.name as string) || "",
          in: (p.in as ParsedParameter["in"]) || "query",
          type: paramType || "string",
          required: !!(p.required as boolean),
          description: (p.description as string) || null,
          schema: paramSchema ? cleanSchemaForJsonSchema(paramSchema) : null,
        };
      });

      // Extract request body details
      let requestBody: ParsedRequestBody | null = null;
      if (operation.requestBody) {
        const rb = operation.requestBody as Record<string, unknown>;
        const content = rb.content as Record<string, unknown> | undefined;
        let contentType = "application/json";
        let bodySchema: Record<string, unknown> | null = null;
        if (content) {
          // Prefer application/json, fall back to first available
          const preferredType = content["application/json"]
            ? "application/json"
            : Object.keys(content)[0] || "application/json";
          contentType = preferredType;
          const mediaType = content[preferredType] as Record<string, unknown> | undefined;
          if (mediaType?.schema) {
            bodySchema = cleanSchemaForJsonSchema(
              mediaType.schema as Record<string, unknown>
            );
          }
        }
        requestBody = {
          contentType,
          required: !!(rb.required as boolean),
          description: (rb.description as string) || null,
          schema: bodySchema,
        };
      }

      // Extract per-operation security requirements
      const opSecurity = operation.security as
        | Array<Record<string, string[]>>
        | undefined;

      endpoints.push({
        method: method.toUpperCase(),
        path,
        operationId: (operation.operationId as string) || null,
        summary: (operation.summary as string) || null,
        description: (operation.description as string) || null,
        paramsCount: mergedParams.length,
        hasBody,
        defaultMcpType: getDefaultMcpType(method.toUpperCase(), hasPathParams),
        parameters,
        requestBody,
        securityRequirements: opSecurity || null,
      });
    }
  }

  // Extract security schemes and global security
  const components = (api.components || {}) as Record<string, unknown>;
  const securitySchemes = (components.securitySchemes || {}) as Record<
    string,
    unknown
  >;
  const globalSecurity = (api.security || []) as Array<
    Record<string, string[]>
  >;

  return {
    title: (info.title as string) || "Untitled API",
    version: (info.version as string) || "1.0.0",
    baseUrl: resolveBaseUrl(servers),
    endpoints,
    securitySchemes,
    globalSecurity,
  };
}

/**
 * Resolve the best base URL from the servers array.
 * Prefers absolute URLs (starting with http/https).
 * If only relative paths exist (e.g. /api/v3), returns empty string
 * so the user must configure API_BASE_URL in their .env file.
 */
function resolveBaseUrl(
  servers: Array<Record<string, unknown>>
): string {
  if (!servers || servers.length === 0) return "";

  // First pass: find an absolute URL
  for (const server of servers) {
    const url = server.url as string | undefined;
    if (url && /^https?:\/\//i.test(url)) {
      // Remove trailing slash
      return url.replace(/\/+$/, "");
    }
  }

  // All URLs are relative — cannot be used with axios directly.
  // Return empty so the user must set API_BASE_URL.
  return "";
}

/**
 * Clean a schema object for use as JSON Schema.
 * Removes OpenAPI-specific properties, converts integer to number,
 * and recursively cleans nested schemas.
 */
function cleanSchemaForJsonSchema(
  schema: Record<string, unknown>
): Record<string, unknown> {
  if (!schema || typeof schema !== "object") return {};
  const result = { ...schema };
  // Remove OpenAPI-specific properties
  delete result.nullable;
  delete result.example;
  delete result.xml;
  delete result.externalDocs;
  delete result.deprecated;
  delete result.readOnly;
  delete result.writeOnly;
  // Convert integer to number
  if (result.type === "integer") result.type = "number";
  // Recursively clean properties
  if (result.properties && typeof result.properties === "object") {
    const props = result.properties as Record<string, unknown>;
    const cleaned: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(props)) {
      if (val && typeof val === "object") {
        cleaned[key] = cleanSchemaForJsonSchema(
          val as Record<string, unknown>
        );
      } else {
        cleaned[key] = val;
      }
    }
    result.properties = cleaned;
  }
  // Recursively clean array items
  if (result.items && typeof result.items === "object") {
    result.items = cleanSchemaForJsonSchema(
      result.items as Record<string, unknown>
    );
  }
  return result;
}

/**
 * Merge path-level and operation-level parameters.
 * Operation-level params override path-level params with the same name+in.
 */
function mergeParameters(
  pathParams: unknown[],
  operationParams: unknown[]
): Array<Record<string, unknown>> {
  const paramMap = new Map<string, Record<string, unknown>>();

  for (const p of pathParams) {
    if (p && typeof p === "object") {
      const param = p as Record<string, unknown>;
      const key = `${param.in}:${param.name}`;
      paramMap.set(key, param);
    }
  }

  for (const p of operationParams) {
    if (p && typeof p === "object") {
      const param = p as Record<string, unknown>;
      const key = `${param.in}:${param.name}`;
      paramMap.set(key, param);
    }
  }

  return Array.from(paramMap.values());
}

/**
 * Recursively strip external $ref pointers (file paths like ./docs/file.md)
 * that cannot be resolved when the spec is provided as raw content.
 * Internal refs starting with # are preserved.
 */
function stripExternalRefs(obj: unknown): unknown {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(stripExternalRefs);
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
    if (key === "$ref" && typeof val === "string" && !val.startsWith("#")) {
      // External file ref — remove it, keep a marker
      result["x-external-ref"] = val;
    } else {
      result[key] = stripExternalRefs(val);
    }
  }
  return result;
}
