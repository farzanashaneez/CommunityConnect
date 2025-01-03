import mongoose, { Model, Schema } from "mongoose";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../application/interfaces/UserRepository";

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
  imageUrl: { type: String },

  members: [
    {
      name: { type: String, required: true },
      relation: { type: String, required: true },
      profession: { type: String, required: true },
    },
  ],
});

const UserModel = mongoose.model<User>("User", userSchema);

export class MongoUserRepository implements UserRepository {
  async create(user: User): Promise<User> {
    const newUser = new UserModel(user);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email }).exec();
  }

  async findAll(): Promise<User[]> {
    return UserModel.find().populate("apartmentId").exec(); // Populate to get apartment details if needed
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
  
  async updateImage(
    userId: string,
    imageUrl: string
  ): Promise<User | null> {
    const objectId = new mongoose.Types.ObjectId(userId);
  
    return UserModel.findByIdAndUpdate(
      objectId,
      { $set: { imageUrl: imageUrl } },
      { new: true } // Return the updated document
    ).exec();
  }
  
  async deleteUser(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error('User not found');
    }
  }
}
