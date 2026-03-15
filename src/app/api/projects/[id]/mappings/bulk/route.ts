import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mcpTypeSchema } from "@/lib/validators";

type RouteContext = { params: Promise<{ id: string }> };

// PATCH /api/projects/[id]/mappings/bulk - Bulk update mcpType
export async function PATCH(request: NextRequest, context: RouteContext) {
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

    const body = await request.json();
    const { mappingIds, mcpType } = body;

    if (!Array.isArray(mappingIds) || mappingIds.length === 0) {
      return NextResponse.json(
        { error: "No mappings selected" },
        { status: 400 }
      );
    }

    const typeResult = mcpTypeSchema.safeParse(mcpType);
    if (!typeResult.success) {
      return NextResponse.json(
        { error: "Invalid MCP type" },
        { status: 400 }
      );
    }

    const result = await prisma.endpointMapping.updateMany({
      where: {
        id: { in: mappingIds },
        projectId: id,
      },
      data: { mcpType: typeResult.data },
    });

    return NextResponse.json({ updated: result.count });
  } catch (error) {
    console.error("PATCH /api/projects/[id]/mappings/bulk error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
