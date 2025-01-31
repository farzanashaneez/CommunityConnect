import { Request, Response } from 'express';
import { QRCodeUseCase } from '../../application/usecases/QRCodeUseCase';

export class QRCodeController {
  constructor(
    private qrCodeUseCase: QRCodeUseCase,
   
  ) {}

  async generateQRCode(req: Request, res: Response): Promise<void> {
    try {
      const { userId,token,expiry } = req.body;
      console.log(req.body)
      const data = await this.qrCodeUseCase.GenerateQRCodeUseCase(userId,token,expiry);
      res.json({ data });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate QR code' });
    }
  }
  async getToken(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const token = await this.qrCodeUseCase.getToken(id);
      console.log('0000000000000000000000000000000000000000000',token)

      res.status(201).json(token);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get token' });
    }
  }
  async verifyQRCode(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;
      const userId = await this.qrCodeUseCase.VerifyQRCodeUseCase(token);
      
      if (userId) {
        res.json({ userId });
      } else {
        res.status(400).json({ error: 'Invalid or expired QR code' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to verify QR code' });
    }
  }
}
