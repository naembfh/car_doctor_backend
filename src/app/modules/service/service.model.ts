import { CallbackError, Schema, model } from "mongoose";
import { Slot } from "../slot/slot.model";
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

serviceSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as { isDeleted?: boolean };

  if (update?.isDeleted === true) {
    try {
      const service = await this.model.findOne(this.getQuery());
      if (service) {
        await Slot.deleteMany({ service: service._id });
      }
      next();
    } catch (err) {
      next(err as CallbackError);
    }
  } else {
    next();
  }
});

serviceSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      await Slot.deleteMany({ service: this._id });
      next();
    } catch (err) {
      next(err as CallbackError);
    }
  }
);

// Create the model
export const Service = model<TService>("Service", serviceSchema);
