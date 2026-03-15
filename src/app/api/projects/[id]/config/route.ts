import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serverConfigSchema } from "@/lib/validators";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/projects/[id]/config - Get server config for a project
export async function GET(_request: NextRequest, context: RouteContext) {
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
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const config = await prisma.serverConfig.findUnique({
      where: { projectId: id },
      select: {
        transport: true,
        authMethod: true,
        serverName: true,
        serverVersion: true,
        baseUrl: true,
        port: true,
      },
    });

    if (!config) {
      return NextResponse.json(
        { error: "Config not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ config });
  } catch (error) {
    console.error("GET /api/projects/[id]/config error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id]/config - Update server config for a project
export async function PUT(request: NextRequest, context: RouteContext) {
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
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const body = await request.json();
    const result = serverConfigSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { error: "Validation failed", fieldErrors },
        { status: 400 }
      );
    }

    const config = await prisma.serverConfig.update({
      where: { projectId: id },
      data: {
        transport: result.data.transport,
        authMethod: result.data.authMethod,
        serverName: result.data.serverName,
        serverVersion: result.data.serverVersion,
        baseUrl: result.data.baseUrl ?? "",
        port: result.data.port,
      },
      select: {
        transport: true,
        authMethod: true,
        serverName: true,
        serverVersion: true,
        baseUrl: true,
        port: true,
      },
    });

    return NextResponse.json({ config });
  } catch (error) {
    console.error("PUT /api/projects/[id]/config error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
