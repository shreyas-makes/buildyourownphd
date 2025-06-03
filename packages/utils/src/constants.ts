// Application constants
export const APP_NAME = "Build Your Own PhD";
export const APP_VERSION = "1.0.0";
export const APP_DESCRIPTION = "AI-powered PhD resource management platform";

// File upload constants
export const FILE_UPLOAD = {
  MAX_SIZE: 100 * 1024 * 1024, // 100MB
  CHUNK_SIZE: 1024 * 1024, // 1MB chunks
  ALLOWED_TYPES: [
    "application/pdf",
    "audio/mpeg",
    "audio/mp4",
    "audio/wav",
    "audio/m4a",
    "video/mp4",
    "video/quicktime",
    "text/plain",
    "text/markdown",
  ],
  ALLOWED_EXTENSIONS: [".pdf", ".mp3", ".mp4", ".wav", ".m4a", ".mov", ".txt", ".md"],
} as const;

// API constants
export const API = {
  TIMEOUT: 30000, // 30 seconds
  RETRIES: 3,
  RATE_LIMIT: {
    WINDOW: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
} as const;

// Processing constants
export const PROCESSING = {
  JOB_TIMEOUT: 10 * 60 * 1000, // 10 minutes
  MAX_RETRIES: 3,
  RETRY_DELAY: 5000, // 5 seconds
  BATCH_SIZE: 10,
} as const;

// Audio constants
export const AUDIO = {
  DEFAULT_VOICE: "alloy",
  DEFAULT_MODEL: "tts-1",
  SAMPLE_RATES: [16000, 22050, 44100, 48000],
  FORMATS: ["mp3", "aac", "wav"],
  MAX_DURATION: 3600, // 1 hour in seconds
  BITRATES: [128, 192, 256, 320], // kbps
} as const;

// Storage constants
export const STORAGE = {
  BUCKETS: {
    FILES: "files",
    AUDIO: "audio",
    IMAGES: "images",
    TEMP: "temp",
  },
  MAX_USER_STORAGE: 5 * 1024 * 1024 * 1024, // 5GB per user
  CLEANUP_INTERVAL: 24 * 60 * 60 * 1000, // 24 hours
  TEMP_FILE_TTL: 60 * 60 * 1000, // 1 hour
} as const;

// AI Service constants
export const AI_SERVICES = {
  OPENAI: {
    BASE_URL: "https://api.openai.com/v1",
    MODELS: {
      TTS: "tts-1",
      TRANSCRIPTION: "whisper-1",
      EMBEDDING: "text-embedding-ada-002",
    },
    MAX_TOKENS: {
      TTS: 4096,
      TRANSCRIPTION: 25 * 1024 * 1024, // 25MB file size limit
    },
  },
  DEEPINFRA: {
    BASE_URL: "https://api.deepinfra.com/v1/inference",
    MODELS: {
      TRANSCRIPTION: "openai/whisper-large-v3",
    },
  },
  ANTHROPIC: {
    BASE_URL: "https://api.anthropic.com/v1",
    MODELS: {
      CLAUDE: "claude-3-sonnet-20240229",
    },
  },
} as const;

// Database constants
export const DATABASE = {
  CONNECTION_TIMEOUT: 10000, // 10 seconds
  QUERY_TIMEOUT: 30000, // 30 seconds
  MAX_CONNECTIONS: 20,
  TABLES: {
    USERS: "users",
    RESOURCES: "resources",
    PROJECTS: "projects",
    CHAPTERS: "chapters",
    PROCESSING_JOBS: "processing_jobs",
    AUDIO_BOOKMARKS: "audio_bookmarks",
  },
} as const;

// Cache constants
export const CACHE = {
  TTL: {
    SHORT: 5 * 60, // 5 minutes
    MEDIUM: 30 * 60, // 30 minutes
    LONG: 24 * 60 * 60, // 24 hours
  },
  KEYS: {
    USER_SESSION: "user:session:",
    RESOURCE_CONTENT: "resource:content:",
    PROJECT_DATA: "project:data:",
    HEALTH_CHECK: "health:check",
  },
} as const;

// Error codes for different scenarios
export const ERROR_CODES = {
  // Client errors (4xx)
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  RATE_LIMITED: 429,
  
  // Server errors (5xx)
  INTERNAL_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// Feature flags
export const FEATURES = {
  AUDIO_GENERATION: true,
  VIDEO_TRANSCRIPTION: true,
  REAL_TIME_SYNC: true,
  OFFLINE_MODE: true,
  COLLABORATIVE_EDITING: false, // Coming soon
  AI_SUMMARIZATION: true,
  MOBILE_APP: true,
} as const;

// Health check thresholds
export const HEALTH = {
  RESPONSE_TIME_THRESHOLD: 1000, // 1 second
  ERROR_RATE_THRESHOLD: 0.05, // 5%
  CPU_THRESHOLD: 0.8, // 80%
  MEMORY_THRESHOLD: 0.9, // 90%
  DISK_THRESHOLD: 0.95, // 95%
} as const;

// Monitoring constants
export const MONITORING = {
  METRICS_INTERVAL: 60000, // 1 minute
  LOG_RETENTION_DAYS: 30,
  ALERT_COOLDOWN: 5 * 60 * 1000, // 5 minutes
  PERFORMANCE_BUDGET: {
    FCP: 1800, // First Contentful Paint (ms)
    LCP: 2500, // Largest Contentful Paint (ms)
    FID: 100, // First Input Delay (ms)
    CLS: 0.1, // Cumulative Layout Shift
  },
} as const;

// Security constants
export const SECURITY = {
  PASSWORD_MIN_LENGTH: 8,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
  CSRF_TOKEN_LENGTH: 32,
  API_KEY_LENGTH: 64,
  SALT_ROUNDS: 12,
  JWT_EXPIRY: "24h",
  REFRESH_TOKEN_EXPIRY: "7d",
} as const;

// Mobile app constants
export const MOBILE = {
  OFFLINE_SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutes
  MAX_OFFLINE_STORAGE: 1 * 1024 * 1024 * 1024, // 1GB
  BACKGROUND_SYNC_TIMEOUT: 30000, // 30 seconds
  NOTIFICATION_DELAY: 2000, // 2 seconds
} as const;

// Development constants
export const DEV = {
  HOT_RELOAD_PORT: 3001,
  MOCK_API_DELAY: 500, // 500ms
  DEBUG_LOG_LEVEL: "debug",
  DISABLE_CACHE: false,
} as const;

// Regular expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  HEX_COLOR: /^#[0-9A-Fa-f]{6}$/,
  FILENAME: /^[^<>:"/\\|?*\x00-\x1f]+$/,
  URL: /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?$/,
} as const;

// Environment-specific constants
export const getEnvironmentConstants = (env: string) => {
  const base = {
    API_BASE_URL: process.env.API_URL || "http://localhost:3001",
    WEB_URL: process.env.WEB_URL || "http://localhost:3000",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
  };

  switch (env) {
    case "development":
      return {
        ...base,
        API_BASE_URL: "http://localhost:3001",
        WEB_URL: "http://localhost:3000",
        LOG_LEVEL: "debug",
        ENABLE_MOCK_DATA: true,
        DISABLE_RATE_LIMITING: true,
      };
    
    case "production":
      return {
        ...base,
        LOG_LEVEL: "warn",
        ENABLE_MOCK_DATA: false,
        DISABLE_RATE_LIMITING: false,
        SENTRY_ENABLED: true,
      };
    
    case "test":
      return {
        ...base,
        API_BASE_URL: "http://localhost:3001",
        LOG_LEVEL: "error",
        ENABLE_MOCK_DATA: true,
        DISABLE_RATE_LIMITING: true,
        DISABLE_LOGGING: true,
      };
    
    default:
      return base;
  }
};

// Type exports for better type safety
export type FileUploadConfig = typeof FILE_UPLOAD;
export type ApiConfig = typeof API;
export type ProcessingConfig = typeof PROCESSING;
export type AudioConfig = typeof AUDIO;
export type StorageConfig = typeof STORAGE;
export type AIServicesConfig = typeof AI_SERVICES;
export type DatabaseConfig = typeof DATABASE;
export type CacheConfig = typeof CACHE;
export type ErrorCodesConfig = typeof ERROR_CODES;
export type FeaturesConfig = typeof FEATURES;
export type HealthConfig = typeof HEALTH;
export type MonitoringConfig = typeof MONITORING;
export type SecurityConfig = typeof SECURITY;
export type MobileConfig = typeof MOBILE;
export type DevConfig = typeof DEV;
export type RegexConfig = typeof REGEX; 