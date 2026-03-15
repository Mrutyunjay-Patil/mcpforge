import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mcpTypeSchema } from "@/lib/validators";

type RouteContext = { params: Promise<{ id: string; mappingId: string }> };

// PATCH /api/projects/[id]/mappings/[mappingId] - Update single mapping mcpType
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, mappingId } = await context.params;

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
    const typeResult = mcpTypeSchema.safeParse(body.mcpType);
    if (!typeResult.success) {
      return NextResponse.json(
        { error: typeResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const mapping = await prisma.endpointMapping.findFirst({
      where: { id: mappingId, projectId: id },
    });

    if (!mapping) {
      return NextResponse.json(
        { error: "Mapping not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.endpointMapping.update({
      where: { id: mappingId },
      data: { mcpType: typeResult.data },
    });

    return NextResponse.json({ mapping: updated });
  } catch (error) {
    console.error(
      "PATCH /api/projects/[id]/mappings/[mappingId] error:",
      error
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
