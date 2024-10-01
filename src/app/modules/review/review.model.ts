import { Schema, model } from "mongoose";
import { TReview } from "./review.interface";

// Define the schema
const reviewSchema = new Schema<TReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Review = model<TReview>("Review", reviewSchema);
