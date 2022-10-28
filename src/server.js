import express, { Router } from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import userRouter from "./apis/Users/index.js";
import authRouter from "./auth/auth.js";
import productRouter from "./apis/Products/index.js";
import cartRouter from "./apis/Carts/index.js";
import orderRouter from "./apis/Order/index.js";
import {
  badRequestHandler,
  forbiddenHandler,
  unauthorizedHandler,
  notFoundHandler,
  catchAllHandler,
} from "./errorHandler.js";

const server = express();

const port = process.env.PORT || 3001;

//MIDDLEWARES
server.use(express.json());
server.use(cors());

//ROUTES
server.use("/auth", authRouter);
server.use("/users", userRouter);
server.use("/products", productRouter);
server.use("/carts", cartRouter);
server.use("/orders", orderRouter);

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
