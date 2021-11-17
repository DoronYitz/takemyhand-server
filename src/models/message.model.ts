import { Schema, model, Document } from "mongoose";

interface IMessage {
	arrived?: boolean;
	content?: string;
	date?: Date;
}

const messageSchema = new Schema(
	{
		arrived: { type: Boolean, required: true },
		content: { type: String, required: true },
		date: { type: Date, required: true },
	},
	{ timestamps: false, versionKey: false }
);

const Message = model<IMessage & Document>("Message", messageSchema);

export { Message, IMessage };
