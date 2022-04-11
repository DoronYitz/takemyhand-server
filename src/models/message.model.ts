import { Schema, model, Document } from "mongoose";

interface IMessage {
  /**
   * Arrived boolean
   * @example true,false
   */
  arrived: boolean;
  /**
   * Message content
   * @example 'Parcel for "Herbert Samuel 55" has arrived'
   */
  content: string;
  /**
   * Message timestamp
   */
  date: Date;
}

const messageSchema = new Schema(
  {
    arrived: { type: Boolean, required: true },
    content: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: false, versionKey: false },
);

const Message = model<IMessage & Document>("Message", messageSchema);

export { Message, IMessage };
