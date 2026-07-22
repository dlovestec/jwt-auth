import type { RequestHandler } from "express";
import { ZodType } from "zod";

type ValidationKey = "body" | "query" | "params" | "cookies";

const validator =
  (key: ValidationKey) =>
  <T extends ZodType>(schema: T): RequestHandler =>
  async (req, _res, next) => {
    const result = await schema.safeParseAsync(req[key]);

    if (!result.success) {
      return next(result.error);
    }

    req[key] = result.data;

    next();
  };

export const validateBody = validator("body");
export const validateQuery = validator("query");
export const validateParams = validator("params");
export const validateCookies = validator("cookies");
