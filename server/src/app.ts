import express from "express"
import dotenv from "dotenv"
import conncetDb from "./infrastructure/config/connectDB";
import cors from 'cors';
import userRouter from "./interfaces/routes/userRoutes";
import apartmentRoutes from './interfaces/routes/apartmentroutes';
import morgan from 'morgan';
import errorHandler from "./infrastructure/middlewares/errorHandlerMiddleware";
import serviceRoutes from "./interfaces/routes/serviceRoutes";
import eventRoutes from  "./interfaces/routes/eventRoutes";
import announcementRoutes from  "./interfaces/routes/announcementRoutes";
import chatRoutes from "./interfaces/routes/chatRoutes";
import { initializeSocket } from "./infrastructure/services/socketIOServices";
import notificationRoutes from './interfaces/routes/notificationRoutes';
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

conncetDb();
dotenv.config()
export const app=express();
const server = http.createServer(app);


app.use(cors());
initializeSocket(server);

// const server = http.createServer(app);
// const io = new SocketIOServer(server, {
//     cors: {
//       origin: "http://localhost:5173", // Replace with your frontend URL
//       methods: ["GET", "POST"],
//     },
//     transports: ['websocket', 'polling'],  });
  
//   io.on("connection", (socket: Socket) => {
//     console.log(`User connected: ${socket.id}`);
  
//     // Listen for messages from clients
//     socket.on("sendMessage", (data) => {
//       console.log("Message received:", data);
  
//       // Broadcast the message to all clients in the same chat room
//       io.emit("messageReceived", data);
//     });
  
//     // Handle disconnection
//     socket.on("disconnect", () => {
//       console.log(`User disconnected: ${socket.id}`);
//     });
//   });


app.use(express.json())
app.use(morgan('combined'));
app.use(express.urlencoded({extended:true}))
app.use('/api/users',userRouter)
app.use('/api/apartments', apartmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/events', eventRoutes)
app.use('/api/announcements',announcementRoutes )
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);



const PORT = process.env.PORT || 5000;
server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})

