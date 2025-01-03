

import { Server as SocketIOServer, Socket } from "socket.io";

let io: SocketIOServer;
const chatSocketMap = new Map<string, Set<string>>(); // chatId -> Set of socketIds
const userSocketMap = new Map<string, string>(); // userId -> socketId


export const initializeSocket = (server: any) => {
  io = new SocketIOServer(server, {
    cors: {
      origin:"http://localhost:5173", // Replace with frontend URL in production
      methods: ["GET", "POST"],
    },
    path: "/socket.io",
  });

  console.log("Socket.IO initialized");

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("joinChat", (chatId: string) => {
      // Add the socketId to the set of socketIds for the chatId
      if (!chatSocketMap.has(chatId)) {
        chatSocketMap.set(chatId, new Set());
      }
      chatSocketMap.get(chatId)?.add(socket.id);
      console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    socket.on("sendMessage", (data) => {
      console.log("Message received:", data);
  
      // Assume `data` contains chatId and the message
      const { chatId, content } = data;
  
      // Call sendMessageToChat to send the message to all clients in the chat
      sendMessageToChat(chatId, content);
    });
  
    socket.on("update",(data)=>{
      if(data==='event'){
        io.emit("reload", data); // Notify all clients about the new/updated notification
      }
      else if(data==='service'){
        io.emit("reload", data); // Notify all clients about the new/updated notification

      }
    })

    // When a user leaves a chat
    socket.on("leaveChat", (chatId: string) => {
      chatSocketMap.get(chatId)?.delete(socket.id);
      console.log(`Socket ${socket.id} left chat ${chatId}`);
    });

    socket.on("typing", ({ chatId, userId, isTyping }) => {
      console.log(`User ${userId} is ${isTyping ? 'typing' : 'not typing'} in chat ${chatId}`);
      sendTypingStatusToChat(chatId, userId, isTyping);
    });

    // Handling user disconnection
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
      // Remove socketId from all chat rooms it was part of
      for (let [chatId, socketIds] of chatSocketMap) {
        socketIds.delete(socket.id);
      }
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized!");
  return io;
};


export const sendMessageToChat = (chatId: string, message: string) => {
  const socketIds = chatSocketMap.get(chatId);
  if (socketIds) {
    socketIds.forEach(socketId => {
      io.to(socketId).emit("newMessage", message); // Send the message to each socketId in the chat
    });
  }
};

export const sendTypingStatusToChat = (chatId: string, userId: string, isTyping: boolean) => {
  const socketIds = chatSocketMap.get(chatId);
  console.log("userId",chatSocketMap)

  if (socketIds) {
    socketIds.forEach(socketId => {
      if (socketId !== userSocketMap.get(userId)) { // Don't send typing status to the user who is typing
        io.to(socketId).emit("userTyping", { userId, isTyping });
      }
    });
  }
};

export const emitNotificationUpdate = (notificationData:object) => {
  io.emit("notificationUpdate", notificationData); // Notify all clients about the new/updated notification
};
export const emitNotificationUpdatetoId = (requesterId:string,notificationData:object) => {
  io.to(requesterId).emit("notificationUpdate", notificationData); // Notify all clients about the new/updated notification
};
