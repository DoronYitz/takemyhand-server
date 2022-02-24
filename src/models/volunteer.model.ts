import { model, Schema, Document } from "mongoose";

interface IVolunteer {
  phone?: string;
  full_name?: string;
  location?: { type: string; coordinates: number[] };
  address?: string;
  driver?: boolean;
}

const volunteerSchema = new Schema(
  {
    phone: { type: String, required: true },
    full_name: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      type: { type: String },
      coordinates: [],
    },
    driver: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

volunteerSchema.index({ location: "2dsphere" });

const Volunteer = model<IVolunteer & Document>("Volunteer", volunteerSchema);
export { Volunteer, IVolunteer };
