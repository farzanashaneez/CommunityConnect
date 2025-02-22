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

  console.log("Socket.IO initialized");

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register event handlers
    registerChatHandlers(io, socket);
    registerNotificationHandlers(io, socket);
    registerUserHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized!");
  return io;
};
