"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ForgeHammer } from "@/components/forge-hammer";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-[#111111]">
      {/* Left Branded Panel */}
      <div
        className="hidden w-[42%] flex-col justify-between px-12 py-10 lg:flex"
        style={{
          background:
            "linear-gradient(to bottom, rgba(249,115,22,0.18) 0%, #111111 50%)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <ForgeHammer size={28} className="text-[#F97316]" />
          <span
            className="text-xl font-bold tracking-tight text-[#FAFAFA]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            MCPForge
          </span>
        </div>

        {/* Center Tagline */}
        <div className="flex-1 flex flex-col justify-center -mt-16">
          <h1
            className="text-[36px] font-bold leading-[1.15] text-[#FAFAFA]"
            style={{
              fontFamily: "var(--font-mono)",
              letterSpacing: "-1.5px",
            }}
          >
            Ship MCP servers
            <br />
            at the speed of thought.
          </h1>
          <p
            className="mt-5 max-w-md text-[16px] leading-relaxed text-[#888888]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            The fastest way to transform any OpenAPI specification into a
            production-ready MCP server.
          </p>
        </div>

        {/* Bottom Trust Line */}
        <p className="text-[13px] text-[#555555]">
          Open source. Built for developers who ship fast.
        </p>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-[400px]">
          <div className="mb-8">
            <h2
              className="text-[28px] font-bold text-[#FAFAFA]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Welcome back
            </h2>
            <p
              className="mt-2 text-[15px] text-[#888888]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Sign in to your MCPForge account
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-[#EF4444]/40 bg-[#EF4444]/10 px-4 py-2.5 text-[13px] text-[#EF4444]"
                >
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[13px] font-medium text-[#FAFAFA]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  className="h-11 rounded-lg border-white/[0.08] bg-white/[0.04] text-[14px] text-[#FAFAFA] placeholder:text-[#555555] focus-visible:border-[#F97316] focus-visible:ring-0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[13px] font-medium text-[#FAFAFA]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="h-11 rounded-lg border-white/[0.08] bg-white/[0.04] text-[14px] text-[#FAFAFA] placeholder:text-[#555555] focus-visible:border-[#F97316] focus-visible:ring-0"
                />
                <div className="flex justify-end">
                  <Link
                    href="#"
                    className="text-[13px] text-[#F97316] transition-colors duration-150 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-full bg-[#F97316] text-[14px] font-semibold text-black transition-colors duration-150 hover:bg-[#EA580C] disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>

          {/* <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-[13px] text-[#555555]">or</span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="h-11 w-full rounded-full border-white/[0.08] bg-transparent text-[14px] font-medium text-[#FAFAFA] transition-colors duration-150 hover:bg-white/[0.04] hover:text-[#FAFAFA]"
          >
            Continue with GitHub
          </Button> */}

          {/* Sign Up Link */}
          <p className="mt-8 text-center text-[14px] text-[#888888]">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-[#F97316] transition-colors duration-150 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
