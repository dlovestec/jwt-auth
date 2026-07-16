import { REFRESH_COOKIE_NAME } from "@src/constants/auth.js";
import { RefreshTokenRequest } from "@src/schemas/refresh-token.schema.js";

export default class RefreshTokenDTO {
  readonly token: string;

  constructor(data: RefreshTokenDTO) {
    this.token = data.token;
  }

  static fromRequestCookie(
    cookies: RefreshTokenRequest["cookies"],
  ): RefreshTokenDTO {
    const refreshTokenCookie = cookies[REFRESH_COOKIE_NAME];

    return new RefreshTokenDTO({
      token: refreshTokenCookie,
    });
  }
}
