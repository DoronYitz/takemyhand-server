import mongoose, { model, Document } from "mongoose";

interface IEvent {
	title?: string;
	category?: string;
	description?: string;
	date?: Date;
	active?: boolean;
	secret?: string;
}

const eventSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		category: { type: String, required: true },
		description: { type: String, required: true },
		date: { type: Date, required: true },
		active: { type: Boolean, required: true },
		secret: { type: String, required: true },
	},
	{ timestamps: false, versionKey: false }
);

const Event = model<IEvent & Document>("Event", eventSchema);
export { Event, IEvent };
