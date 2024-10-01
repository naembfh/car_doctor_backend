"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
// Route to create a review (protected route)
router.post("/create", (0, auth_1.default)(["admin", "user"]), review_controller_1.ReviewController.createReview);
// Route to show reviews (can be public or restricted by role)
router.get("/show", review_controller_1.ReviewController.showReviews);
exports.ReviewRoutes = router;
