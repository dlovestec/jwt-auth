import { hashRefreshToken } from "@src/helpers.js";
import RefreshToken from "@src/models/refresh-token.model.js";
import BaseRepository, { IBaseRepository } from "./base.repository.js";

export interface IRefreshTokenRepository extends IBaseRepository<RefreshToken> {
  findOneByTokenHash(token: string): Promise<RefreshToken | null>;
}

export default class RefreshTokenRepository
  extends BaseRepository<RefreshToken>
  implements IRefreshTokenRepository
{
  constructor() {
    super(RefreshToken);
  }

  async findOneByTokenHash(token: string): Promise<RefreshToken | null> {
    const refreshToken = await this.findOne({
      where: { token: hashRefreshToken(token) },
    });
    return refreshToken;
  }
}
