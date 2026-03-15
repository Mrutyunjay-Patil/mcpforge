import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  generateMcpServer,
  type MappingData,
  type ConfigData,
} from "@/lib/code-generator";

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/projects/[id]/generate - Generate MCP server files and create a version snapshot
export async function POST(_request: NextRequest, context: RouteContext) {
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

    const mappings: MappingData[] = project.mappings.map((m) => ({
      method: m.method,
      path: m.path,
      operationId: m.operationId,
      summary: m.summary,
      description: m.description,
      paramsCount: m.paramsCount,
      hasBody: m.hasBody,
      mcpType: m.mcpType,
    }));

    const config: ConfigData = {
      transport: project.config.transport,
      authMethod: project.config.authMethod,
      serverName: project.config.serverName,
      serverVersion: project.config.serverVersion,
      baseUrl: project.config.baseUrl,
      port: project.config.port,
    };

    const files = generateMcpServer(mappings, config);

    // Count existing versions to determine the next version number
    const versionCount = await prisma.projectVersion.count({
      where: { projectId: id },
    });

    const version = await prisma.projectVersion.create({
      data: {
        projectId: id,
        versionNumber: versionCount + 1,
        configSnapshot: JSON.stringify({ mappings, config, files }),
      },
      select: {
        id: true,
        versionNumber: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ version, files });
  } catch (error) {
    console.error("POST /api/projects/[id]/generate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
