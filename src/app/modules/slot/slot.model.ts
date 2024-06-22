import { Schema, model } from "mongoose";
import { Tslot } from "./slot.interface";

const slotSchema = new Schema<Tslot>(
  {
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: {
      type: String,
      enum: ["available", "booked", "canceled"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

// slotSchema.pre("save", async function (next) {
//   const slot = this as Document & Tslot;

//   // Check for overlapping slots
//   const overlappingSlot = await (slot.constructor as Model<Tslot>).findOne({
//     service: slot.service,
//     date: slot.date,
//     $or: [
//       { startTime: { $lt: slot.endTime }, endTime: { $gt: slot.startTime } },
//       { startTime: { $gte: slot.startTime, $lt: slot.endTime } },
//       { endTime: { $gt: slot.startTime, $lte: slot.endTime } },
//     ],
//   });

//   if (overlappingSlot) {
//     throw new AppError(
//       httpStatus.CONFLICT,
//       `A slot already exists for the specified time range on ${overlappingSlot.date} from ${overlappingSlot.startTime} to ${overlappingSlot.endTime}`
//     );
//   }

//   next();
// });

export const Slot = model<Tslot>("Slot", slotSchema);
