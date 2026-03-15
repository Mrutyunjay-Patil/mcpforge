"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Loader2, Upload, Link as LinkIcon, FileText, X, ArrowLeft } from "lucide-react";
import { detectFormat } from "@/lib/openapi-parser";

const ALLOWED_EXTENSIONS = [".json", ".yaml", ".yml"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface FieldErrors {
  name?: string;
  file?: string;
  url?: string;
  spec?: string;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [projectName, setProjectName] = useState("");
  const [activeTab, setActiveTab] = useState<string | number>("upload");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Upload tab state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Paste tab state
  const [pastedContent, setPastedContent] = useState("");

  // URL tab state
  const [specUrl, setSpecUrl] = useState("");
  const [fetchedContent, setFetchedContent] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchSuccess, setFetchSuccess] = useState(false);

  // --- Validation helpers ---

  function validateProjectName(value: string): string | undefined {
    if (!value.trim()) return "Project name is required";
    if (value.length > 100) return "Project name must be under 100 characters";
    return undefined;
  }

  function validateFileExtension(filename: string): boolean {
    const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
    return ALLOWED_EXTENSIONS.includes(ext);
  }

  // --- File handling ---

  const processFile = useCallback((file: File) => {
    setErrors((prev) => ({ ...prev, file: undefined }));
    setApiError(null);

    if (!validateFileExtension(file.name)) {
      setErrors((prev) => ({
        ...prev,
        file: "Only .json, .yaml, and .yml files are accepted",
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        file: "File must be under 5MB",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      setSelectedFile(file);
    };
    reader.onerror = () => {
      setErrors((prev) => ({
        ...prev,
        file: "Failed to read file",
      }));
    };
    reader.readAsText(file);
  }, []);

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset the input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleRemoveFile() {
    setSelectedFile(null);
    setFileContent(null);
    setErrors((prev) => ({ ...prev, file: undefined }));
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  // --- URL fetch ---

  async function handleFetchUrl() {
    setErrors((prev) => ({ ...prev, url: undefined }));
    setApiError(null);
    setFetchedContent(null);
    setFetchSuccess(false);

    let url: URL;
    try {
      url = new URL(specUrl);
      if (!url.protocol.startsWith("http")) throw new Error();
    } catch {
      setErrors((prev) => ({ ...prev, url: "Invalid URL format" }));
      return;
    }

    setIsFetching(true);

    try {
      const res = await fetch("/api/fetch-spec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.toString() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors((prev) => ({
          ...prev,
          url: data.error || `Failed to fetch: ${res.status}`,
        }));
        return;
      }

      setFetchedContent(data.content);
      setFetchSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setErrors((prev) => ({
        ...prev,
        url: `Failed to fetch: ${msg}`,
      }));
    } finally {
      setIsFetching(false);
    }
  }

  // --- Submit ---

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newErrors: FieldErrors = {};
    setApiError(null);

    // Validate project name
    const nameError = validateProjectName(projectName);
    if (nameError) newErrors.name = nameError;

    // Get spec content based on active tab
    let specContent: string | null = null;

    if (activeTab === "upload") {
      specContent = fileContent;
    } else if (activeTab === "paste") {
      specContent = pastedContent.trim() || null;
    } else if (activeTab === "url") {
      specContent = fetchedContent;
    }

    if (!specContent) {
      newErrors.spec =
        "No content provided. Please upload a file, paste content, or fetch from a URL.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Detect format
    const specFormat = detectFormat(specContent!);

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName.trim(),
          specContent,
          specFormat,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "An unexpected error occurred");
        return;
      }

      toast.success("Project created successfully");
      router.push(`/projects/${data.id}`);
    } catch {
      setApiError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1 text-[13px] text-[#71717A] transition-colors duration-150 hover:text-[#A1A1AA]"
      >
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </Link>

      <h1 className="mb-8 font-mono text-2xl font-semibold tracking-tight text-[#FAFAFA]">
        Create New Project
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Project Name */}
        <div className="mb-6 rounded-md border border-white/[0.06] bg-[#18181B]">
          <div className="border-b border-white/[0.06] px-5 py-3">
            <h2 className="font-mono text-[14px] font-medium text-[#FAFAFA]">Project Details</h2>
          </div>
          <div className="p-5">
            <div className="space-y-1.5">
              <Label htmlFor="project-name" className="font-sans text-[13px] text-[#A1A1AA]">
                Project Name
              </Label>
              <Input
                id="project-name"
                type="text"
                placeholder="e.g., Petstore MCP Server"
                value={projectName}
                onChange={(e) => {
                  setProjectName(e.target.value);
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                required
                disabled={isSubmitting}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "project-name-error" : undefined}
                className="h-9 rounded-md border-white/[0.06] bg-[#09090B] text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] focus-visible:border-[#F97316] focus-visible:ring-0"
              />
              {errors.name && (
                <p
                  id="project-name-error"
                  role="alert"
                  className="text-[13px] text-[#EF4444]"
                >
                  {errors.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Spec Input Tabs */}
        <div className="mb-6 rounded-md border border-white/[0.06] bg-[#18181B]">
          <div className="border-b border-white/[0.06] px-5 py-3">
            <h2 className="font-mono text-[14px] font-medium text-[#FAFAFA]">OpenAPI Specification</h2>
          </div>
          <div className="p-5">
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value);
                setErrors((prev) => ({ ...prev, spec: undefined }));
              }}
            >
              <TabsList className="mb-4 w-full border-b border-white/[0.06] bg-transparent p-0 rounded-none h-auto">
                <TabsTrigger
                  value="upload"
                  className="rounded-none border-b-2 border-transparent bg-transparent px-3 py-2 text-[13px] text-[#71717A] transition-colors duration-150 data-[state=active]:border-[#F97316] data-[state=active]:bg-transparent data-[state=active]:text-[#FAFAFA] data-[state=active]:shadow-none hover:text-[#FAFAFA]"
                >
                  <Upload className="size-4" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger
                  value="paste"
                  className="rounded-none border-b-2 border-transparent bg-transparent px-3 py-2 text-[13px] text-[#71717A] transition-colors duration-150 data-[state=active]:border-[#F97316] data-[state=active]:bg-transparent data-[state=active]:text-[#FAFAFA] data-[state=active]:shadow-none hover:text-[#FAFAFA]"
                >
                  <FileText className="size-4" />
                  Paste Content
                </TabsTrigger>
                <TabsTrigger
                  value="url"
                  className="rounded-none border-b-2 border-transparent bg-transparent px-3 py-2 text-[13px] text-[#71717A] transition-colors duration-150 data-[state=active]:border-[#F97316] data-[state=active]:bg-transparent data-[state=active]:text-[#FAFAFA] data-[state=active]:shadow-none hover:text-[#FAFAFA]"
                >
                  <LinkIcon className="size-4" />
                  Fetch from URL
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Upload File */}
              <TabsContent value="upload">
                {selectedFile ? (
                  <div className="flex items-center justify-between rounded-md border border-white/[0.06] bg-[#09090B] p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="size-5 text-[#71717A]" />
                      <div>
                        <p className="font-sans text-[13px] font-medium text-[#FAFAFA]">
                          {selectedFile.name}
                        </p>
                        <p className="font-sans text-xs text-[#71717A]">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      disabled={isSubmitting}
                      aria-label="Remove file"
                      className="text-[#A1A1AA] hover:bg-[#27272A] hover:text-[#FAFAFA]"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-8 text-center transition-colors duration-150 ${
                      isDragging
                        ? "border-[#F97316] bg-[rgba(249,115,22,0.15)]"
                        : "border-white/[0.06] hover:border-[rgba(249,115,22,0.25)]"
                    }`}
                    aria-label="Upload OpenAPI specification file"
                  >
                    <Upload className="mb-3 size-8 text-[#71717A]" />
                    <p className="font-sans text-[13px] text-[#A1A1AA]">
                      Drag &amp; drop your OpenAPI spec here, or click to browse
                    </p>
                    <p className="mt-1 font-sans text-xs text-[#71717A]">
                      Supports .json, .yaml, .yml (max 5MB)
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.yaml,.yml"
                  onChange={handleFileInputChange}
                  className="hidden"
                  aria-hidden="true"
                  tabIndex={-1}
                />
                {errors.file && (
                  <p
                    role="alert"
                    className="mt-2 text-[13px] text-[#EF4444]"
                  >
                    {errors.file}
                  </p>
                )}
              </TabsContent>

              {/* Tab 2: Paste Content */}
              <TabsContent value="paste">
                <div className="space-y-1.5">
                  <Label htmlFor="spec-paste" className="font-sans text-[13px] text-[#A1A1AA]">
                    Specification Content
                  </Label>
                  <Textarea
                    id="spec-paste"
                    placeholder="Paste your OpenAPI spec (JSON or YAML)..."
                    value={pastedContent}
                    onChange={(e) => {
                      setPastedContent(e.target.value);
                      if (errors.spec) {
                        setErrors((prev) => ({ ...prev, spec: undefined }));
                      }
                    }}
                    disabled={isSubmitting}
                    className="min-h-[300px] rounded-md border-white/[0.06] bg-[#09090B] font-mono text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] focus-visible:border-[#F97316] focus-visible:ring-0"
                    aria-describedby="paste-char-count"
                  />
                  <p
                    id="paste-char-count"
                    className="font-sans text-xs text-[#71717A]"
                  >
                    {pastedContent.length} characters
                  </p>
                </div>
              </TabsContent>

              {/* Tab 3: Fetch from URL */}
              <TabsContent value="url">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="spec-url" className="font-sans text-[13px] text-[#A1A1AA]">
                      OpenAPI Spec URL
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="spec-url"
                        type="url"
                        placeholder="https://api.example.com/openapi.json"
                        value={specUrl}
                        onChange={(e) => {
                          setSpecUrl(e.target.value);
                          if (errors.url) {
                            setErrors((prev) => ({ ...prev, url: undefined }));
                          }
                          setFetchSuccess(false);
                        }}
                        disabled={isSubmitting || isFetching}
                        aria-invalid={!!errors.url}
                        aria-describedby={errors.url ? "url-error" : undefined}
                        className="h-9 rounded-md border-white/[0.06] bg-[#09090B] text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] focus-visible:border-[#F97316] focus-visible:ring-0"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleFetchUrl}
                        disabled={isSubmitting || isFetching || !specUrl.trim()}
                        className="rounded-md border border-white/[0.06] bg-[#27272A] text-[13px] text-[#A1A1AA] transition-colors duration-150 hover:bg-[#3f3f46] hover:text-[#FAFAFA]"
                      >
                        {isFetching ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Fetching...
                          </>
                        ) : (
                          "Fetch"
                        )}
                      </Button>
                    </div>
                    {errors.url && (
                      <p
                        id="url-error"
                        role="alert"
                        className="text-[13px] text-[#EF4444]"
                      >
                        {errors.url}
                      </p>
                    )}
                  </div>

                  {fetchSuccess && fetchedContent && (
                    <div className="space-y-2">
                      <p className="font-sans text-[13px] font-medium text-[#4ADE80]">
                        Spec fetched successfully
                      </p>
                      <pre className="max-h-48 overflow-auto rounded-md border border-white/[0.06] bg-[#09090B] p-3 text-xs text-[#FAFAFA]">
                        {fetchedContent.slice(0, 2000)}
                        {fetchedContent.length > 2000 && "\n... (truncated)"}
                      </pre>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Error displays */}
        {errors.spec && (
          <Alert variant="destructive" className="mb-4 border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444]">
            <AlertDescription className="text-[#EF4444]">{errors.spec}</AlertDescription>
          </Alert>
        )}

        {apiError && (
          <Alert variant="destructive" className="mb-4 border-[#EF4444]/40 bg-[#EF4444]/10 text-[#EF4444]">
            <AlertDescription className="text-[#EF4444]">{apiError}</AlertDescription>
          </Alert>
        )}

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full rounded-md bg-[#F97316] text-[14px] font-medium text-black transition-colors duration-150 hover:bg-[#EA580C] disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Project"
          )}
        </Button>
      </form>
    </main>
  );
}
