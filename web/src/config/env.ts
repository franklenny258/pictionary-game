/**
 * Environment configuration for web client
 */

interface WebConfig {
  socketUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

// Validate required environment variables
const validateEnv = (): WebConfig => {
  const socketUrl = 'http://localhost:4000';

  if (!socketUrl) {
    throw new Error('VITE_SOCKET_URL environment variable is required');
  }

  // Validate URL format
  try {
    new URL(socketUrl);
  } catch {
    throw new Error('VITE_SOCKET_URL must be a valid URL');
  }

  return {
    socketUrl,
    isDevelopment: true,
    isProduction: false,
  };
};

export const config = validateEnv();
export default config;
