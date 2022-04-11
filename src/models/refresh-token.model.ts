import { Config } from "../config";

import { Model, model, Schema } from "mongoose";
import { randomUUID as uuidv4 } from "crypto";

import { IVolunteer } from "./volunteer.model";

interface IRefreshToken {
  /**
   * Token string
   * @example '9b2b034c-2981-44f6-a073-27514bebd5ff'
   */
  token: string;
  /**
   * ObjectId of the volunteer
   */
  user: any;
  /**
   * Experation date
   */
  expiryDate: Date;
}

/**
 * Extending model interface
 */
interface RefreshTokenModel extends Model<IRefreshToken> {
  createToken(user: IVolunteer): string;
  verifyExpiration(token: any): boolean;
}

const RefreshTokenSchema = new Schema({
  token: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "Volunteer",
  },
  expiryDate: Date,
});

// Static createToken function
RefreshTokenSchema.static("createToken", async function (user) {
  // Setting expiredAt
  let expiredAt = new Date();
  expiredAt.setSeconds(expiredAt.getSeconds() + Config.JWT_REFRESH_EXPERATION);

  // Generating uuid4
  let _token = uuidv4();

  // Creating new object of the refresh token model
  let _object = new this({
    token: _token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });

  // Saving it
  let refreshToken = await _object.save();

  // Return only the token
  return refreshToken.token;
});

// Static verify expiration function
RefreshTokenSchema.static("verifyExpiration", (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
});

const RefreshToken = model<IRefreshToken & Document, RefreshTokenModel>(
  "RefreshToken",
  RefreshTokenSchema,
);

export { RefreshToken };
