import { Schema, model, Document } from "mongoose";

interface IEvent {
  /**
   * Event title
   * @example 'Rosh Ha Shana'
   */
  title: string;
  /**
   * Event category
   * @example 'Packaging day'
   */
  category: string;
  /**
   * @example 'It will be fun'
   */
  description: string;
  /**
   * Date of the event
   */
  date: Date;
  /**
   * Is an active event, only one event can be active at a time
   */
  active: boolean;
  /**
   * Event secret password used for the drivers to login in the event if its active
   */
  secret: string;
}

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    secret: { type: String, required: true },
    active: { type: Boolean, default: false },
  },
  { timestamps: false, versionKey: false },
);

const Event = model<IEvent & Document>("Event", eventSchema);
export { Event, IEvent };
