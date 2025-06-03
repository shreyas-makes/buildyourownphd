import { AppError, isAppError, isOperationalError, ErrorCodes } from "./errors";
import { ApiResponse } from "./types";
import { Logger, logError } from "./logger";
import { generateRequestId } from "./request-id";

// Express error handler middleware
export const expressErrorHandler = (err: Error, req: any, res: any, next: any) => {
  const requestId = req.requestId || generateRequestId();
  const logger = new Logger({ requestId, operation: "error_handler" });

  // Log the error
  logError(err, { requestId, userId: req.user?.id });

  // Handle different error types
  if (isAppError(err)) {
    const response: ApiResponse = {
      success: false,
      error: err.toJSON(),
      requestId,
      timestamp: new Date().toISOString(),
    };

    return res.status(err.statusCode).json(response);
  }

  // Handle validation errors (e.g., from Joi or Zod)
  if (err.name === "ValidationError") {
    const response: ApiResponse = {
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: "Validation failed",
        details: { validation: err.message },
      },
      requestId,
      timestamp: new Date().toISOString(),
    };

    return res.status(400).json(response);
  }

  // Handle unexpected errors
  logger.error("Unexpected error occurred", err);

  const response: ApiResponse = {
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      ...(process.env.NODE_ENV === "development" && { details: { stack: err.stack } }),
    },
    requestId,
    timestamp: new Date().toISOString(),
  };

  res.status(500).json(response);
};

// NestJS exception filter
export class GlobalExceptionFilter {
  private logger = new Logger({ operation: "exception_filter" });

  catch(exception: unknown, host: any) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const requestId = request.requestId || generateRequestId();

    // Log the exception
    if (exception instanceof Error) {
      logError(exception, { requestId, userId: request.user?.id });
    } else {
      this.logger.error("Unknown exception occurred", undefined, { exception });
    }

    let status = 500;
    let errorResponse: ApiResponse;

    if (isAppError(exception)) {
      status = exception.statusCode;
      errorResponse = {
        success: false,
        error: exception.toJSON(),
        requestId,
        timestamp: new Date().toISOString(),
      };
    } else {
      errorResponse = {
        success: false,
        error: {
          code: ErrorCodes.INTERNAL_SERVER_ERROR,
          message: "Internal server error",
          ...(process.env.NODE_ENV === "development" && 
              exception instanceof Error && { details: { stack: exception.stack } }),
        },
        requestId,
        timestamp: new Date().toISOString(),
      };
    }

    response.status(status).json(errorResponse);
  }
}

// Promise rejection handler
export const handleUnhandledRejection = (reason: any, promise: Promise<any>) => {
  const logger = new Logger({ operation: "unhandled_rejection" });
  
  logger.error("Unhandled promise rejection", reason instanceof Error ? reason : new Error(reason), {
    promise: promise.toString(),
  });

  // In production, you might want to gracefully shutdown the process
  if (process.env.NODE_ENV === "production") {
    console.error("Unhandled promise rejection. Shutting down gracefully...");
    process.exit(1);
  }
};

// Uncaught exception handler
export const handleUncaughtException = (error: Error) => {
  const logger = new Logger({ operation: "uncaught_exception" });
  
  logger.error("Uncaught exception", error);

  // Graceful shutdown
  console.error("Uncaught exception. Shutting down gracefully...");
  process.exit(1);
};

// React Error Boundary error handler
export const handleReactError = (error: Error, errorInfo: { componentStack: string }) => {
  const logger = new Logger({ operation: "react_error_boundary" });
  
  logger.error("React component error", error, {
    componentStack: errorInfo.componentStack,
  });

  // You might want to send this to an error tracking service
  if (process.env.NODE_ENV === "production") {
    // Send to error tracking service (e.g., Sentry)
  }
};

// React Native error handler
export const handleReactNativeError = (error: any, isFatal: boolean) => {
  const logger = new Logger({ operation: "react_native_error" });
  
  logger.error("React Native error", error instanceof Error ? error : new Error(error), {
    isFatal,
  });

  // Handle fatal errors differently
  if (isFatal) {
    // You might want to restart the app or show a crash screen
    console.error("Fatal React Native error occurred");
  }
};

// Generic error handler for async operations
export const handleAsyncError = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      // Log the error with context
      const logger = new Logger({ operation: fn.name || "async_operation" });
      
      if (error instanceof Error) {
        logger.error("Async operation failed", error);
      } else {
        logger.error("Async operation failed with unknown error", undefined, { error });
      }

      // Re-throw operational errors, wrap others
      if (isOperationalError(error)) {
        throw error;
      } else {
        throw new AppError(
          "Internal server error",
          ErrorCodes.INTERNAL_SERVER_ERROR,
          500,
          { originalError: error instanceof Error ? error.message : String(error) }
        );
      }
    }
  };
};

// Wrapper for safe async execution with error boundaries
export const safeAsync = async <T>(
  operation: () => Promise<T>,
  fallback?: T,
  context?: { operation?: string; userId?: string }
): Promise<T | undefined> => {
  try {
    return await operation();
  } catch (error) {
    const logger = new Logger(context);
    
    if (error instanceof Error) {
      logger.error("Safe async operation failed", error);
    } else {
      logger.error("Safe async operation failed", undefined, { error });
    }

    return fallback;
  }
};

// Setup global error handlers
export const setupGlobalErrorHandlers = () => {
  // Handle unhandled promise rejections
  process.on("unhandledRejection", handleUnhandledRejection);
  
  // Handle uncaught exceptions
  process.on("uncaughtException", handleUncaughtException);
  
  // Graceful shutdown on SIGTERM
  process.on("SIGTERM", () => {
    const logger = new Logger({ operation: "shutdown" });
    logger.info("SIGTERM received. Shutting down gracefully...");
    
    // Perform cleanup operations here
    process.exit(0);
  });

  // Graceful shutdown on SIGINT
  process.on("SIGINT", () => {
    const logger = new Logger({ operation: "shutdown" });
    logger.info("SIGINT received. Shutting down gracefully...");
    
    // Perform cleanup operations here
    process.exit(0);
  });
};

// Error retry helper
export const retryWithBackoff = async <T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    retryCondition?: (error: Error) => boolean;
  } = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryCondition = () => true,
  } = options;

  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on the last attempt or if retry condition fails
      if (attempt === maxRetries || !retryCondition(lastError)) {
        throw lastError;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(backoffFactor, attempt), maxDelay);
      
      const logger = new Logger({ operation: "retry_backoff" });
      logger.warn(`Operation failed, retrying in ${delay}ms`, {
        attempt: attempt + 1,
        maxRetries,
        error: lastError.message,
      });

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}; 