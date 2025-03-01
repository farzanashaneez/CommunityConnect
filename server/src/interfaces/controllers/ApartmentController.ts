// src/interfaces/controllers/ApartmentController.ts
import { Request, Response, NextFunction } from 'express';
import { ApartmentUseCases } from '../../application/usecases/apartmentUseCases';
import { CustomRequest } from '../../infrastructure/middlewares/authMiddleware';

export class ApartmentController {
  constructor(private apartmentUseCases: ApartmentUseCases) {}

  async create(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
     
      const apartment = await this.apartmentUseCases.createApartment(req.body);
      res.status(201).json({ message: 'Apartment created successfully', apartment });
    } catch (error) {
      next(error); // Pass the error to the error handler middleware
    }
  }

  async getApartments(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const apartments = await this.apartmentUseCases.getAllApartments();
      res.json(apartments);
    } catch (error) {
      next(error); // Pass the error to the error handler middleware
    }
  }
}