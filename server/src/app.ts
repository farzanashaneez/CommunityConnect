import express from "express"
import dotenv from "dotenv"
import conncetDb from "./infrastructure/config/connectDB";
import cors from 'cors';
import userRouter from "./interfaces/routes/userRoutes";
import apartmentRoutes from './interfaces/routes/apartmentroutes';
import morgan from 'morgan';

conncetDb();
dotenv.config()
const app=express();

app.use(cors());
app.use(express.json())
app.use(morgan('combined'));
app.use(express.urlencoded({extended:true}))
app.use('/api/users',userRouter)
app.use('/api/apartments', apartmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})

