import Link from "next/link";
import { ArrowRight, Github, Upload, FileCode, Terminal, Zap, Layers, Shield, GitBranch, FolderOpen, Radio, Eye, MousePointerClick } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA]">
      {/* ── Nav ── */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-[#09090B]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
            <span className="font-mono text-[15px] font-bold text-[#FAFAFA]">MCPForge</span>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/Mrutyunjay-Patil/mcpforge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center rounded-md px-3 py-1.5 text-[#A1A1AA] transition-colors duration-150 hover:text-[#FAFAFA]"
            >
              <Github className="h-4 w-4" />
            </a>
            <Link
              href="/auth/signin"
              className="rounded-md px-3 py-1.5 font-sans text-[13px] text-[#A1A1AA] transition-colors duration-150 hover:text-[#FAFAFA]"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-md bg-[#F97316] px-3.5 py-1.5 font-sans text-[13px] font-medium text-black transition-colors duration-150 hover:bg-[#FB923C]"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-14">
        {/* Grid background */}
        <div
          className="forge-grid pointer-events-none absolute inset-0"
          style={{
            maskImage: "radial-gradient(ellipse 70% 50% at 50% 0%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 50% 0%, black, transparent)",
          }}
        />
        {/* Glow */}
        <div className="forge-glow pointer-events-none absolute left-1/2 top-0 h-[700px] w-[1000px] -translate-x-1/2" />

        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-28 md:pb-28 md:pt-36">
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-[#18181B] px-3.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
              <span className="font-sans text-[12px] text-[#A1A1AA]">Open source</span>
            </div>
          </div>

          <h1 className="mx-auto max-w-[740px] text-center font-mono text-[40px] font-bold leading-[1.1] tracking-[-0.03em] text-[#FAFAFA] md:text-[56px]">
            Forge your API into an{" "}
            <span className="text-[#F97316]">MCP server</span>
          </h1>

          <p className="mx-auto mt-5 max-w-[500px] text-center font-sans text-[16px] leading-[1.6] text-[#A1A1AA]">
            Upload an OpenAPI spec. Visually map each endpoint to Tools, Resources, and Templates. Download a production-ready TypeScript MCP server.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-1.5 rounded-md bg-[#F97316] px-4 py-2 font-sans text-[14px] font-medium text-black transition-colors duration-150 hover:bg-[#FB923C]"
            >
              Start forging
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://github.com/Mrutyunjay-Patil/mcpforge"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] px-4 py-2 font-sans text-[14px] text-[#FAFAFA] transition-colors duration-150 hover:border-[rgba(249,115,22,0.25)] hover:bg-[#18181B]"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </div>

          {/* ── Hero Visual: App Mockup ── */}
          <div className="mx-auto mt-16 max-w-[960px]">
            <div className="overflow-hidden rounded-md border border-white/[0.06] bg-[#09090B] shadow-2xl shadow-black/60">
              {/* Window chrome */}
              <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#18181B] px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#F87171]/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FACC15]/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#4ADE80]/70" />
                  </div>
                  <span className="font-mono text-[11px] text-[#71717A]">MCPForge -- Petstore API</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[#F97316] px-2.5 py-0.5 font-sans text-[11px] font-medium text-black">Download Server</span>
                </div>
              </div>

              {/* App content */}
              <div className="flex min-h-[420px]">
                {/* Endpoint table */}
                <div className="flex-1 p-4">
                  {/* Summary bar */}
                  <div className="mb-3 flex items-center gap-3 font-sans text-[12px] text-[#71717A]">
                    <span>10 endpoints</span>
                    <span className="text-white/[0.06]">|</span>
                    <span>5 tools</span>
                    <span className="text-white/[0.06]">|</span>
                    <span>3 resources</span>
                    <span className="text-white/[0.06]">|</span>
                    <span>2 templates</span>
                  </div>

                  {/* Table header */}
                  <div className="grid grid-cols-[64px_1fr_120px_100px] gap-2 border-b border-white/[0.06] pb-2 font-mono text-[10px] font-medium uppercase tracking-wider text-[#71717A]">
                    <span>Method</span>
                    <span>Path</span>
                    <span>Operation</span>
                    <span>MCP Type</span>
                  </div>

                  {/* Rows */}
                  {[
                    { method: "GET", color: "text-[#4ADE80]", bg: "bg-[rgba(34,197,94,0.15)]", path: "/pets", op: "listPets", type: "Resource" },
                    { method: "POST", color: "text-[#60A5FA]", bg: "bg-[rgba(59,130,246,0.15)]", path: "/pets", op: "createPet", type: "Tool" },
                    { method: "GET", color: "text-[#4ADE80]", bg: "bg-[rgba(34,197,94,0.15)]", path: "/pets/{petId}", op: "getPet", type: "Template" },
                    { method: "PUT", color: "text-[#FACC15]", bg: "bg-[rgba(234,179,8,0.15)]", path: "/pets/{petId}", op: "updatePet", type: "Tool" },
                    { method: "DELETE", color: "text-[#F87171]", bg: "bg-[rgba(239,68,68,0.15)]", path: "/pets/{petId}", op: "deletePet", type: "Tool" },
                    { method: "GET", color: "text-[#4ADE80]", bg: "bg-[rgba(34,197,94,0.15)]", path: "/store/inventory", op: "getInventory", type: "Resource" },
                    { method: "POST", color: "text-[#60A5FA]", bg: "bg-[rgba(59,130,246,0.15)]", path: "/store/orders", op: "placeOrder", type: "Tool" },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-[64px_1fr_120px_100px] items-center gap-2 border-b border-white/[0.04] py-2 text-[12px]">
                      <span className={`inline-flex w-fit rounded-[3px] ${row.bg} px-1.5 py-0.5 font-mono text-[10px] font-semibold ${row.color}`}>
                        {row.method}
                      </span>
                      <span className="font-mono text-[#FAFAFA]">{row.path}</span>
                      <span className="font-sans text-[#A1A1AA]">{row.op}</span>
                      <span className="inline-flex w-fit rounded-[3px] border border-white/[0.06] bg-[#18181B] px-1.5 py-0.5 font-sans text-[10px] text-[#A1A1AA]">
                        {row.type}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Config sidebar */}
                <div className="hidden w-[250px] border-l border-white/[0.06] bg-[#18181B]/60 p-4 md:block">
                  <div className="mb-4 font-mono text-[10px] font-medium uppercase tracking-widest text-[#71717A]">Server Config</div>
                  <div className="space-y-3.5">
                    <div>
                      <div className="mb-1.5 font-sans text-[11px] text-[#A1A1AA]">Transport</div>
                      <div className="flex gap-1">
                        {["stdio", "SSE", "HTTP"].map((t, i) => (
                          <span
                            key={t}
                            className={`rounded-[3px] px-2 py-0.5 font-mono text-[10px] ${
                              i === 0
                                ? "bg-[rgba(249,115,22,0.15)] text-[#F97316] ring-1 ring-[rgba(249,115,22,0.25)]"
                                : "bg-[#27272A] text-[#71717A]"
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1.5 font-sans text-[11px] text-[#A1A1AA]">Auth</div>
                      <div className="rounded-[3px] border border-white/[0.06] bg-[#09090B] px-2 py-1 font-sans text-[11px] text-[#FAFAFA]">Bearer Token</div>
                    </div>
                    <div>
                      <div className="mb-1.5 font-sans text-[11px] text-[#A1A1AA]">Server Name</div>
                      <div className="rounded-[3px] border border-white/[0.06] bg-[#09090B] px-2 py-1 font-mono text-[11px] text-[#FAFAFA]">petstore-api</div>
                    </div>
                    <div>
                      <div className="mb-1.5 font-sans text-[11px] text-[#A1A1AA]">Version</div>
                      <div className="rounded-[3px] border border-white/[0.06] bg-[#09090B] px-2 py-1 font-mono text-[11px] text-[#FAFAFA]">1.0.0</div>
                    </div>
                    <div>
                      <div className="mb-1.5 font-sans text-[11px] text-[#A1A1AA]">Base URL</div>
                      <div className="truncate rounded-[3px] border border-white/[0.06] bg-[#09090B] px-2 py-1 font-mono text-[11px] text-[#FAFAFA]">https://api.petstore.com</div>
                    </div>
                    <div>
                      <div className="mb-1.5 font-sans text-[11px] text-[#A1A1AA]">Description</div>
                      <div className="rounded-[3px] border border-white/[0.06] bg-[#09090B] px-2 py-1 font-sans text-[11px] text-[#A1A1AA]">Petstore API MCP server</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three-Step Flow ── */}
      <section className="border-t border-white/[0.06] px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto max-w-[600px] text-center">
            <h2 className="font-mono text-[24px] font-bold tracking-[-0.02em] text-[#FAFAFA] md:text-[32px]">
              Three steps. Zero config files.
            </h2>
            <p className="mt-3 font-sans text-[15px] text-[#A1A1AA]">
              From raw spec to running server in under a minute.
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-md border border-white/[0.06] bg-white/[0.06] md:grid-cols-3">
            {/* Step 01 */}
            <div className="bg-[#09090B] p-6 md:p-8">
              <div className="mb-3 font-mono text-[13px] font-semibold text-[#F97316]">01</div>
              <h3 className="font-mono text-[16px] font-semibold text-[#FAFAFA]">Upload your spec</h3>
              <p className="mt-2 font-sans text-[13px] leading-[1.6] text-[#A1A1AA]">
                Paste JSON or YAML, drag-and-drop a file, or fetch from a URL. We parse it with swagger-parser and extract every endpoint.
              </p>
              <div className="mt-5 rounded-md border border-dashed border-white/[0.06] bg-[#18181B]/50 px-4 py-6 text-center">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-md bg-[#27272A]">
                  <Upload className="h-4 w-4 text-[#71717A]" />
                </div>
                <div className="font-mono text-[11px] text-[#71717A]">Drop openapi.yaml here</div>
                <div className="mt-1 font-sans text-[10px] text-[#71717A]/60">or click to browse</div>
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-[#09090B] p-6 md:p-8">
              <div className="mb-3 font-mono text-[13px] font-semibold text-[#F97316]">02</div>
              <h3 className="font-mono text-[16px] font-semibold text-[#FAFAFA]">Map endpoints</h3>
              <p className="mt-2 font-sans text-[13px] leading-[1.6] text-[#A1A1AA]">
                Visual table of every route. Smart defaults assign Tools, Resources, and Templates. Override anything with a dropdown.
              </p>
              <div className="mt-5 space-y-1.5">
                {[
                  { m: "GET", color: "text-[#4ADE80]", bg: "bg-[rgba(34,197,94,0.15)]", p: "/pets", t: "Resource" },
                  { m: "POST", color: "text-[#60A5FA]", bg: "bg-[rgba(59,130,246,0.15)]", p: "/pets", t: "Tool" },
                  { m: "GET", color: "text-[#4ADE80]", bg: "bg-[rgba(34,197,94,0.15)]", p: "/pets/{id}", t: "Template" },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-[3px] bg-[#18181B]/50 px-2.5 py-1.5 text-[11px]">
                    <span className={`rounded-[2px] ${r.bg} px-1 py-0.5 font-mono text-[10px] font-semibold ${r.color}`}>{r.m}</span>
                    <span className="flex-1 font-mono text-[#A1A1AA]">{r.p}</span>
                    <span className="rounded-[2px] bg-[#27272A] px-1.5 py-0.5 font-sans text-[10px] text-[#71717A]">{r.t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-[#09090B] p-6 md:p-8">
              <div className="mb-3 font-mono text-[13px] font-semibold text-[#F97316]">03</div>
              <h3 className="font-mono text-[16px] font-semibold text-[#FAFAFA]">Download &amp; run</h3>
              <p className="mt-2 font-sans text-[13px] leading-[1.6] text-[#A1A1AA]">
                Get a complete TypeScript project with MCP SDK, Zod schemas, and auth. Unzip, install, start.
              </p>
              <div className="mt-5 rounded-md bg-[#18181B]/50 p-3 font-mono text-[11px] leading-[1.8] text-[#A1A1AA]">
                <div><span className="text-[#F97316]">$</span> unzip mcpforge-petstore.zip</div>
                <div><span className="text-[#F97316]">$</span> cd petstore-api</div>
                <div><span className="text-[#F97316]">$</span> npm install</div>
                <div><span className="text-[#F97316]">$</span> npm start</div>
                <div className="mt-1 text-[#4ADE80]">MCP server running on stdio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Code Output Section ── */}
      <section className="border-t border-white/[0.06] px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid items-start gap-12 md:grid-cols-2">
            {/* Left: description + file list */}
            <div className="pt-4">
              <h2 className="font-mono text-[24px] font-bold tracking-[-0.02em] text-[#FAFAFA] md:text-[32px]">
                Production-ready output
              </h2>
              <p className="mt-3 max-w-[420px] font-sans text-[15px] leading-[1.6] text-[#A1A1AA]">
                Every generated server includes typed tools, resources, auth handling, and transport configuration. Not a prototype -- real code you ship.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { file: "src/index.ts", desc: "MCP server with all tools and resources", icon: FileCode },
                  { file: "package.json", desc: "Dependencies for your chosen transport", icon: Layers },
                  { file: ".env.example", desc: "Auth variables and config", icon: Shield },
                  { file: "tsconfig.json", desc: "TypeScript setup for Node.js", icon: FileCode },
                  { file: "README.md", desc: "Install and run instructions", icon: FileCode },
                ].map((f) => (
                  <div key={f.file} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] bg-[#18181B] ring-1 ring-white/[0.06]">
                      <f.icon className="h-2.5 w-2.5 text-[#F97316]" />
                    </div>
                    <div>
                      <div className="font-mono text-[13px] text-[#FAFAFA]">{f.file}</div>
                      <div className="font-sans text-[12px] text-[#71717A]">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: code block */}
            <div className="overflow-hidden rounded-md border border-white/[0.06] bg-[#18181B]">
              <div className="flex items-center gap-4 border-b border-white/[0.06] px-4 py-2">
                <span className="border-b-2 border-[#F97316] pb-1 font-mono text-[12px] text-[#FAFAFA]">index.ts</span>
                <span className="pb-1 font-mono text-[12px] text-[#71717A]">package.json</span>
                <span className="pb-1 font-mono text-[12px] text-[#71717A]">.env</span>
              </div>
              <div className="overflow-x-auto p-4">
                <pre className="font-mono text-[12px] leading-[1.7]">
<span className="text-[#71717A]">{"// Auto-generated by MCPForge"}</span>{"\n"}
<span className="text-[#F97316]">import</span>{" { McpServer } "}<span className="text-[#F97316]">from</span>{" "}<span className="text-[#FB923C]">{'"@modelcontextprotocol/sdk/server/mcp.js"'}</span>{";"}{"\n"}
<span className="text-[#F97316]">import</span>{" { z } "}<span className="text-[#F97316]">from</span>{" "}<span className="text-[#FB923C]">{'"zod"'}</span>{";"}{"\n"}
{"\n"}
<span className="text-[#F97316]">const</span>{" server = "}<span className="text-[#F97316]">new</span>{" McpServer({"}{"\n"}
{"  name: "}<span className="text-[#FB923C]">{'"petstore-api"'}</span>{","}{"\n"}
{"  version: "}<span className="text-[#FB923C]">{'"1.0.0"'}</span>{","}{"\n"}
{"});"}{"\n"}
{"\n"}
{"server."}<span className="text-[#FAFAFA]">tool</span>{"("}<span className="text-[#FB923C]">{'"createPet"'}</span>{", "}<span className="text-[#FB923C]">{'"Create a pet"'}</span>{", {"}{"\n"}
{"  name: z.string(),"}{"\n"}
{"  species: z.string(),"}{"\n"}
{"}, "}<span className="text-[#F97316]">async</span>{" (params) "}<span className="text-[#F97316]">{"=> "}</span>{"{"}{"\n"}
{"  "}<span className="text-[#F97316]">const</span>{" res = "}<span className="text-[#F97316]">await</span>{" fetch("}{"`${BASE_URL}/pets`"}{", {"}{"\n"}
{"    method: "}<span className="text-[#FB923C]">{'"POST"'}</span>{","}{"\n"}
{"    body: JSON.stringify(params),"}{"\n"}
{"  });"}{"\n"}
{"  "}<span className="text-[#F97316]">return</span>{" { content: [{ type: "}<span className="text-[#FB923C]">{'"text"'}</span>{", text:"}{"\n"}
{"    JSON.stringify("}<span className="text-[#F97316]">await</span>{" res.json(), null, 2) }] };"}{"\n"}
{"});"}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="border-t border-white/[0.06] px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-16 max-w-[600px] text-center">
            <h2 className="font-mono text-[24px] font-bold tracking-[-0.02em] text-[#FAFAFA] md:text-[32px]">
              Built for real workflows
            </h2>
            <p className="mt-3 font-sans text-[15px] text-[#A1A1AA]">
              Everything you need to go from spec to server, nothing you don&apos;t.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden rounded-md border border-white/[0.06] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "OpenAPI 3.x", desc: "JSON and YAML. Auto-validated with swagger-parser.", icon: FileCode },
              { title: "Smart mapping", desc: "GET to Resource. Mutations to Tool. Path params to Template.", icon: Zap },
              { title: "Live preview", desc: "See generated code update as you change mappings.", icon: Eye },
              { title: "Bulk actions", desc: "Select endpoints and change types in one click.", icon: MousePointerClick },
              { title: "Three transports", desc: "stdio, SSE, or Streamable HTTP. Your choice.", icon: Radio },
              { title: "Auth built-in", desc: "API Key, Bearer, or Basic Auth in generated .env.", icon: Shield },
              { title: "Version history", desc: "Every download creates a snapshot you can revisit.", icon: GitBranch },
              { title: "Project manager", desc: "Save, search, and manage multiple API conversions.", icon: FolderOpen },
            ].map((f) => (
              <div key={f.title} className="bg-[#09090B] p-5">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-[rgba(249,115,22,0.15)]">
                  <f.icon className="h-4 w-4 text-[#F97316]" />
                </div>
                <div className="font-mono text-[14px] font-semibold text-[#FAFAFA]">{f.title}</div>
                <div className="mt-1 font-sans text-[13px] leading-[1.5] text-[#71717A]">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-white/[0.06] px-6 py-24">
        <div className="relative mx-auto max-w-[1200px] text-center">
          {/* Subtle glow behind CTA */}
          <div className="forge-glow pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2" />
          <div className="relative">
            <h2 className="font-mono text-[24px] font-bold tracking-[-0.02em] text-[#FAFAFA] md:text-[32px]">
              Ready to forge your API?
            </h2>
            <p className="mt-3 font-sans text-[15px] text-[#A1A1AA]">
              Free and open source. No credit card required.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center gap-1.5 rounded-md bg-[#F97316] px-5 py-2.5 font-sans text-[14px] font-medium text-black transition-colors duration-150 hover:bg-[#FB923C]"
              >
                Get started free
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] px-6 py-6">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
            <span className="font-mono text-[12px] text-[#71717A]">MCPForge</span>
          </div>
          <a
            href="https://github.com/Mrutyunjay-Patil/mcpforge"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-[12px] text-[#71717A] transition-colors duration-150 hover:text-[#A1A1AA]"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
