import { configurations } from "@src/configuration.js";
import crypto from "node:crypto";

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  if (typeof error === "string") {
    return error;
  }
  return "An error occurred";
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString("hex");
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function getTokenExpiryDate(): Date {
  return new Date(Date.now() + configurations.jwt.refreshTokenExpiresIn * 1000);
}
