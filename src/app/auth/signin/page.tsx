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
    <div className="flex min-h-screen items-center justify-center bg-[#09090B] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-[22px] font-semibold text-[#FAFAFA]">MCPForge</h1>
        </div>

        <div className="rounded-md border border-white/[0.06] bg-[#18181B] p-6">
          <h2 className="mb-6 text-center text-lg font-medium text-[#FAFAFA]">
            Sign in to MCPForge
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {error && (
                <div
                  role="alert"
                  className="rounded-md border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-2 text-[13px] text-[#EF4444]"
                >
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[13px] text-[#FAFAFA]">
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
                  className="h-9 rounded-md border-white/[0.06] bg-[#09090B] text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] focus-visible:border-[#F97316] focus-visible:ring-0"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[13px] text-[#FAFAFA]">
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
                  className="h-9 rounded-md border-white/[0.06] bg-[#09090B] text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] focus-visible:border-[#F97316] focus-visible:ring-0"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-md bg-[#F97316] text-[13px] font-medium text-black transition-colors duration-150 hover:bg-[#EA580C] disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 rounded-md border border-white/[0.06] bg-[#18181B] px-4 py-3 text-center text-[13px] text-[#FAFAFA]">
          New to MCPForge?{" "}
          <Link
            href="/auth/signup"
            className="text-[#F97316] transition-colors duration-150 hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
