import { Redis } from "ioredis";

import Logger from "../app/services/Logger/index.js";
import envConstants from "../utils/constants/envConstants.js";

const logger = new Logger("Config <<==>> Redis");

const { REDIS_HOST, REDIS_PORT } = envConstants;

const redisPort = REDIS_PORT ? Number(REDIS_PORT) : 6379;

const redisClient = new Redis({
  host: REDIS_HOST,
  port: redisPort,
  lazyConnect: true, // Delay connection until `.connect()` is explicitly called
  // url: `redis://${REDIS_HOST}:${redisPort}`,
});

redisClient.on("connect", () => {
  logger.info("Redis connected successfully");
});

redisClient.on("error", err => {
  logger.error("Redis connection error:", err);
});

(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    logger.error("Failed to connect Redis:", err);
  }
})();

export default redisClient;
