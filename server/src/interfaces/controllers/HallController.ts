import { NextFunction, Request, Response } from 'express';
import { HallUseCase } from '../../application/usecases/HallUseCase';
import { CustomRequestWithImageArray } from '../../infrastructure/middlewares/uploadImageToCloudinary';

export class HallController {
  constructor(private hallUseCase: HallUseCase) {}

  async createHall(req: CustomRequestWithImageArray, res: Response, next: NextFunction): Promise<void> {
    try {
      const hallData = req.body;
      const images=req.imageUrls;
console.log("images from cloudinary",images)
const halldatanew={...hallData,images:images};
      const newHall = await this.hallUseCase.createHall(halldatanew);
      res.status(201).json(newHall);
    } catch (error: any) {
      res.status(400).json({ message: 'Error creating hall', error: error?.message });
    }
  }

  async getHallById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const hall = await this.hallUseCase.getHall(id);
      if (hall) {
        res.json(hall);
      } else {
        res.status(404).json({ message: 'Hall not found' });
      }
    } catch (error: any) {
      res.status(400).json({ message: 'Error fetching hall', error: error?.message });
    }
  }

  async updateHall(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const hallData = req.body;
      const updatedHall = await this.hallUseCase.updateHall(id, hallData);
      res.json(updatedHall);
    } catch (error: any) {
      res.status(400).json({ message: 'Error updating hall', error: error?.message });
    }
  }

  async deleteHall(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.hallUseCase.deleteHall(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: 'Error deleting hall', error: error?.message });
    }
  }

  async getAllHalls(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const halls = await this.hallUseCase.getAllHalls();
      res.json(halls);
    } catch (error: any) {
      res.status(400).json({ message: 'Error fetching halls', error: error?.message });
    }
  }

  async getAvailableHalls(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { date, slot } = req.query;
      const halls = await this.hallUseCase.getAvailableHalls(new Date(date as string), slot as 'morning' | 'evening' | 'fullDay');
      res.json(halls);
    } catch (error: any) {
      res.status(400).json({ message: 'Error fetching available halls', error: error?.message });
    }
  }
}