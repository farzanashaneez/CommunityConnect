import mongoose, { Schema, Model, Document } from 'mongoose';
import { QRCodeRepository, QRVerificationToken } from '../../application/interfaces/QRCodeRepository';



const QRVerificationTokenSchema = new Schema<QRVerificationToken>({
  userId: { type: Schema.Types.ObjectId,ref:'User', required: true },
  token: { type: String, required: true, unique: true },
  expiryDate: { type: Date, required: true },
});
QRVerificationTokenSchema.index({expiryDate:1},{expireAfterSeconds:0})
const QRVerificationTokenModel: Model<QRVerificationToken> = mongoose.model<QRVerificationToken>('QRVerificationToken', QRVerificationTokenSchema);

export class MongoQRCodeRepository implements QRCodeRepository {
  async createToken(userId: string, token: string, expiryDate: Date): Promise<QRVerificationToken> {
    const newToken = new QRVerificationTokenModel({ userId, token, expiryDate });
    return newToken.save();
  }

  async findToken(token: string): Promise<QRVerificationToken | null> {
    return QRVerificationTokenModel.findOne({ token })
    .populate({
      path:'userId',
      populate:{
        path:'apartmentId'
      }
    })
    .exec();
  }
 async getTokenOfUser(id: string): Promise<QRVerificationToken | null> {
  return QRVerificationTokenModel.findOne({ userId:id })
  .populate({
    path:'userId',
    populate:{
      path:'apartmentId'
    }
  })
  .exec();
}
  async deleteExpiredTokens(): Promise<void> {
    await QRVerificationTokenModel.deleteMany({ expiryDate: { $lt: new Date() } }).exec();
  }
}
