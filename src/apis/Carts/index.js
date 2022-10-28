import express from "express";
import cartModel from "./model.js";
import createError from "http-errors";
import { JWTMiddleware } from "../../auth/token.js";

const cartRouter = express.Router();

//CRUD ENDPOINTS

//Create Cart
cartRouter.post("/", JWTMiddleware, async (req, res, next) => {
  try {
    const newCart = new cartModel(req.body);
    const savedCart = await newCart.save();
    res.send(savedCart);
  } catch (error) {
    next(error);
  }
});

// Modify Cart
cartRouter.put("/:cartId", JWTMiddleware, async (req, res, next) => {
  try {
    const updatedCart = await cartModel.findByIdAndUpdate(
      req.params.cartId,
      {
        $set: req.body,
      },
      { new: true, runValidators: true }
    );
    if (!updatedCart) {
      next(createError(404, `Product with id ${req.params.cartId} not found!`));
    } else {
      res.send(updatedCart);
    }
  } catch (error) {
    next(error);
  }
});

//delete cart
cartRouter.delete("/:cartId", JWTMiddleware, async (req, res, next) => {
  try {
    await cartModel.findByIdAndDelete(req.params.cartId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// //GET User Cart
cartRouter.get("/:userId", JWTMiddleware, async (req, res, next) => {
  try {
    const carts = await cartModel.findOne({ userId: req.params.userId });
    res.send(carts);
  } catch (error) {
    next(error);
  }
});

// GET ALL

cartRouter.get("/", JWTMiddleware, async (req, res, next) => {
  try {
    const cart = await cartModel.find();
    res.send(cart);
  } catch (error) {
    next(error);
  }
});

export default cartRouter;
