import { Server as SocketIOServer } from "socket.io";
import { registerChatHandlers } from "./chatHandlers";
import { registerNotificationHandlers } from "./notificationHandlers";
import { registerUserHandlers } from "./userHandlers";

let io: SocketIOServer;

export const initializeSocket = (server: any) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.SOCKET_CORS_ORIGIN,
      methods: ["GET", "POST"],
    },
    path: "/socket.io",
  });


  io.on("connection", (socket) => {

    // Register event handlers
    registerChatHandlers(io, socket);
    registerNotificationHandlers(io, socket);
    registerUserHandlers(io, socket);

    socket.on("disconnect", () => {
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized!");
  return io;
};
