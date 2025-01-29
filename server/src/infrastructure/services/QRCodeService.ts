import QRCode from 'qrcode';
import crypto from 'crypto';

export class QRCodeService {
  constructor(private secretKey: string) {}

  async generateQRCode(data: string): Promise<string> {
    try {
      const encryptedData = this.encrypt(data);
      return await QRCode.toDataURL(encryptedData);
    } catch (error) {
      throw new Error('Failed to generate QR code');
    }
  }

  verifyQRCode(encryptedData: string): { isValid: boolean; message: string } {
    try {
      const decryptedData = this.decrypt(encryptedData);
      const data = JSON.parse(decryptedData);
      const expirationDate = new Date(data.expirationDate);

      if (new Date() < expirationDate) {
        return { isValid: true, message: `Valid code for ${data.name}` };
      } else {
        return { isValid: false, message: 'QR code has expired' };
      }
    } catch (error) {
      return { isValid: false, message: 'Invalid QR code' };
    }
  }

  private encrypt(data: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.secretKey), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  private decrypt(encryptedData: string): string {
    const [ivHex, encryptedHex] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.secretKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}