import Session from "#src/models/session.model.js";
import BaseRepository, {
  IBaseRepository,
} from "#src/repositories/base.repository.js";

export interface ISessionRepository extends IBaseRepository<Session> {
  findOneByTokenHash(tokenHash: string): Promise<Session | null>;
}

export default class SessionRepository
  extends BaseRepository<Session>
  implements ISessionRepository
{
  constructor() {
    super(Session);
  }

  async findOneByTokenHash(tokenHash: string): Promise<Session | null> {
    const session = await this.findOne({
      where: { tokenHash },
    });
    return session;
  }
}
