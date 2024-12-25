import express, { NextFunction, Request,Response } from 'express';
import jwt, { JwtPayload, Secret }  from 'jsonwebtoken';
import UserService from '../../application/services/UserService';
import { User } from '../../domain/entities/User';

const router = express.Router();

router.post('/refresh-token',(req:Request, res:Response, next:NextFunction)=>{ async(req:Request, res:Response, next:NextFunction) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }
  
    try {
      const decoded:any = jwt.verify(refreshToken, process.env.REFRESH_SECRET || 'refresh_secret');
      //const user = { id: decoded.id }; // Retrieve user details from database if needed
      const user:any= UserService.getUser(decoded.id)
      const newAccessToken = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
      );
  
      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(403).json({ message: 'Invalid refresh token' });
    }
}});
export default router;