import AppError from "@src/errors/AppError.js";
import TokenService from "@src/services/token.service.js";
import UserService from "@src/services/user.service.js";
import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";

const tokenService = new TokenService();
const userService = new UserService();

export default async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return next(
        new AppError({
          message: "You are not logged in. Please login to gain access.",
          statusCode: 401,
        }),
      );
    }

    const token = authHeader.split(" ")[1]?.trim();

    if (!token || token.length === 0) {
      return next(
        new AppError({
          message: "Invalid authorization token.",
          statusCode: 401,
        }),
      );
    }

    const { userId } = tokenService.verify(token);
    const user = await userService.getUserById(userId);

    if (!user) {
      return next(
        new AppError({
          message: "The user belonging to this token no longer exists.",
          statusCode: 401,
        }),
      );
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(
        new AppError({
          message:
            "Invalid authorization token provided or the token has expired.",
          statusCode: 401,
        }),
      );
    }

    return next(
      new AppError({
        message: "Internal server error",
        statusCode: 500,
      }),
    );
  }
}
