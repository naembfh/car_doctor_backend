import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
let server: Server;

async function main() {
  try {
    console.log(config.database_url);
    await mongoose.connect(
      "mongodb+srv://naembfh:rDnl3Hdkq5hAz0bx@cluster0.nk62lkb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    server = app.listen(config.port, () => {
      console.log(`app is listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();

process.on("unhandledRejection", () => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
