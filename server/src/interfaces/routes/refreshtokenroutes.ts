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
const r='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDdmMWU5Yjk1YzBlNjVjZTM2YTRhMCIsImlhdCI6MTczNTE4NDc1MCwiZXhwIjoxNzM1Nzg5NTUwfQ.IZ9UUJZefGbBtChGiIIzkcaCwHj_sH3vWDktUgGqK7E'
    try {
      const decoded: any = jwt.verify(r, process.env.REFRESH_SECRET || 'refreshsecret');
      console.log('decoded*****************', decoded);
      const user: any = await UserService.getUser(decoded.id);

      const newAccessToken = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
      );

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      console.log("error in refreshtoken",error)
      res.status(403).json({ message: 'Invalid refresh token' });
    }
  };

  handleRefreshToken().catch(next);
});

export default router;
