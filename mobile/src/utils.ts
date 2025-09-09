/**
 * Utility functions for the Pictionary Realtime mobile client
 */

import { CONFIG } from './types';

/**
 * Generates a unique stroke ID
 */
export const generateStrokeId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
};

/**
 * Sanitizes user input by trimming and limiting length
 */
export const sanitizeString = (input: string, maxLength: number): string => {
  return String(input).trim().slice(0, maxLength);
};

/**
 * Sanitizes a user name
 */
export const sanitizeName = (name: string): string => {
  return sanitizeString(name, CONFIG.MAX_NAME_LENGTH);
};

/**
 * Sanitizes a chat message
 */
export const sanitizeMessage = (message: string): string => {
  return sanitizeString(message, CONFIG.MAX_MESSAGE_LENGTH);
};

/**
 * Generates a fallback user name based on socket ID
 */
export const generateFallbackName = (socketId: string): string => {
  return `User-${socketId.slice(0, 4)}`;
};

/**
 * Normalizes coordinates to 0-1 range
 */
export const normalizeCoordinates = (
  x: number,
  y: number,
  width: number,
  height: number
): { nx: number; ny: number } => {
  return {
    nx: Math.max(0, Math.min(1, x / width)),
    ny: Math.max(0, Math.min(1, y / height)),
  };
};

/**
 * Denormalizes coordinates from 0-1 range to actual pixels
 */
export const denormalizeCoordinates = (
  nx: number,
  ny: number,
  width: number,
  height: number
): { x: number; y: number } => {
  return {
    x: nx * width,
    y: ny * height,
  };
};

/**
 * Clamps a number between min and max values
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Clamps stroke size to valid range
 */
export const clampStrokeSize = (size: number): number => {
  return clamp(size, CONFIG.MIN_STROKE_SIZE, CONFIG.MAX_STROKE_SIZE);
};

/**
 * Formats timestamp for display
 */
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString();
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Creates a logger with consistent formatting
 */
export const createLogger = (prefix: string) => {
  return {
    info: (message: string, ...args: any[]) => {
      console.log(`[${prefix}] ${message}`, ...args);
    },
    warn: (message: string, ...args: any[]) => {
      console.warn(`[${prefix}] ${message}`, ...args);
    },
    error: (message: string, ...args: any[]) => {
      console.error(`[${prefix}] ${message}`, ...args);
    },
  };
};
