"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Search, Trash2, Wrench, Clock, Server } from "lucide-react";
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

function formatRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 5) return `${diffWeeks}w ago`;
  return `${diffMonths}mo ago`;
}

function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#18181B] overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <Skeleton className="h-10 w-10 rounded-lg bg-[#27272A]" />
          <Skeleton className="h-6 w-16 rounded-full bg-[#27272A]" />
        </div>
        <Skeleton className="mt-4 h-5 w-3/4 bg-[#27272A]" />
        <Skeleton className="mt-2 h-4 w-1/2 bg-[#27272A]" />
      </div>
      <div className="border-t border-white/[0.06] px-5 py-3">
        <Skeleton className="h-4 w-2/3 bg-[#27272A]" />
      </div>
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
          <div>
            <Skeleton className="h-8 w-48 bg-[#27272A]" />
            <Skeleton className="mt-2 h-4 w-72 bg-[#27272A]" />
          </div>
          <Skeleton className="h-10 w-36 rounded-full bg-[#27272A]" />
        </div>
        <Skeleton className="mb-6 h-10 w-full max-w-sm bg-[#27272A]" />
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
          <h1 className="font-mono text-[24px] font-bold tracking-tight text-[#FAFAFA]">
            Your Projects
          </h1>
          <p className="mt-1 font-sans text-[14px] text-[#A1A1AA]">
            Manage and create your MCP server projects
          </p>
        </div>
        <Button
          onClick={() => router.push("/projects/new")}
          aria-label="Create new project"
          className="rounded-full bg-[#F97316] text-[13px] font-medium text-black transition-colors duration-150 hover:bg-[#EA580C]"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </header>

      {/* Search bar - only show when there are projects */}
      {projects.length > 0 && (
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />
          <Input
            type="search"
            placeholder="Search projects..."
            aria-label="Search projects"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9 rounded-md border-white/[0.06] bg-[#18181B] text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] focus-visible:border-[#F97316] focus-visible:ring-0"
          />
        </div>
      )}

      {/* Empty state - no projects at all */}
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] py-16 text-center">
          <h2 className="font-mono text-base font-medium text-[#FAFAFA]">No projects yet</h2>
          <p className="mb-6 mt-1 max-w-sm font-sans text-[13px] text-[#A1A1AA]">
            Create your first MCPForge project to get started.
          </p>
          <Button
            onClick={() => router.push("/projects/new")}
            className="rounded-full bg-[#F97316] text-[13px] font-medium text-black transition-colors duration-150 hover:bg-[#EA580C]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>
      )}

      {/* Empty search state */}
      {projects.length > 0 && filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] py-16 text-center">
          <h2 className="font-mono text-base font-medium text-[#FAFAFA]">No results</h2>
          <p className="mt-1 font-sans text-[13px] text-[#A1A1AA]">
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
              className="group cursor-pointer overflow-hidden rounded-xl border border-white/[0.06] bg-[#18181B] shadow-sm transition-all duration-200 hover:border-[rgba(249,115,22,0.3)] hover:shadow-md hover:shadow-orange-500/5"
              onClick={() => router.push(`/projects/${project.id}`)}
              role="article"
              aria-label={`Project: ${project.name}`}
            >
              {/* Card body */}
              <div className="p-5">
                {/* Top row: icon + status badge */}
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#F97316] to-[#EA580C]">
                    <Server className="h-5 w-5 text-white" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Active
                  </span>
                </div>

                {/* Project name */}
                <h3 className="mt-4 truncate font-mono text-[16px] font-semibold text-[#FAFAFA]">
                  {project.name}
                </h3>

                {/* Description / spec title */}
                {project.specTitle && (
                  <p className="mt-1 truncate font-sans text-[13px] text-[#A1A1AA]">
                    {project.specTitle}
                  </p>
                )}

                {/* Delete button (overlay, top-right on hover) */}
                <div className="mt-2 flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-md text-[#A1A1AA] opacity-0 transition-all duration-150 hover:bg-[#27272A] hover:text-[#EF4444] group-hover:opacity-100"
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
                      className="border-white/[0.06] bg-[#18181B]"
                    >
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-mono text-[#FAFAFA]">
                          Delete project?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="font-sans text-[#A1A1AA]">
                          This will permanently delete &quot;{project.name}&quot;
                          and all its endpoint mappings and server
                          configurations. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="border-white/[0.06] bg-[#09090B]/50">
                        <AlertDialogCancel className="border-white/[0.06] bg-[#27272A] text-[#FAFAFA] hover:bg-[#3f3f46] hover:text-[#FAFAFA]">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          disabled={deletingId === project.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(project.id);
                          }}
                          className="bg-[#EF4444] text-white hover:bg-[#DC2626]"
                        >
                          {deletingId === project.id
                            ? "Deleting..."
                            : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Bottom stats footer */}
              <div className="flex items-center gap-4 border-t border-white/[0.06] px-5 py-3">
                <span className="inline-flex items-center gap-1.5 text-[12px] text-[#71717A]">
                  <Wrench className="h-3.5 w-3.5" />
                  {project.pathCount}{" "}
                  {project.pathCount === 1 ? "endpoint" : "endpoints"}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[12px] text-[#71717A]">
                  <Clock className="h-3.5 w-3.5" />
                  {formatRelativeDate(project.updatedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
