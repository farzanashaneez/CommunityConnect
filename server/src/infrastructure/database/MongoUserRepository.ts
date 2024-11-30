import mongoose, { Model, Schema } from "mongoose";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../application/interfaces/UserRepository";

const userSchema = new Schema<User>({
    firstName: { type: String,  },
    lastName: { type: String, },
    email: { type: String, required:true, unique:true },
    mobileNumber:{ type:String, required:true, unique:true },
    password:{ type:String, required:true },
    apartmentId:{ type : Schema.Types.ObjectId, ref : 'Apartment', required : true }, 
    isAdmin:{ type:Boolean, default:false },
    imageUrl:{ type:String },
    
   members:[{
        name:{type:String,required:true},
        relation:{type:String,required:true},
        provision:{type:String,required:true}
   }]
});

const UserModel = mongoose.model<User>('User', userSchema);

export class MongoUserRepository implements UserRepository {
   async create(user : User): Promise<User> {
       const newUser = new UserModel(user);
       return newUser.save();
   }

   async findByEmail(email : string): Promise<User | null> {
       return UserModel.findOne({ email }).exec();
   }

   async findAll(): Promise<User[]> {
       return UserModel.find().populate('apartmentId').exec(); // Populate to get apartment details if needed
   }
}