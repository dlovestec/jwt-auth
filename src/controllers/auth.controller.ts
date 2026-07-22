import { REFRESH_COOKIE_NAME } from "#src/constants/auth.js";
import AppError from "#src/errors/AppError.js";
import { getRequestMetadata } from "#src/helpers.js";
import UserResource, { UserResponse } from "#src/responses/user-resource.js";
import { LoginRequest } from "#src/schemas/login.schema.js";
import { RegisterRequest } from "#src/schemas/register.schema.js";
import AuthService from "#src/services/auth.service.js";
import CookieService from "#src/services/cookie.service.js";
import { ApiResponse } from "#src/types/api.types.js";
import { RequestHandler } from "express";

export default class AuthController {
  constructor(private authService: AuthService = new AuthService()) {}

  register: RequestHandler<{}, ApiResponse<UserResponse>, RegisterRequest> =
    async (req, res) => {
      const user = await this.authService.register(req.body);

      return res.status(201).json({
        message: "User registered successfully",
        data: new UserResource(user).toJSON(),
      });
    };

  login: RequestHandler<
    {},
    ApiResponse<{ user: UserResponse; accessToken: string }>,
    LoginRequest
  > = async (req, res) => {
    const metadata = getRequestMetadata(req);
    const { user, accessToken, refreshToken } = await this.authService.login(
      req.body,
      metadata,
    );

    CookieService.setRefreshToken(res, refreshToken);

    return res.status(200).json({
      message: "User logged in successfully",
      data: { user: new UserResource(user).toJSON(), accessToken },
    });
  };

  refreshAccessToken: RequestHandler = async (req, res) => {
    const refreshTokenCookie = req.cookies[REFRESH_COOKIE_NAME];
    const { accessToken, refreshToken } =
      await this.authService.refreshToken(refreshTokenCookie);

    CookieService.setRefreshToken(res, refreshToken);

    return res.status(200).json({
      data: { accessToken },
    });
  };

  logout: RequestHandler = async (req, res) => {
    const refreshTokenCookie = req.cookies[REFRESH_COOKIE_NAME];
    if (refreshTokenCookie) {
      await this.authService.logout(refreshTokenCookie);
    }
    CookieService.clearRefreshToken(res);
    return res.status(200).json({
      message: "User logged out successfully",
    });
  };

  logoutAll: RequestHandler = async (req, res) => {
    const user = req.user;
    if (!user) {
      throw new AppError({
        message: "Unauthorized",
        statusCode: 401,
      });
    }
    await this.authService.logoutAll(user.id);
    CookieService.clearRefreshToken(res);
    return res.status(200).json({
      message: "User logged out successfully",
    });
  };
}
