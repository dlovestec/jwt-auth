import { configurations } from "#src/configuration.js";
import { REFRESH_COOKIE_NAME } from "#src/constants/auth.js";
import { type Response } from "express";

export default class CookieService {
  static setRefreshToken(res: Response, token: string): void {
    res.cookie(REFRESH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "strict",
      path: "/api/auth",
      domain: configurations.cookie.domain,
      secure: configurations.cookie.secure,
      maxAge: configurations.jwt.refreshTokenExpiresIn * 1000,
    });
  }

  static clearRefreshToken(res: Response): void {
    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      sameSite: "strict",
      path: "/api/auth",
      domain: configurations.cookie.domain,
      secure: configurations.cookie.secure,
    });
  }
}
