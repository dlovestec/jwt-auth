import AppError from "#src/errors/AppError.js";
import {
  generateRefreshToken,
  getTokenExpiryDate,
  hashRefreshToken,
} from "#src/helpers.js";
import SessionRepository, {
  ISessionRepository,
} from "#src/repositories/session.repository.js";
import UserRepository, {
  IUserRepository,
} from "#src/repositories/user.repository.js";
import { LoginRequest } from "#src/schemas/login.schema.js";
import { RegisterRequest } from "#src/schemas/register.schema.js";
import TokenService from "#src/services/token.service.js";
import type { RequestMetadata } from "#src/types/request.types.js";
import bcrypt from "bcryptjs";

export default class AuthService {
  constructor(
    private userRepository: IUserRepository = new UserRepository(),
    private tokenService: TokenService = new TokenService(),
    private sessionRepository: ISessionRepository = new SessionRepository(),
  ) {}

  register = async (payload: RegisterRequest) => {
    const existingUser = await this.userRepository.findByEmail(payload.email);

    if (existingUser) {
      throw new AppError({
        message: "User already exists with this email",
        statusCode: 409,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    const user = await this.userRepository.create({
      ...payload,
      password: hashedPassword,
    });

    return user;
  };

  login = async (
    { email, password }: LoginRequest,
    metadata: RequestMetadata,
  ) => {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError({
        message: "Invalid email or password",
        statusCode: 401,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new AppError({
        message: "Invalid email or password",
        statusCode: 401,
      });
    }

    const accessToken = this.tokenService.generate({ userId: user.id });

    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    await this.sessionRepository.create({
      userId: user.id,
      tokenHash: refreshTokenHash,
      browser: metadata.browser,
      browserVersion: metadata.browserVersion,
      os: metadata.os,
      osVersion: metadata.osVersion,
      deviceType: metadata.deviceType,
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
      expiresAt: getTokenExpiryDate(),
      lastUsedAt: new Date(),
    });

    return {
      user: user,
      accessToken,
      refreshToken,
    };
  };

  refreshToken = async (
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    const tokenHash = hashRefreshToken(token);
    const session = await this.sessionRepository.findOneByTokenHash(tokenHash);

    if (!session) {
      throw new AppError({
        message: "Invalid refresh token",
        statusCode: 401,
      });
    }

    if (session.expiresAt.getTime() < Date.now()) {
      await session.destroy();

      throw new AppError({
        message: "Refresh token expired",
        statusCode: 401,
      });
    }

    const accessToken = this.tokenService.generate({ userId: session.userId });

    const newRefreshToken = generateRefreshToken();
    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

    await session.update({
      tokenHash: newRefreshTokenHash,
      expiresAt: getTokenExpiryDate(),
      lastUsedAt: new Date(),
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  };

  logout = async (token: string): Promise<void> => {
    const session = await this.sessionRepository.findOneByTokenHash(
      hashRefreshToken(token),
    );
    if (session) {
      await session.destroy();
    }
  };

  logoutAll = async (userId: number): Promise<void> => {
    await this.sessionRepository.delete({
      where: { userId },
    });
  };
}
