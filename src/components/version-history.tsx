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
        <Skeleton className="h-6 w-40 bg-[#27272A]" />
        <Skeleton className="h-16 w-full bg-[#27272A]" />
        <Skeleton className="h-16 w-full bg-[#27272A]" />
      </section>
    );
  }

  return (
    <section aria-label="Version history" className="space-y-4">
      <h3 className="font-mono text-lg font-semibold text-[#FAFAFA]">Version History</h3>

      {versions.length === 0 ? (
        <p className="font-sans text-sm text-[#A1A1AA]">
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
                  className="flex w-full items-start gap-3 rounded-lg border border-white/[0.06] p-3 text-left transition-colors duration-150 hover:bg-[#18181B]"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : version.id)
                  }
                  aria-expanded={isExpanded}
                >
                  <span className="mt-0.5 text-[#71717A]">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-[#FAFAFA]">
                        v{version.versionNumber}
                      </span>
                      <span className="font-sans text-xs text-[#A1A1AA]">
                        {summary}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-[#71717A]">
                      <Clock className="h-3 w-3" />
                      <time dateTime={version.createdAt}>
                        {formatDate(version.createdAt)}
                      </time>
                    </div>
                  </div>
                </button>

                {isExpanded && snapshot && (
                  <div className="ml-7 mt-2 rounded-md border border-white/[0.06] bg-[#09090B] p-3">
                    <h4 className="font-mono text-xs font-medium text-[#A1A1AA] mb-2">
                      Configuration Snapshot
                    </h4>
                    {snapshot.config && (
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <dt className="text-[#71717A]">Transport</dt>
                        <dd className="text-[#FAFAFA]">{snapshot.config.transport}</dd>
                        <dt className="text-[#71717A]">Tools</dt>
                        <dd className="text-[#FAFAFA]">
                          {snapshot.mappings?.filter(
                            (m) => m.mcpType === "tool"
                          ).length ?? 0}
                        </dd>
                        <dt className="text-[#71717A]">Resources</dt>
                        <dd className="text-[#FAFAFA]">
                          {snapshot.mappings?.filter(
                            (m) =>
                              m.mcpType === "resource" ||
                              m.mcpType === "resource_template"
                          ).length ?? 0}
                        </dd>
                        <dt className="text-[#71717A]">Files</dt>
                        <dd className="text-[#FAFAFA]">
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
