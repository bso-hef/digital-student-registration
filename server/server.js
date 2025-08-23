import axios from "axios";
import dotenv from "dotenv-safe";
import fs from "fs";
import http from "http";
import https from "https";

import app from "./app.js";
import Logger from "./app/services/Logger/index.js";
import { listen } from "./config/socketio.js";
import "./cron.js";
import envConstants from "./utils/constants/envConstants.js";

dotenv.config();

const { NODE_ENV, NODE_SERVER_PORT } = envConstants;
const logger = new Logger("Server");

// Error handling for uncaught exceptions
process.on("uncaughtException", err => {
  const stackTrace = err.stack || "No stack trace available";
  logger.error("Crash Error", err.message);
  logger.error("Stack trace: ", stackTrace);
  logger.error("Node stopped from crashing...");
});

// Configure Axios interceptors for logging
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      logger.error("Error Status: ", {
        status: error.response.status,
        message: error.response.statusText,
      });
    } else {
      logger.error("Axios Error: No response from server.");
    }
    return Promise.reject(error);
  },
);

// SSL options for HTTPS
// TODO: Add environment keys for SSL paths
const sslOptions = {
  key: fs.readFileSync("./keys/server.key"),
  cert: fs.readFileSync("./keys/server.crt"),
};

// Start the server based on the environment
let server;

if (NODE_ENV === "development" || NODE_ENV === "local_development") {
  // Development environment: Use HTTPS
  server = https.createServer(sslOptions, app).listen(NODE_SERVER_PORT, () => {
    logger.info(`Backend server started on HTTPS at port ${NODE_SERVER_PORT}`);
  });
} else {
  // Production or other environments: Use HTTP
  server = http.createServer(app).listen(NODE_SERVER_PORT, () => {
    logger.info(`Backend server started on HTTP at port ${NODE_SERVER_PORT}`);
  });
}

// Initialize Socket.IO
listen(server);
