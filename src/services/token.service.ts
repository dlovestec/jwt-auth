import { configurations } from "@src/configuration.js";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  userId: number;
}

export default class TokenService {
  generate = (payload: TokenPayload): string => {
    return jwt.sign(payload, configurations.jwt.secret, {
      algorithm: configurations.jwt.algorithm,
      expiresIn: configurations.jwt.expiresIn,
      issuer: configurations.jwt.issuer,
      audience: configurations.jwt.audience,
    });
  };

  verify = (token: string): TokenPayload => {
    const decoded = jwt.verify(token, configurations.jwt.secret, {
      algorithms: [configurations.jwt.algorithm],
      issuer: configurations.jwt.issuer,
      audience: configurations.jwt.audience,
    });

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof (decoded as { userId?: unknown }).userId !== "number"
    ) {
      throw new jwt.JsonWebTokenError("Invalid token payload");
    }

    return decoded as TokenPayload;
  };
}
