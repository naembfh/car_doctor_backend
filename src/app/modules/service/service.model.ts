import { CallbackError, Schema, model } from "mongoose";
import slugify from "slugify"; // Use slugify package to create slugs
import { Slot } from "../slot/slot.model";
import { TService } from "./service.interface";

// Define the Service schema
const serviceSchema = new Schema<TService>(
  {
    id: { type: String, unique: true }, 
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true }, 
    description: { type: String, required: true },
    img: { type: String }, 
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

// Pre-save hook to handle dynamic id and slug creation
serviceSchema.pre("save", async function (next) {
  const service = this as any;

  // If it's a new service (not an update), generate a string ID and slug
  if (service.isNew) {
    // Generate a unique string ID (can be UUID or based on some logic)
    service.id = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    console.log(service.id);
  }

  // Create a slug from the service name combined with the string id
  service.slug = slugify(`${service.name}-${service.id}`, {
    lower: true,
    strict: true,
  });
  console.log(service.slug);

  // Ensure the service name is unique
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

// Pre-update hook to check if the service is being deleted, and delete associated slots
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

// Pre-delete hook to delete associated slots when a service is deleted
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
