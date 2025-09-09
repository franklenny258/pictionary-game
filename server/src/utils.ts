/**
 * Utility functions for the Pictionary Realtime server
 */

import { CONFIG } from './types.js';

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
