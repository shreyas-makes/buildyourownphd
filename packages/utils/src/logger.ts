import { LogLevel, LogContext } from "./types";
import { generateRequestId } from "./request-id";

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

// Browser-compatible logger interface
interface ILogger {
  error(data: any): void;
  warn(data: any): void;
  info(data: any): void;
  debug(data: any): void;
}

// Browser logger implementation
class BrowserLogger implements ILogger {
  private logLevel: string;

  constructor() {
    this.logLevel = (typeof process !== "undefined" && process.env?.LOG_LEVEL) || "info";
  }

  private shouldLog(level: string): boolean {
    const levels = ["error", "warn", "info", "debug"];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
  }

  private formatMessage(level: string, data: any): string {
    const timestamp = new Date().toISOString();
    let message = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (data.requestId) message += ` [${data.requestId}]`;
    if (data.userId) message += ` [user:${data.userId}]`;
    if (data.operation) message += ` [${data.operation}]`;
    
    message += `: ${data.message}`;
    
    return message;
  }

  error(data: any): void {
    if (!this.shouldLog("error")) return;
    console.error(this.formatMessage("error", data), data.metadata || {});
  }

  warn(data: any): void {
    if (!this.shouldLog("warn")) return;
    console.warn(this.formatMessage("warn", data), data.metadata || {});
  }

  info(data: any): void {
    if (!this.shouldLog("info")) return;
    console.info(this.formatMessage("info", data), data.metadata || {});
  }

  debug(data: any): void {
    if (!this.shouldLog("debug")) return;
    console.debug(this.formatMessage("debug", data), data.metadata || {});
  }
}

// Server logger implementation (lazy-loaded winston)
class ServerLogger implements ILogger {
  private winston: any;
  private logger: any;

  constructor() {
    this.initializeWinston();
  }

  private async initializeWinston() {
    if (!this.winston) {
      this.winston = await import("winston");
      this.logger = this.createWinstonLogger();
    }
  }

  private createWinstonLogger() {
    const isDevelopment = process.env.NODE_ENV === "development";
    const logLevel = process.env.LOG_LEVEL || (isDevelopment ? "debug" : "info");

    const developmentFormat = this.winston.format.combine(
      this.winston.format.timestamp(),
      this.winston.format.errors({ stack: true }),
      this.winston.format.colorize(),
      this.winston.format.printf(({ timestamp, level, message, requestId, userId, operation, metadata, stack }: any) => {
        let log = `${timestamp} [${level}]`;
        
        if (requestId) log += ` [${requestId}]`;
        if (userId) log += ` [user:${userId}]`;
        if (operation) log += ` [${operation}]`;
        
        log += `: ${message}`;
        
        if (metadata && Object.keys(metadata).length > 0) {
          log += ` ${JSON.stringify(metadata, null, 2)}`;
        }
        
        if (stack) {
          log += `\n${stack}`;
        }
        
        return log;
      })
    );

    const productionFormat = this.winston.format.combine(
      this.winston.format.timestamp(),
      this.winston.format.errors({ stack: true }),
      this.winston.format.json()
    );

    const transports: any[] = [
      new this.winston.transports.Console({
        format: isDevelopment ? developmentFormat : productionFormat,
      }),
    ];

    // Add file transports in production
    if (!isDevelopment) {
      transports.push(
        new this.winston.transports.File({
          filename: "logs/error.log",
          level: "error",
          format: productionFormat,
        }),
        new this.winston.transports.File({
          filename: "logs/combined.log",
          format: productionFormat,
        })
      );
    }

    return this.winston.createLogger({
      level: logLevel,
      transports,
      exitOnError: false,
    });
  }

  async error(data: any): Promise<void> {
    await this.initializeWinston();
    this.logger.error(data);
  }

  async warn(data: any): Promise<void> {
    await this.initializeWinston();
    this.logger.warn(data);
  }

  async info(data: any): Promise<void> {
    await this.initializeWinston();
    this.logger.info(data);
  }

  async debug(data: any): Promise<void> {
    await this.initializeWinston();
    this.logger.debug(data);
  }

}

// Browser logger with close method
class BrowserLoggerWithClose extends BrowserLogger {
  async close(): Promise<void> {
    return Promise.resolve();
  }
}

// Server logger with close method  
class ServerLoggerWithClose extends ServerLogger {
  async close(): Promise<void> {
    return Promise.resolve(); // Simplified for now
  }
}

// Create appropriate logger based on environment
const logger: ILogger = isBrowser ? new BrowserLoggerWithClose() : new ServerLoggerWithClose();

// Logger class with context support
export class Logger {
  private context: LogContext;

  constructor(context: LogContext = {}) {
    this.context = context;
  }

  private formatMessage(message: string, metadata?: Record<string, any>) {
    return {
      message,
      requestId: this.context.requestId || generateRequestId(),
      userId: this.context.userId,
      operation: this.context.operation,
      resource: this.context.resource,
      metadata: {
        ...this.context.metadata,
        ...metadata,
      },
    };
  }

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    const logData = this.formatMessage(message, metadata);
    if (error) {
      logData.metadata.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }
    logger.error(logData);
  }

  warn(message: string, metadata?: Record<string, any>) {
    logger.warn(this.formatMessage(message, metadata));
  }

  info(message: string, metadata?: Record<string, any>) {
    logger.info(this.formatMessage(message, metadata));
  }

  debug(message: string, metadata?: Record<string, any>) {
    logger.debug(this.formatMessage(message, metadata));
  }

  // Performance logging
  time(label: string): () => void {
    const start = Date.now();
    return () => {
      const duration = Date.now() - start;
      this.info(`${label} completed`, { duration });
    };
  }

  // Request logging
  request(method: string, url: string, statusCode?: number, duration?: number) {
    this.info("HTTP Request", {
      method,
      url,
      statusCode,
      duration,
    });
  }

  // Database logging
  database(operation: string, table: string, duration?: number, rowCount?: number) {
    this.debug("Database Operation", {
      operation,
      table,
      duration,
      rowCount,
    });
  }

  // AI service logging
  aiService(service: string, operation: string, tokens?: number, cost?: number) {
    this.info("AI Service Call", {
      service,
      operation,
      tokens,
      cost,
    });
  }

  // File operation logging
  fileOperation(operation: string, filename: string, size?: number, duration?: number) {
    this.info("File Operation", {
      operation,
      filename,
      size,
      duration,
    });
  }

  // User action logging
  userAction(action: string, details?: Record<string, any>) {
    this.info("User Action", {
      action,
      ...details,
    });
  }

  // Create child logger with additional context
  child(additionalContext: Partial<LogContext>): Logger {
    return new Logger({
      ...this.context,
      ...additionalContext,
      metadata: {
        ...this.context.metadata,
        ...additionalContext.metadata,
      },
    });
  }

  // Set context
  setContext(context: Partial<LogContext>): void {
    this.context = {
      ...this.context,
      ...context,
      metadata: {
        ...this.context.metadata,
        ...context.metadata,
      },
    };
  }
}

// Default logger instance
export const defaultLogger = new Logger();

// Factory function for creating loggers with context
export const createLoggerWithContext = (context: LogContext): Logger => {
  return new Logger(context);
};

// Structured logging helpers
export const loggers = {
  auth: new Logger({ operation: "authentication" }),
  api: new Logger({ operation: "api" }),
  database: new Logger({ operation: "database" }),
  file: new Logger({ operation: "file" }),
  ai: new Logger({ operation: "ai" }),
  queue: new Logger({ operation: "queue" }),
  storage: new Logger({ operation: "storage" }),
  health: new Logger({ operation: "health" }),
};

// Express middleware for request logging
export const requestLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  const requestId = req.headers["x-request-id"] || generateRequestId();
  
  // Add request ID to request object
  req.requestId = requestId;
  
  // Add request ID to response headers
  res.setHeader("x-request-id", requestId);
  
  const logger = createLoggerWithContext({
    requestId,
    operation: "http_request",
  });

  // Log request start
  logger.info("Request started", {
    method: req.method,
    url: req.url,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
  });

  // Override response.end to log response
  const originalEnd = res.end;
  res.end = function(chunk: any, encoding: any) {
    const duration = Date.now() - start;
    
    logger.request(req.method, req.url, res.statusCode, duration);
    
    // Log slow requests
    if (duration > 1000) {
      logger.warn("Slow request detected", {
        method: req.method,
        url: req.url,
        duration,
      });
    }
    
    // Log errors
    if (res.statusCode >= 400) {
      logger.error("Request failed", undefined, {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration,
      });
    }
    
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// Error logging helper
export const logError = (
  error: Error,
  context: LogContext = {},
  level: LogLevel = LogLevel.ERROR
) => {
  const logger = new Logger(context);
  
  if (level === LogLevel.ERROR) {
    logger.error(error.message, error);
  } else if (level === LogLevel.WARN) {
    logger.warn(error.message, { error: error.message });
  } else {
    logger.info(error.message, { error: error.message });
  }
};

// Performance monitoring
export const performanceLogger = {
  startTimer: (operation: string, context: LogContext = {}) => {
    const start = Date.now();
    const logger = new Logger({ ...context, operation });
    
    return {
      end: (metadata?: Record<string, any>) => {
        const duration = Date.now() - start;
        logger.info(`${operation} completed`, { duration, ...metadata });
        return duration;
      },
      logger,
    };
  },
};

// Cleanup function for graceful shutdown
export const closeLogger = async (): Promise<void> => {
  // For browser logger, there's nothing to close
  if (isBrowser) {
    return Promise.resolve();
  }
  
  // For server logger, close winston if it exists
  const serverLogger = logger as ServerLoggerWithClose;
  return serverLogger.close();
}; 