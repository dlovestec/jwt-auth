import { z } from "zod";

export const logoutSchema = z.object({
  refresh_token: z.string().min(1, "Refresh token cookie is missing"),
});
