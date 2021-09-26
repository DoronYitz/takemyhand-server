import mongoose, { model, Document } from "mongoose";

interface IVolunteer extends Document {
	phone?: string;
	full_name?: string;
	num_of_people?: number;
	driver?: boolean;
}

const volunteerSchema = new mongoose.Schema(
	{
		phone: { type: String, required: true },
		full_name: { type: String, required: true },
		num_of_people: { type: Number, default: 1 },
		driver: { type: Boolean, default: false },
	},
	{ timestamps: true, versionKey: false }
);

const Volunteer = model<IVolunteer>("Volunteer", volunteerSchema);
export default Volunteer;
