import mongoose, { model, Document } from "mongoose";

interface IVolunteer extends Document {
	full_name?: string;
	phone?: string;
	num_of_people?: number;
	driver?: boolean;
}

const volunteerSchema = new mongoose.Schema(
	{
		full_name: { type: String, required: true },
		phone: { type: Number, required: true },
		num_of_people: { type: Number, default: 1 },
		driver: { type: Boolean, default: false },
	},
	{ timestamps: true, versionKey: false }
);

const Volunteer = model<IVolunteer>("Volunteer", volunteerSchema);
export default Volunteer;
