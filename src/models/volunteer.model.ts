import mongoose, { model, Document } from "mongoose";

interface IVolunteer extends Document {
	first_name?: string;
	last_name?: string;
	neighborhood?: string;
}

const volunteerSchema = new mongoose.Schema(
	{
		first_name: { type: String, required: true },
		last_name: { type: String, required: true },
		neighborhood: { type: String, required: true },
	},
	{ timestamps: true }
);

const Volunteer = model<IVolunteer>("Volunteer", volunteerSchema);
export default Volunteer;
