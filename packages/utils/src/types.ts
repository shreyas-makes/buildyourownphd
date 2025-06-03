// Base types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User types
export interface User extends BaseEntity {
  email: string;
  name: string;
  avatar?: string;
  isActive: boolean;
}

// File and content types
export interface FileMetadata {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  checksum: string;
}

export interface Resource extends BaseEntity {
  userId: string;
  title: string;
  description?: string;
  type: ResourceType;
  status: ProcessingStatus;
  originalFile?: FileMetadata;
  processedContent?: string;
  audioUrl?: string;
  metadata: Record<string, any>;
  tags: string[];
}

export enum ResourceType {
  PDF = "pdf",
  AUDIO = "audio",
  VIDEO = "video",
  TEXT = "text",
  MARKDOWN = "markdown",
  URL = "url",
}

export enum ProcessingStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

// Project organization types
export interface Project extends BaseEntity {
  userId: string;
  name: string;
  description?: string;
  color?: string;
  isArchived: boolean;
}

export interface Chapter extends BaseEntity {
  projectId: string;
  name: string;
  description?: string;
  order: number;
  resources: Resource[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  requestId: string;
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Processing job types
export interface ProcessingJob extends BaseEntity {
  resourceId: string;
  type: JobType;
  status: JobStatus;
  progress: number;
  result?: any;
  error?: string;
  retryCount: number;
  maxRetries: number;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export enum JobType {
  TEXT_EXTRACTION = "text_extraction",
  TRANSCRIPTION = "transcription",
  TTS_GENERATION = "tts_generation",
  CONTENT_PROCESSING = "content_processing",
}

export enum JobStatus {
  QUEUED = "queued",
  RUNNING = "running",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  RETRYING = "retrying",
}

// Audio playback types
export interface AudioMetadata {
  duration: number;
  bitrate: number;
  sampleRate: number;
  channels: number;
  format: string;
}

export interface AudioBookmark {
  id: string;
  resourceId: string;
  timestamp: number;
  title?: string;
  note?: string;
  createdAt: Date;
}

export interface PlaybackState {
  resourceId: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  playbackRate: number;
  volume: number;
}

// Configuration types
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  upload: {
    maxFileSize: number;
    allowedTypes: string[];
    chunkSize: number;
  };
  ai: {
    openai: {
      apiKey: string;
      models: {
        tts: string;
        transcription: string;
      };
    };
    deepinfra: {
      apiKey: string;
      baseUrl: string;
    };
  };
  storage: {
    bucket: string;
    maxStoragePerUser: number;
  };
}

// Validation types
export interface ValidationIssue {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
}

// Log types
export enum LogLevel {
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
}

export interface LogContext {
  requestId?: string;
  userId?: string;
  operation?: string;
  resource?: string;
  metadata?: Record<string, any>;
}

// Health check types
export interface HealthCheckResult {
  status: "healthy" | "unhealthy" | "degraded";
  timestamp: string;
  version: string;
  uptime: number;
  checks: {
    database: HealthStatus;
    storage: HealthStatus;
    ai_services: HealthStatus;
    queue: HealthStatus;
  };
}

export interface HealthStatus {
  status: "up" | "down" | "degraded";
  responseTime?: number;
  error?: string;
  details?: Record<string, any>;
} 