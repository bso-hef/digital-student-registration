import { Namespace, Server, Socket } from "socket.io";

import { USER } from "../../../utils/constants/userConstants.js";
import { userEvents } from "./events.js";

class Users {
  _io = null;
  _appSocket = null;

  constructor() {
    this._io = null;
    this._appSocket = null;

    // Listen for online status updates
    userEvents.on(
      USER.EVENTS.ON_UPDATE_ONLINE_STATUS,
      ({ userId, onlineStatus }) => {
        this.broadcastNotification({
          type: "onUpdateOnlineStatus",
          data: { userId, onlineStatus },
        });
      },
    );
  }

  set io(io) {
    if (!this._io) {
      this._io = io;
      this._appSocket = io.of("/application");
    }
  }

  get io() {
    return this._io;
  }

  get appSocket() {
    return this._appSocket;
  }

  sendNotification(notification, { userId, userIds, type, data }) {
    if (notification && type && data) {
      if (userIds && userIds.length) {
        // Send notification to specific users
        for (const userId of userIds) {
          this.sendToPrimarySocket(userId, { notification, type, data });
        }
      } else if (userId) {
        // Send notification to one specific user
        this.sendToPrimarySocket(userId, { notification, type, data });
      } else {
        // Send notification to all users
        this.appSocket?.emit(notification, { type, data });
      }
    }
  }

  broadcastNotification(notificationData) {
    this.sendNotification("notification", notificationData);
  }

  sendToPrimarySocket(roomId, { notification, type, data }) {
    const room = this.appSocket?.adapter.rooms.get(roomId);
    if (!room || room.size === 0) {
      return [];
    }

    const primarySockets = this.filterPrimarySockets(
      Array.from(room).map(socketId => this.appSocket?.sockets.get(socketId)),
    );

    if (!primarySockets.length) {
      return false;
    }

    primarySockets.forEach(socket => {
      socket?.emit(notification, { type, data });
    });
  }

  filterPrimarySockets(sockets) {
    return sockets.filter(
      socket =>
        !!socket &&
        (socket.data.isPrimaryTab === undefined ||
          socket.data.isPrimaryTab === true),
    );
  }

  async getSocketIdsByUserId(type, userId) {
    const ioInstance = type === "app" ? this.appSocket : this.io;

    if (!ioInstance) {
      return [];
    }

    const sockets = await ioInstance.fetchSockets();
    return sockets
      .filter(socket => socket.data.user?._id?.toString() === userId)
      .map(socket => socket.id);
  }

  async getSocketIdsByUserIds(type, userIds) {
    const socketIds = [];

    if (userIds && userIds.length) {
      for (const userId of userIds) {
        const userSocketIds = await this.getSocketIdsByUserId(type, userId);
        socketIds.push(...userSocketIds);
      }
    }

    return [...new Set(socketIds)];
  }
}

const users = new Users();
export default users;
