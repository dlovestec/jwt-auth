import { LoginRequest } from "@src/schemas/login.schema.js";

export default class LoginDTO {
  readonly email: string;
  readonly password: string;

  constructor(data: LoginDTO) {
    this.email = data.email;
    this.password = data.password;
  }

  static fromRequestBody(body: LoginRequest["body"]): LoginDTO {
    return new LoginDTO({
      email: body.email,
      password: body.password,
    });
  }
}
