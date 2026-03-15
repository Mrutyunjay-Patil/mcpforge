"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  server?: string;
}

function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least 1 uppercase letter";
  if (!/[0-9]/.test(password))
    return "Password must contain at least 1 number";
  return undefined;
}

function validateEmail(email: string): string | undefined {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Invalid email format";
  return undefined;
}

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  function validateForm(): boolean {
    const newErrors: FieldErrors = {};

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ server: "An unexpected error occurred" });
        }
        return;
      }

      // Sign in after successful signup
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setErrors({ server: "Account created but sign-in failed. Please sign in manually." });
      } else {
        router.push("/dashboard");
      }
    } catch {
      setErrors({ server: "An unexpected error occurred" });
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
            Create your account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {errors.server && (
                <div
                  role="alert"
                  className="rounded-md border border-[#f85149]/40 bg-[#f85149]/10 px-3 py-2 text-[13px] text-[#f85149]"
                >
                  {errors.server}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[13px] text-[#c9d1d9]">
                  Name <span className="text-[#8b949e]">(optional)</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className="h-9 rounded-md border-[#30363d] bg-[#0d1117] text-[13px] text-[#c9d1d9] placeholder:text-[#484f58] focus-visible:border-[#58a6ff] focus-visible:ring-0"
                />
                {errors.name && (
                  <p
                    id="name-error"
                    role="alert"
                    className="text-[13px] text-[#f85149]"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[13px] text-[#c9d1d9]">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="h-9 rounded-md border-[#30363d] bg-[#0d1117] text-[13px] text-[#c9d1d9] placeholder:text-[#484f58] focus-visible:border-[#58a6ff] focus-visible:ring-0"
                />
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="text-[13px] text-[#f85149]"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[13px] text-[#c9d1d9]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : "password-hint"
                  }
                  className="h-9 rounded-md border-[#30363d] bg-[#0d1117] text-[13px] text-[#c9d1d9] placeholder:text-[#484f58] focus-visible:border-[#58a6ff] focus-visible:ring-0"
                />
                {errors.password ? (
                  <p
                    id="password-error"
                    role="alert"
                    className="text-[13px] text-[#f85149]"
                  >
                    {errors.password}
                  </p>
                ) : (
                  <p id="password-hint" className="text-xs text-[#8b949e]">
                    Min 8 characters, 1 uppercase letter, 1 number
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-[13px] text-[#c9d1d9]">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({
                        ...prev,
                        confirmPassword: undefined,
                      }));
                    }
                  }}
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={
                    errors.confirmPassword ? "confirm-password-error" : undefined
                  }
                  className="h-9 rounded-md border-[#30363d] bg-[#0d1117] text-[13px] text-[#c9d1d9] placeholder:text-[#484f58] focus-visible:border-[#58a6ff] focus-visible:ring-0"
                />
                {errors.confirmPassword && (
                  <p
                    id="confirm-password-error"
                    role="alert"
                    className="text-[13px] text-[#f85149]"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full rounded-md bg-[#238636] text-[13px] font-medium text-white transition-colors duration-150 hover:bg-[#2ea043] disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 rounded-md border border-[#30363d] bg-[#161b22] px-4 py-3 text-center text-[13px] text-[#c9d1d9]">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-[#58a6ff] transition-colors duration-150 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
