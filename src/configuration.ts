import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const configSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  APP_ENV: z.enum(["development", "production"]).default("development"),
});

const parsed = configSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  parsed.error.issues.forEach((issue) => {
    console.error(`- ${issue.path.join(".")}: ${issue.message}`);
  });
  process.exit(1);
}

const validatedConfigs = parsed.data;

export const configurations = Object.freeze({
  app: {
    port: validatedConfigs.PORT,
    appEnv: validatedConfigs.APP_ENV,
  },
});
