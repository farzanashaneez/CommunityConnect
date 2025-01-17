import { Server, Socket } from "socket.io";

const onlineUsers = new Map<string, boolean>();
const userSocketMap = new Map<string, string>();

export const registerUserHandlers = (io: Server, socket: Socket) => {
  socket.on("userConnected", (userId: string ) => {
    onlineUsers.set(userId, true);
    userSocketMap.set(userId, socket.id);
    console.log("connected users ",Array.from(onlineUsers.entries()))
    io.emit("onlineStatusUpdate", Array.from(onlineUsers.entries()));
  });

  socket.on("beoffline", ( userId: string) => {
    onlineUsers.set(userId, false);
    userSocketMap.delete(userId);
    console.log("after deleted users ",Array.from(onlineUsers.entries()))

    io.emit("onlineStatusUpdate", Array.from(onlineUsers.entries()));
  });

  socket.on("disconnect", () => {
    for (let [userId, socketId] of userSocketMap) {
      if (socketId === socket.id) {
        onlineUsers.set(userId, false);
        userSocketMap.delete(userId);
        io.emit("onlineStatusUpdate", Array.from(onlineUsers.entries()));
        break;
      }
    }
  });
};
