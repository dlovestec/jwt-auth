import UserService from "@src/services/user.service.js";
import type { Request, Response } from "express";

export default class ProfileController {
  constructor(private userService: UserService = new UserService()) {}

  me = async (req: Request, res: Response) => {
    const { id } = req.user;
    const user = await this.userService.getUserById(id);
    res.status(200).json({ ...user?.toJSON() });
  };
}
