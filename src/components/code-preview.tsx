"use client";

import { useCallback, useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";

type FileKey =
  | "src/index.ts"
  | "package.json"
  | "tsconfig.json"
  | ".env.example"
  | "README.md";

interface TabMeta {
  key: FileKey;
  label: string;
  language: string;
}

const TABS: TabMeta[] = [
  { key: "src/index.ts", label: "index.ts", language: "typescript" },
  { key: "package.json", label: "package.json", language: "json" },
  { key: "tsconfig.json", label: "tsconfig.json", language: "json" },
  { key: ".env.example", label: ".env.example", language: "bash" },
  { key: "README.md", label: "README.md", language: "markdown" },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function CodePreview({ projectId }: { projectId: string }) {
  const [files, setFiles] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/generate`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to generate code");
        return;
      }
      const data = await res.json();
      setFiles(data.files);
    } catch {
      setError("Failed to generate code");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    generate();
  }, [generate]);

  async function copyToClipboard(content: string, tabKey: string) {
    try {
      await navigator.clipboard.writeText(content);
      toast("Copied to clipboard");
      setCopiedTab(tabKey);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }

  if (loading) {
    return (
      <section aria-label="Code preview" className="space-y-4">
        <Skeleton className="h-8 w-full bg-[#21262d]" />
        <Skeleton className="h-64 w-full bg-[#21262d]" />
      </section>
    );
  }

  if (error) {
    return (
      <section aria-label="Code preview">
        <p className="text-sm text-destructive">{error}</p>
      </section>
    );
  }

  if (!files) {
    return (
      <section aria-label="Code preview">
        <p className="text-sm text-[#8b949e]">
          No generated files available.
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Code preview">
      <Tabs defaultValue="src/index.ts">
        <TabsList className="flex-wrap bg-[#161b22] border border-[#30363d]">
          {TABS.map((tab) => {
            const content = files[tab.key] ?? "";
            const size = new TextEncoder().encode(content).length;
            return (
              <TabsTrigger key={tab.key} value={tab.key} className="data-[state=active]:bg-[#21262d] data-[state=active]:text-[#c9d1d9] text-[#8b949e]">
                {tab.label}{" "}
                <span className="ml-1 text-xs text-[#8b949e]">
                  ({formatSize(size)})
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {TABS.map((tab) => {
          const content = files[tab.key] ?? "";
          return (
            <TabsContent key={tab.key} value={tab.key}>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="absolute top-2 right-2 z-10 text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]"
                  onClick={() => copyToClipboard(content, tab.key)}
                  aria-label={`Copy ${tab.label} to clipboard`}
                  disabled={copiedTab === tab.key}
                >
                  {copiedTab === tab.key ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <div className="max-h-[500px] overflow-auto rounded-md border border-[#30363d]">
                  <SyntaxHighlighter
                    language={tab.language}
                    style={oneDark}
                    customStyle={{
                      margin: 0,
                      borderRadius: "0.375rem",
                      fontSize: "0.8125rem",
                    }}
                    showLineNumbers
                  >
                    {content}
                  </SyntaxHighlighter>
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
}
