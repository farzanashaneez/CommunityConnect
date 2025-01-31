export interface QRVerificationToken extends Document {
  userId: any;
  token: string;
  expiryDate: Date;
}
export interface QRCodeRepository {
   createToken(userId: string, token: string, expiryDate: Date): Promise<QRVerificationToken> ;
   findToken(token: string): Promise<QRVerificationToken | null>;
   getTokenOfUser(id: string): Promise<QRVerificationToken | null>;
   deleteExpiredTokens(): Promise<void>;
}