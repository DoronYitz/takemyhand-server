import { model, Schema, Document } from "mongoose";

interface IVolunteer {
  /**
   * Phone number
   * @example '0523323232'
   */
  phone: string;
  /**
   * User name
   * @example 'Israel israeli'
   */
  full_name: string;
  /**
   * Location coordinates
   */
  location: { type: string; coordinates: number[] };
  /**
   * Volunteer address or nearby address
   * @example 'Herbet Samuel 55, Tel-aviv'
   */
  address: string;
  /**
   * Is a driver bool
   * @example true,false
   */
  driver: boolean;
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

// Setting index on location as 2dsphere using Geographic queries
volunteerSchema.index({ location: "2dsphere" });

const Volunteer = model<IVolunteer & Document>("Volunteer", volunteerSchema);
export { Volunteer, IVolunteer };
