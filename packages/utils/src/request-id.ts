import { v4 as uuidv4 } from "uuid";

// Generate a unique request ID
export const generateRequestId = (): string => {
  return uuidv4();
};

// Extract request ID from headers
export const extractRequestId = (headers: Record<string, string | string[] | undefined>): string => {
  const requestId = headers["x-request-id"] || headers["X-Request-ID"];
  
  if (Array.isArray(requestId)) {
    return requestId[0] || generateRequestId();
  }
  
  return requestId || generateRequestId();
};

// Validate request ID format (UUID v4)
export const isValidRequestId = (requestId: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(requestId);
};

// Create request ID with prefix
export const createRequestId = (prefix?: string): string => {
  const id = generateRequestId();
  return prefix ? `${prefix}-${id}` : id;
}; 