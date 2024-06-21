import express, { Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";
import { UserAuthRoutes } from "./app/modules/userAuth/userAuth.routes";

// app
const app = express();

//parsers
app.use(express.json());

// application routes
app.use("/api/auth/", UserAuthRoutes);

//Not Found
app.use(notFound);

// global error handler
app.use(globalErrorHandler);

// test route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
