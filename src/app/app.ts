import * as dotenv from "dotenv";
dotenv.config();
import { StatusCodes } from "http-status-codes";

import express from "express";
import http from "http";

import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { connectDB } from "./utils/util.js";
import route from "./router/index.js";
import socketServer from './socketServer.js';

const app = express();
const server = http.createServer(app);

socketServer.attach(server);

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "production") {
  app.use(helmet());
  app.use(compression());
}

app.use(mongoSanitize());
app.use(helmet());

app.get("/", (req, res) => {
  res.json({
    sucess: true,
    message: "Welcome to Niyo Task Service api",
    httpStatusCode: StatusCodes.OK,
    service: process.env.SERVICE_NAME as string,
  });
});
// USE ROUTES
app.use(route);

import { errorHandlerMiddleware } from "./middleware/error-handler.js";
import { handleNotFound } from "./middleware/not-found.js";

app.use(handleNotFound);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT;

server.listen(PORT, async () => {
  try {
    await connectDB(process.env.MONGO_URI as string);
    console.log(`Socket Server running on port ${PORT}`);
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
});
