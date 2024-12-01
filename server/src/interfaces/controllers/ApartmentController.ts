// src/interfaces/controllers/ApartmentController.ts
import { Request, Response } from 'express';
import { ApartmentUseCases } from '../../application/usecases/apartmentUseCases';
import { CustomRequest } from '../../infrastructure/middlewares/authMiddleware';

export class ApartmentController {
  constructor(private apartmentUseCases: ApartmentUseCases) {}

  async create(req: CustomRequest, res: Response): Promise<void> {
    try {
      const apartment = await this.apartmentUseCases.createApartment(req.body);
      res.status(201).json({ message: 'Apartment created successfully', apartment });
    } catch (error) {
      res.status(400).json({ message: 'Failed to create apartment', error });
    }
  }

  async getApartments(req: CustomRequest, res: Response): Promise<void> {
    try {
      const apartments = await this.apartmentUseCases.getAllApartments();
      res.json(apartments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve apartments', error });
    }
  }
}