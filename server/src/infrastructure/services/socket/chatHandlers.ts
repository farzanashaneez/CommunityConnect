import { Server, Socket } from "socket.io";

const chatSocketMap = new Map<string, Set<string>>();

export const registerChatHandlers = (io: Server, socket: Socket) => {
  socket.on("joinChat", (chatId: string) => {
    if (!chatSocketMap.has(chatId)) {
      chatSocketMap.set(chatId, new Set());
    }
    chatSocketMap.get(chatId)?.add(socket.id);
  });

  socket.on("sendMessage", ({ chatId, content ,status}) => {
    const socketIds = chatSocketMap.get(chatId);
    if (socketIds) {
      socketIds.forEach((socketId) => {
        io.to(socketId).emit("newMessage", content);
      });
    }
  });

  socket.on("leaveChat", (chatId: string) => {
    chatSocketMap.get(chatId)?.delete(socket.id);
  });

  socket.on("typing", ({ chatId, userId, isTyping }) => {
    const socketIds = chatSocketMap.get(chatId);
    if (socketIds) {
      socketIds.forEach((socketId) => {
        if (socketId !== socket.id) {
          io.to(socketId).emit("userTyping", { userId, isTyping });
        }
      });
    }
  });
};
