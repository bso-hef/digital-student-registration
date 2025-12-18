/**
 * Centralized Application Configuration
 *
 * This module provides a single source of truth for all application configuration.
 * All configuration values are read from environment variables with sensible defaults.
 *
 * Usage:
 *   import { appConfig } from '@/lib/config/app-config';
 *   const url = appConfig.app.url;
 *
 * Environment Variables:
 *   - NEXT_PUBLIC_APP_URL: Public-facing application URL (default: http://localhost:3000)
 *   - NEXT_PUBLIC_API_URL: API base URL (default: same as APP_URL)
 *   - PORT: Application port (default: 3000)
 *   - HOSTNAME: Bind hostname (default: 0.0.0.0)
 *   - MONGODB_URI: MongoDB connection string
 *   - REDIS_URL: Redis connection URL
 *   - NEXTAUTH_URL: NextAuth base URL
 *   - NEXTAUTH_SECRET: NextAuth JWT secret
 */

/**
 * Parse a URL string into its components
 */
function parseUrl(url: string): {
  protocol: string;
  hostname: string;
  port: string;
  origin: string;
} {
  try {
    const parsed = new URL(url);
    return {
      protocol: parsed.protocol.replace(":", ""),
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === "https:" ? "443" : "80"),
      origin: parsed.origin,
    };
  } catch (error) {
    console.error(`Failed to parse URL: ${url}`, error);
    // Return defaults if parsing fails
    return {
      protocol: "http",
      hostname: "localhost",
      port: "3000",
      origin: "http://localhost:3000",
    };
  }
}

/**
 * Get environment variable value with fallback
 */
function getEnv(key: string, defaultValue: string = ""): string {
  return process.env[key] || defaultValue;
}

/**
 * Get required environment variable (throws if not set)
 */
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== "undefined";

/**
 * Server-side only configuration
 * These values are only available on the server and should never be exposed to the client
 */
export const serverConfig = {
  // MongoDB Configuration
  mongodb: {
    uri: getEnv(
      "MONGODB_URI",
      "mongodb://localhost:27017/digital-student-registration",
    ),
    user: getEnv("MONGO_USER", "admin"),
    password: getEnv("MONGO_PASSWORD", ""),
    database: getEnv("MONGO_DB", "digital-student-registration"),
  },

  // Redis Configuration
  redis: {
    url: getEnv("REDIS_URL", "redis://localhost:6379"),
    password: getEnv("REDIS_PASSWORD", ""),
  },

  // NextAuth Configuration
  nextAuth: {
    url: getEnv("NEXTAUTH_URL", "http://localhost:3000"),
    secret: getEnv("NEXTAUTH_SECRET", ""),
  },

  // Server Settings
  server: {
    port: parseInt(getEnv("PORT", "3000"), 10),
    hostname: getEnv("HOSTNAME", "0.0.0.0"),
  },
} as const;

/**
 * Public configuration (available on both server and client)
 * Only NEXT_PUBLIC_* environment variables are available in the browser
 */
const appUrl = getEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000");
const apiUrl = getEnv("NEXT_PUBLIC_API_URL", appUrl);

const parsedAppUrl = parseUrl(appUrl);
const parsedApiUrl = parseUrl(apiUrl);

export const appConfig = {
  // Application Settings
  app: {
    name: getEnv("NEXT_PUBLIC_NAME", "Digital Student Registration"),
    version: getEnv("NEXT_PUBLIC_VERSION", "1.0.0"),
    url: appUrl,
    protocol: parsedAppUrl.protocol,
    hostname: parsedAppUrl.hostname,
    port: parsedAppUrl.port,
    origin: parsedAppUrl.origin,
  },

  // API Settings
  api: {
    url: apiUrl,
    protocol: parsedApiUrl.protocol,
    hostname: parsedApiUrl.hostname,
    port: parsedApiUrl.port,
    origin: parsedApiUrl.origin,
  },

  // Environment
  env: {
    nodeEnv: getEnv("NODE_ENV", "development"),
    isDevelopment: getEnv("NODE_ENV", "development") === "development",
    isProduction: getEnv("NODE_ENV", "development") === "production",
    isTest: getEnv("NODE_ENV", "development") === "test",
    isBrowser,
    isServer: !isBrowser,
  },

  // Feature Flags (can be extended)
  features: {
    telemetryDisabled: getEnv("NEXT_TELEMETRY_DISABLED", "1") === "1",
  },
} as const;

/**
 * Helper functions for common configuration patterns
 */
export const configHelpers = {
  /**
   * Get the full student wizard URL with a student ID
   */
  getWizardUrl: (shortId: string): string => {
    return `${appConfig.app.url}/student/${shortId}`;
  },

  /**
   * Get the API endpoint URL
   */
  getApiEndpoint: (path: string): string => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${appConfig.api.url}${cleanPath}`;
  },

  /**
   * Get the health check URL
   */
  getHealthCheckUrl: (): string => {
    return `${appConfig.app.url}/api/health/live`;
  },

  /**
   * Check if SSL is enabled
   */
  isSslEnabled: (): boolean => {
    return appConfig.app.protocol === "https";
  },
};

/**
 * Validate configuration at startup
 * Call this in your app initialization to ensure all required config is set
 */
export function validateConfig(): void {
  const errors: string[] = [];

  // Validate required public config
  if (!appConfig.app.url) {
    errors.push("NEXT_PUBLIC_APP_URL is required");
  }

  // Validate server-side config (only on server)
  if (!isBrowser) {
    if (!serverConfig.nextAuth.secret && appConfig.env.isProduction) {
      errors.push("NEXTAUTH_SECRET is required in production");
    }

    if (!serverConfig.mongodb.uri) {
      errors.push("MONGODB_URI is required");
    }
  }

  if (errors.length > 0) {
    const errorMessage = `Configuration validation failed:\n${errors.join("\n")}`;
    console.error(errorMessage);

    if (appConfig.env.isProduction) {
      throw new Error(errorMessage);
    } else {
      console.warn(
        "Configuration errors detected (development mode - continuing anyway)",
      );
    }
  }
}

// Auto-validate on import in production, but NOT during build
// During build, Next.js sets NEXT_PHASE=phase-production-build
// We skip validation during build because:
// - Secrets (NEXTAUTH_SECRET, etc.) are only available at runtime
// - Build should succeed without runtime configuration
// - Validation will run when the server actually starts
const isBuildTime = process.env.NEXT_PHASE === "phase-production-build";

if (appConfig.env.isProduction && !isBuildTime) {
  validateConfig();
}

/**
 * Type exports for convenience
 */
export type AppConfig = typeof appConfig;
export type ServerConfig = typeof serverConfig;
export type ConfigHelpers = typeof configHelpers;

/**
 * Default export for convenience
 */
export default {
  app: appConfig,
  server: serverConfig,
  helpers: configHelpers,
  validate: validateConfig,
};
