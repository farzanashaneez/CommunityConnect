import mongoose, { Model, Schema } from "mongoose";
import { User } from "../../domain/entities/users/User";
import {
  OtpDetails,
  UserRepository,
} from "../../application/interfaces/UserRepository";
import ApartmentService from "../../application/services/ApartmentService";

const userSchema = new Schema<User>({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  apartmentId: {
    type: Schema.Types.ObjectId,
    ref: "Apartment",
    required: true,
  },
  isAdmin: { type: Boolean, default: false },
  isSecurity: { type: Boolean, default: false },

  imageUrl: { type: String },

  members: [
    {
      name: { type: String, required: true },
      relation: { type: String, required: true },
      profession: { type: String, required: true },
    },
  ],
  fcmTokens: [
    {
      token: { type: String, required: true },
      deviceInfo: { type: String },
      lastUsed: { type: Date, default: Date.now },
    },
  ],
  otp: {
    code: { type: String },
    expiryTime: { type: Date },
    verified: { type: Boolean, default: false },
    createdAt: { type: Date },
  },
});

const UserModel = mongoose.model<User>("User", userSchema);

export class MongoUserRepository implements UserRepository {
  private apartmentService = new ApartmentService();

  async create(user: User): Promise<User> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const newUser = new UserModel(user);
      const savedUser = await newUser.save({ session });

      if (user.apartmentId) {
        await this.apartmentService.markFilled(
          user.apartmentId.toString(),
          true
        );
      }

      await session.commitTransaction();
      session.endSession();

      return savedUser.populate("apartmentId");
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).exec();
  }

  async findAll(): Promise<User[]> {
    return UserModel.find({ isSecurity: false }).populate("apartmentId").sort({createdAt:-1}).exec(); // Populate to get apartment details if needed
  }
  async findAllSecurities(): Promise<User[]> {
    return UserModel.find({ isSecurity: true }).populate("apartmentId").sort({createdAt:-1}).exec(); // Populate to get apartment details if needed
  }
  async findById(userId: string): Promise<User | null> {
    const objectId = new mongoose.Types.ObjectId(userId);

    return UserModel.findById(objectId).populate("apartmentId").exec();
  }

  async update(userId: string, userData: Partial<User>): Promise<User | null> {
    return UserModel.findByIdAndUpdate(userId, userData, { new: true })
      .populate("apartmentId")
      .exec();
  }

  async addMember(
    userId: string,
    memberData: { name: string; relation: string; profession: string }
  ): Promise<User | null> {
    const objectId = new mongoose.Types.ObjectId(userId);

    return UserModel.findByIdAndUpdate(
      objectId,
      { $push: { members: memberData } },
      { new: true }
    ).exec();
  }
  async addFcmToken(
    userId: string,
    fcmTokens: { token: string; deviceInfo: string; lastUsed: Date }
  ): Promise<User | null> {
    const objectId = new mongoose.Types.ObjectId(userId);

    await UserModel.updateOne(
      { _id: objectId },
      { $pull: { fcmTokens: { token: fcmTokens.token } } }
    );

    return UserModel.findByIdAndUpdate(
      objectId,
      { $push: { fcmTokens } },
      { new: true }
    ).exec();
  }
  async getAllFCMTokens(): Promise<string[]> {
    const users = await UserModel.aggregate([
      { $match: { isSecurity: false } },
      { $unwind: "$fcmTokens" },
      { $project: { _id: 0, token: "$fcmTokens.token" } },
    ]);

    return users.map((user) => user.token);
  }

  async getAllFCMTokensOfSecurities(): Promise<string[]> {
    const users = await UserModel.aggregate([
      { $match: { isSecurity: true } },
      { $unwind: "$fcmTokens" },
      { $project: { _id: 0, token: "$fcmTokens.token" } },
    ]);

    return users.map((user) => user.token);
  }

  async updateName(
    userId: string,
    fullName: { firstname: string; lastname: string }
  ): Promise<User | null> {
    const objectId = new mongoose.Types.ObjectId(userId);

    return UserModel.findByIdAndUpdate(
      objectId,
      { $set: { firstName: fullName.firstname, lastName: fullName.lastname } },
      { new: true } // Return the updated document
    ).exec();
  }

  async updateImage(userId: string, imageUrl: string): Promise<User | null> {
    const objectId = new mongoose.Types.ObjectId(userId);

    return UserModel.findByIdAndUpdate(
      objectId,
      { $set: { imageUrl: imageUrl } },
      { new: true } // Return the updated document
    ).exec();
  }

  async deleteUser(id: string): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Step 1: Find and delete the user
      const user = await UserModel.findByIdAndDelete(id)
        .session(session)
        .exec();
      if (!user) {
        throw new Error("User not found");
      }

      // Step 2: Update the apartment's isFilled status to false if the user has an apartment
      if (user.apartmentId) {
        await this.apartmentService.markFilled(
          user.apartmentId.toString(),
          false
        );
      }

      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      // Rollback the transaction in case of error
      await session.abortTransaction();
      throw error;
    }
  }

  async getUserCount(): Promise<number> {
    const [totalUsers, aggregateResult] = await Promise.all([
      UserModel.countDocuments().exec(),
      UserModel.aggregate([
        { $unwind: "$members" },
        { $group: { _id: null, totalMembers: { $sum: 1 } } },
      ]).exec(),
    ]);

    const totalMembers = aggregateResult[0]?.totalMembers || 0;

    return totalUsers + totalMembers;
  }

  async findRecent(count: number): Promise<User[]> {
    return UserModel.find({ isSecurity: false })
      .populate("apartmentId")
      .sort({ createdAt: -1 })
      .limit(count)
      .exec();
  }

  async storeOtp(userId: string, otp: string, expiryTime: Date): Promise<void> {
    // MongoDB example:
    await UserModel.findByIdAndUpdate(userId, {
      otp: {
        code: otp,
        expiryTime: expiryTime,
        verified: false,
      },
    });
  }

  async getOtpDetails(userId: string): Promise<OtpDetails | null> {
    // MongoDB example:
    const user = await UserModel.findById(userId);
    if (!user || !user.otp) {
      return null;
    }

    return {
      otp: user.otp.code,
      expiryTime: user.otp.expiryTime,
      verified: user.otp.verified,
    };
  }

  async markOtpAsVerified(userId: string): Promise<void> {
    // MongoDB example:
    await UserModel.findByIdAndUpdate(userId, {
      "otp.verified": true,
    });
  }
}
