import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  generateMcpServer,
  type MappingData,
  type ConfigData,
} from "@/lib/code-generator";
import { parseOpenApiSpec } from "@/lib/openapi-parser";
import { buildProjectZip } from "@/lib/zip-builder";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/projects/[id]/download - Download project as zip
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        mappings: true,
        config: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (!project.config) {
      return NextResponse.json(
        { error: "Server config not found" },
        { status: 404 }
      );
    }

    // Re-parse spec to get full parameter details
    let parsedSpec;
    try {
      parsedSpec = await parseOpenApiSpec(project.specContent);
    } catch {
      parsedSpec = null;
    }

    const mappings: MappingData[] = project.mappings.map((m) => {
      const endpoint = parsedSpec?.endpoints.find(
        (e) => e.method === m.method && e.path === m.path
      );
      return {
        method: m.method,
        path: m.path,
        operationId: m.operationId,
        summary: m.summary,
        description: m.description,
        paramsCount: m.paramsCount,
        hasBody: m.hasBody,
        mcpType: m.mcpType,
        parameters: endpoint?.parameters ?? [],
        requestBody: endpoint?.requestBody ?? null,
        securityRequirements: endpoint?.securityRequirements ?? null,
      };
    });

    const config: ConfigData = {
      transport: project.config.transport,
      authMethod: project.config.authMethod,
      serverName: project.config.serverName,
      serverVersion: project.config.serverVersion,
      baseUrl: project.config.baseUrl,
      port: project.config.port,
      securitySchemes: parsedSpec?.securitySchemes ?? {},
    };

    const files = generateMcpServer(mappings, config);

    // Build a kebab-case name for the zip filename
    const kebabName = project.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const zipBuffer = await buildProjectZip(
      files as unknown as Record<string, string>,
      `mcpforge-${kebabName}`
    );

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="mcpforge-${kebabName}.zip"`,
      },
    });
  } catch (error) {
    console.error("GET /api/projects/[id]/download error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
