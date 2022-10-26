import express, { Router } from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import {
  badRequestHandler,
  forbiddenHandler,
  unauthorizedHandler,
  notFoundHandler,
  catchAllHandler,
} from "./errorHandler.js";
import userRouter from "./apis/Users/index.js";
import authRouter from "./auth/auth.js";

const server = express();

const port = process.env.PORT || 3001;

//MIDDLEWARES
server.use(express.json());
server.use(cors());

//ROUTES
server.use("/users", userRouter);
server.use("/auth", authRouter);

//ERRORHANDLERS
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(forbiddenHandler);
server.use(unauthorizedHandler);
server.use(catchAllHandler);

mongoose.connect(process.env.MONGO_CONNECTION_LINK);

mongoose.connection.on("connected", () => {
  console.log("Server Successfully Connected to MongoDB");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server running on port ${port}`);
  });
});

server.on("ERROR", (error) => {
  console.log("CONTROLED ERROR", error);
});
