import mongoose from "mongoose";

import Logger from "../app/services/Logger/index.js";
import envConstants from "../utils/constants/envConstants.js";

const logger = new Logger("Config <<==>> MongoDB");

const { MONGO_URI } = envConstants;

const DB_URL = MONGO_URI || "mongodb://localhost:27017/mern-stack-template";

// Placeholder for resetting database with default values
const resetDatabaseWithDefaultValues = async () => {
  // TODO: Server clean ups when restarting the server
};

const connect = async (attempts = 5) => {
  for (let retry = 0; retry < attempts; retry++) {
    try {
      await mongoose.connect(DB_URL);
      logger.info("MongoDB connected successfully");
      await resetDatabaseWithDefaultValues();
      break; // Exit loop if connection is successful
    } catch (err) {
      console.error(err);
      logger.error(`MongoDB connection attempt ${retry + 1} failed:`, err);
      if (retry < attempts - 1) {
        const delay = Math.pow(2, retry) * 1000;
        logger.info(`Retrying in ${delay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        logger.error("Max connection attempts reached. MongoDB not connected.");
        // TODO: Send HIGH alert to (COLLABU Super Admin)
      }
    }
  }
};

export default async function initializeMongo() {
  // Initialize connection
  await connect();

  // Handle connection errors
  mongoose.connection.on("error", err =>
    logger.error("MongoDB connection error:", err),
  );
}
