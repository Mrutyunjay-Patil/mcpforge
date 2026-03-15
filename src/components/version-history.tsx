"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Clock } from "lucide-react";

interface VersionItem {
  id: string;
  versionNumber: number;
  configSnapshot: string;
  createdAt: string;
}

interface SnapshotData {
  mappings?: Array<{ mcpType: string }>;
  config?: { transport: string };
  files?: Record<string, string>;
}

function parseSnapshot(raw: string): SnapshotData | null {
  try {
    return JSON.parse(raw) as SnapshotData;
  } catch {
    return null;
  }
}

function buildSummary(snapshot: SnapshotData | null): string {
  if (!snapshot) return "Unknown configuration";
  const mappings = snapshot.mappings ?? [];
  const tools = mappings.filter((m) => m.mcpType === "tool").length;
  const resources = mappings.filter(
    (m) => m.mcpType === "resource" || m.mcpType === "resource_template"
  ).length;
  const transport = snapshot.config?.transport ?? "stdio";
  return `${tools} tool${tools !== 1 ? "s" : ""}, ${resources} resource${resources !== 1 ? "s" : ""}, ${transport}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function VersionHistory({ projectId }: { projectId: string }) {
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVersions() {
      try {
        const res = await fetch(`/api/projects/${projectId}/versions`);
        if (!res.ok) {
          const data = await res.json();
          toast.error(data.error || "Failed to load versions");
          return;
        }
        const data = await res.json();
        setVersions(data.versions);
      } catch {
        toast.error("Failed to load versions");
      } finally {
        setLoading(false);
      }
    }
    fetchVersions();
  }, [projectId]);

  if (loading) {
    return (
      <section aria-label="Version history" className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </section>
    );
  }

  return (
    <section aria-label="Version history" className="space-y-4">
      <h3 className="text-lg font-semibold">Version History</h3>

      {versions.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No versions yet. Download your project to create the first version.
        </p>
      ) : (
        <ul className="space-y-2" role="list">
          {versions.map((version) => {
            const snapshot = parseSnapshot(version.configSnapshot);
            const summary = buildSummary(snapshot);
            const isExpanded = expandedId === version.id;

            return (
              <li key={version.id}>
                <button
                  type="button"
                  className="flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : version.id)
                  }
                  aria-expanded={isExpanded}
                >
                  <span className="mt-0.5 text-muted-foreground">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        v{version.versionNumber}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {summary}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <time dateTime={version.createdAt}>
                        {formatDate(version.createdAt)}
                      </time>
                    </div>
                  </div>
                </button>

                {isExpanded && snapshot && (
                  <div className="ml-7 mt-2 rounded-md border bg-muted/30 p-3">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">
                      Configuration Snapshot
                    </h4>
                    {snapshot.config && (
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <dt className="text-muted-foreground">Transport</dt>
                        <dd>{snapshot.config.transport}</dd>
                        <dt className="text-muted-foreground">Tools</dt>
                        <dd>
                          {snapshot.mappings?.filter(
                            (m) => m.mcpType === "tool"
                          ).length ?? 0}
                        </dd>
                        <dt className="text-muted-foreground">Resources</dt>
                        <dd>
                          {snapshot.mappings?.filter(
                            (m) =>
                              m.mcpType === "resource" ||
                              m.mcpType === "resource_template"
                          ).length ?? 0}
                        </dd>
                        <dt className="text-muted-foreground">Files</dt>
                        <dd>
                          {snapshot.files
                            ? Object.keys(snapshot.files).length
                            : 0}
                        </dd>
                      </dl>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
