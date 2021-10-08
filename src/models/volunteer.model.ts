import mongoose, { model, Document } from "mongoose";

interface IVolunteer {
	phone?: string;
	full_name?: string;
	lat?: number;
	lng?: number;
	address?: string;
	num_of_people?: number;
	driver?: boolean;
}

const volunteerSchema = new mongoose.Schema(
	{
		phone: { type: String, required: true },
		full_name: { type: String, required: true },
		lat: { type: Number, required: true },
		lng: { type: Number, required: true },
		address: { type: String, default: "" },
		num_of_people: { type: Number, default: 1 },
		driver: { type: Boolean, default: false },
	},
	{ timestamps: true, versionKey: false }
);

const Volunteer = model<IVolunteer & Document>("Volunteer", volunteerSchema);
export { Volunteer, IVolunteer };
