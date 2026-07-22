import User from "#src/models/user.model.js";
import BaseRepository, {
  IBaseRepository,
} from "#src/repositories/base.repository.js";

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
}

export default class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({
      where: {
        email: email.trim().toLowerCase(),
      },
    });
  }
}
