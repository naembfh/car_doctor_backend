"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const userAuth_routes_1 = require("./app/modules/userAuth/userAuth.routes");
// app
const app = (0, express_1.default)();
//parsers
app.use(express_1.default.json());
// application routes
app.use("/api/auth/", userAuth_routes_1.UserAuthRoutes);
//Not Found
app.use(notFound_1.default);
// global error handler
app.use(globalErrorhandler_1.default);
// test route
app.get("/", (req, res) => {
    res.send("Hello World!");
});
exports.default = app;
