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
import refreshRoutes from './interfaces/routes/refreshtokenroutes';
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

conncetDb();
dotenv.config()
export const app=express();
const server = http.createServer(app);


app.use(cors());
initializeSocket(server);


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
app.use('/refresh-token',refreshRoutes)
app.use(errorHandler);



const PORT = process.env.PORT || 5000;
server.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})

