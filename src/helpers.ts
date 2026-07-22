import { configurations } from "#src/configuration.js";
import type { Request } from "express";
import crypto from "node:crypto";
import { UAParser } from "ua-parser-js";
import type { RequestMetadata } from "#src/types/request.types.js";

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

function getClientIp(req: Request): string | null {
  const forwarded = req.headers["x-forwarded-for"];

  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }

  return req.ip ?? null;
}

export function getRequestMetadata(req: Request): RequestMetadata {
  const userAgent = req.headers["user-agent"] ?? null;

  const parser = new UAParser(userAgent ?? undefined);

  const browser = parser.getBrowser();
  const os = parser.getOS();
  const device = parser.getDevice();

  return {
    browser: browser.name ?? null,
    browserVersion: browser.version ?? null,

    os: os.name ?? null,
    osVersion: os.version ?? null,

    deviceType: device.type ?? "desktop",

    userAgent,

    ipAddress: getClientIp(req),
  };
}
