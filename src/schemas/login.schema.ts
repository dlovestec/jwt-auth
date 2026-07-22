import { z } from "zod";

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().trim().min(1, "Password cannot be empty"),
});

export type LoginRequest = z.infer<typeof loginSchema>;
