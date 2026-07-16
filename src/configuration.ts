import dotenv from "dotenv";
import { Algorithm } from "jsonwebtoken";
import { z } from "zod";

dotenv.config();

const configSchema = z
  .object({
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    APP_ENV: z.enum(["development", "production"]).default("development"),

    DB_HOST: z.string().trim().min(1, "DB_HOST is required"),
    DB_PORT: z.coerce.number().int().min(1).max(65535).default(3306),
    DB_USER: z.string().trim().min(1, "DB_USER is required"),
    DB_PASSWORD: z.string().min(1, "DB_PASSWORD is required"),
    DB_DATABASE: z.string().trim().min(1, "DB_DATABASE is required"),

    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.coerce.number().int().positive(),
    JWT_REFRESH_EXPIRES_IN: z.coerce.number().int().positive(),
    JWT_ALGORITHM: z.enum(["HS256"]).default("HS256"),
    JWT_ISSUER: z.string().trim().min(1, "JWT_ISSUER is required"),
    JWT_AUDIENCE: z.string().trim().min(1, "JWT_AUDIENCE is required"),

    COOKIE_DOMAIN: z.string().min(1, "COOKIE_DOMAIN is required"),
    COOKIE_SECURE: z.enum(["true", "false"]).transform((v) => v === "true"),
  })
  .superRefine((env, ctx) => {
    const minSecretLength = env.APP_ENV === "production" ? 64 : 32;

    if (env.JWT_SECRET.length < minSecretLength) {
      ctx.addIssue({
        code: "custom",
        path: ["JWT_SECRET"],
        message: `JWT_SECRET must be at least ${minSecretLength} characters long`,
      });
    }

    if (
      env.APP_ENV === "production" &&
      ["secret", "changeme", "password", "jwt-secret"].some((value) =>
        env.JWT_SECRET.toLowerCase().includes(value),
      )
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["JWT_SECRET"],
        message: "Weak JWT_SECRET detected",
      });
    }
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
  db: {
    host: validatedConfigs.DB_HOST,
    port: validatedConfigs.DB_PORT,
    username: validatedConfigs.DB_USER,
    password: validatedConfigs.DB_PASSWORD,
    database: validatedConfigs.DB_DATABASE,
  },
  jwt: {
    secret: validatedConfigs.JWT_SECRET,
    expiresIn: validatedConfigs.JWT_EXPIRES_IN,
    refreshTokenExpiresIn: validatedConfigs.JWT_REFRESH_EXPIRES_IN,
    algorithm: validatedConfigs.JWT_ALGORITHM as Algorithm,
    issuer: validatedConfigs.JWT_ISSUER,
    audience: validatedConfigs.JWT_AUDIENCE,
  },
  cookie: {
    domain: validatedConfigs.COOKIE_DOMAIN,
    secure: validatedConfigs.COOKIE_SECURE,
  },
});
