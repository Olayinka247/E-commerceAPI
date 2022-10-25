import express from "express";
import userModel from "./model.js";
import createError from "http-errors";
import { JWTMiddleware, JWTMiddlewareAdmin } from "../../auth/token.js";

const userRouter = express.Router();

userRouter.put("/", (req, res, next) => {
  res.send("get all users");
});

export default userRouter;
