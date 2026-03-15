import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().max(50).optional(),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const projectNameSchema = z
  .string()
  .min(1, "Project name is required")
  .max(100, "Project name must be under 100 characters");

export const serverConfigSchema = z.object({
  transport: z.enum(["stdio", "sse", "streamable-http"]),
  authMethod: z.enum(["none", "api-key", "bearer", "basic"]),
  serverName: z
    .string()
    .max(50, "Server name must be under 50 characters"),
  serverVersion: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, "Version must be in semver format (x.y.z)"),
  baseUrl: z.string().optional(),
  port: z
    .number()
    .int()
    .min(1024, "Port must be at least 1024")
    .max(65535, "Port must be at most 65535"),
});

export const mcpTypeSchema = z.enum([
  "tool",
  "resource",
  "resource_template",
  "exclude",
]);

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ServerConfigInput = z.infer<typeof serverConfigSchema>;
export type McpType = z.infer<typeof mcpTypeSchema>;
