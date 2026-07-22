import User from "#src/models/user.model.js";
import { InferAttributes } from "sequelize";

declare global {
  namespace Express {
    interface Request {
      user: InferAttributes<User, { omit: "password" }>;
    }
  }
}
