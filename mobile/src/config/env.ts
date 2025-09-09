/**
 * Environment configuration for mobile client
 */

import Constants from 'expo-constants';

interface MobileConfig {
  socketUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

// Get socket URL with fallbacks for different environments
const getSocketUrl = (): string => {
  const host = Constants.expoConfig?.hostUri?.split(':')?.[0];
  if (host) return `http://${host}:4000`;

  return 'http://localhost:4000';
};

// Validate and create configuration
const validateEnv = (): MobileConfig => {
  const socketUrl = getSocketUrl();

  // Validate URL format
  try {
    new URL(socketUrl);
  } catch {
    throw new Error('Socket URL must be a valid URL');
  }

  return {
    socketUrl,
    isDevelopment: __DEV__,
    isProduction: !__DEV__,
  };
};

export const config = validateEnv();
export default config;
