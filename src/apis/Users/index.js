import express from "express";
import userModel from "./model.js";
import createError from "http-errors";
import { JWTMiddleware, adminOnlyMiddleware } from "../../auth/token.js";

const userRouter = express.Router();

//USER STATS
userRouter.get(
  "/stats",
  JWTMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
      const data = await userModel.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.send(data);
    } catch (error) {
      next(error);
    }
  }
);

userRouter.put("/:userId", JWTMiddleware, async (req, res, next) => {
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.userId,
      {
        $set: req.body,
      },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      next(createError(404, `User with id ${req.params.userId} not found!`));
    } else {
      res.send(updatedUser);
    }
  } catch (error) {
    next(error);
  }
});

//delete
userRouter.delete("/:userId", JWTMiddleware, async (req, res, next) => {
  try {
    await userModel.findByIdAndDelete(req.params.userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// get user admin only
userRouter.get(
  "/:userId",
  JWTMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      const users = await userModel.findById(req.params.userId);
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);

//GET ALL USERS
userRouter.get(
  "/",
  JWTMiddleware,
  adminOnlyMiddleware,
  async (req, res, next) => {
    const query = req.query.new;
    try {
      const users = query
        ? await userModel.find().sort({ _id: -1 }).limit(5)
        : await userModel.find();
      res.send(users);
    } catch (error) {
      next(error);
    }
  }
);

export default userRouter;
