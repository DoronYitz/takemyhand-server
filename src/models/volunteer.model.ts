import mongoose from "mongoose";
import { Schema } from "mongoose";

interface Volunteer {
	_id: any;
}

const volunteerSchema = new mongoose.Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	neighborhood: { type: String, required: true },
	firstName: { type: String, required: true },
});
