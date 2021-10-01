import mongoose, { model, Schema, Document } from "mongoose";

interface IParcel {
	address?: string;
	for?: string;
	arrived?: boolean;
	latitude?: string;
	longitude?: string;
	volunteer?: any;
}

const parcelSchema = new mongoose.Schema(
	{
		address: { type: String, required: true },
		for: { type: String, default: "Unknown" },
		arrived: { type: Boolean, default: false },
		latitude: { type: String },
		longitude: { type: String },
		volunteer: { type: Schema.Types.ObjectId, default: null, ref: "Volunteer" },
	},
	{ timestamps: true }
);

const Parcel = model<IParcel & Document>("Parcel", parcelSchema);

export { Parcel, IParcel };
