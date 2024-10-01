import { Types } from "mongoose";
import { TReview } from "./review.interface";
import { Review } from "./review.model";

// Create a review
const createReview = async (
  userId: Types.ObjectId,
  reviewData: Partial<TReview>
) => {
  const newReview = await Review.create({
    user: userId,
    comment: reviewData.comment,
    rating: reviewData.rating,
  });

  return newReview;
};

// Show reviews (optionally filter by user or rating)
const showReviews = async () => {
  try {
    const reviews = await Review.find()
      .populate({
        path: "user",
        select: "_id name email img", // Make sure to select the img field if present
      })
      .exec();

    // Format the data before sending the response
    const formattedReviews = reviews.map((review) => ({
      _id: review._id,
      username: (review.user as any)?.name || "Anonymous", 
      email: (review.user as any)?.email || "N/A",
      img: (review.user as any)?.img || "/default-avatar.png", 
      rating: review.rating,
      createdAt: review.createdAt,
    }));

    return formattedReviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Unable to fetch reviews");
  }
};

export const ReviewService = {
  createReview,
  showReviews,
};
