// import { Server as SocketIOServer, Socket } from "socket.io";
// import http from "http";

// let io: SocketIOServer;

// export const initializeSocket = (server: http.Server) => {
//  io = new SocketIOServer(server, {
//     cors: {
//       origin: "http://localhost:5173", // Replace with your frontend URL
//       methods: ["GET", "POST"],
//       credentials: true
//     },
//     path: "/socket.io"
//   });

//   console.log("Socket.IO initialized");

//   io.on("connection", (socket: Socket) => {
//     console.log(`User connected: ${socket.id}`);

//     // Example: Listening for a message event
//     socket.on("sendMessage", (data) => {
//       console.log("Message received:", data);

//       // Broadcast the message to all clients
//       io.emit("receiveMessage", data);
//     });

//     // Example: Disconnect event
//     socket.on("disconnect", () => {
//       console.log(`User disconnected: ${socket.id}`);
//     });
//   });
// };

// export const getIO = () => {
//   if (!io) {
//     throw new Error("Socket.IO not initialized!");
//   }
//   return io;
// };


import { Server as SocketIOServer, Socket } from "socket.io";

let io: SocketIOServer;
const chatSocketMap = new Map<string, Set<string>>(); // chatId -> Set of socketIds

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
  

    // When a user leaves a chat
    socket.on("leaveChat", (chatId: string) => {
      chatSocketMap.get(chatId)?.delete(socket.id);
      console.log(`Socket ${socket.id} left chat ${chatId}`);
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
