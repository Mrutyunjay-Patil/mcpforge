"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="flex min-h-screen items-center justify-center bg-[#0d1117] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-[22px] font-semibold text-[#c9d1d9]">MCPForge</h1>
        </div>

        <div className="rounded-md border border-[#30363d] bg-[#161b22] p-6">
          <h2 className="mb-6 text-center text-lg font-medium text-[#c9d1d9]">
            Sign in to MCPForge
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {error && (
                <div
                  role="alert"
                  className="rounded-md border border-[#f85149]/40 bg-[#f85149]/10 px-3 py-2 text-[13px] text-[#f85149]"
                >
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[13px] text-[#c9d1d9]">
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
                  className="h-9 rounded-md border-[#30363d] bg-[#0d1117] text-[13px] text-[#c9d1d9] placeholder:text-[#484f58] focus-visible:border-[#58a6ff] focus-visible:ring-0"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[13px] text-[#c9d1d9]">
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
                  className="h-9 rounded-md border-[#30363d] bg-[#0d1117] text-[13px] text-[#c9d1d9] placeholder:text-[#484f58] focus-visible:border-[#58a6ff] focus-visible:ring-0"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-md bg-[#238636] text-[13px] font-medium text-white transition-colors duration-150 hover:bg-[#2ea043] disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 rounded-md border border-[#30363d] bg-[#161b22] px-4 py-3 text-center text-[13px] text-[#c9d1d9]">
          New to MCPForge?{" "}
          <Link
            href="/auth/signup"
            className="text-[#58a6ff] transition-colors duration-150 hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
