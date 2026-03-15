import SwaggerParser from "@apidevtools/swagger-parser";
import yaml from "yaml";

export interface ParsedEndpoint {
  method: string; // GET, POST, PUT, PATCH, DELETE
  path: string; // /pets/{petId}
  operationId: string | null;
  summary: string | null;
  description: string | null;
  paramsCount: number;
  hasBody: boolean;
  defaultMcpType: "tool" | "resource" | "resource_template";
}

export interface ParsedSpec {
  title: string;
  version: string;
  baseUrl: string;
  endpoints: ParsedEndpoint[];
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

  // Validate with swagger-parser
  let api: Record<string, unknown>;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    api = (await SwaggerParser.validate(parsed as any)) as Record<
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

      endpoints.push({
        method: method.toUpperCase(),
        path,
        operationId: (operation.operationId as string) || null,
        summary: (operation.summary as string) || null,
        description: (operation.description as string) || null,
        paramsCount: mergedParams.length,
        hasBody,
        defaultMcpType: getDefaultMcpType(method.toUpperCase(), hasPathParams),
      });
    }
  }

  return {
    title: (info.title as string) || "Untitled API",
    version: (info.version as string) || "1.0.0",
    baseUrl: (servers[0]?.url as string) || "",
    endpoints,
  };
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
