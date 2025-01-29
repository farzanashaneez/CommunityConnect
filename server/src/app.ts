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
import { initializeSocket } from "./infrastructure/services/socket";
import chatRoutes from "./interfaces/routes/chatRoutes";
import postRoutes from "./interfaces/routes/postRoutes";
import notificationRoutes from './interfaces/routes/notificationRoutes';
import refreshRoutes from './interfaces/routes/refreshtokenroutes';
import dashboardRoute  from './interfaces/routes/dashboardRoutes';
import bookRoutes  from './interfaces/routes/bookingRoutes';
import hallRoutes  from './interfaces/routes/hallRoutes';
import stripeRoute from './interfaces/routes/stripeRoute'

import http from "http";
import { ServiceAccount } from 'firebase-admin';
import {initializeApp, cert } from "firebase-admin/app";
 const serviceAccount =require('../FB-service-account-key.json');

initializeApp({
  credential: cert(serviceAccount as ServiceAccount)
});


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
app.use('/api/refresh-token',refreshRoutes)
app.use('/api/posts', postRoutes);
app.use('/api/getDashboardData', dashboardRoute);
app.use('/api/booking', bookRoutes);
app.use('/api/hall', hallRoutes);
app.use('/api/payment',stripeRoute);


app.use(errorHandler);



const PORT = process.env.PORT || 5000;
server.listen({
  port: 5000,
  host: '0.0.0.0'
},()=>{
    console.log(`Server running on port ${PORT}`)
})

