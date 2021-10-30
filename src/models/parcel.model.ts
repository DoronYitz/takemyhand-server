import mongoose, { model, Schema, Document } from "mongoose";

interface IParcel {
	address?: string;
	arrived?: boolean;
	location?: { type: string; coordinates: number[] };
	volunteer?: any;
}

const parcelSchema = new mongoose.Schema(
	{
		address: { type: String, required: true },
		location: {
			type: { type: String },
			coordinates: [],
		},
		arrived: { type: Boolean, default: false },
		volunteer: { type: Schema.Types.ObjectId, default: null, ref: "Volunteer" },
	},
	{ timestamps: true }
);

parcelSchema.index({ location: "2dsphere" });

const Parcel = model<IParcel & Document>("Parcel", parcelSchema);

export { Parcel, IParcel };
