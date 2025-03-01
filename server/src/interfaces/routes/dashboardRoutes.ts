import express, { NextFunction, Request, Response } from 'express';
import DashboardService from '../../application/services/DashboardService';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dashboardData = await DashboardService.getDashboardData();
    res.json(dashboardData);
  } catch (error) {
    next(error);
  }
});

export default router;
