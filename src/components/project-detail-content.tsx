"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ServerConfigPanel } from "@/components/server-config-panel";
import { CodePreview } from "@/components/code-preview";
import { VersionHistory } from "@/components/version-history";
import { DownloadButton } from "@/components/download-button";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Mapping {
  id: string;
  method: string;
  path: string;
  operationId: string | null;
  summary: string | null;
  description: string | null;
  paramsCount: number;
  hasBody: boolean;
  mcpType: string;
}

interface MappingsResponse {
  mappings: Mapping[];
  total: number;
  page: number;
  totalPages: number;
  toolCount: number;
  resourceCount: number;
  templateCount: number;
  excludeCount: number;
}

interface Project {
  id: string;
  name: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const methodColors: Record<string, string> = {
  GET: "bg-green-100 text-green-800 border-green-300",
  POST: "bg-blue-100 text-blue-800 border-blue-300",
  PUT: "bg-amber-100 text-amber-800 border-amber-300",
  PATCH: "bg-purple-100 text-purple-800 border-purple-300",
  DELETE: "bg-red-100 text-red-800 border-red-300",
};

const mcpTypeLabels: Record<string, string> = {
  tool: "Tool",
  resource: "Resource",
  resource_template: "Resource Template",
  exclude: "Exclude",
};

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
const MCP_TYPES = ["tool", "resource", "resource_template", "exclude"] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ProjectDetailContent({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();

  // Project state
  const [project, setProject] = useState<Project | null>(null);
  const [projectLoading, setProjectLoading] = useState(true);

  // Name editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Mappings state
  const [mappingsData, setMappingsData] = useState<MappingsResponse | null>(
    null
  );
  const [mappingsLoading, setMappingsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [mcpTypeFilter, setMcpTypeFilter] = useState("");
  const [page, setPage] = useState(1);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkUpdating, setBulkUpdating] = useState(false);

  // Per-row saving indicator
  const [savingMappingId, setSavingMappingId] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // Fetch project
  // -------------------------------------------------------------------------

  const fetchProject = useCallback(async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.status === 401) {
        router.push("/auth/signin");
        return;
      }
      if (res.status === 404 || res.status === 403) {
        router.push("/dashboard");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch project");
      const data = await res.json();
      setProject({
        id: data.project.id,
        name: data.project.name,
        updatedAt: data.project.updatedAt,
      });
    } catch {
      toast.error("Failed to load project");
      router.push("/dashboard");
    } finally {
      setProjectLoading(false);
    }
  }, [projectId, router]);

  // -------------------------------------------------------------------------
  // Fetch mappings
  // -------------------------------------------------------------------------

  const fetchMappings = useCallback(async () => {
    setMappingsLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (methodFilter) params.set("method", methodFilter);
      if (mcpTypeFilter) params.set("mcpType", mcpTypeFilter);
      params.set("page", String(page));
      params.set("limit", "20");

      const res = await fetch(
        `/api/projects/${projectId}/mappings?${params.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch mappings");
      const data: MappingsResponse = await res.json();
      setMappingsData(data);
    } catch {
      toast.error("Failed to load endpoints");
    } finally {
      setMappingsLoading(false);
    }
  }, [projectId, debouncedSearch, methodFilter, mcpTypeFilter, page]);

  // -------------------------------------------------------------------------
  // Effects
  // -------------------------------------------------------------------------

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    fetchMappings();
  }, [fetchMappings]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Focus name input when editing
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  // -------------------------------------------------------------------------
  // Name editing handlers
  // -------------------------------------------------------------------------

  function startEditingName() {
    if (!project) return;
    setEditName(project.name);
    setIsEditingName(true);
  }

  async function saveName() {
    if (!project) return;
    const trimmed = editName.trim();
    if (!trimmed) {
      toast.error("Project name is required");
      return;
    }
    if (trimmed === project.name) {
      setIsEditingName(false);
      return;
    }

    setSavingName(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update name");
      }
      const data = await res.json();
      setProject((prev) =>
        prev ? { ...prev, name: data.project.name } : prev
      );
      setIsEditingName(false);
      toast.success("Project name updated");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update name";
      toast.error(msg);
    } finally {
      setSavingName(false);
    }
  }

  function cancelEditingName() {
    setIsEditingName(false);
  }

  function handleNameKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      saveName();
    } else if (e.key === "Escape") {
      cancelEditingName();
    }
  }

  // -------------------------------------------------------------------------
  // MCP Type change (single)
  // -------------------------------------------------------------------------

  async function handleMcpTypeChange(mappingId: string, newType: string) {
    const prev = mappingsData;
    if (!prev) return;

    // Optimistic update
    setMappingsData({
      ...prev,
      mappings: prev.mappings.map((m) =>
        m.id === mappingId ? { ...m, mcpType: newType } : m
      ),
    });
    setSavingMappingId(mappingId);

    try {
      const res = await fetch(
        `/api/projects/${projectId}/mappings/${mappingId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mcpType: newType }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to update");
      }
      // Refetch to update counts
      fetchMappings();
    } catch {
      // Revert
      setMappingsData(prev);
      toast.error("Failed to update MCP type");
    } finally {
      setSavingMappingId(null);
    }
  }

  // -------------------------------------------------------------------------
  // Bulk update
  // -------------------------------------------------------------------------

  async function handleBulkUpdate(mcpType: string) {
    if (selectedIds.size === 0) return;

    setBulkUpdating(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/mappings/bulk`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mappingIds: Array.from(selectedIds),
          mcpType,
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const data = await res.json();
      toast.success(`Updated ${data.updated} endpoints`);
      setSelectedIds(new Set());
      fetchMappings();
    } catch {
      toast.error("Failed to bulk update");
    } finally {
      setBulkUpdating(false);
    }
  }

  // -------------------------------------------------------------------------
  // Selection helpers
  // -------------------------------------------------------------------------

  function toggleSelectAll() {
    if (!mappingsData) return;
    const allIds = mappingsData.mappings.map((m) => m.id);
    const allSelected = allIds.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // -------------------------------------------------------------------------
  // Derived values
  // -------------------------------------------------------------------------

  const mappings = mappingsData?.mappings ?? [];
  const totalEndpoints =
    (mappingsData?.toolCount ?? 0) +
    (mappingsData?.resourceCount ?? 0) +
    (mappingsData?.templateCount ?? 0) +
    (mappingsData?.excludeCount ?? 0);
  const allOnPageSelected =
    mappings.length > 0 && mappings.every((m) => selectedIds.has(m.id));
  const someOnPageSelected =
    mappings.some((m) => selectedIds.has(m.id)) && !allOnPageSelected;

  // -------------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------------

  if (projectLoading) {
    return (
      <section
        aria-label="Project loading"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <Skeleton className="mb-4 h-5 w-40" />
        <Skeleton className="mb-8 h-8 w-64" />
        <Skeleton className="mb-4 h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </section>
    );
  }

  if (!project) return null;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <section
      aria-label="Project detail"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Back link */}
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <Input
                ref={nameInputRef}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleNameKeyDown}
                disabled={savingName}
                className="h-9 text-2xl font-bold"
                aria-label="Edit project name"
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={saveName}
                disabled={savingName}
                aria-label="Save project name"
              >
                {savingName ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={cancelEditingName}
                disabled={savingName}
                aria-label="Cancel editing"
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {project.name}
              </h1>
              <Button
                size="icon"
                variant="ghost"
                onClick={startEditingName}
                aria-label="Edit project name"
              >
                <Pencil className="size-4" />
              </Button>
            </div>
          )}
        </div>
        <DownloadButton projectId={projectId} projectName={project.name} />
      </header>

      {/* Tabs */}
      <Tabs defaultValue="endpoints" aria-label="Project sections">
        <TabsList className="mb-6">
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Endpoints Tab */}
        <TabsContent value="endpoints">
          <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left column: table (70%) */}
          <div className="min-w-0 lg:w-[70%]">
          {/* Summary bar */}
          <div className="mb-4 text-sm text-muted-foreground">
            {totalEndpoints} endpoints total, {mappingsData?.toolCount ?? 0}{" "}
            tools / {mappingsData?.resourceCount ?? 0} resources /{" "}
            {mappingsData?.templateCount ?? 0} templates /{" "}
            {mappingsData?.excludeCount ?? 0} excluded
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by path or operation..."
                aria-label="Search endpoints"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={methodFilter || "all"}
              onValueChange={(val) => {
                setMethodFilter(val === "all" ? "" : (val as string));
                setPage(1);
              }}
            >
              <SelectTrigger aria-label="Filter by HTTP method">
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                {METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={mcpTypeFilter || "all"}
              onValueChange={(val) => {
                setMcpTypeFilter(val === "all" ? "" : (val as string));
                setPage(1);
              }}
            >
              <SelectTrigger aria-label="Filter by MCP type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {MCP_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {mcpTypeLabels[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bulk actions */}
          {selectedIds.size > 0 && (
            <div className="mb-4 flex items-center gap-2 rounded-md border bg-muted/50 p-3">
              <span className="text-sm font-medium">
                {selectedIds.size} selected
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUpdate("tool")}
                  disabled={bulkUpdating}
                >
                  Set as Tool
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUpdate("resource")}
                  disabled={bulkUpdating}
                >
                  Set as Resource
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUpdate("resource_template")}
                  disabled={bulkUpdating}
                >
                  Set as Template
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUpdate("exclude")}
                  disabled={bulkUpdating}
                >
                  Exclude
                </Button>
              </div>
              {bulkUpdating && (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              )}
            </div>
          )}

          {/* Table */}
          {mappingsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : mappings.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
              <Search className="mb-4 size-12 text-muted-foreground" />
              <h2 className="text-lg font-semibold">
                No endpoints match your filters
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-md border">
                <Table aria-label="API endpoints">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={allOnPageSelected}
                          indeterminate={someOnPageSelected}
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all endpoints on this page"
                        />
                      </TableHead>
                      <TableHead className="w-24">Method</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Operation ID
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Summary
                      </TableHead>
                      <TableHead className="w-20 text-center">
                        Params
                      </TableHead>
                      <TableHead className="w-44">MCP Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mappings.map((mapping) => (
                      <TableRow key={mapping.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(mapping.id)}
                            onCheckedChange={() => toggleSelect(mapping.id)}
                            aria-label={`Select ${mapping.method} ${mapping.path}`}
                          />
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold ${
                              methodColors[mapping.method] ??
                              "bg-gray-100 text-gray-800 border-gray-300"
                            }`}
                          >
                            {mapping.method}
                          </span>
                        </TableCell>
                        <TableCell>
                          <code className="text-sm font-mono">
                            {mapping.path}
                          </code>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm text-muted-foreground">
                            {mapping.operationId || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span
                            className="text-sm text-muted-foreground"
                            title={mapping.summary ?? undefined}
                          >
                            {mapping.summary
                              ? mapping.summary.length > 50
                                ? mapping.summary.slice(0, 50) + "..."
                                : mapping.summary
                              : "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          {mapping.paramsCount > 0 ? (
                            <Badge variant="secondary">
                              {mapping.paramsCount}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              0
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Select
                              value={mapping.mcpType}
                              onValueChange={(val) =>
                                handleMcpTypeChange(mapping.id, val as string)
                              }
                            >
                              <SelectTrigger
                                size="sm"
                                aria-label={`MCP type for ${mapping.method} ${mapping.path}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {MCP_TYPES.map((t) => (
                                  <SelectItem key={t} value={t}>
                                    {mcpTypeLabels[t]}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {savingMappingId === mapping.id && (
                              <Loader2 className="size-3 animate-spin text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {mappingsData && mappingsData.totalPages > 1 && (
                <nav
                  aria-label="Pagination"
                  className="mt-4 flex items-center justify-between"
                >
                  <p className="text-sm text-muted-foreground">
                    Showing{" "}
                    {(mappingsData.page - 1) * 20 + 1}-
                    {Math.min(mappingsData.page * 20, mappingsData.total)} of{" "}
                    {mappingsData.total} endpoints
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Page {mappingsData.page} of {mappingsData.totalPages}
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={mappingsData.page <= 1}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        setPage((p) =>
                          Math.min(mappingsData.totalPages, p + 1)
                        )
                      }
                      disabled={mappingsData.page >= mappingsData.totalPages}
                      aria-label="Next page"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </nav>
              )}
            </>
          )}
          </div>
          {/* Right column: config panel (30%) */}
          <aside className="lg:w-[30%] rounded-lg border p-4">
            <ServerConfigPanel projectId={projectId} />
          </aside>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          <CodePreview projectId={projectId} />
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <VersionHistory projectId={projectId} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
