import { QRCodeRepository, QRVerificationToken } from '../interfaces/QRCodeRepository';
import crypto from 'crypto';

export class QRCodeUseCase {
  constructor(private qrCodeRepository: QRCodeRepository) {}

  async GenerateQRCodeUseCase(userId:string,token:string,expiryDate:Date): Promise<string> {
    // const token = crypto.randomBytes(16).toString('hex');
    // const expiryDatenew = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await this.qrCodeRepository.createToken(userId, token, expiryDate);

    return token;
  }

  async VerifyQRCodeUseCase(token: string): Promise<QRVerificationToken | null> {
    const QRCodeDetails = await this.qrCodeRepository.findToken(token);
    return QRCodeDetails;
  }

  async getToken(id: string): Promise<QRVerificationToken | null> {
    const QRCodeDetails = await this.qrCodeRepository.getTokenOfUser(id);
    return QRCodeDetails
  }
}
