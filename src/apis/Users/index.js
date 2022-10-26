import express from "express";
import userModel from "./model.js";
import createError from "http-errors";
import { JWTMiddleware } from "../../auth/token.js";

const userRouter = express.Router();

userRouter.put("/:userId", JWTMiddleware, async (req, res, next) => {
  try {
    const user = await userModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!user) {
      next(createError(404, `User with id ${req.params.userId} not found!`));
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
});

export default userRouter;
