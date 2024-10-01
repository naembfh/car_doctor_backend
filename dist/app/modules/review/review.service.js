"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const review_model_1 = require("./review.model");
// Create a review
const createReview = (userId, reviewData) => __awaiter(void 0, void 0, void 0, function* () {
    const newReview = yield review_model_1.Review.create({
        user: userId,
        comment: reviewData.comment,
        rating: reviewData.rating,
    });
    return newReview;
});
// Show reviews (optionally filter by user or rating)
const showReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield review_model_1.Review.find()
            .populate({
            path: "user",
            select: "_id name email img", // Make sure to select the img field if present
        })
            .exec();
        // Format the data before sending the response
        const formattedReviews = reviews.map((review) => {
            var _a, _b, _c;
            return ({
                _id: review._id,
                username: ((_a = review.user) === null || _a === void 0 ? void 0 : _a.name) || "Anonymous", // Typecast to 'any' or create a user interface for better type-checking
                email: ((_b = review.user) === null || _b === void 0 ? void 0 : _b.email) || "N/A",
                img: ((_c = review.user) === null || _c === void 0 ? void 0 : _c.img) || "/default-avatar.png", // Add a fallback image
                comment: review.comment,
                rating: review.rating,
                createdAt: review.createdAt,
            });
        });
        return formattedReviews;
    }
    catch (error) {
        console.error("Error fetching reviews:", error);
        throw new Error("Unable to fetch reviews");
    }
});
exports.ReviewService = {
    createReview,
    showReviews,
};
