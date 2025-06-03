import { z } from "zod";
import { ValidationResult, ValidationIssue } from "./types";
import { ValidationError, createError } from "./errors";

// Common validation schemas
export const commonSchemas = {
  id: z.string().uuid("Invalid ID format"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  url: z.string().url("Invalid URL format"),
  nonEmptyString: z.string().min(1, "This field is required"),
  positiveNumber: z.number().positive("Must be a positive number"),
  fileSize: z.number().max(100 * 1024 * 1024, "File too large (max 100MB)"),
};

// File validation schemas
export const fileSchemas = {
  mimeType: z.enum([
    "application/pdf",
    "audio/mpeg",
    "audio/mp4",
    "audio/wav",
    "video/mp4",
    "video/quicktime",
    "text/plain",
    "text/markdown",
  ], { errorMap: () => ({ message: "Unsupported file type" }) }),
  
  uploadFile: z.object({
    originalName: z.string().min(1, "Filename is required"),
    mimeType: z.string(),
    size: commonSchemas.fileSize,
    buffer: z.instanceof(Buffer, { message: "Invalid file data" }),
  }),
};

// User validation schemas
export const userSchemas = {
  signUp: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    name: z.string().min(2, "Name must be at least 2 characters"),
  }),
  
  signIn: z.object({
    email: commonSchemas.email,
    password: z.string().min(1, "Password is required"),
  }),
  
  updateProfile: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    avatar: z.string().url("Invalid avatar URL").optional(),
  }),
};

// Resource validation schemas
export const resourceSchemas = {
  create: z.object({
    title: z.string().min(1, "Title is required").max(255, "Title too long"),
    description: z.string().max(1000, "Description too long").optional(),
    type: z.enum(["pdf", "audio", "video", "text", "markdown", "url"]),
    tags: z.array(z.string()).max(10, "Too many tags").optional(),
  }),
  
  update: z.object({
    title: z.string().min(1, "Title is required").max(255, "Title too long").optional(),
    description: z.string().max(1000, "Description too long").optional(),
    tags: z.array(z.string()).max(10, "Too many tags").optional(),
  }),
};

// Project validation schemas
export const projectSchemas = {
  create: z.object({
    name: z.string().min(1, "Project name is required").max(100, "Name too long"),
    description: z.string().max(500, "Description too long").optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional(),
  }),
  
  update: z.object({
    name: z.string().min(1, "Project name is required").max(100, "Name too long").optional(),
    description: z.string().max(500, "Description too long").optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format").optional(),
    isArchived: z.boolean().optional(),
  }),
};

// Query parameter validation schemas
export const querySchemas = {
  pagination: z.object({
    page: z.coerce.number().min(1, "Page must be at least 1").default(1),
    limit: z.coerce.number().min(1, "Limit must be at least 1").max(100, "Limit too high").default(20),
  }),
  
  search: z.object({
    query: z.string().min(1, "Search query is required").max(100, "Query too long"),
    type: z.enum(["all", "pdf", "audio", "video", "text"]).default("all"),
  }),
  
  filter: z.object({
    status: z.enum(["pending", "processing", "completed", "failed"]).optional(),
    type: z.enum(["pdf", "audio", "video", "text", "markdown", "url"]).optional(),
    tags: z.string().optional(), // Comma-separated tags
  }),
};

// Validation helper functions
export const validateSchema = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  requestId?: string
): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors: ValidationIssue[] = error.errors.map(err => ({
        field: err.path.join("."),
        message: err.message,
        code: err.code,
      }));

      throw new ValidationError(
        "Validation failed",
        { errors: validationErrors },
        requestId
      );
    }
    throw error;
  }
};

export const validateSchemaAsync = async <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  requestId?: string
): Promise<T> => {
  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors: ValidationIssue[] = error.errors.map(err => ({
        field: err.path.join("."),
        message: err.message,
        code: err.code,
      }));

      throw new ValidationError(
        "Validation failed",
        { errors: validationErrors },
        requestId
      );
    }
    throw error;
  }
};

export const safeValidate = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult & { data?: T } => {
  try {
    const validatedData = schema.parse(data);
    return {
      isValid: true,
      errors: [],
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors: ValidationIssue[] = error.errors.map(err => ({
        field: err.path.join("."),
        message: err.message,
        code: err.code,
      }));

      return {
        isValid: false,
        errors: validationErrors,
      };
    }

    return {
      isValid: false,
      errors: [{
        field: "unknown",
        message: "Validation error",
        code: "unknown_error",
      }],
    };
  }
};

// File validation helpers
export const validateFile = (
  file: { originalName: string; mimeType: string; size: number },
  options: {
    maxSize?: number;
    allowedTypes?: string[];
  } = {},
  requestId?: string
) => {
  const { maxSize = 100 * 1024 * 1024, allowedTypes } = options;

  // Check file size
  if (file.size > maxSize) {
    throw createError.fileTooLarge(maxSize, file.size, requestId);
  }

  // Check file type
  if (allowedTypes && !allowedTypes.includes(file.mimeType)) {
    throw createError.unsupportedFileType(file.mimeType, allowedTypes, requestId);
  }

  // Validate filename
  if (!file.originalName || file.originalName.trim().length === 0) {
    throw new ValidationError("Filename is required", undefined, requestId);
  }

  // Check for suspicious file extensions
  const suspiciousExtensions = [".exe", ".bat", ".cmd", ".com", ".scr"];
  const hasSpiciousExtension = suspiciousExtensions.some(ext =>
    file.originalName.toLowerCase().endsWith(ext)
  );

  if (hasSpiciousExtension) {
    throw createError.unsupportedFileType(
      file.mimeType,
      ["Documents", "Audio", "Video", "Text files"],
      requestId
    );
  }

  return true;
};

// URL validation helper
export const validateUrl = (url: string, requestId?: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    throw new ValidationError(
      "Invalid URL format",
      { url },
      requestId
    );
  }
};

// Custom validation decorators for classes
export const IsValidFile = (validationOptions?: {
  maxSize?: number;
  allowedTypes?: string[];
}) => {
  return (target: any, propertyName: string) => {
    // This would be used with class-validator if needed
    // Implementation depends on the validation library being used
  };
};

// Environment variable validation
export const validateEnv = <T extends Record<string, any>>(
  schema: z.ZodSchema<T>
): T => {
  try {
    return schema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Environment validation failed:");
      error.errors.forEach(err => {
        console.error(`  ${err.path.join(".")}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

// Configuration schema for environment variables
export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url("Invalid database URL"),
  SUPABASE_URL: z.string().url("Invalid Supabase URL"),
  SUPABASE_ANON_KEY: z.string().min(1, "Supabase anon key is required"),
  OPENAI_API_KEY: z.string().min(1, "OpenAI API key is required"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
  PORT: z.coerce.number().default(3001),
});

export type EnvConfig = z.infer<typeof envSchema>; 