import mongoose, { model, Schema, Document } from "mongoose";

interface IParcel extends Document {
	address?: string;
	for?: string;
	arrived?: boolean;
	latitude?: string;
	longitude?: string;
	volunteer_id?: any;
}

const parcelSchema = new mongoose.Schema(
	{
		address: { type: String, required: true },
		for: { type: String, default: "Unknown" },
		arrived: { type: Boolean, default: false },
		latitude: { type: String },
		longitude: { type: String },
		volunteer_id: { type: Schema.Types.ObjectId, default: null },
	},
	{ timestamps: true }
);

const Parcel = model<IParcel>("Parcel", parcelSchema);

export default Parcel;
