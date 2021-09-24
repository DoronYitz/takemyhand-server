import mongoose, { model, Document, Schema } from "mongoose";

interface IUser extends Document {
	email?: string;
	password?: string;
	neighborhood?: string;
	role?: "driver" | "admin";
	volunteer_id?: any;
}

const userSchema = new mongoose.Schema(
	{
		email: { type: String, required: true },
		password: { type: String, required: true },
		neighborhood: { type: String },
		role: { type: String, default: "driver" },
		volunteer_id: { type: Schema.Types.ObjectId },
	},
	{ timestamps: true, versionKey: false }
);

const User = model<IUser>("User", userSchema);
export default User;
