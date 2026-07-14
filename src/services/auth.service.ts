import LoginDTO from "@src/dtos/login.dto.js";
import RegisterDTO from "@src/dtos/register.dto.js";
import AppError from "@src/errors/AppError.js";
import {
  generateRefreshToken,
  getTokenExpiryDate,
  hashRefreshToken,
} from "@src/helpers.js";
import RefreshTokenRepository, {
  IRefreshTokenRepository,
} from "@src/repositories/refresh-token.repository.js";
import UserRepository, {
  IUserRepository,
} from "@src/repositories/user.repository.js";
import TokenService from "@src/services/token.service.js";
import bcrypt from "bcryptjs";

export default class AuthService {
  constructor(
    private userRepository: IUserRepository = new UserRepository(),
    private tokenService: TokenService = new TokenService(),
    private refreshTokenRepository: IRefreshTokenRepository = new RefreshTokenRepository(),
  ) {}

  register = async (payload: RegisterDTO) => {
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

  login = async ({ email, password }: LoginDTO) => {
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

    await this.refreshTokenRepository.create({
      userId: user.id,
      token: refreshTokenHash,
      expiresAt: getTokenExpiryDate(),
    });

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  };

  refreshToken = async (
    token: string,
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    const check = await this.refreshTokenRepository.findOneByTokenHash(token);

    if (!check) {
      throw new AppError({
        message: "Invalid refresh token",
        statusCode: 401,
      });
    }

    if (check.expiresAt.getTime() < Date.now()) {
      await check.destroy();

      throw new AppError({
        message: "Refresh token expired",
        statusCode: 401,
      });
    }

    const accessToken = this.tokenService.generate({ userId: check.userId });

    const newRefreshToken = generateRefreshToken();
    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

    await check.update({
      token: newRefreshTokenHash,
      expiresAt: getTokenExpiryDate(),
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  };

  logout = async (token: string): Promise<void> => {
    const check = await this.refreshTokenRepository.findOneByTokenHash(token);
    if (check) {
      await check.destroy();
    }
  };

  logoutAll = async (userId: number): Promise<void> => {
    await this.refreshTokenRepository.delete({
      where: { userId },
    });
  };
}
