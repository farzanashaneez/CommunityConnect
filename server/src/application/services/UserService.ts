import { MongoUserRepository } from "../../infrastructure/database/MongoUserRepository";
import { User } from "../../domain/entities/User";

class UserService {
  private userRepository = new MongoUserRepository();

  async getUser(id:string){
    return this.userRepository.findById(id)
  }
}

export default new UserService();