import express from "express";
import createError from "http-errors";

const userRouter = express.Router();

userRouter.get("/", (req, res, next) => {
  res.send("get all users");
});

export default userRouter;
