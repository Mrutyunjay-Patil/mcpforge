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
    <div className="flex min-h-screen items-center justify-center bg-[#09090B] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-[22px] font-semibold text-[#FAFAFA]">MCPForge</h1>
        </div>

        <div className="rounded-md border border-white/[0.06] bg-[#18181B] p-6">
          <h2 className="mb-6 text-center text-lg font-medium text-[#FAFAFA]">
            Create your account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {errors.server && (
                <div
                  role="alert"
                  className="rounded-md border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-2 text-[13px] text-[#EF4444]"
                >
                  {errors.server}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[13px] text-[#FAFAFA]">
                  Name <span className="text-[#71717A]">(optional)</span>
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
                  className="h-9 rounded-md border-white/[0.06] bg-[#09090B] text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] focus-visible:border-[#F97316] focus-visible:ring-0"
                />
                {errors.name && (
                  <p
                    id="name-error"
                    role="alert"
                    className="text-[13px] text-[#EF4444]"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[13px] text-[#FAFAFA]">
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
                  className="h-9 rounded-md border-white/[0.06] bg-[#09090B] text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] focus-visible:border-[#F97316] focus-visible:ring-0"
                />
                {errors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    className="text-[13px] text-[#EF4444]"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[13px] text-[#FAFAFA]">
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
                  className="h-9 rounded-md border-white/[0.06] bg-[#09090B] text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] focus-visible:border-[#F97316] focus-visible:ring-0"
                />
                {errors.password ? (
                  <p
                    id="password-error"
                    role="alert"
                    className="text-[13px] text-[#EF4444]"
                  >
                    {errors.password}
                  </p>
                ) : (
                  <p id="password-hint" className="text-xs text-[#71717A]">
                    Min 8 characters, 1 uppercase letter, 1 number
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-[13px] text-[#FAFAFA]">
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
                  className="h-9 rounded-md border-white/[0.06] bg-[#09090B] text-[13px] text-[#FAFAFA] placeholder:text-[#71717A] focus-visible:border-[#F97316] focus-visible:ring-0"
                />
                {errors.confirmPassword && (
                  <p
                    id="confirm-password-error"
                    role="alert"
                    className="text-[13px] text-[#EF4444]"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full rounded-md bg-[#F97316] text-[13px] font-medium text-black transition-colors duration-150 hover:bg-[#EA580C] disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 rounded-md border border-white/[0.06] bg-[#18181B] px-4 py-3 text-center text-[13px] text-[#FAFAFA]">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-[#F97316] transition-colors duration-150 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
