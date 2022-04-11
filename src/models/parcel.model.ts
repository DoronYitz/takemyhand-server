import { model, Schema, Document } from "mongoose";

interface IParcel {
  /**
   * Parcel target address
   * @example 'Herbet Samuel 55, Tel-aviv'
   */
  address: string;
  /**
   * Is a arrived bool
   * @example true,false
   */
  arrived: boolean;
  /**
   * Parcel location
   */
  location: { type: string; coordinates: number[] };
  /**
   * Volunteer object id
   */
  volunteer: any;
}

const parcelSchema = new Schema(
  {
    address: { type: String, required: true },
    location: {
      type: { type: String },
      coordinates: [],
    },
    arrived: { type: Boolean, default: false },
    volunteer: { type: Schema.Types.ObjectId, default: null, ref: "Volunteer" },
  },
  { timestamps: true },
);

// Setting index on location as 2dsphere using Geographic queries
parcelSchema.index({ location: "2dsphere" });

const Parcel = model<IParcel & Document>("Parcel", parcelSchema);

export { Parcel, IParcel };
