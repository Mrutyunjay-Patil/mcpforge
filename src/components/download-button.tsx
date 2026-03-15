"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, Loader2 } from "lucide-react";

interface DownloadButtonProps {
  projectId: string;
  projectName: string;
}

export function DownloadButton({ projectId, projectName }: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      // Step 1: Generate (creates a version snapshot)
      const genRes = await fetch(`/api/projects/${projectId}/generate`, {
        method: "POST",
      });
      if (!genRes.ok) {
        const data = await genRes.json();
        toast.error(data.error || "Failed to generate project");
        return;
      }

      // Step 2: Download the zip
      const dlRes = await fetch(`/api/projects/${projectId}/download`);
      if (!dlRes.ok) {
        // Try to parse JSON error, but response might not be JSON
        try {
          const data = await dlRes.json();
          toast.error(data.error || "Failed to download project");
        } catch {
          toast.error("Failed to download project");
        }
        return;
      }

      // Trigger browser download
      const blob = await dlRes.blob();
      const kebabName = projectName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mcpforge-${kebabName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast("Project downloaded");
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      aria-label={loading ? "Generating project" : "Download project"}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download
        </>
      )}
    </Button>
  );
}
