import { Schema, model } from "mongoose";
import { TService } from "./service.interface";

const serviceSchema = new Schema<TService>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

serviceSchema.pre("save", async function (next) {
  const service = this;
  const existingService = await Service.findOne({
    name: service.name,
    _id: { $ne: service._id },
    isDeleted: false,
  });

  if (existingService) {
    const error = new Error("Service with this name already exists.");
    return next(error);
  }

  next();
});

// Create the model
export const Service = model<TService>("Service", serviceSchema);
