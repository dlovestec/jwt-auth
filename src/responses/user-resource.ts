import User from "#src/models/user.model.js";
import JsonResource from "#src/responses/json-resource.js";
import { InferAttributes } from "sequelize";

type UserResponseInput = InferAttributes<User, { omit: "password" }>;

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

class UserResource extends JsonResource<UserResponseInput, UserResponse> {
  toArray(): UserResponse {
    return {
      id: this.resource.id,
      firstName: this.resource.firstName,
      lastName: this.resource.lastName,
      email: this.resource.email,
    };
  }
}

export default UserResource;
