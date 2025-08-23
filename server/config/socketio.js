import { Server } from "socket.io";

import Logger from "../app/services/Logger/index.js";
import { init } from "../app/sockets/socketServer/index.js";

const logger = new Logger("Config <<==>> SocketIO");

let io;

/**
 * Startet Socket.IO und lauscht auf Verbindungen.
 * @param server - Der HTTP/S-Server
 */
export const listen = server => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
    maxHttpBufferSize: 1e8,
  });

  io.on("connection", socket => {
    logger.info(`User connected with WS. Socket ID: ${socket.id}`);

    // Behandlung von Verbindungsabbrüchen
    socket.on("disconnect", () => {
      logger.info(`User disconnected. Socket ID: ${socket.id}`);
    });

    socket.on("connect_error", error => {
      socket.io.opts.transports = ["polling", "websocket"];
      logger.error(`Connection error: ${error.message}`);
    });
    socket.on("disconnect_error", error => {
      logger.error(`Disconnect error: ${error.message}`);
    });
  });

  init(io);

  logger.info("Socket.IO connected and listening");
};

/**
 * Close socket.io connection
 * @function
 * @param {Server} io - The Socket.IO server instance to close
 */
export const close = () => {
  if (io) {
    io.close();
    logger.info("Socket.IO closed");
    io = undefined;
  } else {
    logger.info("Socket.IO server instance not provided or already closed");
  }
};
