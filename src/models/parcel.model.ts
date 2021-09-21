import mongoose, { model, Schema, Document } from "mongoose";

interface IParcel extends Document {
	driver_id?: any;
	addressee_name?: string;
	status?: string;
	address?: string;
	neighborhood?: string;
	latitude?: string;
	longitude?: string;
}

const parcelSchema = new mongoose.Schema(
	{
		addressee_name: { type: String },
		status: { type: String, required: true },
		neighborhood: { type: String, required: true },
		address: { type: String, required: true },
		latitude: { type: String },
		longitude: { type: String },
		driver_id: { type: Schema.Types.ObjectId },
	},
	{ timestamps: true }
);

const Parcel = model<IParcel>("Parcel", parcelSchema);

export default Parcel;
