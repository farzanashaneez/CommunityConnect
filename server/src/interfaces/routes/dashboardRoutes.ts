import express, { NextFunction, Request, Response } from "express";
import DashboardService from "../../application/services/DashboardService";
import {
  adminMiddleware,
  authMiddleware,
} from "../../infrastructure/middlewares/authMiddleware";

const router = express.Router();
router.use(authMiddleware, adminMiddleware);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dashboardData = await DashboardService.getDashboardData();
    res.json(dashboardData);
  } catch (error) {
    next(error);
  }
});

export default router;
