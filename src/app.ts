import cors from "cors";
import express, { Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";
import { ReviewRoutes } from "./app/modules/review/review.routes";
import { ServicesRoutes } from "./app/modules/service/service.routes";
import { UserAuthRoutes } from "./app/modules/userAuth/userAuth.routes";

// app
const app = express();

// cors
app.use(
  cors({
    origin: "https://charming-jelly-d59934.netlify.app",
    credentials: true,
  })
);
//parsers
app.use(express.json());

// application routes
app.use("/api/auth/", UserAuthRoutes);
app.use("/api", ServicesRoutes);
app.use("/api/review", ReviewRoutes);

//Not Found
app.use(notFound);

// global error handler
app.use(globalErrorHandler);

// test route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
