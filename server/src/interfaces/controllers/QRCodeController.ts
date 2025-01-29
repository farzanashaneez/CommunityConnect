import { Request, Response, NextFunction } from 'express';
import { QRCodeService } from '../../infrastructure/services/QRCodeService';

export class QRCodeController {
  constructor(private qrCodeService: QRCodeService) {}

  async generateQRCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, expirationHours = 24 } = req.body;
      const expirationDate = new Date(Date.now() + expirationHours * 60 * 60 * 1000);
      const data = JSON.stringify({
        userId: user.id,
        name: user.name,
        expirationDate: expirationDate.toISOString(),
      });

      const qrCodeImage = await this.qrCodeService.generateQRCode(data);
      res.json({ qrCodeImage });
    } catch (error) {
      next(error);
    }
  }

  verifyQRCode(req: Request, res: Response, next: NextFunction): void {
    try {
      const { encryptedData } = req.body;
      const result = this.qrCodeService.verifyQRCode(encryptedData);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}