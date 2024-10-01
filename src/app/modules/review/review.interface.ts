import { Types } from "mongoose";

export interface TReview {
  user: Types.ObjectId;
  comment: string;
  rating: number;
  createdAt?: Date;
}
