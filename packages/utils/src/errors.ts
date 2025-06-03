import { ApiError } from "./types";

// Error codes
export const ErrorCodes = {
  // Authentication errors
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  
  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",
  REQUIRED_FIELD_MISSING: "REQUIRED_FIELD_MISSING",
  
  // Resource errors
  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
  RESOURCE_ALREADY_EXISTS: "RESOURCE_ALREADY_EXISTS",
  RESOURCE_ACCESS_DENIED: "RESOURCE_ACCESS_DENIED",
  
  // File errors
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  UNSUPPORTED_FILE_TYPE: "UNSUPPORTED_FILE_TYPE",
  FILE_UPLOAD_FAILED: "FILE_UPLOAD_FAILED",
  FILE_PROCESSING_FAILED: "FILE_PROCESSING_FAILED",
  FILE_NOT_FOUND: "FILE_NOT_FOUND",
  FILE_CORRUPTED: "FILE_CORRUPTED",
  
  // AI Service errors
  AI_SERVICE_UNAVAILABLE: "AI_SERVICE_UNAVAILABLE",
  AI_SERVICE_RATE_LIMITED: "AI_SERVICE_RATE_LIMITED",
  AI_SERVICE_ERROR: "AI_SERVICE_ERROR",
  TRANSCRIPTION_FAILED: "TRANSCRIPTION_FAILED",
  TTS_GENERATION_FAILED: "TTS_GENERATION_FAILED",
  
  // Database errors
  DATABASE_ERROR: "DATABASE_ERROR",
  DATABASE_CONNECTION_FAILED: "DATABASE_CONNECTION_FAILED",
  DUPLICATE_ENTRY: "DUPLICATE_ENTRY",
  
  // External service errors
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  
  // Queue/Job errors
  JOB_FAILED: "JOB_FAILED",
  JOB_TIMEOUT: "JOB_TIMEOUT",
  QUEUE_ERROR: "QUEUE_ERROR",
  
  // Storage errors
  STORAGE_ERROR: "STORAGE_ERROR",
  STORAGE_QUOTA_EXCEEDED: "STORAGE_QUOTA_EXCEEDED",
  STORAGE_ACCESS_DENIED: "STORAGE_ACCESS_DENIED",
  
  // General errors
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  BAD_REQUEST: "BAD_REQUEST",
  NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// Base application error class
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, any>;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;
  public readonly requestId?: string;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number = 500,
    details?: Record<string, any>,
    isOperational: boolean = true,
    requestId?: string
  ) {
    super(message);
    
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;
    this.timestamp = new Date();
    this.requestId = requestId;

    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON(): ApiError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      stack: process.env.NODE_ENV === "development" ? this.stack : undefined,
    };
  }
}

// Specific error classes
export class ValidationError extends AppError {
  constructor(
    message: string,
    details?: Record<string, any>,
    requestId?: string
  ) {
    super(message, ErrorCodes.VALIDATION_ERROR, 400, details, true, requestId);
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message: string = "Unauthorized access",
    details?: Record<string, any>,
    requestId?: string
  ) {
    super(message, ErrorCodes.UNAUTHORIZED, 401, details, true, requestId);
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message: string = "Access forbidden",
    details?: Record<string, any>,
    requestId?: string
  ) {
    super(message, ErrorCodes.FORBIDDEN, 403, details, true, requestId);
  }
}

export class NotFoundError extends AppError {
  constructor(
    message: string = "Resource not found",
    details?: Record<string, any>,
    requestId?: string
  ) {
    super(message, ErrorCodes.RESOURCE_NOT_FOUND, 404, details, true, requestId);
  }
}

export class ConflictError extends AppError {
  constructor(
    message: string = "Resource already exists",
    details?: Record<string, any>,
    requestId?: string
  ) {
    super(message, ErrorCodes.RESOURCE_ALREADY_EXISTS, 409, details, true, requestId);
  }
}

export class FileError extends AppError {
  constructor(
    message: string,
    code: ErrorCode,
    details?: Record<string, any>,
    requestId?: string
  ) {
    super(message, code, 400, details, true, requestId);
  }
}

export class FileTooLargeError extends FileError {
  constructor(
    maxSize: number,
    actualSize: number,
    requestId?: string
  ) {
    super(
      `File too large. Maximum size is ${maxSize} bytes, received ${actualSize} bytes`,
      ErrorCodes.FILE_TOO_LARGE,
      { maxSize, actualSize },
      requestId
    );
  }
}

export class UnsupportedFileTypeError extends FileError {
  constructor(
    fileType: string,
    allowedTypes: string[],
    requestId?: string
  ) {
    super(
      `Unsupported file type: ${fileType}. Allowed types: ${allowedTypes.join(", ")}`,
      ErrorCodes.UNSUPPORTED_FILE_TYPE,
      { fileType, allowedTypes },
      requestId
    );
  }
}

export class AIServiceError extends AppError {
  constructor(
    message: string,
    service: string,
    details?: Record<string, any>,
    requestId?: string
  ) {
    super(
      message,
      ErrorCodes.AI_SERVICE_ERROR,
      502,
      { service, ...details },
      true,
      requestId
    );
  }
}

export class DatabaseError extends AppError {
  constructor(
    message: string,
    operation: string,
    details?: Record<string, any>,
    requestId?: string
  ) {
    super(
      message,
      ErrorCodes.DATABASE_ERROR,
      500,
      { operation, ...details },
      false,
      requestId
    );
  }
}

export class ExternalServiceError extends AppError {
  constructor(
    message: string,
    service: string,
    details?: Record<string, any>,
    requestId?: string
  ) {
    super(
      message,
      ErrorCodes.EXTERNAL_SERVICE_ERROR,
      502,
      { service, ...details },
      true,
      requestId
    );
  }
}

export class RateLimitError extends AppError {
  constructor(
    message: string = "Rate limit exceeded",
    retryAfter?: number,
    requestId?: string
  ) {
    super(
      message,
      ErrorCodes.AI_SERVICE_RATE_LIMITED,
      429,
      { retryAfter },
      true,
      requestId
    );
  }
}

export class TimeoutError extends AppError {
  constructor(
    message: string = "Request timeout",
    timeout: number,
    requestId?: string
  ) {
    super(
      message,
      ErrorCodes.TIMEOUT_ERROR,
      408,
      { timeout },
      true,
      requestId
    );
  }
}

export class StorageError extends AppError {
  constructor(
    message: string,
    operation: string,
    details?: Record<string, any>,
    requestId?: string
  ) {
    super(
      message,
      ErrorCodes.STORAGE_ERROR,
      500,
      { operation, ...details },
      true,
      requestId
    );
  }
}

export class QuotaExceededError extends AppError {
  constructor(
    currentUsage: number,
    limit: number,
    requestId?: string
  ) {
    super(
      `Storage quota exceeded. Current usage: ${currentUsage}, Limit: ${limit}`,
      ErrorCodes.STORAGE_QUOTA_EXCEEDED,
      413,
      { currentUsage, limit, operation: "quota_check" },
      true,
      requestId
    );
  }
}

// Error factory for common errors
export const createError = {
  validation: (message: string, details?: Record<string, any>, requestId?: string) =>
    new ValidationError(message, details, requestId),
    
  unauthorized: (message?: string, details?: Record<string, any>, requestId?: string) =>
    new UnauthorizedError(message, details, requestId),
    
  forbidden: (message?: string, details?: Record<string, any>, requestId?: string) =>
    new ForbiddenError(message, details, requestId),
    
  notFound: (resource: string, id?: string, requestId?: string) =>
    new NotFoundError(
      `${resource}${id ? ` with id ${id}` : ""} not found`,
      { resource, id },
      requestId
    ),
    
  conflict: (resource: string, field?: string, value?: any, requestId?: string) =>
    new ConflictError(
      `${resource} already exists${field ? ` with ${field}: ${value}` : ""}`,
      { resource, field, value },
      requestId
    ),
    
  fileTooLarge: (maxSize: number, actualSize: number, requestId?: string) =>
    new FileTooLargeError(maxSize, actualSize, requestId),
    
  unsupportedFileType: (fileType: string, allowedTypes: string[], requestId?: string) =>
    new UnsupportedFileTypeError(fileType, allowedTypes, requestId),
    
  aiService: (service: string, message: string, details?: Record<string, any>, requestId?: string) =>
    new AIServiceError(message, service, details, requestId),
    
  database: (operation: string, message: string, details?: Record<string, any>, requestId?: string) =>
    new DatabaseError(message, operation, details, requestId),
    
  externalService: (service: string, message: string, details?: Record<string, any>, requestId?: string) =>
    new ExternalServiceError(message, service, details, requestId),
    
  rateLimit: (message?: string, retryAfter?: number, requestId?: string) =>
    new RateLimitError(message, retryAfter, requestId),
    
  timeout: (operation: string, timeout: number, requestId?: string) =>
    new TimeoutError(`${operation} timed out after ${timeout}ms`, timeout, requestId),
    
  storage: (operation: string, message: string, details?: Record<string, any>, requestId?: string) =>
    new StorageError(message, operation, details, requestId),
    
  quotaExceeded: (currentUsage: number, limit: number, requestId?: string) =>
    new QuotaExceededError(currentUsage, limit, requestId),
};

// Error helpers
export const isAppError = (error: any): error is AppError => {
  return error instanceof AppError;
};

export const isOperationalError = (error: any): boolean => {
  return isAppError(error) && error.isOperational;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

export const getErrorCode = (error: unknown): ErrorCode => {
  if (isAppError(error)) {
    return error.code;
  }
  return ErrorCodes.INTERNAL_SERVER_ERROR;
}; 