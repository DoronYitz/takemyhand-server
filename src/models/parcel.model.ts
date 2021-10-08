import mongoose, { model, Schema, Document } from "mongoose";

interface IParcel {
	address?: string;
	arrived?: boolean;
	lat?: number;
	lng?: number;
	volunteer?: any;
}

const parcelSchema = new mongoose.Schema(
	{
		address: { type: String, required: true },
		lat: { type: Number, required: true },
		lng: { type: Number, required: true },
		arrived: { type: Boolean, default: false },
		volunteer: { type: Schema.Types.ObjectId, default: null, ref: "Volunteer" },
	},
	{ timestamps: true }
);

const Parcel = model<IParcel & Document>("Parcel", parcelSchema);

export { Parcel, IParcel };
