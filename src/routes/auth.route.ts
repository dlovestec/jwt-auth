import AuthController from "@src/controllers/auth.controller.js";
import isAuthenticated from "@src/middlewares/isAuthenticated.js";
import { validateBody, validateCookies } from "@src/middlewares/validate.js";
import { loginSchema } from "@src/schemas/login.schema.js";
import { logoutSchema } from "@src/schemas/logout.schema.js";
import { refreshTokenSchema } from "@src/schemas/refresh-token.schema.js";
import { registerSchema } from "@src/schemas/register.schema.js";
import { Router, type IRouter } from "express";

const authRouter: IRouter = Router();
const authController = new AuthController();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  authController.register,
);

authRouter.post("/login", validateBody(loginSchema), authController.login);

authRouter.post(
  "/refresh",
  validateCookies(refreshTokenSchema),
  authController.refreshAccessToken,
);

authRouter.post(
  "/logout",
  isAuthenticated,
  validateCookies(logoutSchema),
  authController.logout,
);

authRouter.post("/logout-all", isAuthenticated, authController.logoutAll);

export default authRouter;
