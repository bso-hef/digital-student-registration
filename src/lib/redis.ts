/**
 * Redis Client Configuration for Production
 * Handles caching, session storage, and connection pooling
 */
import { Redis, RedisOptions } from "ioredis";

import Logger from "./server-logger";

const logger = new Logger("Redis Client");

// Redis configuration from environment
const REDIS_URL = process.env.REDIS_URL || "redis://redis:6379";
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;
const REDIS_DB = parseInt(process.env.REDIS_DB || "0", 10);
const REDIS_KEY_PREFIX = process.env.REDIS_KEY_PREFIX || "dsr:";

// Track if we've logged the development warning
let hasLoggedDevWarning = false;
const isDevelopment = process.env.NODE_ENV === "development";

// Connection options
const redisOptions: RedisOptions = {
  retryStrategy: (times: number) => {
    // In development: Give up after 3 retries (Redis is optional)
    if (isDevelopment) {
      if (times === 1 && !hasLoggedDevWarning) {
        logger.warn(
          "Redis not available in development mode (this is expected)",
        );
        hasLoggedDevWarning = true;
      }
      if (times >= 3) {
        return null; // Stop retrying
      }
      return 500; // Wait 500ms before retry
    }

    // In production: Keep retrying with exponential backoff
    const delay = Math.min(times * 50, 2000);
    if (times % 10 === 0) {
      // Only log every 10th retry to reduce spam
      logger.warn(
        `Redis connection retry attempt ${times}, waiting ${delay}ms`,
      );
    }
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  enableOfflineQueue: true,
  lazyConnect: false,
  keepAlive: 30000,
  family: 4, // IPv4
  db: REDIS_DB,
  password: REDIS_PASSWORD,
  keyPrefix: REDIS_KEY_PREFIX,
  connectTimeout: 10000,
  commandTimeout: 5000,
};

// Create Redis client instance
let redisClient: Redis | null = null;

/**
 * Get or create Redis client singleton
 */
export function getRedisClient(): Redis {
  if (redisClient && redisClient.status === "ready") {
    return redisClient;
  }

  try {
    redisClient = new Redis(REDIS_URL, redisOptions);

    // Event handlers
    redisClient.on("connect", () => {
      logger.info("Redis client connecting...");
    });

    redisClient.on("ready", () => {
      logger.info("Redis client ready");
    });

    redisClient.on("error", (err) => {
      // In development: Suppress error logs (expected when Redis is not running)
      if (!isDevelopment) {
        logger.error("Redis client error:", err);
      }
    });

    redisClient.on("close", () => {
      // In development: Suppress close warnings
      if (!isDevelopment) {
        logger.warn("Redis client connection closed");
      }
    });

    redisClient.on("reconnecting", (time: number) => {
      // In development: Suppress reconnecting warnings
      if (!isDevelopment) {
        logger.warn(`Redis client reconnecting in ${time}ms`);
      }
    });

    return redisClient;
  } catch (error) {
    logger.error("Failed to create Redis client:", error);
    throw error;
  }
}

/**
 * Gracefully disconnect Redis client
 */
export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.quit();
      logger.info("Redis client disconnected gracefully");
    } catch (error) {
      logger.error("Error disconnecting Redis client:", error);
      redisClient.disconnect();
    } finally {
      redisClient = null;
    }
  }
}

/**
 * Check if Redis is available
 */
export async function isRedisAvailable(): Promise<boolean> {
  try {
    const client = getRedisClient();

    // Check connection status first
    if (client.status !== "ready") {
      return false;
    }

    const result = await client.ping();
    return result === "PONG";
  } catch {
    // Silently return false - don't log (health checks call this frequently)
    return false;
  }
}

// Cache TTL constants (in seconds)
export const CacheTTL = {
  ONE_MINUTE: 60,
  FIVE_MINUTES: 300,
  TEN_MINUTES: 600,
  THIRTY_MINUTES: 1800,
  ONE_HOUR: 3600,
  ONE_DAY: 86400,
  ONE_WEEK: 604800,
} as const;

/**
 * Cache helper class for common caching patterns
 */
export class CacheHelper {
  private client: Redis;

  constructor() {
    this.client = getRedisClient();
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set(
    key: string,
    value: unknown,
    ttl: number = CacheTTL.ONE_HOUR,
  ): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      await this.client.setex(key, ttl, serialized);
      return true;
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      const result = await this.client.del(key);
      return result > 0;
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete multiple keys matching a pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) return 0;

      const result = await this.client.del(...keys);
      return result;
    } catch (error) {
      logger.error(`Cache delete pattern error for pattern ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get remaining TTL for a key
   */
  async ttl(key: string): Promise<number> {
    try {
      return await this.client.ttl(key);
    } catch (error) {
      logger.error(`Cache TTL error for key ${key}:`, error);
      return -1;
    }
  }

  /**
   * Increment a counter
   */
  async increment(key: string, by: number = 1): Promise<number> {
    try {
      return await this.client.incrby(key, by);
    } catch (error) {
      logger.error(`Cache increment error for key ${key}:`, error);
      return 0;
    }
  }

  /**
   * Get multiple values at once
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await this.client.mget(...keys);
      return values.map((value) => (value ? (JSON.parse(value) as T) : null));
    } catch (error) {
      logger.error(`Cache mget error:`, error);
      return keys.map(() => null);
    }
  }

  /**
   * Set multiple values at once
   */
  async mset(entries: Record<string, unknown>, ttl?: number): Promise<boolean> {
    try {
      const pipeline = this.client.pipeline();

      for (const [key, value] of Object.entries(entries)) {
        const serialized = JSON.stringify(value);
        if (ttl) {
          pipeline.setex(key, ttl, serialized);
        } else {
          pipeline.set(key, serialized);
        }
      }

      await pipeline.exec();
      return true;
    } catch (error) {
      logger.error(`Cache mset error:`, error);
      return false;
    }
  }

  /**
   * Clear all cache keys (use with caution!)
   */
  async clearAll(): Promise<boolean> {
    try {
      await this.client.flushdb();
      logger.warn("All cache cleared!");
      return true;
    } catch (error) {
      logger.error("Cache clear all error:", error);
      return false;
    }
  }
}

/**
 * Singleton instance of CacheHelper
 */
let cacheHelperInstance: CacheHelper | null = null;

export function getCacheHelper(): CacheHelper {
  if (!cacheHelperInstance) {
    cacheHelperInstance = new CacheHelper();
  }
  return cacheHelperInstance;
}

/**
 * Cache key builders for consistent naming
 */
export const CacheKeys = {
  student: (id: string) => `student:${id}`,
  students: (page: number, limit: number) => `students:list:${page}:${limit}`,
  class: (id: string) => `class:${id}`,
  classes: (page: number, limit: number) => `classes:list:${page}:${limit}`,
  dashboardStats: () => `dashboard:stats`,
  health: () => `health:status`,
  session: (sessionId: string) => `session:${sessionId}`,
} as const;

// Graceful shutdown handler
if (typeof process !== "undefined") {
  process.on("SIGTERM", async () => {
    logger.info("SIGTERM received, closing Redis connection...");
    await disconnectRedis();
  });

  process.on("SIGINT", async () => {
    logger.info("SIGINT received, closing Redis connection...");
    await disconnectRedis();
  });
}

const redisUtils = {
  getRedisClient,
  disconnectRedis,
  isRedisAvailable,
  getCacheHelper,
  CacheKeys,
  CacheTTL,
};

export default redisUtils;
