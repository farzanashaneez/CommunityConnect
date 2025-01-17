import { Server, Socket } from "socket.io";
import { getIO } from ".";
import { Message } from "../../../domain/entities/Chat";

const chatSocketMap = new Map<string, Set<string>>();

export const registerChatHandlers = (io: Server, socket: Socket) => {
  socket.on("joinChat", (chatId: string) => {
    if (!chatSocketMap.has(chatId)) {
      chatSocketMap.set(chatId, new Set());
    }
    chatSocketMap.get(chatId)?.add(socket.id);
  });

  socket.on("sendMessage", ({ chatId,_id, content ,status,senderId,createdAt}) => {
    const socketIds = chatSocketMap.get(chatId);
    if (socketIds) {
      socketIds.forEach((socketId) => {
        io.to(socketId).emit("newMessage",  { senderId, content,status,_id,createdAt });
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
  socket.on('statusUpdatedFromFrontent',({chatid,unreadMessageIds,from})=>{
    console.log("callfrom frontent",chatid,unreadMessageIds,from)
    updateMessageStatusSocket(chatid,unreadMessageIds)
  } )

};

export  const updateMessageStatusSocket = (chatId: string, messageids:string[]) => {
  console.log("called------>...............................",messageids,chatId)
  const io=getIO()
  const socketIds = chatSocketMap.get(chatId);
  console.log("called------>...............................",socketIds)
  // 'SkMQvWD6zXsYLsQCAAAJ',
  // 'IfuZxmU4SPZnpwgBAADr',
  // 'OFSb6Ix6rDLedbqwAAFZ',
  // 's5iYSVRa-ABi38lDAAHb'  'gsZrHPvEwO1teFskAAFL', '-iF8kFhy-VdT3wmsAAGz' 6788b9f882287222742d23dd 6788b99344b4be320605bb9f
  if (socketIds) {
    socketIds.forEach(socketId => {
      io.to(socketId).emit("messageStatusUpdate", messageids); // Send the message to each socketId in the chat
    });
  }
};