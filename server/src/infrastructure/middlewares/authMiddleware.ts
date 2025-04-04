import jwt, { JwtPayload, Secret }  from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import UserService from '../../application/services/UserService';


interface CustomUser {
  id: string;
  isAdmin: boolean;
  isSeccurity:boolean
}

export interface CustomRequest extends Request {
  user?: CustomUser;
}




export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction):void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log(token)
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return; 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') ;

    req.user = decoded as CustomUser
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const adminMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user?.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }
  };
  export const seccurityMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user?.isSeccurity) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied. security rights required.' });
    }
  };