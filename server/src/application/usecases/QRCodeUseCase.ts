// import { QRCodeGenerator } from '../infrastructure/QRCodeGenerator';
// import { DataEncryption } from '../infrastructure/DataEncryption';


// export class GenerateQRCode {
//   constructor(
//     private qrCodeGenerator: QRCodeGenerator,
//     private dataEncryption: DataEncryption
//   ) {}

//   async execute(user: { id: string; name: string }, expirationHours = 24): Promise<string> {
//     const expirationDate = new Date(Date.now() + expirationHours * 60 * 60 * 1000);
//     const data = {
//       userId: user.id,
//       name: user.name,
//       expirationDate: expirationDate.toISOString(),
//     };

//     const encryptedData = this.dataEncryption.encrypt(JSON.stringify(data));
//     return await this.qrCodeGenerator.generate(encryptedData);
//   }
// }

// export class VerifyQRCode {
//   constructor(private dataEncryption: DataEncryption) {}

//   execute(encryptedData: string): { isValid: boolean; message: string } {
//     try {
//       const decryptedData = this.dataEncryption.decrypt(encryptedData);
//       const data = JSON.parse(decryptedData);
//       const expirationDate = new Date(data.expirationDate);

//       if (new Date() < expirationDate) {
//         return { isValid: true, message: `Valid code for ${data.name}` };
//       } else {
//         return { isValid: false, message: 'QR code has expired' };
//       }
//     } catch (error) {
//       return { isValid: false, message: 'Invalid QR code' };
//     }
//   }
// }
