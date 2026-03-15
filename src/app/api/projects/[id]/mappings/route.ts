import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/projects/[id]/mappings - List mappings with filtering and pagination
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const project = await prisma.project.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const method = url.searchParams.get("method") || "";
    const mcpType = url.searchParams.get("mcpType") || "";
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.max(
      1,
      Math.min(100, parseInt(url.searchParams.get("limit") || "20", 10))
    );

    // Build where clause
    const where: Record<string, unknown> = { projectId: id };

    if (method) {
      where.method = method;
    }

    if (mcpType) {
      where.mcpType = mcpType;
    }

    if (search) {
      where.OR = [
        { path: { contains: search } },
        { operationId: { contains: search } },
      ];
    }

    // Get total count for pagination
    const total = await prisma.endpointMapping.count({ where });

    // Get paginated results
    const mappings = await prisma.endpointMapping.findMany({
      where,
      orderBy: [{ path: "asc" }, { method: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get counts by mcpType for the summary bar (unfiltered by search/method/mcpType)
    const allMappings = await prisma.endpointMapping.groupBy({
      by: ["mcpType"],
      where: { projectId: id },
      _count: { mcpType: true },
    });

    const counts = {
      toolCount: 0,
      resourceCount: 0,
      templateCount: 0,
      excludeCount: 0,
    };

    for (const group of allMappings) {
      switch (group.mcpType) {
        case "tool":
          counts.toolCount = group._count.mcpType;
          break;
        case "resource":
          counts.resourceCount = group._count.mcpType;
          break;
        case "resource_template":
          counts.templateCount = group._count.mcpType;
          break;
        case "exclude":
          counts.excludeCount = group._count.mcpType;
          break;
      }
    }

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      mappings,
      total,
      page,
      totalPages,
      ...counts,
    });
  } catch (error) {
    console.error("GET /api/projects/[id]/mappings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
