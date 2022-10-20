import express from "express";
import createError from "http-errors";
import userModel from "../apis/Users/model.js";
import { generateAccessToken } from "../auth/tools.js";
import { JWTMiddleware, JWTMiddlewareAdmin } from "../auth/token.js";

const authRouter = express.Router();

//REGISTER
authRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new userModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({ _id });
  } catch (err) {
    next(err);
  }
});

//LOGIN

authRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.checkCredentials(username, password);
    if (!user) {
      next(createError(401, "invalid Credentials"));
    } else {
      const accessToken = await generateAccessToken({
        _id: user._id,
      });
      res.status(200).json({ accessToken });
    }
  } catch (err) {
    next(err);
  }
});

export default authRouter;
