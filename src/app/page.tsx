import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      {/* ── Nav ── */}
      <nav className="fixed top-0 z-50 w-full border-b border-[#30363d]/60 bg-[#0d1117]/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-[#58a6ff]/10 ring-1 ring-[#58a6ff]/20">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-white">MCPForge</span>
          </Link>
          <div className="flex items-center gap-2">
            <a href="https://github.com/Mrutyunjay-Patil/mcpforge" target="_blank" rel="noopener noreferrer" className="rounded-[5px] px-3 py-1.5 text-[13px] text-[#8b949e] transition-colors duration-150 hover:text-[#c9d1d9]">
              <Github className="inline-block h-4 w-4" />
            </a>
            <Link href="/auth/signin" className="rounded-[5px] px-3 py-1.5 text-[13px] text-[#8b949e] transition-colors duration-150 hover:text-[#c9d1d9]">
              Sign in
            </Link>
            <Link href="/auth/signup" className="rounded-[5px] bg-[#f0f0f0] px-3 py-1.5 text-[13px] font-medium text-[#0d1117] transition-colors duration-150 hover:bg-white">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-14">
        {/* Grid background */}
        <div className="pointer-events-none absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(48,54,61,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(48,54,61,0.3) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, black, transparent)',
        }} />
        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2" style={{
          background: 'radial-gradient(ellipse at center, rgba(88,166,255,0.08) 0%, transparent 70%)',
        }} />

        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-28 md:pb-28 md:pt-36">
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#30363d] bg-[#161b22] px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3fb950]" />
              <span className="text-[12px] text-[#8b949e]">Open source on GitHub</span>
            </div>
          </div>

          <h1 className="mx-auto max-w-[720px] text-center text-[40px] font-semibold leading-[1.1] tracking-[-0.03em] text-white md:text-[56px]">
            Turn any API spec into an{" "}
            <span className="text-[#58a6ff]">MCP server</span>
          </h1>

          <p className="mx-auto mt-5 max-w-[480px] text-center text-[16px] leading-[1.6] text-[#8b949e]">
            Upload your OpenAPI spec. Visually map each endpoint. Download a ready-to-run TypeScript MCP server.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href="/auth/signup" className="group inline-flex items-center gap-1.5 rounded-[5px] bg-white px-4 py-2 text-[14px] font-medium text-[#0d1117] transition-all duration-150 hover:bg-[#f0f0f0]">
              Start building
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
            <a href="https://github.com/Mrutyunjay-Patil/mcpforge" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-[5px] border border-[#30363d] px-4 py-2 text-[14px] text-[#c9d1d9] transition-colors duration-150 hover:border-[#484f58] hover:bg-[#161b22]">
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </div>

          {/* ── Hero Visual: App Preview ── */}
          <div className="mx-auto mt-16 max-w-[960px]">
            <div className="rounded-lg border border-[#30363d] bg-[#0d1117] shadow-2xl shadow-black/40">
              {/* Window chrome */}
              <div className="flex items-center justify-between border-b border-[#30363d] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#f85149]/60" />
                    <span className="h-3 w-3 rounded-full bg-[#d29922]/60" />
                    <span className="h-3 w-3 rounded-full bg-[#3fb950]/60" />
                  </div>
                  <span className="ml-3 text-[12px] text-[#484f58]">MCPForge — Petstore API</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="rounded-[4px] bg-[#238636] px-2 py-0.5 text-[11px] font-medium text-white">Download</span>
                </div>
              </div>

              {/* App content mock */}
              <div className="flex min-h-[400px]">
                {/* Endpoint table */}
                <div className="flex-1 p-4">
                  {/* Summary */}
                  <div className="mb-3 flex items-center gap-3 text-[12px] text-[#8b949e]">
                    <span>10 endpoints</span>
                    <span className="text-[#30363d]">/</span>
                    <span>5 tools</span>
                    <span className="text-[#30363d]">/</span>
                    <span>3 resources</span>
                    <span className="text-[#30363d]">/</span>
                    <span>2 templates</span>
                  </div>

                  {/* Table header */}
                  <div className="grid grid-cols-[60px_1fr_120px_100px] gap-2 border-b border-[#21262d] pb-2 text-[11px] font-medium uppercase tracking-wider text-[#484f58]">
                    <span>Method</span>
                    <span>Path</span>
                    <span>Operation</span>
                    <span>MCP Type</span>
                  </div>

                  {/* Rows */}
                  {[
                    { method: "GET", methodColor: "#3fb950", path: "/pets", op: "listPets", type: "Resource" },
                    { method: "POST", methodColor: "#58a6ff", path: "/pets", op: "createPet", type: "Tool" },
                    { method: "GET", methodColor: "#3fb950", path: "/pets/{petId}", op: "getPet", type: "Template" },
                    { method: "PUT", methodColor: "#d29922", path: "/pets/{petId}", op: "updatePet", type: "Tool" },
                    { method: "DELETE", methodColor: "#f85149", path: "/pets/{petId}", op: "deletePet", type: "Tool" },
                    { method: "GET", methodColor: "#3fb950", path: "/store/inventory", op: "getInventory", type: "Resource" },
                    { method: "POST", methodColor: "#58a6ff", path: "/store/orders", op: "placeOrder", type: "Tool" },
                  ].map((row, i) => (
                    <div key={i} className="grid grid-cols-[60px_1fr_120px_100px] items-center gap-2 border-b border-[#21262d]/50 py-2 text-[12px]">
                      <span className="font-mono text-[11px] font-semibold" style={{ color: row.methodColor }}>{row.method}</span>
                      <span className="font-mono text-[#c9d1d9]">{row.path}</span>
                      <span className="text-[#8b949e]">{row.op}</span>
                      <span className="inline-flex w-fit rounded-[4px] border border-[#30363d] bg-[#161b22] px-1.5 py-0.5 text-[10px] text-[#8b949e]">{row.type}</span>
                    </div>
                  ))}
                </div>

                {/* Config panel */}
                <div className="hidden w-[240px] border-l border-[#30363d] bg-[#161b22]/50 p-4 md:block">
                  <div className="mb-4 text-[11px] font-medium uppercase tracking-wider text-[#484f58]">Server Config</div>
                  <div className="space-y-3">
                    <div>
                      <div className="mb-1 text-[11px] text-[#8b949e]">Transport</div>
                      <div className="flex gap-1">
                        {["stdio", "SSE", "HTTP"].map((t, i) => (
                          <span key={t} className={`rounded-[3px] px-2 py-0.5 text-[10px] ${i === 0 ? 'bg-[#58a6ff]/10 text-[#58a6ff] ring-1 ring-[#58a6ff]/30' : 'bg-[#21262d] text-[#484f58]'}`}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-[11px] text-[#8b949e]">Auth</div>
                      <div className="rounded-[4px] border border-[#30363d] bg-[#0d1117] px-2 py-1 text-[11px] text-[#c9d1d9]">None</div>
                    </div>
                    <div>
                      <div className="mb-1 text-[11px] text-[#8b949e]">Server Name</div>
                      <div className="rounded-[4px] border border-[#30363d] bg-[#0d1117] px-2 py-1 font-mono text-[11px] text-[#c9d1d9]">petstore-api</div>
                    </div>
                    <div>
                      <div className="mb-1 text-[11px] text-[#8b949e]">Version</div>
                      <div className="rounded-[4px] border border-[#30363d] bg-[#0d1117] px-2 py-1 font-mono text-[11px] text-[#c9d1d9]">1.0.0</div>
                    </div>
                    <div>
                      <div className="mb-1 text-[11px] text-[#8b949e]">Base URL</div>
                      <div className="truncate rounded-[4px] border border-[#30363d] bg-[#0d1117] px-2 py-1 font-mono text-[11px] text-[#c9d1d9]">api.petstore.com</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Flow Diagram ── */}
      <section className="border-t border-[#30363d]/60 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto max-w-[600px] text-center">
            <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-white md:text-[28px]">
              Three steps. Zero config files.
            </h2>
            <p className="mt-3 text-[15px] text-[#8b949e]">
              From raw spec to running server in under a minute.
            </p>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-lg border border-[#30363d] bg-[#30363d] md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Upload your spec",
                desc: "Paste JSON or YAML, drag-and-drop a file, or fetch from a URL. We parse it with swagger-parser and extract every endpoint.",
                visual: (
                  <div className="mt-4 rounded-[5px] border border-dashed border-[#30363d] bg-[#0d1117]/50 px-4 py-6 text-center">
                    <div className="mx-auto mb-2 h-8 w-8 rounded-[4px] bg-[#21262d] p-1.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#8b949e" strokeWidth="1.5" className="h-full w-full"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <div className="font-mono text-[11px] text-[#484f58]">petstore.json</div>
                  </div>
                ),
              },
              {
                step: "02",
                title: "Map endpoints",
                desc: "Visual table of every route. Smart defaults assign Tools, Resources, and Templates. Override anything with a dropdown.",
                visual: (
                  <div className="mt-4 space-y-1.5">
                    {[
                      { m: "GET", c: "#3fb950", p: "/pets", t: "Resource" },
                      { m: "POST", c: "#58a6ff", p: "/pets", t: "Tool" },
                      { m: "GET", c: "#3fb950", p: "/pets/{id}", t: "Template" },
                    ].map((r, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-[4px] bg-[#0d1117]/50 px-2.5 py-1.5 text-[11px]">
                        <span className="w-8 font-mono font-semibold" style={{ color: r.c }}>{r.m}</span>
                        <span className="flex-1 font-mono text-[#8b949e]">{r.p}</span>
                        <span className="rounded-[3px] bg-[#21262d] px-1.5 py-0.5 text-[10px] text-[#8b949e]">{r.t}</span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                step: "03",
                title: "Download & run",
                desc: "Get a complete TypeScript project with MCP SDK, Zod schemas, and auth. Unzip, install, start.",
                visual: (
                  <div className="mt-4 rounded-[5px] bg-[#0d1117]/50 p-3 font-mono text-[11px] leading-[1.7] text-[#8b949e]">
                    <div><span className="text-[#3fb950]">$</span> unzip mcpforge-petstore.zip</div>
                    <div><span className="text-[#3fb950]">$</span> cd petstore-api</div>
                    <div><span className="text-[#3fb950]">$</span> npm install</div>
                    <div><span className="text-[#3fb950]">$</span> npm start</div>
                    <div className="mt-1 text-[#3fb950]">MCP server running on stdio</div>
                  </div>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="bg-[#0d1117] p-6 md:p-8">
                <div className="mb-3 font-mono text-[12px] text-[#58a6ff]">{item.step}</div>
                <h3 className="text-[16px] font-medium text-white">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.6] text-[#8b949e]">{item.desc}</p>
                {item.visual}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Code Output ── */}
      <section className="border-t border-[#30363d]/60 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid items-start gap-12 md:grid-cols-2">
            <div className="pt-4">
              <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-white md:text-[28px]">
                Production-ready output
              </h2>
              <p className="mt-3 max-w-[400px] text-[15px] leading-[1.6] text-[#8b949e]">
                Every generated server includes typed tools, resources, auth handling, and transport configuration. Not a prototype — real code you ship.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { file: "src/index.ts", desc: "MCP server with all tools and resources" },
                  { file: "package.json", desc: "Dependencies for your chosen transport" },
                  { file: ".env.example", desc: "Auth variables and config" },
                  { file: "tsconfig.json", desc: "TypeScript setup for Node.js" },
                  { file: "README.md", desc: "Install and run instructions" },
                ].map((f) => (
                  <div key={f.file} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] bg-[#161b22] ring-1 ring-[#30363d]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div>
                      <div className="font-mono text-[13px] text-[#c9d1d9]">{f.file}</div>
                      <div className="text-[12px] text-[#484f58]">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code block */}
            <div className="overflow-hidden rounded-lg border border-[#30363d] bg-[#161b22]">
              <div className="flex items-center gap-4 border-b border-[#30363d] px-4 py-2">
                <span className="border-b-2 border-[#f78166] pb-1 text-[12px] text-[#c9d1d9]">index.ts</span>
                <span className="pb-1 text-[12px] text-[#484f58]">package.json</span>
                <span className="pb-1 text-[12px] text-[#484f58]">.env</span>
              </div>
              <div className="overflow-x-auto p-4">
                <pre className="font-mono text-[12px] leading-[1.7]">
{`\x1b`?.length === 0 ? '' : ''}<span style={{color:'#8b949e'}}>{'// Auto-generated by MCPForge'}</span>{'\n'}
<span style={{color:'#ff7b72'}}>import</span>{' { McpServer } '}<span style={{color:'#ff7b72'}}>from</span>{' '}<span style={{color:'#a5d6ff'}}>{'"@modelcontextprotocol/sdk/server/mcp.js"'}</span>{';'}{'\n'}
<span style={{color:'#ff7b72'}}>import</span>{' { z } '}<span style={{color:'#ff7b72'}}>from</span>{' '}<span style={{color:'#a5d6ff'}}>{'"zod"'}</span>{';'}{'\n'}
{'\n'}
<span style={{color:'#ff7b72'}}>const</span>{' server = '}<span style={{color:'#ff7b72'}}>new</span>{' McpServer({'}{'\n'}
{'  name: '}<span style={{color:'#a5d6ff'}}>{'"petstore-api"'}</span>{','}{'\n'}
{'  version: '}<span style={{color:'#a5d6ff'}}>{'"1.0.0"'}</span>{','}{'\n'}
{'});'}{'\n'}
{'\n'}
{'server.'}<span style={{color:'#d2a8ff'}}>tool</span>{'('}<span style={{color:'#a5d6ff'}}>{'"createPet"'}</span>{', '}<span style={{color:'#a5d6ff'}}>{'"Create a pet"'}</span>{', {'}{'\n'}
{'  name: z.string(),'}{'\n'}
{'  species: z.string(),'}{'\n'}
{'}, '}<span style={{color:'#ff7b72'}}>async</span>{' (params) '}<span style={{color:'#ff7b72'}}>{'=> '}</span>{'{'}{'\n'}
{'  '}<span style={{color:'#ff7b72'}}>const</span>{' res = '}<span style={{color:'#ff7b72'}}>await</span>{' fetch(`${BASE_URL}/pets`, {'}{'\n'}
{'    method: '}<span style={{color:'#a5d6ff'}}>{'"POST"'}</span>{','}{'\n'}
{'    body: JSON.stringify(params),'}{'\n'}
{'  });'}{'\n'}
{'  '}<span style={{color:'#ff7b72'}}>return</span>{' { content: [{ type: '}<span style={{color:'#a5d6ff'}}>{'"text"'}</span>{', text:'}{'\n'}
{'    JSON.stringify('}<span style={{color:'#ff7b72'}}>await</span>{' res.json(), null, 2) }] };'}{'\n'}
{'});'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="border-t border-[#30363d]/60 px-6 py-24">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-px overflow-hidden rounded-lg border border-[#30363d] bg-[#30363d] sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "OpenAPI 3.x", desc: "JSON and YAML. Auto-validated with swagger-parser." },
              { title: "Smart mapping", desc: "GET→Resource. Mutations→Tool. Path params→Template." },
              { title: "Live preview", desc: "See generated code update as you change mappings." },
              { title: "Bulk actions", desc: "Select endpoints and change types in one click." },
              { title: "Three transports", desc: "stdio, SSE, or Streamable HTTP. Your choice." },
              { title: "Auth built-in", desc: "API Key, Bearer, or Basic Auth in generated .env." },
              { title: "Version history", desc: "Every download creates a snapshot you can revisit." },
              { title: "Project manager", desc: "Save, search, and manage multiple API conversions." },
            ].map((f) => (
              <div key={f.title} className="bg-[#0d1117] p-5">
                <div className="text-[14px] font-medium text-[#c9d1d9]">{f.title}</div>
                <div className="mt-1 text-[13px] leading-[1.5] text-[#484f58]">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="border-t border-[#30363d]/60 px-6 py-24">
        <div className="mx-auto max-w-[1200px] text-center">
          <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-white md:text-[28px]">
            Ready to convert your API?
          </h2>
          <p className="mt-3 text-[15px] text-[#8b949e]">
            Free and open source. No credit card required.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/auth/signup" className="group inline-flex items-center gap-1.5 rounded-[5px] bg-white px-4 py-2 text-[14px] font-medium text-[#0d1117] transition-all duration-150 hover:bg-[#f0f0f0]">
              Get started free
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#30363d]/60 px-6 py-6">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between text-[12px] text-[#484f58]">
          <span>MCPForge</span>
          <div className="flex items-center gap-4">
            <a href="https://github.com/Mrutyunjay-Patil/mcpforge" target="_blank" rel="noopener noreferrer" className="transition-colors duration-150 hover:text-[#8b949e]">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
