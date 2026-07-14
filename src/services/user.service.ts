import User from "@src/models/user.model.js";
import UserRepository from "@src/repositories/user.repository.js";

export default class UserService {
  constructor(private userRepository: UserRepository = new UserRepository()) {}

  async getUserById(id: number): Promise<User | null> {
    return await this.userRepository.findById(id);
  }
}
