import { configurations } from "@src/configuration.js";
import { REFRESH_COOKIE_NAME } from "@src/constants/auth.js";
import LoginDTO from "@src/dtos/login.dto.js";
import RefreshTokenDTO from "@src/dtos/refresh-token.dto.js";
import RegisterDTO from "@src/dtos/register.dto.js";
import { RefreshTokenRequest } from "@src/schemas/refresh-token.schema.js";
import AuthService from "@src/services/auth.service.js";
import { type Request, type Response } from "express";

export default class AuthController {
  constructor(private authService: AuthService = new AuthService()) {}

  register = async (req: Request, res: Response): Promise<Response> => {
    const payload = RegisterDTO.fromRequestBody(req.body);

    const user = await this.authService.register(payload);

    return res.status(201).json({
      message: "User registered successfully",
      data: user.toJSON(),
    });
  };

  private setRefreshTokenCookie(token: string, res: Response): void {
    res.cookie(REFRESH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "strict",
      path: "/api/auth",
      domain: configurations.cookie.domain,
      secure: configurations.cookie.secure,
      maxAge: configurations.jwt.refreshTokenExpiresIn * 1000,
    });
  }

  private clearRefreshTokenCookie(res: Response): void {
    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      sameSite: "strict",
      path: "/api/auth",
      domain: configurations.cookie.domain,
      secure: configurations.cookie.secure,
    });
  }

  login = async (req: Request, res: Response): Promise<Response> => {
    const payload = LoginDTO.fromRequestBody(req.body);

    const { user, accessToken, refreshToken } =
      await this.authService.login(payload);

    this.setRefreshTokenCookie(refreshToken, res);

    return res.status(200).json({
      message: "User logged in successfully",
      data: { user, accessToken },
    });
  };

  refreshAccessToken = async (req: RefreshTokenRequest, res: Response) => {
    const { token } = RefreshTokenDTO.fromRequestCookie(req.cookies);

    const { accessToken, refreshToken } =
      await this.authService.refreshToken(token);

    this.setRefreshTokenCookie(refreshToken, res);

    return res.status(200).json({
      accessToken,
    });
  };

  logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
    await this.authService.logout(refreshToken);
    this.clearRefreshTokenCookie(res);
    return res.status(200).json({
      message: "User logged out successfully",
    });
  };

  logoutAll = async (req: Request, res: Response) => {
    const user = req.user!;
    await this.authService.logoutAll(user.id);
    this.clearRefreshTokenCookie(res);
    return res.status(200).json({
      message: "User logged out successfully",
    });
  };
}
