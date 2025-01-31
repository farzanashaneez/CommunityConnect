import { MongoUserRepository } from "../../infrastructure/database/MongoUserRepository";
import { User } from "../../domain/entities/User";

class UserService {
  private userRepository = new MongoUserRepository();

  async getUser(id:string){
    return this.userRepository.findById(id)
  }
  async getFCMTokens(){
    return this.userRepository.getAllFCMTokens();
  }
  async getFCMTokensOfSecurities(){
    return this.userRepository.getAllFCMTokensOfSecurities();
  }
}

export default new UserService();