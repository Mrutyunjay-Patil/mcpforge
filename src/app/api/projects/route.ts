import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { projectNameSchema } from "@/lib/validators";
import { parseOpenApiSpec, detectFormat } from "@/lib/openapi-parser";

// GET /api/projects - List all projects for authenticated user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        specTitle: true,
        pathCount: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, specContent, specFormat } = body;

    // Validate project name
    const nameResult = projectNameSchema.safeParse(name);
    if (!nameResult.success) {
      return NextResponse.json(
        { error: nameResult.error.issues[0].message },
        { status: 400 }
      );
    }

    // Validate specContent is provided
    if (!specContent || typeof specContent !== "string") {
      return NextResponse.json(
        { error: "Spec content is required" },
        { status: 400 }
      );
    }

    // Parse the OpenAPI spec
    let parsedSpec;
    try {
      parsedSpec = await parseOpenApiSpec(specContent);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid specification";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // Generate server name from spec title (kebab-case)
    const serverName = parsedSpec.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50) || "mcp-server";

    const format = specFormat || detectFormat(specContent);

    // Create project with mappings and config in a transaction
    const project = await prisma.$transaction(async (tx) => {
      const newProject = await tx.project.create({
        data: {
          name: nameResult.data,
          specContent,
          specFormat: format,
          specTitle: parsedSpec.title,
          specVersion: parsedSpec.version,
          pathCount: parsedSpec.endpoints.length,
          userId: session.user!.id!,
          mappings: {
            create: parsedSpec.endpoints.map((endpoint) => ({
              method: endpoint.method,
              path: endpoint.path,
              operationId: endpoint.operationId,
              summary: endpoint.summary,
              description: endpoint.description,
              paramsCount: endpoint.paramsCount,
              hasBody: endpoint.hasBody,
              mcpType: endpoint.defaultMcpType,
            })),
          },
          config: {
            create: {
              serverName,
              serverVersion: parsedSpec.version,
              baseUrl: parsedSpec.baseUrl,
              transport: "stdio",
              authMethod: "none",
              port: 3001,
            },
          },
        },
      });

      return newProject;
    });

    return NextResponse.json(
      {
        project: {
          id: project.id,
          name: project.name,
          pathCount: project.pathCount,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
