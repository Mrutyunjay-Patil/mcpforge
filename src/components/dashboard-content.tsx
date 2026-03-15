"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Project {
  id: string;
  name: string;
  specTitle: string | null;
  pathCount: number;
  createdAt: string;
  updatedAt: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ProjectCardSkeleton() {
  return (
    <div className="rounded-md border border-[#30363d] bg-[#161b22] p-5">
      <Skeleton className="h-5 w-3/4 bg-[#21262d]" />
      <Skeleton className="mt-2 h-4 w-1/2 bg-[#21262d]" />
      <Skeleton className="mt-4 h-4 w-1/4 bg-[#21262d]" />
      <Skeleton className="mt-3 h-3 w-2/3 bg-[#21262d]" />
    </div>
  );
}

export default function DashboardContent() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.status === 401) {
        router.push("/auth/signin");
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to fetch projects");
      }
      const data = await res.json();
      setProjects(data.projects);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredProjects = projects.filter((project) => {
    if (!debouncedQuery) return true;
    const query = debouncedQuery.toLowerCase();
    return (
      project.name.toLowerCase().includes(query) ||
      (project.specTitle && project.specTitle.toLowerCase().includes(query))
    );
  });

  const handleDelete = async (projectId: string) => {
    setDeletingId(projectId);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete project");
      }
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast.success("Project deleted successfully");
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to delete project";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <section
        aria-label="Dashboard loading"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex items-center justify-between">
          <Skeleton className="h-8 w-48 bg-[#21262d]" />
          <Skeleton className="h-10 w-32 bg-[#21262d]" />
        </div>
        <Skeleton className="mb-6 h-10 w-full max-w-sm bg-[#21262d]" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="Project dashboard"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      {/* Header */}
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#c9d1d9]">
            Projects
          </h1>
          <p className="text-[13px] text-[#8b949e]">
            Manage your MCPForge projects
          </p>
        </div>
        <Button
          onClick={() => router.push("/projects/new")}
          aria-label="Create new project"
          className="rounded-md bg-[#238636] text-[13px] font-medium text-white transition-colors duration-150 hover:bg-[#2ea043]"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </header>

      {/* Search bar - only show when there are projects */}
      {projects.length > 0 && (
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b949e]" />
          <Input
            type="search"
            placeholder="Search projects..."
            aria-label="Search projects"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 rounded-md border-[#30363d] bg-[#0d1117] text-[13px] text-[#c9d1d9] placeholder:text-[#484f58] focus-visible:border-[#58a6ff] focus-visible:ring-0"
          />
        </div>
      )}

      {/* Empty state - no projects at all */}
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-md border border-[#30363d] py-16 text-center">
          <h2 className="text-base font-medium text-[#c9d1d9]">No projects yet</h2>
          <p className="mb-6 mt-1 max-w-sm text-[13px] text-[#8b949e]">
            Create your first MCPForge project to get started.
          </p>
          <Button
            onClick={() => router.push("/projects/new")}
            className="rounded-md bg-[#238636] text-[13px] font-medium text-white transition-colors duration-150 hover:bg-[#2ea043]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>
      )}

      {/* Empty search state */}
      {projects.length > 0 && filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-md border border-[#30363d] py-16 text-center">
          <h2 className="text-base font-medium text-[#c9d1d9]">No results</h2>
          <p className="mt-1 text-[13px] text-[#8b949e]">
            No projects match your search
          </p>
        </div>
      )}

      {/* Project grid */}
      {filteredProjects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group cursor-pointer rounded-md border border-[#30363d] bg-[#161b22] p-5 transition-colors duration-150 hover:border-[#484f58]"
              onClick={() => router.push(`/projects/${project.id}`)}
              role="article"
              aria-label={`Project: ${project.name}`}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[14px] font-medium text-[#58a6ff]">
                    {project.name}
                  </h3>
                  {project.specTitle && (
                    <p className="mt-1 truncate text-[13px] text-[#8b949e]">
                      {project.specTitle}
                    </p>
                  )}
                </div>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 h-8 w-8 shrink-0 rounded-md text-[#8b949e] opacity-0 transition-all duration-150 hover:bg-[#21262d] hover:text-[#f85149] group-hover:opacity-100"
                        aria-label={`Delete project ${project.name}`}
                        onClick={(e) => e.stopPropagation()}
                        disabled={deletingId === project.id}
                      />
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </AlertDialogTrigger>
                  <AlertDialogContent
                    onClick={(e) => e.stopPropagation()}
                    className="border-[#30363d] bg-[#161b22]"
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-[#c9d1d9]">
                        Delete project?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-[#8b949e]">
                        This will permanently delete &quot;{project.name}&quot;
                        and all its endpoint mappings and server
                        configurations. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="border-[#30363d] bg-[#0d1117]/50">
                      <AlertDialogCancel className="border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d] hover:text-[#c9d1d9]">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        disabled={deletingId === project.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id);
                        }}
                        className="bg-[#da3633] text-white hover:bg-[#f85149]"
                      >
                        {deletingId === project.id
                          ? "Deleting..."
                          : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-[#30363d] bg-[#21262d] px-2 py-0.5 text-xs text-[#8b949e]">
                  {project.pathCount}{" "}
                  {project.pathCount === 1 ? "endpoint" : "endpoints"}
                </span>
              </div>
              <p className="mt-3 text-xs text-[#8b949e]">
                Created {formatDate(project.createdAt)}
                {project.updatedAt !== project.createdAt && (
                  <> &middot; Updated {formatDate(project.updatedAt)}</>
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
