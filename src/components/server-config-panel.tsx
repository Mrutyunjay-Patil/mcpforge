"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface ServerConfig {
  transport: string;
  authMethod: string;
  serverName: string;
  serverVersion: string;
  baseUrl: string;
  port: number;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function ServerConfigPanel({ projectId }: { projectId: string }) {
  const [config, setConfig] = useState<ServerConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[]>
  >({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestConfigRef = useRef<ServerConfig | null>(null);

  // Fetch config on mount
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch(`/api/projects/${projectId}/config`);
        if (!res.ok) {
          const data = await res.json();
          toast.error(data.error || "Failed to load config");
          return;
        }
        const data = await res.json();
        setConfig(data.config);
        latestConfigRef.current = data.config;
      } catch {
        toast.error("Failed to load config");
      } finally {
        setLoading(false);
      }
    }
    fetchConfig();
  }, [projectId]);

  // Save config to server
  const saveConfig = useCallback(
    async (configToSave: ServerConfig) => {
      setSaveStatus("saving");
      setFieldErrors({});
      try {
        const res = await fetch(`/api/projects/${projectId}/config`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(configToSave),
        });
        const data = await res.json();
        if (!res.ok) {
          setSaveStatus("error");
          if (data.fieldErrors) {
            setFieldErrors(data.fieldErrors);
          }
          return;
        }
        setSaveStatus("saved");
        // Reset to idle after 2 seconds
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
      }
    },
    [projectId]
  );

  // Debounced auto-save
  const debouncedSave = useCallback(
    (updatedConfig: ServerConfig) => {
      latestConfigRef.current = updatedConfig;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        saveConfig(updatedConfig);
      }, 500);
    },
    [saveConfig]
  );

  // Update a config field and trigger debounced save
  function updateField<K extends keyof ServerConfig>(
    key: K,
    value: ServerConfig[K]
  ) {
    if (!config) return;
    const updated = { ...config, [key]: value };
    setConfig(updated);
    debouncedSave(updated);
  }

  if (loading) {
    return (
      <section aria-label="Server configuration" className="space-y-6">
        <Skeleton className="h-6 w-48 bg-[#21262d]" />
        <Skeleton className="h-10 w-full bg-[#21262d]" />
        <Skeleton className="h-10 w-full bg-[#21262d]" />
        <Skeleton className="h-10 w-full bg-[#21262d]" />
        <Skeleton className="h-10 w-full bg-[#21262d]" />
        <Skeleton className="h-10 w-full bg-[#21262d]" />
      </section>
    );
  }

  if (!config) {
    return (
      <section aria-label="Server configuration">
        <p className="text-sm text-[#8b949e]">
          Unable to load server configuration.
        </p>
      </section>
    );
  }

  const showPort =
    config.transport === "sse" || config.transport === "streamable-http";

  return (
    <section aria-label="Server configuration" className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#c9d1d9]">Server Config</h3>
        <span
          className={`text-xs font-medium ${
            saveStatus === "saving"
              ? "text-[#8b949e]"
              : saveStatus === "saved"
                ? "text-[#3fb950]"
                : saveStatus === "error"
                  ? "text-[#f85149]"
                  : "text-transparent"
          }`}
          aria-live="polite"
        >
          {saveStatus === "saving"
            ? "Saving..."
            : saveStatus === "saved"
              ? "Saved"
              : saveStatus === "error"
                ? "Failed to save"
                : "\u00A0"}
        </span>
      </div>

      {/* Transport */}
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-[#8b949e]">Transport</legend>
        <RadioGroup
          value={config.transport}
          onValueChange={(value: string) => updateField("transport", value)}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="stdio" id="transport-stdio" />
            <Label htmlFor="transport-stdio">stdio</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="sse" id="transport-sse" />
            <Label htmlFor="transport-sse">SSE</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem
              value="streamable-http"
              id="transport-streamable"
            />
            <Label htmlFor="transport-streamable">Streamable HTTP</Label>
          </div>
        </RadioGroup>
        {fieldErrors.transport && (
          <p className="text-xs text-destructive" id="transport-error">
            {fieldErrors.transport[0]}
          </p>
        )}
      </fieldset>

      {/* Port (conditional) */}
      {showPort && (
        <div className="space-y-1.5">
          <Label htmlFor="config-port" className="text-[#8b949e]">Port</Label>
          <Input
            id="config-port"
            type="number"
            min={1024}
            max={65535}
            value={config.port}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) {
                updateField("port", val);
              }
            }}
            className="bg-[#0d1117] border-[#30363d] text-[#c9d1d9] focus:border-[#58a6ff]"
            aria-invalid={!!fieldErrors.port}
            aria-describedby={fieldErrors.port ? "port-error" : undefined}
          />
          {fieldErrors.port && (
            <p className="text-xs text-destructive" id="port-error">
              {fieldErrors.port[0]}
            </p>
          )}
        </div>
      )}

      {/* Auth Method */}
      <div className="space-y-1.5">
        <Label htmlFor="config-auth" className="text-[#8b949e]">Auth Method</Label>
        <Select
          value={config.authMethod}
          onValueChange={(value) => {
            if (value) updateField("authMethod", value);
          }}
        >
          <SelectTrigger id="config-auth" className="w-full bg-[#0d1117] border-[#30363d] text-[#c9d1d9]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="api-key">API Key</SelectItem>
            <SelectItem value="bearer">Bearer Token</SelectItem>
            <SelectItem value="basic">Basic Auth</SelectItem>
          </SelectContent>
        </Select>
        {fieldErrors.authMethod && (
          <p className="text-xs text-destructive" id="auth-error">
            {fieldErrors.authMethod[0]}
          </p>
        )}
        {config.authMethod !== "none" && (
          <p className="text-xs text-[#8b949e]">
            Credentials will be read from environment variables in the generated
            .env file.
          </p>
        )}
      </div>

      {/* Server Name */}
      <div className="space-y-1.5">
        <Label htmlFor="config-name" className="text-[#8b949e]">Server Name</Label>
        <Input
          id="config-name"
          type="text"
          maxLength={50}
          value={config.serverName}
          onChange={(e) => updateField("serverName", e.target.value)}
          className="bg-[#0d1117] border-[#30363d] text-[#c9d1d9] focus:border-[#58a6ff]"
          aria-invalid={!!fieldErrors.serverName}
          aria-describedby={
            fieldErrors.serverName ? "name-error" : undefined
          }
        />
        {fieldErrors.serverName && (
          <p className="text-xs text-destructive" id="name-error">
            {fieldErrors.serverName[0]}
          </p>
        )}
      </div>

      {/* Server Version */}
      <div className="space-y-1.5">
        <Label htmlFor="config-version" className="text-[#8b949e]">Server Version</Label>
        <Input
          id="config-version"
          type="text"
          placeholder="1.0.0"
          value={config.serverVersion}
          onChange={(e) => updateField("serverVersion", e.target.value)}
          className="bg-[#0d1117] border-[#30363d] text-[#c9d1d9] placeholder:text-[#8b949e] focus:border-[#58a6ff]"
          aria-invalid={!!fieldErrors.serverVersion}
          aria-describedby={
            fieldErrors.serverVersion ? "version-error" : "version-hint"
          }
        />
        <p className="text-xs text-[#8b949e]" id="version-hint">
          Semver format: x.y.z
        </p>
        {fieldErrors.serverVersion && (
          <p className="text-xs text-destructive" id="version-error">
            {fieldErrors.serverVersion[0]}
          </p>
        )}
      </div>

      {/* Base URL */}
      <div className="space-y-1.5">
        <Label htmlFor="config-base-url" className="text-[#8b949e]">Base URL</Label>
        <Input
          id="config-base-url"
          type="text"
          placeholder="https://api.example.com"
          value={config.baseUrl}
          onChange={(e) => updateField("baseUrl", e.target.value)}
          className="bg-[#0d1117] border-[#30363d] text-[#c9d1d9] placeholder:text-[#8b949e] focus:border-[#58a6ff]"
          aria-invalid={!!fieldErrors.baseUrl}
          aria-describedby={
            fieldErrors.baseUrl ? "baseurl-error" : undefined
          }
        />
        {fieldErrors.baseUrl && (
          <p className="text-xs text-destructive" id="baseurl-error">
            {fieldErrors.baseUrl[0]}
          </p>
        )}
      </div>
    </section>
  );
}
