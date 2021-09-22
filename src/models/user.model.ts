import mongoose, { model, Document } from "mongoose";

interface IUser extends Document {
	email?: string;
	password?: string;
}

const userSchema = new mongoose.Schema(
	{
		email: { type: String, required: true },
		password: { type: String, required: true },
	},
	{ timestamps: true, versionKey: false }
);

const User = model<IUser>("User", userSchema);
export default User;
