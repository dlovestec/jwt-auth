import { InferRequest } from "@src/types/express.types.js";
import { z } from "zod";

export const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, "Refresh token cookie is required"),
});

export type RefreshTokenRequest = InferRequest<
  undefined,
  undefined,
  undefined,
  typeof refreshTokenSchema
>;
