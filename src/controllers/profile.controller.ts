import UserResource from "#src/responses/user-resource.js";
import type { RequestHandler } from "express";

export default class ProfileController {
  me: RequestHandler = async (req, res) => {
    res.status(200).json({ data: new UserResource(req.user!).toJSON() });
  };
}
