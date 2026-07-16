import { RegisterRequest } from "@src/schemas/register.schema.js";

export default class RegisterDTO {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;

  constructor(data: RegisterDTO) {
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.password = data.password;
  }

  static fromRequestBody(body: RegisterRequest["body"]): RegisterDTO {
    return new RegisterDTO({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
    });
  }
}
