import ProfileController from "@src/controllers/profile.controller.js";
import isAuthenticated from "@src/middlewares/isAuthenticated.js";
import { type IRouter, Router } from "express";

const profileRouter: IRouter = Router();
const profileController = new ProfileController();

profileRouter.get("/me", isAuthenticated, profileController.me);

export default profileRouter;
