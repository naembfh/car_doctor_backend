"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const review_routes_1 = require("./app/modules/review/review.routes");
const service_routes_1 = require("./app/modules/service/service.routes");
const userAuth_routes_1 = require("./app/modules/userAuth/userAuth.routes");
// app
const app = (0, express_1.default)();
// cors
app.use((0, cors_1.default)({
    origin: "https://charming-jelly-d59934.netlify.app",
    credentials: true,
}));
//parsers
app.use(express_1.default.json());
// application routes
app.use("/api/auth/", userAuth_routes_1.UserAuthRoutes);
app.use("/api", service_routes_1.ServicesRoutes);
app.use("/api/review", review_routes_1.ReviewRoutes);
//Not Found
app.use(notFound_1.default);
// global error handler
app.use(globalErrorhandler_1.default);
// test route
app.get("/", (req, res) => {
    res.send("Hello World!");
});
exports.default = app;
