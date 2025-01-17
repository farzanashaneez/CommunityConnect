import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserService from '../../application/services/UserService';

const router = express.Router();

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  const handleRefreshToken = async () => {
    const { refreshToken } = req.body;
    console.log("========????????", refreshToken);

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }
    try {
      const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_SECRET || 'refreshsecret');
      console.log('decoded*****************', decoded);
      const user: any = await UserService.getUser(decoded.id);

      const newAccessToken = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
      );

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      console.error("Error in refreshtoken:", error);
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }
      res.status(500).json({ message: 'Internal server error' })
  };
  }
  handleRefreshToken().catch(next);
});

export default router;
