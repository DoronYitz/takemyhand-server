import { Config } from "../config";

import { Model, model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { IVolunteer } from "./volunteer.model";

interface IRefreshToken {
  token: string;
  user: any;
  expiryDate: Date;
}

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

RefreshTokenSchema.static("createToken", async function (user) {
  let expiredAt = new Date();

  expiredAt.setSeconds(expiredAt.getSeconds() + Config.JWT_REFRESH_EXPERATION);

  let _token = uuidv4();

  let _object = new this({
    token: _token,
    user: user._id,
    expiryDate: expiredAt.getTime(),
  });

  let refreshToken = await _object.save();

  return refreshToken.token;
});

RefreshTokenSchema.static("verifyExpiration", (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
});

const RefreshToken = model<IRefreshToken & Document, RefreshTokenModel>(
  "RefreshToken",
  RefreshTokenSchema,
);

export { RefreshToken };
