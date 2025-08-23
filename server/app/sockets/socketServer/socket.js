import { getUserIdFromToken } from "../../../utils/generalUtils.js";
import userModel from "../../models/User.js";
import Logger from "../../services/Logger/index.js";
import users from "./Users.socket.js";

const logger = new Logger("WS <<<===>>> SocketServer");

const activeSockets = {};

export const init = io => {
  users.io = io;

  io.of("/application")
    .use(async (socket, next) => {
      try {
        const token = socket.handshake.query.token;

        if (!token) {
          throw new Error("Token is undefined");
        }

        const userId = await getUserIdFromToken(token);
        if (!userId) {
          throw new Error("Invalid token, unable to get userId");
        }

        const user = await userModel.findOne({ _id: userId });
        if (!user) {
          throw new Error(`User with id: ${userId} is not found`);
        }

        socket.userId = userId.toString();
        socket.join(userId);
        return next();
      } catch (error) {
        logger.error("ServerSocket error:", error.message);
        socket.disconnect(true);
        return next(new Error("Authentication error | UNAUTHORIZED"));
      }
    })
    .on("connection", onValidConnection);
};

async function onValidConnection(socket) {
  await onUserConnection(socket);
}

async function onUserConnection(socket) {
  try {
    const { userId } = socket;

    if (!userId) {
      logger.error("Socket userId is missing.");
      return;
    }

    if (!activeSockets[userId]) {
      activeSockets[userId] = {};
    }

    // Set the new socket as active for the user
    activeSockets[userId][socket.id] = socket;

    logger.info(`User: ${userId} is online. Socket ID: ${socket.id}`);

    socket.on("disconnect", async () => {
      delete activeSockets[userId][socket.id];

      // If no active sockets remain for the user, set them offline
      if (Object.keys(activeSockets[userId]).length === 0) {
        logger.info(`User: ${userId} is offline. Socket ID: ${socket.id}`);
        delete activeSockets[userId]; // Clean up the user's entry
      }
    });
  } catch (error) {
    logger.error("Error in user appSocket:", error.message);
    socket.emit("error", { message: error.message });
  }
}
