import { Server, Socket } from "socket.io";

export const registerNotificationHandlers = (io: Server, socket: Socket) => {
  socket.on("update", (data) => {
    io.emit("reload", data); // Notify all clients
  });

  socket.on("emitNotification", (notificationData) => {
    io.emit("notificationUpdate", notificationData);
  });

  socket.on("emitNotificationToId", ({ requesterId, notificationData }) => {
    io.to(requesterId).emit("notificationUpdate", notificationData);
  });
};
